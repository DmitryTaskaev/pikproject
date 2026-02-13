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

const news_get = defineEventHandler(async (event) => {
  var _a, _b;
  const config = useRuntimeConfig();
  const headers = {};
  if (config.apiKey) {
    headers["X-API-KEY"] = config.apiKey;
  }
  const query = getQuery(event);
  if (query.id) {
    return await $fetch(`${config.apiBase}/news`, {
      headers,
      query: { id: query.id }
    });
  }
  if (query.code) {
    const listResponse = await $fetch(
      `${config.apiBase}/news`,
      { headers }
    );
    const match = (_b = (_a = listResponse.data) == null ? void 0 : _a.items) == null ? void 0 : _b.find(
      (item) => item.CODE === query.code
    );
    if (!match) {
      throw createError({
        statusCode: 404,
        statusMessage: "News item not found"
      });
    }
    return await $fetch(`${config.apiBase}/news`, {
      headers,
      query: { id: match.ID }
    });
  }
  return await $fetch(`${config.apiBase}/news`, {
    headers,
    query: {
      page: query.page,
      limit: query.limit
    }
  });
});

export { news_get as default };
//# sourceMappingURL=news.get.mjs.map
