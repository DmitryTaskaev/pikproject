import { d as defineEventHandler, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';

const labBanner_get = defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const headers = {};
  if (config.apiKey) {
    headers["X-API-KEY"] = config.apiKey;
  }
  return await $fetch(`${config.apiBase}/labBanner`, {
    headers
  });
});

export { labBanner_get as default };
//# sourceMappingURL=labBanner.get.mjs.map
