export interface UpcomingExamItem {
  id: string;
  title: string;
  timeRemaining: string;
  visibility: 'Public' | 'Private' | string;
}
