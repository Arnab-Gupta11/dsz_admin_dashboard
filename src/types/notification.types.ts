export interface AppNotification {
  id: string;
  userId: string;
  type: 'payment_success' | 'course_progress' | 'new_ebook' | 'new_course' | 'user_registered';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
