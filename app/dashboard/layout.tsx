import Sidebar from "@/components/Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex  w-full">
        {/* Sidebar */}
        <Sidebar/>
  
        {/* Main Content */}
        <div className="flex h-screen items-center justify-center w-3/4  mx-auto ">
            {children}
        </div>
      </div>
    );
  }
  