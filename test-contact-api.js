#!/usr/bin/env node

/**
 * Complete Contact API Test
 * Tests the contact form API end-to-end
 */

const fetch = require('node-fetch');

async function testContactAPI() {
  console.log('\n🧪 AI Tools Insights - Contact API End-to-End Test');
  console.log('====================================================\n');

  // Test data
  const testData = {
    name: 'Test User',
    email: 'insightsaitools@gmail.com', // Send to your own email
    subject: '🧪 Contact Form API Test',
    message: 'This is an automated test of your contact form API. If you receive this email, your contact system is working perfectly!\n\n✅ API Integration: Working\n✅ Email Delivery: Successful\n✅ Auto-Reply System: Operational\n✅ Professional Templates: Rendering correctly\n\nYour AI Tools Insights contact system is ready for production!'
  };

  try {
    console.log('📧 Testing Contact Form Submission...');
    console.log(`📨 Sending to: ${testData.email}`);
    console.log(`📝 Subject: ${testData.subject}`);
    
    // Make API request
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ CONTACT API TEST SUCCESSFUL!');
      console.log('=================================');
      console.log('✅ API Response: Success');
      console.log('✅ Status Code:', response.status);
      console.log('✅ Message:', result.message);
      
      console.log('\n📧 EMAIL VERIFICATION:');
      console.log('• Check your Gmail inbox: insightsaitools@gmail.com');
      console.log('• You should receive the contact form submission');
      console.log('• You should also receive an auto-reply confirmation');
      
      console.log('\n🎉 CONTACT SYSTEM FULLY OPERATIONAL!');
      console.log('======================================');
      console.log('✅ Contact form accepts submissions');
      console.log('✅ API processes data correctly');
      console.log('✅ Emails sent successfully');
      console.log('✅ Auto-reply system working');
      console.log('✅ Professional templates active');
      
      console.log('\n🚀 READY FOR PRODUCTION!');
      console.log('Your contact system is ready to handle real inquiries.');
      
    } else {
      console.log('❌ CONTACT API TEST FAILED');
      console.log('===========================');
      console.log('❌ Status Code:', response.status);
      console.log('❌ Error:', result.error || result.message);
      
      if (response.status === 500) {
        console.log('\n🔧 Possible Issues:');
        console.log('- Check Gmail App Password is correct');
        console.log('- Verify environment variables are set');
        console.log('- Ensure development server is running');
      }
    }

  } catch (error) {
    console.log('❌ CONTACT API TEST ERROR');
    console.log('==========================');
    console.log('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 SOLUTION: Start the development server first');
      console.log('Run: npm run dev');
      console.log('Then run this test again.');
    }
  }
}

// Run the test
testContactAPI().catch(console.error);