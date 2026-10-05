const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/Fields/RichTextField/Toolbar.tsx', 'utf8');

// Replace Toggle import
content = content.replace("import { Toggle } from '@/components/ui/toggle';", "");

// Replace <Toggle pressed={condition} onPressedChange={action}> with Button
content = content.replace(/<Toggle\s+size="sm"\s+pressed=\{([^}]+)\}\s+onPressedChange=\{([^}]+)\}\s+aria-label="([^"]+)"\s*>/g, 
  '<Button variant={$1 ? "secondary" : "ghost"} size="sm" onClick={$2} aria-label="$3" type="button" className="h-8 p-2">');

content = content.replace(/<\/Toggle>/g, '</Button>');

fs.writeFileSync('src/components/dashboard/Fields/RichTextField/Toolbar.tsx', content);
