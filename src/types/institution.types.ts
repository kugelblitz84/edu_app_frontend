export type EnrollmentType = 'FREE' | 'PAID' | 'APPLICATION';
export type EnrollmentStatus = 'NOT_ENROLLED' | 'PENDING' | 'ENROLLED' | 'REJECTED';

export interface InstitutionItem {
  id: string;
  name: string;
  verified: boolean;
  description: string;
  courses: number;
  exams: number;
  badge: string;
  logoUrl?: string;
  coverUrl?: string;
  studentCount?: number;
  location?: string;
  website?: string;
  enrollmentType?: EnrollmentType;
  enrollmentFeeBDT?: number;
  isEnrolled?: boolean;
}
