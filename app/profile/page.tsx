"use client";

import { useState, useEffect } from "react";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import ProfileLogin from "@/components/profile/ProfileLogin";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  const handleLogin = (data: any, key: string) => {
    setProfileData(data);
    setSessionKey(key);
  };

  const handleLogout = () => {
    setProfileData(null);
    setSessionKey(null);
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
      }
    } catch {}
  };

  if (!profileData) {
    return <ProfileLogin onLogin={handleLogin} />;
  }

  return <ProfileDashboard profile={profileData} onLogout={handleLogout} onRefresh={handleRefresh} />;
}