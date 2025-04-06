// "use client";

// import {
//   Book,
//   Calendar,
//   Search,
//   Tag,
//   Filter,
//   Clock,
//   ChevronRight,
//   User,
//   BookOpen,
// } from "lucide-react";

// export default function FAQBlogs() {
//   const blogPosts = [
//     {
//       id: 1,
//       title: "Getting Started with Student Projects",
//       excerpt: "Learn about the best practices for student project management and collaboration tools.",
//       category: "Guides",
//       author: "Alex Johnson",
//       publishDate: "March 15, 2025",
//       readTime: "5 min read",
//       tags: ["Projects", "Management", "Collaboration"]
//     },
//     {
//       id: 2,
//       title: "How to Apply for Project Funding",
//       excerpt: "A comprehensive guide on the process and requirements for securing funding for your campus projects.",
//       category: "Resources",
//       author: "Maria Rodriguez",
//       publishDate: "March 10, 2025",
//       readTime: "8 min read",
//       tags: ["Funding", "Resources", "Applications"]
//     },
//     {
//       id: 3,
//       title: "Project Showcase: Student Success Stories",
//       excerpt: "Highlighting exceptional student projects from the previous semester and their impact.",
//       category: "Showcase",
//       author: "David Chen",
//       publishDate: "March 5, 2025",
//       readTime: "6 min read",
//       tags: ["Success Stories", "Student Projects", "Showcase"]
//     },
//     {
//       id: 4,
//       title: "Frequently Asked Questions About Team Formation",
//       excerpt: "Answers to common questions about forming teams, finding members, and establishing roles.",
//       category: "FAQ",
//       author: "Priya Patel",
//       publishDate: "February 28, 2025",
//       readTime: "4 min read",
//       tags: ["Teams", "Collaboration", "FAQ"]
//     },
//     {
//       id: 5,
//       title: "Technology Resources Available on Campus",
//       excerpt: "Detailed information about tech resources, equipment, and software available for student projects.",
//       category: "Resources",
//       author: "James Wilson",
//       publishDate: "February 25, 2025",
//       readTime: "7 min read",
//       tags: ["Technology", "Resources", "Campus"]
//     },
//     {
//       id: 6,
//       title: "Project Deadlines and Important Dates",
//       excerpt: "Key dates and deadlines for the current semester's project submissions and presentations.",
//       category: "Announcements",
//       author: "Sarah Kim",
//       publishDate: "February 20, 2025",
//       readTime: "3 min read",
//       tags: ["Deadlines", "Calendar", "Important Dates"]
//     },
//   ];

//   const categories = ["All", "Guides", "Resources", "Showcase", "FAQ", "Announcements"];
//   const popularTags = ["Projects", "Resources", "Collaboration", "Technology", "Deadlines", "Teams"];

//   // Function to determine category color
//   const getCategoryColor = (category: string): string => {
//     switch (category) {
//       case "Guides":
//         return "text-blue-600 bg-blue-50";
//       case "Resources":
//         return "text-green-600 bg-green-50";
//       case "Showcase":
//         return "text-purple-600 bg-purple-50";
//       case "FAQ":
//         return "text-amber-600 bg-amber-50";
//       case "Announcements":
//         return "text-red-600 bg-red-50";
//       default:
//         return "text-gray-600 bg-gray-50";
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">FAQ & Resources</h1>
//           <p className="text-gray-600">
//             Guides, FAQs, and helpful resources for your projects
//           </p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search articles..."
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
//             />
//           </div>

//           <div className="flex gap-3">
//             <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
//               <option value="">Filter by Category</option>
//               {categories.map((category) => (
//                 <option key={category} value={category === "All" ? "" : category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
//               <Filter className="w-5 h-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>

//         <div className="p-4 border-t overflow-x-auto">
//           <div className="flex items-center">
//             <Tag className="w-4a h-4 text-gray-500 mr-2" />
//             <span className="text-gray-500 text-sm mr-3">Popular Tags:</span>
//             <div className="flex space-x-2">
//               {popularTags.map((tag) => (
//                 <button
//                   key={tag}
//                   className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Blog/FAQ Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         {blogPosts.map((post) => (
//           <div
//             key={post.id}
//             className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
//           >
//             <div className="p-4 border-b flex items-center justify-between">
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
//                   post.category
//                 )}`}
//               >
//                 {post.category}
//               </span>
//               <div className="flex items-center text-gray-500 text-sm">
//                 <Clock className="w-4 h-4 mr-1" />
//                 {post.readTime}
//               </div>
//             </div>
//             <div className="p-4">
//               <h3 className="font-semibold text-gray-800 text-lg mb-2">{post.title}</h3>
//               <p className="text-sm text-gray-600 mb-4">
//                 {post.excerpt}
//               </p>

//               <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
//                 <div className="flex items-center">
//                   <User className="w-4 h-4 mr-1" />
//                   {post.author}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   {post.publishDate}
//                 </div>
//               </div>

//               <div className="mb-4 flex flex-wrap gap-2">
//                 {post.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               <button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded text-sm flex items-center justify-center">
//                 <BookOpen className="w-4 h-4 mr-1" />
//                 Read Article
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* FAQ Section */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 border-b flex items-center">
//           <Book className="w-5 h-5 mr-2 text-indigo-600" />
//           <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
//         </div>
//         <div className="divide-y">
//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>How do I submit my project for review?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 Projects can be submitted through the online portal by clicking the &quot;Submit Project&quot; button on your project dashboard. You&apos;ll need to include a project summary, team member information, and any relevant documentation or files. All submissions must be completed by the semester deadline.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>What resources are available for project development?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 The university provides several resources including dedicated lab spaces, equipment borrowing services, software licenses, and mentorship programs. Visit the Resources section for a comprehensive list of available tools and how to access them.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>How can I find team members for my project?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 You can find potential team members through the Team Formation Forum, departmental bulletin boards, or by attending networking events. The campus also hosts a quarterly Project Team Matchmaking event where students can pitch ideas and connect with interested collaborators.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>Are there funding opportunities for student projects?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 Yes, the university offers several grant programs for student projects including the Innovation Fund, Sustainability Grants, and Department-Specific Research Awards. Applications typically open at the beginning of each semester. See our funding guide for application details and deadlines.
//               </p>
//             </div>
//           </details>
//         </div>
//       </div>

