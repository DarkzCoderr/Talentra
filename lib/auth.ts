import { account, ID } from './appwrite';
import { DatabaseService } from './database';

export interface User {
  $id: string;
  email: string;
  name: string;
  interests?: string[];
  background?: string;
  experience?: string;
  goals?: string[];
}

export class AuthService {
  static async login(email: string, password: string) {
    try {
      // Check if there's already an active session and delete it
      try {
        await account.deleteSession('current');
      } catch (error) {
        // No active session, continue with login
      }

      const session = await account.createEmailPasswordSession(email, password);

      // Get user data and ensure profile exists
      const user = await account.get();
      const userProfile = await DatabaseService.getUserProfile(user.$id);

      if (!userProfile) {
        // Create user profile if it doesn't exist
        await DatabaseService.createUserProfile({
          $id: user.$id,
          email: user.email,
          name: user.name,
        });
      }

      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(email: string, password: string, name: string) {
    try {
      // Create user account
      const user = await account.create(ID.unique(), email, password, name);

      // Create user profile in database
      await DatabaseService.createUserProfile({
        $id: user.$id,
        email: user.email,
        name: user.name,
      });

      // Create session after successful registration
      await account.createEmailPasswordSession(email, password);

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  static async updateUserProfile(updates: Partial<User>) {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not logged in');
      }

      return await DatabaseService.updateUserProfile(user.$id, updates);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  static async getUserProfile() {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return null;
      }

      return await DatabaseService.getUserProfile(user.$id);
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }
}
