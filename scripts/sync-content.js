const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFileSync(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(srcDir, e.name);
    const destPath = path.join(destDir, e.name);
    if (e.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (e.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Copy images from content/questions/<slug>/images -> public/questions/<slug>/images
const contentQ = path.join(process.cwd(), 'content', 'questions');
if (fs.existsSync(contentQ)) {
  const slugs = fs.readdirSync(contentQ, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const d of slugs) {
    const srcImages = path.join(contentQ, d.name, 'images');
    const destImages = path.join(process.cwd(), 'public', 'questions', d.name, 'images');
    if (fs.existsSync(srcImages)) {
      console.log('Copying', srcImages, '->', destImages);
      copyDirRecursive(srcImages, destImages);
    }
  }
}

// Copy images from content/blogs/<slug>/images -> public/blogs/<slug>/images
const blogsDir = path.join(process.cwd(), 'content', 'blogs');
if (fs.existsSync(blogsDir)) {
  const entries = fs.readdirSync(blogsDir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(blogsDir, e.name);
    if (e.isDirectory()) {
      const srcImages = path.join(full, 'images');
      const destImages = path.join(process.cwd(), 'public', 'blogs', e.name, 'images');
      if (fs.existsSync(srcImages)) {
        console.log('Copying', srcImages, '->', destImages);
        copyDirRecursive(srcImages, destImages);
      }
    } else if (e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx'))) {
      // check for a sibling images directory named <slug>-images or <slug>
      const slug = path.basename(e.name, path.extname(e.name));
      const candidate = path.join(blogsDir, slug);
      const srcImages = path.join(candidate, 'images');
      const destImages = path.join(process.cwd(), 'public', 'blogs', slug, 'images');
      if (fs.existsSync(srcImages)) {
        console.log('Copying', srcImages, '->', destImages);
        copyDirRecursive(srcImages, destImages);
      }
    }
  }
}

// Copy images from content/study/<slug>/images -> public/study/<slug>/images
const contentStudy = path.join(process.cwd(), 'content', 'study');
if (fs.existsSync(contentStudy)) {
  const studySlugs = fs.readdirSync(contentStudy, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  for (const s of studySlugs) {
    const src = path.join(contentStudy, s, 'images');
    const dest = path.join(process.cwd(), 'public', 'study', s, 'images');
    if (fs.existsSync(src)) {
      console.log('Copying', src, '->', dest);
      copyDirRecursive(src, dest);
    }
  }
}

console.log('sync-content finished.');
