# EduApp Backend API & Feature Integration Documentation

This document provides a complete guide for frontend API integration and feature implementation. It covers all active REST endpoints, WebSocket namespaces, security protocols, and step-by-step compound business processes.

---

## 1. Global Integration Conventions

| Parameter | Specification | Notes |
| :--- | :--- | :--- |
| **Base URL** | `/api/v1` | All HTTP endpoints follow the global prefix and versioning. |
| **Realtime Gateway** | `wss://<host>/exam-live` | Socket.IO namespace for live exams. |
| **Default Content-Type** | `application/json` | Binary file uploads use direct storage pre-signed URLs. |
| **Auth Header** | `Authorization: Bearer <accessToken>` | Sent on all private and optional-auth endpoints. |
| **CORS Support** | `credentials: true` | Pre-configured for allowed client origins. |
| **Concurrency Control** | Optimistic locking via `version` | Mutations on materials and collections require the current entity version. |
| **Primary Keys** | RFC 4122 UUID v4 | All IDs across entities are standard UUIDs. |
| **Featured Curation** | `isFeatured: boolean` | Built into resources & collections (`is_featured` column); queryable via `?isFeatured=true` and curated by Global Admins. |

### Access Modes & Auth Types
- **Public (`@Public()`)**: Accessible without credentials.
- **Optional Auth (`@OptionalAuth()`)**: Accessible anonymously, but if an `Authorization` header is passed, the backend computes personalized viewer access permissions (e.g., whether the user has unlocked content or is enrolled).
- **Authenticated**: Requires a valid, unexpired Access Token.
- **Role-Restricted (`@Roles('GLOBAL_ADMIN')`)**: Requires platform-level permissions.

---

## 2. Compound Processes & Step-by-Step Feature Workflows

These workflows consolidate interactions across multiple endpoints to guide frontend feature implementations.

### Process A: Authentication & Token Lifecycle
```
[User Form] ---> POST /auth/login ---> { accessToken, refreshToken, user }
                                            |
[API Request] <--- Attach Bearer Token <----+
      |
[401 Unauthorized] ---> POST /auth/refresh (with refreshToken) ---> New Token Pair
      |
[Logout Button] ---> POST /auth/logout (Revokes active session)
```
1. **User Sign Up**: Client calls `POST /api/v1/auth/register/user` with `email`, `username`, and `password`. Returns created user details.
2. **Sign In**: Client calls `POST /api/v1/auth/login` with `username` and `password`. Receives `accessToken`, `refreshToken`, `expiresIn`, and `user` object.
3. **Session Maintenance**: When API calls return `401 Unauthorized`, the frontend interceptor calls `POST /api/v1/auth/refresh` sending `{ refreshToken }`. The backend rotates the refresh token and returns a new token pair.
4. **Sign Out**: User clicks logout; client calls `POST /api/v1/auth/logout` with Bearer token. Server revokes the session in Redis/database; client clears local tokens.

---

### Process B: Password Reset & Change
```
[Forgot Password] ---> POST /auth/password-reset/request (email sent)
                               |
[Email Reset Link] ---> User enters new password
                               |
[Submit New Pass] ---> POST /auth/password-reset/confirm { token, newPassword }
```
- **Forgot Password**: 
  1. User enters email at `POST /api/v1/auth/password-reset/request`.
  2. Backend sends a timed token link to user's email.
  3. User lands on reset page; frontend submits `POST /api/v1/auth/password-reset/confirm` with `token` and `newPassword`. All active sessions for the user are revoked.
- **Authenticated Password Change**:
  1. Signed-in user enters current and new password at `POST /api/v1/auth/password-reset/change`.
  2. If network/IP anomaly is detected, backend securely triggers an email confirmation; otherwise updates immediately and terminates other sessions.

---

