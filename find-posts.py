import json

print("Starting script...")

with open('blog-posts.json', 'r', encoding='utf-8') as f:
    print("Reading file...")
    posts = json.load(f)
    
print(f"Total posts: {len(posts)}")

# Find GuinRank
print("\n=== Looking for GuinRank post ===")
guinrank = next((p for p in posts if p.get('slug') and ('guinrank' in p['slug'] or 'seo-content-optimization' in p['slug'])), None)

if guinrank:
    print(f"Found: {guinrank['title']}")
    print(f"Slug: {guinrank['slug']}")
    print(f"Image: {guinrank.get('image', 'N/A')}")
    images = guinrank.get('images', [])
    print(f"Images array length: {len(images)}")
    if images:
        print(f"First image: {json.dumps(images[0], indent=2)}")
else:
    print("Not found")

# Find AI News
print("\n=== Looking for AI News post ===")
ai_news = next((p for p in posts if p.get('slug') == 'ai-news-latest-innovations-trends-applications'), None)

if ai_news:
    print(f"Found: {ai_news['title']}")
    print(f"Slug: {ai_news['slug']}")
    print(f"Image: {ai_news.get('image', 'N/A')}")
    images = ai_news.get('images', [])
    print(f"Images array length: {len(images)}")
    if images:
        print(f"First image: {json.dumps(images[0], indent=2)}")
else:
    print("Not found")

print("\nScript finished")
