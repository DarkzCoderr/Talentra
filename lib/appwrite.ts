import { Account, Client, Databases, ID, Query } from 'appwrite';

export const appwriteConfig = {
  endpoint: 'https://sgp.cloud.appwrite.io/v1',
  projectId: '69a8f15d00007bba2e71', // Replace with your Appwrite project ID
  databaseId: '69a8f69a001679f7823b', // Replace with your database ID
  userCollectionId: 'USER_COLLECTION_ID', // Replace with your user collection ID
  careerCollectionId: 'CAREER_COLLECTION_ID', // Replace with your career collection ID
  progressCollectionId: 'PROGRESS_COLLECTION_ID', // Replace with your progress collection ID
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export { ID, Query };
