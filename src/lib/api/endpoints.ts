export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health/status`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER_USER: `${API_BASE_URL}/auth/register/user`,
    REGISTER_INSTITUTION: `${API_BASE_URL}/auth/register/institution`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PASSWORD_RESET_REQUEST: `${API_BASE_URL}/auth/password-reset/request`,
    PASSWORD_RESET_CONFIRM: `${API_BASE_URL}/auth/password-reset/confirm`,
    PASSWORD_RESET_CHANGE: `${API_BASE_URL}/auth/password-reset/change`,
  },
  ME: {
    PROFILE: `${API_BASE_URL}/me/profile`,
    AVATAR_UPLOAD_URL: `${API_BASE_URL}/me/profile-picture/upload-url`,
    AVATAR_COMPLETE: `${API_BASE_URL}/me/profile-picture/complete`,
    HISTORY: `${API_BASE_URL}/exams/me/history`,
  },
  RESOURCES: {
    LIST: `${API_BASE_URL}/resources`,
    DETAIL: (id: string) => `${API_BASE_URL}/resources/${id}`,
    CREATE: `${API_BASE_URL}/resources`,
    UPLOADS: (id: string) => `${API_BASE_URL}/resources/${id}/uploads`,
    COMPLETE_UPLOAD: (id: string, fileId: string) => `${API_BASE_URL}/resources/${id}/uploads/${fileId}/complete`,
    PUBLISH: (id: string) => `${API_BASE_URL}/resources/${id}/publish`,
    UNLOCK: (id: string) => `${API_BASE_URL}/resources/${id}/unlock`,
    ACCESS: (id: string) => `${API_BASE_URL}/resources/${id}/access`,
  },
  COLLECTIONS: {
    LIST: `${API_BASE_URL}/resource-collections`,
    DETAIL: (id: string) => `${API_BASE_URL}/resource-collections/${id}`,
    CREATE: `${API_BASE_URL}/resource-collections`,
    ITEMS: (id: string) => `${API_BASE_URL}/resource-collections/${id}/items`,
    ITEM_ACCESS: (colId: string, resId: string) => `${API_BASE_URL}/resource-collections/${colId}/items/${resId}/access`,
    REORDER: (id: string) => `${API_BASE_URL}/resource-collections/${id}/items/order`,
    PUBLISH: (id: string) => `${API_BASE_URL}/resource-collections/${id}/publish`,
  },
  INSTITUTIONS: {
    LIST: `${API_BASE_URL}/institutions`,
    DETAIL: (id: string) => `${API_BASE_URL}/institutions/${id}`,
    ENROLL: (id: string) => `${API_BASE_URL}/institutions/${id}/enroll`,
    ENROLLMENT_STATUS: (id: string) => `${API_BASE_URL}/institutions/${id}/enrollment`,
  },
  EXAMS: {
    PUBLIC_LIST: `${API_BASE_URL}/exams/public`,
    DETAIL: (id: string) => `${API_BASE_URL}/exams/${id}`,
    ACCESS: (id: string) => `${API_BASE_URL}/exams/${id}/access`,
    START_ATTEMPT: (examId: string) => `${API_BASE_URL}/exams/${examId}/attempts`,
    GET_ATTEMPT: (attemptId: string) => `${API_BASE_URL}/exam-attempts/${attemptId}`,
    SUBMIT_ATTEMPT: (attemptId: string) => `${API_BASE_URL}/exam-attempts/${attemptId}/submit`,
    RESULT: (attemptId: string) => `${API_BASE_URL}/exam-attempts/${attemptId}/result`,
  },
  ARTICLES: {
    LIST: `${API_BASE_URL}/articles`,
    DETAIL: (id: string) => `${API_BASE_URL}/articles/${id}`,
    CREATE: `${API_BASE_URL}/articles`,
    UPDATE: (id: string) => `${API_BASE_URL}/articles/${id}`,
    SUBMIT_FOR_REVIEW: (id: string) => `${API_BASE_URL}/articles/${id}/submit-for-review`,
    ME: `${API_BASE_URL}/articles/me`,
    UNLOCK: (id: string) => `${API_BASE_URL}/articles/${id}/unlock`,
    ADMIN_PENDING: `${API_BASE_URL}/global-admin/articles/pending`,
    ADMIN_INSPECT: (id: string) => `${API_BASE_URL}/global-admin/articles/${id}`,
    ADMIN_RESPOND: (id: string) => `${API_BASE_URL}/global-admin/articles/${id}/respond`,
  },
  PAYMENTS: {
    INIT: `${API_BASE_URL}/payments`,
    SUCCESS: `${API_BASE_URL}/payments/success`,
    FAILURE: `${API_BASE_URL}/payments/failure`,
    CANCELLED: `${API_BASE_URL}/payments/cancelled`,
  }
};

