const fs = require('fs');
const path = require('path');

const routes = [
  'src/app/api/admin/registrations/route.ts',
  'src/app/api/admin/export-csv/route.ts',
  'src/app/api/admin/content/route.ts',
  'src/app/api/admin/media/route.ts',
  'src/app/api/admin/sponsors/route.ts',
  'src/app/api/admin/prizes/route.ts',
  'src/app/api/admin/coordinators/route.ts',
  'src/app/api/admin/gallery/route.ts',
  'src/app/api/admin/faqs/route.ts',
  'src/app/api/admin/settings/route.ts',
  'src/app/api/submissions/route.ts'
];

routes.forEach(r => {
  const full = path.join(__dirname, '..', r);
  if (fs.existsSync(full)) {
    let content = fs.readFileSync(full, 'utf8');
    if (!content.includes("export const dynamic")) {
      content = "export const dynamic = 'force-dynamic';\n\n" + content;
      fs.writeFileSync(full, content, 'utf8');
      console.log('Added force-dynamic to:', r);
    }
  }
});