### Process C: Avatar & Direct-to-Storage Uploads (3-Step Pattern)
To keep the backend lightweight and secure, files are uploaded directly to cloud storage (S3/GCS/MinIO) using pre-signed upload URLs.
```
1. Frontend ----------------> POST /me/profile-picture/upload-url
   { fileType, sizeBytes }     Returns: { uploadUrl, fileId, requiredHeaders }
2. Frontend ----------------> Direct PUT/POST to uploadUrl with raw binary
3. Frontend ----------------> POST /me/profile-picture/complete { fileId }
                               Backend verifies storage object & updates profile
```
1. **Obtain Upload Ticket**: Client calls `POST /api/v1/me/profile-picture/upload-url` with `{ fileType: 'image/png', sizeBytes: 1048576 }`. Backend returns `uploadUrl` and `fileId`.
2. **Direct Binary Upload**: Frontend issues an HTTP `PUT` (or configured method) directly to `uploadUrl` containing the file blob and matching headers.
3. **Finalize & Activate**: Frontend notifies backend via `POST /api/v1/me/profile-picture/complete` with `{ fileId }`. Backend validates file presence and attaches the URL to the user profile.

---

### Process D: Institution Registration, Approval & Student Enrollment
1. **Institution Registration**: A user creates an institution via `POST /api/v1/auth/register/institution` (status defaults to `PENDING`).
2. **Admin Review**: Global admin accesses pending requests at `GET /api/v1/global-admin/institutions/pending` and calls `PATCH /api/v1/global-admin/institutions/:id/respond` (`APPROVED` or `REJECTED`).
3. **Student Discovery**: Students search approved institutions at `GET /api/v1/institutions`.
4. **Enrollment Check**: Student queries `GET /api/v1/institutions/:id/enrollment` to check membership.
5. **Enrollment Action**:
   - If `FREE`: `POST /api/v1/institutions/:id/enroll` directly enrolls the student.
   - If `PAID`: Backend returns a `paymentSession` object with `checkoutUrl`. Student completes gateway payment or test simulation via `POST /api/v1/institutions/:id/enroll/dummy-pay`.
   - If `INVITE_ONLY` / `APPLICATION`: Request enters pending list. Institution admin views `GET /api/v1/institutions/:id/enrollment-requests` and approves/rejects via `PATCH /api/v1/institutions/:id/enrollment-requests/:userId`.

---

### Process E: Study Materials (Resources) Creation, PIN Protection & Access
Resources represent standalone study items (PDFs, Videos).
```
1. Create Draft:  POST /resources { title, accessPolicy: 'PURCHASE'|'FREE'|..., type: 'PDF' }
2. Get Upload:    POST /resources/:id/uploads { purpose: 'CONTENT', fileType, sizeBytes, version }
3. Direct Upload: PUT raw file to received uploadUrl
4. Confirm:       POST /resources/:id/uploads/:fileId/complete { version }
5. Publish:       POST /resources/:id/publish { version }
-----------------------------------------------------------------------------------
Consumer Access:
6. Inspect:       GET /resources/:id ---> accessDecision: { canAccess: false, reason: 'PIN_REQUIRED' }
7. Unlock:        POST /resources/:id/unlock { pin: "secret" } ---> Grant stored
8. Download/Play: POST /resources/:id/access ---> Returns short-lived signed media URL
```
- **Optimistic Locking**: Every mutation requires `{ version: number }`. When updating, the frontend sends the latest version; backend increments it atomically.
- **PIN Unlock**: For PIN-protected materials, clients prompt the user for the PIN and submit `POST /api/v1/resources/:id/unlock`. Once granted, subsequent requests evaluate `canAccess: true`.

---

### Process F: Resource Collections Management
Collections bundle multiple resources into a single organized curriculum.
1. **Create Collection**: `POST /api/v1/resource-collections` (starts in `DRAFT`).
2. **Upload Cover**: Call `POST /api/v1/resource-collections/:id/cover-uploads`, upload binary to pre-signed URL, then call `POST /api/v1/resource-collections/:id/cover-uploads/:fileId/complete`.
3. **Add Resources**: `POST /api/v1/resource-collections/:id/items` with `{ resourceId, position, version }`.
4. **Reorder Items**: `PUT /api/v1/resource-collections/:id/items/order` with `{ resourceIds: [...], version }`.
5. **Publish Collection**: `POST /api/v1/resource-collections/:id/publish` with `{ version }`.
6. **Consumer Delivery**: Users browse collection items via `GET /api/v1/resource-collections/:id/items`. To read a child resource within collection context, call `POST /api/v1/resource-collections/:id/items/:resourceId/access`.

