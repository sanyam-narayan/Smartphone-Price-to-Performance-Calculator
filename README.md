Price to Performance Calculator for smartphones

A small full-stack web application that ranks budget Android phones based on their performance-per-rupee, allowing users to dynamically customize the weights for different specifications.

## Tech Stack
**MEEN Stack:**
- **MongoDB**: Database for storing phone specifications.
- **Express.js**: Backend framework for handling routes and APIs.
- **EJS**: Embedded JavaScript templates for server-side rendering of views.
- **Node.js**: Runtime environment.

## How the Value Score is Calculated
Each raw specification (like AnTuTu benchmark, RAM, Battery) is scaled to a 0–100 score relative to all other phones in the database using min-max normalization. These normalized scores are then combined using user-adjustable weights to produce a Performance Score. Finally, this Performance Score is divided by the phone's price to determine raw value-for-money, which is min-max normalized again to generate the final 0–100 Value Score used for ranking.

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
