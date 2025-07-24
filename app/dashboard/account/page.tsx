"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<null | "success" | "error" | "mismatch" | "loading">(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setError("");
    if (newPassword !== confirmPassword) {
      setStatus("mismatch");
      setError("New passwords do not match.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/account/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setStatus("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setStatus("error");
        setError(data.error || "Failed to update password.");
      }
    } catch {
      setStatus("error");
      setError("Failed to update password.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto mt-10 bg-darkBg p-8 rounded-lg border border-white/10">
        <h1 className="text-2xl font-outfit font-bold text-white mb-6">Account Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/70 font-outfit mb-2" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              className="w-full bg-black/30 px-4 py-3 rounded-lg text-white focus:outline-none"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-white/70 font-outfit mb-2" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              className="w-full bg-black/30 px-4 py-3 rounded-lg text-white focus:outline-none"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-white/70 font-outfit mb-2" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full bg-black/30 px-4 py-3 rounded-lg text-white focus:outline-none"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {status === "success" && (
            <div className="text-green-400 font-outfit">Password updated successfully!</div>
          )}
          {status === "error" && (
            <div className="text-red-400 font-outfit">{error}</div>
          )}
          {status === "mismatch" && (
            <div className="text-red-400 font-outfit">{error}</div>
          )}
          <button
            type="submit"
            className="bg-themeGradient hover:opacity-90 text-white px-6 py-3 rounded-md text-sm font-outfit font-medium transition-all duration-200 w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
} 