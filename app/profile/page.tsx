"use client";

import { useState, useEffect } from "react";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import ProfileLogin from "@/components/profile/ProfileLogin";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  useEffect(() => {
    // Restore session from sessionStorage (not localStorage — клиринг при закрытии вкладки)
    const saved = sessionStorage.getItem("profile_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileData(parsed.data);
        setSessionKey(parsed.key);
      } catch {
        sessionStorage.removeItem("profile_session");
      }
    }
  }, []);

  const handleLogin = (data: any, key: string) => {
    setProfileData(data);
    setSessionKey(key);
    sessionStorage.setItem("profile_session", JSON.stringify({ data, key }));
  };

  const handleLogout = () => {
    setProfileData(null);
    setSessionKey(null);
    sessionStorage.removeItem("profile_session");
  };

  const handleRefresh = async () => {
    if (!sessionKey) return;
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: sessionKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        sessionStorage.setItem("profile_session", JSON.stringify({ data, key: sessionKey }));
      }
    } catch {}
  };

  if (!profileData) {
    return <ProfileLogin onLogin={handleLogin} />;
  }

  return <ProfileDashboard profile={profileData} onLogout={handleLogout} onRefresh={handleRefresh} />;
}