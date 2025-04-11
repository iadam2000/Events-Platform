import { useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import { User } from "@supabase/supabase-js";

export default function NewEventForm({
  user,
  onEventCreated,
}: {
  user: User;
  onEventCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("events").insert({
      name,
      datetime,
      created_by: user.id,
    });

    if (error) {
      console.error("Error creating event:", error.message);
      alert("Error creating event.");
      return;
    }

    alert("Event created!");
    setName("");
    setDatetime("");
    onEventCreated(); // Refresh the event list
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow max-w-md mx-auto"
    >
      <h3 className="text-lg font-semibold mb-4">Create New Event</h3>

      <input
        type="text"
        placeholder="Event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
        required
      />

      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
        Create Event
      </button>
    </form>
  );
}
