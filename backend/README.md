# Calorie Tracker Backend

Express.js backend server with MongoDB for the calorie tracker app.

## Setup Instructions

### 1. Install MongoDB
Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community

Or use MongoDB via Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Start MongoDB
After installation, MongoDB should start automatically. Verify it's running:
```bash
mongosh
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm run dev
```

The server will start on http://localhost:3000

## API Endpoints

### User Profile
- **POST** `/api/users` - Create user profile
  ```json
  {
    "uid": "user123",
    "goal": "lose",
    "targetCalories": 1500
  }
  ```

- **GET** `/api/users/:uid` - Get user profile
- **PATCH** `/api/users/:uid` - Update user profile

### Daily Logs
- **POST** `/api/daily-logs` - Log food item
  ```json
  {
    "uid": "user123",
    "date": "2024-03-15",
    "foodItem": {
      "name": "Apple",
      "calories": 95
    }
  }
  ```

- **GET** `/api/daily-logs/:uid/:date` - Get daily log
- **DELETE** `/api/daily-logs/:uid/:date/:timestamp` - Delete food item

### Health Check
- **GET** `/health` - Server health status

## Environment Variables
Create a `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/calorie-tracker
```

## Testing
Test the API using the health endpoint:
```bash
curl http://localhost:3000/health
```
