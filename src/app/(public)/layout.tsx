// admin-dashboard\src\app\(publicPages)\layout.tsx
import type { Metadata } from "next";
import Navbar from "@/app/(public)/components/home/Navbar";
import Footer from "@/app/(public)/components/home/Footer";

export const metadata: Metadata = {
  title: "DevStudio - Professional Digital Solutions",
  description:
    "Crafting exceptional digital experiences with cutting-edge technology and creative solutions.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
