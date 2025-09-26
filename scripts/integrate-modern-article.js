/**
 * Script to integrate the modern article page
 * This script will backup the existing page and integrate the new modern design
 */

const fs = require('fs').promises;
const path = require('path');

const PATHS = {
  originalPage: path.join(__dirname, '..', 'app', 'blog', '[slug]', 'page.tsx'),
  modernPage: path.join(__dirname, '..', 'app', 'blog', '[slug]', 'page-modern.tsx'),
  backupPage: path.join(__dirname, '..', 'app', 'blog', '[slug]', 'page-backup.tsx'),
  modernComponent: path.join(__dirname, '..', 'components', 'ModernArticlePage.tsx'),
  styles: path.join(__dirname, '..', 'styles', 'modern-article.css'),
  globalStyles: path.join(__dirname, '..', 'app', 'globals.css'),
  tailwindConfig: path.join(__dirname, '..', 'tailwind.config.js')
};

async function backupOriginalPage() {
  console.log('📦 Creating backup of original page...');
  try {
    const originalContent = await fs.readFile(PATHS.originalPage, 'utf-8');
    await fs.writeFile(PATHS.backupPage, originalContent);
    console.log('✅ Original page backed up to page-backup.tsx');
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  }
}

async function integrateModernPage() {
  console.log('🔄 Integrating modern page...');
  try {
    const modernContent = await fs.readFile(PATHS.modernPage, 'utf-8');
    await fs.writeFile(PATHS.originalPage, modernContent);
    console.log('✅ Modern page integrated successfully');
  } catch (error) {
    console.error('❌ Error integrating modern page:', error);
    throw error;
  }
}

async function addStylesToGlobals() {
  console.log('🎨 Adding modern article styles to globals...');
  try {
    const stylesContent = await fs.readFile(PATHS.styles, 'utf-8');
    
    let globalsContent;
    try {
      globalsContent = await fs.readFile(PATHS.globalStyles, 'utf-8');
    } catch (error) {
      globalsContent = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n';
    }
    
    // Check if styles are already added
    if (!globalsContent.includes('/* Modern Article Styles */')) {
      globalsContent += '\n\n' + stylesContent;
      await fs.writeFile(PATHS.globalStyles, globalsContent);
      console.log('✅ Styles added to globals.css');
    } else {
      console.log('ℹ️ Styles already present in globals.css');
    }
  } catch (error) {
    console.error('❌ Error adding styles:', error);
    throw error;
  }
}

async function updateTailwindConfig() {
  console.log('⚙️ Updating Tailwind config for enhanced features...');
  try {
    const configPath = PATHS.tailwindConfig;
    let configContent = await fs.readFile(configPath, 'utf-8');
    
    // Add custom utilities if not already present
    const customUtilities = `
      '.line-clamp-1': {
        'display': '-webkit-box',
        '-webkit-line-clamp': '1',
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden'
      },
      '.line-clamp-2': {
        'display': '-webkit-box',
        '-webkit-line-clamp': '2',
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden'
      },
      '.line-clamp-3': {
        'display': '-webkit-box',
        '-webkit-line-clamp': '3',
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden'
      }`;

    if (!configContent.includes('line-clamp-1')) {
      // Find the plugins section or create it
      if (configContent.includes('plugins: [')) {
        configContent = configContent.replace(
          'plugins: [',
          `plugins: [
    function({ addUtilities }) {
      addUtilities({
        ${customUtilities}
      });
    },`
        );
      } else {
        configContent = configContent.replace(
          '}',
          `,
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        ${customUtilities}
      });
    }
  ]
}`
        );
      }
      
      await fs.writeFile(configPath, configContent);
      console.log('✅ Tailwind config updated with line-clamp utilities');
    } else {
      console.log('ℹ️ Tailwind config already has line-clamp utilities');
    }
  } catch (error) {
    console.error('❌ Error updating Tailwind config:', error);
    // This is not critical, so we'll continue
  }
}

async function createTestPost() {
  console.log('📝 Creating test post for modern design...');
  try {
    const testPost = {
      id: 'modern-design-test-post',
      title: '# Modern Blog Design Test Post',
      excerpt: 'This is a test post to showcase the modern blog design with all its features including TOC, FAQ, callouts, and more.',
      content: `# Modern Blog Design Test Post

This is a comprehensive test post to showcase all the features of the modern blog design.

## Table of Contents Features

This section will appear in the table of contents automatically. The TOC is generated from H2 and H3 headings.

### Sub-section Example

This subsection demonstrates the nested TOC functionality.

## Content Styling Examples

Here are various content types that are beautifully styled:

### Lists

Here's an unordered list:
- First item with **bold text**
- Second item with *italic text*
- Third item with \`inline code\`

And here's an ordered list:
1. First numbered item
2. Second numbered item
3. Third numbered item

### Code Blocks

\`\`\`javascript
function modernBlogDesign() {
  return {
    features: ['TOC', 'FAQ', 'Social Share', 'Reading Progress'],
    responsive: true,
    modern: true
  };
}
\`\`\`

### Blockquotes

> This is a beautiful blockquote that showcases the enhanced styling of the modern blog design.

### FAQ Section

What is the modern blog design?
The modern blog design is a comprehensive article layout that includes table of contents, FAQ sections, social sharing, and more.

How do I use the table of contents?
Simply scroll through the article and watch as the TOC automatically highlights the current section you're reading.

What features are included?
The design includes reading progress, social sharing, related articles, author bio, and navigation controls.

## Special Callout Examples

The design includes various callout boxes that will be automatically styled.

## Conclusion

This modern design provides an exceptional reading experience with all the features you'd expect from a professional blog.`,
      author: 'Design Team',
      category: 'design',
      tags: ['design', 'blog', 'modern', 'ui'],
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: '5 min read',
      published: true,
      href: '/blog/modern-design-test-post',
      image: '/placeholder-tool.jpg'
    };

    const blogPostsPath = path.join(__dirname, '..', 'blog-posts.json');
    let blogPosts = [];
    
    try {
      const existingContent = await fs.readFile(blogPostsPath, 'utf-8');
      blogPosts = JSON.parse(existingContent);
    } catch (error) {
      console.log('No existing blog posts file found, creating new one');
    }

    // Remove existing test post if it exists
    blogPosts = blogPosts.filter(post => post.id !== testPost.id);
    
    // Add the test post
    blogPosts.unshift(testPost);
    
    await fs.writeFile(blogPostsPath, JSON.stringify(blogPosts, null, 2));
    console.log('✅ Test post created successfully');
    console.log('🔗 Visit: http://localhost:3000/blog/modern-design-test-post');
  } catch (error) {
    console.error('❌ Error creating test post:', error);
  }
}

async function main() {
  console.log('🚀 Starting Modern Article Integration...\n');
  
  try {
    await backupOriginalPage();
    await integrateModernPage();
    await addStylesToGlobals();
    await updateTailwindConfig();
    await createTestPost();
    
    console.log('\n🎉 Integration Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000/blog/modern-design-test-post');
    console.log('3. Test all features: TOC, social sharing, responsive design');
    console.log('4. If you want to revert: copy page-backup.tsx back to page.tsx');
    console.log('\n✨ Your blog now has a modern, professional design!');
    
  } catch (error) {
    console.error('\n❌ Integration failed:', error);
    console.log('\n🔄 To manually revert:');
    console.log('1. Copy page-backup.tsx back to page.tsx');
    console.log('2. Remove modern styles from globals.css');
  }
}

// Run the integration if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };