import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', use: { baseURL: 'http://127.0.0.1:4173' },
  // Product entry is official-only. Historical demo specs remain archived alongside legacy unit tests.
  testMatch: ['official-core.spec.ts','official-procedures.spec.ts','character-finalization.spec.ts'],
  webServer: { command: 'npm run dev -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
