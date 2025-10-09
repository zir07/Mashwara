export interface User {
  id: string;
  email: string;
  institutionId: string;
  role: 'student' | 'admin';
}