---

### Process G: Article Drafting, Review & Reading
1. **Draft Article**: Author posts to `POST /api/v1/articles` (`accessPolicy: 'FREE' | 'PURCHASE'`; PIN required if `PURCHASE`).
2. **Edit Article**: Author updates draft content via `PATCH /api/v1/articles/:id`.
3. **Submit for Review**: Author submits via `POST /api/v1/articles/:id/submit-for-review` (status changes to `PENDING_REVIEW`).
4. **Admin Approval**: Global Admin inspects `GET /api/v1/global-admin/articles/:id` and reviews with `PATCH /api/v1/global-admin/articles/:id/respond` (`APPROVED` or `REJECTED`).
5. **Student Reading**: Public users browse `GET /api/v1/articles`. If an article is `PURCHASE` and locked, client calls `POST /api/v1/articles/:id/unlock` with PIN to read full content.

---

### Process H: Live Exams (Scheduling, WebSocket Realtime, Auto-Submit & Results)
```
[Admin]              [Candidate]                          [Server & Socket.IO]
   |                      |                                        |
Create & Schedule         |                                        |
(POST /exams/admin)       |                                        |
   |                      |                                        |
                      Start Attempt                                |
               (POST /exams/:id/attempts)                          |
                          |                                        |
                      Connect WS ---------------------------> Join Namespace /exam-live
                      attempt.join { attemptId } -----------> Room: attempt:<id>
                          |                                        |
                      Option Selected                              |
                      answer.save { qId, optIds, rev } -----> Autosaved & Synced
                          |                                        |
                      Click Submit                                 |
             (POST /exam-attempts/:id/submit) ---------------> Exam Finalized
                          |                                        |
                      View Result <--------------------------- attempt.graded
            (GET /exam-attempts/:id/result)
```
1. **Teacher Creates Exam**: 
   - `POST /api/v1/exams/admin/create` creates an exam draft.
   - `PATCH /api/v1/exams/admin/:id/schedule` sets duration, start/end windows, pass percentage, and questions with options and mark values.
   - For invite-only exams: `POST /api/v1/exams/admin/:id/invitations` generates candidate tokens.
2. **Candidate Enters Exam**:
   - `POST /api/v1/exams/:id/access` checks permission.
   - Candidate clicks "Start": `POST /api/v1/exams/:examId/attempts` returns `attemptId`, questions (without correct answers), duration, and end timestamp.
3. **Live WebSocket Sync**:
   - Client connects to `wss://<host>/exam-live` with Bearer auth.
   - Client emits `attempt.join` with `{ attemptId }`.
   - On question answer change: Client emits `answer.save` with `{ attemptId, questionId, answer: { selectedOptionIds }, revision }`. Answers are autosaved instantly.
4. **Crash Recovery**: If the candidate refreshes or loses connection, frontend calls `GET /api/v1/exam-attempts/:attemptId` to recover remaining seconds and previously recorded answers.
5. **Submission**:
   - Candidate clicks finish: `POST /api/v1/exam-attempts/:attemptId/submit`.
   - If time expires: The backend server timer emits `attempt.expired` over WebSocket and finalizes grading automatically.
6. **Results & History**:
   - Candidate retrieves immediate score breakdown via `GET /api/v1/exam-attempts/:attemptId/result`.
   - Candidates can review past attempts anytime via `GET /api/v1/exams/me/history`.

---

### Process I: Payment Processing (SSLCommerz)
1. **Initialize Session**: Client calls `POST /api/v1/payments` with customer information, amount, and transaction reference. Receives `GatewayPageURL`.
2. **Gateway Redirect**: Frontend navigates candidate to `GatewayPageURL` to pay.
3. **Gateway Callbacks & IPN**:
   - SSLCommerz hits server webhook `POST /api/v1/payments/ipn`.
   - Gateway redirects candidate browser to `POST /api/v1/payments/success`, `/failure`, or `/cancelled`.
   - The backend validates the payment signature directly with the gateway before granting course/institution access.

