# Sudoku Solver Web App

This monorepo contains:
- `frontend`: ReactJS + TypeScript web client for Sudoku input and visualization
- `backend`: Java (Spring Boot) REST API for solving Sudoku puzzles

## Build & Run Instructions

### Frontend
1. Navigate to `frontend` folder
2. Install dependencies: `npm install`
3. Start development server: `npm start`

### Backend
1. Navigate to `backend` folder
2. Build and run with your preferred Java tool (Maven/Gradle)
   - Example (Maven): `mvn spring-boot:run`

## How it works
- The frontend allows users to input Sudoku puzzles and sends them to the backend for solving.
- The backend exposes a REST API endpoint to receive a puzzle and return the solution.

---

Replace placeholder code with your implementation as needed.