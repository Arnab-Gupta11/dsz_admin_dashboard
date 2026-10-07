const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Type 1: catch(e) { toast.error('Failed to create'); } -> catch(e: any) { toast.error(e?.data?.message || e?.message || 'Failed to create'); }
      // This regex handles `catch(e) { toast.error('msg'); }` or similar
      const newContent1 = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*\{\s*toast\.error\(\s*'([^']+)'\s*\);?\s*\}/g, (match, errVar, defaultMsg) => {
        changed = true;
        return `catch(${errVar}: any) { toast.error(${errVar}?.data?.message || ${errVar}?.message || '${defaultMsg}'); }`;
      });
      content = newContent1;

      // Type 2: catch (error) { \n toast.error('msg'); \n }
      const newContent2 = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*(:\s*any)?\s*\)\s*\{\s*toast\.error\(\s*'([^']+)'\s*\);?\s*\}/g, (match, errVar, colonAny, defaultMsg) => {
        changed = true;
        return `catch(${errVar}: any) {\n          toast.error(${errVar}?.data?.message || ${errVar}?.message || '${defaultMsg}');\n        }`;
      });
      content = newContent2;

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir('/home/arnab11/projects/DSZ/dsz_admin-dashboard/src/app/dashboard');
console.log('Done replacing toasts');

