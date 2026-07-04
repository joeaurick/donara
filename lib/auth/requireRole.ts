import { getUserRole } from "./getUserRole";

export async function requireRole(
  roles: string[]
) {
  const role = await getUserRole();

  if (!role) {
    return false;
  }

  return roles.includes(role);
}