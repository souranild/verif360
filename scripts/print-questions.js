const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content', 'questions');
if (!fs.existsSync(contentDir)) { console.log('No content/questions'); process.exit(0); }
const slugs = fs.readdirSync(contentDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const results = [];
for (const slug of slugs) {
  const metaPath = path.join(contentDir, slug, 'meta.json');
  let meta = {};
  if (fs.existsSync(metaPath)) meta = JSON.parse(fs.readFileSync(metaPath,'utf8'));
  const canonicalSlug = meta.slug || slug;
  results.push({ dir: slug, slug: canonicalSlug, title: meta.title });
}
console.table(results);
console.log('Total', results.length);