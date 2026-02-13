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

const resolveSectionCode = (section) => {
  return section.CODE || section["~CODE"] || "";
};
const findByPath = (nodes, segments) => {
  if (segments.length === 0) return null;
  const [head, ...rest] = segments;
  const match = nodes.find((node) => resolveSectionCode(node.SECTION) === head);
  if (!match) return null;
  if (rest.length === 0) return match;
  return findByPath(match.CHILDREN || [], rest);
};
const products_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const config = useRuntimeConfig();
  const headers = {};
  if (config.apiKey) {
    headers["X-API-KEY"] = config.apiKey;
  }
  const query = getQuery(event);
  if (query.section_id) {
    return await $fetch(`${config.apiBase}/products`, {
      headers,
      query: { section_id: query.section_id }
    });
  }
  if (query.path) {
    const rawPath = String(query.path).trim();
    if (!rawPath) {
      throw createError({ statusCode: 400, statusMessage: "Path is empty" });
    }
    const segments = rawPath.split("/").filter(Boolean);
    const listResponse = await $fetch(
      `${config.apiBase}/products`,
      { headers }
    );
    const tree = ((_a = listResponse.data) == null ? void 0 : _a.TREE) || [];
    const match = findByPath(tree, segments);
    if (!((_b = match == null ? void 0 : match.SECTION) == null ? void 0 : _b.ID)) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product section not found"
      });
    }
    return await $fetch(`${config.apiBase}/products`, {
      headers,
      query: { section_id: match.SECTION.ID }
    });
  }
  if (query.code) {
    const normalizedCode = String(query.code).trim();
    const listResponse = await $fetch(
      `${config.apiBase}/products`,
      { headers }
    );
    const tree = ((_c = listResponse.data) == null ? void 0 : _c.TREE) || [];
    const walk = (nodes) => {
      for (const node of nodes) {
        const code = resolveSectionCode(node.SECTION);
        if (code === normalizedCode) return node;
        const childMatch = walk(node.CHILDREN || []);
        if (childMatch) return childMatch;
      }
      return null;
    };
    const match = walk(tree);
    if (!((_d = match == null ? void 0 : match.SECTION) == null ? void 0 : _d.ID)) {
      if (/^\d+$/.test(normalizedCode)) {
        return await $fetch(`${config.apiBase}/products`, {
          headers,
          query: { section_id: normalizedCode }
        });
      }
      throw createError({
        statusCode: 404,
        statusMessage: "Product section not found"
      });
    }
    return await $fetch(`${config.apiBase}/products`, {
      headers,
      query: { section_id: match.SECTION.ID }
    });
  }
  return await $fetch(`${config.apiBase}/products`, { headers });
});

export { products_get as default };
//# sourceMappingURL=products.get.mjs.map
