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
  
  // Replace the complex DynamicBadge with a simple one
  c = c.replace(/<DynamicBadge\s+status=\{([^}]+)\}[\s\S]*?\/>/g, (match, p1) => {
    return `<DynamicBadge text={${p1} as string} color="#34796f" />`;
  });
  
  fs.writeFileSync(file, c);
});
