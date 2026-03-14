import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const appDir = path.join(projectRoot, 'app');
const rootLayoutPath = path.join(appDir, 'layout.tsx');

async function collectTsxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectTsxFiles(fullPath);
      }
      return entry.name.endsWith('.tsx') ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function countMatches(source, pattern) {
  return (source.match(pattern) ?? []).length;
}

const rootLayout = await readFile(rootLayoutPath, 'utf8');

if (/<head\b/i.test(rootLayout)) {
  throw new Error('Root app layout must not render <head>; use the Next.js metadata API instead.');
}

const tsxFiles = await collectTsxFiles(appDir);

for (const filePath of tsxFiles) {
  if (filePath === rootLayoutPath) {
    continue;
  }

  const source = await readFile(filePath, 'utf8');
  if (/<(?:html|body|head)\b/i.test(source)) {
    const relativePath = path.relative(projectRoot, filePath);
    throw new Error(`Only app/layout.tsx may render document-level tags. Found one in ${relativePath}.`);
  }
}

if (countMatches(rootLayout, /<html\b/gi) !== 1 || countMatches(rootLayout, /<body\b/gi) !== 1) {
  throw new Error('Root app layout must render exactly one <html> and one <body>.');
}

console.log('Root layout document structure is valid.');
