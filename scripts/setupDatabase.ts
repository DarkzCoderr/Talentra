import { databases } from '../lib/appwrite';

const DATABASE_ID = '69a8f69a001679f7823b';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database collections...');

    // Note: Appwrite doesn't have a programmatic API for creating collections
    // You must create collections manually in the Appwrite Console
    // This script provides the structure and attributes needed

    console.log('📋 Database Structure Required:');
    console.log('================================');
    
    console.log('\n👤 Users Collection:');
    console.log('   Collection ID: USER_COLLECTION_ID');
    console.log('   Attributes:');
    console.log('   - userId (String, Required, Size: 255)');
    console.log('   - email (String, Required, Size: 255)');
    console.log('   - name (String, Required, Size: 255)');
    console.log('   - interests (String Array, Optional)');
    console.log('   - background (String, Optional, Size: 500)');
    console.log('   - createdAt (DateTime, Required)');
    console.log('   - updatedAt (DateTime, Required)');
    console.log('   Permissions: Any (Read, Write, Delete)');

    console.log('\n📈 Progress Collection:');
    console.log('   Collection ID: PROGRESS_COLLECTION_ID');
    console.log('   Attributes:');
    console.log('   - userId (String, Required, Size: 255)');
    console.log('   - careerId (String, Required, Size: 255)');
    console.log('   - completedSteps (String Array, Required)');
    console.log('   - currentStep (String, Required, Size: 255)');
    console.log('   - startedAt (DateTime, Required)');
    console.log('   - lastUpdated (DateTime, Required)');
    console.log('   - completionPercentage (Integer, Required, Default: 0)');
    console.log('   Permissions: Any (Read, Write, Delete)');

    console.log('\n🔗 Database Configuration:');
    console.log('   Database ID:', DATABASE_ID);
    console.log('   Project ID: 69a8f15d00007bba2e71');
    console.log('   Endpoint: https://sgp.cloud.appwrite.io/v1');

    console.log('\n📖 Next Steps:');
    console.log('   1. Go to https://cloud.appwrite.io');
    console.log('   2. Select your project');
    console.log('   3. Go to Databases → Collections');
    console.log('   4. Create collections with the above specifications');
    console.log('   5. See DATABASE_SETUP.md for detailed instructions');

    console.log('\n🎉 Database setup guide complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Try to list collections to verify they exist
    try {
      const users = await databases.listDocuments(DATABASE_ID, 'USER_COLLECTION_ID', []);
      console.log('✅ Users collection accessible');
    } catch (error) {
      console.log('❌ Users collection not found - please create it');
    }

    try {
      const progress = await databases.listDocuments(DATABASE_ID, 'PROGRESS_COLLECTION_ID', []);
      console.log('✅ Progress collection accessible');
    } catch (error) {
      console.log('❌ Progress collection not found - please create it');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Run both functions
async function runSetup() {
  await setupDatabase();
  console.log('\n' + '='.repeat(50) + '\n');
  await testDatabaseConnection();
}

runSetup();
