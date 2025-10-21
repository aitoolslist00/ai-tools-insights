/**
 * Test script to verify bold markdown formatting fix
 * Tests the preprocessing step that converts **text** to <strong>text</strong>
 */

// Simulate the preprocessing function
function preprocessMarkdown(content) {
  let preprocessed = content;
  
  // Convert **text** to <strong>text</strong> (bold)
  preprocessed = preprocessed.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  
  // Fallback for edge cases with punctuation (e.g., **word**'s)
  preprocessed = preprocessed.replace(/\*\*([^*]*?)\*\*(['s]?)/g, '<strong>$1</strong>$2');
  
  return preprocessed;
}

// Test cases from the actual blog post
const testCases = [
  {
    name: 'Test 1: Bold in heading',
    input: '<h1>Mastering **Mid Journey**: Your Complete Guide</h1>',
    expected: '<h1>Mastering <strong>Mid Journey</strong>: Your Complete Guide</h1>'
  },
  {
    name: 'Test 2: Bold in paragraph',
    input: '<p>In the landscape of AI, **Mid Journey** stands out</p>',
    expected: '<p>In the landscape of AI, <strong>Mid Journey</strong> stands out</p>'
  },
  {
    name: 'Test 3: Bold with apostrophe',
    input: 'We examine **Mid Journey**\'s role in AI',
    expected: 'We examine <strong>Mid Journey</strong>\'s role in AI'
  },
  {
    name: 'Test 4: Lowercase bold',
    input: 'making your **mid journey** into AI artistry',
    expected: 'making your <strong>mid journey</strong> into AI artistry'
  },
  {
    name: 'Test 5: Multiple bold instances',
    input: '**Mid Journey** is amazing and **Mid Journey** is powerful',
    expected: '<strong>Mid Journey</strong> is amazing and <strong>Mid Journey</strong> is powerful'
  },
  {
    name: 'Test 6: Bold with punctuation',
    input: 'craft stunning images from text prompts, master **Mid Journey**, and',
    expected: 'craft stunning images from text prompts, master <strong>Mid Journey</strong>, and'
  },
  {
    name: 'Test 7: Mixed content',
    input: 'The **Mid Journey** AI and **DALL-E** are both great',
    expected: 'The <strong>Mid Journey</strong> AI and <strong>DALL-E</strong> are both great'
  }
];

console.log('🧪 Testing Bold Markdown Conversion Fix\n');
console.log('='.repeat(70));

let passCount = 0;
let failCount = 0;

testCases.forEach(test => {
  const result = preprocessMarkdown(test.input);
  const passed = result === test.expected;
  
  if (passed) {
    console.log(`\n✅ ${test.name}: PASS`);
    passCount++;
  } else {
    console.log(`\n❌ ${test.name}: FAIL`);
    console.log(`   Input:    ${test.input}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got:      ${result}`);
    failCount++;
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\n📊 Test Results: ${passCount} passed, ${failCount} failed`);

if (failCount === 0) {
  console.log('\n✨ All tests passed! Bold markdown formatting fix is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
}