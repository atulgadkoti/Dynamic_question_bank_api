# Dynamic Question Bank API

An Dynamic question bank API that serves questions to students based on skill, difficulty level, and learning history. It tracks which questions each student has seen and  selects new questions at appropriate difficulty levels.

## Prerequisites
- Node.js 12 or higher
- npm

## Installation

```bash
npm install
```

## Running the Server

```bash
node app.js
```

The server will start on **http://localhost:3000**

You should see: `Server running on port 3000`

## Deployment

This project is deployed on Render and is available at:

https://dynamic-question-bank-api.onrender.com

You can test the live API by using the same endpoints shown below but replacing `http://localhost:3000` with the deployed base URL above. For example, use:

- GET https://dynamic-question-bank-api.onrender.com/api/questions?student_id=student123&skill=Math&sub_skill=Algebra&level=A&count=5
- POST https://dynamic-question-bank-api.onrender.com/api/questions/submit-answer (JSON body as shown below)

Thunder Client: create requests with the deployed URL in the request field and send.

## API Endpoints

### 1. Get Questions
**GET** `/api/questions`

Fetches unseen questions for a student based on skill, difficulty level, and count.

**Query Parameters:**
- `student_id` (required) — unique student identifier
- `skill` (required) — skill category (e.g., "Math", "English")
- `sub_skill` (required) — sub-skill within the skill (e.g., "Algebra", "Reading")
- `level` (required) — difficulty level: `A` (easiest), `B` (medium), `C` (hardest)
- `count` (required) — number of questions to retrieve

**How to test in Thunder Client (deployed):**
1. Open Thunder Client in VS Code.
2. Create a new request and set the method to `GET`.
3. Paste this URL:
  `https://dynamic-question-bank-api.onrender.com/api/questions?student_id=student123&skill=Math&sub_skill=Algebra&level=A&count=5`
4. Click Send.

**Example Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "skill": "Math",
      "sub_skill": "Algebra",
      "level": "A",
      "question_text": "What is 2 + 2?"
    }
  ],
  "served_count": 1,
  "fallback_used": false,
  "fallback_reason": ""
}
```

### 2. Submit Answer
**POST** `/api/questions/submit-answer`

Submits a student's answer to a question and records their response.

**Request Body:**
```json
{
  "student_id": "student123",
  "question_id": 1,
  "selected_answer": "A"
}
```

**How to test in Thunder Client (deployed):**
1. Open Thunder Client in VS Code.
2. Create a new request and set the method to `POST`.
3. Paste this URL:
  `https://dynamic-question-bank-api.onrender.com/api/questions/submit-answer`
4. Go to the Body tab, choose JSON, and add:
```json
{
  "student_id": "student123",
  "question_id": 1,
  "selected_answer": "A"
}
```
5. Click Send.

## Project Structure
- `app.js` — Main Express application setup
- `routes/questionRoutes.js` — API route handlers
- `store/memoryStore.js` — In-memory storage for student progress
- `data/questions.json` — Question data and metadata
- `services/` — Additional business logic (if added)

## Key Features
- **Adaptive Learning**: Serves different difficulty levels based on student progress
- **Question Tracking**: Remembers which questions each student has seen
- **Fallback Logic**: Automatically escalates difficulty if not enough questions at current level
- **In-Memory Storage**: Simple, fast storage for development and testing

## Testing
Use an HTTP client like:
- **Thunder Client** (VS Code extension)
- **Postman** (GUI)
- **Insomnia** (GUI)

The requests above are written for Thunder Client, so you can copy the URL, method, and JSON body directly into a request.

## Put This on GitHub
To upload this project to GitHub:
1. Create a new repository on GitHub.
2. Open a terminal in this project folder.
3. Run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

Replace `your-username` and `your-repo-name` with your GitHub details.

## Notes
- This is a minimal API for development and learning purposes
- Student progress is stored in memory and will be lost on server restart

## Author
Atul Gadkoti
