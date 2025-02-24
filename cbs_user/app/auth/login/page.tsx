"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simulate login
    login({ name: "John Doe", email });
    router.push("/dashboard"); // Updated path
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-4 p-2 border border-gray-700 bg-gray-800 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 p-2 border border-gray-700 bg-gray-800 rounded"
      />
      <button 
        onClick={handleLogin} 
        className="mt-4 bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage; 