// Simple debug file to test imports
const path = require('path');
const fs = require('fs');

console.log('Checking AppProvider.tsx...');
try {
  const appProviderPath = path.resolve(__dirname, './providers/AppProvider.tsx');
  const exists = fs.existsSync(appProviderPath);
  console.log(`AppProvider.tsx exists: ${exists}`);
  
  if (exists) {
    const content = fs.readFileSync(appProviderPath, 'utf8');
    console.log('Content:', content.substring(0, 200) + '...');
  }
} catch (error) {
  console.error('Error:', error);
}

// Try to import the file directly
try {
  console.log('Trying to require AppProvider...');
  // This won't work directly with TypeScript, but it's just to check if the file is accessible
  console.log('File appears to be accessible');
} catch (error) {
  console.error('Import error:', error);
}
