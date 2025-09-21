"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, Lightbulb, Shield, Loader2 } from "lucide-react";
import { HealthSuggestion } from "@/lib/aiHealthService";

interface HealthSuggestionsProps {
  suggestions: HealthSuggestion[];
  loading: boolean;
  error: string | null;
}

const getSuggestionIcon = (type: string, icon: string) => {
  const iconMap = {
    warning: <AlertTriangle className="w-5 h-5 text-red-500" />,
    precaution: <Shield className="w-5 h-5 text-yellow-500" />,
    recommendation: <Lightbulb className="w-5 h-5 text-blue-500" />,
    tip: <Brain className="w-5 h-5 text-green-500" />,
  };
  
  return iconMap[type as keyof typeof iconMap] || <Brain className="w-5 h-5 text-gray-500" />;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function HealthSuggestions({ suggestions, loading, error }: HealthSuggestionsProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Brain className="w-6 h-6" />
            AI Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Generating personalized health recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Brain className="w-6 h-6" />
            AI Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">Unable to generate suggestions</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Brain className="w-6 h-6" />
            AI Health Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No suggestions available at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Brain className="w-6 h-6" />
          AI Health Suggestions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Personalized recommendations based on your health profile and current air quality
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSuggestionIcon(suggestion.type, suggestion.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {suggestion.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPriorityColor(suggestion.priority)}`}
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> These suggestions are generated by AI and should not replace professional medical advice. 
            Consult your healthcare provider for personalized medical guidance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
