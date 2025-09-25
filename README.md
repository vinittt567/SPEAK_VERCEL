# 🌿 SPEAK - Mental Health Support Platform

A comprehensive mental health support platform for students with AI-powered assistance, multilingual support, and gamification features.

## ✨ Features

### 🎯 Core Features
- **AI Chat Assistant** - First-aid mental health support with Vapi voice integration
- **Counselor Booking** - Easy appointment scheduling with filtering options
- **Community Forum** - Peer support and discussion platform
- **Resource Library** - Mental health resources and coping tools
- **Gamification System** - Points, badges, challenges, and rewards

### 🌐 Multilingual Support
- **English** - Default language
- **हिन्दी (Hindi)** - Complete Hindi translation
- **کٲشُر (Kashmiri)** - Full Kashmiri language support

### 🎙️ Voice Navigation
- **Voice Commands** - Navigate using natural language
- **Vapi Integration** - Advanced voice AI assistant
- **Multi-technique Navigation** - Robust fallback systems

### 🎮 Gamification
- **Daily Check-ins** - Streak tracking and rewards
- **Points System** - Earn points for engagement
- **Challenges** - 5-7 day focused challenges
- **Unlockables** - Themes, quotes, and audio rewards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- MongoDB (for backend)
- Firebase account (for deployment)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd SPEAK

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build the application
npm run build

# Start the server
npm start
```

### Development
```bash
# Start development server
npm run dev

# Build client only
npm run build:client

# Build server only
npm run build:server

# Type checking
npm run typecheck
```

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/speak

# JWT
JWT_SECRET=your-jwt-secret-key

# Vapi AI (Voice Assistant)
VITE_VAPI_PUBLIC_API_KEY=your-vapi-api-key
VITE_VAPI_ASSISTANT_ID=your-vapi-assistant-id

# Google AI
GOOGLE_GENAI_API_KEY=your-google-ai-key
```

### Firebase Deployment
```bash
# Setup Firebase
npm run firebase:setup

# Deploy to Firebase Hosting
npm run deploy:firebase

# Test locally
npm run firebase:serve
```

## 📱 Pages & Routes

- **`/`** - Homepage with language selection
- **`/chat`** - AI chat assistant
- **`/booking`** - Counselor appointment booking
- **`/resources`** - Mental health resources
- **`/forum`** - Community discussion forum
- **`/gamification`** - Rewards and challenges system
- **`/admin`** - Admin panel
- **`/panel/counselor`** - Counselor dashboard
- **`/panel/institute`** - Institute management

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & Voice
- **Vapi AI** - Voice assistant
- **Google Generative AI** - Text generation
- **Speech Recognition** - Voice commands

### Deployment
- **Firebase Hosting** - Frontend hosting
- **Netlify** - Alternative hosting
- **Vercel** - Alternative hosting

## 🌍 Internationalization

The app supports multiple languages with:
- **Language Context** - React context for language state
- **Translation System** - Key-based translations
- **Persistent Storage** - Language preference saved
- **Accessibility** - Proper language attributes

### Adding New Languages
1. Update `Language` type in `LanguageContext.tsx`
2. Add translations to the `translations` object
3. Update language selector options

## 🎮 Gamification System

### Points System
- **Daily Check-in**: +10 points
- **Complete Challenges**: +30-70 points
- **Resource Engagement**: Variable points

### Challenges
- **7-Day Sleep Challenge** - Build healthy sleep habits
- **5-Day Gratitude Journal** - Practice gratitude daily

### Unlockables
- **Aurora Theme** - Calming visual theme (150 pts)
- **Quotes Pack** - Daily motivational quotes (30 pts)
- **Nature Audio** - Relaxing nature sounds (120 pts)

## 🔊 Voice Navigation

### Voice Commands
- "Take me to booking" → `/booking`
- "Go to resources" → `/resources`
- "Navigate to forum" → `/forum`
- "Show me gamification" → `/gamification`
- "What page am I on?" → Current page info

### Setup Voice Assistant
1. Configure Vapi assistant with function tools
2. Add `navigate_to_page` and `get_current_page` functions
3. Update system instructions for navigation

## 🧪 Testing

### Navigation Testing
```bash
# Open navigation test page
http://localhost:3000/navigation-test

# Console commands
window.vapiNavigate("resources")
window.testVapiNavigation()
```

### Voice Testing
1. Click microphone button
2. Try voice commands
3. Check browser console for logs

## 📚 Documentation

- **`FIREBASE_DEPLOYMENT_GUIDE.md`** - Complete Firebase setup
- **`FIREBASE_QUICK_START.md`** - Quick deployment steps
- **`LANGUAGE_SYSTEM_README.md`** - Internationalization guide
- **`NAVIGATION_INTEGRATION_README.md`** - Voice navigation setup
- **`VAPI_FUNCTION_SETUP.md`** - Vapi configuration guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation files
- Open an issue on GitHub
- Review the troubleshooting guides

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Additional language support
- [ ] Advanced AI features
- [ ] Integration with healthcare systems
- [ ] Enhanced analytics and reporting

---

**SPEAK** - Supporting mental health with technology, compassion, and community. 🌿