export type PosUser = {
  id: number;
  fullname: string;
  username: string;
  password: string;
  role: "owner" | "manager" | "supervisor" | "cashier";
  is_active: boolean;
  created_at: string;
};