import EventList from "../components/EventList";
import { User } from "@supabase/supabase-js";

export default function EventsPage({ user }: { user: User }) {
    return (
        <main className="p-4">
            <p className="mb-4">Welcome, {user.email}</p>
            <EventList user={user}/>
        </main>
    );
}
