console.log('Script starting...');
const fs = require('fs');
console.log('fs module loaded');

try {
  console.log('Reading file...');
  const content = fs.readFileSync('./blog-posts.json', 'utf8');
  console.log('File read, length:', content.length);
  
  console.log('Parsing JSON...');
  const data = JSON.parse(content);
  console.log('JSON parsed, array length:', data.length);
  
  console.log('First post title:', data[0]?.title);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}

console.log('Script finished');
