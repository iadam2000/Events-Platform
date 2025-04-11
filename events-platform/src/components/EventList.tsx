import { useEffect, useState } from "react";
import NewEventForm from "./NewEventForm";
import { supabase } from "../lib/SupabaseClient";
import { User } from "@supabase/supabase-js";

type Event = {
  id: string;
  name: string;
  datetime: string;
};

export default function EventList({ user }: { user: User }) {
  console.log(user + " Logged in!");
  const [isStaff, setIsStaff] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [signedUpEvents, setSignedUpEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshEvents();
    const fetchData = async () => {
      setLoading(true);

      // 1. Fetch staff status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_staff")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        console.log("Profile loaded:", profile);
        setIsStaff(profile?.is_staff || false);
      }
      // 2. Fetch all events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("datetime", { ascending: true });

      if (eventsError) {
        console.error("Error fetching events:", eventsError.message);
      } else {
        setEvents(eventsData);
      }

      // 3. Fetch signed-up events for this user
      const { data: signupsData, error: signupsError } = await supabase
        .from("signups")
        .select("event_id")
        .eq("user_id", user.id);

      if (signupsError) {
        console.error("Error fetching signups:", signupsError.message);
      } else {
        setSignedUpEvents(signupsData.map((row) => row.event_id));
      }
      setLoading(false);
    };

    fetchData();
  }, [user.id]);

  const handleSignup = async (eventId: string) => {
    const { error } = await supabase.from("signups").insert({
      user_id: user.id,
      event_id: eventId,
    });

    if (error) {
      if (error.code === "23505") {
        // unique constraint violation (already signed up)
        alert("You're already signed up for this event.");
      } else {
        console.error("Signup error:", error.message);
        alert("An error occurred while signing up.");
      }
      return;
    }

    // Update local state to show "Signed up"
    setSignedUpEvents((prev) => [...prev, eventId]);
    alert(`Signed up for event ${eventId}!`);
  };

  const refreshEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("datetime", { ascending: true });

    if (error) {
      console.error("Error refreshing events:", error.message);
    } else {
      setEvents(data);
    }
  };

  const handleAddToCalendar = (event: Event) => {
    const title = encodeURIComponent(event.name);
    const start = new Date(event.datetime)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(event.datetime).getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, ""); // assume 1 hour event

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=Join us for ${title}`;

    window.open(calendarUrl, "_blank");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
      {isStaff && <NewEventForm user={user} onEventCreated={refreshEvents} />}
      <p className="mb-2">{isStaff ? "You are staff ✅" : "Regular user"}</p>
      {loading ? (
        <p className="text-gray-500 italic">Loading events...</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <div className="text-lg font-medium">{event.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(event.datetime).toLocaleString()}
              </div>

              {signedUpEvents.includes(event.id) ? (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-green-600">✅ Signed up</span>
                  <button
                    className="text-blue-600 underline text-sm"
                    onClick={() => handleAddToCalendar(event)}
                  >
                    Add to Calendar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSignup(event.id)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign Up
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
