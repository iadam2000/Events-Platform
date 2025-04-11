import { useEffect, useState } from "react";
import { supabase } from "./lib/SupabaseClient";
import AuthForm from "./components/AuthForm";
import EventsPage from "./pages/EventsPage";
import { Session, User } from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then((response: { data: { user: User | null } }) => {
        setUser(response.data.user);
      });

    supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
  <div className="w-full max-w-3xl mx-auto">  
        {user ? (
          <EventsPage user={user} />
        ) : (
          <AuthForm
            onAuth={() =>
              supabase.auth
                .getUser()
                .then((response: { data: { user: User | null } }) =>
                  setUser(response.data.user)
                )
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;
