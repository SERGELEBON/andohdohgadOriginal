import { type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[70px] lg:pt-[80px]">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
