"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import ProfileLogin from "@/components/profile/ProfileLogin";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<any>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && !profileData) {
      const user = session.user as any;
      if (user.profileKey) {
        fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: user.profileKey }),
        })
          .then(r => r.json())
          .then(data => {
            setProfileData(data);
            setSessionKey(user.profileKey);
          })
          .catch(() => {});
      }
    }
  }, [session]);

  if (status === "loading") {
    return <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-green-400/50 font-mono text-sm">Loading...</div>
    </div>;
  }

  if (!profileData) {
    return <ProfileLogin onLogin={(data, key) => { setProfileData(data); setSessionKey(key); }} />;
  }

  return (
    <ProfileDashboard
      profile={profileData}
      onLogout={() => { setProfileData(null); setSessionKey(null); }}
      onRefresh={async () => {
        if (!sessionKey) return;
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: sessionKey }),
        });
        if (res.ok) setProfileData(await res.json());
      }}
    />
  );
}