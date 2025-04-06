
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  //   arrayUnion,
  setDoc,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // Adjust path to match your firebase setup
import {
  Users,
  UserPlus,
  Calendar,
  MessageSquare,
  Paperclip,
  Send,
  ChevronLeft,
  File,
  Image,
  Video,
  FileText,
  X,
} from "lucide-react";

// interface GroupEvent {
//   title: string;
//   date: Timestamp;
//   groupId: string;
// }

import Link from "next/link";

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  fileURL?: string;
  fileType?: string;
  fileName?: string;
  timestamp: string | Date | FieldValue;
}

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  events: number;
  createdBy?: string;
  createdAt?: Timestamp;
}

interface MyGroup extends Group {
  role: "Admin" | "Member";
  unread: number;
  nextEvent: string;
}

interface NewGroup {
  name: string;
  description: string;
  category: string;
}

export default function Groups() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | MyGroup | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState<NewGroup>({
    name: "",
    description: "",
    category: "General",
  });

  // Fetch all groups
  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
      return;
    }

    const fetchGroups = async () => {
      try {
        const groupsSnapshot = await getDocs(collection(db, "groups"));
        const groupsData = groupsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Group[];
        setGroups(groupsData);

        // Fetch user's groups
        const userGroupsQuery = query(
          collection(db, "userGroups"),
          where("userId", "==", currentUser.uid)
        );
        const userGroupsSnapshot = await getDocs(userGroupsQuery);

        const userGroupsData = userGroupsSnapshot.docs.map(
          (doc) => doc.data().groupId
        );

        const myGroupsData = groupsData.filter((group) =>
          userGroupsData.includes(group.id)
        );

        // Get role information for each group
        const enrichedMyGroups = await Promise.all(
          myGroupsData.map(async (group) => {
            const userGroupDoc = userGroupsSnapshot.docs.find(
              (doc) => doc.data().groupId === group.id
            );

            // Get unread messages count
            const lastReadDoc = await getDoc(
              doc(db, "lastRead", `${currentUser.uid}_${group.id}`)
            );
            const lastReadTimestamp = lastReadDoc.exists()
              ? lastReadDoc.data().timestamp
              : 0;

            const messagesQuery = query(
              collection(db, "messages"),
              where("groupId", "==", group.id),
              where("timestamp", ">", lastReadTimestamp)
            );

            const unreadSnapshot = await getDocs(messagesQuery);
            const unreadCount = unreadSnapshot.docs.filter(
              (doc) => doc.data().senderId !== currentUser.uid
            ).length;

            // Get next event
            const eventsQuery = query(
              collection(db, "events"),
              where("groupId", "==", group.id),
              where("date", ">", new Date()),
              orderBy("date", "asc")
            );

            const eventsSnapshot = await getDocs(eventsQuery);
            const nextEvent =
              eventsSnapshot.docs.length > 0
                ? eventsSnapshot.docs[0].data().title +
                  ": " +
                  new Date(
                    eventsSnapshot.docs[0].data().date.toDate()
                  ).toLocaleDateString()
                : "No upcoming events";

            return {
              ...group,
              role: (userGroupDoc?.data().role || "Member") as
                | "Admin"
                | "Member",
              unread: unreadCount,
              nextEvent: nextEvent,
            };
          })
        );

        setMyGroups(enrichedMyGroups);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser, router]);


  // Listen for messages when a group is selected
  useEffect(() => {
    if (!selectedGroup) return;

    console.log("Setting up message listener for group:", selectedGroup.id);

    // Update the query to be simpler at first
    const messagesQuery = query(
      collection(db, "messages"),
      where("groupId", "==", selectedGroup.id),
      orderBy("timestamp", "asc")
    );

    try {
      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          console.log(
            "Received messages snapshot with",
            snapshot.docs.length,
            "messages"
          );

          const messagesData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp:
                data.timestamp?.toDate().toLocaleString() || "Just now",
            };
          }) as Message[];

          console.log("Processed messages:", messagesData);
          setMessages(messagesData);

          // Mark messages as read
          updateLastRead(selectedGroup.id);
        },
        (error) => {
          console.error("Error in messages listener:", error);
          // If there's an index error, let's try a simpler query without the orderBy
          if (error.code === "failed-precondition") {
            console.log("Trying simplified query without ordering");
            const simpleQuery = query(
              collection(db, "messages"),
              where("groupId", "==", selectedGroup.id)
            );

            const simpleUnsubscribe = onSnapshot(simpleQuery, (snapshot) => {
              const messagesData = snapshot.docs
                .map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  timestamp:
                    doc.data().timestamp?.toDate().toLocaleString() ||
                    "Just now",
                }))
                .sort((a, b) => {
                  // Manual sorting if we can't use orderBy
                  const timeA =
                    a.timestamp instanceof Date
                      ? a.timestamp
                      : new Date(a.timestamp);
                  const timeB =
                    b.timestamp instanceof Date
                      ? b.timestamp
                      : new Date(b.timestamp);
                  return timeA.getTime() - timeB.getTime();
                }) as Message[];

              setMessages(messagesData);
              updateLastRead(selectedGroup.id);
            });

            return simpleUnsubscribe;
          }
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up message listener:", error);
      return () => {};
    }
  }, [selectedGroup]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateLastRead = async (groupId: string) => {
    if (!currentUser) return;

    try {
      await setDoc(
        doc(db, "lastRead", `${currentUser.uid}_${groupId}`),
        {
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating last read:", error);
    }
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !fileUpload) || !selectedGroup || !currentUser)
      return;

    try {
      setUploading(true);
      let fileURL = undefined;
      let fileType = undefined;
      let fileName = undefined;

      // Upload file if exists
      if (fileUpload) {
        const fileRef = ref(
          storage,
          `groups/${selectedGroup.id}/${Date.now()}_${fileUpload.name}`
        );

        try {
          await uploadBytes(fileRef, fileUpload);
          fileURL = await getDownloadURL(fileRef);
        } catch (uploadError) {
          console.error("File upload error details:", uploadError);
          // Continue with just the text message
          fileURL = undefined;
        }
        fileType = fileUpload.type.split("/")[0]; // 'image', 'video', etc.
        fileName = fileUpload.name;
      }

      // Create message object with only defined fields
      const messageData: Partial<Message> = {
        groupId: selectedGroup.id,
        senderId: currentUser.uid,
        senderName:
          currentUser.displayName || currentUser.email || "Unknown User",
        text: message.trim(),
        timestamp: serverTimestamp(),
      };

      // Add file-related fields only if file was uploaded
      if (fileURL) {
        messageData.fileURL = fileURL;
        messageData.fileType = fileType;
        messageData.fileName = fileName;
      }

      // Add message to Firestore
      const docRef = await addDoc(collection(db, "messages"), messageData);
      console.log("Message sent with ID:", docRef.id);

      // Temporary add to messages state for immediate feedback
      const tempMessage: Message = {
        id: docRef.id,
        groupId: selectedGroup.id,
        senderId: currentUser.uid,
        senderName:
          currentUser.displayName || currentUser.email || "Unknown User",
        text: message.trim(),
        fileURL,
        fileType,
        fileName,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prev) => [...prev, tempMessage]);
      setMessage("");
      setFileUpload(null);
      setUploading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof Error) {
        alert(`Failed to send message: ${error.message}`);
      } else {
        alert("Failed to send message: An unknown error occurred.");
      }
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newGroup.name.trim() || !currentUser) return;

    try {
      setLoading(true);

      // Create new group
      const groupRef = await addDoc(collection(db, "groups"), {
        name: newGroup.name,
        description: newGroup.description,
        category: newGroup.category,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        members: 1,
        events: 0,
      });

      // Add user to group as admin
      await addDoc(collection(db, "userGroups"), {
        userId: currentUser.uid,
        groupId: groupRef.id,
        role: "Admin",
        joinedAt: serverTimestamp(),
      });

      // Reset form and refresh groups
      setNewGroup({
        name: "",
        description: "",
        category: "General",
      });
      setShowCreateGroup(false);

      // Refresh groups list
      const groupData: Group = {
        id: groupRef.id,
        name: newGroup.name,
        description: newGroup.description,
        category: newGroup.category,
        createdBy: currentUser.uid,
        members: 1,
        events: 0,
      };

      setGroups([...groups, groupData]);
      setMyGroups([
        ...myGroups,
        {
          ...groupData,
          role: "Admin",
          unread: 0,
          nextEvent: "No upcoming events",
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error creating group:", error);
      setLoading(false);
    }
  };


  const handleJoinGroup = async (group: Group) => {
    if (!currentUser) return;

    try {
      // Check if user is already a member
      const userGroupQuery = query(
        collection(db, "userGroups"),
        where("userId", "==", currentUser.uid),
        where("groupId", "==", group.id)
      );

      const userGroupSnap = await getDocs(userGroupQuery);

      if (!userGroupSnap.empty) {
        // User is already a member, just open the group
        const existingGroup = myGroups.find((g) => g.id === group.id);
        setSelectedGroup(existingGroup || group);
        return;
      }

      // Add user to group
      await addDoc(collection(db, "userGroups"), {
        userId: currentUser.uid,
        groupId: group.id,
        role: "Member",
        joinedAt: serverTimestamp(),
      });

      // Update group members count
      const groupRef = doc(db, "groups", group.id);
      await updateDoc(groupRef, {
        members: (group.members || 0) + 1,
      });

      // Create a properly formatted MyGroup object
      const newMyGroup: MyGroup = {
        id: group.id,
        name: group.name,
        description: group.description,
        category: group.category,
        members: (group.members || 0) + 1,
        events: group.events || 0,
        createdBy: group.createdBy,
        createdAt: group.createdAt,
        role: "Member",
        unread: 0,
        nextEvent: "No upcoming events",
      };

      // Update local state
      setMyGroups((prev) => [...prev, newMyGroup]);

      // Update groups list
      setGroups((prev) =>
        prev.map((g) =>
          g.id === group.id ? { ...g, members: (g.members || 0) + 1 } : g
        )
      );

      // Open the group
      setSelectedGroup(newMyGroup);

      console.log("Successfully joined group:", group.name);
      console.log("Updated myGroups:", [...myGroups, newMyGroup]);
    } catch (error) {
      console.error("Error joining group:", error);
      if (error instanceof Error) {
        alert(`Failed to join group: ${error.message}`);
      } else {
        alert("Failed to join group: An unknown error occurred.");
      }
    }
  };

  const getFileIcon = (fileType: string | undefined) => {
    switch (fileType) {
      case "image":
        return <Image className="w-8 h-8 text-blue-500" />;
      case "video":
        return <Video className="w-8 h-8 text-red-500" />;
      case "application":
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campus Groups</h1>
          <p className="text-gray-600">
            Connect with others who share your interests
          </p>
        </div>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Create Group
        </button>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Group</h2>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newGroup.category}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg">
                  <option value="Placements">Placements</option>
                  <option value="Higher studies">Higher Studies</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Arts">Arts</option>
                  <option value="Sports">Sports</option>
                  <option value="Government sector">Government Sector</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Chat Interface */}
      {selectedGroup ? (
        <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-150px)] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b flex items-center">
            <button
              onClick={() => setSelectedGroup(null)}
              className="mr-2 text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-800">
                {selectedGroup.name}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedGroup.members} members
              </p>
            </div>

             <Link
    href={`/group-members?id=${selectedGroup.id}`}
    className="ml-auto px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center"
  >
    <Users className="w-4 h-4 mr-1" />
    View Members
  </Link>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-10">
                No messages yet. Start the conversation!
              </div>
            ) : (
              //   messages.map((msg) => (
              messages.map((msg, index) => (
                <div
                  //   key={msg.id}
                  //   className={`mb-4 max-w-[80%] ${
                  //     currentUser && msg.senderId === currentUser.uid
                  key={`${msg.id}-${index}`}
                  className={`mb-4 max-w-[80%] ${
                    currentUser && msg.senderId === currentUser.uid
                      ? "ml-auto"
                      : "mr-auto"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 ${
                      currentUser && msg.senderId === currentUser.uid
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-800 border"
                    }`}
                  >
                    {currentUser && msg.senderId !== currentUser.uid && (
                      <p className="text-xs font-medium mb-1">
                        {msg.senderName}
                      </p>
                    )}

                    {msg.text && <p>{msg.text}</p>}

                    {msg.fileURL && (
                      <div className="mt-2">
                        {msg.fileType === "image" ? (
                          <img
                            src={msg.fileURL}
                            alt="Shared image"
                            className="max-w-full rounded"
                          />
                        ) : (
                          <a
                            href={msg.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-2 rounded ${
                              currentUser && msg.senderId === currentUser.uid
                                ? "bg-indigo-400"
                                : "bg-gray-100"
                            }`}
                          >
                            {getFileIcon(msg.fileType)}
                            <span className="ml-2 text-sm truncate">
                              {msg.fileName}
                            </span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      currentUser && msg.senderId === currentUser.uid
                        ? "text-right"
                        : ""
                    }`}
                  >
                    {typeof msg.timestamp === "string"
                      ? msg.timestamp
                      : msg.timestamp.toLocaleString()}
                  </p>
                </div>
              ))
            )}
            <div ref={messageEndRef} />
          </div>

          {/* File Preview */}
          {fileUpload && (
            <div className="p-2 border-t flex items-center justify-between bg-gray-50">
              <div className="flex items-center">
                {getFileIcon(fileUpload.type.split("/")[0])}
                <span className="ml-2 text-sm truncate max-w-xs">
                  {fileUpload.name}
                </span>
              </div>
              <button
                onClick={() => setFileUpload(null)}
                className="text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t flex items-center"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-indigo-600"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg mx-2"
              disabled={uploading}
            />
            <button
              type="submit"
              disabled={(!message.trim() && !fileUpload) || uploading}
              className={`p-2 rounded-full ${
                (!message.trim() && !fileUpload) || uploading
                  ? "bg-gray-200 text-gray-400"
                  : "bg-indigo-600 text-white"
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* My Groups */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">My Groups</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading your groups...
              </div>
            ) : myGroups.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                You haven&apos;t joined any groups yet. Discover groups below!
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-800">
                        {group.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          group.role === "Admin"
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {group.role}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {group.nextEvent}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-gray-400" />
                        {group.unread > 0 ? (
                          <span className="flex items-center">
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-1 text-xs">
                              {group.unread}
                            </span>
                            unread messages
                          </span>
                        ) : (
                          "No new messages"
                        )}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setSelectedGroup(group)}
                        className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded text-sm"
                      >
                        Open Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Groups */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Discover Groups</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full md:w-64 p-2"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading groups...
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 bg-indigo-200"></div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {group.name}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {group.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {group.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {group.members} members
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {group.events} events
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => handleJoinGroup(group)}
                          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded text-sm"
                        >
                          {myGroups.some((g) => g.id === group.id)
                            ? "Open Chat"
                            : "Join Group"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}




