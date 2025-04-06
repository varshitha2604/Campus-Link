// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
//   startAfter,
//   DocumentData,
//   QueryDocumentSnapshot,
//   QuerySnapshot,
//   // arrayContains
// } from "firebase/firestore";
// import { Search, User, Mail, School, BookOpen, Code } from "lucide-react";
// import Link from "next/link";

// type Student = {
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
//   skills: string[];
//   interests: string[];
//   achievements: string[];
// };

// export default function StudentSearch() {
//   const searchParams = useSearchParams();
//   const urlSearchQuery = searchParams.get('q');
//   const urlSkillQuery = searchParams.get('skill');

//   const [searchTerm, setSearchTerm] = useState(urlSearchQuery || "");
//   const [skillFilter, setSkillFilter] = useState(urlSkillQuery || "");
//   const [searchResults, setSearchResults] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [noResults, setNoResults] = useState(false);
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [allResultsLoaded, setAllResultsLoaded] = useState(false);
//   const [popularSkills, setPopularSkills] = useState<string[]>([]);

//   // Execute search when component mounts if there's a query parameter
//   useEffect(() => {
//     if (urlSearchQuery || urlSkillQuery) {
//       searchStudents(urlSearchQuery || "", urlSkillQuery || "");
//     }
//     fetchPopularSkills();
//   }, [urlSearchQuery, urlSkillQuery]);

//   const fetchPopularSkills = async () => {
//     try {
//       const skillsQuery = query(
//         collection(db, "skills"),
//         orderBy("count", "desc"),
//         limit(10)
//       );

//       const skillsSnapshot = await getDocs(skillsQuery);
//       const skills = skillsSnapshot.docs.map(doc => doc.id);
//       setPopularSkills(skills);
//     } catch (error) {
//       console.error("Error fetching popular skills:", error);
//     }
//   };

//   const searchStudents = async (term: string, skill: string = "") => {
//     if (!term.trim() && !skill.trim()) {
//       setSearchResults([]);
//       setNoResults(false);
//       return;
//     }

//     setLoading(true);
//     setNoResults(false);

//     try {
//       // Format the term for case-insensitive search
//       const searchTermLower = term.toLowerCase();
//       const studentsRef = collection(db, "students");
//       let snapshots: QuerySnapshot<DocumentData>[] = [];

//       if (term.trim()) {
//         // Perform name and email search
//         const firstNameQuery = query(
//           studentsRef,
//           where("firstName_lower", ">=", searchTermLower),
//           where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("firstName_lower"),
//           limit(10)
//         );

//         const lastNameQuery = query(
//           studentsRef,
//           where("lastName_lower", ">=", searchTermLower),
//           where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("lastName_lower"),
//           limit(10)
//         );

//         const emailQuery = query(
//           studentsRef,
//           where("email_lower", ">=", searchTermLower),
//           where("email_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("email_lower"),
//           limit(10)
//         );

//         // Execute queries
//         const [firstNameSnapshot, lastNameSnapshot, emailSnapshot] = await Promise.all([
//           getDocs(firstNameQuery),
//           getDocs(lastNameQuery),
//           getDocs(emailQuery)
//         ]);

//         snapshots = [firstNameSnapshot, lastNameSnapshot, emailSnapshot];
//       }

//       // Add skill search if a skill filter is provided
//       if (skill.trim()) {
//         const skillQuery = query(
//           studentsRef,
//           where("skills", "array-contains", skill.trim()),
//           limit(10)
//         );

//         const skillSnapshot = await getDocs(skillQuery);
//         snapshots.push(skillSnapshot);
//       }

//       // Combine and deduplicate results
//       const studentsMap = new Map<string, Student>();

//       // Process results from all queries
//       const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
//         snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           if (!studentsMap.has(doc.id)) {
//             const data = doc.data();
//             studentsMap.set(doc.id, {
//               id: doc.id,
//               firstName: data.firstName,
//               lastName: data.lastName,
//               email: data.email,
//               studentId: data.studentId,
//               college: data.college || {
//                 name: data.branch || "",
//                 department: data.branch || "",
//                 year: data.year || ""
//               },
//               skills: data.skills || [],
//               interests: data.interests || [],
//               achievements: data.achievements || []
//             });
//           }
//         });
//       };

