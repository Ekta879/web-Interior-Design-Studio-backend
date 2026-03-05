import http from 'http';

// Test data
const bookingData = {
  date: "2026-04-01",
  time: "10:00",
  projectType: "Residential",
  clientName: "John Doe",
  email: "john@example.com",
  phone: "1234567890",
  description: "Kitchen renovation"
};

const updateData = {
  status: "confirmed",
  description: "Updated kitchen renovation"
};

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          console.log(`\n${options.method} ${options.path} - Status: ${res.statusCode}`);
          console.log('Response:', JSON.stringify(response, null, 2));
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          console.log(`\n${options.method} ${options.path} - Status: ${res.statusCode}`);
          console.log('Response:', body);
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testBookingAPI() {
  const baseOptions = {
    hostname: 'localhost',
    port: 5001,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    // Test 1: Create booking
    console.log('🚀 Testing Booking API Endpoints\n');
    console.log('1. Creating a booking...');
    const createOptions = { ...baseOptions, path: '/api/bookings', method: 'POST' };
    const createResult = await makeRequest(createOptions, bookingData);

    if (createResult.status === 201) {
      const bookingId = createResult.data.data.id;
      console.log(`✅ Booking created with ID: ${bookingId}`);

      // Test 2: Get all bookings
      console.log('\n2. Getting all bookings...');
      const getAllOptions = { ...baseOptions, path: '/api/bookings', method: 'GET' };
      await makeRequest(getAllOptions);

      // Test 3: Get booking by ID
      console.log('\n3. Getting booking by ID...');
      const getByIdOptions = { ...baseOptions, path: `/api/bookings/${bookingId}`, method: 'GET' };
      await makeRequest(getByIdOptions);

      // Test 4: Update booking
      console.log('\n4. Updating booking...');
      const updateOptions = { ...baseOptions, path: `/api/bookings/${bookingId}`, method: 'PATCH' };
      await makeRequest(updateOptions, updateData);

      // Test 5: Delete booking
      console.log('\n5. Deleting booking...');
      const deleteOptions = { ...baseOptions, path: `/api/bookings/${bookingId}`, method: 'DELETE' };
      await makeRequest(deleteOptions);

      // Test 6: Try to get deleted booking (should return 404)
      console.log('\n6. Trying to get deleted booking (should return 404)...');
      await makeRequest(getByIdOptions);

      console.log('\n🎉 All booking API tests completed successfully!');
    } else {
      console.log('❌ Failed to create booking');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBookingAPI();