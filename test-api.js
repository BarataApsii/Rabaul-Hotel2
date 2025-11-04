const axios = require('axios');

const WORDPRESS_API_URL = 'https://cms.rabaulhotel.com.pg/wp-cms';

async function testEndpoint(endpoint) {
  try {
    console.log(`Testing ${endpoint}...`);
    const response = await axios.get(`${WORDPRESS_API_URL}/wp-json/wp/v2/${endpoint}?_embed&per_page=1`);
    console.log(`✅ Success: Found ${response.data.length} items`);
    if (response.data.length > 0) {
      const item = response.data[0];
      console.log('Sample item:', {
        id: item.id,
        title: item.title?.rendered,
        status: item.status,
        link: item.link
      });
    }
  } catch (error) {
    console.error(`❌ Error with ${endpoint}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function testAllEndpoints() {
  const endpoints = ['rooms', 'amenities', 'tourist-spots'];
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log('---');
  }
}

testAllEndpoints().catch(console.error);
