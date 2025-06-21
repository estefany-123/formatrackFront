import { Outlet } from "react-router-dom";
import Sidebar from "@/components/templates/sidebar";
import { Nav } from "@/components/templates/Navbar";
import { DarkMode } from "@/components/molecules/DarkMode";
import { useState } from "react";

export default function Layout() {
  const [, setIsNotifOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden dark:bg-zinc-900 text-black dark:text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-200 dark:bg-zinc-900 text-black dark:text-white">
        <Nav onOpenNotifications={() => setIsNotifOpen(true)}>
          <DarkMode />
        </Nav>
        <Outlet />
      </main>
    </div>
  );
}
