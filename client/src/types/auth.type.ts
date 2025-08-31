import type { Role } from "./user.types";

export type Segment = "login" | "register";

export interface Login {
  userName: string;
  password: string;
}

export interface Register extends Login {
  repeatPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AccessDecodedToken {
  userId: string;
  userName: string;
  email: string;
  role: Role[];
  exp?: number;
  iat?: number;
}
