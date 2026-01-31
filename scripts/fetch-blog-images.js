const fs = require('fs');
const path = require('path');

async function fetchImage(url, destPath) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const fileStream = fs.createWriteStream(destPath);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
}

async function fetchWithRetries(url, destPath, attempts = 3) {
  let attempt = 0;
  while (attempt < attempts) {
    try {
      await fetchImage(url, destPath);
      return;
    } catch (err) {
      attempt++;
      const backoff = Math.min(2000 * Math.pow(2, attempt), 16000);
      console.warn(`fetchWithRetries attempt ${attempt} failed for ${url}:`, err.message || err);
      if (attempt >= attempts) throw err;
      await new Promise((r) => setTimeout(r, backoff + Math.floor(Math.random() * 500)));
    }
  }
}

async function main() {
  const blogsDir = path.join(process.cwd(), 'content', 'blogs');
  if (!fs.existsSync(blogsDir)) {
    console.log('No content/blogs directory found - nothing to do.');
    return;
  }

  const entries = fs.readdirSync(blogsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  console.log('Found', entries.length, 'blog folders');

  for (const slug of entries) {
    const metaPath = path.join(blogsDir, slug, 'meta.json');
    let meta = {};
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      } catch (err) {
        console.warn('Failed to parse meta.json for', slug, err);
        continue;
      }
    }

    // If meta.featured_image is already a local path under /blogs/, skip
    if (meta.featured_image && String(meta.featured_image).startsWith('/blogs/')) {
      console.log(slug, 'already has local featured_image, skipping');
      continue;
    }

    const query = (Array.isArray(meta.tags) && meta.tags[0]) || meta.title || slug || 'verification';
    // Build a conservative query string: prefer first tag, else slug
    const rawQuery = (Array.isArray(meta.tags) && meta.tags[0]) || meta.title || slug || 'verification';
    const q = String(rawQuery).replace(/[\s\/\\#%&<>\?\{\}\|\^~\[\]`]+/g, ' ');
    const unsplash = `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)}`;
    // Save into the content folder so source-of-truth contains the image
    const destPath = path.join(process.cwd(), 'content', 'blogs', slug, 'images', 'cover.jpg');

    try {
      console.log('Downloading for', slug, 'from', unsplash);
      await fetchWithRetries(unsplash, destPath, 4);
      // Update meta to point to local image under /blogs/
      meta.featured_image = `/blogs/${slug}/images/cover.jpg`;
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
      console.log('Saved cover image for', slug, '->', destPath);
    } catch (err) {
      console.warn('Failed to download image for', slug, err.message || err);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Script failed', err);
  process.exit(1);
});