"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    if (email === "noman@gmail.com" && password === "admin123") {
      setError("");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-800">
      <Image
        src="/background1.webp"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full border border-white/30"
      >
        {/* Person Image */}
        <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full overflow-hidden border-4 border-white">
          <Image
            src="/admin.jpeg"
            alt="Person"
            width={150}
            height={150}
            className="object-cover w-full h-full"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label className="block text-white font-medium">Email</label>
            <div className="flex items-center bg-white/30 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Mail className="text-gray-200" />
              <input
                type="email"
                className="ml-2 w-full bg-transparent text-white outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <label className="block text-white font-medium">Password</label>
            <div className="flex items-center bg-white/30 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="text-gray-200" />
              <input
                type={showPassword ? "text" : "password"}
                className="ml-2 w-full bg-transparent text-white outline-none placeholder-gray-300"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
