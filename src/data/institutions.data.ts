import { InstitutionItem } from '../types';

export const TOP_INSTITUTIONS: InstitutionItem[] = [
  {
    id: 'inst-void',
    name: 'Void Pavilion',
    verified: true,
    description:
      'A prestigious cultivation institution dedicated to nurturing powerful martial artists and software architects through elite training and mastery tracks.',
    courses: 77,
    exams: 113,
    badge: 'VP',
    studentCount: 14200,
    location: 'Dhaka, Bangladesh',
    website: 'https://voidpavilion.edu',
    enrollmentType: 'FREE',
    isEnrolled: true
  },
  {
    id: 'inst-diu',
    name: 'Daffodil International University',
    verified: true,
    description:
      'Leading digital university in Bangladesh offering structured CSE, software engineering, and physics resource collections with verified faculty notes.',
    courses: 64,
    exams: 92,
    badge: 'DIU',
    studentCount: 28400,
    location: 'Ashulia, Dhaka',
    website: 'https://daffodilvarsity.edu.bd',
    enrollmentType: 'PAID',
    enrollmentFeeBDT: 1500,
    isEnrolled: false
  },
  {
    id: 'inst-stamford',
    name: 'Stamford University',
    verified: true,
    description:
      'Dedicated academic repository featuring peer-reviewed lecture handouts, laboratory manuals, and departmental certification prep tracks.',
    courses: 52,
    exams: 78,
    badge: 'SU',
    studentCount: 16800,
    location: 'Siddheswari, Dhaka',
    website: 'https://stamforduniversity.edu.bd',
    enrollmentType: 'APPLICATION',
    isEnrolled: false
  },
  {
    id: 'inst-ist',
    name: 'IST University',
    verified: true,
    description:
      'Institute of Science and Technology hub specializing in electronics, competitive programming archives, and engineering problem sets.',
    courses: 48,
    exams: 85,
    badge: 'IST',
    studentCount: 9200,
    location: 'Dhanmondi, Dhaka',
    website: 'https://ist.edu.bd',
    enrollmentType: 'FREE',
    isEnrolled: false
  },
  {
    id: 'inst-mit-open',
    name: 'OpenTech Academy',
    verified: true,
    description:
      'Global open-source computing foundation producing high-performance distributed systems curriculums, database internals, and Linux labs.',
    courses: 36,
    exams: 42,
    badge: 'OTA',
    studentCount: 35000,
    location: 'Global Virtual Campus',
    website: 'https://opentech.academy',
    enrollmentType: 'FREE',
    isEnrolled: false
  }
];