//       {/* Information Panel */}
//       <div className="bg-indigo-50 rounded-lg p-6 mb-6">
//         <h3 className="text-indigo-700 font-medium mb-2">About This Section</h3>
//         <p className="text-indigo-800 text-sm mb-4">
//           This page contains resources, guides, and frequently asked questions to help you with your projects. Articles are updated regularly with new information.
//         </p>
//         <div className="text-indigo-700 text-sm">
//           <p className="mb-1">• Comments and likes are disabled for all articles</p>
//           <p className="mb-1">• For questions, please contact the project support team</p>
//           <p>• New articles are published every Monday</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import {
//   Book,
//   Search,
//   Tag,
//   Filter,
//   ChevronRight,
// } from "lucide-react";

// export default function FAQ() {
//   const categories = ["All", "Guides", "Resources", "Showcase", "FAQ", "Announcements"];
//   const popularTags = ["Projects", "Resources", "Collaboration", "Technology", "Deadlines", "Teams"];

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">FAQ & Resources</h1>
//           <p className="text-gray-600">
//             Guides, FAQs, and helpful resources for your projects
//           </p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search FAQs..."
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
//             />
//           </div>

//           <div className="flex gap-3">
//             <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5">
//               <option value="">Filter by Category</option>
//               {categories.map((category) => (
//                 <option key={category} value={category === "All" ? "" : category}>
//                   {category}
//                 </option>
//               ))}
//             </select>

//             <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
//               <Filter className="w-5 h-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>

//         <div className="p-4 border-t overflow-x-auto">
//           <div className="flex items-center">
//             <Tag className="w-4 h-4 text-gray-500 mr-2" />
//             <span className="text-gray-500 text-sm mr-3">Popular Tags:</span>
//             <div className="flex space-x-2">
//               {popularTags.map((tag) => (
//                 <button
//                   key={tag}
//                   className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FAQ Section */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 border-b flex items-center">
//           <Book className="w-5 h-5 mr-2 text-indigo-600" />
//           <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
//         </div>
//         <div className="divide-y">
//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>How do I submit my project for review?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 Projects can be submitted through the online portal by clicking the &quot;Submit Project&quot; button on your project dashboard. You&apos;ll need to include a project summary, team member information, and any relevant documentation or files. All submissions must be completed by the semester deadline.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>What resources are available for project development?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 The university provides several resources including dedicated lab spaces, equipment borrowing services, software licenses, and mentorship programs. Visit the Resources section for a comprehensive list of available tools and how to access them.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>How can I find team members for my project?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 You can find potential team members through the Team Formation Forum, departmental bulletin boards, or by attending networking events. The campus also hosts a quarterly Project Team Matchmaking event where students can pitch ideas and connect with interested collaborators.
//               </p>
//             </div>
//           </details>

//           <details className="p-4 group cursor-pointer">
//             <summary className="flex justify-between items-center font-medium text-gray-800">
//               <span>Are there funding opportunities for student projects?</span>
//               <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//             </summary>
//             <div className="mt-3 text-gray-600 text-sm">
//               <p>
//                 Yes, the university offers several grant programs for student projects including the Innovation Fund, Sustainability Grants, and Department-Specific Research Awards. Applications typically open at the beginning of each semester. See our funding guide for application details and deadlines.
//               </p>
//             </div>
//           </details>
//         </div>
//       </div>

//       {/* Information Panel */}
//       <div className="bg-indigo-50 rounded-lg p-6 mb-6">
//         <h3 className="text-indigo-700 font-medium mb-2">About This Section</h3>
//         <p className="text-indigo-800 text-sm mb-4">
//           This page contains resources and frequently asked questions to help you with your projects. Content is updated regularly with new information.
//         </p>
//         <div className="text-indigo-700 text-sm">
//           <p className="mb-1">• For questions, please contact the project support team</p>
//           <p>• FAQ updates are published every Monday</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Book,
//   Search,
//   Tag,
//   Filter,
//   ChevronRight,
//   Loader2,
// } from "lucide-react";
// import { db } from "@/lib/firebase";
// import { collection, query, getDocs,
//   //  where,
//    orderBy } from "firebase/firestore";

// type FAQItem = {
//   id: string;
//   question: string;
//   answer: string;
//   category: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
//   isPopular: boolean;
// };

// export default function FAQ() {
//   const [faqs, setFaqs] = useState<FAQItem[]>([]);
//   const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchFAQs = async () => {
//       try {
//         setLoading(true);
//         const faqQuery = query(
//           collection(db, "faqs"),
//           orderBy("createdAt", "desc")
//         );
//         const snapshot = await getDocs(faqQuery);

//         const fetchedFAQs: FAQItem[] = [];
//         const categorySet = new Set<string>(["All"]);
//         const tagSet = new Set<string>();

//         snapshot.forEach((doc) => {
//           const data = doc.data() as Omit<FAQItem, "id">;
//           const faq: FAQItem = {
//             id: doc.id,
//             ...data,
//           };

//           fetchedFAQs.push(faq);

//           // Collect unique categories and tags
//           if (faq.category) {
//             categorySet.add(faq.category);
//           }

//           if (faq.tags && Array.isArray(faq.tags)) {
//             faq.tags.forEach(tag => tagSet.add(tag));
//           }
//         });

//         setFaqs(fetchedFAQs);
//         setFilteredFaqs(fetchedFAQs);
//         setCategories(Array.from(categorySet));
//         setTags(Array.from(tagSet));
//       } catch (err) {
//         console.error("Error fetching FAQs:", err);
//         setError("Failed to load FAQs. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFAQs();
//   }, []);

//   useEffect(() => {
//     // Apply filters whenever search, category, or tag changes
//     let result = [...faqs];

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         faq =>
//           faq.question.toLowerCase().includes(query) ||
//           faq.answer.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory && selectedCategory !== "All") {
//       result = result.filter(faq => faq.category === selectedCategory);
//     }

