import http from 'http';

const testData = {
  fullname: "Test User",
  username: "testuser" + Date.now(),
  email: "testuser" + Date.now() + "@test.com",
  password: "Test@1234"
};

console.log('📝 Testing Registration with data:', testData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n✅ Response Status: ${res.statusCode}`);
    try {
      const response = JSON.parse(body);
      console.log('Response Data:', JSON.stringify(response, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ Registration SUCCESSFUL!');
        console.log('New User ID:', response.user.id);
        console.log('Access Token:', response.access_token ? 'Generated' : 'Missing');
      } else {
        console.log('⚠️ Registration failed with status', res.statusCode);
      }
    } catch (e) {
      console.log('⚠️ Could not parse response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.log('Server is not running on port 5001');
  }
});

req.write(JSON.stringify(testData));
req.end();
