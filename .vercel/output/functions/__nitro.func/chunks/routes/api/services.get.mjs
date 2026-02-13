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

const services_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const headers = {};
  if (config.apiKey) {
    headers["X-API-KEY"] = config.apiKey;
  }
  const query = getQuery(event);
  if (query.section_id) {
    return await $fetch(`${config.apiBase}/services`, {
      headers,
      query: { section_id: query.section_id }
    });
  }
  if (query.code) {
    const normalizedCode = String(query.code).trim();
    const listResponse = await $fetch(
      `${config.apiBase}/services`,
      { headers }
    );
    const match = (_b = (_a = listResponse.data) == null ? void 0 : _a.TREE) == null ? void 0 : _b.find((item) => {
      const sectionCode = item.SECTION.CODE || item.SECTION["~CODE"] || "";
      return sectionCode === normalizedCode;
    });
    if (!((_c = match == null ? void 0 : match.SECTION) == null ? void 0 : _c.ID)) {
      if (/^\d+$/.test(normalizedCode)) {
        return await $fetch(`${config.apiBase}/services`, {
          headers,
          query: { section_id: normalizedCode }
        });
      }
      throw createError({
        statusCode: 404,
        statusMessage: "Service section not found"
      });
    }
    return await $fetch(`${config.apiBase}/services`, {
      headers,
      query: { section_id: match.SECTION.ID }
    });
  }
  return await $fetch(`${config.apiBase}/services`, { headers });
});

export { services_get as default };
//# sourceMappingURL=services.get.mjs.map
