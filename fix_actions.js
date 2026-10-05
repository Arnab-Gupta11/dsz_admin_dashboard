const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('page.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/app/dashboard');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/<DynamicTableActions\s+onEdit=\{([^}]+)\}\s+onDelete=\{([^}]+)\}\s*\/>/g, 
    "<DynamicTableActions actions={[{ type: 'edit', href: $1 }, { type: 'delete', onClick: $2 }]} />");
  
  content = content.replace(/<DynamicTableActions\s+onDelete=\{([^}]+)\}\s*\/>/g, 
    "<DynamicTableActions actions={[{ type: 'delete', onClick: $1 }]} />");
  
  fs.writeFileSync(file, content);
});
