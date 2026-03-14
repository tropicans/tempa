import process from 'node:process';

const baseUrl = process.env.TEST_BASE_URL ?? 'http://localhost:7000';
const routes = [
  { path: '/', marker: 'AI-ready learning platform' },
  { path: '/login', marker: 'Masuk ke workspace Anda' },
  { path: '/unauthorized', marker: 'Access Denied' },
];

for (const route of routes) {
  const response = await fetch(new URL(route.path, baseUrl));
  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Public route ${route.path} returned ${response.status}.`);
  }

  if (html.includes('app-frame-shell')) {
    throw new Error(`Public route ${route.path} unexpectedly rendered the authenticated app shell.`);
  }

  if (!html.includes(route.marker)) {
    throw new Error(`Public route ${route.path} did not render its expected content marker.`);
  }
}

console.log('Public routes are isolated from the authenticated shell.');
