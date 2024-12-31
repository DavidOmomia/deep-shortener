export interface UserDTO {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
