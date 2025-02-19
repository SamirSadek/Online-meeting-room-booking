"use client";

import Link from "next/link";
import { Button } from "../button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user } = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user data");
        
        const data = await res.json();
        setRole(data.role);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user]);

  return (
    <nav className="bg-gray-200 shadow shadow-gray-300 w-full px-8">
      <div className="md:h-16 h-28 mx-auto container flex items-center justify-between flex-wrap md:flex-nowrap">
        {/* Logo */}
        <div className="text-indigo-500 font-extrabold text-2xl">MeetSpot</div>

        {/* Navigation Links */}
        <div className="text-gray-500 w-full md:w-auto">
          <ul className="flex font-semibold space-x-6">
            <li className="hover:text-indigo-400">
              <Link href="/rooms">Rooms</Link>
            </li>
            <li className="hover:text-indigo-400">
              <Link href="/bookings">Bookings</Link>
            </li>
            {/* Only show Admin Dashboard for users with role 'admin' */}
            {role === "ADMIN" && (
              <li className="hover:text-indigo-400">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Authentication Buttons */}
        <div>
          {!user ? (
            <Button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center gap-2 font-bold">
              <Link href="/sign-in">Login</Link>
            </Button>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
