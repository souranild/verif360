const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error('Failed to read JSON', file, err);
    return null;
  }
}

// Migrate blogs
const publicBlogs = path.join(process.cwd(), 'public', 'data', 'blogs');
const contentBlogs = path.join(process.cwd(), 'content', 'blogs');

if (fs.existsSync(publicBlogs)) {
  const files = fs.readdirSync(publicBlogs).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const full = path.join(publicBlogs, f);
    let b = readJson(full);

    // If JSON couldn't be parsed, try a best-effort text extraction
    if (!b) {
      try {
        const raw = fs.readFileSync(full, 'utf-8');
        // Extract title/slug heuristically
        const titleMatch = raw.match(/"title"\s*:\s*"([^"]+)"/);
        const slugMatch = raw.match(/"slug"\s*:\s*"([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : path.basename(f, '.json');
        const slug = slugMatch ? slugMatch[1] : title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

        // Extract content block between "content": and the next ,"tags" (best-effort)
        let content = '';
        const contentIdx = raw.indexOf('"content"');
        if (contentIdx !== -1) {
          const after = raw.slice(contentIdx);
          const splitIdx = after.indexOf(',"tags"');
          if (splitIdx !== -1) {
            let block = after.slice(after.indexOf(':') + 1, splitIdx).trim();
            // remove surrounding quotes if present
            if (block.startsWith("\"")) block = block.slice(1);
            if (block.endsWith('"')) block = block.slice(0, -1);
            // replace escaped quotes and escaped newlines if any
            block = block.replace(/\\"/g, '"').replace(/\\n/g, '\n');
            content = block;
          }
        }

        b = {
          id: slug,
          title,
          content,
          tags: [],
          slug,
          excerpt: '',
          featured_image: '',
          status: 'published',
        };
        console.log('Recovered (best-effort) from', f);
      } catch (err) {
        console.warn('Failed to recover content from', f, err);
        continue;
      }
    }

    const slug = b.slug || b.title && b.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || path.basename(f, '.json');
    const destDir = path.join(contentBlogs, slug);
    ensureDir(destDir);
    // Create meta.json (preserve most fields)
    const meta = { ...b };
    // Clean content from meta to keep content.md separate
    delete meta.content;
    // Normalize featured image if starts with './'
    if (meta.featured_image && meta.featured_image.startsWith('./')) {
      meta.featured_image = meta.featured_image.replace(/^\.\//, `/blogs/${slug}/`);
    }
    fs.writeFileSync(path.join(destDir, 'meta.json'), JSON.stringify(meta, null, 2));

    // Create content.md from content field or excerpt
    let md = '';
    if (b.content && b.content.trim().length > 0) {
      md = b.content;
    } else if (b.excerpt && b.excerpt.trim().length > 0) {
      md = `# ${b.title}\n\n${b.excerpt}\n`;
    } else {
      md = `# ${b.title}\n\n`;
    }
    // Rewrite relative image links like ./images/foo.png -> /blogs/<slug>/images/foo.png
    md = md.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/blogs/${slug}/${pth})`);
    fs.writeFileSync(path.join(destDir, 'content.md'), md);
    console.log('Migrated', f, '->', destDir);
  }
} else {
  console.log('No public blogs to migrate.');
}

// Migrate questions
const publicQuestions = path.join(process.cwd(), 'public', 'data', 'questions');
const contentQuestions = path.join(process.cwd(), 'content', 'questions');
const backupDir = path.join(process.cwd(), 'public', 'data', '_migrated_backup');
ensureDir(backupDir);

if (fs.existsSync(publicQuestions)) {
  const qfiles = fs.readdirSync(publicQuestions).filter(f => f.endsWith('.json'));
  for (const f of qfiles) {
    const full = path.join(publicQuestions, f);
    const q = readJson(full);
    if (!q) continue;
    const slug = q.slug || q.title && q.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || path.basename(f, '.json');
    const destDir = path.join(contentQuestions, slug);
    ensureDir(destDir);

    // If meta.json already exists, merge (prefer existing content)
    const metaPath = path.join(destDir, 'meta.json');
    const contentPath = path.join(destDir, 'content.md');

    // Build meta object from q, excluding content if present
    const meta = { ...q };
    delete meta.content;

    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    // Create content.md from description/examples/hints if not already present
    if (!fs.existsSync(contentPath)) {
      let md = `# ${q.title}\n\n${q.description || ''}\n\n`;
      if (Array.isArray(q.examples) && q.examples.length) {
        md += '## Examples\n\n';
        q.examples.forEach((ex) => {
          md += '```\n' + (ex.input || '') + '\n```\n\n';
          if (ex.output) md += `**Output:** ${ex.output}\n\n`;
          if (ex.explanation) md += `${ex.explanation}\n\n`;
        });
      }
      if (Array.isArray(q.hints) && q.hints.length) {
        md += '## Hints\n\n';
        q.hints.forEach(h => { md += `- ${h}\n`; });
      }
      // Normalize relative image refs
      md = md.replace(/!\[([^\]]*)\]\(\.\/([^\)]+)\)/g, (_, alt, pth) => `![${alt}](/questions/${slug}/${pth})`);
      fs.writeFileSync(contentPath, md);
    }

    // Move original JSON into backup
    const bdir = path.join(backupDir, 'questions'); ensureDir(bdir);
    const backupPath = path.join(bdir, f);
    fs.renameSync(full, backupPath);
    console.log('Migrated question', f, '->', destDir, '(backup at', backupPath, ')');
  }
} else {
  console.log('No public questions to migrate.');
}

// Migrate courses
const publicCourses = path.join(process.cwd(), 'public', 'data', 'courses');
const contentCourses = path.join(process.cwd(), 'content', 'courses');

if (fs.existsSync(publicCourses)) {
  const cfiles = fs.readdirSync(publicCourses).filter(f => f.endsWith('.json'));
  for (const f of cfiles) {
    const full = path.join(publicCourses, f);
    const c = readJson(full);
    if (!c) continue;
    const slug = c.slug || c.title && c.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || path.basename(f, '.json');
    const destDir = path.join(contentCourses, slug);
    ensureDir(destDir);

    const metaPath = path.join(destDir, 'meta.json');
    const contentPath = path.join(destDir, 'content.md');

    const meta = { ...c };
    delete meta.content;
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    if (!fs.existsSync(contentPath)) {
      let md = `# ${c.title}\n\n${c.description || ''}\n\n`;
      if (Array.isArray(c.modules) && c.modules.length) {
        md += '## Modules\n\n';
        c.modules.forEach(m => {
          md += `### ${m.title}\n\n${m.description || ''}\n\n`;
          if (Array.isArray(m.lessons)) {
            m.lessons.forEach(lesson => {
              md += `- ${lesson.title} (${lesson.duration || 'N/A'} min)\n`;
            });
            md += '\n';
          }
        });
      }
      fs.writeFileSync(contentPath, md);
    }

    // Move original JSON into backup
    const bdir = path.join(backupDir, 'courses'); ensureDir(bdir);
    const backupPath = path.join(bdir, f);
    fs.renameSync(full, backupPath);
    console.log('Migrated course', f, '->', destDir, '(backup at', backupPath, ')');
  }
} else {
  console.log('No public courses to migrate.');
}

console.log('Migration complete. Originals moved to public/data/_migrated_backup/.');
