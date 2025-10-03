import { marked } from 'marked';

// Test markdown content
const testContent = `# Main Title

## 1. First Section

Some content here.

## 2. Second Section

More content here.

## 3. Third Section

Final content.`;

console.log('Original markdown:');
console.log(testContent);
console.log('\n' + '='.repeat(50) + '\n');

console.log('Converted HTML:');
const html = marked(testContent);
console.log(html);
console.log('\n' + '='.repeat(50) + '\n');

console.log('H2 sections split:');
const sections = html.split(/(<h2[^>]*>.*?<\/h2>)/gi);
console.log('Number of sections:', sections.length);
sections.forEach((section, index) => {
  console.log(`Section ${index}:`, JSON.stringify(section));
});