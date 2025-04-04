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
        <form onSubmit={handleSubmit} className="mb-4 border p-4 rounded">
            <h3 className="font-semibold mb-2">Create New Event</h3>
            <input
                type="text"
                placeholder="Event name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block mb-2 border px-2 py-1"
                required
            />
            <input
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="block mb-2 border px-2 py-1"
                required
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded">
                Create Event
            </button>
        </form>
    );
}
