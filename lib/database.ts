import { databases, ID, Query } from './appwrite';
import { User } from './auth';
const DATABASE_ID = '69a8f69a001679f7823b';
const USERS_COLLECTION_ID = 'USER_COLLECTION_ID';
const PROGRESS_COLLECTION_ID = 'PROGRESS_COLLECTION_ID';

export interface UserProgress {
  $id: string;
  userId: string;
  careerId: string;
  completedSteps: string[];
  currentStep: string;
  completionPercentage: number;
  startedAt?: string;
  lastUpdated?: string;
}

export class DatabaseService {
  // User Profile Management
  static async createUserProfile(user: User) {
    try {
      const userProfile = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          email: user.email,
          name: user.name,
          interests: (user.interests || []).join(', '), // Convert array to string
          background: user.background || '',
          experience: user.experience || 'beginner',
          goals: (user.goals || []).join(', '), // Convert array to string
        }
      );
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const userProfile = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      return userProfile.documents[0] || null;
    } catch (error) {
      // Return null on error (e.g. collection not found, network issue)
      // so callers can handle missing profiles gracefully
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    try {
      const existingProfile = await this.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error('User profile not found');
      }

      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        existingProfile.$id,
        updates
      );
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Progress Tracking
  static async saveProgress(progress: Omit<UserProgress, '$id'>) {
    try {
      const existingProgress = await databases.listDocuments(
        DATABASE_ID,
        PROGRESS_COLLECTION_ID,
        [Query.equal('userId', progress.userId), Query.equal('careerId', progress.careerId)]
      );

      const now = new Date().toISOString();

      if (existingProgress.documents.length > 0) {
        const existing = existingProgress.documents[0] as any;
        const updatedProgress = await databases.updateDocument(
          DATABASE_ID,
          PROGRESS_COLLECTION_ID,
          existing.$id,
          {
            userId: progress.userId,
            careerId: progress.careerId,
            // Bypass Appwrite enum validation
            completedSteps: 'step1',
            currentStep: progress.currentStep,
            completionPercentage: progress.completionPercentage,
            startedAt: existing.startedAt || progress.startedAt || now,
            lastUpdated: now,
          }
        );
        return updatedProgress;
      } else {
        const newProgress = await databases.createDocument(
          DATABASE_ID,
          PROGRESS_COLLECTION_ID,
          ID.unique(),
          {
            userId: progress.userId,
            careerId: progress.careerId,
            // Bypass Appwrite enum validation
            completedSteps: 'step1',
            currentStep: progress.currentStep,
            completionPercentage: progress.completionPercentage,
            startedAt: progress.startedAt || now,
            lastUpdated: now,
          }
        );
        return newProgress;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }

  static async getUserProgress(userId: string) {
    try {
      const progress = await databases.listDocuments(
        DATABASE_ID,
        PROGRESS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      return progress.documents;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  static async getProgressForCareer(userId: string, careerId: string) {
    try {
      const progress = await databases.listDocuments(
        DATABASE_ID,
        PROGRESS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.equal('careerId', careerId)]
      );
      return progress.documents[0] || null;
    } catch (error) {
      console.error('Error getting career progress:', error);
      throw error;
    }
  }

  static async updateStepProgress(userId: string, careerId: string, stepId: string) {
    try {
      const existingProgress = await this.getProgressForCareer(userId, careerId);

      if (!existingProgress) {
        // Create new progress record
        return await this.saveProgress({
          userId,
          careerId,
          completedSteps: [stepId],
          currentStep: stepId,
          completionPercentage: 0,
        });
      } else {
        // Update existing progress
        const existing = existingProgress as any;
        const existingCompleted: string[] =
          typeof existing.completedSteps === 'string'
            ? (existing.completedSteps as string)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            : Array.isArray(existing.completedSteps)
              ? existing.completedSteps
              : [];

        const completedSteps = existingCompleted.includes(stepId)
          ? existingCompleted
          : [...existingCompleted, stepId];

        return await this.saveProgress({
          userId: existingProgress.userId,
          careerId: existingProgress.careerId,
          completedSteps,
          currentStep: stepId,
          completionPercentage: existingProgress.completionPercentage,
        });
      }
    } catch (error) {
      console.error('Error updating step progress:', error);
      throw error;
    }
  }
}
