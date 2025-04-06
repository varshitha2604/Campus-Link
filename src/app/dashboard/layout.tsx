// // File: src/app/dashboard/layout.tsx
// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import {
//   Calendar,
//   Users,
//   FolderKanban,
//   HelpCircle,
//   Menu,
//   X,
//   Home,
//   LogOut,
//   Bell,
//   Search,
//   User,
//   // GraduationCap,
// } from "lucide-react";

// interface SidebarProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: SidebarProps) {
//   const { currentUser, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     // Check if user is authenticated
//     if (currentUser === null) {
//       router.push("/login");
//     } else {
//       setLoading(false);
//     }
//   }, [currentUser, router]);

//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth < 768);
//       setSidebarOpen(window.innerWidth >= 768);
//     };

//     checkScreenSize();
//     window.addEventListener("resize", checkScreenSize);

//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   // Extract search term from URL when component mounts
//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const queryParam = searchParams.get("q");
//     if (queryParam) {
//       setSearchQuery(queryParam);
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push("/login");
//     } catch (error) {
//       console.error("Failed to log out", error);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // Navigate to the students page with the search query
//       router.push(
//         `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   const menuItems = [
//     {
//       path: "/dashboard",
//       label: "Dashboard",
//       icon: <Home className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/search",
//       label: "Search",
//       icon: <Search className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/events",
//       label: "Events",
//       icon: <Calendar className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/groups",
//       label: "Groups",
//       icon: <Users className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/projects",
//       label: "Projects",
//       icon: <FolderKanban className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/profile",
//       label: "My Profile",
//       icon: <User className="w-5 h-5" />,
//     },
//     {
//       path: "/dashboard/faq",
//       label: "FAQ",
//       icon: <HelpCircle className="w-5 h-5" />,
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
//       >
//         <div className="flex items-center justify-between h-16 px-4 border-b">
//           <h1 className="text-xl font-bold text-indigo-600">Campus Connect</h1>
//           {isMobile && (
//             <button onClick={() => setSidebarOpen(false)} className="md:hidden">
//               <X className="w-6 h-6 text-gray-500" />
//             </button>
//           )}
//         </div>

//         <div className="px-4 py-6">
//           <div className="flex items-center space-x-3 mb-6 pb-6 border-b">
//             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
//               <User className="w-6 h-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="font-medium truncate">
//                 {currentUser?.email?.split("@")[0] || "User"}
//               </p>
//               <p className="text-xs text-gray-500 truncate">
//                 {currentUser?.email}
//               </p>
//             </div>
//           </div>

//           <nav className="space-y-1">
//             {menuItems.map((item) => (
//               <Link
//                 href={item.path}
//                 key={item.path}
//                 className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
//                   pathname === item.path ||
//                   (pathname?.startsWith(`${item.path}/`) &&
//                     !menuItems.some(
//                       (otherItem) =>
//                         otherItem.path !== item.path &&
//                         otherItem.path.startsWith(item.path) &&
//                         pathname.startsWith(otherItem.path)
//                     ))
//                     ? "bg-indigo-50 text-indigo-700"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <div className="absolute bottom-0 w-full border-t p-4">
//           <button
//             onClick={handleLogout}
//             className="flex items-center space-x-3 text-red-600 hover:text-red-800 w-full"
//           >
//             <LogOut className="w-5 h-5" />
//             <span>Log Out</span>
//           </button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top navigation */}
//         <header className="bg-white shadow-sm z-10">
//           <div className="flex items-center justify-between h-16 px-4">
//             <div className="flex items-center">
//               {isMobile && (
//                 <button onClick={() => setSidebarOpen(true)} className="mr-4">
//                   <Menu className="w-6 h-6 text-gray-500" />
//                 </button>
//               )}
//               <div className="relative w-64 md:w-80">
//                 <form onSubmit={handleSearch}>
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Search className="w-5 h-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="Search students..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   <button
//                     type="submit"
//                     className="absolute inset-y-0 right-0 flex items-center pr-3"
//                     aria-label="Search"
//                   >
//                     <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
//                       <Search className="w-4 h-4 text-gray-500" />
//                     </div>
//                   </button>
//                 </form>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <button className="relative p-2 text-gray-600 hover:text-gray-900 mr-4">
//                 <Bell className="w-6 h-6" />
//                 <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full">
//                   3
//                 </span>
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// File: src/app/dashboard/layout.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  FolderKanban,
  HelpCircle,
  Menu,
  X,
  Home,
  LogOut,
  // Bell,
  Search,
  User,
  // GraduationCap,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    if (currentUser === null) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [currentUser, router]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Extract search term from URL when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the students page with the search query
      router.push(
        `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      path: "/dashboard/search",
      label: "Search",
      icon: <Search className="w-5 h-5" />,
    },
    {
      path: "/dashboard/events",
      label: "Events",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: "/dashboard/groups",
      label: "Groups",
      icon: <Users className="w-5 h-5" />,
    },
    {
      path: "/dashboard/projects",
      label: "Projects",
      icon: <FolderKanban className="w-5 h-5" />,
    },
    // {
    //   path: "/dashboard/profile",
    //   label: "My Profile",
    //   icon: <User className="w-5 h-5" />,
    // },
    {
      path: "/dashboard/faq",
      label: "FAQ",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Campus Link</h1>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          )}
        </div>

        <div className="px-4 py-6">
          {/* Make the profile section clickable */}
          <Link href="/dashboard/profile" className="block">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium truncate">
                  {currentUser?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  pathname === item.path ||
                  (pathname?.startsWith(`${item.path}/`) &&
                    !menuItems.some(
                      (otherItem) =>
                        otherItem.path !== item.path &&
                        otherItem.path.startsWith(item.path) &&
                        pathname.startsWith(otherItem.path)
                    ))
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 hover:text-red-800 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              {isMobile && (
                <button onClick={() => setSidebarOpen(true)} className="mr-4">
                  <Menu className="w-6 h-6 text-gray-500" />
                </button>
              )}
              <div className="relative w-64 md:w-80">
                <form onSubmit={handleSearch}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label="Search"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                      <Search className="w-4 h-4 text-gray-500" />
                    </div>
                  </button>
                </form>
              </div>
            </div>
            <div className="flex items-center">
              {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 mr-4">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-red-500 rounded-full">
                  3
                </span>
              </button> */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
