

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy
} from "firebase/firestore";
import {
//   Users,
  Plus,
  ArrowLeft,
//   Archive,
  Search,
  Filter,
//   ArrowUpDown
} from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  abstract: string;
  status: string;
  category: string;
  userId: string;
  userEmail: string;
}

export default function Projects() {
  const { currentUser } = useAuth();
//   const router = useRouter();

  // Project list state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Project detail view state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const categories = [
    "CSE",
    "IT",
    "ECE",
    "MECH",
    "EEE",
    "CIVIL",
  ];
//   const statuses = ["All", "Planning", "In Progress", "Review", "Completed"];

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const db = getFirestore();
      const projectsRef = collection(db, "projects");
      const q = query(projectsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const projectsList: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectsList.push({
          id: doc.id,
          title: data.title || "Untitled Project",
          abstract: data.abstract || "",
          status: data.status || "Planning",

          category: data.category || "Uncategorized",
          userId: data.userId || "",
          userEmail: data.userEmail || ""
        });
      });

      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }

  // View project details
  const viewProjectDetails = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setIsDetailViewOpen(true);
    }
  };

  // Filter projects based on search term, status, and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.abstract.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      statusFilter === "All" ||
      project.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      project.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Function to determine color based on status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Planning":
        return "text-blue-600 bg-blue-50";
      case "In Progress":
        return "text-amber-600 bg-amber-50";
      case "Review":
        return "text-purple-600 bg-purple-50";
      case "Completed":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Project detail view component
  const ProjectDetailView = () => {
    if (!selectedProject) return null;

    const isOwner = currentUser && currentUser.uid === selectedProject.userId;

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto my-8 px-4">
          <div className="mb-4">
            <button
              onClick={() => setIsDetailViewOpen(false)}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Projects
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selectedProject.title}</h1>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm px-2 py-1 rounded-full mr-2 ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Project Abstract</h2>
                <p className="text-gray-700">{selectedProject.abstract}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="text-md font-semibold mb-4">Project Details</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedProject.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created by:</span>
                    <span className="font-medium">{selectedProject.userEmail}</span>
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="flex justify-end space-x-3">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Update Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main projects UI
  return (
    <div className="max-w-7xl mx-auto p-4">
      {isDetailViewOpen && <ProjectDetailView />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-600">
            Track and manage collaborative projects
          </p>
        </div>
        <Link
          href={currentUser ? "/dashboard/projects/create" : "/login"}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              {statuses.map((status) => (
                <option key={status} value={status === "All" ? "" : status}>
                  {status}
                </option>
              ))}
            </select> */}

            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        <div className="p-4 border-t overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === categoryFilter
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading projects...</p>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    {/* <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span> */}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {project.abstract}
                    </p>

                    <div className="mb-4">
                      <div className="border rounded-md p-2">
                        <div className="text-xs text-gray-500">Category</div>
                        <div className="text-sm font-medium">
                          {project.category}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => viewProjectDetails(project.id)}
                      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded text-sm"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No projects found</p>
              <Link
                href={currentUser ? "/dashboard/projects/create" : "/login"}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 inline-block"
              >
                Create Your First Project
              </Link>
            </div>
          )}
        </>
      )}

      {/* Archived Projects */}
      {/* <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Archive className="w-5 h-5 mr-2 text-gray-500" />
            Archived Projects
          </h2>
          <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort by Date
          </button>
        </div>

        <div className="p-4">
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 mb-2">No archived projects yet</p>
            <p className="text-sm text-gray-400">
              Completed projects will appear here after they're archived
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}