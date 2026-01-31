const fs = require('fs');
const path = require('path');

function listDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
}

function checkBlogs() {
  const contentBlogs = path.join(process.cwd(), 'content', 'blogs');
  const publicBlogs = path.join(process.cwd(), 'public', 'blogs');
  const slugs = listDir(contentBlogs);
  console.log(`Found ${slugs.length} blog(s) in content/blogs:`);
  for (const slug of slugs) {
    const meta = path.join(contentBlogs, slug, 'meta.json');
    const content = path.join(contentBlogs, slug, 'content.md');
    const imagesDir = path.join(publicBlogs, slug, 'images');
    console.log(`  - ${slug}`);
    console.log(`    meta.json: ${fs.existsSync(meta)}`);
    console.log(`    content.md: ${fs.existsSync(content)}`);
    console.log(`    public images dir present: ${fs.existsSync(imagesDir)}`);
  }
}

function checkQuestions() {
  const contentQuestions = path.join(process.cwd(), 'content', 'questions');
  const publicQuestions = path.join(process.cwd(), 'public', 'questions');
  const slugs = listDir(contentQuestions);
  console.log(`Found ${slugs.length} question(s) in content/questions:`);
  for (const slug of slugs) {
    const meta = path.join(contentQuestions, slug, 'meta.json');
    const content = path.join(contentQuestions, slug, 'content.md');
    const imagesDir = path.join(publicQuestions, slug, 'images');
    console.log(`  - ${slug}`);
    console.log(`    meta.json: ${fs.existsSync(meta)}`);
    console.log(`    content.md: ${fs.existsSync(content)}`);
    console.log(`    public images dir present: ${fs.existsSync(imagesDir)}`);
  }
}

function checkStudy() {
  const contentStudy = path.join(process.cwd(), 'content', 'study');
  const publicStudy = path.join(process.cwd(), 'public', 'study');
  console.log('Study:');
  console.log(`  content/study exists: ${fs.existsSync(contentStudy)}`);
  if (fs.existsSync(contentStudy)) {
    const idx = path.join(contentStudy, 'index.json');
    console.log(`  index.json present: ${fs.existsSync(idx)}`);
  }
  console.log(`  public/study exists: ${fs.existsSync(publicStudy)}`);
}

function main() {
  console.log('--- Content Check ---');
  checkBlogs();
  console.log('');
  checkQuestions();
  console.log('');
  checkStudy();
  console.log('--- Done ---');
}

main();
