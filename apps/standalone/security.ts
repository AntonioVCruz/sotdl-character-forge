import { z } from 'zod';
// Run before domain schemas are constructed: strict CSP must not trigger Zod JIT probes.
z.config({ jitless: true });
