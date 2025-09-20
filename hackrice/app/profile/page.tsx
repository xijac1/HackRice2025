"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Add if needed
import { User, Heart, AlertCircle, Home, Factory } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    hasAsthma: false,
    hasCardioDisease: false,
    pregnant: false,
    ageGroup: "adult", // child, older-adult
    lifestyleRisks: { smoking: false, mold: false }, // Domestic risks
    sensitivity: "medium",
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("airSafeProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const saveProfile = (updates: any) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem("airSafeProfile", JSON.stringify(newProfile));
    // In prod, sync with backend for personalized thresholds
  };

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
                  checked={profile.lifestyleRisks.smoking || profile.lifestyleRisks.mold}
                  onCheckedChange={(checked) => saveProfile({ lifestyleRisks: { smoking: checked, mold: checked } })}
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            These settings adapt recommendations (e.g., Avoid outdoors if high sensitivity during Caution air).
          </p>

          <Button className="w-full bg-primary">Save & Apply</Button>
        </CardContent>
      </Card>
    </div>
  );
}