//     // Apply tag filter
//     if (selectedTag) {
//       result = result.filter(
//         faq => faq.tags && faq.tags.includes(selectedTag)
//       );
//     }

//     setFilteredFaqs(result);
//   }, [faqs, searchQuery, selectedCategory, selectedTag]);

//   // Get popular tags based on frequency
//   const popularTags = tags.slice(0, 6);

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//         <span className="ml-2 text-gray-600">Loading FAQs...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">FAQ & Resources</h1>
//           <p className="text-gray-600">
//             Guides, FAQs, and helpful resources for your academic journey
//           </p>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search FAQs..."
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-3">
//             <select
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 category !== "All" && (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 )
//               ))}
//             </select>

//             <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
//               <Filter className="w-5 h-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>

//         <div className="p-4 border-t overflow-x-auto">
//           <div className="flex items-center">
//             <Tag className="w-4 h-4 text-gray-500 mr-2" />
//             <span className="text-gray-500 text-sm mr-3">Popular Tags:</span>
//             <div className="flex flex-wrap gap-2">
//               {popularTags.map((tag) => (
//                 <button
//                   key={tag}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     selectedTag === tag
//                       ? "bg-indigo-100 text-indigo-700"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FAQ Section */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 border-b flex items-center justify-between">
//           <div className="flex items-center">
//             <Book className="w-5 h-5 mr-2 text-indigo-600" />
//             <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
//           </div>
//           <span className="text-gray-500 text-sm">{filteredFaqs.length} results</span>
//         </div>

//         {filteredFaqs.length > 0 ? (
//           <div className="divide-y">
//             {filteredFaqs.map((faq) => (
//               <details key={faq.id} className="p-4 group cursor-pointer">
//                 <summary className="flex justify-between items-center font-medium text-gray-800">
//                   <span>{faq.question}</span>
//                   <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//                 </summary>
//                 <div className="mt-3 text-gray-600 text-sm">
//                   <p>{faq.answer}</p>

//                   {faq.tags && faq.tags.length > 0 && (
//                     <div className="mt-3 flex gap-1 flex-wrap">
//                       {faq.tags.map(tag => (
//                         <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   <div className="mt-2 text-xs text-gray-400">
//                     Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </details>
//             ))}
//           </div>
//         ) : (
//           <div className="p-8 text-center text-gray-500">
//             No FAQs found matching your search criteria. Try adjusting your filters.
//           </div>
//         )}
//       </div>

//       {/* Information Panel */}
//       <div className="bg-indigo-50 rounded-lg p-6 mb-6">
//         <h3 className="text-indigo-700 font-medium mb-2">About This Section</h3>
//         <p className="text-indigo-800 text-sm mb-4">
//           This page contains resources and frequently asked questions to help you with your academic journey. Content is updated regularly with new information.
//         </p>
//         <div className="text-indigo-700 text-sm">
//           <p className="mb-1">• For additional questions, please contact student support at support@university.edu</p>
//           <p>• FAQ updates are published weekly</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Book,
//   Search,
//   Tag,
//   Filter,
//   ChevronRight,
//   Loader2,
//   MessageSquare,
//   ThumbsUp,
//   Send,
//   Plus,
//   HelpCircle,
// } from "lucide-react";
// import { db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   getDocs,
//   orderBy,
//   addDoc,
//   serverTimestamp,
//   updateDoc,
//   doc,
//   arrayUnion,
//   where,
//   // Timestamp
// } from "firebase/firestore";

// type FAQItem = {
//   id: string;
//   question: string;
//   answer: string;
//   category: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
//   isPopular: boolean;
//   isStudentGenerated?: boolean;
//   studentName?: string;
//   votes?: number;
//   studentAnswers?: StudentAnswer[];
//   approved?: boolean;
// };

// type StudentAnswer = {
//   id: string;
//   content: string;
//   studentName: string;
//   createdAt: string;
//   votes: number;
//   isApproved: boolean;
// };

// export default function FAQ() {
//   const [faqs, setFaqs] = useState<FAQItem[]>([]);
//   const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedTag, setSelectedTag] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // New states for student contribution
//   const [studentQuestion, setStudentQuestion] = useState("");
//   const [studentName, setStudentName] = useState("");
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [studentTags, setStudentTags] = useState<string[]>([]);
//   const [newTag, setNewTag] = useState("");
//   const [showQuestionForm, setShowQuestionForm] = useState(false);
//   const [submittingQuestion, setSubmittingQuestion] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [activeAnswerFaq, setActiveAnswerFaq] = useState<string | null>(null);
//   const [answerContent, setAnswerContent] = useState("");
//   const [includePendingQuestions, setIncludePendingQuestions] = useState(false);

//   useEffect(() => {
//     const fetchFAQs = async () => {
//       try {
//         setLoading(true);
//         let faqQuery;

//         if (includePendingQuestions) {
//           // If including pending questions, get all FAQs
//           faqQuery = query(
//             collection(db, "faqs"),
//             orderBy("createdAt", "desc")
//           );
//         } else {
//           // Otherwise only get approved FAQs or official FAQs
//           faqQuery = query(
//             collection(db, "faqs"),
//             where("approved", "==", true),
//             orderBy("createdAt", "desc")
//           );
//         }

//         const snapshot = await getDocs(faqQuery);

//         const fetchedFAQs: FAQItem[] = [];
//         const categorySet = new Set<string>(["All"]);
//         const tagSet = new Set<string>();

//         snapshot.forEach((doc) => {
//           const data = doc.data() as Omit<FAQItem, "id">;
//           const faq: FAQItem = {
//             id: doc.id,
//             ...data,
//           };

//           fetchedFAQs.push(faq);

//           // Collect unique categories and tags
//           if (faq.category) {
//             categorySet.add(faq.category);
//           }

//           if (faq.tags && Array.isArray(faq.tags)) {
//             faq.tags.forEach(tag => tagSet.add(tag));
//           }
//         });

