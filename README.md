# 🌍 SmartEnviro – Real-Time Environmental Intelligence

SmartEnviro is a modern, high-performance web application designed to monitor real-time air quality, weather conditions, and environmental metrics using ASP.NET Core 9, SignalR, Spline 3D animations, and Firebase Realtime Database.

---

## 🚀 Features

* **3D Animated Landing Page**: Interactive full-screen 3D Spline animation (`waDdfpGiphbZsFsC/scene.splinecode`).
* **Real-Time Sensor Telemetry**: Live AQI, PM2.5, PM10, Temperature, Humidity, and Noise telemetry streaming via SignalR background service (`SensorDataWorker`).
* **Leaflet Geographic Map**: Interactive pin map displaying AQI ratings for monitored locations with dynamic high-contrast pins and dark mode popups.
* **Firebase User Authentication**: Account creation and sign-in using Firebase Authentication.
* **Cloud Progress Synchronization**: Automatic synchronization of user-monitored cities, units, and map preferences to Firebase Realtime Database.
* **Threshold Alerts**: Customizable environmental threshold management with historical alert logs.

---

## 🛠️ Tech Stack

* **Backend**: ASP.NET Core 9 Razor Pages + SignalR
* **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Tailwind CSS
* **Database & Auth**: Firebase Authentication & Realtime Database
* **3D Visuals**: `@splinetool/viewer` Web Components
* **Mapping**: Leaflet.js

---

## 📦 How to Run Locally

### Prerequisites
* [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) installed on your system.

### Steps
1. **Clone or Download Zip**:
   ```bash
   git clone https://github.com/kaditya9667/Smart-Enviro.git
   cd Smart-Enviro
   ```
2. **Run the Project**:
   ```bash
   dotnet run
   ```
3. **Open in Browser**:
   Navigate to **`http://localhost:5269`**.
