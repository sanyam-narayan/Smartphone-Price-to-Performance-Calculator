# Spec/₹ — Budget Phone Value Index

A small full-stack web application that ranks budget Android phones based on their performance-per-rupee, allowing users to dynamically customize the weights for different specifications.

## Tech Stack
**MEEN Stack:**
- **MongoDB**: Database for storing phone specifications.
- **Express.js**: Backend framework for handling routes and APIs.
- **EJS**: Embedded JavaScript templates for server-side rendering of views.
- **Node.js**: Runtime environment.

## How the Value Score is Calculated
Each specification (like AnTuTu, RAM, battery, display, and camera) is first normalized to a 0–100 score relative to the phones currently in the database. These normalized scores are blended using user-adjustable weights to create a Performance Score. Then a price advantage is applied so cheaper phones get a meaningful bonus without letting very weak budget phones outrank better devices. The final result is normalized across the current list to produce a 0–100 Value Score for ranking.

## How to Run Locally

### 1. Environment Setup
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you have MongoDB running locally (default URI: `mongodb://localhost:27017/spec_rs_phone_index`) or provide a cloud connection string.

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed the Database
Run the seed script to insert placeholder data so the database isn't empty on the first run:
```bash
npm run seed
```

### 4. Start the Server
```bash
npm start
```
Open `http://localhost:3000` in your browser.

## Future Improvements
- **Data Validation & Sanitization**: Add comprehensive server-side validation (e.g., using Joi or Zod) to prevent malformed data insertion.
- **Authentication**: Restrict the `/add` route and phone creation capabilities to authorized admins.
- **Edit/Delete Routes**: Add routes to manage existing phones without accessing the database directly.
- **Caching**: Implement simple caching (like Redis or in-memory) for the phone list since specs rarely change, optimizing performance on the dashboard.
