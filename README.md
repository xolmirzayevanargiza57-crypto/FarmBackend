# Poultry Farm Management System - Backend

Complete REST API for Poultry Farm Management with AI-integrated statistics and advice!

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Groq AI API** (for smart farm analysis)

## Features
- Flock Management
- Egg Production Tracking
- Feed & Health Records
- Sales & Expense Tracking
- AI-Generated Farm Advice (Uzbek Language)
- Dashboard Statistics

## Setup
1. `npm install`
2. Create `.env` file from the following template:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GROQ_API_KEY=your_groq_api_key
   ```
3. Run `npm run seed` to populate 30 days of sample data.
4. Run `npm start` or `npm run dev`.

## Deployment
Compatible with **Render**, Railway, or Heroku.