//         setFaqs(fetchedFAQs);
//         setFilteredFaqs(fetchedFAQs);
//         setCategories(Array.from(categorySet));
//         setTags(Array.from(tagSet));
//       } catch (err) {
//         console.error("Error fetching FAQs:", err);
//         setError("Failed to load FAQs. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFAQs();
//   }, [includePendingQuestions]);

//   useEffect(() => {
//     // Apply filters whenever search, category, or tag changes
//     let result = [...faqs];

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         faq =>
//           faq.question.toLowerCase().includes(query) ||
//           faq.answer.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory && selectedCategory !== "All") {
//       result = result.filter(faq => faq.category === selectedCategory);
//     }

//     // Apply tag filter
//     if (selectedTag) {
//       result = result.filter(
//         faq => faq.tags && faq.tags.includes(selectedTag)
//       );
//     }

//     setFilteredFaqs(result);
//   }, [faqs, searchQuery, selectedCategory, selectedTag]);

//   // Get popular tags based on frequency
//   const popularTags = tags.slice(0, 6);

//   const handleSubmitQuestion = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!studentQuestion.trim() || !studentName.trim()) {
//       return;
//     }

//     try {
//       setSubmittingQuestion(true);

//       // Add the new FAQ item to Firestore
//       await addDoc(collection(db, "faqs"), {
//         question: studentQuestion,
//         answer: "", // Empty until approved and answered by staff
//         category: selectedCategories.length > 0 ? selectedCategories[0] : "General",
//         tags: studentTags,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         isPopular: false,
//         isStudentGenerated: true,
//         studentName,
//         votes: 0,
//         studentAnswers: [],
//         approved: false, // Will need approval before displaying publicly
//       });

//       // Reset form
//       setStudentQuestion("");
//       setStudentName("");
//       setSelectedCategories([]);
//       setStudentTags([]);
//       setShowQuestionForm(false);

//       // Show success message
//       setSuccessMessage("Your question has been submitted and is awaiting approval.");
//       setTimeout(() => setSuccessMessage(""), 5000);

//     } catch (err) {
//       console.error("Error submitting question:", err);
//       setError("Failed to submit your question. Please try again.");
//     } finally {
//       setSubmittingQuestion(false);
//     }
//   };

//   const handleSubmitAnswer = async (faqId: string) => {
//     if (!answerContent.trim() || !studentName.trim()) {
//       return;
//     }

//     try {
//       const faqRef = doc(db, "faqs", faqId);

//       // Add the new answer to the FAQ's studentAnswers array
//       await updateDoc(faqRef, {
//         studentAnswers: arrayUnion({
//           id: Date.now().toString(), // Simple unique ID
//           content: answerContent,
//           studentName,
//           createdAt: new Date().toISOString(),
//           votes: 0,
//           isApproved: false // Will need approval before showing as verified
//         }),
//         updatedAt: serverTimestamp()
//       });

//       // Update local state to reflect the change
//       const updatedFaqs = faqs.map(faq => {
//         if (faq.id === faqId) {
//           const newAnswer: StudentAnswer = {
//             id: Date.now().toString(),
//             content: answerContent,
//             studentName,
//             createdAt: new Date().toISOString(),
//             votes: 0,
//             isApproved: false
//           };

//           return {
//             ...faq,
//             studentAnswers: faq.studentAnswers ? [...faq.studentAnswers, newAnswer] : [newAnswer],
//             updatedAt: new Date().toISOString()
//           };
//         }
//         return faq;
//       });

//       setFaqs(updatedFaqs);
//       setFilteredFaqs(updatedFaqs);

//       // Reset form
//       setAnswerContent("");
//       setActiveAnswerFaq(null);

//     } catch (err) {
//       console.error("Error submitting answer:", err);
//       setError("Failed to submit your answer. Please try again.");
//     }
//   };

//   const handleVote = async (faqId: string) => {
//     try {
//       const faqRef = doc(db, "faqs", faqId);

//       // Get the current FAQ to update the vote count
//       const faqToUpdate = faqs.find(faq => faq.id === faqId);
//       if (!faqToUpdate) return;

//       const newVoteCount = (faqToUpdate.votes || 0) + 1;

//       // Update Firestore
//       await updateDoc(faqRef, {
//         votes: newVoteCount
//       });

//       // Update local state
//       const updatedFaqs = faqs.map(faq => {
//         if (faq.id === faqId) {
//           return { ...faq, votes: newVoteCount };
//         }
//         return faq;
//       });

//       setFaqs(updatedFaqs);
//       setFilteredFaqs(updatedFaqs);

//     } catch (err) {
//       console.error("Error updating vote:", err);
//     }
//   };

//   const addTag = () => {
//     if (newTag.trim() && !studentTags.includes(newTag.trim())) {
//       setStudentTags([...studentTags, newTag.trim()]);
//       setNewTag("");
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setStudentTags(studentTags.filter(tag => tag !== tagToRemove));
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//         <span className="ml-2 text-gray-600">Loading FAQs...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">FAQ & Resources</h1>
//           <p className="text-gray-600">
//             Guides, FAQs, and helpful resources for your academic journey
//           </p>
//         </div>
//         <button
//           onClick={() => setShowQuestionForm(!showQuestionForm)}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Ask a Question
//         </button>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
//           <p>{successMessage}</p>
//         </div>
//       )}

