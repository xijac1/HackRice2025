"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Heart, AlertCircle, Home, Factory } from "lucide-react";

type Profile = {
  name: string;
  hasAsthma: boolean;
  hasCardioDisease: boolean;
  pregnant: boolean;
  ageGroup: string;
  lifestyleSmoking: boolean;
  lifestyleMold: boolean;
  sensitivity: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    hasAsthma: false,
    hasCardioDisease: false,
    pregnant: false,
    ageGroup: "adult",
    lifestyleSmoking: false,
    lifestyleMold: false,
    sensitivity: "medium",
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (data) setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const saveProfile = (updates: Partial<Profile>) => {
    setProfile({ ...profile, ...updates });
  };

  const handleSaveAndReturn = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <Card className="max-w-md mx-auto shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <User className="w-6 h-6" />
            Health Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => saveProfile({ name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Sensitivity Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Health Conditions (Tighter thresholds applied)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Asthma
                </span>
                <Switch
                  checked={profile.hasAsthma}
                  onCheckedChange={(checked) => saveProfile({ hasAsthma: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cardiopulmonary Disease</span>
                <Switch
                  checked={profile.hasCardioDisease}
                  onCheckedChange={(checked) => saveProfile({ hasCardioDisease: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Pregnant</span>
                <Switch
                  checked={profile.pregnant}
                  onCheckedChange={(checked) => saveProfile({ pregnant: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Child/Older Adult</span>
                <Switch
                  checked={profile.ageGroup !== "adult"}
                  onCheckedChange={(checked) => saveProfile({ ageGroup: checked ? "sensitive" : "adult" })}
                />
              </div>
            </div>
          </div>

          {/* Lifestyle/Domestic Risks */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Lifestyle & Home Risks
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  Exposure to Smoking/Mold
                </span>
                <Switch
                  checked={profile.lifestyleSmoking || profile.lifestyleMold}
                  onCheckedChange={(checked) =>
                    saveProfile({ lifestyleSmoking: checked, lifestyleMold: checked })
                  }
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            These settings adapt recommendations (e.g., Avoid outdoors if high sensitivity during Caution air).
          </p>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary" onClick={handleSaveAndReturn}>
              Save & Return
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}