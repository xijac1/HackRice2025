"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Thermometer, AlertCircle } from "lucide-react";

export default function HealthPage() {
  const [symptoms, setSymptoms] = useState([{ date: "", symptom: "Cough", exposure: "PM2.5 high" }]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
    setSymptoms((prev) => prev.map((s, i) => (i === 0 && !s.date ? { ...s, date: formatter.format(new Date()) } : s)));
  }, []);

  const logSymptom = () => {
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
    setSymptoms([...symptoms, { date: formatter.format(new Date()), symptom: "Fatigue", exposure: "O3 exposure" }]);
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <Card className="max-w-2xl mx-auto shadow-sm border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Heart className="w-6 h-6" />
            Health Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Log Today's Symptoms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Cough/Breathlessness
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Fatigue
              </Button>
              <Button onClick={logSymptom} className="bg-primary text-primary-foreground">
                Log Custom
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recent Logs (Correlated to Exposure)</h3>
            <div className="space-y-3">
              {symptoms.map((log, i) => (
                <Card key={i} className="p-4 bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">{log.symptom}</span>
                    <span className="text-sm text-gray-600">{log.date} - {log.exposure}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 italic">
            Logs help correlate symptoms to air quality for better guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}