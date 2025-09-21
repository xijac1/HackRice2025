O'Hare Air web app provides personalized air quality monitoring that: 
Fetches real-time AQI and pollutant data from Google's Air Quality API Adapts risk thresholds based on user health profiles (asthma, heart conditions, pregnancy) 
Offers actionable recommendations like "avoid outdoor exercise until 2PM"

Frontend: 
Next.js 14 with TypeScript, 
Tailwind CSS, and shadcn/ui components 

Backend: Express.js server proxying Google Weather and Air Quality APIs 
APIs: Google Air Quality API, Google Weather API, Google Gemini Cloud assist API with custom air quality service with fallbacks 
Features: Real-time data fetching, localStorage persistence, Google Maps integration

Database:
Cloud SQL with Prisma integration, bcrypt password hashing, NextAuth authentication

To run:
Frontend:
- cd hackrice
- npm run dev
- (if there is a prisma client error, after cd hackrice > npx prisma generate > npm run dev)

Backend:
- cd backend
- npm start

Note: .env files are needed to run without errors