//       {/* Student Question Form */}
//       {showQuestionForm && (
//         <div className="bg-white rounded-lg shadow mb-6 p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center">
//             <HelpCircle className="w-5 h-5 mr-2 text-indigo-600" />
//             Submit Your Question
//           </h2>
//           <form onSubmit={handleSubmitQuestion}>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Your Name
//               </label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 placeholder="Enter your name"
//                 value={studentName}
//                 onChange={(e) => setStudentName(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Your Question
//               </label>
//               <textarea
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 placeholder="What would you like to know?"
//                 rows={3}
//                 value={studentQuestion}
//                 onChange={(e) => setStudentQuestion(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 className="w-full p-2 border border-gray-300 rounded-lg"
//                 value={selectedCategories[0] || ""}
//                 onChange={(e) => setSelectedCategories([e.target.value])}
//               >
//                 <option value="">Select a Category</option>
//                 {categories.map((category) => (
//                   category !== "All" && (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   )
//                 ))}
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Tags
//               </label>
//               <div className="flex items-center mb-2">
//                 <input
//                   type="text"
//                   className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
//                   placeholder="Add tags..."
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                 />
//                 <button
//                   type="button"
//                   onClick={addTag}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg"
//                 >
//                   Add
//                 </button>
//               </div>
//               {studentTags.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {studentTags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(tag)}
//                         className="ml-1 text-gray-500 hover:text-gray-700"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setShowQuestionForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submittingQuestion}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
//               >
//                 {submittingQuestion ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4 mr-2" />
//                     Submit Question
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
//           <div className="relative flex-grow">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search className="w-5 h-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search FAQs..."
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-3">
//             <select
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 category !== "All" && (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 )
//               ))}
//             </select>

//             <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
//               <Filter className="w-5 h-5 mr-2" />
//               More Filters
//             </button>
//           </div>
//         </div>

//         <div className="p-4 border-t overflow-x-auto">
//           <div className="flex items-center">
//             <Tag className="w-4 h-4 text-gray-500 mr-2" />
//             <span className="text-gray-500 text-sm mr-3">Popular Tags:</span>
//             <div className="flex flex-wrap gap-2">
//               {popularTags.map((tag) => (
//                 <button
//                   key={tag}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     selectedTag === tag
//                       ? "bg-indigo-100 text-indigo-700"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Show pending questions toggle */}
//       <div className="mb-4 flex items-center">
//         <label className="inline-flex items-center cursor-pointer">
//           <input
//             type="checkbox"
//             className="sr-only peer"
//             checked={includePendingQuestions}
//             onChange={() => setIncludePendingQuestions(!includePendingQuestions)}
//           />
//           <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
//           <span className="ms-3 text-sm font-medium text-gray-700">Show pending questions</span>
//         </label>
//       </div>

//       {/* FAQ Section */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="p-4 border-b flex items-center justify-between">
//           <div className="flex items-center">
//             <Book className="w-5 h-5 mr-2 text-indigo-600" />
//             <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
//           </div>
//           <span className="text-gray-500 text-sm">{filteredFaqs.length} results</span>
//         </div>

//         {filteredFaqs.length > 0 ? (
//           <div className="divide-y">
//             {filteredFaqs.map((faq) => (
//               <details key={faq.id} className="p-4 group cursor-pointer">
//                 <summary className="flex justify-between items-center font-medium text-gray-800">
//                   <div className="flex items-center">
//                     <span>{faq.question}</span>
//                     {faq.isStudentGenerated && (
//                       <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
//                         Student Question
//                       </span>
//                     )}
//                     {faq.isStudentGenerated && !faq.approved && (
//                       <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
//                         Pending Approval
//                       </span>
//                     )}
//                   </div>
//                   <ChevronRight className="w-5 h-5 text-gray-500 group-open:rotate-90 transition-transform" />
//                 </summary>
//                 <div className="mt-3 text-gray-600">
//                   {/* Official answer */}
//                   {faq.answer && (
//                     <div className="mb-4">
//                       <p>{faq.answer}</p>
//                       {faq.isStudentGenerated && (
//                         <div className="mt-2 text-xs text-gray-500">
//                           <span>Question by: {faq.studentName}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* If no official answer yet */}
//                   {!faq.answer && faq.isStudentGenerated && (
//                     <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg">
//                       <p className="text-sm">This question is awaiting an official answer from staff.</p>
//                     </div>
//                   )}

//                   {/* Student answers section */}
//                   {faq.studentAnswers && faq.studentAnswers.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="font-medium text-gray-700 flex items-center">
//                         <MessageSquare className="w-4 h-4 mr-1" />
//                         Student Responses
//                       </h4>
//                       <div className="space-y-3 mt-2">
//                         {faq.studentAnswers.map((answer) => (
//                           <div
//                             key={answer.id}
//                             className={`p-3 rounded-lg ${answer.isApproved ? 'bg-green-50' : 'bg-gray-50'}`}
//                           >
//                             <p className="text-sm">{answer.content}</p>
//                             <div className="mt-2 flex justify-between items-center">
//                               <div className="text-xs text-gray-500">
//                                 <span>By: {answer.studentName}</span>
//                                 <span className="mx-2">•</span>
//                                 <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
//                                 {answer.isApproved && (
//                                   <span className="ml-2 text-green-600">
//                                     ✓ Verified
//                                   </span>
//                                 )}
//                               </div>
//                               <button
//                                 className="text-xs flex items-center text-gray-500 hover:text-indigo-600"
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   // Vote functionality would go here
//                                 }}
//                               >
//                                 <ThumbsUp className="w-3 h-3 mr-1" />
//                                 {answer.votes || 0}
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Add student answer */}
//                   {activeAnswerFaq === faq.id ? (
//                     <div className="mt-4 bg-gray-50 p-3 rounded-lg">
//                       <h4 className="font-medium text-gray-700">Add Your Response</h4>
//                       <div className="mt-2">
//                         <textarea
//                           className="w-full p-2 border border-gray-300 rounded-lg text-sm"
//                           placeholder="Share your knowledge..."
//                           rows={3}
//                           value={answerContent}
//                           onChange={(e) => setAnswerContent(e.target.value)}
//                         />
//                         <div className="mt-2">
//                           <input
//                             type="text"
//                             className="p-2 border border-gray-300 rounded-lg text-sm mb-2 w-full"
//                             placeholder="Your name"
//                             value={studentName}
//                             onChange={(e) => setStudentName(e.target.value)}
//                           />
//                         </div>
//                         <div className="flex justify-end gap-2 mt-2">
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setActiveAnswerFaq(null);
//                               setAnswerContent("");
//                             }}
//                             className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => handleSubmitAnswer(faq.id)}
//                             className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
//                           >
//                             <Send className="w-3 h-3 mr-1" />
//                             Submit
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mt-4 flex justify-between items-center">
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           setActiveAnswerFaq(faq.id);
//                         }}
//                         className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
//                       >
//                         <MessageSquare className="w-4 h-4 mr-1" />
//                         Add Response
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           handleVote(faq.id);
//                         }}
//                         className="text-sm flex items-center text-gray-500 hover:text-indigo-600"
//                       >
//                         <ThumbsUp className="w-4 h-4 mr-1" />
//                         {faq.votes || 0} Helpful
//                       </button>
//                     </div>
//                   )}