//       snapshots.forEach(snapshot => processSnapshot(snapshot));

//       const results = Array.from(studentsMap.values());

//       setSearchResults(results);
//       setNoResults(results.length === 0);

//       // Store the last visible document for pagination
//       if (results.length > 0 && snapshots.length > 0) {
//         // Find the last doc from all queries
//         let lastDoc = null;
//         for (const snapshot of snapshots) {
//           if (snapshot.docs.length > 0) {
//             lastDoc = snapshot.docs[snapshot.docs.length - 1];
//             break;
//           }
//         }
//         setLastVisible(lastDoc);
//         setAllResultsLoaded(results.length < 10);
//       } else {
//         setLastVisible(null);
//         setAllResultsLoaded(true);
//       }
//     } catch (error) {
//       console.error("Error searching students:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMoreResults = async () => {
//     if ((!searchTerm.trim() && !skillFilter.trim()) || !lastVisible || loadingMore || allResultsLoaded) return;

//     setLoadingMore(true);

//     try {
//       const searchTermLower = searchTerm.toLowerCase();
//       const studentsRef = collection(db, "students");
//       let snapshots: QuerySnapshot<DocumentData>[] = [];

//       if (searchTerm.trim()) {
//         const firstNameQuery = query(
//           studentsRef,
//           where("firstName_lower", ">=", searchTermLower),
//           where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("firstName_lower"),
//           startAfter(lastVisible),
//           limit(10)
//         );

//         const lastNameQuery = query(
//           studentsRef,
//           where("lastName_lower", ">=", searchTermLower),
//           where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("lastName_lower"),
//           startAfter(lastVisible),
//           limit(10)
//         );

//         const emailQuery = query(
//           studentsRef,
//           where("email_lower", ">=", searchTermLower),
//           where("email_lower", "<=", searchTermLower + "\uf8ff"),
//           orderBy("email_lower"),
//           startAfter(lastVisible),
//           limit(10)
//         );

//         const [firstNameSnapshot, lastNameSnapshot, emailSnapshot] = await Promise.all([
//           getDocs(firstNameQuery),
//           getDocs(lastNameQuery),
//           getDocs(emailQuery)
//         ]);

//         snapshots = [firstNameSnapshot, lastNameSnapshot, emailSnapshot];
//       }

//       // Add skill search if a skill filter is provided
//       if (skillFilter.trim()) {
//         const skillQuery = query(
//           studentsRef,
//           where("skills", "array-contains", skillFilter.trim()),
//           startAfter(lastVisible),
//           limit(10)
//         );

//         const skillSnapshot = await getDocs(skillQuery);
//         snapshots.push(skillSnapshot);
//       }

//       const studentsMap = new Map<string, Student>();

//       // Process new results and deduplicate with existing results
//       const existingIds = new Set(searchResults.map(student => student.id));

//       const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
//         snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           if (!existingIds.has(doc.id) && !studentsMap.has(doc.id)) {
//             const data = doc.data();
//             studentsMap.set(doc.id, {
//               id: doc.id,
//               firstName: data.firstName,
//               lastName: data.lastName,
//               email: data.email,
//               studentId: data.studentId,
//               college: data.college || {
//                 name: data.branch || "",
//                 department: data.branch || "",
//                 year: data.year || ""
//               },
//               skills: data.skills || [],
//               interests: data.interests || [],
//               achievements: data.achievements || []
//             });
//           }
//         });
//       };

//       snapshots.forEach(snapshot => processSnapshot(snapshot));

//       const newResults = Array.from(studentsMap.values());

//       if (newResults.length > 0) {
//         setSearchResults([...searchResults, ...newResults]);

//         // Find the last doc from all queries
//         let lastDoc = null;
//         for (const snapshot of snapshots) {
//           if (snapshot.docs.length > 0) {
//             lastDoc = snapshot.docs[snapshot.docs.length - 1];
//             break;
//           }
//         }

//         setLastVisible(lastDoc);
//         setAllResultsLoaded(newResults.length < 10);
//       } else {
//         setAllResultsLoaded(true);
//       }
//     } catch (error) {
//       console.error("Error loading more students:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     searchStudents(searchTerm, skillFilter);
//   };

