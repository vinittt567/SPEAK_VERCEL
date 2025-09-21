import axios from 'axios';

async function testLogin() {
  try {
    console.log('🧪 Testing login with demo account...');
    console.log('Email: test.student@ju.ac.in');
    console.log('Password: password123\n');

    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test.student@ju.ac.in',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      const { token, user } = response.data;
      console.log(`\n🎉 Anonymous ID generated: ${user.anonymousId}`);
      console.log(`📚 Course: ${user.profileData.course}`);
      console.log(`📅 Year: ${user.profileData.year}`);
      
      // Test token verification
      console.log('\n🔍 Testing token verification...');
      const verifyResponse = await axios.get('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (verifyResponse.status === 200) {
        console.log('✅ Token verification successful!');
      }
      
    }
  } catch (error) {
    console.log('❌ LOGIN FAILED');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();