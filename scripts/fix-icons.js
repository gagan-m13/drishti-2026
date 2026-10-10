const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('Instagram') && content.includes('lucide-react')) {
        content = content.replace(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/g, (match, p1) => {
          const names = p1.split(',').map(s => s.trim()).filter(s => s && s !== 'Instagram');
          let res = '';
          if (names.length > 0) {
            res += `import { ${names.join(', ')} } from 'lucide-react';\n`;
          }
          res += `import InstagramIcon from '@/components/InstagramIcon';`;
          return res;
        });
        content = content.replace(/<Instagram(\s|\/|>)/g, '<InstagramIcon$1');
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated:', full);
      }
    }
  }
}

processDir(path.join(__dirname, '..', 'src'));
console.log('Icon fix complete');