---

### Process J: Featured Content Showcase & Admin Curation
This workflow allows administrators to curate top-tier resources and collections for landing pages, hero banners, and spotlight sections.
```
[Global Admin] ---> PATCH /global-admin/resources/:id/featured { version, isFeatured: true }
                              |
                     Database: study_resources.is_featured = true
                              |
[Landing Page / App] ---> GET /resources?isFeatured=true&limit=6
                     ---> GET /resource-collections?isFeatured=true&limit=4
                     ---> GET /institutions/:id/resources?isFeatured=true
```
1. **Curating Featured Content (Admin Action)**:
   - Global Admin navigates to resource or collection management in the admin console.
   - Admin triggers the feature toggle via `PATCH /api/v1/global-admin/resources/:id/featured` (or `PATCH /api/v1/global-admin/resource-collections/:id/featured`) passing `{ version: number, isFeatured: boolean }`.
   - Alternatively, a Global Admin can pass `isFeatured: boolean` during standard updates (`PATCH /api/v1/resources/:id`). If a non-admin attempts this, the server returns `403 Forbidden`.
2. **Featured Content Fetching (Frontend Showcase)**:
   - **Homepage / Spotlight**: The frontend calls `GET /api/v1/resources?isFeatured=true&limit=6&sort=newest` to fetch high-visibility standalone materials.
   - **Curated Series**: The frontend calls `GET /api/v1/resource-collections?isFeatured=true&limit=4` for featured courses and bundles.
   - **Institution Spotlight**: The frontend calls `GET /api/v1/institutions/:institutionId/resources?isFeatured=true` to display the institution's premier highlighted resources.
   - **Response Entity**: Every `MaterialDto` returned contains `isFeatured: boolean`, allowing UI cards to render a "Featured" or "Spotlight" badge dynamically.

---

## 3. Complete Endpoint Reference Catalog

### 3.1. System Health
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health/status` | Public | Returns service and database operational health. Used for uptime monitoring and connectivity badges. |

---

### 3.2. Authentication & Session Management
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/user` | Public | **Register Student/User**: Body: `{ email, username, password }`. Used in registration forms. |
| `POST` | `/api/v1/auth/register/institution` | Auth | **Register Institution**: Body: `{ name, logo_url?, description? }`. Creates an institution in pending review. |
| `POST` | `/api/v1/auth/login` | Public | **Sign In**: Body: `{ username, password }`. Returns tokens (`accessToken`, `refreshToken`) and user profile. |
| `POST` | `/api/v1/auth/refresh` | Public | **Rotate Refresh Token**: Body: `{ refreshToken }`. Call automatically in axios/fetch interceptors on 401. |
| `POST` | `/api/v1/auth/logout` | Auth | **Sign Out**: Terminates server session associated with token. Frontend should clear local state upon success. |
| `POST` | `/api/v1/auth/password-reset/request` | Public | **Request Reset Email**: Body: `{ email }`. Dispatches password reset link to user email. |
| `POST` | `/api/v1/auth/password-reset/confirm` | Public | **Confirm Reset Token**: Body: `{ token, newPassword }`. Sets new password and revokes all old sessions. |
| `POST` | `/api/v1/auth/password-reset/change` | Auth | **Change Password**: Body: `{ currentPassword, newPassword }`. Used in user security settings. |

---

