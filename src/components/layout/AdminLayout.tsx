import { type ReactNode } from "react";
import Header from "./Header";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50 pt-[70px] lg:pt-[80px]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </>
  );
}
