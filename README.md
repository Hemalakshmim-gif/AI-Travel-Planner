# ✈️ AI Travel Planner

An intelligent, personalized travel planning web application that uses AI and real-world travel data to create detailed travel itineraries based on the user's destination, dates, budget, number of travelers, and interests.

The application combines **AI-powered itinerary generation** with real-world data from travel agents to provide useful recommendations for hotels, restaurants, places, weather, packing, and travel tips.

---

## 🌐 Live Demo

### Frontend
🔗 https://ai-travel-planner-ten-orcin.vercel.app/

### Backend API
🔗 https://ai-travel-planner-backend-nkt5.onrender.com

### GitHub Repository
🔗 https://github.com/Hemalakshmim-gif/AI-Travel-Planner

---

## 📌 Overview

Planning a trip often requires searching across multiple platforms for destinations, hotels, restaurants, weather information, attractions, budgets, and travel tips.

**AI Travel Planner** brings these requirements together into a single application.

Users can enter their:

- 📍 Destination
- 📅 Travel dates
- 👥 Number of travelers
- 💰 Budget
- ❤️ Travel interests

The application then generates a personalized travel plan using AI and real travel data.

---

## ✨ Features

### 🤖 AI-Powered Travel Planning

Generate personalized travel itineraries based on:

- Destination
- Travel dates
- Budget
- Number of travelers
- Personal interests

The AI analyzes the available travel data and generates a realistic daily itinerary.

---

### 💯 AI Match Score

Each generated trip receives an AI Match Score from **0–100**.

The score evaluates:

- Interest Match
- Budget Compatibility
- Weather Suitability
- Hotel Suitability
- Restaurant Suitability
- Place Relevance

The score is dynamically generated based on the actual trip information.

---

### 🏨 Real Hotel Recommendations

The application discovers real hotels around the selected destination using OpenStreetMap data.

Hotel information can include:

- Hotel name
- Location
- Distance
- Amenities
- Website
- Google Maps location
- Rating when available
- Price information when available

---

### 🍽️ Real Restaurant Recommendations

Restaurants are discovered using OpenStreetMap data.

Recommendations can include:

- Restaurant name
- Cuisine
- Price information
- Distance
- Speciality
- Website
- Google Maps location
- Rating when available

---

### 📍 Places to Explore

Discover real attractions and interesting places around the destination.

The application provides:

- Place name
- Description
- Category
- Address
- Best time to visit
- Coordinates
- Rating when available
- Website when available
- Google Maps integration

---

### 🗺️ Interactive Maps

The application uses **Leaflet** and **OpenStreetMap** to display discovered places on an interactive map.

Users can:

- View attractions on the map
- Explore individual markers
- Open locations in Google Maps

---

### 🌤️ Weather Information

The application retrieves weather information for the selected destination.

Weather information includes:

- Temperature
- Humidity
- Precipitation
- Wind speed
- Weather condition
- Sunrise
- Sunset
- Weather forecast

Weather information is also considered while generating the itinerary and packing recommendations.

---

### 🎒 AI Packing List

The application generates a destination-specific packing list based on:

- Weather
- Trip duration
- Planned activities
- Destination
- Traveler requirements

---

### 💡 AI Travel Insights

The application generates personalized travel insights covering areas such as:

- Planning
- Timing
- Weather
- Food
- Budget
- Photography
- Safety
- Transportation
- Local experiences
- Packing
- Activities

---

### 🧳 Travel Tips

The application provides practical destination-specific travel tips covering:

- Transportation
- Safety
- Weather
- Local etiquette
- Timing
- Budget
- Practical travel advice

---

### 👤 Authentication

Users can:

- Create an account
- Log in
- Access protected pages
- View their trips
- Save generated trips
- Delete trips
- Regenerate trips

Authentication uses **JWT-based authorization**.

Passwords are securely hashed using **bcrypt**.

---

### 💾 Saved Trips

Generated trips are stored in the database and can be accessed later.

Users can:

- View saved trips
- Open individual trips
- Update trips
- Delete trips
- Regenerate AI recommendations

---

### 🌙 Dark Mode

The application supports a modern dark mode with persistent theme selection.

The selected theme is stored locally so the preference remains after refreshing the application.

---

### 📱 Responsive UI

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

The interface includes responsive layouts for dashboards, cards, navigation, maps, and travel recommendations.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Router
- Axios
- Lucide React
- Leaflet
- React Leaflet

### Backend

- Node.js
- Express.js
- JavaScript
- Axios
- JWT
- bcrypt
- CORS
- dotenv

### Database

- TiDB Cloud
- MySQL-compatible database
- mysql2

### AI

- Google Gemini
- Google GenAI SDK

### Travel Data

- OpenStreetMap
- Overpass API
- Open-Meteo

### Deployment

- Vercel — Frontend
- Render — Backend
- TiDB Cloud — Database

---

## 🏗️ Project Architecture

```text
AI Travel Planner
│
├── Frontend
│   ├── React
│   ├── Vite
│   ├── React Router
│   ├── Axios
│   └── Leaflet
│
├── Backend
│   ├── Express
│   ├── Authentication
│   ├── Travel Agents
│   ├── Planner Agent
│   ├── Controllers
│   ├── Routes
│   └── Services
│
├── AI
│   └── Google Gemini
│
├── Database
│   └── TiDB Cloud
│
└── External APIs
    ├── OpenStreetMap
    ├── Overpass API
    └── Open-Meteo
