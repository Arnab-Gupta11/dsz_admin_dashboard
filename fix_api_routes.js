const fs = require('fs');

const files = [
  'src/redux/features/works/works.api.ts',
  'src/redux/features/services/services.api.ts',
  'src/redux/features/articles/articles.api.ts',
  'src/redux/features/settings/settings.api.ts',
  'src/redux/features/jobs/jobs.api.ts',
  'src/redux/features/testimonials/testimonials.api.ts',
  'src/redux/features/jobApplications/jobApplications.api.ts',
  'src/redux/features/contacts/contacts.api.ts',
  'src/redux/features/media/media.api.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    const entity = file.split('/').pop().replace('.api.ts', '');
    let routeName = entity;
    if (entity === 'jobApplications') routeName = 'job-applications';
    
    content = content.replace(new RegExp(`url: "/${routeName}"`, 'g'), `url: "/admin/${routeName}"`);
    content = content.replace(new RegExp(`\`/${routeName}/`, 'g'), `\`/admin/${routeName}/`);
    
    fs.writeFileSync(file, content);
  }
});