### 3.3. User Profiles & Avatar Storage
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/me` | Auth | **Get Current Profile**: Returns user profile (`id`, `username`, `email`, `fullName`, `avatarUrl`). |
| `PATCH` | `/api/v1/me/update` | Auth | **Update Profile**: Body: `{ username?, fullName?, avatarUrl? }`. |
| `POST` | `/api/v1/me/profile-picture/upload-url` | Auth | **Initiate Avatar Upload**: Body: `{ fileType, sizeBytes }`. Returns signed URL and `fileId`. |
| `POST` | `/api/v1/me/profile-picture/complete` | Auth | **Complete Avatar Upload**: Body: `{ fileId }`. Confirms file upload and binds new avatar URL. |
| `GET` | `/api/v1/profile/:username` | Public | **Public Profile**: Returns public bio (`username`, `fullName`, `avatarUrl`) for community pages. |

---

### 3.4. Institutions & Enrollments
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/institutions` | Public | **List Institutions**: Query: `?page=1&limit=20&search=keyword`. Directory of registered institutions. |
| `GET` | `/api/v1/institutions/:id` | Public | **Institution Detail**: Returns institution overview, logo, code, and enrollment type (`FREE`, `PAID`, `APPLICATION`). |
| `GET` | `/api/v1/institutions/:id/enrollment` | Auth | **Get User Enrollment Status**: Checks if current user is enrolled (`isEnrolled: boolean`, `status`). |
| `POST` | `/api/v1/institutions/:id/enroll` | Auth | **Join/Enroll**: Body: `{ simulatePayment?: boolean }`. Triggers enrollment or returns payment session. |
| `POST` | `/api/v1/institutions/:id/enroll/dummy-pay` | Auth | **Dev Payment Test**: Body: `{ paymentMethod?, transactionReference? }`. Simulates instant payment approval. |
| `GET` | `/api/v1/institutions/:id/enrollment-requests` | Auth (Admin) | **List Applications**: Returns pending user enrollment applications for institution staff. |
| `PATCH` | `/api/v1/institutions/:id/enrollment-requests/:userId` | Auth (Admin) | **Review Application**: Body: `{ status: 'APPROVED' \| 'REJECTED', note? }`. Approves or denies membership. |

---

