export interface User {
  id: string;
  email: string;
  name: string;
}

export type Visitor = Pick<User, 'name' | 'email'> & { password: string };
