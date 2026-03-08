export type UserRole =
  | 'participant'
  | 'mentor'
  | 'program_admin'
  | 'executive_viewer'
  | 'platform_operator';

export type CurrentUser = {
  userId: string;
  fullName: string;
  role: UserRole;
};