### 3.5. Study Materials (Single Resources)
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/resources` | Auth | **Create Draft Resource**: Body: `{ title, type: 'PDF' \| 'VIDEO', accessPolicy: 'FREE' \| 'OWNER_ONLY' \| 'ENROLLED' \| 'PURCHASE', priceAmountMinor?, pin?, ... }`. Initial `isFeatured` defaults to `false`. |
| `GET` | `/api/v1/resources` | Optional | **Public Catalog**: Query: `?page=1&limit=20&search=&type=PDF\|VIDEO&accessPolicy=&isFeatured=true\|false&sort=newest\|oldest\|title`. Use `?isFeatured=true` for spotlight/hero showcases. |
| `GET` | `/api/v1/resources/:id` | Optional | **Resource Detail**: Returns metadata (including `isFeatured: boolean`) and calculated `accessDecision` (`canAccess: boolean`, `reason?`). |
| `PATCH` | `/api/v1/resources/:id` | Auth | **Edit Metadata/Policy**: Body: `{ version, title?, description?, accessPolicy?, priceAmountMinor?, isFeatured?, ... }`. *Note:* `isFeatured` can only be set here if the caller has role `GLOBAL_ADMIN`. |
| `POST` | `/api/v1/resources/:id/uploads` | Auth | **Request Upload Intent**: Body: `{ version, purpose: 'CONTENT' \| 'THUMBNAIL', fileType, sizeBytes }`. Returns signed URL. |
| `POST` | `/api/v1/resources/:id/uploads/:fileId/complete` | Auth | **Confirm Upload**: Body: `{ version }`. Verifies storage attachment. |
| `POST` | `/api/v1/resources/:id/publish` | Auth | **Publish Resource**: Body: `{ version }`. Transitions draft to public view. |
| `POST` | `/api/v1/resources/:id/archive` | Auth | **Archive Resource**: Body: `{ version }`. Removes from active catalog. |
| `POST` | `/api/v1/resources/:id/unarchive` | Auth | **Unarchive**: Body: `{ version }`. Returns resource to draft. |
| `DELETE` | `/api/v1/resources/:id` | Auth | **Delete Resource**: Body: `{ version }`. Soft-deletes resource. |
| `POST` | `/api/v1/resources/:id/unlock` | Auth | **PIN Unlock**: Body: `{ pin }`. Unlocks PIN-protected resource for current user. |
| `PUT` | `/api/v1/resources/:id/unlock-pin` | Auth | **Rotate PIN**: Body: `{ version, pin }`. Sets new PIN and invalidates past unlocks. |
| `DELETE` | `/api/v1/resources/:id/unlocks/:userId` | Auth | **Revoke Access**: Body: `{ version }`. Revokes PIN grant for specific user. |
| `GET` | `/api/v1/resources/:id/thumbnail` | Optional | **Thumbnail Link**: Returns short-lived signed image link. |
| `POST` | `/api/v1/resources/:id/access` | Optional | **Get Media Link**: Generates short-lived signed media stream/download URL. |
| `POST` | `/api/v1/resources/:id/preview` | Auth | **Owner Preview**: Generates signed media preview before publishing. |

---

### 3.6. Resource Collections
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/resource-collections` | Auth | **Create Collection**: Body: `{ title, description?, accessPolicy, pin?, ... }`. Initial `isFeatured` defaults to `false`. |
| `GET` | `/api/v1/resource-collections` | Optional | **Catalog**: Query: `?page=1&limit=20&search=&accessPolicy=&isFeatured=true\|false&sort=newest\|oldest\|title`. Use `?isFeatured=true` for featured course series. |
| `GET` | `/api/v1/resource-collections/:id` | Optional | **Collection Detail**: Metadata (including `isFeatured: boolean`) and computed access decision. |
| `PATCH` | `/api/v1/resource-collections/:id` | Auth | **Update Collection**: Body: `{ version, title?, accessPolicy?, isFeatured?, ... }`. *Note:* `isFeatured` can only be set here if the caller has role `GLOBAL_ADMIN`. |
| `POST` | `/api/v1/resource-collections/:id/cover-uploads` | Auth | **Cover Upload URL**: Body: `{ version, fileType, sizeBytes }`. |
| `POST` | `/api/v1/resource-collections/:id/cover-uploads/:fileId/complete` | Auth | **Confirm Cover**: Body: `{ version }`. Attaches verified cover. |
| `POST` | `/api/v1/resource-collections/:id/publish` | Auth | **Publish Collection**: Body: `{ version }`. |
| `POST` | `/api/v1/resource-collections/:id/archive` | Auth | **Archive Collection**: Body: `{ version }`. |
| `POST` | `/api/v1/resource-collections/:id/unarchive` | Auth | **Unarchive**: Body: `{ version }`. |
| `DELETE` | `/api/v1/resource-collections/:id` | Auth | **Delete**: Body: `{ version }`. |
| `POST` | `/api/v1/resource-collections/:id/unlock` | Auth | **Unlock Collection**: Body: `{ pin }`. Unlocks all materials inside collection. |
| `PUT` | `/api/v1/resource-collections/:id/unlock-pin` | Auth | **Rotate Collection PIN**: Body: `{ version, pin }`. |
| `DELETE` | `/api/v1/resource-collections/:id/unlocks/:userId` | Auth | **Revoke User Unlock**: Body: `{ version }`. |
| `GET` | `/api/v1/resource-collections/:id/cover` | Optional | **Cover Image Link**: Returns signed cover URL. |
| `GET` | `/api/v1/resource-collections/:id/items` | Optional | **List Items**: Query: `?page=1&limit=20`. Ordered resource list inside collection. |
| `POST` | `/api/v1/resource-collections/:id/items` | Auth | **Add Resource**: Body: `{ version, resourceId, position? }`. |
| `DELETE` | `/api/v1/resource-collections/:id/items/:resourceId` | Auth | **Remove Item**: Body: `{ version }`. Detaches resource from collection. |
| `PUT` | `/api/v1/resource-collections/:id/items/order` | Auth | **Reorder Items**: Body: `{ version, resourceIds: string[] }`. Atomic reorder. |
| `GET` | `/api/v1/resource-collections/:id/items/:resourceId` | Optional | **Item Detail**: Inspect child resource metadata in collection context. |
| `POST` | `/api/v1/resource-collections/:id/items/:resourceId/access` | Optional | **Item Delivery**: Returns signed delivery URL authorized via collection grant. |

