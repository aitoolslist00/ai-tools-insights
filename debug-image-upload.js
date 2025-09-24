
// Add this to your browser console when testing the blog editor
// to debug image upload issues

console.log('🔍 Blog Editor Image Upload Debugger');

// Monitor image state changes
const originalSetImage = window.setImage;
if (typeof originalSetImage === 'function') {
  window.setImage = function(url) {
    console.log('📸 Image URL set to:', url);
    return originalSetImage(url);
  };
}

// Monitor form submissions
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    console.log('📝 Form submitted');
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      if (key.includes('image') || key === 'image') {
        console.log('🖼️ Image field in form:', key, value);
      }
    }
  });
});

// Monitor fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string' && (url.includes('/api/upload') || url.includes('/api/blog'))) {
    console.log('🌐 API Request:', url);
    if (args[1] && args[1].body) {
      console.log('📦 Request body type:', typeof args[1].body);
      if (args[1].body instanceof FormData) {
        console.log('📋 FormData entries:');
        for (let [key, value] of args[1].body.entries()) {
          console.log('  -', key, typeof value === 'object' ? value.constructor.name : value);
        }
      }
    }
  }
  
  return originalFetch.apply(this, args).then(response => {
    if (typeof url === 'string' && (url.includes('/api/upload') || url.includes('/api/blog'))) {
      console.log('📨 API Response:', response.status, response.statusText);
      if (url.includes('/api/upload')) {
        response.clone().json().then(data => {
          console.log('📸 Upload response:', data);
        }).catch(() => {});
      }
    }
    return response;
  });
};

console.log('✅ Debug monitoring active. Upload an image to see debug info.');
