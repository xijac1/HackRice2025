import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface ProfileData {
  name: string;
  hasAsthma: boolean;
  hasCardioDisease: boolean;
  pregnant: boolean;
  ageGroup: string;
  lifestyleSmoking: boolean;
  lifestyleMold: boolean;
  sensitivity: string;
}

export interface AirQualityData {
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  aqi: number;
  category: string;
  dominantPollutant: string;
}

export interface HealthSuggestion {
  type: 'precaution' | 'recommendation' | 'warning' | 'tip';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface HealthContext {
  profile: ProfileData;
  airQuality: AirQualityData;
  location: string;
}

export async function generateHealthSuggestions(context: HealthContext): Promise<HealthSuggestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an AI health advisor specializing in air quality and respiratory health. Based on the following information, provide personalized health suggestions and precautions.

PROFILE INFORMATION:
- Name: ${context.profile.name}
- Health Conditions: 
  ${context.profile.hasAsthma ? '• Has Asthma' : ''}
  ${context.profile.hasCardioDisease ? '• Has Cardiopulmonary Disease' : ''}
  ${context.profile.pregnant ? '• Pregnant' : ''}
  ${context.profile.ageGroup !== 'adult' ? `• Age Group: ${context.profile.ageGroup}` : '• Age Group: Adult'}
- Lifestyle Factors:
  ${context.profile.lifestyleSmoking ? '• Exposed to Smoking' : ''}
  ${context.profile.lifestyleMold ? '• Exposed to Mold' : ''}
- Sensitivity Level: ${context.profile.sensitivity}

CURRENT AIR QUALITY (${context.location}):
- AQI: ${context.airQuality.aqi}
- Category: ${context.airQuality.category}
- Dominant Pollutant: ${context.airQuality.dominantPollutant}
- PM2.5: ${context.airQuality.pm25 || 'N/A'} μg/m³
- PM10: ${context.airQuality.pm10 || 'N/A'} μg/m³
- O3 (Ozone): ${context.airQuality.o3 || 'N/A'} μg/m³
- NO2: ${context.airQuality.no2 || 'N/A'} μg/m³

Please provide 3-5 specific, actionable health suggestions based on this person's profile and current air quality conditions. Consider:

1. Immediate precautions they should take
2. Activities they should avoid or modify
3. Protective measures they can implement
4. When to seek medical attention
5. Long-term health considerations

Format your response as a JSON array with this exact structure:
[
  {
    "type": "precaution|recommendation|warning|tip",
    "title": "Brief, clear title",
    "description": "Detailed explanation of what to do and why",
    "priority": "high|medium|low",
    "icon": "appropriate emoji or icon name"
  }
]

Be specific, practical, and consider the person's health conditions. Prioritize suggestions that are most relevant to their current situation.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions;
    } else {
      // Fallback: create a basic suggestion if JSON parsing fails
      return [{
        type: 'recommendation',
        title: 'Monitor Air Quality',
        description: 'Based on current conditions, consider limiting outdoor activities and monitoring your symptoms closely.',
        priority: 'medium',
        icon: '🌬️'
      }];
    }
  } catch (error) {
    console.error('Error generating health suggestions:', error);
    // Return fallback suggestions
    return [{
      type: 'warning',
      title: 'Unable to Generate AI Suggestions',
      description: 'Please check your air quality data and try again. In the meantime, consider limiting outdoor activities if air quality is poor.',
      priority: 'low',
      icon: '⚠️'
    }];
  }
}
