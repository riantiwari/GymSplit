# GymSplit Generator

## Submitted by
Rian Tiwari (rtiwari3)

## Group Members
Rian Tiwari (rtiwari3)
Arushi Gupta (agupta38)

## App Description
GymSplit Generator creates personalized workout plans based on a user's goals, schedule, experience level, and available equipment. Users can save generated plans and track completed workouts.

## YouTube Video Link
[Add link here after recording demo]

## APIs
- [API Ninjas Exercises API](https://api-ninjas.com/api/exercises) — fetches exercises by muscle group and equipment

## Contact Email
agupta38@terpmail.umd.edu

## Deployed App Link
[(https://gymsplit.onrender.com)]

## AI Use
1. Claude (claude.ai)

---

## Running Locally

1. Clone the repo and navigate to the project folder
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   MONGO_CONNECTION_STRING=your_mongodb_atlas_uri
   EXERCISE_API_KEY=your_api_ninjas_key
   PORT=3000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Notes
- Get a free API Ninjas key at [api-ninjas.com](https://api-ninjas.com)
- The app includes fallback exercises if the API is unavailable — it will always generate a full plan
- Create a separate MongoDB user for this project to avoid conflicts with previous assignments