//   const handleSkillClick = (skill: string) => {
//     setSkillFilter(skill);
//     searchStudents(searchTerm, skill);
//   };

//   const clearSkillFilter = () => {
//     // setSkillFilter("");
//     searchStudents(searchTerm, "");
//   };

//   return (
//     <div className="w-full">
//       <form onSubmit={handleSearch} className="mb-6">
//         <div className="relative mb-4">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="w-5 h-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Search students by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="absolute right-2.5 bottom-2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Search
//           </button>
//         </div>

//         <div className="mb-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Filter by skill:</label>
//           <div className="flex flex-wrap gap-2">
//             <input
//               type="text"
//               className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
//               placeholder="Enter a skill..."
//               value={skillFilter}
//               onChange={(e) => setSkillFilter(e.target.value)}
//             />
//           </div>
//         </div>

//         {skillFilter && (
//           <div className="mt-2">
//             <div className="flex items-center">
//               <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                 {skillFilter}
//                 <button
//                   onClick={clearSkillFilter}
//                   className="ml-1 text-indigo-600 hover:text-indigo-800"
//                 >
//                   ×
//                 </button>
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="mt-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Popular skills:</label>
//           <div className="flex flex-wrap gap-2">
//             {popularSkills.map((skill) => (
//               <button
//                 key={skill}
//                 type="button"
//                 onClick={() => handleSkillClick(skill)}
//                 className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-800"
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>
//         </div>
//       </form>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : noResults ? (
//         <div className="text-center py-10">
//           <p className="text-gray-500">
//             No students found {searchTerm ? `matching "${searchTerm}"` : ""}
//             {skillFilter ? ` with skill "${skillFilter}"` : ""}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {searchResults.map((student) => (
//             <div key={student.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md">
//               <Link href={`/dashboard/students/${student.id}`} className="block">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
//                       <User className="w-6 h-6 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-lg">
//                         {student.firstName} {student.lastName}
//                       </h3>
//                       <div className="flex flex-col text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Mail className="w-4 h-4 mr-1" />
//                           <span>{student.email}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <School className="w-4 h-4 mr-1" />
//                           <span>{student.college?.name || student.college?.department || "-"}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-2 md:mt-0 text-right">
//                     <div className="inline-flex items-center bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-700">
//                       <BookOpen className="w-4 h-4 mr-1" />
//                       <span>{student.college?.department || "-"}</span>
//                     </div>
//                     <div className="text-sm text-gray-500 mt-1">Year: {student.college?.year || "-"}</div>
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <div className="flex flex-wrap gap-1">
//                     {student.skills?.slice(0, 5).map((skill, index) => (
//                       <span
//                         key={index}
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           skill === skillFilter
//                             ? "bg-indigo-200 text-indigo-800"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         <Code className="w-3 h-3 inline mr-1" />
//                         {skill}
//                       </span>
//                     ))}
//                     {student.skills?.length > 5 && (
//                       <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
//                         +{student.skills.length - 5} more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}

//           {searchResults.length > 0 && !allResultsLoaded && (
//             <div className="text-center py-4">
//               <button
//                 onClick={loadMoreResults}
//                 disabled={loadingMore}
//                 className="bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {loadingMore ? (
//                   <span className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
//                     Loading...
//                   </span>
//                 ) : (
//                   "Load More"
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
//   startAfter,
//   DocumentData,
//   QueryDocumentSnapshot,
//   QuerySnapshot,
// } from "firebase/firestore";
// import { Search, User, Mail, School, BookOpen, Code } from "lucide-react";
// import Link from "next/link";

// type Student = {
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
//   skills: string[];
//   interests: string[];
//   achievements: string[];
// };

// export default function StudentSearch() {
//   const searchParams = useSearchParams();
//   const urlSearchQuery = searchParams.get("q");

//   const [searchTerm, setSearchTerm] = useState(urlSearchQuery || "");
//   const [searchResults, setSearchResults] = useState<Student[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [noResults, setNoResults] = useState(false);
//   const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [allResultsLoaded, setAllResultsLoaded] = useState(false);
//   const [popularSkills, setPopularSkills] = useState<string[]>([]);

