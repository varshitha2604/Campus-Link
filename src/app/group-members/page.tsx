"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Users,
  UserPlus,
  ChevronLeft,
  Shield,
  Mail,
  Calendar,
  Search,
} from "lucide-react";

export default function GroupMembers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  interface Group {
      id: string;
      name?: string;
      [key: string]: string | undefined;
    }
    interface Member {
      id: string;
      role: string;
      joinedAt: Date;
      firstName?: string;
      lastName?: string;
      email?: string;
      year?: string;
      branch?: string;
      skills?: string[];
    }
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
  const [userRole, setUserRole] = useState("Member");
  const [searchQuery, setSearchQuery] = useState("");

  // Get group ID from URL parameters
  const groupId = searchParams.get("id");

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
      return;
    }

    if (!groupId) {
      router.push("/groups");
      return;
    }

    const fetchGroupAndMembers = async () => {
      try {
        setLoading(true);

        // Fetch group details
        const groupDoc = await getDoc(doc(db, "groups", groupId));

        if (!groupDoc.exists()) {
          alert("Group not found");
          router.push("/groups");
          return;
        }

        const groupData = { id: groupDoc.id, ...groupDoc.data() };
        setGroup(groupData);

        // Get current user's role in the group
        const userGroupQuery = query(
          collection(db, "userGroups"),
          where("userId", "==", currentUser.uid),
          where("groupId", "==", groupId)
        );

        const userGroupSnap = await getDocs(userGroupQuery);

        if (userGroupSnap.empty) {
          // User is not a member of this group
          alert("You are not a member of this group");
          router.push("/groups");
          return;
        }

        setUserRole(userGroupSnap.docs[0].data().role || "Member");

        // Fetch all members
        const membersQuery = query(
          collection(db, "userGroups"),
          where("groupId", "==", groupId)
        );

        const membersSnapshot = await getDocs(membersQuery);

        // Get detailed info for each member
        const membersData = await Promise.all(
          membersSnapshot.docs.map(async (memberDoc) => {
            const userData = memberDoc.data();
            const userSnapshot = await getDoc(
              doc(db, "students", userData.userId)
            );

            return {
              id: userData.userId,
              role: userData.role || "Member",
              joinedAt: userData.joinedAt?.toDate?.() || new Date(),
              ...(userSnapshot.exists()
                ? userSnapshot.data()
                : {
                    firstName: "Unknown",
                    lastName: "User",
                    email: "",
                    year: "",
                    branch: "",
                  }),
            };
          })
        );

        setMembers(membersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group members:", error);
        setLoading(false);
      }
    };

    fetchGroupAndMembers();
  }, [currentUser, groupId, router]);

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      (member.email && member.email.toLowerCase().includes(query)) ||
      (member.branch && member.branch.toLowerCase().includes(query))
    );
  });

  // Sort members: Admins first, then by name
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (a.role === "Admin" && b.role !== "Admin") return -1;
    if (a.role !== "Admin" && b.role === "Admin") return 1;

    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  const navigateBack = () => {
    router.push("/dashboard/groups");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <button onClick={navigateBack} className="mr-2 text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Loading group members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={navigateBack} className="mr-2 text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {group?.name} - Members
            </h1>
            <p className="text-gray-600">
              {members.length} members in this group
            </p>
          </div>
        </div>
        {userRole === "Admin" && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
            // onClick={() => {/* Add invite functionality */}}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Members
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search members by name, email, or branch..."
          />
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex items-center">
          <Users className="w-5 h-5 mr-2 text-indigo-600" />
          <h2 className="text-lg font-semibold">Group Members</h2>
        </div>

        {sortedMembers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery
              ? "No members match your search query."
              : "No members found in this group."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Branch & Year
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  {userRole === "Admin" && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedMembers.map((member, index) => (
                  <tr
                    key={`${member.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    {/* {sortedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50"> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-200 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-medium">
                            {member.firstName?.[0]}
                            {member.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          {member.skills && member.skills.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {member.skills.slice(0, 3).join(", ")}
                              {member.skills.length > 3 && "..."}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {member.email || "No email available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.branch || "Unknown Branch"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.year ? `Year ${member.year}` : "Unknown Year"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.role === "Admin"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Shield className="w-3 h-3 mr-1 my-auto" />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {member.joinedAt instanceof Date
                          ? member.joinedAt.toLocaleDateString()
                          : "Unknown date"}
                      </div>
                    </td>
                    {userRole === "Admin" && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {currentUser && member.id !== currentUser.uid && (
                          <div className="flex space-x-2 justify-end">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              // onClick={() => {/* Change role functionality */}}
                            >
                              {member.role === "Admin"
                                ? "Remove Admin"
                                : "Make Admin"}
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              // onClick={() => {/* Remove member functionality */}}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
