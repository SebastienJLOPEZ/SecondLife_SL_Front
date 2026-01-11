import type { Metadata } from 'next';
import ProtectedRoute from '@/components/protectedRoute/protectedRoute';
// import Navbar from "@/components/navbar/navbar";
// import Header from "@/components/header/header";

export const metadata: Metadata = {
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <ProtectedRoute>
      {/* <Header /> */}
      {children}
      {/* <Navbar /> */}
    </ProtectedRoute>
  );
}