//   // Execute search when component mounts if there's a query parameter
//   useEffect(() => {
//     if (urlSearchQuery) {
//       searchStudents(urlSearchQuery);
//     }
//     fetchPopularSkills();
//   }, [urlSearchQuery]);

//   const fetchPopularSkills = async () => {
//     try {
//       const skillsQuery = query(
//         collection(db, "skills"),
//         orderBy("count", "desc"),
//         limit(10)
//       );

//       const skillsSnapshot = await getDocs(skillsQuery);
//       const skills = skillsSnapshot.docs.map((doc) => doc.id);
//       setPopularSkills(skills);
//     } catch (error) {
//       console.error("Error fetching popular skills:", error);
//     }
//   };

//   const searchStudents = async (term: string) => {
//     if (!term.trim()) {
//       setSearchResults([]);
//       setNoResults(false);
//       return;
//     }

//     setLoading(true);
//     setNoResults(false);

//     try {
//       // Format the term for case-insensitive search
//       const searchTermLower = term.toLowerCase();
//       const studentsRef = collection(db, "students");
//       let snapshots: QuerySnapshot<DocumentData>[] = [];

//       // Perform name and email search
//       const firstNameQuery = query(
//         studentsRef,
//         where("firstName_lower", ">=", searchTermLower),
//         where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("firstName_lower"),
//         limit(10)
//       );

//       const lastNameQuery = query(
//         studentsRef,
//         where("lastName_lower", ">=", searchTermLower),
//         where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("lastName_lower"),
//         limit(10)
//       );

//       const emailQuery = query(
//         studentsRef,
//         where("email_lower", ">=", searchTermLower),
//         where("email_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("email_lower"),
//         limit(10)
//       );

//       // Add skill search
//       const skillQuery = query(
//         studentsRef,
//         where("skills", "array-contains", term.trim()),
//         limit(10)
//       );

//       // Execute queries
//       const [
//         firstNameSnapshot,
//         lastNameSnapshot,
//         emailSnapshot,
//         skillSnapshot,
//       ] = await Promise.all([
//         getDocs(firstNameQuery),
//         getDocs(lastNameQuery),
//         getDocs(emailQuery),
//         getDocs(skillQuery),
//       ]);

//       snapshots = [
//         firstNameSnapshot,
//         lastNameSnapshot,
//         emailSnapshot,
//         skillSnapshot,
//       ];

//       // Combine and deduplicate results
//       const studentsMap = new Map<string, Student>();

//       // Process results from all queries
//       const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
//         snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           if (!studentsMap.has(doc.id)) {
//             const data = doc.data();
//             studentsMap.set(doc.id, {
//               id: doc.id,
//               firstName: data.firstName,
//               lastName: data.lastName,
//               email: data.email,
//               studentId: data.studentId,
//               college: data.college || {
//                 name: data.branch || "",
//                 department: data.branch || "",
//                 year: data.year || "",
//               },
//               skills: data.skills || [],
//               interests: data.interests || [],
//               achievements: data.achievements || [],
//             });
//           }
//         });
//       };

//       snapshots.forEach((snapshot) => processSnapshot(snapshot));

//       const results = Array.from(studentsMap.values());

//       setSearchResults(results);
//       setNoResults(results.length === 0);

//       // Store the last visible document for pagination
//       if (results.length > 0 && snapshots.length > 0) {
//         // Find the last doc from all queries
//         let lastDoc = null;
//         for (const snapshot of snapshots) {
//           if (snapshot.docs.length > 0) {
//             lastDoc = snapshot.docs[snapshot.docs.length - 1];
//             break;
//           }
//         }
//         setLastVisible(lastDoc);
//         setAllResultsLoaded(results.length < 10);
//       } else {
//         setLastVisible(null);
//         setAllResultsLoaded(true);
//       }
//     } catch (error) {
//       console.error("Error searching students:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMoreResults = async () => {
//     if (!searchTerm.trim() || !lastVisible || loadingMore || allResultsLoaded)
//       return;

//     setLoadingMore(true);

//     try {
//       const searchTermLower = searchTerm.toLowerCase();
//       const studentsRef = collection(db, "students");
//       let snapshots: QuerySnapshot<DocumentData>[] = [];

//       const firstNameQuery = query(
//         studentsRef,
//         where("firstName_lower", ">=", searchTermLower),
//         where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("firstName_lower"),
//         startAfter(lastVisible),
//         limit(10)
//       );

