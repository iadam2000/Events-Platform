import { useState } from "react";
import { supabase } from "../lib/SupabaseClient";

export default function AuthForm({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {},
      });
      if (error) return setError(error.message);
      if (data.user) {
        const { error: profileInsertError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            is_staff: false,
          });

        if (profileInsertError) {
          console.error("Profile insert failed:", profileInsertError.message);
        } else {
          console.log("Profile created successfully");
        }
      }

      onAuth(); // trigger parent state update
    }
  };
  return (
    <form
      onSubmit={handleAuth}
      className="p-6 border rounded bg-white dark:bg-gray-800 shadow max-w-sm mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "Log In" : "Sign Up"}
      </h2>

      <input
        className="w-full border px-3 py-2 mb-3 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border px-3 py-2 mb-3 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>

      <p
        className="text-sm mt-4 cursor-pointer text-blue-500 hover:underline text-center"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Create an account" : "Already have an account?"}
      </p>

      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
    </form>
  );
}