//                   {faq.tags && faq.tags.length > 0 && (
//                     <div className="mt-4 flex gap-1 flex-wrap">
//                       {faq.tags.map(tag => (
//                         <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   )}

//                   <div className="mt-2 text-xs text-gray-400">
//                     Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </details>
//             ))}
//           </div>
//         ) : (
//           <div className="p-8 text-center text-gray-500">
//             No FAQs found matching your search criteria. Try adjusting your filters.
//           </div>
//         )}
//       </div>

//       {/* Information Panel */}
//       <div className="bg-indigo-50 rounded-lg p-6 mb-6">
//         <h3 className="text-indigo-700 font-medium mb-2">About This Section</h3>
//         <p className="text-indigo-800 text-sm mb-4">
//           This page contains resources and frequently asked questions to help you with your academic journey. Content is updated regularly with new information.
//         </p>
//         <div className="text-indigo-700 text-sm">
//           <p className="mb-1">• For additional questions, please use the &quot;Ask a Question&quot; button above</p>
//           <p className="mb-1">• You can contribute your knowledge by responding to existing questions</p>
//           <p className="mb-1">• Student-submitted questions are reviewed before being published</p>
//           <p>• FAQ updates are published weekly</p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Tag,
  Filter,
  ChevronRight,
  Loader2,
  MessageSquare,
  ThumbsUp,
  Send,
  Plus,
  Users,
  BookOpen,
  Calendar,
  PenTool,
} from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  // getDoc,
  arrayUnion,
  where,
  limit,
} from "firebase/firestore";

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  studentId: string;
  studentName: string;
  studentBranch?: string;
  studentYear?: string;
  votes: number;
  replies: ForumReply[];
  views: number;
};

type ForumReply = {
  id: string;
  content: string;
  studentId: string;
  studentName: string;
  studentBranch?: string;
  studentYear?: string;
  createdAt: string;
  votes: number;
  isAnswer: boolean;
};

