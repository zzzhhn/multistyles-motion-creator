// Locate playwright-core (or playwright) and return its exports. Tools launch system Chrome (channel 'chrome')
// because Chromium builds without proprietary codecs cannot encode or decode H.264.
// Order: $PLAYWRIGHT_CORE (path to a playwright-core dir), a normal require, then the global @playwright/cli install.
const path = require('path'), os = require('os');
const tries = [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'playwright',
  path.join(os.homedir(), '.local/lib/node_modules/@playwright/cli/node_modules/playwright-core'),
  '/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core',
  '/usr/local/lib/node_modules/@playwright/cli/node_modules/playwright-core'].filter(Boolean);
for (const t of tries) { try { module.exports = require(t); return; } catch (e) { /* next */ } }
throw new Error('playwright-core not found: npm i -D playwright-core, or set PLAYWRIGHT_CORE=/path/to/playwright-core');
