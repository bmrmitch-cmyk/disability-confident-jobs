"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { X } from "lucide-react";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<"jobseeker" | "employer">("jobseeker");
  const [employerName, setEmployerName] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;
    login(email.trim(), name.trim(), type, type === "employer" ? employerName.trim() : undefined);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {user ? (
          <div className="modal-body">
            <h2>Welcome, {user.name}</h2>
            <p>Signed in as <strong>{user.type}</strong> &mdash; {user.email}</p>
            <button className="scan-button" onClick={logout}>Sign out</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body">
            <h2>Sign in or join</h2>
            <p>Create a profile to save jobs, get notifications, and manage your account.</p>
            <label className="auth-field">
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="auth-field">
              <span>Account type</span>
              <select value={type} onChange={(e) => setType(e.target.value as "jobseeker" | "employer")}>
                <option value="jobseeker">Jobseeker</option>
                <option value="employer">Employer / Organisation</option>
              </select>
            </label>
            {type === "employer" && (
              <label className="auth-field">
                <span>Organisation name</span>
                <input value={employerName} onChange={(e) => setEmployerName(e.target.value)} placeholder="Your company name" />
              </label>
            )}
            <p className="auth-note">No password needed. Your data stays on this device.</p>
            <button className="scan-button" type="submit">Continue</button>
          </form>
        )}
      </div>
    </div>
  );
}