---

### 3.7. Material Library & Context Feeds
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/me/resources` | Auth | **My Resources**: Query: `?page=1&limit=20&status=&isFeatured=true\|false`. List of materials created by current user. |
| `GET` | `/api/v1/me/resource-collections` | Auth | **My Collections**: Query: `?page=1&limit=20&status=&isFeatured=true\|false`. List of collections owned by current user. |
| `GET` | `/api/v1/institutions/:institutionId/resources` | Optional | **Institution Public Feed**: Query: `?page=1&limit=20&search=&type=&accessPolicy=&isFeatured=true\|false&sort=`. Combined feed of materials published by an institution. |
| `GET` | `/api/v1/institutions/:institutionId/resources/manage` | Auth (Admin) | **Institution Management**: Query: `?page=1&limit=20&status=&isFeatured=true\|false`. Admin view of all institution study materials. |

---

### 3.8. Articles / Editorial
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/articles` | Auth | **Create Article**: Body: `{ title, description?, content, accessPolicy: 'FREE' \| 'PURCHASE', pin?, tags?, coverImageUrl? }`. |
| `PATCH` | `/api/v1/articles/:id` | Auth | **Edit Draft**: Body: `{ title?, content?, accessPolicy?, pin?, ... }`. |
| `POST` | `/api/v1/articles/:id/submit-for-review` | Auth | **Submit to Review**: Transitions draft to `PENDING_REVIEW` for Global Admin. |
| `GET` | `/api/v1/articles/me` | Auth | **My Articles**: Paginated list of current author's articles across all states. |
| `GET` | `/api/v1/articles` | Optional | **Public Articles**: Query: `?page=1&limit=20&search=&tag=&policy=`. Reader feed. |
| `GET` | `/api/v1/articles/:id` | Optional | **Article Detail**: Returns content (body is locked/obfuscated if paid and unauthenticated). |
| `POST` | `/api/v1/articles/:id/unlock` | Auth | **Unlock Article**: Body: `{ pin }`. Unlocks paid article reading access. |

---

### 3.9. Global Admin Control Center
*All routes require `@Roles('GLOBAL_ADMIN')`.*
| Method | Endpoint | Description & Frontend Use |
| :--- | :--- | :--- |
| `GET` | `/api/v1/global-admin/institutions/pending` | List pending institution applications. |
| `GET` | `/api/v1/global-admin/institutions/responded-by-me` | History of institution decisions made by current admin. |
| `PATCH` | `/api/v1/global-admin/institutions/:id/respond` | Approve or reject institution application (`status: 'APPROVED' \| 'REJECTED'`). |
| `GET` | `/api/v1/global-admin/articles/pending` | Queue of submitted articles awaiting review. |
| `GET` | `/api/v1/global-admin/articles/responded-by-me` | History of article review decisions. |
| `GET` | `/api/v1/global-admin/articles/:id` | Full article preview for editorial validation. |
| `PATCH` | `/api/v1/global-admin/articles/:id/respond` | Approve/Publish or reject article (`status: 'APPROVED' \| 'REJECTED'`, `rejectReason`). |
| `PATCH` | `/api/v1/global-admin/resources/:id/featured` | **Set Resource Featured**: Body: `{ version: number, isFeatured: boolean }`. Atomically sets featured flag and returns updated resource `MaterialDto`. |
| `PATCH` | `/api/v1/global-admin/resource-collections/:id/featured` | **Set Collection Featured**: Body: `{ version: number, isFeatured: boolean }`. Atomically sets featured flag and returns updated collection `MaterialDto`. |

---

