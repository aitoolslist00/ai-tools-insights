export interface FAQItem {
  question: string;
  answer: string;
}

export function generateArticleSchema(data: {
  title: string;
  description: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  imageUrl?: string;
  url?: string;
  keywords?: string[];
  wordCount?: number;
}): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "author": {
      "@type": "Organization",
      "name": data.author || "AI Tools Insights",
      "url": "https://aitoolsinsights.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Tools Insights",
      "url": "https://aitoolsinsights.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aitoolsinsights.com/logo.png",
        "width": 600,
        "height": 60
      }
    },
    "datePublished": data.publishDate || new Date().toISOString(),
    "dateModified": data.modifiedDate || new Date().toISOString(),
    "inLanguage": "en-US",
    "articleSection": "Technology"
  };

  if (data.imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      "url": data.imageUrl,
      "width": 1200,
      "height": 675
    };
  }

  if (data.url) {
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": data.url
    };
    schema.url = data.url;
  }

  if (data.keywords && data.keywords.length > 0) {
    schema.keywords = data.keywords.join(', ');
  }

  if (data.wordCount) {
    schema.wordCount = data.wordCount;
  }

  return schema;
}

export function generateFAQSchema(faqItems: FAQItem[], url?: string): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item, index) => ({
      "@type": "Question",
      "name": item.question,
      "position": index + 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
        "inLanguage": "en-US"
      }
    }))
  };

  if (url) {
    schema.url = url;
  }

  return schema;
}

export function generateHowToSchema(data: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
  imageUrl?: string;
  totalTime?: string;
  url?: string;
}): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.title,
    "description": data.description,
    "inLanguage": "en-US",
    "step": data.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": data.url ? `${data.url}#step-${index + 1}` : undefined
    }))
  };

  if (data.imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      "url": data.imageUrl,
      "width": 1200,
      "height": 675
    };
  }

  if (data.totalTime) {
    schema.totalTime = data.totalTime;
  }

  if (data.url) {
    schema.url = data.url;
  }

  schema.estimatedCost = {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  };

  return schema;
}

export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "numberOfItems": breadcrumbs.length,
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": {
        "@type": "Thing",
        "@id": crumb.url,
        "name": crumb.name
      }
    }))
  };
}

export function generateImageObjectSchema(data: {
  url: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
}): object {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": data.url,
    "contentUrl": data.url,
    "width": data.width || 1200,
    "height": data.height || 675,
    "encodingFormat": "image/png",
    "inLanguage": "en-US"
  };

  if (data.caption) {
    schema.caption = data.caption;
  }

  if (data.description) {
    schema.description = data.description;
  }

  schema.author = {
    "@type": "Organization",
    "name": "AI Tools Insights"
  };

  schema.copyrightHolder = {
    "@type": "Organization",
    "name": "AI Tools Insights"
  };

  schema.license = "https://creativecommons.org/licenses/by/4.0/";
  schema.acquireLicensePage = "https://aitoolsinsights.com/license";

  return schema;
}

export function extractFAQFromContent(markdown: string): FAQItem[] {
  const faqItems: FAQItem[] = [];
  
  const faqSectionMatch = markdown.match(/##\s*(?:FAQ|Frequently Asked Questions)([\s\S]*?)(?=##|$)/i);
  
  if (!faqSectionMatch) {
    return faqItems;
  }

  const faqSection = faqSectionMatch[1];
  
  const qaPattern = /###\s*(.+?)\n+([\s\S]*?)(?=###|$)/g;
  let match;

  while ((match = qaPattern.exec(faqSection)) !== null) {
    const question = match[1].trim().replace(/\?$/, '') + '?';
    const answer = match[2].trim();
    
    if (question && answer && answer.length > 10) {
      faqItems.push({
        question,
        answer: answer.replace(/\n+/g, ' ').slice(0, 500)
      });
    }
  }

  return faqItems;
}

export function extractHowToSteps(markdown: string): { name: string; text: string }[] {
  const steps: { name: string; text: string }[] = [];
  
  const stepsPattern = /(?:^|\n)(\d+)\.\s*(.+?)(?=\n\d+\.|$)/gs;
  const matches = markdown.matchAll(stepsPattern);

  for (const match of matches) {
    const stepName = match[2].trim().split('\n')[0];
    const stepText = match[2].trim();
    
    if (stepName && stepText) {
      steps.push({
        name: stepName,
        text: stepText.slice(0, 300)
      });
    }
  }

  if (steps.length < 3) {
    return [];
  }

  return steps;
}

export function generateAllSchemas(data: {
  title: string;
  description: string;
  markdown: string;
  imageUrl?: string;
  url?: string;
  author?: string;
  faqItems?: FAQItem[];
  category?: string;
  keywords?: string[];
  wordCount?: number;
}): { schemas: object[]; schemaHtml: string } {
  const schemas: object[] = [];

  const articleSchema = generateArticleSchema({
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    url: data.url,
    author: data.author,
    keywords: data.keywords,
    wordCount: data.wordCount
  });
  schemas.push(articleSchema);
  console.log('✅ Article Schema added');

  if (data.url && data.category) {
    const breadcrumbs = [
      { name: 'Home', url: 'https://aitoolsinsights.com' },
      { name: data.category, url: `https://aitoolsinsights.com/${data.category.toLowerCase().replace(/\s+/g, '-')}` },
      { name: data.title, url: data.url }
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    schemas.push(breadcrumbSchema);
    console.log('✅ BreadcrumbList Schema added');
  }

  if (data.faqItems && data.faqItems.length > 0) {
    const faqSchema = generateFAQSchema(data.faqItems, data.url);
    schemas.push(faqSchema);
    console.log(`✅ FAQPage Schema: ${data.faqItems.length} questions`);
  } else {
    const extractedFaqItems = extractFAQFromContent(data.markdown);
    if (extractedFaqItems.length > 0) {
      const faqSchema = generateFAQSchema(extractedFaqItems, data.url);
      schemas.push(faqSchema);
      console.log(`✅ FAQPage Schema: ${extractedFaqItems.length} questions (extracted)`);
    }
  }

  const howToSteps = extractHowToSteps(data.markdown);
  if (howToSteps.length >= 3) {
    const howToSchema = generateHowToSchema({
      title: data.title,
      description: data.description,
      steps: howToSteps,
      imageUrl: data.imageUrl,
      url: data.url
    });
    schemas.push(howToSchema);
    console.log(`✅ HowTo Schema: ${howToSteps.length} steps`);
  }

  if (data.imageUrl) {
    const imageSchema = generateImageObjectSchema({
      url: data.imageUrl,
      caption: data.title,
      description: data.description,
      width: 1200,
      height: 675
    });
    schemas.push(imageSchema);
    console.log('✅ ImageObject Schema added');
  }

  const schemaHtml = schemas
    .map(schema => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
    .join('\n');

  return { schemas, schemaHtml };
}