//       const lastNameQuery = query(
//         studentsRef,
//         where("lastName_lower", ">=", searchTermLower),
//         where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("lastName_lower"),
//         startAfter(lastVisible),
//         limit(10)
//       );

//       const emailQuery = query(
//         studentsRef,
//         where("email_lower", ">=", searchTermLower),
//         where("email_lower", "<=", searchTermLower + "\uf8ff"),
//         orderBy("email_lower"),
//         startAfter(lastVisible),
//         limit(10)
//       );

//       const skillQuery = query(
//         studentsRef,
//         where("skills", "array-contains", searchTerm.trim()),
//         startAfter(lastVisible),
//         limit(10)
//       );

//       const [
//         firstNameSnapshot,
//         lastNameSnapshot,
//         emailSnapshot,
//         skillSnapshot,
//       ] = await Promise.all([
//         getDocs(firstNameQuery),
//         getDocs(lastNameQuery),
//         getDocs(emailQuery),
//         getDocs(skillQuery),
//       ]);

//       snapshots = [
//         firstNameSnapshot,
//         lastNameSnapshot,
//         emailSnapshot,
//         skillSnapshot,
//       ];

//       const studentsMap = new Map<string, Student>();

//       // Process new results and deduplicate with existing results
//       const existingIds = new Set(searchResults.map((student) => student.id));

//       const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
//         snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
//           if (!existingIds.has(doc.id) && !studentsMap.has(doc.id)) {
//             const data = doc.data();
//             studentsMap.set(doc.id, {
//               id: doc.id,
//               firstName: data.firstName,
//               lastName: data.lastName,
//               email: data.email,
//               studentId: data.studentId,
//               college: data.college || {
//                 name: data.branch || "",
//                 department: data.branch || "",
//                 year: data.year || "",
//               },
//               skills: data.skills || [],
//               interests: data.interests || [],
//               achievements: data.achievements || [],
//             });
//           }
//         });
//       };

//       snapshots.forEach((snapshot) => processSnapshot(snapshot));

//       const newResults = Array.from(studentsMap.values());

//       if (newResults.length > 0) {
//         setSearchResults([...searchResults, ...newResults]);

//         // Find the last doc from all queries
//         let lastDoc = null;
//         for (const snapshot of snapshots) {
//           if (snapshot.docs.length > 0) {
//             lastDoc = snapshot.docs[snapshot.docs.length - 1];
//             break;
//           }
//         }

//         setLastVisible(lastDoc);
//         setAllResultsLoaded(newResults.length < 10);
//       } else {
//         setAllResultsLoaded(true);
//       }
//     } catch (error) {
//       console.error("Error loading more students:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     searchStudents(searchTerm);
//   };

//   const handleSkillClick = (skill: string) => {
//     setSearchTerm(skill);
//     searchStudents(skill);
//   };

//   return (
//     <div className="w-full">
//       <form onSubmit={handleSearch} className="mb-6">
//         <div className="relative mb-4">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="w-5 h-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Search students by name, email, or skill..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="absolute right-2.5 bottom-2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             Search
//           </button>
//         </div>

