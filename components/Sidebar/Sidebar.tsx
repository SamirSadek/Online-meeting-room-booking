import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <nav className="bg-white w-1/4 h-screen flex flex-col gap-1 border-r border-slate-100">
      <div className="border-[1px] mb-5 shadow-md">
        <div className="scale-150 flex justify-center mt-20">
          <UserButton />
        </div>
        <div className=" text-2xl font-bold text-center h-16 flex items-center justify-center">
          Admin Dashboard
        </div>
      </div>

      <ul className="px-6 space-y-2">
        <li className="border-[1px] rounded-sm">
          <Link
            className="block px-4 py-2.5 text-slate-800 font-semibold  hover:bg-emerald-950 hover:text-white rounded-lg"
            href="/dashboard/all-rooms"
          >
            Manage Rooms
          </Link>
        </li>
        <li className="border-[1px] rounded-sm">
          <Link
            className="block px-4 py-2.5 text-slate-800 font-semibold  hover:bg-emerald-950 hover:text-white rounded-lg"
            href="/dashboard/add-room"
          >
            Add New Rooms
          </Link>
        </li>

        <li className="border-[1px] rounded-sm">
          <Link
            className="block px-4 py-2.5 text-slate-800 font-semibold hover:bg-emerald-950 hover:text-white rounded-lg"
            href="/dashboard/bookings"
          >
            Manage Bookings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
