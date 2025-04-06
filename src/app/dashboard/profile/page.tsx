// // File: src/app/dashboard/profile/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { User, Edit2, Save, X } from "lucide-react";

// export default function ProfilePage() {
//   const { currentUser } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [profile, setProfile] = useState<{
//     firstName: string;
//     lastName: string;
//     studentId: string;
//     branch: string;
//     year: string;
//     interests: string[];
//     skills: string[];
//     achievements: string[];
//     email: string;
//     createdAt: string;
//   }>({
//     firstName: "",
//     lastName: "",
//     studentId: "",
//     branch: "",
//     year: "",
//     interests: [],
//     skills: [],
//     achievements: [],
//     email: "",
//     createdAt: "",
//   });
//   const [formData, setFormData] = useState({ ...profile });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!currentUser) return;

//       try {
//         const docRef = doc(db, "students", currentUser.uid);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const data = docSnap.data() as {
//             firstName: string;
//             lastName: string;
//             studentId: string;
//             branch: string;
//             year: string;
//             interests: string[];
//             skills: string[];
//             achievements: string[];
//             email: string;
//             createdAt: string;
//           };
//           setProfile(data);
//           setFormData(data);
//         } else {
//           setError("Profile not found. Please complete your profile.");
//         }
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Failed to load profile data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [currentUser]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
//     const values = e.target.value.split(',').map(item => item.trim());
//     setFormData({
//       ...formData,
//       [field]: values,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!currentUser) return;

//     setError("");
//     setSuccess("");
//     setSaving(true);

//     try {
//       // Update lowercase fields for searching
//       const updateData = {
//         ...formData,
//         firstName_lower: formData.firstName.toLowerCase(),
//         lastName_lower: formData.lastName.toLowerCase(),
//         email_lower: formData.email.toLowerCase(),
//         updatedAt: new Date().toISOString(),
//       };

//       const docRef = doc(db, "students", currentUser.uid);
//       await updateDoc(docRef, updateData);

//       setProfile(formData);
//       setSuccess("Profile updated successfully!");
//       setEditing(false);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       setError("Failed to update profile. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cancelEdit = () => {
//     setFormData({ ...profile });
//     setEditing(false);
//     setError("");
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-indigo-600 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-white">My Profile</h1>
//             {!editing ? (
//               <button
//                 onClick={() => setEditing(true)}
//                 className="flex items-center space-x-1 bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50"
//               >
//                 <Edit2 className="w-4 h-4" />
//                 <span>Edit Profile</span>
//               </button>
//             ) : (
//               <div className="flex space-x-2">
//                 <button
//                   onClick={cancelEdit}
//                   className="flex items-center space-x-1 bg-white text-gray-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-50"
//                 >
//                   <X className="w-4 h-4" />
//                   <span>Cancel</span>
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
//                   }}
//                   disabled={saving}
//                   className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50"
//                 >
//                   <Save className="w-4 h-4" />
//                   <span>{saving ? "Saving..." : "Save"}</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="p-6">
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
//               {success}
//             </div>
//           )}

