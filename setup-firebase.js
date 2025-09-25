#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 SPEAK Firebase Setup');
console.log('=======================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  try {
    console.log('1. Checking Firebase CLI...');
    
    // Check if user is logged in
    try {
      execSync('npx firebase projects:list', { stdio: 'pipe' });
      console.log('✅ Firebase CLI is ready');
    } catch (error) {
      console.log('🔐 Please login to Firebase...');
      execSync('npx firebase login', { stdio: 'inherit' });
    }
    
    // Get project ID
    console.log('\n2. Firebase Project Setup');
    console.log('Please create a project at: https://console.firebase.google.com');
    
    const projectId = await askQuestion('Enter your Firebase Project ID: ');
    
    if (!projectId) {
      console.error('❌ Project ID is required');
      process.exit(1);
    }
    
    // Update .firebaserc
    const firebaseRc = {
      projects: {
        default: projectId
      }
    };
    
    fs.writeFileSync('.firebaserc', JSON.stringify(firebaseRc, null, 2));
    console.log(`✅ Updated .firebaserc with project ID: ${projectId}`);
    
    // Test build
    console.log('\n3. Testing build...');
    execSync('npm run build:client', { stdio: 'inherit' });
    console.log('✅ Build successful');
    
    // Test Firebase connection
    console.log('\n4. Testing Firebase connection...');
    execSync(`npx firebase use ${projectId}`, { stdio: 'inherit' });
    console.log('✅ Firebase project connected');
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy: npm run deploy:firebase');
    console.log('2. Test locally: npm run firebase:serve');
    console.log(`3. View app: https://${projectId}.web.app`);
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. Firebase project exists');
    console.log('2. You have permission to deploy');
    console.log('3. Project ID is correct');
  } finally {
    rl.close();
  }
}

setup();