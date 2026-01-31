const fs = require('fs');
const path = require('path');

const questionsDir = path.join(process.cwd(),'content','questions');
if (!fs.existsSync(questionsDir)) {
  console.log('No content/questions directory found');
  process.exit(0);
}

const dirs = fs.readdirSync(questionsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
let mismatches = [];
console.log('Found', dirs.length, 'question folders:');
for (const d of dirs) {
  const metaPath = path.join(questionsDir, d, 'meta.json');
  const contentPath = path.join(questionsDir, d, 'content.md');
  let meta = null;
  let metaSlug = null;
  if (fs.existsSync(metaPath)) {
    try { meta = JSON.parse(fs.readFileSync(metaPath,'utf8')); metaSlug = meta.slug; } catch (e) { meta = null; }
  }
  console.log(`- dir: ${d}`);
  console.log(`    meta.json: ${fs.existsSync(metaPath)}; meta.slug: ${metaSlug}`);
  console.log(`    content.md: ${fs.existsSync(contentPath)}`);
  if (metaSlug && metaSlug !== d) {
    mismatches.push({ dir: d, metaSlug });
  }
}

if (mismatches.length) {
  console.log('\nMISMATCHES (meta.slug !== directory name):');
  mismatches.forEach(m => console.log(`  - dir '${m.dir}' has meta.slug='${m.metaSlug}'`));
} else {
  console.log('\nNo slug mismatches found.');
}
