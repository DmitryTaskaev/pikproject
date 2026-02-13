import { d as defineEventHandler, u as useRuntimeConfig, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
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

const construction_get = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const headers = {};
  if (config.apiKey) {
    headers["X-API-KEY"] = config.apiKey;
  }
  const query = getQuery(event);
  if (!query.section_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "section_id is required"
    });
  }
  return await $fetch(`${config.apiBase}/construction`, {
    headers,
    query: {
      section_id: query.section_id,
      include_subsections: (_a = query.include_subsections) != null ? _a : 1
    }
  });
});

export { construction_get as default };
//# sourceMappingURL=construction.get.mjs.map
