import { Account, Client, Databases, ID, Query } from 'appwrite';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
  careerCollectionId: process.env.EXPO_PUBLIC_APPWRITE_CAREER_COLLECTION_ID || '',
  progressCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROGRESS_COLLECTION_ID || '',
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };

