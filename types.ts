export interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

export interface UserContext {
  email: string;
  token: string | null;
}

export type InputType = 'text' | 'password' | 'email';