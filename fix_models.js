const fs = require('fs');
let file = 'src/types/models.types.ts';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/number:\s*string;\n\s*title:\s*string;\n\s*category:\s*[^;]+;/g, 'title: string;\n  tag: string;');
c = c.replace(/visual:\s*[^;]+;\n/g, '');
fs.writeFileSync(file, c);
