import Database from 'better-sqlite3';

const db = new Database('dev.db', { readonly: true });

console.log('📊 SQLite Database Summary:\n');

try {
  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles').get();
  console.log(`Articles: ${articleCount.count}`);
  
  if (articleCount.count > 0) {
    const articles = db.prepare('SELECT id, title, status, created_at FROM articles ORDER BY created_at DESC').all();
    console.log('\nArticles found:');
    articles.forEach((article, index) => {
      console.log(`${index + 1}. [${article.status}] ${article.title} (ID: ${article.id})`);
    });
  }
} catch (e) {
  console.log('Articles table:', e.message);
}

try {
  const toolCount = db.prepare('SELECT COUNT(*) as count FROM ai_tools').get();
  console.log(`\nAI Tools: ${toolCount.count}`);
} catch (e) {
  console.log('AI Tools table:', e.message);
}

try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`Users: ${userCount.count}`);
} catch (e) {
  console.log('Users table:', e.message);
}

db.close();
