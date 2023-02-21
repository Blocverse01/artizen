import React from "react";
import Header from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-app-dark">
      <Header />
      <main className="max-w-[94.5rem] px-5 lg:px-16 py-8 lg:py-14 mx-auto">
        {children}
      </main>
    </div>
  );
}
