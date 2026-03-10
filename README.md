# Career Guide App 🚀

A comprehensive Skill Recommendation and Career Guidance mobile app built with Expo, React Native, and Appwrite.

## Features

- **User Authentication**: Secure login and registration with Appwrite
- **Personalized Onboarding**: Multi-step questionnaire to understand user interests and background
- **Career Recommendations**: AI-powered career path suggestions based on user profile
- **Interactive Roadmaps**: Step-by-step learning paths for each career
- **Progress Tracking**: Monitor your learning journey and completed modules
- **Resource Library**: Curated learning resources for each career step
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React Native, Expo Router
- **Styling**: Tailwind CSS, NativeWind
- **Backend**: Appwrite (Authentication & Database)
- **State Management**: React Hooks
- **Navigation**: Expo Router (File-based routing)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Appwrite account

### 1. Install Dependencies

```bash
npm install
```

### 2. Appwrite Setup

1. Create a new Appwrite project at [appwrite.io](https://appwrite.io)
2. Enable Authentication (Email/Password)
3. Create a Database
4. Create the following collections:
   - `users` (for user profiles and preferences)
   - `careers` (for career data)
   - `progress` (for tracking user progress)

### 3. Configure Appwrite

Update `lib/appwrite.ts` with your Appwrite credentials:

```typescript
export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'YOUR_PROJECT_ID',
  databaseId: 'YOUR_DATABASE_ID',
  userCollectionId: 'USER_COLLECTION_ID',
  careerCollectionId: 'CAREER_COLLECTION_ID',
  progressCollectionId: 'PROGRESS_COLLECTION_ID',
};
```

### 4. Run the App

```bash
npx expo start
```

## Project Structure

```
app/
├── (tabs)/           # Main tab navigation
│   ├── index.tsx     # Home screen with recommendations
│   ├── careers.tsx   # Browse all careers
│   ├── progress.tsx  # Track learning progress
│   ├── profile.tsx   # User profile and settings
│   └── onboarding.tsx # Initial user questionnaire
├── auth/             # Authentication screens
│   ├── login.tsx     # Login screen
│   └── register.tsx  # Registration screen
├── career/
│   └── [id].tsx      # Career detail and roadmap
└── _layout.tsx       # Root layout configuration

lib/
├── appwrite.ts       # Appwrite configuration
├── auth.ts          # Authentication service
└── careerService.ts  # Career data and recommendations

types/
└── user.ts          # TypeScript type definitions
```

## Key Features Explained

### Authentication Flow
1. Users register/login with email and password
2. After login, users complete a 3-step onboarding process
3. User preferences are saved to Appwrite database

### Career Recommendations
- Based on user interests, educational background, and experience level
- Includes hot career paths with high growth rates
- Each career includes salary ranges and required skills

### Interactive Roadmaps
- Step-by-step learning paths for each career
- Mark steps as completed to track progress
- Curated resources (courses, books, videos, projects)
- Prerequisites and estimated duration for each step

### Progress Tracking
- Visual progress indicators for each career path
- Achievement system to motivate users
- Current step tracking and resume functionality

## Development

### Adding New Careers

Update `lib/careerService.ts` to add new career paths:

```typescript
const newCareer: Career = {
  $id: 'unique-id',
  title: 'Career Title',
  description: 'Career description',
  category: 'Category',
  requiredSkills: ['Skill1', 'Skill2'],
  averageSalary: '$X - $Y',
  growthRate: 'Z%',
  roadmap: [...],
  isHot: true/false
};
```

### Customizing UI

The app uses Tailwind CSS for styling. Modify colors and layouts in the respective component files.

### Database Schema

**Users Collection:**
- name: string
- email: string
- interests: string[]
- background: string
- experienceLevel: string
- createdAt: timestamp

**Careers Collection:**
- title: string
- description: string
- category: string
- requiredSkills: string[]
- roadmap: object[]
- isHot: boolean

**Progress Collection:**
- userId: string
- careerId: string
- completedSteps: string[]
- currentStep: string
- completionPercentage: number

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
