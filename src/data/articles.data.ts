import { ArticleItem } from '../types';

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Demystifying Zero-Knowledge Proofs in Decentralized Education Credentialing',
    slug: 'demystifying-zero-knowledge-proofs',
    excerpt: 'How zk-SNARKs and cryptographic verification allow universities to issue tamper-proof digital transcripts without exposing private student identities.',
    content: `
### Introduction to Cryptographic Verification in Modern Higher Ed

Modern universities face an escalating challenge in issuing verifiable, tamper-evident degree certifications and exam records. Traditional physical certificates are prone to forgery, and centralized digital validation databases present single points of failure and significant privacy liabilities.

### The Role of Zero-Knowledge Proofs (zk-SNARKs)

Zero-knowledge proofs (ZKPs) allow a prover to demonstrate mathematically to a verifier that a statement is true, without revealing any information beyond the statement's validity. 

\`\`\`
[Student Proof Generator] ---> [ZKP Proof String] ---> [Employer Verifier Contract]
           |                                                      |
    (Has GPA >= 3.5)                                       (Valid = True)
\`\`\`

In the context of the **WitBase Educational Protocol**, zk-SNARKs are applied across three critical domains:

1. **Selective Grade Disclosure**: A candidate can prove they scored in the 95th percentile on an algorithms certification exam without exposing their exact marks or exam date.
2. **Institutional Accreditations**: Institutions issue cryptographic assertions tied to root public keys rather than sending raw student records over unsecured email.
3. **Decentralized Exam Integrity**: Timestamps of live proctored submissions are anchored to distributed ledgers to guarantee submissions occurred before official cutoffs.

### Looking Ahead

As academic networks transition to decentralized identity frameworks, client-side proof generation inside standard WebAssembly runtimes will become standard practice for every certified learner.
    `,
    author: {
      id: 'auth-1',
      name: 'Dr. Tanvir Ahmed',
      role: 'Professor of Computational Systems',
      avatarUrl: ''
    },
    category: 'Cryptography & Web3',
    tags: ['zk-proofs', 'cryptography', 'security', 'credentials'],
    accessPolicy: 'FREE',
    hasPin: false,
    publishedAt: '2026-11-03T10:00:00Z',
    readTime: '6 min read',
    likes: 342,
    views: 2400
  },
  {
    id: 'art-2',
    title: 'Designing Resilient Microservices with Optimistic Versioning and Fast-Retry Interceptors',
    slug: 'designing-resilient-microservices',
    excerpt: 'A comprehensive architectural breakdown of handling lost updates, idempotent mutations, and automatic token refresh interceptors in distributed web platforms.',
    content: `
### The Concurrency Problem in Modern Educational Platforms

When thousands of learners submit exam answers or authors update collaborative curriculums simultaneously, distributed web backends encounter classic lost update anomalies.

\`\`\`ts
// Optimistic Lock Query Pattern
UPDATE study_resources 
SET title = $1, version = version + 1
WHERE id = $2 AND version = $3;
\`\`\`

### Why Optimistic Locking Beats Pessimistic Locking in Read-Heavy Apps

In modern educational systems, read traffic outpaces write traffic by orders of magnitude (often 50:1). Pessimistic locking creates database connection contention and lock escalation during peak exam windows.

Optimistic locking relies on an integer \`version\` column:
- Every query retrieves the current entity along with its \`version\`.
- Any mutation sends \`{ version }\` back to the server.
- The server checks if the row version still matches. If it does, the version increments atomically.
- If it does not match, the request immediately rejects with \`409 Conflict\`.

### Client-Side Automatic Refresh Interceptors

When an access token expires mid-exam or during an upload, client HTTP interceptors must queue in-flight requests, refresh the session token asynchronously, and replay original requests seamlessly without interrupting the user.
    `,
    author: {
      id: 'auth-2',
      name: 'Arifur Rahman',
      role: 'Principal System Architect',
      avatarUrl: ''
    },
    category: 'Architecture',
    tags: ['architecture', 'concurrency', 'nestjs', 'database'],
    accessPolicy: 'FREE',
    hasPin: false,
    publishedAt: '2026-10-29T14:15:00Z',
    readTime: '8 min read',
    likes: 512,
    views: 4100
  },
  {
    id: 'art-3',
    title: 'High-Performance Live Exam Engines: WebSocket Autosaving and Zero-Loss Local Buffers',
    slug: 'high-performance-live-exam-engines',
    excerpt: 'Deep dive into zero-loss state persistence, Socket.IO heartbeat acknowledgments, and disaster recovery mechanics during network disconnects.',
    content: `
### Live Proctored Exam Reliability

During a competitive examination or high-stakes university final, network degradation must never result in lost candidate answers. 

Our dual-persistence architecture achieves resilient zero-loss test delivery:
1. **Immediate Local Buffer**: Every keystroke or radio selection writes immediately to an immutable \`localStorage\` buffer with a monotonically increasing revision index.
2. **Debounced Realtime WebSocket Sync**: A background worker debounces network emissions over the \`/exam-live\` WebSocket namespace.
3. **Server Heartbeat & ACK**: Upon server confirmation, the local revision marker updates. If disconnected, a visual recovery banner alerts the candidate while local state continues recording safely.
    `,
    author: {
      id: 'auth-3',
      name: 'Sadia Islam',
      role: 'Lead Infrastructure Engineer',
      avatarUrl: ''
    },
    category: 'Realtime Systems',
    tags: ['websockets', 'realtime', 'state-management', 'exams'],
    accessPolicy: 'FREE',
    hasPin: false,
    publishedAt: '2026-10-21T09:30:00Z',
    readTime: '5 min read',
    likes: 289,
    views: 1950
  }
];

