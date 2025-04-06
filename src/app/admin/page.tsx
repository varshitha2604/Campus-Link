"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  // serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2,
  //  Plus,
   Edit, Trash, Save, X } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPopular: boolean;
  // createdAt: any;
  // updatedAt: any;
};

export default function FAQAdminPanel() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for new/edit FAQ
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    tagInput: "",
    tags: [] as string[],
    isPopular: false,
  });

  const categories = [
    "General",
    "Academic",
    "Registration",
    "Financial Aid",
    "Technical",
    "Campus Life",
  ];

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "faqs"));
      const faqList: FAQ[] = [];

      querySnapshot.forEach((doc) => {
        faqList.push({ id: doc.id, ...doc.data() } as FAQ);
      });

      setFaqs(faqList);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
      tagInput: "",
      tags: [],
      isPopular: false,
    });
    setEditingId(null);
  };

  const handleAddTag = () => {
    if (
      formData.tagInput.trim() &&
      !formData.tags.includes(formData.tagInput.trim())
    ) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const faqData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        tags: formData.tags,
        isPopular: formData.isPopular,
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        // Update existing FAQ
        await updateDoc(doc(db, "faqs", editingId), faqData);
      } else {
        // Add new FAQ
        await addDoc(collection(db, "faqs"), {
          ...faqData,
          createdAt: new Date().toISOString(),
        });
      }

      resetForm();
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      tagInput: "",
      tags: faq.tags || [],
      isPopular: faq.isPopular || false,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteDoc(doc(db, "faqs", id));
        fetchFAQs();
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          FAQ Administration
        </h1>
        <p className="text-gray-600">
          Manage frequently asked questions for students
        </p>
      </div>

      {/* Add/Edit FAQ Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) =>
                    setFormData({ ...formData, tagInput: e.target.value })
                  }
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="Add tag and press enter"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-200 hover:bg-gray-300 px-4 rounded-r-md"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-indigo-500 hover:text-indigo-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPopular"
                className="ml-2 block text-sm text-gray-700"
              >
                Mark as popular FAQ
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update FAQ" : "Save FAQ"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Manage FAQs</h2>
        </div>

        {faqs.length > 0 ? (
          <div className="divide-y">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {faq.answer}
                    </p>

                    <div className="mt-2 flex items-center">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                        {faq.category}
                      </span>

                      {faq.tags &&
                        faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2"
                          >
                            {tag}
                          </span>
                        ))}

                      {faq.isPopular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No FAQs found. Add your first FAQ using the form above.
          </div>
        )}
      </div>
    </div>
  );
}
