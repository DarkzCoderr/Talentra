# Database Setup Instructions

## Appwrite Database Configuration

Your Career Guidance app uses Appwrite for authentication and data storage. Follow these steps to set up the database collections:

### 1. Go to Appwrite Console
- Navigate to [https://cloud.appwrite.io](https://cloud.appwrite.io)
- Select your project (ID: `69a8f15d00007bba2e71`)

### 2. Create Database Collections

#### Users Collection
1. Go to **Databases** → **Collections**
2. Click **Create Collection**
3. Use these settings:
   - **Collection ID**: `USER_COLLECTION_ID`
   - **Collection Name**: `Users`
   - **Permissions**: `Any` (Read, Write, Delete)

4. Add these attributes:
   - `userId` (String, Required, Size: 255)
   - `email` (String, Required, Size: 255)
   - `name` (String, Required, Size: 255)
   - `interests` (String, Optional, Size: 500) - Store as comma-separated values
   - `background` (String, Optional, Size: 500)

#### Progress Collection
1. Click **Create Collection** again
2. Use these settings:
   - **Collection ID**: `PROGRESS_COLLECTION_ID`
   - **Collection Name**: `Progress`
   - **Permissions**: `Any` (Read, Write, Delete)

3. Add these attributes:
   - `userId` (String, Required, Size: 255)
   - `careerId` (String, Required, Size: 255)
   - `completedSteps` (String Array, Required)
   - `currentStep` (String, Required, Size: 255)
   - `completionPercentage` (Integer, Required, Default: 0)

### 3. Verify Configuration

Your app is configured to use:
- **Database ID**: `69a8f69a001679f7823b`
- **Users Collection**: `USER_COLLECTION_ID`
- **Progress Collection**: `PROGRESS_COLLECTION_ID`

### 4. Test the Setup

1. Start your app:
   ```bash
   npm start
   ```

2. Try to register a new user
3. Check if user data appears in the Users collection
4. Try logging in and check if session works properly

## Authentication Flow

### Registration Process
1. User fills registration form
2. Account created in Appwrite Auth
3. User profile created in Users collection
4. Session automatically created
5. User redirected to onboarding

### Login Process
1. User fills login form
2. Existing session deleted (if any)
3. New session created
4. User profile verified/created if missing
5. User redirected to main app

### Progress Tracking
- User progress is stored in Progress collection
- Each career has its own progress record
- Completed steps are tracked as string array
- Progress percentage calculated automatically

## Troubleshooting

### "Collection with requested id could not be found"
- Make sure you created the collections with exact IDs
- Check that the database ID matches your project

### "Creation of a session is prohibited when a session is active"
- This is now fixed in the auth service
- The app automatically deletes existing sessions before login

### Registration/Login not working
- Check your Appwrite project ID
- Verify database collections exist
- Check console for error messages
- Ensure permissions are set to "Any"

## Next Steps

Once database is set up:
1. Test user registration
2. Test user login
3. Test progress saving
4. Test career roadmap functionality
5. Verify data persistence across app restarts
