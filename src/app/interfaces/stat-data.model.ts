import { User } from './user.model';

export interface StatData {
  users: User[];
  currentPage: number;
  totalPages: number;
}
