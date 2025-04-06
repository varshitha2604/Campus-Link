"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function CreateProject() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [category, setCategory] = useState("Development");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["CSE", "IT", "ECE", "MECH", "EEE", "CIVIL"];

  // Handle project creation
  const handleProjectCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (!title || !abstract || !category) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsUploading(true);
      const db = getFirestore();

      // Create project document
      await addDoc(collection(db, "projects"), {
        title,
        abstract,
        category,
        status: "Planning",
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
      });

      // Redirect to projects page after successful creation
      router.push("/dashboard/projects");
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to create project. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/projects"
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Project
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new project
          </p>
        </div>

        <form onSubmit={handleProjectCreate} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="title"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a descriptive title for your project"
              required
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="abstract"
            >
              Project Abstract *
            </label>
            <textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg h-36 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your project, its goals, and scope"
              required
            />
          </div>

          <div className="mb-8">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="category"
            >
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/projects"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 font-medium flex items-center"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
