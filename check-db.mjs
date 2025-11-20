import Database from 'better-sqlite3';

const db = new Database('./dev.db');

console.log('\n=== AI Tools in Database ===\n');
const tools = db.prepare('SELECT id, name, slug, status, published_at, created_at FROM ai_tools').all();

if (tools.length === 0) {
  console.log('No AI tools found in database.');
} else {
  console.log(`Found ${tools.length} AI tools:\n`);
  tools.forEach(tool => {
    console.log(`ID: ${tool.id}`);
    console.log(`Name: ${tool.name}`);
    console.log(`Slug: ${tool.slug}`);
    console.log(`Status: ${tool.status}`);
    console.log(`Published At: ${tool.published_at || 'Not published'}`);
    console.log(`Created At: ${tool.created_at}`);
    console.log('---');
  });
}

db.close();
