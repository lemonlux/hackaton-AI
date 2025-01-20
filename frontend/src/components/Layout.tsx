import Navbar from "./navbar";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans antialiased">
      <Navbar />
      {children}
    </div>
  );
}
