import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function DashBoard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in"); // Redirect if not logged in
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return redirect("/"); // Redirect non-admins
  }
  return (
    
      
      <div className="right w-full flex gap-2 justify-center items-center">
       

        <div className="p-4">
          <h1 className="text-xl font-semibold text-slate-500 page-title">
            Welcome TO ADMIN DASHBOARD
          </h1>
        </div>
      </div>
    
  );
}

export default DashBoard;