//         <div className="mt-3">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Suggested skills:
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {popularSkills.map((skill) => (
//               <button
//                 key={skill}
//                 type="button"
//                 onClick={() => handleSkillClick(skill)}
//                 className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-800"
//               >
//                 {skill}
//               </button>
//             ))}
//           </div>
//         </div>
//       </form>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : noResults ? (
//         <div className="text-center py-10">
//           <p className="text-gray-500">
//             No students found {searchTerm ? `matching "${searchTerm}"` : ""}
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {searchResults.map((student) => (
//             <div
//               key={student.id}
//               className="bg-white rounded-lg shadow p-4 hover:shadow-md"
//             >
//               <Link
//                 href={`/dashboard/students/${student.id}`}
//                 className="block"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
//                       <User className="w-6 h-6 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-lg">
//                         {student.firstName} {student.lastName}
//                       </h3>
//                       <div className="flex flex-col text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Mail className="w-4 h-4 mr-1" />
//                           <span>{student.email}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <School className="w-4 h-4 mr-1" />
//                           <span>
//                             {student.college?.name ||
//                               student.college?.department ||
//                               "-"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-2 md:mt-0 text-right">
//                     <div className="inline-flex items-center bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-700">
//                       <BookOpen className="w-4 h-4 mr-1" />
//                       <span>{student.college?.department || "-"}</span>
//                     </div>
//                     <div className="text-sm text-gray-500 mt-1">
//                       Year: {student.college?.year || "-"}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <div className="flex flex-wrap gap-1">
//                     {student.skills?.slice(0, 5).map((skill, index) => (
//                       <span
//                         key={index}
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           skill === searchTerm
//                             ? "bg-indigo-200 text-indigo-800"
//                             : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         <Code className="w-3 h-3 inline mr-1" />
//                         {skill}
//                       </span>
//                     ))}
//                     {student.skills?.length > 5 && (
//                       <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
//                         +{student.skills.length - 5} more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           ))}

//           {searchResults.length > 0 && !allResultsLoaded && (
//             <div className="text-center py-4">
//               <button
//                 onClick={loadMoreResults}
//                 disabled={loadingMore}
//                 className="bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {loadingMore ? (
//                   <span className="flex items-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
//                     Loading...
//                   </span>
//                 ) : (
//                   "Load More"
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { Search, User, Mail, School, BookOpen, Code } from "lucide-react";
import Link from "next/link";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  college: {
    name: string;
    department: string;
    year: string;
  };
  skills: string[];
  interests: string[];
  achievements: string[];
};

export default function StudentSearch() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("q");

  const [searchTerm, setSearchTerm] = useState(urlSearchQuery || "");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allResultsLoaded, setAllResultsLoaded] = useState(false);
  const [popularSkills, setPopularSkills] = useState<string[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'skill'>('all');

  // Execute search when component mounts if there's a query parameter
  useEffect(() => {
    if (urlSearchQuery) {
      searchStudents(urlSearchQuery);
    }
    fetchPopularSkills();
  }, [urlSearchQuery]);

  const fetchPopularSkills = async () => {
    try {
      const skillsQuery = query(
        collection(db, "skills"),
        orderBy("count", "desc"),
        limit(10)
      );

      const skillsSnapshot = await getDocs(skillsQuery);
      const skills = skillsSnapshot.docs.map((doc) => doc.id);
      setPopularSkills(skills);
    } catch (error) {
      console.error("Error fetching popular skills:", error);
    }
  };

  const searchStudents = async (term: string, type: 'all' | 'skill' = 'all') => {
    if (!term.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setLoading(true);
    setNoResults(false);
    setSearchType(type);

    try {
      // Format the term for case-insensitive search
      const searchTermLower = term.toLowerCase();
      const studentsRef = collection(db, "students");
      const snapshots: QuerySnapshot<DocumentData>[] = [];

      if (type === 'all' || type === 'skill') {
        // Skill search is always performed
        console.log("Performing skill search for:", searchTermLower);

        // Try multiple approaches for skill search to handle different case formats
        const exactSkillQuery = query(
          studentsRef,
          where("skills", "array-contains", term.trim()),
          limit(10)
        );

        const lowerSkillQuery = query(
          studentsRef,
          where("skills", "array-contains", searchTermLower),
          limit(10)
        );

        const capitalizedSkillQuery = query(
          studentsRef,
          where("skills", "array-contains",
            term.trim().charAt(0).toUpperCase() + term.trim().slice(1).toLowerCase()),
          limit(10)
        );

        // For skills_lower field if it exists
        const skillsLowerQuery = query(
          studentsRef,
          where("skills_lower", "array-contains", searchTermLower),
          limit(10)
        );

        const [exactSkillSnapshot, lowerSkillSnapshot, capitalizedSkillSnapshot, skillsLowerSnapshot] =
          await Promise.all([
            getDocs(exactSkillQuery),
            getDocs(lowerSkillQuery),
            getDocs(capitalizedSkillQuery),
            getDocs(skillsLowerQuery).catch(() => ({
              docs: [],
              metadata: { hasPendingWrites: false, fromCache: false },
              query: skillsLowerQuery,
              size: 0,
              empty: true,
              docChanges: () => [],
              forEach: () => {}
            } as unknown as QuerySnapshot<DocumentData>))
          ]);

        snapshots.push(exactSkillSnapshot, lowerSkillSnapshot, capitalizedSkillSnapshot);

        // Only add skills_lower results if we got any (field might not exist)
        if (skillsLowerSnapshot.docs.length > 0) {
          snapshots.push(skillsLowerSnapshot);
        }

        console.log("Skill search results:",
          exactSkillSnapshot.docs.length,
          lowerSkillSnapshot.docs.length,
          capitalizedSkillSnapshot.docs.length,
          skillsLowerSnapshot.docs.length
        );
      }

      // Only perform name/email searches if we're doing a general search
      if (type === 'all') {
        // Perform name and email search
        const firstNameQuery = query(
          studentsRef,
          where("firstName_lower", ">=", searchTermLower),
          where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("firstName_lower"),
          limit(10)
        );

        const lastNameQuery = query(
          studentsRef,
          where("lastName_lower", ">=", searchTermLower),
          where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("lastName_lower"),
          limit(10)
        );

        const emailQuery = query(
          studentsRef,
          where("email_lower", ">=", searchTermLower),
          where("email_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("email_lower"),
          limit(10)
        );

        const [firstNameSnapshot, lastNameSnapshot, emailSnapshot] = await Promise.all([
          getDocs(firstNameQuery),
          getDocs(lastNameQuery),
          getDocs(emailQuery),
        ]);

        snapshots.push(firstNameSnapshot, lastNameSnapshot, emailSnapshot);
      }

      // Combine and deduplicate results
      const studentsMap = new Map<string, Student>();

      // Process results from all queries
      const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          if (!studentsMap.has(doc.id)) {
            const data = doc.data();
            studentsMap.set(doc.id, {
              id: doc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              studentId: data.studentId,
              college: data.college || {
                name: data.branch || "",
                department: data.branch || "",
                year: data.year || "",
              },
              skills: data.skills || [],
              interests: data.interests || [],
              achievements: data.achievements || [],
            });
          }
        });
      };

      snapshots.forEach((snapshot) => processSnapshot(snapshot));

      const results = Array.from(studentsMap.values());
      console.log("Total unique results:", results.length);

      setSearchResults(results);
      setNoResults(results.length === 0);

      // Store the last visible document for pagination
      if (results.length > 0 && snapshots.length > 0) {
        // Find the last doc from all queries
        let lastDoc = null;
        for (const snapshot of snapshots) {
          if (snapshot.docs.length > 0) {
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            break;
          }
        }
        setLastVisible(lastDoc);
        setAllResultsLoaded(results.length < 10);
      } else {
        setLastVisible(null);
        setAllResultsLoaded(true);
      }
    } catch (error) {
      console.error("Error searching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (!searchTerm.trim() || !lastVisible || loadingMore || allResultsLoaded)
      return;

    setLoadingMore(true);

    try {
      const searchTermLower = searchTerm.toLowerCase();
      const studentsRef = collection(db, "students");
      const snapshots: QuerySnapshot<DocumentData>[] = [];

      if (searchType === 'all' || searchType === 'skill') {
        // Similar multi-approach skill search for pagination
        const exactSkillQuery = query(
          studentsRef,
          where("skills", "array-contains", searchTerm.trim()),
          startAfter(lastVisible),
          limit(10)
        );

        const lowerSkillQuery = query(
          studentsRef,
          where("skills", "array-contains", searchTermLower),
          startAfter(lastVisible),
          limit(10)
        );

        const capitalizedSkillQuery = query(
          studentsRef,
          where("skills", "array-contains",
            searchTerm.trim().charAt(0).toUpperCase() + searchTerm.trim().slice(1).toLowerCase()),
          startAfter(lastVisible),
          limit(10)
        );

        const [exactSkillSnapshot, lowerSkillSnapshot, capitalizedSkillSnapshot] =
          await Promise.all([
            getDocs(exactSkillQuery),
            getDocs(lowerSkillQuery),
            getDocs(capitalizedSkillQuery)
          ]);

        snapshots.push(exactSkillSnapshot, lowerSkillSnapshot, capitalizedSkillSnapshot);

        // Try skills_lower if it exists
        try {
          const skillsLowerQuery = query(
            studentsRef,
            where("skills_lower", "array-contains", searchTermLower),
            startAfter(lastVisible),
            limit(10)
          );
          const skillsLowerSnapshot = await getDocs(skillsLowerQuery);
          snapshots.push(skillsLowerSnapshot);
        } catch {
          // If skills_lower doesn't exist, continue without it
        }
      }

      if (searchType === 'all') {
        const firstNameQuery = query(
          studentsRef,
          where("firstName_lower", ">=", searchTermLower),
          where("firstName_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("firstName_lower"),
          startAfter(lastVisible),
          limit(10)
        );

        const lastNameQuery = query(
          studentsRef,
          where("lastName_lower", ">=", searchTermLower),
          where("lastName_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("lastName_lower"),
          startAfter(lastVisible),
          limit(10)
        );

        const emailQuery = query(
          studentsRef,
          where("email_lower", ">=", searchTermLower),
          where("email_lower", "<=", searchTermLower + "\uf8ff"),
          orderBy("email_lower"),
          startAfter(lastVisible),
          limit(10)
        );

        const [firstNameSnapshot, lastNameSnapshot, emailSnapshot] = await Promise.all([
          getDocs(firstNameQuery),
          getDocs(lastNameQuery),
          getDocs(emailQuery),
        ]);

        snapshots.push(firstNameSnapshot, lastNameSnapshot, emailSnapshot);
      }

      const studentsMap = new Map<string, Student>();

      // Process new results and deduplicate with existing results
      const existingIds = new Set(searchResults.map((student) => student.id));

      const processSnapshot = (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          if (!existingIds.has(doc.id) && !studentsMap.has(doc.id)) {
            const data = doc.data();
            studentsMap.set(doc.id, {
              id: doc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              studentId: data.studentId,
              college: data.college || {
                name: data.branch || "",
                department: data.branch || "",
                year: data.year || "",
              },
              skills: data.skills || [],
              interests: data.interests || [],
              achievements: data.achievements || [],
            });
          }
        });
      };

      snapshots.forEach((snapshot) => processSnapshot(snapshot));

      const newResults = Array.from(studentsMap.values());

      if (newResults.length > 0) {
        setSearchResults([...searchResults, ...newResults]);

        // Find the last doc from all queries
        let lastDoc = null;
        for (const snapshot of snapshots) {
          if (snapshot.docs.length > 0) {
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
            break;
          }
        }

        setLastVisible(lastDoc);
        setAllResultsLoaded(newResults.length < 10);
      } else {
        setAllResultsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading more students:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchStudents(searchTerm);
  };

  const handleSkillClick = (skill: string) => {
    setSearchTerm(skill);
    // Specifically search only by skill when clicking a skill button
    searchStudents(skill, 'skill');
  };

  // Handle when a skill tag is clicked in student results
  const handleSkillTagClick = (e: React.MouseEvent, skill: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm(skill);
    searchStudents(skill, 'skill');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-3 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search students by name, email, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2.5 bottom-2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suggested skills:
          </label>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillClick(skill)}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-indigo-100 hover:text-indigo-800"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : noResults ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No students found {searchTerm ? `matching "${searchTerm}"` : ""}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {searchResults.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md"
            >
              <Link
                href={`/dashboard/search/${student.id}`}
                className="block"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">
                        {student.firstName} {student.lastName}
                      </h3>
                      <div className="flex flex-col text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center">
                          <School className="w-4 h-4 mr-1" />
                          <span>
                            {student.college?.name ||
                              student.college?.department ||
                              "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 text-right">
                    <div className="inline-flex items-center bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-700">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{student.college?.department || "-"}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Year: {student.college?.year || "-"}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {student.skills?.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
                          skill.toLowerCase() === searchTerm.toLowerCase()
                            ? "bg-indigo-200 text-indigo-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={(e) => handleSkillTagClick(e, skill)}
                      >
                        <Code className="w-3 h-3 inline mr-1" />
                        {skill}
                      </span>
                    ))}
                    {student.skills?.length > 5 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        +{student.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {searchResults.length > 0 && !allResultsLoaded && (
            <div className="text-center py-4">
              <button
                onClick={loadMoreResults}
                disabled={loadingMore}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg border border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {loadingMore ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
                    Loading...
                  </span>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}