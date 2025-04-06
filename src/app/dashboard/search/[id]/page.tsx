// // // // src/app/dashboard/students/[id]/page.tsx




// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { User, Mail, Calendar, School, BookOpen, Award, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// type StudentProfile = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   studentId: string;
//   college: {
//     name: string;
//     department: string;
//     year: string;
//   };
//   createdAt: string;
// };

// // Updated type definition to match Next.js App Router expectations
// type Props = {
//   params: { id: string }
// }

// export default function StudentDetail({ params }: Props) {
//   // Create a local variable for the ID to avoid direct access to params.id
//   const id = params.id;

//   const [student, setStudent] = useState<StudentProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const studentDoc = await getDoc(doc(db, "students", id));

//         if (studentDoc.exists()) {
//           const data = studentDoc.data();
//           setStudent({
//             id: studentDoc.id,
//             firstName: data.firstName,
//             lastName: data.lastName,
//             email: data.email,
//             studentId: data.studentId,
//             college: data.college,
//             createdAt: data.createdAt
//           });
//         } else {
//           setError("Student not found");
//         }
//       } catch (error) {
//         console.error("Error fetching student:", error);
//         setError("Failed to load student data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error || !student) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6 text-center">
//         <div className="text-red-500 text-lg mb-4">{error}</div>
//         <button
//           onClick={() => router.back()}
//           className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="mb-6">
//         <Link
//           href="/dashboard/students"
//           className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> Back to Student Search
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="bg-indigo-600 p-6">
//           <div className="flex flex-col md:flex-row md:items-center">
//             <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mr-6">
//               <User className="w-10 h-10 text-indigo-600" />
//             </div>
//             <div className="mt-4 md:mt-0">
//               <h1 className="text-2xl font-bold text-white">
//                 {student.firstName} {student.lastName}
//               </h1>
//               <div className="flex items-center text-indigo-100 mt-1">
//                 <Mail className="w-4 h-4 mr-2" />
//                 <span>{student.email}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="font-medium text-lg mb-3 text-gray-700 border-b pb-2">
//                 Personal Information
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex items-start">
//                   <User className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
//                   <div>
//                     <div className="text-sm text-gray-500">Student ID</div>
//                     <div className="font-medium">{student.studentId}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Calendar className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
//                   <div>
//                     <div className="text-sm text-gray-500">Registration Date</div>
//                     <div className="font-medium">
//                       {new Date(student.createdAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="font-medium text-lg mb-3 text-gray-700 border-b pb-2">
//                 Academic Information
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex items-start">
//                   <School className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
//                   <div>
//                     <div className="text-sm text-gray-500">College/University</div>
//                     <div className="font-medium">{student.college.name}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <BookOpen className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
//                   <div>
//                     <div className="text-sm text-gray-500">Department/Major</div>
//                     <div className="font-medium">{student.college.department}</div>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Award className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
//                   <div>
//                     <div className="text-sm text-gray-500">Year of Study</div>
//                     <div className="font-medium">{student.college.year}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional sections can be added here */}
//           <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//             <h2 className="font-medium text-lg mb-3 text-gray-700 border-b pb-2">
//               Connected Activities
//             </h2>
//             <div className="py-4 text-center text-gray-500">
//               No activities found for this student
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/dashboard/students/[id]/page.tsx

import StudentDetailClient from './StudentDetailClient';

// Create a helper function that wraps params in a Promise
async function getParams(params: { id: string }): Promise<{ id: string }> {
  return params;
}

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  // Get params as a Promise to satisfy the constraint
  const paramsPromise = getParams(params);

  // Await the params
  const resolvedParams = await paramsPromise;

  // Pass the resolved id to the client component
  return <StudentDetailClient id={resolvedParams.id} />;
}