//           {editing ? (
//             <form className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Student ID
//                   </label>
//                   <input
//                     type="text"
//                     name="studentId"
//                     value={formData.studentId}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Branch
//                   </label>
//                   <input
//                     type="text"
//                     name="branch"
//                     value={formData.branch}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Year
//                   </label>
//                   <select
//                     name="year"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     <option value="">Select Year</option>
//                     <option value="1">First Year</option>
//                     <option value="2">Second Year</option>
//                     <option value="3">Third Year</option>
//                     <option value="4">Fourth Year</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Interests (comma separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.interests.join(', ')}
//                     onChange={(e) => handleArrayInputChange(e, 'interests')}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="e.g. AI, Web Development, Robotics"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Skills (comma separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.skills.join(', ')}
//                     onChange={(e) => handleArrayInputChange(e, 'skills')}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="e.g. React, Node.js, Python"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Achievements (comma separated)
//                   </label>
//                   <textarea
//                     value={formData.achievements.join(', ')}
//                     onChange={(e) => handleArrayInputChange(e, 'achievements')}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                     rows={3}
//                     placeholder="e.g. Hackathon Winner, Dean's List, Research Publication"
//                   />
//                 </div>
//               </div>
//             </form>
//           ) : (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row gap-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
//                     <User className="w-16 h-16 text-indigo-600" />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     {profile.firstName} {profile.lastName}
//                   </h2>
//                   <p className="text-gray-600 mb-2">ID: {profile.studentId}</p>
//                   <p className="text-gray-600 mb-2">Email: {profile.email}</p>
//                   <div className="flex flex-wrap gap-1 mt-2">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                       {profile.branch}
//                     </span>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                       Year {profile.year}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <h3 className="text-md font-semibold text-gray-700 mb-2">Interests</h3>
//                   <div className="flex flex-wrap gap-1">
//                     {profile.interests && profile.interests.length > 0 ? (
//                       profile.interests.map((interest, index) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                         >
//                           {interest}
//                         </span>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm">No interests added yet</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
//                   <div className="flex flex-wrap gap-1">
//                     {profile.skills && profile.skills.length > 0 ? (
//                       profile.skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
//                         >
//                           {skill}
//                         </span>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm">No skills added yet</p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-md font-semibold text-gray-700 mb-2">Achievements</h3>
//                   {profile.achievements && profile.achievements.length > 0 ? (
//                     <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
//                       {profile.achievements.map((achievement, index) => (
//                         <li key={index}>{achievement}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-500 text-sm">No achievements added yet</p>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-4 text-sm text-gray-500">
//                 Profile created: {new Date(profile.createdAt).toLocaleDateString()}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Edit2, Save, X, PlusCircle } from "lucide-react";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    branch: "",
    year: "",
    interests: [] as string[],
    skills: [] as string[],
    achievements: [] as string[],
    email: "",
    createdAt: "",
  });

  const [formData, setFormData] = useState({ ...profile });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // For tag inputs
  const [newInterest, setNewInterest] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, "students", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as typeof profile;
          setProfile(data);
          setFormData(data);
        } else {
          setError("Profile not found. Please complete your profile.");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Tag input handlers
  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (index: number) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() && !formData.achievements.includes(newAchievement.trim())) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()]
      });
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Update lowercase fields for searching
      const updateData = {
        ...formData,
        firstName_lower: formData.firstName.toLowerCase(),
        lastName_lower: formData.lastName.toLowerCase(),
        email_lower: formData.email.toLowerCase(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = doc(db, "students", currentUser.uid);
      await updateDoc(docRef, updateData);

      setProfile(formData);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({ ...profile });
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">My Profile</h1>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-1 bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={cancelEdit}
                  className="flex items-center space-x-1 bg-white text-gray-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {editing ? (
            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch/Specialization
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5+">5+ Year</option>
                    <option value="Graduate">Graduate Student</option>
                  </select>
                </div>
              </div>

              {/* Areas of Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest (e.g., Machine Learning)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Press Enter or click the button to add
                </p>
              </div>

              {/* Technical Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., JavaScript, React)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Press Enter or click the button to add
                </p>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements & Certifications
                </label>
                <div className="space-y-2 mb-2">
                  {formData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-green-50 p-2 rounded-md"
                    >
                      <span className="text-green-800 text-sm">
                        {achievement}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement (e.g., AWS Certified Developer)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Press Enter or click the button to add
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-16 h-16 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600 mb-2">ID: {profile.studentId}</p>
                  <p className="text-gray-600 mb-2">Email: {profile.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {profile.branch}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      Year {profile.year}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No interests added yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No skills added yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Achievements</h3>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {profile.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No achievements added yet</p>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Profile created: {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}