export default function StudentForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New post states
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentBranch, setStudentBranch] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [submittingPost, setSubmittingPost] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reply states
  const [activeReplyPost, setActiveReplyPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // View states
  const [currentView, setCurrentView] = useState<
    "all" | "trending" | "unanswered" | "my"
  >("all");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let forumQuery;

        // Determine which posts to fetch based on currentView
        if (currentView === "trending") {
          forumQuery = query(
            collection(db, "forumPosts"),
            orderBy("votes", "desc"),
            limit(20)
          );
        } else if (currentView === "unanswered") {
          // This is a simplification - would need a more complex query in production
          forumQuery = query(
            collection(db, "forumPosts"),
            where("hasAcceptedAnswer", "==", false),
            orderBy("createdAt", "desc")
          );
        } else if (currentView === "my") {
          // Filter by the current user's posts (using studentId)
          // This assumes studentId is set somewhere in your app
          if (studentId) {
            forumQuery = query(
              collection(db, "forumPosts"),
              where("studentId", "==", studentId),
              orderBy("createdAt", "desc")
            );
          } else {
            // If no studentId, just show all posts
            forumQuery = query(
              collection(db, "forumPosts"),
              orderBy("createdAt", "desc")
            );
          }
        } else {
          // Default "all" view
          forumQuery = query(
            collection(db, "forumPosts"),
            orderBy("createdAt", "desc")
          );
        }

        const snapshot = await getDocs(forumQuery);

        const fetchedPosts: ForumPost[] = [];
        const categorySet = new Set<string>(["All"]);
        const tagSet = new Set<string>();

        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<ForumPost, "id">;
          const post: ForumPost = {
            id: doc.id,
            ...data,
            // Ensure these fields exist
            votes: data.votes || 0,
            views: data.views || 0,
            replies: data.replies || [],
          };

          fetchedPosts.push(post);

          // Collect unique categories and tags
          if (post.category) {
            categorySet.add(post.category);
          }

          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag) => tagSet.add(tag));
          }
        });

        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
        setCategories(Array.from(categorySet));
        setTags(Array.from(tagSet));
      } catch (err) {
        console.error("Error fetching forum posts:", err);
        setError("Failed to load forum posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentView, studentId]);

  useEffect(() => {
    // Apply filters whenever search, category, or tag changes
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((post) => post.category === selectedCategory);
    }

    // Apply tag filter
    if (selectedTag) {
      result = result.filter(
        (post) => post.tags && post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  // Get popular tags based on frequency
  const popularTags = tags.slice(0, 6);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !postTitle.trim() ||
      !postContent.trim() ||
      !studentName.trim() ||
      !studentId.trim()
    ) {
      return;
    }

    try {
      setSubmittingPost(true);

      // Add the new post to Firestore
      await addDoc(collection(db, "forumPosts"), {
        title: postTitle,
        content: postContent,
        category:
          selectedCategories.length > 0 ? selectedCategories[0] : "General",
        tags: postTags,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        pinned: false,
        studentId,
        studentName,
        studentBranch,
        studentYear,
        votes: 0,
        replies: [],
        views: 0,
        hasAcceptedAnswer: false,
      });

      // Reset form
      setPostTitle("");
      setPostContent("");
      setSelectedCategories([]);
      setPostTags([]);
      setShowPostForm(false);

      // Show success message
      setSuccessMessage("Your forum post has been published successfully!");
      setTimeout(() => setSuccessMessage(""), 5000);

      // Refresh posts (in production, you'd update the state directly)
      window.location.reload();
    } catch (err) {
      console.error("Error submitting post:", err);
      setError("Failed to submit your post. Please try again.");
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleSubmitReply = async (postId: string) => {
    if (!replyContent.trim() || !studentName.trim() || !studentId.trim()) {
      return;
    }

    try {
      const postRef = doc(db, "forumPosts", postId);

      // Create a new reply
      const newReply: Omit<ForumReply, "id"> = {
        content: replyContent,
        studentId,
        studentName,
        studentBranch,
        studentYear,
        createdAt: new Date().toISOString(),
        votes: 0,
        isAnswer: false,
      };

      // Add the reply to the post's replies array
      await updateDoc(postRef, {
        replies: arrayUnion({
          ...newReply,
          id: Date.now().toString(), // Simple unique ID
        }),
        updatedAt: serverTimestamp(),
      });

      // Update local state to reflect the change
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const newReplyWithId: ForumReply = {
            ...newReply,
            id: Date.now().toString(),
          };

          return {
            ...post,
            replies: [...post.replies, newReplyWithId],
            updatedAt: new Date().toISOString(),
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);

      // Reset form
      setReplyContent("");
      setActiveReplyPost(null);
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError("Failed to submit your reply. Please try again.");
    }
  };

  const handleVote = async (postId: string) => {
    try {
      const postRef = doc(db, "forumPosts", postId);

      // Get the current post to update the vote count
      const postToUpdate = posts.find((post) => post.id === postId);
      if (!postToUpdate) return;

      const newVoteCount = postToUpdate.votes + 1;

      // Update Firestore
      await updateDoc(postRef, {
        votes: newVoteCount,
      });

      // Update local state
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return { ...post, votes: newVoteCount };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating vote:", err);
    }
  };

  const handleVoteReply = async (postId: string, replyId: string) => {
    try {
      // Find the post
      const postToUpdate = posts.find((post) => post.id === postId);
      if (!postToUpdate) return;

      // Find and update the reply
      const updatedReplies = postToUpdate.replies.map((reply) => {
        if (reply.id === replyId) {
          return { ...reply, votes: reply.votes + 1 };
        }
        return reply;
      });

      // Update Firestore - this is more complex since replies are in an array
      // This is a simplification - in production, you might use a transaction
      const postRef = doc(db, "forumPosts", postId);
      await updateDoc(postRef, {
        replies: updatedReplies,
      });

      // Update local state
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return { ...post, replies: updatedReplies };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating reply vote:", err);
    }
  };

  const markAsAnswer = async (postId: string, replyId: string) => {
    try {
      // Find the post
      const postToUpdate = posts.find((post) => post.id === postId);
      if (!postToUpdate) return;

      // Update the reply's isAnswer status
      const updatedReplies = postToUpdate.replies.map((reply) => {
        if (reply.id === replyId) {
          return { ...reply, isAnswer: true };
        }
        return reply;
      });

      // Update Firestore
      const postRef = doc(db, "forumPosts", postId);
      await updateDoc(postRef, {
        replies: updatedReplies,
        hasAcceptedAnswer: true,
      });

      // Update local state
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: updatedReplies,
            hasAcceptedAnswer: true,
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error marking answer:", err);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !postTags.includes(newTag.trim())) {
      setPostTags([...postTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostTags(postTags.filter((tag) => tag !== tagToRemove));
  };

  const handleViewPost = async (postId: string) => {
    try {
      // Toggle the expanded state
      if (expandedPost === postId) {
        setExpandedPost(null);
        return;
      }

      setExpandedPost(postId);

      // Update the view count in Firestore
      const postRef = doc(db, "forumPosts", postId);
      const postToUpdate = posts.find((post) => post.id === postId);
      if (!postToUpdate) return;

      const newViewCount = postToUpdate.views + 1;

      // Update Firestore
      await updateDoc(postRef, {
        views: newViewCount,
      });

      // Update local state
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return { ...post, views: newViewCount };
        }
        return post;
      });

      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (err) {
      console.error("Error updating view count:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading forum posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Forums</h1>
          <p className="text-gray-600">
            Connect, discuss, and share knowledge with fellow students
          </p>
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Post
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <p>{successMessage}</p>
        </div>
      )}

      {/* New Forum Post Form */}
      {showPostForm && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
            Create New Forum Post
          </h2>
          <form onSubmit={handleSubmitPost}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch/Department
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Computer Science"
                  value={studentBranch}
                  onChange={(e) => setStudentBranch(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year of Study
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={studentYear}
                  onChange={(e) => setStudentYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Title
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter a descriptive title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Content
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Share your thoughts, questions, or ideas..."
                rows={6}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedCategories[0] || ""}
                onChange={(e) => setSelectedCategories([e.target.value])}
              >
                <option value="">Select a Category</option>
                {categories.map(
                  (category) =>
                    category !== "All" && (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                )}
                <option value="Academic">Academic</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Career">Career</option>
                <option value="Events">Events</option>
                <option value="Projects">Projects</option>
                <option value="Study Groups">Study Groups</option>
                <option value="General Discussion">General Discussion</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
                  placeholder="Add relevant tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
              {postTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {postTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingPost}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {submittingPost ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post to Forum
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search forums..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(
                (category) =>
                  category !== "All" && (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
              )}
            </select>

            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center">
              <Tag className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-gray-500 text-sm mr-3">Popular Tags:</span>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === tag
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() =>
                      setSelectedTag(selectedTag === tag ? "" : tag)
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex">
              <button
                onClick={() => setCurrentView("all")}
                className={`px-3 py-1 rounded-lg text-sm mr-2 ${
                  currentView === "all"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setCurrentView("trending")}
                className={`px-3 py-1 rounded-lg text-sm mr-2 ${
                  currentView === "trending"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setCurrentView("unanswered")}
                className={`px-3 py-1 rounded-lg text-sm mr-2 ${
                  currentView === "unanswered"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Unanswered
              </button>
              <button
                onClick={() => setCurrentView("my")}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentView === "my"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                My Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Posts Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-600" />
            <h2 className="text-lg font-semibold">Student Forum</h2>
          </div>
          <span className="text-gray-500 text-sm">
            {filteredPosts.length} posts
          </span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="divide-y">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4">
                <div
                  className="cursor-pointer"
                  onClick={() => handleViewPost(post.id)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg text-gray-800 hover:text-indigo-600">
                      {post.title}
                      {post.pinned && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Pinned
                        </span>
                      )}
                    </h3>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        expandedPost === post.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{post.studentName}</span>
                      {post.studentBranch && (
                        <span className="ml-1 text-gray-400">
                          ({post.studentBranch}, {post.studentYear})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{post.replies.length} replies</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{post.votes} votes</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{post.views} views</span>
                    </div>
                    {post.category && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Preview of content (only when not expanded) */}
                  {expandedPost !== post.id && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {post.content}
                    </p>
                  )}
                </div>

                {/* Expanded content and replies */}
                {expandedPost === post.id && (
                  <div className="mt-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">
                        {post.content}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags &&
                          post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(post.id);
                          }}
                          className="text-sm flex items-center text-gray-500 hover:text-indigo-600"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.votes} Helpful
                        </button>

                        <span className="text-xs text-gray-400">
                          Posted:{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                          {post.createdAt !== post.updatedAt && (
                            <>
                              {" "}
                              • Updated:{" "}
                              {new Date(post.updatedAt).toLocaleDateString()}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Reply section */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Replies ({post.replies.length})
                      </h4>

                      {post.replies.length > 0 ? (
                        <div className="space-y-4 mt-3">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-lg ${
                                reply.isAnswer
                                  ? "bg-green-50 border border-green-100"
                                  : "bg-gray-50"
                              }`}
                            >
                              <p className="text-gray-800 whitespace-pre-line">
                                {reply.content}
                              </p>
                              <div className="mt-3 flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  <span>By: {reply.studentName}</span>
                                  {reply.studentBranch && (
                                    <span className="ml-1">
                                      ({reply.studentBranch},{" "}
                                      {reply.studentYear})
                                    </span>
                                  )}
                                  <span className="mx-2">•</span>
                                  <span>
                                    {new Date(
                                      reply.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  {reply.isAnswer && (
                                    <span className="ml-2 text-green-600 flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Verified Answer
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="text-xs flex items-center text-gray-500 hover:text-indigo-600"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVoteReply(post.id, reply.id);
                                    }}
                                  >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {reply.votes}
                                  </button>

                                  {/* If the viewer is the post creator (would be checked in production) */}
                                  {!reply.isAnswer &&
                                    post.studentId === studentId && (
                                      <button
                                        className="text-xs flex items-center text-gray-500 hover:text-green-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsAnswer(post.id, reply.id);
                                        }}
                                      >
                                        <svg
                                          className="w-3 h-3 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        Mark as Answer
                                      </button>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p>No replies yet. Be the first to respond!</p>
                        </div>
                      )}

                      {/* Add reply form */}
                      {activeReplyPost === post.id ? (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-700 mb-2">
                            Add Your Reply
                          </h5>
                          <div>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="Share your knowledge or ask a follow-up question..."
                              rows={4}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Your name"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                              />
                              <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Your student ID"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                              />
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                className="p-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Your branch/department (optional)"
                                value={studentBranch}
                                onChange={(e) =>
                                  setStudentBranch(e.target.value)
                                }
                              />
                              <select
                                className="p-2 border border-gray-300 rounded-lg text-sm"
                                value={studentYear}
                                onChange={(e) => setStudentYear(e.target.value)}
                              >
                                <option value="">Select year (optional)</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                                <option value="5th Year">5th Year</option>
                                <option value="Masters">Masters</option>
                                <option value="PhD">PhD</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveReplyPost(null);
                                  setReplyContent("");
                                }}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubmitReply(post.id);
                                }}
                                className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Submit Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveReplyPost(post.id);
                            }}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Add a Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags when not expanded */}
                {expandedPost !== post.id &&
                  post.tags &&
                  post.tags.length > 0 && (
                    <div className="mt-3 flex gap-1 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No forum posts found matching your search criteria. Try adjusting
            your filters or be the first to post!
          </div>
        )}
      </div>

      {/* Trending Topics and Popular Discussions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow p-4 col-span-1">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Trending Topics
          </h3>
          <ul className="space-y-3">
            {tags.slice(0, 5).map((tag) => (
              <li key={tag} className="flex items-center">
                <span className="w-7 h-7 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-2 text-xs">
                  {posts.filter((post) => post.tags.includes(tag)).length}
                </span>
                <button
                  className="text-gray-700 hover:text-indigo-600"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Discussions */}
        <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            Active Discussions
          </h3>
          <div className="space-y-3">
            {posts
              .sort((a, b) => b.replies.length - a.replies.length)
              .slice(0, 3)
              .map((post) => (
                <div
                  key={post.id}
                  className="p-3 border border-gray-100 rounded-lg hover:border-indigo-100 hover:bg-indigo-50 cursor-pointer"
                  onClick={() => handleViewPost(post.id)}
                >
                  <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">
                    {post.title}
                  </h4>
                  <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {post.studentName}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {post.replies.length} replies
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {post.votes} votes
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Forum Information and Guidelines */}
      <div className="bg-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="text-indigo-700 font-medium mb-2">Forum Guidelines</h3>
        <p className="text-indigo-800 text-sm mb-4">
          Welcome to the Student Forum! This is a space for students to connect,
          share knowledge, and help each other.
        </p>
        <div className="text-indigo-700 text-sm">
          <p className="mb-1">
            • Be respectful and courteous to your fellow students
          </p>
          <p className="mb-1">
            • Keep discussions on-topic and relevant to student interests
          </p>
          <p className="mb-1">
            • Use appropriate tags to help others find your posts
          </p>
          <p className="mb-1">
            • Upvote helpful posts and replies to recognize valuable
            contributions
          </p>
          <p>• Report inappropriate content to moderators</p>
        </div>
      </div>
    </div>
  );
}
