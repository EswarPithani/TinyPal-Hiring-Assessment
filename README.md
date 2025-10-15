# TinyPal - Parenting Companion App

A React Native mobile application providing educational parenting content through interactive flash cards and "Did You Know" insights, powered by AI assistant Tinu.


Project Structure
TinyPalApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BottomSheet.js
│   │   ├── Card.js
│   │   └── LoadingSpinner.js
│   ├── screens/            # App screens
│   │   ├── HomeScreen.js
│   │   ├── DidYouKnowScreen.js
│   │   └── FlashCardScreen.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── styles/             # Global styles and themes
│   │   └── global.js
│   ├── utils/              # Utility functions
│   │   └── responsive.js
│   └── hooks/              # Custom React hooks
│       └── useResponsive.js
├── assets/                 # Images, fonts, etc.
├── App.js                 # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies



## Features

- **Did You Know Screen**: Educational parenting insights with full-screen modal view
- **Flash Card Screen**: Interactive learning cards with flip animations
- **Tinu AI Assistant**: Bottom sheet with quick questions and chat interface
- **Responsive Design**: Adapts to all screen sizes and orientations
- **Professional UI**: Modern, accessible design with smooth animations

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation Stack
- **Animations**: React Native Animated API
- **State Management**: React Hooks (useState, useEffect)
- **API Integration**: Fetch API with error handling
- **Styling**: StyleSheet with responsive utilities

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Expo CLI
- Android Studio (for APK generation)
- iOS Simulator (for iOS testing, Mac only)

## Installation & Setup

### 1. Clone the Repository
git clone https://github.com/EswarPithani/TinyPal-Hiring-Assessment.git
cd TinyPalApp


2. Install Dependencies
npm install

Building APK -> expo build:android

API Integration
The app integrates with TinyPal backend APIs:

POST /p13n_answers - Get personalized educational content

POST /activate_tinu - Activate Tinu AI assistant


GenAI Usage Disclosure
This project utilized Deepseek for:

Code Structure: Component architecture and organization

API Integration: Data transformation and error handling patterns

UI/UX Design: Responsive design implementation and animations

Documentation: README and system design documentation

AI was used as a coding assistant to accelerate development while maintaining code quality and best practices.

Testing
Manual Testing Checklist
Navigation between screens works smoothly

Cards display correctly with images and content

Full-screen modals open and close properly

Tinu bottom sheet functions correctly

Responsive design works on different screen sizes

API calls succeed and handle errors gracefully

Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request


License
This project is developed as part of TinyPal hiring assignment.
