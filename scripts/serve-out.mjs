import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, '..', 'out');

const DEFAULT_PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getPort() {
  const arg = process.argv.find((v) => v.startsWith('--port='));
  if (arg) {
    const p = Number(arg.split('=')[1]);
    if (!Number.isNaN(p) && p > 0) return p;
  }
  const env = Number(process.env.PORT);
  if (!Number.isNaN(env) && env > 0) return env;
  return DEFAULT_PORT;
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function resolveFile(requestPath) {
  // Normalize path: remove querystring, decode, prevent traversal
  const pathname = safeDecodeURIComponent(requestPath.split('?')[0] ?? '/');
  const cleaned = pathname.replaceAll('\\', '/');
  const noHash = cleaned.split('#')[0] ?? '/';
  const noLeading = noHash.startsWith('/') ? noHash.slice(1) : noHash;
  const normalized = path.posix.normalize(noLeading);
  if (normalized.startsWith('..')) return null;

  const ext = path.posix.extname(normalized);

  // Direct file request (/favicon.ico, /_next/static/...)
  if (ext) {
    const direct = path.join(OUT_DIR, normalized);
    return (await fileExists(direct)) ? direct : null;
  }

  // Route request: support both /route and /route/
  const asIndex = path.join(OUT_DIR, normalized, 'index.html');
  if (await fileExists(asIndex)) return asIndex;

  const asHtml = path.join(OUT_DIR, `${normalized}.html`);
  if (await fileExists(asHtml)) return asHtml;

  // Root fallback
  if (normalized === '' || normalized === '.') {
    const root = path.join(OUT_DIR, 'index.html');
    if (await fileExists(root)) return root;
  }

  // 404 fallback
  const notFound = path.join(OUT_DIR, '404.html');
  if (await fileExists(notFound)) return notFound;

  return null;
}

async function main() {
  // Ensure out/ exists
  try {
    const stat = await fs.stat(OUT_DIR);
    if (!stat.isDirectory()) throw new Error('out is not a directory');
  } catch {
    console.error(`[serve-out] "${OUT_DIR}" not found. Run "pnpm build" first.`);
    process.exit(1);
  }

  const port = getPort();

  const server = http.createServer(async (req, res) => {
    const url = req.url ?? '/';
    const filePath = await resolveFile(url);

    if (!filePath) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] ?? 'application/octet-stream';

    // Simple caching for hashed assets
    if (filePath.includes('/_next/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }
    res.setHeader('Content-Type', type);

    try {
      const data = await fs.readFile(filePath);
      // If we served 404.html, set status code 404
      if (filePath.endsWith(`${path.sep}404.html`)) res.statusCode = 404;
      res.end(data);
    } catch (e) {
      console.error('[serve-out] read error:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Internal server error');
    }
  });

  server.listen(port, () => {
    console.log(`✔ Serving "out/" on http://localhost:${port}`);
    console.log('  - Tip: run "pnpm build" before "pnpm start"');
  });
}

main();


