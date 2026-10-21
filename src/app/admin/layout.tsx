import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Panel · Misión Académica Brasil 2027",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
