"use client";

// import { useState } from "react";
import StudentSearch from "@/components/StudentSearch";

export default function StudentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
        <p className="text-gray-600">Search and connect with students across campus</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <StudentSearch />
      </div>
    </div>
  );
}