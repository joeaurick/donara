import { ReactNode } from "react";
import AdminLayout from "./AdminLayout";
import ProtectedLayout from "./ProtectedLayout";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedLayout>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedLayout>
  );
}