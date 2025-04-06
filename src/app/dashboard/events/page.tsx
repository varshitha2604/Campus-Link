"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  //   Filter,
  ArrowUpDown,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
// import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  description?: string;
  createdBy: string;
  creatorName: string;
  creatorEmail: string;
  attendees: number;
}

interface NewEventForm {
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  description: string;
}

export default function Events() {
  // State variables
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { currentUser } = useAuth();

  // Form state
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "Social",
    description: "",
  });

  const categories = [
    "All",
    "Workshop",
    "Career",
    "Academic",
    "Volunteer",
    "Sports",
    "Social",
    "Birthday",
    "Cultural",
  ];

  // Load events from Firebase
  const fetchEvents = async () => {
    setLoading(true);
    try {
      let eventsQuery = query(collection(db, "events"), orderBy("date", "asc"));

      // Apply date filter if it exists
      if (dateFilter) {
        eventsQuery = query(eventsQuery, where("date", "==", dateFilter));
      }

      const querySnapshot = await getDocs(eventsQuery);

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Load events when component mounts or filters change
  useEffect(() => {
    fetchEvents();
  }, [dateFilter]);

  // Create a new event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please sign in to create an event");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "events"), {
        ...newEvent,
        createdBy: currentUser.uid,
        creatorName:
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Anonymous",
        creatorEmail: currentUser.email,
        createdAt: new Date(),
        attendees: 0,
      });

      setShowModal(false);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        category: "Social",
        description: "",
      });

      fetchEvents();
    } catch (error) {
      console.error("Error creating event: ", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser) return;

    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    }
  };

  // Join an event (increment attendees count)
  const handleJoinEvent = async (eventId: string) => {
    if (!currentUser) {
      alert("Please sign in to join events");
      return;
    }

    try {
      //   const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDocs(
        query(
          collection(db, "eventAttendees"),
          where("eventId", "==", eventId),
          where("userId", "==", currentUser.uid)
        )
      );

      if (!eventDoc.empty) {
        alert("You have already joined this event!");
        return;
      }

      // Add user to attendees subcollection
      await addDoc(collection(db, "eventAttendees"), {
        eventId,
        userId: currentUser.uid,
        userName:
          currentUser.displayName ||
          currentUser.email?.split("@")[0] ||
          "Anonymous",
        joinedAt: new Date(),
      });

      // Update the attendee count
      const eventToUpdate = events.find((event) => event.id === eventId);
      if (eventToUpdate) {
        await addDoc(collection(db, "events"), {
          ...eventToUpdate,
          attendees: (eventToUpdate.attendees || 0) + 1,
        });
      }

      fetchEvents();
    } catch (error) {
      console.error("Error joining event: ", error);
    }
  };

  // Filter events by category and search term
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch =
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Campus Events</h1>
          <p className="text-gray-600">
            Discover and join events happening across campus
          </p>
        </div>
        <div className="flex gap-2">
          {/* {!currentUser ? (
            <Link href="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                <p>Hi, {currentUser.displayName || currentUser.email?.split('@')[0]}</p>
              </div>
              <button
                onClick={() => logout()}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm"
              >
                Sign Out
              </button>
            </div>
          )} */}
          <button
            onClick={() =>
              currentUser
                ? setShowModal(true)
                : alert("Please sign in to create events")
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-t overflow-x-auto">
          <div className="flex space-x-2 flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === selectedCategory
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <button
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
            onClick={() => {
              const sortedEvents = [...events].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              setEvents(sortedEvents);
            }}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sort by Date
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <p>
              No events found. Try adjusting your filters or create a new event.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {/* {filteredEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50"> */}
            {filteredEvents.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center min-w-24">
                    <p className="text-sm text-indigo-700 font-medium">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-lg font-bold text-indigo-800">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {event.category}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {event.time}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {event.location}
                      </p>
                    </div>

                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {event.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Organized by {event.organizer}
                      </p>
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-2">
                          {[...Array(Math.min(3, event.attendees || 0))].map(
                            (_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"
                              />
                            )
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {event.attendees || 0} attending
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-0 flex flex-col gap-2">
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                      disabled={!currentUser}
                    >
                      Join
                    </button>

                    {currentUser && event.createdBy === currentUser.uid && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Create New Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 border rounded-lg"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3:00 PM - 5:00 PM"
                    className="w-full p-2 border rounded-lg"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer*
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.organizer}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, organizer: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={newEvent.category}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, category: e.target.value })
                  }
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
