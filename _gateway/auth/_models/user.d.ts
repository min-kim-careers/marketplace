
export interface User {
  id: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  userMetadata?: Record<string, any>;
}
