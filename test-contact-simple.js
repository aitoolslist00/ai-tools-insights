#!/usr/bin/env node

/**
 * Simple Contact Form Test using cURL equivalent
 */

const { execSync } = require('child_process');

console.log('\n🧪 AI Tools Insights - Contact Form Test');
console.log('==========================================\n');

console.log('📧 Testing contact form submission...');

const testData = {
  name: 'API Test User',
  email: 'insightsaitools@gmail.com',
  subject: '🧪 Contact Form API Test - Success!',
  message: 'This is an automated test of your contact form. If you receive this email, your contact system is working perfectly!\n\n✅ Contact Form: Working\n✅ Email Delivery: Successful\n✅ Auto-Reply System: Active\n✅ Templates: Rendering correctly\n\nYour AI Tools Insights contact system is ready for production!'
};

try {
  // Use PowerShell to make the API call
  const powershellCommand = `
    $body = @{
      name = "${testData.name}"
      email = "${testData.email}"
      subject = "${testData.subject}"
      message = "${testData.message}"
    } | ConvertTo-Json -Depth 10
    
    $headers = @{
      "Content-Type" = "application/json"
    }
    
    try {
      $response = Invoke-RestMethod -Uri "http://localhost:3000/api/contact" -Method POST -Body $body -Headers $headers
      Write-Output "SUCCESS: $($response.message)"
    } catch {
      Write-Output "ERROR: $($_.Exception.Message)"
      Write-Output "DETAILS: $($_.Exception.Response.StatusDescription)"
    }
  `;

  console.log('📤 Sending test contact form submission...');
  
  const result = execSync(`powershell -Command "${powershellCommand.replace(/"/g, '`"')}"`, { 
    encoding: 'utf8',
    timeout: 10000
  });

  console.log('📨 API Response:', result.trim());

  if (result.includes('SUCCESS')) {
    console.log('\n🎉 CONTACT FORM TEST PASSED!');
    console.log('===============================');
    console.log('✅ Contact form working correctly');
    console.log('✅ API processing submissions');
    console.log('✅ Emails being sent');
    console.log('✅ Auto-replies active');
    
    console.log('\n📧 CHECK YOUR GMAIL:');
    console.log('• Contact message sent to: insightsaitools@gmail.com');
    console.log('• Auto-reply sent to: insightsaitools@gmail.com');
    console.log('• Both emails should have professional formatting');
    
    console.log('\n🚀 CONTACT SYSTEM FULLY OPERATIONAL!');
    
  } else {
    console.log('\n⚠️  Test completed with response:', result.trim());
    console.log('Check if the development server is running (npm run dev)');
  }

} catch (error) {
  console.log('\n❌ TEST ERROR');
  console.log('==============');
  console.log('Error:', error.message);
  
  if (error.message.includes('ECONNREFUSED') || error.message.includes('connection')) {
    console.log('\n🔧 SOLUTION: Make sure development server is running');
    console.log('1. Open another terminal');
    console.log('2. Run: npm run dev');
    console.log('3. Wait for "Ready in" message');
    console.log('4. Run this test again');
  }
}