import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo-500 tracking-widest font-bold title-font mb-1">
              SMART MEETING SPACES
            </h2>
            <h1 className="sm:text-3xl text-2xl font-bold title-font mb-4 text-gray-900">
              Book Meeting Rooms Seamlessly
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Find and book the perfect meeting room in seconds. Hassle-free scheduling, real-time availability, and seamless collaboration.
            </p>
          </div>
          <div className="flex flex-wrap">
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60 shadow-md">
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold title-font mb-2">
                Real-Time Availability
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Check live room availability and book instantly without conflicts.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60 ">
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold title-font mb-2">
                Seamless Scheduling
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Sync with your calendar and set up meetings effortlessly.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60 shadow-md">
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold title-font mb-2">
                Secure Access Control
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Manage user roles and permissions for organized bookings.
              </p>
            </div>
            <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
              <h2 className="text-lg sm:text-xl text-gray-900 font-bold title-font mb-2">
                Instant Notifications
              </h2>
              <p className="leading-relaxed text-base mb-4">
                Receive automated reminders and updates for your meetings.
              </p>
            </div>
          </div>
          <Link href="/rooms">
          <Button className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            Book a Meeting Room
          </Button></Link>
        </div>
      </section>
    </div>
  );
}
