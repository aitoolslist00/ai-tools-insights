import Database from 'better-sqlite3';

const db = new Database('./dev.db');

console.log('\n=== Articles in Database ===\n');
const articles = db.prepare('SELECT id, title, slug, status FROM articles WHERE slug LIKE ?').all('%video%');

if (articles.length === 0) {
  console.log('No articles with video found.');
  const allArticles = db.prepare('SELECT id, title, slug, status FROM articles').all();
  console.log(`\nAll articles (${allArticles.length}):\n`);
  allArticles.forEach(article => {
    console.log(`${article.slug}`);
  });
} else {
  articles.forEach(article => {
    console.log(`ID: ${article.id}`);
    console.log(`Title: ${article.title}`);
    console.log(`Slug: ${article.slug}`);
    console.log(`Status: ${article.status}`);
    console.log('---');
  });
  
  const fullArticle = db.prepare('SELECT content FROM articles WHERE slug = ?').get(articles[0].slug);
  console.log('\n=== Content Preview ===\n');
  console.log(fullArticle.content.substring(0, 500));
}

db.close();
