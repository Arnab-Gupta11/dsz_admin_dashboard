const fs = require('fs');

const filesToFix = [
  { path: 'src/app/dashboard/works/page.tsx', folder: 'works' },
  { path: 'src/app/dashboard/articles/page.tsx', folder: 'articles' },
  { path: 'src/app/dashboard/services/page.tsx', folder: 'services' },
  { path: 'src/app/dashboard/jobs/page.tsx', folder: 'jobs' },
  { path: 'src/app/dashboard/testimonials/page.tsx', folder: 'testimonials' },
];

filesToFix.forEach(f => {
  let c = fs.readFileSync(f.path, 'utf8');
  c = c.replace(/<DynamicTableActions[\s\S]*?onEdit=\{\`\/dashboard\/[a-z]+\/\$\{row\._id\}\/edit\`\}[\s\S]*?onDelete=\{.*?\}[\s\S]*?\/>/g, 
    `<DynamicTableActions actions={[{ type: 'edit', href: \`/dashboard/${f.folder}/\${row._id}/edit\` }, { type: 'delete', onClick: () => handleDelete(row._id) }]} />`);
  fs.writeFileSync(f.path, c);
});

const deleteOnlyFiles = [
  'src/app/dashboard/contacts/page.tsx',
  'src/app/dashboard/jobApplications/page.tsx',
];

deleteOnlyFiles.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<DynamicTableActions[\s\S]*?onDelete=\{.*?\}[\s\S]*?\/>/g, 
    `<DynamicTableActions actions={[{ type: 'delete', onClick: () => handleDelete(row._id) }]} />`);
  fs.writeFileSync(f, c);
});