### 3.10. Exams Management & Scheduling (Admin / Teacher)
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/exams/admin/create` | Auth | **Create Exam**: Body: `{ name, description?, scope: 'PUBLIC' \| 'INSTITUTIONAL', institutionId?, accessMode: 'OPEN' \| 'INVITE_ONLY' }`. |
| `PATCH` | `/api/v1/exams/admin/:id/schedule` | Auth | **Schedule & Set Questions**: Body: `{ startsAt, closesAt, durationMinutes, maxAttempts, passPercentage?, questions: [{ question, options: string[], correctAnswer, markValue }] }`. |
| `PATCH` | `/api/v1/exams/admin/:id/metadata` | Auth | **Update Settings**: Adjust name, window, duration, or pass criteria. |
| `PATCH` | `/api/v1/exams/admin/:id/content` | Auth | **Update Content**: Body: `{ questions: [...] }`. Update questions prior to launch. |
| `POST` | `/api/v1/exams/admin/:id/invitations` | Auth | **Generate Tokens**: Body: `{ candidateEmails: string[] }`. Generates access tokens for invite-only exams. |

---

### 3.11. Exams Discovery & Student History
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/exams/public` | Public | **Public Exams Directory**: Query: `?page=1&limit=20&search=`. List open exams. |
| `GET` | `/api/v1/exams/institution/:institutionId` | Auth | **Institution Exams**: Returns exams accessible to student in a specific institution. |
| `POST` | `/api/v1/exams/:id/access` | Auth | **Check Eligibility**: Body: `{ invitationToken? }`. Verifies if user can sit for the exam. |
| `GET` | `/api/v1/exams/me/history` | Auth | **My Exam History**: Query: `?page=1&limit=20`. List past exam attempts and scores. |
| `GET` | `/api/v1/exams/me/history/:attemptId` | Auth | **My Attempt Review**: Detailed review of answers, grades, and pass/fail status. |
| `GET` | `/api/v1/exams/users/:userId/history` | Auth | **Candidate History**: Teacher view of a student's past attempts. |
| `GET` | `/api/v1/exams/users/:userId/history/:attemptId` | Auth | **Candidate Attempt Detail**: Teacher audit of student answers and score. |

---

### 3.12. Live Exam Sitting & Real-Time Sync
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/exams/:examId/attempts` | Auth | **Start Official Attempt**: Body: `{ invitationToken? }`. Generates live attempt session and timer. |
| `POST` | `/api/v1/exams/:examId/attempt/practice` | Auth | **Start Practice Run**: Starts an unranked practice test without consuming formal attempts. |
| `GET` | `/api/v1/exam-attempts/:attemptId` | Auth | **Recover Active Attempt**: Returns remaining seconds, question paper, and current saved answers. |
| `POST` | `/api/v1/exam-attempts/:attemptId/submit` | Auth | **Final Submission**: Manually submit exam paper and trigger instant evaluation. |
| `GET` | `/api/v1/exam-attempts/:attemptId/result` | Auth | **Get Attempt Results**: Retrieves final score, percentage, and detailed question breakdown. |

#### Realtime WebSocket Gateway
- **Namespace**: `/exam-live`
- **Auth**: Pass JWT in connection auth: `io('/exam-live', { auth: { token: '<accessToken>' } })`
- **Client Emits**:
  - `attempt.join`: `{ attemptId: string }`
  - `answer.save`: `{ attemptId: string, questionId: string, answer: { selectedOptionIds: string[] }, revision: number }`
- **Server Events**:
  - `attempt.expired`: Triggered automatically when server-side timer expires.
  - `attempt.submitted`: Triggered on exam submission.
  - `attempt.graded`: Emitted when evaluation is completed.

---

### 3.13. Payment Gateway (SSLCommerz)
| Method | Endpoint | Auth | Description & Frontend Use |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments` | Auth | **Initialize Payment**: Body: `{ transactionId, amount, currency: 'BDT', productName, customer: { name, email, phone, ... } }`. Returns `GatewayPageURL`. |
| `POST` | `/api/v1/payments/ipn` | Public | **IPN Webhook**: Server-to-server callback from SSLCommerz for asynchronous verification. |
| `POST` | `/api/v1/payments/success` | Public | **Success Callback**: User browser return destination after successful payment. |
| `POST` | `/api/v1/payments/failure` | Public | **Failure Callback**: Browser redirection upon declined payment. |
| `POST` | `/api/v1/payments/cancelled` | Public | **Cancellation Callback**: Browser redirection upon user cancellation. |
