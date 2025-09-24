// Test script to check if auth token is working
// This simulates what the dashboard does

console.log('🔐 Testing Authentication Token');

// Simulate browser localStorage (this won't work in Node.js, but shows the logic)
console.log('📝 In the browser, the dashboard should:');
console.log('1. Get token from localStorage.getItem("blog-auth-token")');
console.log('2. Send it as Authorization: Bearer <token>');
console.log('3. Server validates the token');

console.log('\n🧪 To test delete functionality:');
console.log('1. Open https://www.aitoolsinsights.com/blog/dashboard');
console.log('2. Open browser console (F12)');
console.log('3. Try to delete a test post');
console.log('4. Watch the console logs for detailed debugging info');

console.log('\n🔍 Look for these debug messages:');
console.log('- 🗑️ Starting delete process for post: [postId]');
console.log('- 🔑 Auth token available: true/false');
console.log('- 📡 Sending DELETE request to: /api/blog/unified?id=[postId]');
console.log('- 📥 Response status: [status code]');
console.log('- 📋 Delete result: [API response]');

console.log('\n⚠️  If delete is not responding:');
console.log('1. Check if auth token exists in localStorage');
console.log('2. Check browser console for error messages');
console.log('3. Check network tab for failed requests');
console.log('4. Verify you are logged in to the dashboard');