const fs = require('fs');

const filesToFix = [
  'src/app/dashboard/works/page.tsx',
  'src/app/dashboard/articles/page.tsx',
  'src/app/dashboard/services/page.tsx',
  'src/app/dashboard/jobs/page.tsx',
  'src/app/dashboard/testimonials/page.tsx',
  'src/app/dashboard/contacts/page.tsx',
  'src/app/dashboard/jobApplications/page.tsx',
];

filesToFix.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  
  c = c.replace(/<DynamicTableFilterBar\s+searchPlaceholder="([^"]+)"\s*\/>/g, 
    `<DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: '$1' }]} />`);
  c = c.replace(/<DynamicTableFilterBar\s+searchPlaceholder=\{'([^']+)'\}\s*\/>/g, 
    `<DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: '$1' }]} />`);
  c = c.replace(/<DynamicTableFilterBar\s+searchPlaceholder=\{"([^"]+)"\}\s*\/>/g, 
    `<DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: '$1' }]} />`);
  c = c.replace(/<DynamicTableFilterBar\s+searchPlaceholder=\{`([^`]+)`\}\s*\/>/g, 
    `<DynamicTableFilterBar fields={[{ name: 'search', type: 'search', placeholder: '$1' }]} />`);
  
  fs.writeFileSync(file, c);
});
