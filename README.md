# OkaySpace

OkaySpace is a neural operating system for your mental wellbeing. It provides a safe space for cognitive restructuring, emotional reframing, and self-reflection, powered by modern AI.

## Features

- **Echo**: An empathetic AI companion that uses Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) techniques to help you process your thoughts.
- **Prism**: Multi-perspective reframing. Input a negative thought, and Prism will generate six different perspectives (e.g., compassionate, stoic, future-self) to help you reframe it.
- **Sentiment Analysis**: Real-time detection of emotional undertones and cognitive distortions in your inputs.

## Tech Stack

### Frontend
- **React 18** with **Vite** for rapid development.
- **Zustand** for state management.
- **Three.js** & **React Three Fiber** for immersive 3D background elements.
- **Framer Motion** for smooth, organic animations.

### Backend
- **Node.js** & **Express** server.
- **Socket.io** for real-time interactions.
- **OpenAI API** for the core cognitive restructuring engine (with robust local fallbacks if an API key is not provided).
- **MongoDB** (Mongoose) for data persistence.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Adhan-Hashim/OkaySpace.git
   cd OkaySpace
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   Copy the example environment file and add your keys.
   ```bash
   cp .env.example .env
   ```

### Running the Application

You can run the frontend and backend concurrently using the root package scripts.

```bash
# In the root directory
npm run server
```
In another terminal:
```bash
npm run client
```

The application will be available at `http://localhost:5173`.

## Architecture & Graceful Degradation

OkaySpace is designed to be resilient. If an `OPENAI_API_KEY` is not provided in the backend, the system automatically falls back to an intelligent, rule-based response engine. This allows developers to test and run the application locally without incurring API costs.
