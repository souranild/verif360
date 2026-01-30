const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { remark } = require('remark');
const remarkHtml = require('remark-html');

const blogsDir = path.join(__dirname, 'blogs');
const outputFile = path.join(__dirname, 'public', 'data', 'blogs.json');

async function processMarkdown(file) {
  const filePath = path.join(blogsDir, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkHtml)
    .process(content);
  const contentHtml = processedContent.toString();

  // Generate slug from filename (without .md)
  const slug = path.basename(file, '.md');

  return {
    ...data,
    slug,
    content: contentHtml,
  };
}

async function generateBlogs() {
  const files = fs.readdirSync(blogsDir).filter(file => file.endsWith('.md'));
  const blogs = await Promise.all(files.map(processMarkdown));

  fs.writeFileSync(outputFile, JSON.stringify(blogs, null, 2));
  console.log(`Generated ${blogs.length} blogs in ${outputFile}`);
}

generateBlogs().catch(console.error);