#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SPEAK Firebase Deployment Script');
console.log('=====================================\n');

// Check if Firebase is configured
const firebaseRcPath = path.join(__dirname, '.firebaserc');
if (!fs.existsSync(firebaseRcPath)) {
  console.error('❌ Firebase not configured!');
  console.log('Please run: npm run firebase:init');
  process.exit(1);
}

// Read Firebase project ID
const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
const projectId = firebaseRc.projects.default;

if (projectId === 'your-firebase-project-id') {
  console.error('❌ Please update your Firebase project ID in .firebaserc');
  console.log('Replace "your-firebase-project-id" with your actual project ID');
  process.exit(1);
}

console.log(`📋 Project ID: ${projectId}`);
console.log('🔨 Building client application...\n');

try {
  // Build the client
  execSync('npm run build:client', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully!');
  
  // Check if dist/spa exists
  const distPath = path.join(__dirname, 'dist', 'spa');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output not found at dist/spa');
  }
  
  console.log('🚀 Deploying to Firebase Hosting...\n');
  
  // Deploy to Firebase
  execSync('npx firebase deploy --only hosting', { stdio: 'inherit' });
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log(`🌐 Your app is live at: https://${projectId}.web.app`);
  console.log(`🔧 Firebase Console: https://console.firebase.google.com/project/${projectId}`);
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  console.log('\n🔍 Troubleshooting steps:');
  console.log('1. Make sure you\'re logged in: npx firebase login');
  console.log('2. Check your Firebase project: npx firebase projects:list');
  console.log('3. Verify build output: ls -la dist/spa');
  console.log('4. Test locally: npm run firebase:serve');
  process.exit(1);
}