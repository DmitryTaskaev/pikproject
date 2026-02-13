import { defineAsyncComponent, defineComponent, h, inject, computed, unref, shallowRef, provide, shallowReactive, createElementBlock, ref, Suspense, Fragment, createApp, useSSRContext, getCurrentInstance, cloneVNode, hasInjectionContext, toRef, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, mergeProps, withCtx, renderSlot, createTextVNode, toDisplayString, createBlock, openBlock, renderList, createCommentVNode, withAsyncContext, resolveDirective, useId, getCurrentScope, resolveComponent, toValue, readonly, nextTick } from 'vue';
import { $ as $fetch$1, k as baseURL, l as createHooks, m as executeAsync, c as createError$1, n as hasProtocol, o as joinURL, t as toRouteMatcher, q as createRouter$1, r as defu, s as klona, v as defuFn, w as parseQuery, x as getContext, y as withQuery, z as sanitizeStatusCode, A as withTrailingSlash, B as withoutTrailingSlash, C as isScriptProtocol } from '../nitro/nitro.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { _api, addAPIProvider, setCustomIconsLoader } from '@iconify/vue';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderSlot, ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { debounce } from 'perfect-debounce';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.0.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "404",
    path: "/404",
    component: () => Promise.resolve().then(() => _404$1)
  },
  {
    name: "lab",
    path: "/lab",
    component: () => Promise.resolve().then(() => lab)
  },
  {
    name: "pro",
    path: "/pro",
    component: () => Promise.resolve().then(() => pro)
  },
  {
    name: "about",
    path: "/about",
    component: () => Promise.resolve().then(() => about)
  },
  {
    name: "index",
    path: "/",
    component: () => Promise.resolve().then(() => index$5)
  },
  {
    name: "awards",
    path: "/awards",
    component: () => Promise.resolve().then(() => awards)
  },
  {
    name: "details",
    path: "/details",
    component: () => Promise.resolve().then(() => details)
  },
  {
    name: "sitemap",
    path: "/sitemap",
    component: () => Promise.resolve().then(() => sitemap)
  },
  {
    name: "contacts",
    path: "/contacts",
    component: () => Promise.resolve().then(() => contacts)
  },
  {
    name: "solution",
    path: "/solution",
    component: () => Promise.resolve().then(() => solution)
  },
  {
    name: "news-item",
    path: "/news-item",
    component: () => Promise.resolve().then(() => newsItem)
  },
  {
    name: "news",
    path: "/news",
    component: () => Promise.resolve().then(() => index$3)
  },
  {
    name: "news-code",
    path: "/news/:code()",
    component: () => Promise.resolve().then(() => _code_$1)
  },
  {
    name: "product-card",
    path: "/product-card",
    component: () => Promise.resolve().then(() => productCard),
    children: [
      {
        name: "product-card-path",
        path: ":path(.*)*",
        component: () => Promise.resolve().then(() => ____path_$2)
      }
    ]
  },
  {
    name: "public-offer",
    path: "/public-offer",
    component: () => Promise.resolve().then(() => publicOffer)
  },
  {
    name: "service-page",
    path: "/service-page",
    component: () => Promise.resolve().then(() => servicePage)
  },
  {
    name: "catalog",
    path: "/catalog",
    component: () => Promise.resolve().then(() => index$2)
  },
  {
    name: "services",
    path: "/services",
    component: () => Promise.resolve().then(() => index$1)
  },
  {
    name: "services-code",
    path: "/services/:code()",
    component: () => Promise.resolve().then(() => _code_)
  },
  {
    name: "products-catalog",
    path: "/products-catalog",
    component: () => Promise.resolve().then(() => productsCatalog)
  },
  {
    name: "services-catalog",
    path: "/services-catalog",
    redirect: "/services",
    component: () => Promise.resolve().then(() => servicesCatalog)
  },
  {
    name: "catalog-path",
    path: "/catalog/:path(.*)*",
    component: () => Promise.resolve().then(() => ____path_$1)
  },
  {
    name: "product-page",
    path: "/product-page",
    component: () => Promise.resolve().then(() => index)
  },
  {
    name: "product-page-path",
    path: "/product-page/:path(.*)*",
    component: () => Promise.resolve().then(() => ____path_)
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index2) => comp.components && comp.components.default === from.matched[index2]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[0]?.components?.default === from.matched[0]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach(async (to, _from) => {
      if (to.matched.length === 0) {
        await nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyHeroVideo = defineAsyncComponent(() => Promise.resolve().then(() => HeroVideo).then((r) => r["default"] || r.default || r));
const LazyHeroWrapper = defineAsyncComponent(() => Promise.resolve().then(() => HeroWrapper).then((r) => r["default"] || r.default || r));
const LazyLabTable = defineAsyncComponent(() => Promise.resolve().then(() => LabTable).then((r) => r["default"] || r.default || r));
const LazyPromoStrip = defineAsyncComponent(() => Promise.resolve().then(() => PromoStrip).then((r) => r["default"] || r.default || r));
const LazyRegalia = defineAsyncComponent(() => Promise.resolve().then(() => Regalia).then((r) => r["default"] || r.default || r));
const LazySearchComponent = defineAsyncComponent(() => Promise.resolve().then(() => SearchComponent).then((r) => r["default"] || r.default || r));
const LazyServiceItem = defineAsyncComponent(() => Promise.resolve().then(() => ServiceItem).then((r) => r["default"] || r.default || r));
const LazySitemapGrid = defineAsyncComponent(() => Promise.resolve().then(() => SitemapGrid).then((r) => r["default"] || r.default || r));
const LazySvgSprite = defineAsyncComponent(() => Promise.resolve().then(() => SvgSprite).then((r) => r["default"] || r.default || r));
const LazyTableFeature = defineAsyncComponent(() => Promise.resolve().then(() => TableFeature).then((r) => r["default"] || r.default || r));
const LazyAdvantages = defineAsyncComponent(() => Promise.resolve().then(() => Advantages).then((r) => r["default"] || r.default || r));
const LazyCollapsibleText = defineAsyncComponent(() => Promise.resolve().then(() => CollapsibleText$1).then((r) => r["default"] || r.default || r));
const LazyConsultationBlock = defineAsyncComponent(() => Promise.resolve().then(() => ConsultationBlock).then((r) => r["default"] || r.default || r));
const LazyContentBlock = defineAsyncComponent(() => Promise.resolve().then(() => ContentBlock).then((r) => r["default"] || r.default || r));
const LazyFactory = defineAsyncComponent(() => Promise.resolve().then(() => Factory$1).then((r) => r["default"] || r.default || r));
const LazyFittingBlock = defineAsyncComponent(() => Promise.resolve().then(() => FittingBlock).then((r) => r["default"] || r.default || r));
const LazyLabBlock = defineAsyncComponent(() => Promise.resolve().then(() => LabBlock).then((r) => r["default"] || r.default || r));
const LazyNewsBlock = defineAsyncComponent(() => Promise.resolve().then(() => NewsBlock).then((r) => r["default"] || r.default || r));
const LazyOwnCapacities = defineAsyncComponent(() => Promise.resolve().then(() => OwnCapacities).then((r) => r["default"] || r.default || r));
const LazyProductCatalog = defineAsyncComponent(() => Promise.resolve().then(() => ProductCatalog).then((r) => r["default"] || r.default || r));
const LazyProductionFacilities = defineAsyncComponent(() => Promise.resolve().then(() => ProductionFacilities).then((r) => r["default"] || r.default || r));
const LazySeoBlock = defineAsyncComponent(() => Promise.resolve().then(() => SeoBlock).then((r) => r["default"] || r.default || r));
const LazyServiceCatalog = defineAsyncComponent(() => Promise.resolve().then(() => ServiceCatalog).then((r) => r["default"] || r.default || r));
const LazyServicesBlock = defineAsyncComponent(() => Promise.resolve().then(() => ServicesBlock).then((r) => r["default"] || r.default || r));
const LazySupplyBlock = defineAsyncComponent(() => Promise.resolve().then(() => SupplyBlock).then((r) => r["default"] || r.default || r));
const LazyBenefitCard = defineAsyncComponent(() => Promise.resolve().then(() => BenefitCard).then((r) => r["default"] || r.default || r));
const LazyContactCard = defineAsyncComponent(() => Promise.resolve().then(() => ContactCard).then((r) => r["default"] || r.default || r));
const LazyEquipmentCard = defineAsyncComponent(() => Promise.resolve().then(() => EquipmentCard$1).then((r) => r["default"] || r.default || r));
const LazyEquipmentNewCard = defineAsyncComponent(() => Promise.resolve().then(() => EquipmentNewCard).then((r) => r["default"] || r.default || r));
const LazyExperienceCard = defineAsyncComponent(() => Promise.resolve().then(() => ExperienceCard).then((r) => r["default"] || r.default || r));
const LazyLabCard = defineAsyncComponent(() => Promise.resolve().then(() => LabCard).then((r) => r["default"] || r.default || r));
const LazyNewsCard = defineAsyncComponent(() => Promise.resolve().then(() => NewsCard).then((r) => r["default"] || r.default || r));
const LazyPipeCard = defineAsyncComponent(() => Promise.resolve().then(() => PipeCard).then((r) => r["default"] || r.default || r));
const LazyProductCard = defineAsyncComponent(() => Promise.resolve().then(() => ProductCard).then((r) => r["default"] || r.default || r));
const LazyProductTableCard = defineAsyncComponent(() => Promise.resolve().then(() => ProductTableCard).then((r) => r["default"] || r.default || r));
const LazyRegaliaCard = defineAsyncComponent(() => Promise.resolve().then(() => RegaliaCard).then((r) => r["default"] || r.default || r));
const LazyServiceCard = defineAsyncComponent(() => Promise.resolve().then(() => ServiceCard).then((r) => r["default"] || r.default || r));
const LazyTestCard = defineAsyncComponent(() => Promise.resolve().then(() => TestCard).then((r) => r["default"] || r.default || r));
const LazyOrderForm = defineAsyncComponent(() => Promise.resolve().then(() => OrderForm).then((r) => r["default"] || r.default || r));
const LazyPipesList = defineAsyncComponent(() => Promise.resolve().then(() => PipesList).then((r) => r["default"] || r.default || r));
const LazyDocumentationModal = defineAsyncComponent(() => Promise.resolve().then(() => DocumentationModal).then((r) => r["default"] || r.default || r));
const LazyDocumentsModal = defineAsyncComponent(() => Promise.resolve().then(() => DocumentsModal).then((r) => r["default"] || r.default || r));
const LazyExperienceCardModal = defineAsyncComponent(() => Promise.resolve().then(() => ExperienceCardModal).then((r) => r["default"] || r.default || r));
const LazyOrderModal = defineAsyncComponent(() => Promise.resolve().then(() => OrderModal).then((r) => r["default"] || r.default || r));
const LazySHero = defineAsyncComponent(() => Promise.resolve().then(() => SHero).then((r) => r["default"] || r.default || r));
const LazyAExperience = defineAsyncComponent(() => Promise.resolve().then(() => AExperience).then((r) => r["default"] || r.default || r));
const LazyAManufacture = defineAsyncComponent(() => Promise.resolve().then(() => AManufacture).then((r) => r["default"] || r.default || r));
const LazyAPartners = defineAsyncComponent(() => Promise.resolve().then(() => APartners).then((r) => r["default"] || r.default || r));
const LazyAwardCard = defineAsyncComponent(() => Promise.resolve().then(() => AwardCard).then((r) => r["default"] || r.default || r));
const LazyAwardsList = defineAsyncComponent(() => Promise.resolve().then(() => AwardsList).then((r) => r["default"] || r.default || r));
const LazyCPipeCatalog = defineAsyncComponent(() => Promise.resolve().then(() => CPipeCatalog).then((r) => r["default"] || r.default || r));
const LazyCPSection = defineAsyncComponent(() => Promise.resolve().then(() => CPSection).then((r) => r["default"] || r.default || r));
const LazyDetailsList = defineAsyncComponent(() => Promise.resolve().then(() => DetailsList).then((r) => r["default"] || r.default || r));
const LazyLEquipment = defineAsyncComponent(() => Promise.resolve().then(() => LEquipment).then((r) => r["default"] || r.default || r));
const LazyLPrices = defineAsyncComponent(() => Promise.resolve().then(() => LPrices).then((r) => r["default"] || r.default || r));
const LazyLSection = defineAsyncComponent(() => Promise.resolve().then(() => LSection).then((r) => r["default"] || r.default || r));
const LazyLTests = defineAsyncComponent(() => Promise.resolve().then(() => LTests).then((r) => r["default"] || r.default || r));
const LazyMAbout = defineAsyncComponent(() => Promise.resolve().then(() => MAbout).then((r) => r["default"] || r.default || r));
const LazyMHero = defineAsyncComponent(() => Promise.resolve().then(() => MHero).then((r) => r["default"] || r.default || r));
const LazyNList = defineAsyncComponent(() => Promise.resolve().then(() => NList).then((r) => r["default"] || r.default || r));
const LazyNTitle = defineAsyncComponent(() => Promise.resolve().then(() => NTitle).then((r) => r["default"] || r.default || r));
const LazyProItem = defineAsyncComponent(() => Promise.resolve().then(() => ProItem).then((r) => r["default"] || r.default || r));
const LazyProList = defineAsyncComponent(() => Promise.resolve().then(() => ProList).then((r) => r["default"] || r.default || r));
const LazyPCCatalog = defineAsyncComponent(() => Promise.resolve().then(() => PCCatalog).then((r) => r["default"] || r.default || r));
const LazyPCDocuments = defineAsyncComponent(() => Promise.resolve().then(() => PCDocuments).then((r) => r["default"] || r.default || r));
const LazyPCHero = defineAsyncComponent(() => Promise.resolve().then(() => PCHero).then((r) => r["default"] || r.default || r));
const LazyPPCatalog = defineAsyncComponent(() => Promise.resolve().then(() => PPCatalog).then((r) => r["default"] || r.default || r));
const LazyPPHero = defineAsyncComponent(() => Promise.resolve().then(() => PPHero).then((r) => r["default"] || r.default || r));
const LazyPSCList = defineAsyncComponent(() => Promise.resolve().then(() => PSCList).then((r) => r["default"] || r.default || r));
const LazyPSCTitle = defineAsyncComponent(() => Promise.resolve().then(() => PSCTitle).then((r) => r["default"] || r.default || r));
const LazyPOText = defineAsyncComponent(() => Promise.resolve().then(() => POText).then((r) => r["default"] || r.default || r));
const LazySPList = defineAsyncComponent(() => Promise.resolve().then(() => SPList).then((r) => r["default"] || r.default || r));
const LazySCList = defineAsyncComponent(() => Promise.resolve().then(() => SCList).then((r) => r["default"] || r.default || r));
const LazyActionsPopup = defineAsyncComponent(() => Promise.resolve().then(() => ActionsPopup).then((r) => r["default"] || r.default || r));
const LazyCookiesPopup = defineAsyncComponent(() => Promise.resolve().then(() => CookiesPopup).then((r) => r["default"] || r.default || r));
const LazyDownloadDocumentsPopup = defineAsyncComponent(() => Promise.resolve().then(() => DownloadDocumentsPopup).then((r) => r["default"] || r.default || r));
const LazyCatalogSection = defineAsyncComponent(() => Promise.resolve().then(() => CatalogSection).then((r) => r["default"] || r.default || r));
const LazyConstructionSection = defineAsyncComponent(() => Promise.resolve().then(() => ConstructionSection).then((r) => r["default"] || r.default || r));
const LazyTableSection = defineAsyncComponent(() => Promise.resolve().then(() => TableSection).then((r) => r["default"] || r.default || r));
const LazyConstructionSlider = defineAsyncComponent(() => Promise.resolve().then(() => ConstructionSlider).then((r) => r["default"] || r.default || r));
const LazyDocumentSlider = defineAsyncComponent(() => Promise.resolve().then(() => DocumentSlider).then((r) => r["default"] || r.default || r));
const LazyExperienceSlider = defineAsyncComponent(() => Promise.resolve().then(() => ExperienceSlider).then((r) => r["default"] || r.default || r));
const LazyNewsSlider = defineAsyncComponent(() => Promise.resolve().then(() => NewsSlider).then((r) => r["default"] || r.default || r));
const LazyPCHeroSlider = defineAsyncComponent(() => Promise.resolve().then(() => PCHeroSlider).then((r) => r["default"] || r.default || r));
const LazyPartnersSlider = defineAsyncComponent(() => Promise.resolve().then(() => PartnersSlider).then((r) => r["default"] || r.default || r));
const LazyProductTableSlider = defineAsyncComponent(() => Promise.resolve().then(() => ProductTableSlider).then((r) => r["default"] || r.default || r));
const LazyConstructionSlide = defineAsyncComponent(() => Promise.resolve().then(() => ConstructionSlide$1).then((r) => r["default"] || r.default || r));
const LazyDocumentSlide = defineAsyncComponent(() => Promise.resolve().then(() => DocumentSlide).then((r) => r["default"] || r.default || r));
const LazyExperienceSlide = defineAsyncComponent(() => Promise.resolve().then(() => ExperienceSlide).then((r) => r["default"] || r.default || r));
const LazyMainHeroSlide = defineAsyncComponent(() => Promise.resolve().then(() => MainHeroSlide).then((r) => r["default"] || r.default || r));
const LazyPCHeroSlide = defineAsyncComponent(() => Promise.resolve().then(() => PCHeroSlide).then((r) => r["default"] || r.default || r));
const LazyPartnerSlide = defineAsyncComponent(() => Promise.resolve().then(() => PartnerSlide).then((r) => r["default"] || r.default || r));
const LazyProductTableSlide = defineAsyncComponent(() => Promise.resolve().then(() => ProductTableSlide).then((r) => r["default"] || r.default || r));
const LazyProductTable = defineAsyncComponent(() => Promise.resolve().then(() => ProductTable$1).then((r) => r["default"] || r.default || r));
const LazyBaseSwiper = defineAsyncComponent(() => Promise.resolve().then(() => BaseSwiper).then((r) => r["default"] || r.default || r));
const LazyBorderLine = defineAsyncComponent(() => Promise.resolve().then(() => BorderLine).then((r) => r["default"] || r.default || r));
const LazyBreadcrumbs = defineAsyncComponent(() => Promise.resolve().then(() => Breadcrumbs).then((r) => r["default"] || r.default || r));
const LazyButton = defineAsyncComponent(() => Promise.resolve().then(() => Button).then((r) => r["default"] || r.default || r));
const LazyCloseButton = defineAsyncComponent(() => Promise.resolve().then(() => CloseButton).then((r) => r["default"] || r.default || r));
const LazyCopyLink = defineAsyncComponent(() => Promise.resolve().then(() => CopyLink).then((r) => r["default"] || r.default || r));
const LazyCopyLinkComplex = defineAsyncComponent(() => Promise.resolve().then(() => CopyLinkComplex).then((r) => r["default"] || r.default || r));
const LazyCustomControls = defineAsyncComponent(() => Promise.resolve().then(() => CustomControls).then((r) => r["default"] || r.default || r));
const LazyDecorativeWrap = defineAsyncComponent(() => Promise.resolve().then(() => DecorativeWrap).then((r) => r["default"] || r.default || r));
const LazyDropdown = defineAsyncComponent(() => Promise.resolve().then(() => Dropdown).then((r) => r["default"] || r.default || r));
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(() => Icon).then((r) => r["default"] || r.default || r));
const LazyImage = defineAsyncComponent(() => Promise.resolve().then(() => Image).then((r) => r["default"] || r.default || r));
const LazyInput = defineAsyncComponent(() => Promise.resolve().then(() => Input).then((r) => r["default"] || r.default || r));
const LazyModal = defineAsyncComponent(() => Promise.resolve().then(() => Modal).then((r) => r["default"] || r.default || r));
const LazyNavBtn = defineAsyncComponent(() => Promise.resolve().then(() => NavBtn).then((r) => r["default"] || r.default || r));
const LazyNavLink = defineAsyncComponent(() => Promise.resolve().then(() => NavLink$1).then((r) => r["default"] || r.default || r));
const LazyPopupButton = defineAsyncComponent(() => Promise.resolve().then(() => PopupButton).then((r) => r["default"] || r.default || r));
const LazySectionDropdown = defineAsyncComponent(() => Promise.resolve().then(() => SectionDropdown).then((r) => r["default"] || r.default || r));
const LazySectionWrapper = defineAsyncComponent(() => Promise.resolve().then(() => SectionWrapper).then((r) => r["default"] || r.default || r));
const LazyVideo = defineAsyncComponent(() => Promise.resolve().then(() => Video).then((r) => r["default"] || r.default || r));
const LazyFooter = defineAsyncComponent(() => Promise.resolve().then(() => Footer).then((r) => r["default"] || r.default || r));
const LazyFooterCard = defineAsyncComponent(() => Promise.resolve().then(() => FooterCard).then((r) => r["default"] || r.default || r));
const LazyFooterList = defineAsyncComponent(() => Promise.resolve().then(() => FooterList).then((r) => r["default"] || r.default || r));
const LazyHeader = defineAsyncComponent(() => Promise.resolve().then(() => Header).then((r) => r["default"] || r.default || r));
const LazyHeaderActions = defineAsyncComponent(() => Promise.resolve().then(() => HeaderActions).then((r) => r["default"] || r.default || r));
const LazyHeaderNav = defineAsyncComponent(() => Promise.resolve().then(() => HeaderNav).then((r) => r["default"] || r.default || r));
const LazyCustomTitle = defineAsyncComponent(() => Promise.resolve().then(() => CustomTitle).then((r) => r["default"] || r.default || r));
const LazyText = defineAsyncComponent(() => Promise.resolve().then(() => Text).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["HeroVideo", LazyHeroVideo],
  ["HeroWrapper", LazyHeroWrapper],
  ["LabTable", LazyLabTable],
  ["PromoStrip", LazyPromoStrip],
  ["Regalia", LazyRegalia],
  ["SearchComponent", LazySearchComponent],
  ["ServiceItem", LazyServiceItem],
  ["SitemapGrid", LazySitemapGrid],
  ["SvgSprite", LazySvgSprite],
  ["TableFeature", LazyTableFeature],
  ["Advantages", LazyAdvantages],
  ["CollapsibleText", LazyCollapsibleText],
  ["ConsultationBlock", LazyConsultationBlock],
  ["ContentBlock", LazyContentBlock],
  ["Factory", LazyFactory],
  ["FittingBlock", LazyFittingBlock],
  ["LabBlock", LazyLabBlock],
  ["NewsBlock", LazyNewsBlock],
  ["OwnCapacities", LazyOwnCapacities],
  ["ProductCatalog", LazyProductCatalog],
  ["ProductionFacilities", LazyProductionFacilities],
  ["SeoBlock", LazySeoBlock],
  ["ServiceCatalog", LazyServiceCatalog],
  ["ServicesBlock", LazyServicesBlock],
  ["SupplyBlock", LazySupplyBlock],
  ["BenefitCard", LazyBenefitCard],
  ["ContactCard", LazyContactCard],
  ["EquipmentCard", LazyEquipmentCard],
  ["EquipmentNewCard", LazyEquipmentNewCard],
  ["ExperienceCard", LazyExperienceCard],
  ["LabCard", LazyLabCard],
  ["NewsCard", LazyNewsCard],
  ["PipeCard", LazyPipeCard],
  ["ProductCard", LazyProductCard],
  ["ProductTableCard", LazyProductTableCard],
  ["RegaliaCard", LazyRegaliaCard],
  ["ServiceCard", LazyServiceCard],
  ["TestCard", LazyTestCard],
  ["OrderForm", LazyOrderForm],
  ["PipesList", LazyPipesList],
  ["DocumentationModal", LazyDocumentationModal],
  ["DocumentsModal", LazyDocumentsModal],
  ["ExperienceCardModal", LazyExperienceCardModal],
  ["OrderModal", LazyOrderModal],
  ["SHero", LazySHero],
  ["AExperience", LazyAExperience],
  ["AManufacture", LazyAManufacture],
  ["APartners", LazyAPartners],
  ["AwardCard", LazyAwardCard],
  ["AwardsList", LazyAwardsList],
  ["CPipeCatalog", LazyCPipeCatalog],
  ["CPSection", LazyCPSection],
  ["DetailsList", LazyDetailsList],
  ["LEquipment", LazyLEquipment],
  ["LPrices", LazyLPrices],
  ["LSection", LazyLSection],
  ["LTests", LazyLTests],
  ["MAbout", LazyMAbout],
  ["MHero", LazyMHero],
  ["NList", LazyNList],
  ["NTitle", LazyNTitle],
  ["ProItem", LazyProItem],
  ["ProList", LazyProList],
  ["PCCatalog", LazyPCCatalog],
  ["PCDocuments", LazyPCDocuments],
  ["PCHero", LazyPCHero],
  ["PPCatalog", LazyPPCatalog],
  ["PPHero", LazyPPHero],
  ["PSCList", LazyPSCList],
  ["PSCTitle", LazyPSCTitle],
  ["POText", LazyPOText],
  ["SPList", LazySPList],
  ["SCList", LazySCList],
  ["ActionsPopup", LazyActionsPopup],
  ["CookiesPopup", LazyCookiesPopup],
  ["DownloadDocumentsPopup", LazyDownloadDocumentsPopup],
  ["CatalogSection", LazyCatalogSection],
  ["ConstructionSection", LazyConstructionSection],
  ["TableSection", LazyTableSection],
  ["ConstructionSlider", LazyConstructionSlider],
  ["DocumentSlider", LazyDocumentSlider],
  ["ExperienceSlider", LazyExperienceSlider],
  ["NewsSlider", LazyNewsSlider],
  ["PCHeroSlider", LazyPCHeroSlider],
  ["PartnersSlider", LazyPartnersSlider],
  ["ProductTableSlider", LazyProductTableSlider],
  ["ConstructionSlide", LazyConstructionSlide],
  ["DocumentSlide", LazyDocumentSlide],
  ["ExperienceSlide", LazyExperienceSlide],
  ["MainHeroSlide", LazyMainHeroSlide],
  ["PCHeroSlide", LazyPCHeroSlide],
  ["PartnerSlide", LazyPartnerSlide],
  ["ProductTableSlide", LazyProductTableSlide],
  ["ProductTable", LazyProductTable],
  ["BaseSwiper", LazyBaseSwiper],
  ["BorderLine", LazyBorderLine],
  ["Breadcrumbs", LazyBreadcrumbs],
  ["Button", LazyButton],
  ["CloseButton", LazyCloseButton],
  ["CopyLink", LazyCopyLink],
  ["CopyLinkComplex", LazyCopyLinkComplex],
  ["CustomControls", LazyCustomControls],
  ["DecorativeWrap", LazyDecorativeWrap],
  ["Dropdown", LazyDropdown],
  ["Icon", LazyIcon],
  ["Image", LazyImage],
  ["Input", LazyInput],
  ["Modal", LazyModal],
  ["NavBtn", LazyNavBtn],
  ["NavLink", LazyNavLink],
  ["PopupButton", LazyPopupButton],
  ["SectionDropdown", LazySectionDropdown],
  ["SectionWrapper", LazySectionWrapper],
  ["Video", LazyVideo],
  ["Footer", LazyFooter],
  ["FooterCard", LazyFooterCard],
  ["FooterList", LazyFooterList],
  ["Header", LazyHeader],
  ["HeaderActions", LazyHeaderActions],
  ["HeaderNav", LazyHeaderNav],
  ["CustomTitle", LazyCustomTitle],
  ["Text", LazyText]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const inlineConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(__appConfig);
  return nuxtApp._appConfig;
}
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8
];
const layouts = {
  default: defineAsyncComponent(() => Promise.resolve().then(() => _default).then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0$k = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const ServerPlaceholder = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_2$o = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2o = {};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0$k;
  const _component_NuxtRouteAnnouncer = ServerPlaceholder;
  const _component_NuxtPage = __nuxt_component_2$o;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtRouteAnnouncer),
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2o = _sfc_main$2o.setup;
_sfc_main$2o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$2o ? _sfc_setup$2o(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2o, [["ssrRender", _sfc_ssrRender$e]]);
const _sfc_main$2n = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description2 = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => Promise.resolve().then(() => error404$1));
    const _Error = defineAsyncComponent(() => Promise.resolve().then(() => error500$1));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description2), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$2n = _sfc_main$2n.setup;
_sfc_main$2n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$2n ? _sfc_setup$2n(props, ctx) : void 0;
};
const _sfc_main$2m = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$2n), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$2m = _sfc_main$2m.setup;
_sfc_main$2m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$2m ? _sfc_setup$2m(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main$2m);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);
const _sfc_main$2l = /* @__PURE__ */ defineComponent({
  __name: "CustomTitle",
  __ssrInlineRender: true,
  props: {
    class: { default: void 0 },
    tag: { default: "h2" },
    mode: { default: "xxl" }
  },
  setup(__props) {
    const props = __props;
    const tag = props.tag;
    const classes = computed(() => {
      const base = ["title"];
      if (props.mode) {
        base.push(`title_${props.mode}`);
      }
      if (props.mode === "xxl") {
        base.push("to-animate");
      }
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(tag)), mergeProps({ class: classes.value }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$2l = _sfc_main$2l.setup;
_sfc_main$2l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/typography/CustomTitle.vue");
  return _sfc_setup$2l ? _sfc_setup$2l(props, ctx) : void 0;
};
const __nuxt_component_0$j = Object.assign(_sfc_main$2l, { __name: "CustomTitle" });
const CustomTitle = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2k = /* @__PURE__ */ defineComponent({
  __name: "Text",
  __ssrInlineRender: true,
  props: {
    class: { default: void 0 },
    tag: { default: "p" },
    letterSpacing: { default: "sm" },
    weight: { default: "regular" },
    uppercase: { type: Boolean, default: void 0 },
    size: { default: "lg" },
    lineHeight: { default: "lg" },
    href: { default: void 0 },
    design: { default: void 0 }
  },
  setup(__props) {
    const props = __props;
    const tag = props.href ? "a" : props.tag;
    const classes = computed(() => {
      const base = [
        "text",
        `text_size-${props.size}`,
        `text_weight-${props.weight}`,
        `text_line-height-${props.lineHeight}`,
        `text_letter-spacing-${props.letterSpacing}`
      ];
      if (props.uppercase) {
        base.push("text_uppercase");
      }
      if (props.design) {
        base.push(`text_${props.design}`);
      }
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(tag)), mergeProps({
        class: classes.value,
        href: _ctx.href
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$2k = _sfc_main$2k.setup;
_sfc_main$2k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/typography/Text.vue");
  return _sfc_setup$2k ? _sfc_setup$2k(props, ctx) : void 0;
};
const __nuxt_component_4$b = Object.assign(_sfc_main$2k, { __name: "Text" });
const Text = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2j = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {},
    isSprite: { type: Boolean, default: true },
    class: {},
    width: {},
    height: {},
    mode: {},
    src: {}
  },
  setup(__props) {
    const props = __props;
    const baseUrl = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const classes = computed(() => {
      const base = ["icon", `icon--${props.name}`];
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      if (props.mode == "prev") {
        base.push("icon_prev");
      }
      if (props.mode == "next") {
        base.push("icon_next");
      }
      return base;
    });
    const resolvedSrc = computed(() => {
      if (props.src) return props.src;
      return `${baseUrl}images/svg/${props.name}.svg`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (props.isSprite) {
        _push(`<svg${ssrRenderAttrs(mergeProps({
          class: classes.value,
          width: props.width,
          height: props.height
        }, _attrs))}><use${ssrRenderAttr("xlink:href", `#icon--${props.name}`)}></use></svg>`);
      } else {
        _push(`<img${ssrRenderAttrs(mergeProps({
          class: classes.value,
          src: resolvedSrc.value,
          alt: props.name,
          style: { width: props.width, height: props.height }
        }, _attrs))}>`);
      }
    };
  }
});
const _sfc_setup$2j = _sfc_main$2j.setup;
_sfc_main$2j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Icon.vue");
  return _sfc_setup$2j ? _sfc_setup$2j(props, ctx) : void 0;
};
const __nuxt_component_0$i = Object.assign(_sfc_main$2j, { __name: "Icon" });
const Icon = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2i = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    size: {},
    href: {},
    text: {},
    class: {},
    isOpen: { type: Boolean },
    icon: {},
    isModalOpener: { type: Boolean },
    modalName: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["btn"];
      if (props.size) {
        base.push(`btn_${props.size}`);
      }
      if (props.text && props.icon) {
        base.push("btn_complex");
      } else if (props.icon) {
        base.push("btn_icon");
      }
      if (props.isOpen) {
        base.push("btn_active");
      }
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      if (props.isModalOpener) {
        base.push("modal-opener", "js-modal-opener");
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      if (props.icon && !props.text) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(classes),
          "data-modal": props.modalName
        }, _attrs))}>`);
        if (props.icon) {
          _push(ssrRenderComponent(_component_Icon, {
            class: "btn__icon",
            name: props.icon.name,
            width: props.icon.width,
            height: props.icon.height,
            mode: props.icon.mode
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<a${ssrRenderAttrs(mergeProps({
          href: props.href,
          class: unref(classes),
          "data-modal": props.modalName
        }, _attrs))}>`);
        if (props.text) {
          _push(ssrRenderComponent(_component_Text, {
            class: "btn__text",
            tag: "span",
            size: "sm",
            "line-height": "xl",
            design: "accent"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(props.text)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(props.text), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (props.icon) {
          _push(ssrRenderComponent(_component_Icon, {
            name: props.icon.name,
            width: props.icon.width,
            height: props.icon.height,
            mode: props.icon.mode
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</a>`);
      }
    };
  }
});
const _sfc_setup$2i = _sfc_main$2i.setup;
_sfc_main$2i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Button.vue");
  return _sfc_setup$2i ? _sfc_setup$2i(props, ctx) : void 0;
};
const __nuxt_component_1$p = Object.assign(_sfc_main$2i, { __name: "Button" });
const Button = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$p
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2h = /* @__PURE__ */ defineComponent({
  __name: "BorderLine",
  __ssrInlineRender: true,
  props: {
    position: {},
    design: {}
  },
  setup(__props) {
    const props = __props;
    const wrapClasses = computed(() => {
      return ["border-line-wrap", `border-line-wrap_${props.position}`];
    });
    const lineClasses = computed(() => {
      return ["border-line", `border-line_${props.design}`];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(wrapClasses) }, _attrs))}><div class="${ssrRenderClass(unref(lineClasses))}"></div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2h = _sfc_main$2h.setup;
_sfc_main$2h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/BorderLine.vue");
  return _sfc_setup$2h ? _sfc_setup$2h(props, ctx) : void 0;
};
const __nuxt_component_2$n = Object.assign(_sfc_main$2h, { __name: "BorderLine" });
const BorderLine = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2g = /* @__PURE__ */ defineComponent({
  __name: "CopyLink",
  __ssrInlineRender: true,
  props: {
    text: {},
    href: {},
    mode: {}
  },
  setup(__props) {
    const props = __props;
    const isCopied = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["copy-link", { "copy-link_accent": props.mode }]
      }, _attrs))}><button class="copy-link__icon">`);
      _push(ssrRenderComponent(_component_Icon, { name: "copy-button" }, null, _parent));
      if (unref(isCopied)) {
        _push(`<div class="copy-link__icon--message">Скопировано</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "copy-link__item",
        tag: "a",
        href: props.href,
        size: "xl",
        "line-height": "xs",
        design: "primary-bright"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.text), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2g = _sfc_main$2g.setup;
_sfc_main$2g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/CopyLink.vue");
  return _sfc_setup$2g ? _sfc_setup$2g(props, ctx) : void 0;
};
const __nuxt_component_3$f = Object.assign(_sfc_main$2g, { __name: "CopyLink" });
const CopyLink = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2f = /* @__PURE__ */ defineComponent({
  __name: "CopyLinkComplex",
  __ssrInlineRender: true,
  props: {
    label: {},
    copyLink: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_CopyLink = __nuxt_component_3$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "copy-link-complex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "copy-link-complex__label",
        tag: "span",
        size: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.label)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.label), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CopyLink, mergeProps({ class: "copy-link-complex__item" }, props.copyLink), null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2f = _sfc_main$2f.setup;
_sfc_main$2f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/CopyLinkComplex.vue");
  return _sfc_setup$2f ? _sfc_setup$2f(props, ctx) : void 0;
};
const __nuxt_component_3$e = Object.assign(_sfc_main$2f, { __name: "CopyLinkComplex" });
const CopyLinkComplex = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2e = /* @__PURE__ */ defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    id: {},
    type: {},
    name: {},
    class: {},
    required: { type: Boolean },
    inputmode: {},
    placeholder: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["input"];
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<input${ssrRenderAttrs(mergeProps({
        id: props.id,
        class: classes.value,
        type: props.type,
        name: props.name,
        required: props.required,
        inputmode: props.inputmode,
        placeholder: props.placeholder,
        title: props.title
      }, _attrs))}>`);
    };
  }
});
const _sfc_setup$2e = _sfc_main$2e.setup;
_sfc_main$2e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Input.vue");
  return _sfc_setup$2e ? _sfc_setup$2e(props, ctx) : void 0;
};
const __nuxt_component_1$o = Object.assign(_sfc_main$2e, { __name: "Input" });
const Input = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2d = /* @__PURE__ */ defineComponent({
  __name: "OrderForm",
  __ssrInlineRender: true,
  props: {
    prefix: { default: "consultation" }
  },
  setup(__props) {
    const props = __props;
    const getFieldId = (fieldName) => `${props.prefix}-${fieldName}`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Input = __nuxt_component_1$o;
      const _component_Icon = __nuxt_component_0$i;
      const _component_Button = __nuxt_component_1$p;
      _push(`<form${ssrRenderAttrs(mergeProps({
        id: `${props.prefix}-form`,
        class: "order-form",
        action: "#",
        method: "post"
      }, _attrs))}><div class="order-form__top">`);
      if (props.prefix === "documents-modal") {
        _push(`<label class="order-form__organization-name"${ssrRenderAttr("for", getFieldId("organization-name"))}>`);
        _push(ssrRenderComponent(_component_Text, {
          class: "order-form__label",
          size: "sm",
          design: "secondary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Название организации:`);
            } else {
              return [
                createTextVNode("Название организации:")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Input, {
          id: getFieldId("organization-name"),
          class: "order-form__input",
          type: "text",
          name: getFieldId("organization-name"),
          required: ""
        }, null, _parent));
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="order-form__name"${ssrRenderAttr("for", getFieldId("name"))}>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__label",
        size: "sm",
        design: "secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ваше имя:`);
          } else {
            return [
              createTextVNode("Ваше имя:")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Input, {
        id: getFieldId("name"),
        class: "order-form__input",
        type: "text",
        name: getFieldId("name"),
        required: ""
      }, null, _parent));
      _push(`</label><div class="order-form__top--wrap"><label class="order-form__phone"${ssrRenderAttr("for", getFieldId("phone"))}>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__label",
        size: "sm",
        design: "secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Телефон:`);
          } else {
            return [
              createTextVNode("Телефон:")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Input, {
        id: getFieldId("phone"),
        class: "order-form__input",
        name: getFieldId("phone"),
        type: "tel",
        required: "",
        inputmode: "tel",
        placeholder: "+7 (___) ___-__-__",
        title: "Формат: +7 (XXX) XXX-XX-XX"
      }, null, _parent));
      _push(`</label><label class="order-form__email"${ssrRenderAttr("for", getFieldId("email"))}>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__label",
        size: "sm",
        design: "secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`E-mail:`);
          } else {
            return [
              createTextVNode("E-mail:")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Input, {
        id: getFieldId("email"),
        class: "order-form__input",
        name: getFieldId("email"),
        type: "email",
        required: ""
      }, null, _parent));
      _push(`</label></div></div><div class="order-form__wrap"><div class="order-form__checkboxes"><label class="order-form__checkbox"${ssrRenderAttr("for", getFieldId("agreement"))}><input${ssrRenderAttr("id", getFieldId("agreement"))} type="checkbox"${ssrRenderAttr("name", getFieldId("agreement"))} checked required><div class="checkbox-custom">`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "checkbox-custom__icon",
        name: "check-arrow"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__checkbox--text",
        size: "xs",
        "line-height": "xs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Я согласен на обработку `);
            _push2(ssrRenderComponent(_component_Text, {
              class: "order-form__checkbox--link",
              size: "xs",
              tag: "a",
              href: "#",
              "line-height": "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`персональных данных`);
                } else {
                  return [
                    createTextVNode("персональных данных")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`. `);
          } else {
            return [
              createTextVNode(" Я согласен на обработку "),
              createVNode(_component_Text, {
                class: "order-form__checkbox--link",
                size: "xs",
                tag: "a",
                href: "#",
                "line-height": "xs"
              }, {
                default: withCtx(() => [
                  createTextVNode("персональных данных")
                ]),
                _: 1
              }),
              createTextVNode(". ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</label><label class="order-form__checkbox"${ssrRenderAttr("for", getFieldId("newsletter"))}><input${ssrRenderAttr("id", getFieldId("newsletter"))}${ssrRenderAttr("name", getFieldId("newsletter"))} type="checkbox" checked><div class="checkbox-custom">`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "checkbox-custom__icon",
        name: "check-arrow"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__checkbox--text",
        size: "xs",
        "line-height": "xs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Я согласен на получение `);
            _push2(ssrRenderComponent(_component_Text, {
              class: "order-form__checkbox--link",
              size: "xs",
              tag: "a",
              href: "#",
              "line-height": "xs"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`информации об акциях и мероприятиях`);
                } else {
                  return [
                    createTextVNode("информации об акциях и мероприятиях")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`. `);
          } else {
            return [
              createTextVNode(" Я согласен на получение "),
              createVNode(_component_Text, {
                class: "order-form__checkbox--link",
                size: "xs",
                tag: "a",
                href: "#",
                "line-height": "xs"
              }, {
                default: withCtx(() => [
                  createTextVNode("информации об акциях и мероприятиях")
                ]),
                _: 1
              }),
              createTextVNode(". ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</label></div><div class="order-form__bottom-wrap">`);
      _push(ssrRenderComponent(_component_Button, {
        class: "order-form__submit",
        type: "submit",
        text: "Отправить заявку",
        size: "xl"
      }, null, _parent));
      _push(`<span class="order-form__public-offer">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__public-offer--item",
        tag: "span",
        size: "xs",
        "line-height": "xs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Нажимая кнопку «Отправить», вы принимаете условия `);
          } else {
            return [
              createTextVNode("Нажимая кнопку «Отправить», вы принимаете условия ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "order-form__public-offer--link",
        tag: "a",
        href: "/piktube/public-offer",
        size: "xs",
        "line-height": "xs"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`публичной оферты.`);
          } else {
            return [
              createTextVNode("публичной оферты.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</span></div></div></form>`);
    };
  }
});
const _sfc_setup$2d = _sfc_main$2d.setup;
_sfc_main$2d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/forms/OrderForm.vue");
  return _sfc_setup$2d ? _sfc_setup$2d(props, ctx) : void 0;
};
const __nuxt_component_4$a = Object.assign(_sfc_main$2d, { __name: "OrderForm" });
const OrderForm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$a
}, Symbol.toStringTag, { value: "Module" }));
const description = "У вас возникли вопросы? Мы с удовольствием ответим! Просто закажите обратный звонок. И мы свяжемся с вами как можно скорее.";
const _sfc_main$2c = /* @__PURE__ */ defineComponent({
  __name: "ConsultationBlock",
  __ssrInlineRender: true,
  setup(__props) {
    const titleList = ["Если вам нужна", "консультация"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_CopyLinkComplex = __nuxt_component_3$e;
      const _component_order_form = __nuxt_component_4$a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "consultation-block",
        class: "consultation-block"
      }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "consultation-block__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="consultation-block__content"${_scopeId}><div class="consultation-block__content--top"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "consultation-block__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(titleList, (value, index2) => {
                    _push3(`<!--[-->${ssrInterpolate(value)} `);
                    if (index2 < titleList.length - 1) {
                      _push3(`<br${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(), createBlock(Fragment, null, renderList(titleList, (value, index2) => {
                      return openBlock(), createBlock(Fragment, { key: index2 }, [
                        createTextVNode(toDisplayString(value) + " ", 1),
                        index2 < titleList.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                      ], 64);
                    }), 64))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Text, { class: "consultation-block__description" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(description)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(description))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="consultation-block__actions"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CopyLinkComplex, {
              class: "consultation-block__action",
              label: "Телефон:",
              "copy-link": {
                text: "8 (800) 250-9288",
                href: "tel:+78002509288"
              }
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CopyLinkComplex, {
              class: "consultation-block__action",
              label: "E-mail:",
              "copy-link": {
                text: "zakaz@piktube.ru",
                href: "mailto:zakaz@piktube.ru"
              }
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="consultation-block__form-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_order_form, { class: "consultation-block__form" }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "consultation-block__content" }, [
                createVNode("div", { class: "consultation-block__content--top" }, [
                  createVNode(_component_CustomTitle, { class: "consultation-block__title" }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(Fragment, null, renderList(titleList, (value, index2) => {
                        return openBlock(), createBlock(Fragment, { key: index2 }, [
                          createTextVNode(toDisplayString(value) + " ", 1),
                          index2 < titleList.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 64))
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Text, { class: "consultation-block__description" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(description))
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "consultation-block__actions" }, [
                  createVNode(_component_CopyLinkComplex, {
                    class: "consultation-block__action",
                    label: "Телефон:",
                    "copy-link": {
                      text: "8 (800) 250-9288",
                      href: "tel:+78002509288"
                    }
                  }),
                  createVNode(_component_CopyLinkComplex, {
                    class: "consultation-block__action",
                    label: "E-mail:",
                    "copy-link": {
                      text: "zakaz@piktube.ru",
                      href: "mailto:zakaz@piktube.ru"
                    }
                  })
                ])
              ]),
              createVNode("div", { class: "consultation-block__form-wrap" }, [
                createVNode(_component_order_form, { class: "consultation-block__form" })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2c = _sfc_main$2c.setup;
_sfc_main$2c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ConsultationBlock.vue");
  return _sfc_setup$2c ? _sfc_setup$2c(props, ctx) : void 0;
};
const __nuxt_component_5$7 = Object.assign(_sfc_main$2c, { __name: "ConsultationBlock" });
const ConsultationBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2b = {};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs) {
  const _component_CustomTitle = __nuxt_component_0$j;
  const _component_Text = __nuxt_component_4$b;
  const _component_Button = __nuxt_component_1$p;
  const _component_ConsultationBlock = __nuxt_component_5$7;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><div class="error-page"><div class="error-page__wrap"><div class="error-page__content">`);
  _push(ssrRenderComponent(_component_CustomTitle, {
    class: "error-page__title",
    tag: "h1"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`404`);
      } else {
        return [
          createTextVNode("404")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="error-page__inner">`);
  _push(ssrRenderComponent(_component_Text, {
    class: "error-page__inner--title",
    "line-height": "lg",
    weight: "medium",
    "letter-spacing": "sm"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Страница не найдена`);
      } else {
        return [
          createTextVNode("Страница не найдена")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_Text, {
    class: "error-page__inner--description",
    size: "xl",
    "line-height": "md"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Вернитесь на главную страницу или проверьте правильность написания адреса.`);
      } else {
        return [
          createTextVNode("Вернитесь на главную страницу или проверьте правильность написания адреса.")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_Button, {
    class: "error-page__button",
    text: "На главную",
    href: "/piktube"
  }, null, _parent));
  _push(`</div></div>`);
  _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
  _push(`</div></main>`);
}
const _sfc_setup$2b = _sfc_main$2b.setup;
_sfc_main$2b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/404.vue");
  return _sfc_setup$2b ? _sfc_setup$2b(props, ctx) : void 0;
};
const _404 = /* @__PURE__ */ _export_sfc(_sfc_main$2b, [["ssrRender", _sfc_ssrRender$d]]);
const _404$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _404
}, Symbol.toStringTag, { value: "Module" }));
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_0$h = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _sfc_main$2a = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_Text = __nuxt_component_4$b;
      const _component_NuxtLink = __nuxt_component_0$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "breadcrumbs" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "breadcrumbs__container",
        position: "bottom",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(props.list, (item, index2) => {
              _push2(`<!--[-->`);
              _push2(ssrRenderComponent(_component_Text, {
                class: "breadcrumbs__item",
                tag: "span",
                "line-height": "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      class: "breadcrumbs__link",
                      to: item.href
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_NuxtLink, {
                        class: "breadcrumbs__link",
                        to: item.href
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (index2 < props.list.length - 1) {
                _push2(`<div class="breadcrumbs__divider"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                return openBlock(), createBlock(Fragment, { key: index2 }, [
                  createVNode(_component_Text, {
                    class: "breadcrumbs__item",
                    tag: "span",
                    "line-height": "sm"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, {
                        class: "breadcrumbs__link",
                        to: item.href
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ]),
                    _: 2
                  }, 1024),
                  index2 < props.list.length - 1 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "breadcrumbs__divider"
                  })) : createCommentVNode("", true)
                ], 64);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2a = _sfc_main$2a.setup;
_sfc_main$2a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Breadcrumbs.vue");
  return _sfc_setup$2a ? _sfc_setup$2a(props, ctx) : void 0;
};
const __nuxt_component_0$g = Object.assign(_sfc_main$2a, { __name: "Breadcrumbs" });
const Breadcrumbs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$29 = /* @__PURE__ */ defineComponent({
  __name: "BaseSwiper",
  __ssrInlineRender: true,
  props: {
    class: { default: "" },
    modules: { default: () => [Navigation, Pagination, Autoplay, EffectFade] },
    slidesPerView: { default: 1 },
    spaceBetween: { default: 20 },
    navigation: { type: Boolean, default: true },
    pagination: { type: Boolean, default: false },
    showNavigationWithPagination: { type: Boolean, default: false },
    autoplay: { type: Boolean, default: false },
    loop: { type: Boolean, default: false },
    breakpoints: { default: () => ({}) },
    effect: { default: void 0 },
    fadeEffect: { default: void 0 },
    allowTouchMove: { type: Boolean, default: true },
    modificator: { default: void 0 },
    noSwiping: { type: Boolean, default: true },
    noSwipingClass: { default: "swiper-no-swiping" },
    autoHeight: { type: Boolean, default: false },
    observer: { type: Boolean, default: false },
    observeParents: { type: Boolean, default: false },
    navigationMode: { default: "default" },
    controlsMode: { default: void 0 },
    isButtonsReverse: { type: Boolean, default: false },
    speed: { default: 400 }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["base-swiper"];
      if (props.isButtonsReverse) {
        base.push("base-swiper_btn-reverse");
      }
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      return base;
    });
    const computedPagination = computed(() => {
      if (props.controlsMode === "bottom") {
        return {
          el: `.swiper__pagination_${props.modificator}`,
          clickable: true,
          renderBullet: (index2, className) => `<span class="${className}"></span>`
        };
      }
      if (!props.pagination) return false;
      if (typeof props.pagination === "object") {
        return {
          ...props.pagination
        };
      }
      return {
        el: `.swiper__pagination`,
        clickable: true,
        renderBullet: (index2, className) => `<span class="${className}">${index2 + 1}</span>`
      };
    });
    const navigationConfig = computed(() => {
      if (!props.navigation) return false;
      if (typeof props.navigation === "object") {
        return props.navigation;
      }
      return {
        nextEl: `.swiper__button_next_${props.modificator}`,
        prevEl: `.swiper__button_prev_${props.modificator}`
      };
    });
    const showNavigation = computed(() => {
      if (props.navigation && !computedPagination.value) return true;
      if (props.navigation && props.showNavigationWithPagination) return true;
      if (props.navigation && typeof props.pagination === "object" && props.pagination.type === "fraction")
        return true;
      return false;
    });
    const showPaginationControls = computed(() => {
      if (props.controlsMode === "bottom") {
        return true;
      }
      return computedPagination.value && props.showNavigationWithPagination;
    });
    const iconName = computed(() => {
      return props.isButtonsReverse ? "button-arrow-reverse" : "button-arrow";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(classes) }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modules: props.modules,
        "slides-per-view": props.slidesPerView,
        "space-between": props.spaceBetween,
        "allow-touch-move": props.allowTouchMove,
        navigation: unref(navigationConfig),
        pagination: unref(computedPagination),
        autoplay: props.autoplay,
        loop: props.loop,
        breakpoints: props.breakpoints,
        effect: props.effect,
        "fade-effect": props.fadeEffect,
        "no-swiping": props.noSwiping,
        "no-swiping-class": props.noSwipingClass,
        "auto-height": props.autoHeight,
        observer: props.observer,
        observeParents: props.observeParents,
        speed: props.speed
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "after-swiper", {}, null, _push, _parent);
      if (props.controlsMode === "bottom") {
        _push(`<div class="${ssrRenderClass([
          "swiper__controls",
          {
            swiper__controls_bottom: props.controlsMode === "bottom"
          }
        ])}">`);
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`,
          icon: { name: unref(iconName), mode: "prev" }
        }, null, _parent));
        _push(`<div class="${ssrRenderClass(`swiper__pagination swiper__pagination_${props.modificator}`)}"></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_next swiper__button_next_${props.modificator}`,
          icon: { name: unref(iconName), mode: "next" }
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(showPaginationControls)) {
        _push(`<div class="${ssrRenderClass([
          "swiper__controls",
          {
            swiper__controls_bottom: props.controlsMode === "bottom"
          }
        ])}">`);
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`,
          icon: { name: unref(iconName), mode: "prev" }
        }, null, _parent));
        _push(`<div class="${ssrRenderClass(`swiper__pagination swiper__pagination_${props.modificator}`)}"></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_next swiper__button_next_${props.modificator}`,
          icon: { name: unref(iconName), mode: "next" }
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(showNavigation)) {
        _push(`<div class="${ssrRenderClass([
          `swiper__navigation swiper__navigation_${props.modificator}`,
          {
            swiper__navigation_centered: props.navigationMode === "centered"
          }
        ])}">`);
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_prev swiper__button_prev_${props.modificator}`,
          icon: { name: unref(iconName), mode: "prev" }
        }, null, _parent));
        _push(ssrRenderComponent(_component_Button, {
          class: `swiper__button swiper__button_next swiper__button_next_${props.modificator}`,
          icon: { name: unref(iconName), mode: "next" }
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$29 = _sfc_main$29.setup;
_sfc_main$29.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/BaseSwiper.vue");
  return _sfc_setup$29 ? _sfc_setup$29(props, ctx) : void 0;
};
const __nuxt_component_0$f = Object.assign(_sfc_main$29, { __name: "BaseSwiper" });
const BaseSwiper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$28 = /* @__PURE__ */ defineComponent({
  __name: "Video",
  __ssrInlineRender: true,
  props: {
    src: {},
    poster: {},
    class: {},
    autoplay: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    loop: { type: Boolean, default: false },
    controls: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const containerEl = ref(null);
    ref(null);
    const isIntersected = ref(false);
    const isPlaying = ref(false);
    const classes = computed(() => {
      if (props.class) {
        return Array.isArray(props.class) ? props.class : [props.class];
      }
      return void 0;
    });
    const sources = computed(() => {
      if (Array.isArray(props.src)) return props.src;
      const ext = props.src.split(".").pop() || "mp4";
      const type = ext === "webm" ? "video/webm" : ext === "ogv" ? "video/ogg" : "video/mp4";
      return [{ src: props.src, type }];
    });
    const showControls = computed(() => {
      return props.controls && isPlaying.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["base-video", classes.value],
        ref_key: "containerEl",
        ref: containerEl
      }, _attrs))}><video class="base-video__media"${ssrIncludeBooleanAttr(props.muted) ? " muted" : ""}${ssrIncludeBooleanAttr(props.loop) ? " loop" : ""}${ssrIncludeBooleanAttr(showControls.value) ? " controls" : ""} playsinline preload="none"${ssrRenderAttr("poster", props.poster)}>`);
      if (isIntersected.value) {
        _push(`<!--[-->`);
        ssrRenderList(sources.value, (s, i) => {
          _push(`<source${ssrRenderAttr("src", s.src)}${ssrRenderAttr("type", s.type)}>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</video>`);
      if (!isPlaying.value) {
        _push(`<button class="base-video__play" type="button" aria-label="Play video">`);
        _push(ssrRenderComponent(_component_Text, {
          class: "base-video__play--title",
          tag: "span",
          size: "sm",
          design: "secondary",
          "line-height": "xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Смотреть видео`);
            } else {
              return [
                createTextVNode("Смотреть видео")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Icon, {
          class: "base-video__play--icon",
          name: "base-arrow"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$28 = _sfc_main$28.setup;
_sfc_main$28.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Video.vue");
  return _sfc_setup$28 ? _sfc_setup$28(props, ctx) : void 0;
};
const __nuxt_component_4$9 = Object.assign(_sfc_main$28, { __name: "Video" });
const Video = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$27 = /* @__PURE__ */ defineComponent({
  __name: "Image",
  __ssrInlineRender: true,
  props: {
    src: {},
    alt: {},
    class: {},
    width: {},
    height: {}
  },
  setup(__props) {
    const props = __props;
    const baseUrl = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const isExternalSrc = computed(() => {
      return /^https?:\/\//.test(props.src) || props.src.startsWith("/");
    });
    const resolvedSrc = computed(() => {
      if (isExternalSrc.value) return props.src;
      return `${baseUrl}images/${props.src}.webp`;
    });
    const resolvedSrcSet = computed(() => {
      if (isExternalSrc.value) return void 0;
      return `${baseUrl}images/${props.src}@2x.webp 2x`;
    });
    const classes = computed(() => {
      if (props.class) {
        return Array.isArray(props.class) ? props.class : [props.class];
      }
      return void 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<img${ssrRenderAttrs(mergeProps({
        class: classes.value,
        src: resolvedSrc.value,
        alt: props.alt,
        srcset: resolvedSrcSet.value,
        width: props.width,
        height: props.height
      }, _attrs))}>`);
    };
  }
});
const _sfc_setup$27 = _sfc_main$27.setup;
_sfc_main$27.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Image.vue");
  return _sfc_setup$27 ? _sfc_setup$27(props, ctx) : void 0;
};
const __nuxt_component_1$n = Object.assign(_sfc_main$27, { __name: "Image" });
const Image = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$26 = /* @__PURE__ */ defineComponent({
  __name: "HeroVideo",
  __ssrInlineRender: true,
  props: {
    slides: {}
  },
  setup(__props) {
    const props = __props;
    const fallbackSlides = [
      {
        type: "video",
        videoSrc: [
          { src: "/piktube/videos/production.webm", type: "video/webm" },
          { src: "/piktube/videos/production.mp4", type: "video/mp4" }
        ],
        poster: "/piktube/images/production-facilities-poster.webp"
      },
      {
        type: "image",
        src: "main/hero"
      }
    ];
    const slides = computed(
      () => props.slides && props.slides.length > 0 ? props.slides : fallbackSlides
    );
    const isSlider = computed(() => slides.value.length > 1);
    const firstSlide = computed(() => slides.value[0]);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_Video = __nuxt_component_4$9;
      const _component_Image = __nuxt_component_1$n;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-video" }, _attrs))}><div class="container"><div class="hero-video__container"><div class="hero-video__video">`);
      if (isSlider.value) {
        _push(ssrRenderComponent(_component_BaseSwiper, {
          class: "hero-video__swiper",
          "slides-per-view": 1,
          navigation: true,
          modificator: "hero-video",
          "navigation-mode": "centered",
          loop: true,
          effect: "fade",
          "fade-effect": { crossFade: true },
          "is-buttons-reverse": true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(slides.value, (slide, index2) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: index2,
                  class: "hero-video__slide"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="hero-video__slide-content"${_scopeId2}>`);
                      if (slide.type === "video" && slide.videoSrc) {
                        _push3(ssrRenderComponent(_component_Video, {
                          class: "hero-video__video--item",
                          src: slide.videoSrc,
                          poster: slide.poster,
                          controls: true
                        }, null, _parent3, _scopeId2));
                      } else if (slide.src) {
                        _push3(`<div class="hero-video__video--item"${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_Image, {
                          class: "hero-video__video--image",
                          src: slide.src,
                          alt: slide.alt || ""
                        }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "hero-video__slide-content" }, [
                          slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                            key: 0,
                            class: "hero-video__video--item",
                            src: slide.videoSrc,
                            poster: slide.poster,
                            controls: true
                          }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "hero-video__video--item"
                          }, [
                            createVNode(_component_Image, {
                              class: "hero-video__video--image",
                              src: slide.src,
                              alt: slide.alt || ""
                            }, null, 8, ["src", "alt"])
                          ])) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(slides.value, (slide, index2) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: index2,
                    class: "hero-video__slide"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "hero-video__slide-content" }, [
                        slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                          key: 0,
                          class: "hero-video__video--item",
                          src: slide.videoSrc,
                          poster: slide.poster,
                          controls: true
                        }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "hero-video__video--item"
                        }, [
                          createVNode(_component_Image, {
                            class: "hero-video__video--image",
                            src: slide.src,
                            alt: slide.alt || ""
                          }, null, 8, ["src", "alt"])
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (firstSlide.value) {
        _push(`<div class="hero-video__single">`);
        if (firstSlide.value.type === "video" && firstSlide.value.videoSrc) {
          _push(ssrRenderComponent(_component_Video, {
            class: "hero-video__video--item",
            src: firstSlide.value.videoSrc,
            poster: firstSlide.value.poster,
            controls: true
          }, null, _parent));
        } else if (firstSlide.value.src) {
          _push(`<div class="hero-video__video--item">`);
          _push(ssrRenderComponent(_component_Image, {
            class: "hero-video__video--image",
            src: firstSlide.value.src,
            alt: firstSlide.value.alt || ""
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup$26 = _sfc_main$26.setup;
_sfc_main$26.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroVideo.vue");
  return _sfc_setup$26 ? _sfc_setup$26(props, ctx) : void 0;
};
const __nuxt_component_4$8 = Object.assign(_sfc_main$26, { __name: "HeroVideo" });
const HeroVideo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$25 = /* @__PURE__ */ defineComponent({
  __name: "LabCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    button: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lab-card" }, _attrs))}><div class="lab-card__top">`);
      _push(ssrRenderComponent(_component_Icon, mergeProps({ class: "lab-card__top--icon" }, props.icon), null, _parent));
      _push(`<span class="lab-card__top--desc">${ssrInterpolate(props.title)}</span></div>`);
      _push(ssrRenderComponent(_component_Button, mergeProps({ class: "lab-card__btn" }, props.button), null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$25 = _sfc_main$25.setup;
_sfc_main$25.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/LabCard.vue");
  return _sfc_setup$25 ? _sfc_setup$25(props, ctx) : void 0;
};
const __nuxt_component_1$m = Object.assign(_sfc_main$25, { __name: "LabCard" });
const LabCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$24 = /* @__PURE__ */ defineComponent({
  __name: "LabBlock",
  __ssrInlineRender: true,
  props: {
    isLinks: { type: Boolean },
    isBtn: { type: Boolean },
    titleTag: { default: "h2" },
    title: { default: "Лаборатория" },
    cardTitle: { default: "Испытательная лаборатория ООО «ПИК» — это современный аккредитованный испытательный центр." },
    descList: { default: () => [
      "Мы специализируемся на испытаниях полимерных и стальных труб и их фитингов с различными видами изоляции для водоснабжения, газоснабжения, канализации и промышленных нужд. В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов.",
      "Команда испытательной лаборатории ООО «ПИК» нацелена на поддержание уровня компетенций и гарантирует соблюдение всех норм и стандартов качества в каждом проведённом исследовании.",
      "Номер записи в реестре аккредитованных лиц&nbsp;RA.RU.21РН88"
    ] },
    emails: { default: () => ["info@piktube.ru", "lab@piktube.ru"] },
    phones: { default: () => ["+7 (800) 25-09-288"] },
    topButton: { default: () => ({ text: "Смотреть аккредитацию", size: "sm", href: "#" }) },
    bottomButton: { default: () => ({
      text: "Подробнее о компании",
      size: "lg",
      href: "/piktube/about"
    }) }
  },
  setup(__props) {
    const props = __props;
    const normalizeNbsp = (s) => s.replaceAll("&nbsp;", " ");
    const splitByBr = (s) => normalizeNbsp(s).split(/<\/?br\s*\/?>/i);
    const descLines = computed(() => props.descList.map((t) => splitByBr(t)));
    const emailLinks = computed(() => props.emails.filter(Boolean));
    const phoneLinks = computed(() => props.phones.filter(Boolean));
    const normalizePhone = (value) => value.replace(/[^\d+]/g, "");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_LabCard = __nuxt_component_1$m;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "lab-block" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "lab-block__wrap",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="lab-block__title-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "lab-block__title",
              tag: props.titleTag
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(props.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(props.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="lab-block__card"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_LabCard, {
              icon: { name: "document", isSprite: false },
              button: props.topButton,
              title: props.cardTitle
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="lab-block__desc"${_scopeId}><!--[-->`);
            ssrRenderList(unref(descLines), (lines, index2) => {
              _push2(ssrRenderComponent(_component_Text, { class: "lab-block__desc--item" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(lines, (line, i) => {
                      _push3(`<!--[--><span${_scopeId2}>${ssrInterpolate(line)}</span>`);
                      if (i < lines.length - 1) {
                        _push3(`<br${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<!--]-->`);
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: `d-${index2}-${i}`
                        }, [
                          createVNode("span", null, toDisplayString(line), 1),
                          i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (props.isLinks) {
              _push2(`<div class="lab-block__links"${_scopeId}><!--[-->`);
              ssrRenderList(unref(emailLinks), (email, index2) => {
                _push2(`<a class="lab-block__link"${ssrRenderAttr("href", `mailto:${email}`)}${_scopeId}>${ssrInterpolate(email)}</a>`);
              });
              _push2(`<!--]--><!--[-->`);
              ssrRenderList(unref(phoneLinks), (phone, index2) => {
                _push2(`<a class="lab-block__link"${ssrRenderAttr("href", `tel:${normalizePhone(phone)}`)}${_scopeId}>${ssrInterpolate(phone)}</a>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="lab-block__btn"${_scopeId}>`);
            if (props.isBtn) {
              _push2(ssrRenderComponent(_component_Button, mergeProps({ class: "lab-block__btn--item" }, props.bottomButton), null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "lab-block__title-wrap" }, [
                createVNode(_component_CustomTitle, {
                  class: "lab-block__title",
                  tag: props.titleTag
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(props.title), 1)
                  ]),
                  _: 1
                }, 8, ["tag"])
              ]),
              createVNode("div", { class: "lab-block__card" }, [
                createVNode(_component_LabCard, {
                  icon: { name: "document", isSprite: false },
                  button: props.topButton,
                  title: props.cardTitle
                }, null, 8, ["button", "title"])
              ]),
              createVNode("div", { class: "lab-block__desc" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(descLines), (lines, index2) => {
                  return openBlock(), createBlock(_component_Text, {
                    key: index2,
                    class: "lab-block__desc--item"
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: `d-${index2}-${i}`
                        }, [
                          createVNode("span", null, toDisplayString(line), 1),
                          i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              props.isLinks ? (openBlock(), createBlock("div", {
                key: 0,
                class: "lab-block__links"
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(emailLinks), (email, index2) => {
                  return openBlock(), createBlock("a", {
                    key: `e-${index2}`,
                    class: "lab-block__link",
                    href: `mailto:${email}`
                  }, toDisplayString(email), 9, ["href"]);
                }), 128)),
                (openBlock(true), createBlock(Fragment, null, renderList(unref(phoneLinks), (phone, index2) => {
                  return openBlock(), createBlock("a", {
                    key: `p-${index2}`,
                    class: "lab-block__link",
                    href: `tel:${normalizePhone(phone)}`
                  }, toDisplayString(phone), 9, ["href"]);
                }), 128))
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "lab-block__btn" }, [
                props.isBtn ? (openBlock(), createBlock(_component_Button, mergeProps({
                  key: 0,
                  class: "lab-block__btn--item"
                }, props.bottomButton), null, 16)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$24 = _sfc_main$24.setup;
_sfc_main$24.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/LabBlock.vue");
  return _sfc_setup$24 ? _sfc_setup$24(props, ctx) : void 0;
};
const __nuxt_component_7$2 = Object.assign(_sfc_main$24, { __name: "LabBlock" });
const LabBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_7$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$23 = /* @__PURE__ */ defineComponent({
  __name: "SectionWrapper",
  __ssrInlineRender: true,
  props: {
    title: {},
    tag: { default: "h2" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "section-wrapper" }, _attrs))}><div class="section-wrapper__top"><div class="section-wrapper__top--figure"></div>`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "section-wrapper__title",
        mode: "xs",
        tag: props.tag
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup$23 = _sfc_main$23.setup;
_sfc_main$23.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/SectionWrapper.vue");
  return _sfc_setup$23 ? _sfc_setup$23(props, ctx) : void 0;
};
const __nuxt_component_1$l = Object.assign(_sfc_main$23, { __name: "SectionWrapper" });
const SectionWrapper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$22 = /* @__PURE__ */ defineComponent({
  __name: "EquipmentNewCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    image: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "equipment-new-card" }, _attrs))}><div class="equipment-new-card__img">`);
      _push(ssrRenderComponent(_component_Image, {
        class: "equipment-new-card__img--item",
        src: _ctx.image.src,
        alt: _ctx.image.alt
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "equipment-new-card__title",
        weight: "medium",
        size: "xxl",
        "line-height": "sm",
        "letter-spacing": "sm",
        design: "primary",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$22 = _sfc_main$22.setup;
_sfc_main$22.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/EquipmentNewCard.vue");
  return _sfc_setup$22 ? _sfc_setup$22(props, ctx) : void 0;
};
const __nuxt_component_2$m = Object.assign(_sfc_main$22, { __name: "EquipmentNewCard" });
const EquipmentNewCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$21 = /* @__PURE__ */ defineComponent({
  __name: "LEquipment",
  __ssrInlineRender: true,
  props: {
    title: { default: "Парк оборудования" },
    list: { default: () => [
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-1", alt: "Оборудование" }
      },
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-2", alt: "Оборудование" }
      },
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-3", alt: "Оборудование" }
      },
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-2", alt: "Оборудование" }
      },
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-3", alt: "Оборудование" }
      },
      {
        title: "Оборудование",
        image: { src: "equipment/equipment-1", alt: "Оборудование" }
      }
    ] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_EquipmentNewCard = __nuxt_component_2$m;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "l-equipment-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "l-equipment",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_wrapper, {
              title: props.title
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="l-equipment__list"${_scopeId2}><!--[-->`);
                  ssrRenderList(props.list, (item, index2) => {
                    _push3(ssrRenderComponent(_component_EquipmentNewCard, mergeProps({
                      key: index2,
                      class: "l-equipment__item"
                    }, { ref_for: true }, item), null, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "l-equipment__list" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                        return openBlock(), createBlock(_component_EquipmentNewCard, mergeProps({
                          key: index2,
                          class: "l-equipment__item"
                        }, { ref_for: true }, item), null, 16);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_wrapper, {
                title: props.title
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "l-equipment__list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                      return openBlock(), createBlock(_component_EquipmentNewCard, mergeProps({
                        key: index2,
                        class: "l-equipment__item"
                      }, { ref_for: true }, item), null, 16);
                    }), 128))
                  ])
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$21 = _sfc_main$21.setup;
_sfc_main$21.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/lab/LEquipment.vue");
  return _sfc_setup$21 ? _sfc_setup$21(props, ctx) : void 0;
};
const __nuxt_component_3$d = Object.assign(_sfc_main$21, { __name: "LEquipment" });
const LEquipment = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$20 = /* @__PURE__ */ defineComponent({
  __name: "TestCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    image: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "test-card" }, _attrs))}><div class="test-card__img">`);
      if (_ctx.image) {
        _push(ssrRenderComponent(_component_Image, mergeProps({ class: "test-card__img--item" }, _ctx.image), null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "test-card__title",
        size: "sm",
        design: "tertiary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$20 = _sfc_main$20.setup;
_sfc_main$20.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/TestCard.vue");
  return _sfc_setup$20 ? _sfc_setup$20(props, ctx) : void 0;
};
const __nuxt_component_3$c = Object.assign(_sfc_main$20, { __name: "TestCard" });
const TestCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1$ = /* @__PURE__ */ defineComponent({
  __name: "LTests",
  __ssrInlineRender: true,
  props: {
    title: { default: "Объекты испытаний" },
    list: { default: () => [
      { title: "Трубы стальные, стальные в тепло- и гидроизоляции." },
      { title: "Трубы и фитинги пластиковые из полиэтилена низкого давления" },
      { title: "Трубы для водо-, газоснабжения, защиты кабельных сетей." },
      {
        title: "Трубы пластиковые из полипропилена, гофрированные для канализационных сетей."
      },
      { title: "Трубы стальные, стальные в тепло- и гидроизоляции." },
      { title: "Трубы и фитинги пластиковые из полиэтилена низкого давления" },
      { title: "Трубы для водо-, газоснабжения, защиты кабельных сетей." },
      {
        title: "Трубы пластиковые из полипропилена, гофрированные для канализационных сетей."
      }
    ] }
  },
  setup(__props) {
    const props = __props;
    const breakpoints = {
      0: { slidesPerView: 1 },
      600: { slidesPerView: 2 },
      1024: { slidesPerView: 4 }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_TestCard = __nuxt_component_3$c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "l-tests-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "l-tests",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_wrapper, {
              title: props.title
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_BaseSwiper, {
                    class: "l-tests__slider",
                    modificator: "l-tests",
                    breakpoints,
                    "space-between": 20,
                    navigation: true,
                    loop: true
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<!--[-->`);
                        ssrRenderList(props.list, (item, index2) => {
                          _push4(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_TestCard, mergeProps({ ref_for: true }, item), null, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_TestCard, mergeProps({ ref_for: true }, item), null, 16)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        });
                        _push4(`<!--]-->`);
                      } else {
                        return [
                          (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                            return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                              default: withCtx(() => [
                                createVNode(_component_TestCard, mergeProps({ ref_for: true }, item), null, 16)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_BaseSwiper, {
                      class: "l-tests__slider",
                      modificator: "l-tests",
                      breakpoints,
                      "space-between": 20,
                      navigation: true,
                      loop: true
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                          return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                            default: withCtx(() => [
                              createVNode(_component_TestCard, mergeProps({ ref_for: true }, item), null, 16)
                            ]),
                            _: 2
                          }, 1024);
                        }), 128))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_wrapper, {
                title: props.title
              }, {
                default: withCtx(() => [
                  createVNode(_component_BaseSwiper, {
                    class: "l-tests__slider",
                    modificator: "l-tests",
                    breakpoints,
                    "space-between": 20,
                    navigation: true,
                    loop: true
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(props.list, (item, index2) => {
                        return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                          default: withCtx(() => [
                            createVNode(_component_TestCard, mergeProps({ ref_for: true }, item), null, 16)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1$ = _sfc_main$1$.setup;
_sfc_main$1$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/lab/LTests.vue");
  return _sfc_setup$1$ ? _sfc_setup$1$(props, ctx) : void 0;
};
const __nuxt_component_4$7 = Object.assign(_sfc_main$1$, { __name: "LTests" });
const LTests = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1_ = /* @__PURE__ */ defineComponent({
  __name: "LabTable",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const props = __props;
    const fallbackList = [
      {
        number: "1",
        content: {
          title: "Внешний вид.",
          desc: "Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания."
        },
        tests: {
          title: "—"
        },
        price: "2160"
      },
      {
        number: "2",
        content: {
          title: "Относительное удлинение при разрыве е ≤ 12 мм; е > 12 мм.",
          desc: "Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания."
        },
        tests: {
          title: "ГОСТ 11262-2017",
          href: "https://meganorm.ru/Data2/1/4293739/4293739599.pdf"
        },
        price: "14160 — 19080"
      },
      {
        number: "3",
        content: {
          title: "Предел текучести при растяжении.",
          desc: "Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания."
        },
        tests: {
          title: "ГОСТ Р 53652.1",
          href: "https://meganorm.ru/Data2/1/4293820/4293820577.pdf"
        },
        price: "9120"
      },
      {
        number: "4",
        content: {
          title: "Стойкость при постоянном внутреннем давлении при 20℃, 100ч. Диаметры: Ø 63, Ø 90, Ø 250, Ø 710.",
          desc: "Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания. Описание проводимого испытания."
        },
        tests: {
          title: "ГОСТ ISO 1167",
          href: "https://meganorm.ru/Data2/1/4293772/4293772450.pdf"
        },
        price: "41300"
      }
    ];
    const list = computed(
      () => props.list && props.list.length > 0 ? props.list : fallbackList
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lab-table" }, _attrs))}><div class="lab-table__top"><span class="lab-table__top--item lab-table__top--item_number"> № </span><span class="lab-table__top--item lab-table__top--item_name"> Наименование показателя </span><span class="lab-table__top--item lab-table__top--item_tests"> Методика испытания </span><span class="lab-table__top--item lab-table__top--item_price"> Цена </span></div><div class="lab-table__list"><!--[-->`);
      ssrRenderList(unref(list), (item) => {
        _push(`<div class="lab-table__item"><div class="lab-table__item--number">${ssrInterpolate(item.number)}</div><div class="lab-table__item--content"><span class="lab-table__item--content_title">${ssrInterpolate(item.content.title)}</span>`);
        _push(ssrRenderComponent(_component_Text, {
          class: "lab-table__item--content_desc",
          size: "xs",
          "line-height": "md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.content.desc)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.content.desc), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><a class="${ssrRenderClass([{ "lab-table__item--tests_empty": item.tests.title === "—" }, "lab-table__item--tests"])}"${ssrRenderAttr("href", item.tests.href)}${ssrRenderAttr("target", item.tests.href ? "_blank" : void 0)}${ssrRenderAttr("rel", item.tests.href ? "noopener noreferrer" : void 0)}>${ssrInterpolate(item.tests.title)}</a><div class="lab-table__item--price">${ssrInterpolate(item.price)}</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1_ = _sfc_main$1_.setup;
_sfc_main$1_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LabTable.vue");
  return _sfc_setup$1_ ? _sfc_setup$1_(props, ctx) : void 0;
};
const __nuxt_component_2$l = Object.assign(_sfc_main$1_, { __name: "LabTable" });
const LabTable = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1Z = /* @__PURE__ */ defineComponent({
  __name: "LPrices",
  __ssrInlineRender: true,
  props: {
    title: {},
    list: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_lab_table = __nuxt_component_2$l;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "l-prices-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "l-prices",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_wrapper, {
              title: props.title || "Виды и цены проводимых испытаний"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="l-prices__table"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_lab_table, {
                    list: props.list
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "l-prices__table" }, [
                      createVNode(_component_lab_table, {
                        list: props.list
                      }, null, 8, ["list"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_wrapper, {
                title: props.title || "Виды и цены проводимых испытаний"
              }, {
                default: withCtx(() => [
                  createVNode("div", { class: "l-prices__table" }, [
                    createVNode(_component_lab_table, {
                      list: props.list
                    }, null, 8, ["list"])
                  ])
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1Z = _sfc_main$1Z.setup;
_sfc_main$1Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/lab/LPrices.vue");
  return _sfc_setup$1Z ? _sfc_setup$1Z(props, ctx) : void 0;
};
const __nuxt_component_5$6 = Object.assign(_sfc_main$1Z, { __name: "LPrices" });
const LPrices = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1Y = /* @__PURE__ */ defineComponent({
  __name: "LSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    list: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "l-section-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "l-section",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_wrapper, { title: _ctx.title }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="l-section__list"${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.list, (item, index2) => {
                    _push3(`<div class="l-section__item"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Text, {
                      class: "l-section__item--title",
                      weight: "medium",
                      "line-height": "xs",
                      design: "primary",
                      uppercase: true
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Text, {
                      class: "l-section__item--desc",
                      size: "xl"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.desc)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.desc), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "l-section__list" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.list, (item, index2) => {
                        return openBlock(), createBlock("div", {
                          key: index2,
                          class: "l-section__item"
                        }, [
                          createVNode(_component_Text, {
                            class: "l-section__item--title",
                            weight: "medium",
                            "line-height": "xs",
                            design: "primary",
                            uppercase: true
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.title), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_Text, {
                            class: "l-section__item--desc",
                            size: "xl"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.desc), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_wrapper, { title: _ctx.title }, {
                default: withCtx(() => [
                  createVNode("div", { class: "l-section__list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.list, (item, index2) => {
                      return openBlock(), createBlock("div", {
                        key: index2,
                        class: "l-section__item"
                      }, [
                        createVNode(_component_Text, {
                          class: "l-section__item--title",
                          weight: "medium",
                          "line-height": "xs",
                          design: "primary",
                          uppercase: true
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.title), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_Text, {
                          class: "l-section__item--desc",
                          size: "xl"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.desc), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]);
                    }), 128))
                  ])
                ]),
                _: 1
              }, 8, ["title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1Y = _sfc_main$1Y.setup;
_sfc_main$1Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/lab/LSection.vue");
  return _sfc_setup$1Y ? _sfc_setup$1Y(props, ctx) : void 0;
};
const __nuxt_component_6$3 = Object.assign(_sfc_main$1Y, { __name: "LSection" });
const LSection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_6$3
}, Symbol.toStringTag, { value: "Module" }));
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_1$k = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const _sfc_main$1X = /* @__PURE__ */ defineComponent({
  __name: "lab",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Лаборатория", href: "/lab" }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: labBannerData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labBanner",
      () => $fetch(`${config.app.baseURL}api/labBanner`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: labInfoData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labInfoAfterBanner",
      () => $fetch(`${config.app.baseURL}api/labInfoAfterBanner`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: labParkData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labPark",
      () => $fetch(`${config.app.baseURL}api/labPark`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: labObjectsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labObjects",
      () => $fetch(`${config.app.baseURL}api/labObjects`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: labPricesData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labPrices",
      () => $fetch(`${config.app.baseURL}api/labPrices`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: labBottomData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "labBottom",
      () => $fetch(`${config.app.baseURL}api/labBottom`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveMediaSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const isVideo = (src) => /\.(mp4|webm|ogv)$/i.test(src);
    const labSlides = computed(() => {
      const items = labBannerData.value?.data?.items || [];
      const sortedItems = [...items].sort(
        (a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)
      );
      const slides = sortedItems.flatMap((item) => {
        const sources = item.PROPERTIES?.SLIDE?.SRC || [];
        const poster = item.PREVIEW_PICTURE_SRC ? resolveMediaSrc(item.PREVIEW_PICTURE_SRC) : "";
        return sources.map((src) => {
          const resolved = resolveMediaSrc(src);
          if (isVideo(resolved)) {
            return {
              type: "video",
              videoSrc: [{ src: resolved }],
              poster
            };
          }
          return {
            type: "image",
            src: resolved,
            alt: item.NAME || ""
          };
        });
      });
      return slides;
    });
    const labInfoItem = computed(() => labInfoData.value?.data?.items?.[0]);
    const normalizeArray = (value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };
    const splitParagraphs = (value) => {
      if (!value) return [];
      const normalized = value.replace(/<\/?br\s*\/?>/gi, "\n");
      return normalized.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
    };
    const labTitle = computed(() => labInfoItem.value?.NAME || "Лаборатория");
    const labCardTitle = computed(
      () => labInfoItem.value?.PREVIEW_TEXT || "Испытательная лаборатория ООО «ПИК» — это современный аккредитованный испытательный центр."
    );
    const labDescList = computed(
      () => splitParagraphs(labInfoItem.value?.DETAIL_TEXT)
    );
    const labEmails = computed(
      () => normalizeArray(labInfoItem.value?.PROPERTIES?.EMAIL?.VALUE)
    );
    const labPhones = computed(
      () => normalizeArray(labInfoItem.value?.PROPERTIES?.PHONE?.VALUE)
    );
    const topButton = computed(() => ({
      text: labInfoItem.value?.PROPERTIES?.TEXT_URL_TOP?.VALUE || "Смотреть аккредитацию",
      size: "sm",
      href: labInfoItem.value?.PROPERTIES?.URL_TOP?.VALUE || "#"
    }));
    const bottomButton = computed(() => ({
      text: labInfoItem.value?.PROPERTIES?.TEXT_URL_BOTTOM?.VALUE || "Подробнее о компании",
      size: "lg",
      href: labInfoItem.value?.PROPERTIES?.URL_BOTTOM?.VALUE || "/piktube/about"
    }));
    const labParkTitle = computed(
      () => labParkData.value?.meta?.iblock?.name || "Парк оборудования"
    );
    const labParkList = computed(() => {
      const items = labParkData.value?.data?.items || [];
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).filter((item) => Boolean(item.PREVIEW_PICTURE_SRC)).map((item) => ({
        title: item.PREVIEW_TEXT || item.NAME,
        image: {
          src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC || ""),
          alt: item.NAME
        }
      }));
    });
    const labObjectsTitle = computed(
      () => labObjectsData.value?.meta?.iblock?.name || "Объекты испытаний"
    );
    const labObjectsList = computed(() => {
      const items = labObjectsData.value?.data?.items || [];
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => ({
        title: item.NAME,
        image: item.PREVIEW_PICTURE_SRC ? { src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC), alt: item.NAME } : void 0
      }));
    });
    const labPricesTitle = computed(
      () => labPricesData.value?.meta?.iblock?.name || "Виды и цены проводимых испытаний"
    );
    const labPricesList = computed(() => {
      const items = labPricesData.value?.data?.items || [];
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => ({
        number: String(item.SORT || ""),
        content: {
          title: item.NAME,
          desc: item.PREVIEW_TEXT || ""
        },
        tests: {
          title: item.PROPERTIES?.METODIKA_TEXT?.VALUE || "—",
          href: item.PROPERTIES?.METODIKA_URL?.VALUE || void 0
        },
        price: item.PROPERTIES?.PRICE?.VALUE || "—"
      }));
    });
    const policy = {
      title: "Политика в области качества",
      list: [
        {
          title: "Ресурсы",
          desc: "В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов.В распоряжении испытательной лаборатории — передовое оборудование, соответствующее государственным стандартам. Сотрудники лаборатории строго придерживаются методов испытаний и процедур, обеспечивающих объективность и точность результатов."
        },
        {
          title: "Персонал",
          desc: "Команда испытательной лаборатории ООО «ПИК» нацелена на поддержание уровня компетенций и гарантирует соблюдение всех норм и стандартов качества в каждом проведённом исследовании."
        },
        {
          title: "Стандарты качества",
          desc: "Испытательная лаборатория ООО «ПИК» обязуется соблюдать требования ГОСТ ИСО/МЭК 17025-2019 «Общие требования к компетентности испытательных и калибровочных лабораторий», а также критериев аккредитации, и проводить поверочные работы в соответствии с установленными методами."
        }
      ]
    };
    const tasks = {
      title: "Задачи испытательной лаборатории",
      list: [
        {
          title: "Улучшение процедур",
          desc: "Улучшать процедуры СМК с целью обеспечения эффективности деятельности лаборатории на постоянной основе."
        },
        {
          title: "Предоставление услуг",
          desc: "Предоставлять услуги, соответствующие ожиданиям клиентов по качеству, точности и скорости выполнения."
        },
        {
          title: "Конфиденциальность",
          desc: "Соблюдать конфиденциальность информации, полученной в результате испытаний."
        },
        {
          title: "Следование принципам",
          desc: "Следовать принципам беспристрастности: гарантия независимости своих выводов и отчётов; обеспечение достоверности и прозрачности результатов."
        }
      ]
    };
    const bottomSections = computed(() => {
      const tree = labBottomData.value?.data?.TREE;
      if (!tree || tree.length === 0) return [policy, tasks];
      return [...tree].sort((a, b) => Number(a.SECTION.SORT || 0) - Number(b.SECTION.SORT || 0)).map((section) => ({
        title: section.SECTION.NAME,
        list: [...section.ITEMS || []].sort(
          (a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)
        ).map((item) => ({
          title: item.NAME,
          desc: decodeHtml2(item.PREVIEW_TEXT || "")
        }))
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroVideo = __nuxt_component_4$8;
      const _component_LabBlock = __nuxt_component_7$2;
      const _component_LEquipment = __nuxt_component_3$d;
      const _component_LTests = __nuxt_component_4$7;
      const _component_LPrices = __nuxt_component_5$6;
      const _component_LSection = __nuxt_component_6$3;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_HeroVideo, { slides: unref(labSlides) }, null, _parent));
      _push(ssrRenderComponent(_component_LabBlock, {
        "is-btn": true,
        "is-links": true,
        "title-tag": "h1",
        title: unref(labTitle),
        "card-title": unref(labCardTitle),
        "desc-list": unref(labDescList),
        emails: unref(labEmails),
        phones: unref(labPhones),
        "top-button": unref(topButton),
        "bottom-button": unref(bottomButton)
      }, null, _parent));
      _push(ssrRenderComponent(_component_LEquipment, {
        title: unref(labParkTitle),
        list: unref(labParkList)
      }, null, _parent));
      _push(ssrRenderComponent(_component_LTests, {
        title: unref(labObjectsTitle),
        list: unref(labObjectsList)
      }, null, _parent));
      _push(ssrRenderComponent(_component_LPrices, {
        title: unref(labPricesTitle),
        list: unref(labPricesList)
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(bottomSections), (section, index2) => {
        _push(ssrRenderComponent(_component_LSection, mergeProps({ key: index2 }, { ref_for: true }, section), null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$1X = _sfc_main$1X.setup;
_sfc_main$1X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lab.vue");
  return _sfc_setup$1X ? _sfc_setup$1X(props, ctx) : void 0;
};
const lab = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1X
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1W = /* @__PURE__ */ defineComponent({
  __name: "ContentBlock",
  __ssrInlineRender: true,
  props: {
    title: {},
    texts: {},
    button: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "content-block" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_CustomTitle, { tag: "h1" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="content-block__body">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`<!--[-->`);
        ssrRenderList(_ctx.texts, (item, index2) => {
          _push(ssrRenderComponent(_component_Text, { key: index2 }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "form", {}, null, _push, _parent);
      _push(`</div>`);
      if (_ctx.button) {
        _push(ssrRenderComponent(_component_Button, _ctx.button, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1W = _sfc_main$1W.setup;
_sfc_main$1W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ContentBlock.vue");
  return _sfc_setup$1W ? _sfc_setup$1W(props, ctx) : void 0;
};
const __nuxt_component_1$j = Object.assign(_sfc_main$1W, { __name: "ContentBlock" });
const ContentBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1V = /* @__PURE__ */ defineComponent({
  __name: "HeroWrapper",
  __ssrInlineRender: true,
  props: {
    title: {},
    texts: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentBlock = __nuxt_component_1$j;
      const _component_order_form = __nuxt_component_4$a;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero-wrapper" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ContentBlock, {
        title: _ctx.title,
        texts: _ctx.texts
      }, {
        form: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_order_form, {
              class: "hero-wrapper__form",
              prefix: "hero"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_order_form, {
                class: "hero-wrapper__form",
                prefix: "hero"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1V = _sfc_main$1V.setup;
_sfc_main$1V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroWrapper.vue");
  return _sfc_setup$1V ? _sfc_setup$1V(props, ctx) : void 0;
};
const __nuxt_component_1$i = Object.assign(_sfc_main$1V, { __name: "HeroWrapper" });
const HeroWrapper = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1U = /* @__PURE__ */ defineComponent({
  __name: "SectionDropdown",
  __ssrInlineRender: true,
  props: {
    title: {},
    isBigBtn: { type: Boolean }
  },
  setup(__props) {
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_Button = __nuxt_component_1$p;
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["section-dropdown", { "section-dropdown_active": unref(isOpen) }]
      }, _attrs))}><div class="section-dropdown__top">`);
      ssrRenderSlot(_ctx.$slots, "header", {}, () => {
        if (_ctx.title) {
          _push(ssrRenderComponent(_component_section_wrapper, { title: _ctx.title }, null, _parent));
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      if (_ctx.isBigBtn) {
        _push(ssrRenderComponent(_component_Button, {
          class: "section-dropdown__btn section-dropdown__btn_large",
          text: unref(isOpen) ? "Скрыть" : "Показать",
          icon: { name: "base-arrow" },
          size: "md"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Button, {
          class: "section-dropdown__btn section-dropdown__btn_small",
          icon: { name: "button-arrow" }
        }, null, _parent));
      }
      _push(`</div><div class="section-dropdown__content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1U = _sfc_main$1U.setup;
_sfc_main$1U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/SectionDropdown.vue");
  return _sfc_setup$1U ? _sfc_setup$1U(props, ctx) : void 0;
};
const __nuxt_component_0$e = Object.assign(_sfc_main$1U, { __name: "SectionDropdown" });
const SectionDropdown = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1T = /* @__PURE__ */ defineComponent({
  __name: "DocumentSlide",
  __ssrInlineRender: true,
  props: {
    text: {},
    size: {},
    href: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "document-slide" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "document-slide__icon",
        "is-sprite": false,
        name: "document",
        width: "48px",
        height: "48px"
      }, null, _parent));
      _push(`<div class="document-slide__content"><!--[-->`);
      ssrRenderList(props.text, (item, index2) => {
        _push(ssrRenderComponent(_component_Text, {
          key: index2,
          class: "document-slide__desc",
          size: "md",
          "line-height": "sm",
          design: "secondary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (props.size || props.href) {
        _push(`<a${ssrRenderAttr("href", props.href || "#")} class="document-slide__download" target="_blank" download>`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "document-slide__download--icon",
          "is-sprite": false,
          name: "download",
          width: "18px",
          height: "16px"
        }, null, _parent));
        _push(ssrRenderComponent(_component_Text, {
          class: "document-slide__download--text",
          size: "md",
          tag: "span"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(props.size ? `${props.size} мб` : "Скачать")}`);
            } else {
              return [
                createTextVNode(toDisplayString(props.size ? `${props.size} мб` : "Скачать"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1T = _sfc_main$1T.setup;
_sfc_main$1T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/DocumentSlide.vue");
  return _sfc_setup$1T ? _sfc_setup$1T(props, ctx) : void 0;
};
const __nuxt_component_1$h = Object.assign(_sfc_main$1T, { __name: "DocumentSlide" });
const DocumentSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$h
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1S = /* @__PURE__ */ defineComponent({
  __name: "DocumentSlider",
  __ssrInlineRender: true,
  props: {
    slides: {},
    mode: { default: "compact" },
    modificator: { default: void 0 }
  },
  setup(__props) {
    const props = __props;
    const breakpoints = computed(() => {
      if (props.mode === "wide") {
        return {
          1440: { slidesPerView: 4 },
          768: { slidesPerView: 2 }
        };
      }
      return {
        1440: { slidesPerView: 2 },
        0: { slidesPerView: 1 }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_DocumentSlide = __nuxt_component_1$h;
      _push(ssrRenderComponent(_component_BaseSwiper, mergeProps({
        class: "document-slider",
        loop: "",
        breakpoints: unref(breakpoints),
        modificator: props.modificator
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(props.slides, (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_DocumentSlide, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_DocumentSlide, mergeProps({ ref_for: true }, slide), null, 16)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(props.slides, (slide, index2) => {
                return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                  default: withCtx(() => [
                    createVNode(_component_DocumentSlide, mergeProps({ ref_for: true }, slide), null, 16)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1S = _sfc_main$1S.setup;
_sfc_main$1S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/DocumentSlider.vue");
  return _sfc_setup$1S ? _sfc_setup$1S(props, ctx) : void 0;
};
const __nuxt_component_2$k = Object.assign(_sfc_main$1S, { __name: "DocumentSlider" });
const DocumentSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$k
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1R = /* @__PURE__ */ defineComponent({
  __name: "ProItem",
  __ssrInlineRender: true,
  props: {
    title: {},
    sections: {},
    sliderMode: {},
    showButtons: { type: Boolean, default: true }
  },
  setup(__props) {
    const activeSectionIndex = ref(0);
    const handleSectionClick = (index2) => {
      activeSectionIndex.value = index2;
    };
    const currentSlides = computed(
      () => __props.sections[activeSectionIndex.value]?.slides || []
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_section_dropdown = __nuxt_component_0$e;
      const _component_document_slider = __nuxt_component_2$k;
      _push(ssrRenderComponent(_component_section_dropdown, mergeProps({
        class: "pro-item",
        title: _ctx.title
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="pro-item__container"${_scopeId}>`);
            if (_ctx.showButtons && _ctx.sections.length > 1) {
              _push2(`<div class="pro-item__top"${_scopeId}><!--[-->`);
              ssrRenderList(_ctx.sections, (section, index2) => {
                _push2(`<span class="${ssrRenderClass([{
                  "pro-item__top--link_active": unref(activeSectionIndex) === index2
                }, "pro-item__top--link"])}"${_scopeId}>${ssrInterpolate(section.title)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="pro-item__slider"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_document_slider, {
              slides: unref(currentSlides),
              mode: _ctx.sliderMode,
              key: unref(activeSectionIndex)
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "pro-item__container" }, [
                _ctx.showButtons && _ctx.sections.length > 1 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "pro-item__top"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.sections, (section, index2) => {
                    return openBlock(), createBlock("span", {
                      key: `pro-item-section-${index2}`,
                      class: ["pro-item__top--link", {
                        "pro-item__top--link_active": unref(activeSectionIndex) === index2
                      }],
                      onClick: ($event) => handleSectionClick(index2)
                    }, toDisplayString(section.title), 11, ["onClick"]);
                  }), 128))
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "pro-item__slider" }, [
                  (openBlock(), createBlock(_component_document_slider, {
                    slides: unref(currentSlides),
                    mode: _ctx.sliderMode,
                    key: unref(activeSectionIndex)
                  }, null, 8, ["slides", "mode"]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1R = _sfc_main$1R.setup;
_sfc_main$1R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/pro/ProItem.vue");
  return _sfc_setup$1R ? _sfc_setup$1R(props, ctx) : void 0;
};
const __nuxt_component_0$d = Object.assign(_sfc_main$1R, { __name: "ProItem" });
const ProItem = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1Q = /* @__PURE__ */ defineComponent({
  __name: "ProList",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    const props = __props;
    const ProList2 = [
      {
        title: "Альбомы проектных решений (по запросу)",
        sections: [
          {
            title: "Альбомы проектных решений (по запросу)",
            slides: [
              {
                text: ["Альбом проектных", "решений №1"],
                size: "10"
              },
              {
                text: ["Альбом проектных", "решений №2"],
                size: "10"
              },
              {
                text: ["Альбом проектных", "решений №3"],
                size: "10"
              },
              {
                text: ["Альбом проектных", "решений №4"],
                size: "10"
              },
              {
                text: ["Альбом проектных", "решений №5"],
                size: "10"
              },
              {
                text: ["Альбом проектных", "решений №6"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: false
        // Без кнопок - показывается только слайдер
      },
      {
        title: "Прайс листы",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      },
      {
        title: "Сертификаты",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      },
      {
        title: "ГОСТы",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      },
      {
        title: "СНИПы",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      },
      {
        title: "Инструкции по монтажу",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      },
      {
        title: "Схемы соединений",
        sections: [
          {
            title: "Водоснабжение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                size: "10"
              }
            ]
          },
          {
            title: "Водоотведение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 1"],
                size: "10"
              }
            ]
          },
          {
            title: "Газораспределение",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 2"],
                size: "10"
              }
            ]
          },
          {
            title: "Защита кабеля",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 3"],
                size: "10"
              }
            ]
          },
          {
            title: "Изоляция в нефтегазовой отрасли",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 4"],
                size: "10"
              }
            ]
          },
          {
            title: "Стальные трубы в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 5"],
                size: "10"
              }
            ]
          },
          {
            title: "Полиэтиленовые трубы",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 6"],
                size: "10"
              }
            ]
          },
          {
            title: "Фасонные изделия в изоляции",
            slides: [
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              },
              {
                text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП 7"],
                size: "10"
              }
            ]
          }
        ],
        sliderMode: "wide",
        showButtons: true
      }
    ];
    const listItems = computed(
      () => props.items && props.items.length ? props.items : ProList2
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProItem = __nuxt_component_0$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pro-list-wrap" }, _attrs))}><div class="container"><div class="pro-list"><!--[-->`);
      ssrRenderList(unref(listItems), (item, index2) => {
        _push(`<div class="pro-list__item">`);
        _push(ssrRenderComponent(_component_ProItem, mergeProps({ ref_for: true }, item), null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$1Q = _sfc_main$1Q.setup;
_sfc_main$1Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/pro/ProList.vue");
  return _sfc_setup$1Q ? _sfc_setup$1Q(props, ctx) : void 0;
};
const __nuxt_component_2$j = Object.assign(_sfc_main$1Q, { __name: "ProList" });
const ProList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1P = /* @__PURE__ */ defineComponent({
  __name: "PopupButton",
  __ssrInlineRender: true,
  props: {
    text: {},
    modalName: {},
    class: {},
    href: {},
    isModalOpener: { type: Boolean },
    icon: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["popup-button"];
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      if (props.isModalOpener) {
        base.push("modal-opener", "js-modal-opener");
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: unref(classes),
        href: props.href,
        "data-modal": props.modalName
      }, _attrs))}>`);
      if (props.icon) {
        _push(ssrRenderComponent(_component_Icon, {
          class: "popup-button__icon",
          "is-sprite": false,
          name: props.icon.name,
          width: props.icon.width,
          height: props.icon.height
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_Text, {
        class: "popup-button__text",
        tag: "span",
        size: "sm",
        "line-height": "xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.text), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</a>`);
    };
  }
});
const _sfc_setup$1P = _sfc_main$1P.setup;
_sfc_main$1P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/PopupButton.vue");
  return _sfc_setup$1P ? _sfc_setup$1P(props, ctx) : void 0;
};
const __nuxt_component_0$c = Object.assign(_sfc_main$1P, { __name: "PopupButton" });
const PopupButton = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1O = {};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs) {
  const _component_PopupButton = __nuxt_component_0$c;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "download-documents-popup" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_PopupButton, {
    class: "download-documents-popup__item",
    isModalOpener: "",
    text: "Скачать документы",
    modalName: "documents-modal"
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$1O = _sfc_main$1O.setup;
_sfc_main$1O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/popups/DownloadDocumentsPopup.vue");
  return _sfc_setup$1O ? _sfc_setup$1O(props, ctx) : void 0;
};
const __nuxt_component_4$6 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1O, [["ssrRender", _sfc_ssrRender$c]]), { __name: "DownloadDocumentsPopup" });
const DownloadDocumentsPopup = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1N = /* @__PURE__ */ defineComponent({
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    name: {},
    class: {},
    mode: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["modal", "js-modal"];
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      if (props.mode) {
        base.push(`modal_${props.mode}`);
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: classes.value,
        "data-modal": props.name
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1N = _sfc_main$1N.setup;
_sfc_main$1N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Modal.vue");
  return _sfc_setup$1N ? _sfc_setup$1N(props, ctx) : void 0;
};
const __nuxt_component_0$b = Object.assign(_sfc_main$1N, { __name: "Modal" });
const Modal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1M = /* @__PURE__ */ defineComponent({
  __name: "CloseButton",
  __ssrInlineRender: true,
  props: {
    name: {},
    class: {},
    isModalCloser: { type: Boolean },
    size: { default: "lg" }
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => {
      const base = ["close-button"];
      if (props.class) {
        base.push(...Array.isArray(props.class) ? props.class : [props.class]);
      }
      if (props.isModalCloser) {
        base.push("modal-closer", "js-modal-closer");
      }
      return base;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: classes.value,
        "data-modal": props.name
      }, _attrs))}>`);
      if (props.size == "lg") {
        _push(ssrRenderComponent(_component_Icon, { name: "close-button-lg" }, null, _parent));
      } else if (props.size === "md") {
        _push(ssrRenderComponent(_component_Icon, { name: "close-button" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
});
const _sfc_setup$1M = _sfc_main$1M.setup;
_sfc_main$1M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/CloseButton.vue");
  return _sfc_setup$1M ? _sfc_setup$1M(props, ctx) : void 0;
};
const __nuxt_component_1$g = Object.assign(_sfc_main$1M, { __name: "CloseButton" });
const CloseButton = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1L = {};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs) {
  const _component_Modal = __nuxt_component_0$b;
  const _component_CustomTitle = __nuxt_component_0$j;
  const _component_CloseButton = __nuxt_component_1$g;
  const _component_order_form = __nuxt_component_4$a;
  _push(ssrRenderComponent(_component_Modal, mergeProps({
    class: "documents-modal",
    name: "documents-modal",
    mode: "right"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="documents-modal__container"${_scopeId}><div class="documents-modal__top"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_CustomTitle, {
          class: "documents-modal__title",
          tag: "p",
          mode: "lg"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(` Заявка на скачивание документов `);
            } else {
              return [
                createTextVNode(" Заявка на скачивание документов ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_CloseButton, {
          class: "documents-modal__close",
          "is-modal-closer": "",
          name: "documents-modal"
        }, null, _parent2, _scopeId));
        _push2(`</div>`);
        _push2(ssrRenderComponent(_component_order_form, { prefix: "documents-modal" }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "documents-modal__container" }, [
            createVNode("div", { class: "documents-modal__top" }, [
              createVNode(_component_CustomTitle, {
                class: "documents-modal__title",
                tag: "p",
                mode: "lg"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Заявка на скачивание документов ")
                ]),
                _: 1
              }),
              createVNode(_component_CloseButton, {
                class: "documents-modal__close",
                "is-modal-closer": "",
                name: "documents-modal"
              })
            ]),
            createVNode(_component_order_form, { prefix: "documents-modal" })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1L = _sfc_main$1L.setup;
_sfc_main$1L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/DocumentsModal.vue");
  return _sfc_setup$1L ? _sfc_setup$1L(props, ctx) : void 0;
};
const __nuxt_component_5$5 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1L, [["ssrRender", _sfc_ssrRender$b]]), { __name: "DocumentsModal" });
const DocumentsModal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1K = /* @__PURE__ */ defineComponent({
  __name: "pro",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: designersData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "designersPage",
      () => $fetch(`${config.app.baseURL}api/designersPage`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const splitParagraphs = (value) => {
      if (!value) return [];
      const normalized = decodeHtml2(value).replace(/<\/?br\s*\/?>/gi, "\n");
      return normalized.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    };
    const splitLines = (value) => {
      if (!value) return [];
      const normalized = decodeHtml2(value).replace(/<\/?br\s*\/?>/gi, "\n");
      return normalized.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    };
    const resolveMediaSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const formatSizeMb = (value) => {
      const bytes = Number(value);
      if (!bytes || Number.isNaN(bytes)) return void 0;
      const mb = bytes / (1024 * 1024);
      return mb < 1 ? mb.toFixed(2) : mb.toFixed(1);
    };
    const pageTitle = computed(
      () => designersData.value?.meta?.iblock?.name || "Проектировщикам"
    );
    const pageTexts = computed(
      () => splitParagraphs(designersData.value?.meta?.iblock?.description)
    );
    const breadcrumbsList = computed(() => [
      { title: "Главная", href: "/" },
      { title: pageTitle.value, href: "/pro" }
    ]);
    const mapSlides = (items = []) => {
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => {
        const name = item.NAME || "";
        const textParts = splitLines(name);
        const fileProperty = item.PROPERTIES?.FILE;
        const fileSrc = (Array.isArray(fileProperty?.SRC) ? fileProperty?.SRC[0] : fileProperty?.SRC) || fileProperty?.FILE?.SRC || item.PROPERTY_FILE_SRC;
        const href = resolveMediaSrc(fileSrc);
        const size = formatSizeMb(fileProperty?.FILE?.FILE_SIZE) || (Array.isArray(fileProperty?.DESCRIPTION) ? fileProperty?.DESCRIPTION[0] : fileProperty?.DESCRIPTION) || void 0;
        return {
          text: textParts.length ? textParts : [decodeHtml2(name)],
          size,
          href: href || void 0
        };
      });
    };
    const proListItems = computed(() => {
      const tree = designersData.value?.data?.TREE || [];
      return [...tree].sort((a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0)).map((section) => {
        const sectionTitle = section.SECTION?.NAME || "";
        const baseSectionItems = mapSlides(section.ITEMS || []);
        const childSections = (section.CHILDREN || []).slice().sort(
          (a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0)
        ).map((child) => ({
          title: child.SECTION?.NAME || "",
          slides: mapSlides(child.ITEMS || [])
        })).filter((child) => child.slides.length);
        const sections = [];
        if (baseSectionItems.length) {
          sections.push({
            title: sectionTitle,
            slides: baseSectionItems
          });
        }
        sections.push(...childSections);
        return {
          title: sectionTitle,
          sections,
          sliderMode: "wide",
          showButtons: sections.length > 1
        };
      }).filter((item) => item.sections.length);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroWrapper = __nuxt_component_1$i;
      const _component_ProList = __nuxt_component_2$j;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_DownloadDocumentsPopup = __nuxt_component_4$6;
      const _component_DocumentsModal = __nuxt_component_5$5;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(ssrRenderComponent(_component_HeroWrapper, {
        class: "pro-hero",
        title: unref(pageTitle),
        texts: unref(pageTexts)
      }, null, _parent));
      _push(ssrRenderComponent(_component_ProList, { items: unref(proListItems) }, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_DownloadDocumentsPopup, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_DocumentsModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1K = _sfc_main$1K.setup;
_sfc_main$1K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pro.vue");
  return _sfc_setup$1K ? _sfc_setup$1K(props, ctx) : void 0;
};
const pro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1K
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1J = /* @__PURE__ */ defineComponent({
  __name: "BenefitCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "benefit-card" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Icon, mergeProps({ class: "benefit-card__icon" }, props.icon), null, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "benefit-card__title",
        tag: "span",
        weight: "medium",
        "line-height": "sm",
        design: "primary",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1J = _sfc_main$1J.setup;
_sfc_main$1J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/BenefitCard.vue");
  return _sfc_setup$1J ? _sfc_setup$1J(props, ctx) : void 0;
};
const __nuxt_component_0$a = Object.assign(_sfc_main$1J, { __name: "BenefitCard" });
const BenefitCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1I = /* @__PURE__ */ defineComponent({
  __name: "DecorativeWrap",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "decorative-wrap" }, _attrs))}><div class="decorative-wrap__top">`);
      if (props.title) {
        _push(ssrRenderComponent(_component_Text, {
          class: "decorative-wrap__title",
          size: "xs",
          "line-height": "xs",
          design: "accent",
          uppercase: true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(props.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(props.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1I = _sfc_main$1I.setup;
_sfc_main$1I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/DecorativeWrap.vue");
  return _sfc_setup$1I ? _sfc_setup$1I(props, ctx) : void 0;
};
const __nuxt_component_0$9 = Object.assign(_sfc_main$1I, { __name: "DecorativeWrap" });
const DecorativeWrap = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1H = /* @__PURE__ */ defineComponent({
  __name: "RegaliaCard",
  __ssrInlineRender: true,
  props: {
    image: {},
    title: {},
    text: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(ssrRenderComponent(_component_BorderLine, mergeProps({
        class: "regalia-card",
        position: "left",
        design: "main"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="regalia-card__img"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Image, mergeProps({ class: "regalia-card__img--item" }, props.image), null, _parent2, _scopeId));
            _push2(`</div><div class="regalia-card__content"${_scopeId}><span class="regalia-card__title"${_scopeId}><!--[-->`);
            ssrRenderList(props.title, (item, index2) => {
              _push2(ssrRenderComponent(_component_Text, {
                key: index2,
                class: "regalia-card__title--item",
                tag: "span",
                weight: "medium",
                design: "primary",
                "line-height": "xs",
                uppercase: true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item)}<br${_scopeId2}>`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item), 1),
                      createVNode("br")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></span><span class="regalia-card__desc"${_scopeId}><!--[-->`);
            ssrRenderList(props.text, (item, index2) => {
              _push2(ssrRenderComponent(_component_Text, {
                key: index2,
                class: "regalia-card__desc--item",
                tag: "span",
                design: "primary",
                "line-height": "sm",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item)}<br${_scopeId2}>`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item), 1),
                      createVNode("br")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></span></div>`);
          } else {
            return [
              createVNode("div", { class: "regalia-card__img" }, [
                createVNode(_component_Image, mergeProps({ class: "regalia-card__img--item" }, props.image), null, 16)
              ]),
              createVNode("div", { class: "regalia-card__content" }, [
                createVNode("span", { class: "regalia-card__title" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(props.title, (item, index2) => {
                    return openBlock(), createBlock(_component_Text, {
                      key: index2,
                      class: "regalia-card__title--item",
                      tag: "span",
                      weight: "medium",
                      design: "primary",
                      "line-height": "xs",
                      uppercase: true
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item), 1),
                        createVNode("br")
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                createVNode("span", { class: "regalia-card__desc" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(props.text, (item, index2) => {
                    return openBlock(), createBlock(_component_Text, {
                      key: index2,
                      class: "regalia-card__desc--item",
                      tag: "span",
                      design: "primary",
                      "line-height": "sm",
                      size: "sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item), 1),
                        createVNode("br")
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1H = _sfc_main$1H.setup;
_sfc_main$1H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/RegaliaCard.vue");
  return _sfc_setup$1H ? _sfc_setup$1H(props, ctx) : void 0;
};
const __nuxt_component_1$f = Object.assign(_sfc_main$1H, { __name: "RegaliaCard" });
const RegaliaCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1G = /* @__PURE__ */ defineComponent({
  __name: "Regalia",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackRegaliaList = [
      {
        image: {
          src: "achievements/achievement-01",
          alt: "Дипломант конкурса"
          // width: '52px',
          // height: '68px',
        },
        title: ["100 лучших товаров ", "России"],
        text: ["2022-2024 гг."]
      },
      {
        image: {
          src: "achievements/achievement-02",
          alt: "Член АПТС"
        },
        title: ["Член АПТС"],
        text: ["Ассоциация производителей ", "трубопроводных систем"]
      },
      {
        image: {
          src: "achievements/achievement-03",
          alt: "Член РАВВ"
          // width: '167px',
          // height: '68px',
        },
        title: ["Член РАВВ"],
        text: ["Российская ассоциация ", "водоснабжения и водоотведения"]
      },
      {
        image: {
          src: "achievements/achievement-04",
          alt: "Участник ГИСП"
          // width: '68px',
          // height: '68px',
        },
        title: ["Участник ГИСП"],
        text: ["Государственная информационная ", "система промышленности"]
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: threeBlockMainData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "threeBlockMain",
      () => $fetch(`${config.app.baseURL}api/threeBlockMain`)
    )), __temp = await __temp, __restore(), __temp);
    const splitLines = (value) => {
      if (!value) return [];
      return value.replace(/<br\s*\/?>/gi, "\n").split("\n").map((item) => item.trim()).filter(Boolean);
    };
    const regaliaList = computed(() => {
      const items = threeBlockMainData.value?.data?.items;
      if (!items || items.length === 0) return fallbackRegaliaList;
      return items.map((item, index2) => ({
        image: fallbackRegaliaList[index2]?.image || fallbackRegaliaList[0].image,
        title: splitLines(item.NAME),
        text: splitLines(item.PREVIEW_TEXT)
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DecorativeWrap = __nuxt_component_0$9;
      const _component_RegaliaCard = __nuxt_component_1$f;
      _push(ssrRenderComponent(_component_DecorativeWrap, mergeProps({ class: "regalia" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="regalia__wrap"${_scopeId}><!--[-->`);
            ssrRenderList(unref(regaliaList), (item, index2) => {
              _push2(ssrRenderComponent(_component_RegaliaCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "regalia__wrap" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(regaliaList), (item, index2) => {
                  return openBlock(), createBlock(_component_RegaliaCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1G = _sfc_main$1G.setup;
_sfc_main$1G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Regalia.vue");
  return _sfc_setup$1G ? _sfc_setup$1G(props, ctx) : void 0;
};
const __nuxt_component_1$e = Object.assign(_sfc_main$1G, { __name: "Regalia" });
const Regalia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1F = /* @__PURE__ */ defineComponent({
  __name: "Advantages",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackBenefitsList = [
      {
        icon: {
          name: "price",
          isSprite: false
        },
        title: "Выгодные цены"
      },
      {
        icon: {
          name: "reliability",
          isSprite: false
        },
        title: "надежность"
      },
      {
        icon: {
          name: "experience",
          isSprite: false
        },
        title: "богатый опыт"
      },
      {
        icon: {
          name: "location",
          isSprite: false
        },
        title: "Точная доставка"
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: mainBottomBannerData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainBottomBanner",
      () => $fetch(`${config.app.baseURL}api/mainBottomBanner`)
    )), __temp = await __temp, __restore(), __temp);
    const resolveIconSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const benefitsList = computed(() => {
      const items = mainBottomBannerData.value?.data?.items;
      if (!items || items.length === 0) return fallbackBenefitsList;
      return items.map((item) => ({
        icon: {
          name: "external",
          isSprite: false,
          src: resolveIconSrc(item.PROPERTIES?.ICON?.SRC)
        },
        title: item.NAME
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BenefitCard = __nuxt_component_0$a;
      const _component_Regalia = __nuxt_component_1$e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "advantages" }, _attrs))}><div class="container"><div class="advantages__container"><div class="advantages__top to-animate"><!--[-->`);
      ssrRenderList(unref(benefitsList), (item, index2) => {
        _push(ssrRenderComponent(_component_BenefitCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_Regalia, null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1F = _sfc_main$1F.setup;
_sfc_main$1F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/Advantages.vue");
  return _sfc_setup$1F ? _sfc_setup$1F(props, ctx) : void 0;
};
const __nuxt_component_1$d = Object.assign(_sfc_main$1F, { __name: "Advantages" });
const Advantages = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1E = /* @__PURE__ */ defineComponent({
  __name: "AManufacture",
  __ssrInlineRender: true,
  setup(__props) {
    const descList = [
      "Производственная площадка ООО ПИК располагается в городе Полевской Свердловской области и представляет собой современный трубный завод полного цикла. С 2004 года предприятие осуществляет выпуск высококачественной трубопроводной продукции для систем водоснабжения, теплоснабжения, газоснабжения, канализации, энергетических и промышленных сетей.",
      "Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.",
      "На заводе функционирует собственная аккредитованная лаборатория, оснащённая измерительным и испытательным оборудованием европейского уровня. Все этапы производства находятся под постоянным контролем, включая входной анализ сырья, производственные параметры и финальное тестирование готовой продукции. Вся продукция ООО «ПИК» соответствует требованиям нормативных документов: ГОСТ Р 56227-2014, ГОСТ 30732-2020, ГОСТ Р ИСО 58346-2019, а также техническим условиям предприятия. Каждое изделие сопровождается паспортом качества и маркировкой, соответствующей стандартам.",
      "ООО «ПИК» специализируется на выпуске:<br />— полиэтиленовых труб (ПНД) для водоснабжения, канализации, газовых сетей и кабельной защиты;<br />— стальных труб с тепловой и антикоррозийной изоляцией (ППУ, ППМ, ВУС);<br />— фасонных изделий в изоляции: отводов, тройников, переходов, муфт;<br />— многослойных гофрированных труб под торговой маркой «ПИКПАЙП», в том числе с полиуретановой теплоизоляцией (OD 160–500 мм).",
      "Собственные производственные мощности, автоматизация процессов, строгий контроль качества и высококвалифицированный инженерный персонал позволяют ООО «ПИК» обеспечивать выпуск надёжной продукции, востребованной как в жилищном, так и в промышленном и инфраструктурном строительстве.<br />Продукция предприятия используется при реализации федеральных и региональных проектов и поставляется по всей территории Российской Федерации. ООО «ПИК» входит в число надёжных и проверенных поставщиков трубной продукции для крупнейших строительных и энергетических компаний страны."
    ];
    const normalizeNbsp = (s) => s.replaceAll("&nbsp;", " ");
    const splitByBr = (s) => normalizeNbsp(s).split(/<br\s*\/?\s*>/i);
    const descLines = computed(() => descList.map((t) => splitByBr(t)));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "a-manufacture" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "a-manufacture__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="a-manufacture__content"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "a-manufacture__content--title",
              tag: "h1"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Производство `);
                } else {
                  return [
                    createTextVNode(" Производство ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="a-manufacture__content--desc"${_scopeId}><!--[-->`);
            ssrRenderList(unref(descLines), (lines, index2) => {
              _push2(ssrRenderComponent(_component_Text, { class: "a-manufacture__content--desc_item" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(lines, (line, i) => {
                      _push3(`<!--[--><span${_scopeId2}>${ssrInterpolate(line)}</span>`);
                      if (i < lines.length - 1) {
                        _push3(`<br${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<!--]-->`);
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: `d-${index2}-${i}`
                        }, [
                          createVNode("span", null, toDisplayString(line), 1),
                          i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="a-manufacture__content--btn-wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Button, {
              class: "a-manufacture__content--btn",
              text: "Подробнее о лаборатории",
              href: "/piktube/lab",
              size: "lg"
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "a-manufacture__content" }, [
                createVNode(_component_CustomTitle, {
                  class: "a-manufacture__content--title",
                  tag: "h1"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Производство ")
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "a-manufacture__content--desc" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(descLines), (lines, index2) => {
                    return openBlock(), createBlock(_component_Text, {
                      key: index2,
                      class: "a-manufacture__content--desc_item"
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                          return openBlock(), createBlock(Fragment, {
                            key: `d-${index2}-${i}`
                          }, [
                            createVNode("span", null, toDisplayString(line), 1),
                            i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                          ], 64);
                        }), 128))
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                createVNode("div", { class: "a-manufacture__content--btn-wrap" }, [
                  createVNode(_component_Button, {
                    class: "a-manufacture__content--btn",
                    text: "Подробнее о лаборатории",
                    href: "/piktube/lab",
                    size: "lg"
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1E = _sfc_main$1E.setup;
_sfc_main$1E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/about/AManufacture.vue");
  return _sfc_setup$1E ? _sfc_setup$1E(props, ctx) : void 0;
};
const __nuxt_component_3$b = Object.assign(_sfc_main$1E, { __name: "AManufacture" });
const AManufacture = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1D = /* @__PURE__ */ defineComponent({
  __name: "ExperienceSlide",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    description: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "experience-slide" }, _attrs))}><div class="experience-slide__top">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "experience-slide__title",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "experience-slide__subtitle",
        size: "sm",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.subtitle)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.subtitle), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "experience-slide__desc",
        size: "sm",
        design: "accent-dimmer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.description)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.description), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1D = _sfc_main$1D.setup;
_sfc_main$1D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/ExperienceSlide.vue");
  return _sfc_setup$1D ? _sfc_setup$1D(props, ctx) : void 0;
};
const __nuxt_component_1$c = Object.assign(_sfc_main$1D, { __name: "ExperienceSlide" });
const ExperienceSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1C = /* @__PURE__ */ defineComponent({
  __name: "ExperienceSlider",
  __ssrInlineRender: true,
  setup(__props) {
    const slides = [
      {
        title: "21",
        subtitle: "год на рынке",
        description: "За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ»."
      },
      {
        title: "22",
        subtitle: "год на рынке",
        description: "За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ»."
      },
      {
        title: "23",
        subtitle: "год на рынке",
        description: "За двадцать один год своего существования мы завоевали доверие и стали поставщиком ведущих российских компаний как ПАО «Т Плюс», ПАО «Полюс» и многих других. Являемся сертифицированным поставщиком ПАО «Нефтяная компания «РОСНЕФТЬ», ПАО «ГАЗПРОМНЕФТЬ»."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_ExperienceSlide = __nuxt_component_1$c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "experience-slider-container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: "experience-slider",
        loop: "",
        modificator: "experience",
        "space-between": 0,
        navigation: false,
        pagination: {
          el: ".experience-slider-pagination",
          clickable: true,
          renderBullet: (index2, className) => {
            return `<div class='${className} pagination-bullet'></div>`;
          }
        },
        "show-navigation-with-pagination": false,
        "slides-per-view": 1,
        effect: "fade",
        "fade-effect": { crossFade: true }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(slides, (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_ExperienceSlide, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_ExperienceSlide, mergeProps({ ref_for: true }, slide), null, 16)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(slides, (slide, index2) => {
                return createVNode(unref(SwiperSlide), { key: index2 }, {
                  default: withCtx(() => [
                    createVNode(_component_ExperienceSlide, mergeProps({ ref_for: true }, slide), null, 16)
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="experience-slider-pagination"></div></div>`);
    };
  }
});
const _sfc_setup$1C = _sfc_main$1C.setup;
_sfc_main$1C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/ExperienceSlider.vue");
  return _sfc_setup$1C ? _sfc_setup$1C(props, ctx) : void 0;
};
const __nuxt_component_0$8 = Object.assign(_sfc_main$1C, { __name: "ExperienceSlider" });
const ExperienceSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1B = /* @__PURE__ */ defineComponent({
  __name: "ExperienceCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    text: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "experience-card" }, _attrs))}><div class="experience-card__wrap">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "experience-card__title",
        "line-height": "xs",
        design: "accent",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "experience-card__desc",
        size: "sm",
        design: "accent-dimmer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.text), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="experience-card__plus modal-opener js-modal-opener" data-modal="experience-card-modal">`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "experience-card__plus--icon",
        name: "plus",
        "is-sprite": false
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1B = _sfc_main$1B.setup;
_sfc_main$1B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/ExperienceCard.vue");
  return _sfc_setup$1B ? _sfc_setup$1B(props, ctx) : void 0;
};
const __nuxt_component_1$b = Object.assign(_sfc_main$1B, { __name: "ExperienceCard" });
const ExperienceCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1A = {};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs) {
  const _component_experience_slider = __nuxt_component_0$8;
  const _component_experience_card = __nuxt_component_1$b;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "a-experience" }, _attrs))}><div class="container"><div class="a-experience__container"><div class="a-experience__wrap">`);
  _push(ssrRenderComponent(_component_experience_slider, null, null, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_experience_card, {
    title: "Инновации",
    text: "Ежегодно выпускаем на рынок не менее одной производственной новинки: в 2023 году было освоено производство уникального продукта: ПИКПАЙП G-ППУ."
  }, null, _parent));
  _push(ssrRenderComponent(_component_experience_card, {
    title: "Ваше время",
    text: "Производственные процессы отлажены до мелочей – на предприятии внедрены самые современные инструменты бережливого производства и реализован национальный проект по повышению производительности труда и поддержки занятости."
  }, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup$1A = _sfc_main$1A.setup;
_sfc_main$1A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/about/AExperience.vue");
  return _sfc_setup$1A ? _sfc_setup$1A(props, ctx) : void 0;
};
const __nuxt_component_4$5 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1A, [["ssrRender", _sfc_ssrRender$a]]), { __name: "AExperience" });
const AExperience = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1z = /* @__PURE__ */ defineComponent({
  __name: "PartnerSlide",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(ssrRenderComponent(_component_BorderLine, mergeProps({
        position: "left",
        design: "main",
        class: "partner-slide"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="partner-slide__wrap"${_scopeId}><div class="partner-slide__img"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, mergeProps({ class: "partner-slide__img--item" }, props.icon), null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_Text, {
              class: "partner-slide__title",
              "line-height": "xs",
              weight: "medium",
              design: "primary",
              uppercase: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(props.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(props.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "partner-slide__wrap" }, [
                createVNode("div", { class: "partner-slide__img" }, [
                  createVNode(_component_Icon, mergeProps({ class: "partner-slide__img--item" }, props.icon), null, 16)
                ]),
                createVNode(_component_Text, {
                  class: "partner-slide__title",
                  "line-height": "xs",
                  weight: "medium",
                  design: "primary",
                  uppercase: true
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(props.title), 1)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1z = _sfc_main$1z.setup;
_sfc_main$1z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/PartnerSlide.vue");
  return _sfc_setup$1z ? _sfc_setup$1z(props, ctx) : void 0;
};
const __nuxt_component_2$i = Object.assign(_sfc_main$1z, { __name: "PartnerSlide" });
const PartnerSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1y = /* @__PURE__ */ defineComponent({
  __name: "PartnersSlider",
  __ssrInlineRender: true,
  props: {
    title: {},
    list: {}
  },
  setup(__props) {
    const props = __props;
    const fallbackList = [
      {
        icon: {
          name: "sibur",
          isSprite: false,
          width: "175px",
          height: "33px"
        },
        title: "Сибур"
      },
      {
        icon: {
          name: "pik",
          isSprite: false,
          width: "107px",
          height: "33px"
        },
        title: "Пик группа"
      },
      {
        icon: {
          name: "sibur",
          isSprite: false,
          width: "175px",
          height: "33px"
        },
        title: "Сибур"
      },
      {
        icon: {
          name: "pik",
          isSprite: false,
          width: "107px",
          height: "33px"
        },
        title: "Пик группа"
      },
      {
        icon: {
          name: "sibur",
          isSprite: false,
          width: "175px",
          height: "33px"
        },
        title: "Сибур"
      },
      {
        icon: {
          name: "pik",
          isSprite: false,
          width: "107px",
          height: "33px"
        },
        title: "Пик группа"
      },
      {
        icon: {
          name: "sibur",
          isSprite: false,
          width: "175px",
          height: "33px"
        },
        title: "Сибур"
      },
      {
        icon: {
          name: "pik",
          isSprite: false,
          width: "107px",
          height: "33px"
        },
        title: "Пик группа"
      }
    ];
    const partnersList = computed(
      () => props.list && props.list.length ? props.list : fallbackList
    );
    const title2 = computed(() => props.title || "Нам доверяют");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_DecorativeWrap = __nuxt_component_0$9;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_PartnerSlide = __nuxt_component_2$i;
      _push(ssrRenderComponent(_component_DecorativeWrap, mergeProps({
        class: "partners-slider-wrap",
        title: unref(title2)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BaseSwiper, {
              class: "partners-slider",
              loop: "",
              modificator: "partners",
              breakpoints: { 768: { slidesPerView: 2 }, 1440: { slidesPerView: 4 } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(partnersList), (slide, index2) => {
                    _push3(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_PartnerSlide, mergeProps({ ref_for: true }, slide), null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_PartnerSlide, mergeProps({ ref_for: true }, slide), null, 16)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(partnersList), (slide, index2) => {
                      return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                        default: withCtx(() => [
                          createVNode(_component_PartnerSlide, mergeProps({ ref_for: true }, slide), null, 16)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_BaseSwiper, {
                class: "partners-slider",
                loop: "",
                modificator: "partners",
                breakpoints: { 768: { slidesPerView: 2 }, 1440: { slidesPerView: 4 } }
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(partnersList), (slide, index2) => {
                    return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                      default: withCtx(() => [
                        createVNode(_component_PartnerSlide, mergeProps({ ref_for: true }, slide), null, 16)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1y = _sfc_main$1y.setup;
_sfc_main$1y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/PartnersSlider.vue");
  return _sfc_setup$1y ? _sfc_setup$1y(props, ctx) : void 0;
};
const __nuxt_component_4$4 = Object.assign(_sfc_main$1y, { __name: "PartnersSlider" });
const PartnersSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1x = /* @__PURE__ */ defineComponent({
  __name: "APartners",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: trustData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainTrust",
      () => $fetch(`${config.app.baseURL}api/mainTrust`)
    )), __temp = await __temp, __restore(), __temp);
    const resolveMediaSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const trustTitle = computed(
      () => trustData.value?.meta?.iblock?.name || "Нам доверяют"
    );
    const trustSlides = computed(() => {
      const items = trustData.value?.data?.items || [];
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => ({
        title: item.NAME || "",
        icon: {
          name: item.NAME || "partner",
          isSprite: false,
          src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC)
        }
      })).filter((item) => item.title && item.icon.src);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PartnersSlider = __nuxt_component_4$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "a-partners" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_PartnersSlider, {
        title: unref(trustTitle),
        list: unref(trustSlides)
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1x = _sfc_main$1x.setup;
_sfc_main$1x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/about/APartners.vue");
  return _sfc_setup$1x ? _sfc_setup$1x(props, ctx) : void 0;
};
const __nuxt_component_5$4 = Object.assign(_sfc_main$1x, { __name: "APartners" });
const APartners = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$4
}, Symbol.toStringTag, { value: "Module" }));
const fallbackTitle$1 = "Собственные <br />производственные <br />мощности";
const _sfc_main$1w = /* @__PURE__ */ defineComponent({
  __name: "ProductionFacilities",
  __ssrInlineRender: true,
  props: {
    useApi: { type: Boolean, default: true }
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const fallbackDescList = [
      "Локация:<br />Производственная площадка трубного завода ПИК находится в г.&nbsp;Полевской, Свердловская&nbsp;область.",
      "Оборудование:<br /> Завод оснащён высокотехнологичными экструзионными и изоляционными линиями от KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Это позволяет обеспечивать стабильное качество продукции в промышленных объёмах.",
      "Номенклатура:<br />Производим полиэтиленовые трубы (ПНД) диаметром от 63 до 800 мм для водоснабжения, канализации и защиты кабеля. Изолируем стальные трубы диаметром до 1220 мм с применением пенополиуретановой (ППУ), полипропиленовой (ППМ) и антикоррозионной (ВУС) изоляции. Выпускаем фасонные изделия и многослойные гофрированные трубы под маркой<br />«ПИКПАЙП».",
      "Объёмы производства:<br />Годовая мощность достигает 15&nbsp;000 тонн продукции. Завод способен оперативно обрабатывать оптовые и индивидуальные заказы любой сложности.",
      "Контроль качества:<br />На базе предприятия работает собственная аккредитованная лаборатория. Полный цикл контроля охватывает входной анализ сырья, производственные параметры и испытания готовой продукции. Все изделия соответствуют требованиям ГОСТ и ТУ, имеют паспорта качества и маркировку.",
      "Преимущества:<br />— Производство полного цикла<br />— ПНД трубы и изоляция стальных труб в одном технологическом контуре<br />— Современное оборудование и высокая производительность<br />— Строгий контроль качества<br />— Широкая география поставок по всей России<br />— Надёжный партнёр для инженерных и инфраструктурных проектов"
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const mainTextImageData = props.useApi ? ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainTextImage",
      () => $fetch(`${config.app.baseURL}api/mainTextImage`)
    )), __temp = await __temp, __restore(), __temp) : { data: ref(null) };
    const mainSliderBottomData = props.useApi ? ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainSliderBottom",
      () => $fetch(
        `${config.app.baseURL}api/mainSliderBottom`
      )
    )), __temp = await __temp, __restore(), __temp) : { data: ref(null) };
    const fallbackSlides = [
      {
        type: "video",
        videoSrc: [
          { src: "/piktube/videos/production.webm", type: "video/webm" },
          { src: "/piktube/videos/production.mp4", type: "video/mp4" }
        ],
        poster: "/piktube/images/production-facilities-poster.webp"
      },
      {
        type: "image",
        src: "main/hero"
      }
    ];
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const normalizeNbsp = (value) => value.replace(/&nbsp;/g, " ");
    const splitByBr = (value) => normalizeNbsp(decodeHtml2(value)).split(/<br\s*\/?\s*>|\r?\n/i);
    const splitParagraphs = (value) => {
      const normalized = normalizeNbsp(decodeHtml2(value)).replace(
        /<\/?br\s*\/?>/gi,
        "\n"
      );
      return normalized.split(/\n\s*\n/).map((item2) => item2.trim()).filter(Boolean);
    };
    const item = computed(() => mainTextImageData.data.value?.data?.items?.[0]);
    const titleValue = computed(
      () => props.useApi && item.value?.NAME ? item.value.NAME : fallbackTitle$1
    );
    const descBlocks = computed(() => {
      if (props.useApi && item.value?.PREVIEW_TEXT) {
        return splitParagraphs(item.value.PREVIEW_TEXT);
      }
      return fallbackDescList;
    });
    const titleLines = computed(() => splitByBr(titleValue.value));
    const descLines = computed(() => descBlocks.value.map((text) => splitByBr(text)));
    const resolveMediaSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const imageSrc = computed(() => {
      if (!props.useApi) return "production-facilities";
      return resolveMediaSrc(item.value?.PREVIEW_PICTURE_SRC) || "production-facilities";
    });
    const isVideo = (src) => /\.(mp4|webm|ogv)$/i.test(src);
    const slides = computed(() => {
      if (!props.useApi) return fallbackSlides;
      const items = mainSliderBottomData.data.value?.data?.items || [];
      const mapped = [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item2) => {
        const rawSrc = item2.PROPERTIES?.VIDEO?.SRC || "";
        const resolved = resolveMediaSrc(rawSrc);
        if (!resolved) return null;
        if (isVideo(resolved)) {
          return {
            type: "video",
            videoSrc: [{ src: resolved }],
            poster: resolveMediaSrc(item2.PREVIEW_PICTURE_SRC) || void 0
          };
        }
        return {
          type: "image",
          src: resolved,
          alt: item2.NAME || ""
        };
      }).filter((slide) => Boolean(slide));
      return mapped.length ? mapped : fallbackSlides;
    });
    const isSlider = computed(() => slides.value.length > 1);
    const firstSlide = computed(() => slides.value[0]);
    const swiperContainer = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_Image = __nuxt_component_1$n;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_Video = __nuxt_component_4$9;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "production-facilities" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="production-facilities__container"${_scopeId}><div class="production-facilities__wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_custom_title, { class: "production-facilities__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(titleLines.value, (line, i) => {
                    _push3(`<!--[--><span class="production-facilities__title--line"${_scopeId2}>${ssrInterpolate(line)}</span>`);
                    if (i < titleLines.value.length - 1) {
                      _push3(`<br${_scopeId2}>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(titleLines.value, (line, i) => {
                      return openBlock(), createBlock(Fragment, {
                        key: `t-${i}`
                      }, [
                        createVNode("span", { class: "production-facilities__title--line" }, toDisplayString(line), 1),
                        i < titleLines.value.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                      ], 64);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="production-facilities__desc"${_scopeId}><!--[-->`);
            ssrRenderList(descLines.value, (lines, index2) => {
              _push2(ssrRenderComponent(_component_Text, { class: "production-facilities__desc--item" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(lines, (line, i) => {
                      _push3(`<!--[--><span${_scopeId2}>${ssrInterpolate(line)}</span>`);
                      if (i < lines.length - 1) {
                        _push3(`<br${_scopeId2}>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<!--]-->`);
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: `d-${index2}-${i}`
                        }, [
                          createVNode("span", null, toDisplayString(line), 1),
                          i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="production-facilities__img-wrap"${_scopeId}><div class="production-facilities__img"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Image, {
              class: "production-facilities__img--item",
              src: imageSrc.value,
              alt: "Завод"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="production-facilities__media"${_scopeId}>`);
            if (isSlider.value) {
              _push2(ssrRenderComponent(_component_BaseSwiper, {
                class: "production-facilities__swiper",
                "slides-per-view": 1,
                navigation: true,
                modificator: "production-facilities",
                "navigation-mode": "centered",
                loop: true,
                effect: "fade",
                "fade-effect": { crossFade: true },
                "is-buttons-reverse": true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(slides.value, (slide, index2) => {
                      _push3(ssrRenderComponent(unref(SwiperSlide), {
                        key: index2,
                        class: "production-facilities__slide"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="production-facilities__slide-content"${_scopeId3}>`);
                            if (slide.type === "video" && slide.videoSrc) {
                              _push4(ssrRenderComponent(_component_Video, {
                                class: "production-facilities__media--item",
                                src: slide.videoSrc,
                                poster: slide.poster,
                                controls: true
                              }, null, _parent4, _scopeId3));
                            } else if (slide.src) {
                              _push4(`<div class="production-facilities__media--item"${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_Image, {
                                class: "production-facilities__media--image",
                                src: slide.src,
                                alt: slide.alt || ""
                              }, null, _parent4, _scopeId3));
                              _push4(`</div>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div>`);
                          } else {
                            return [
                              createVNode("div", { class: "production-facilities__slide-content" }, [
                                slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                                  key: 0,
                                  class: "production-facilities__media--item",
                                  src: slide.videoSrc,
                                  poster: slide.poster,
                                  controls: true
                                }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "production-facilities__media--item"
                                }, [
                                  createVNode(_component_Image, {
                                    class: "production-facilities__media--image",
                                    src: slide.src,
                                    alt: slide.alt || ""
                                  }, null, 8, ["src", "alt"])
                                ])) : createCommentVNode("", true)
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(slides.value, (slide, index2) => {
                        return openBlock(), createBlock(unref(SwiperSlide), {
                          key: index2,
                          class: "production-facilities__slide"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "production-facilities__slide-content" }, [
                              slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                                key: 0,
                                class: "production-facilities__media--item",
                                src: slide.videoSrc,
                                poster: slide.poster,
                                controls: true
                              }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "production-facilities__media--item"
                              }, [
                                createVNode(_component_Image, {
                                  class: "production-facilities__media--image",
                                  src: slide.src,
                                  alt: slide.alt || ""
                                }, null, 8, ["src", "alt"])
                              ])) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (firstSlide.value) {
              _push2(`<div class="production-facilities__single"${_scopeId}>`);
              if (firstSlide.value.type === "video" && firstSlide.value.videoSrc) {
                _push2(ssrRenderComponent(_component_Video, {
                  class: "production-facilities__media--item",
                  src: firstSlide.value.videoSrc,
                  poster: firstSlide.value.poster,
                  controls: true
                }, null, _parent2, _scopeId));
              } else if (firstSlide.value.src) {
                _push2(`<div class="production-facilities__media--item"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Image, {
                  class: "production-facilities__media--image",
                  src: firstSlide.value.src,
                  alt: firstSlide.value.alt || ""
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "production-facilities__container" }, [
                createVNode("div", { class: "production-facilities__wrap" }, [
                  createVNode(_component_custom_title, { class: "production-facilities__title" }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(titleLines.value, (line, i) => {
                        return openBlock(), createBlock(Fragment, {
                          key: `t-${i}`
                        }, [
                          createVNode("span", { class: "production-facilities__title--line" }, toDisplayString(line), 1),
                          i < titleLines.value.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                        ], 64);
                      }), 128))
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "production-facilities__desc" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(descLines.value, (lines, index2) => {
                      return openBlock(), createBlock(_component_Text, {
                        key: index2,
                        class: "production-facilities__desc--item"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                            return openBlock(), createBlock(Fragment, {
                              key: `d-${index2}-${i}`
                            }, [
                              createVNode("span", null, toDisplayString(line), 1),
                              i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                            ], 64);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  createVNode("div", { class: "production-facilities__img-wrap" }, [
                    createVNode("div", { class: "production-facilities__img" }, [
                      createVNode(_component_Image, {
                        class: "production-facilities__img--item",
                        src: imageSrc.value,
                        alt: "Завод"
                      }, null, 8, ["src"])
                    ])
                  ])
                ]),
                createVNode("div", {
                  ref_key: "swiperContainer",
                  ref: swiperContainer,
                  class: "production-facilities__media"
                }, [
                  isSlider.value ? (openBlock(), createBlock(_component_BaseSwiper, {
                    key: 0,
                    class: "production-facilities__swiper",
                    "slides-per-view": 1,
                    navigation: true,
                    modificator: "production-facilities",
                    "navigation-mode": "centered",
                    loop: true,
                    effect: "fade",
                    "fade-effect": { crossFade: true },
                    "is-buttons-reverse": true
                  }, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(slides.value, (slide, index2) => {
                        return openBlock(), createBlock(unref(SwiperSlide), {
                          key: index2,
                          class: "production-facilities__slide"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "production-facilities__slide-content" }, [
                              slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                                key: 0,
                                class: "production-facilities__media--item",
                                src: slide.videoSrc,
                                poster: slide.poster,
                                controls: true
                              }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "production-facilities__media--item"
                              }, [
                                createVNode(_component_Image, {
                                  class: "production-facilities__media--image",
                                  src: slide.src,
                                  alt: slide.alt || ""
                                }, null, 8, ["src", "alt"])
                              ])) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ]),
                    _: 1
                  })) : firstSlide.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "production-facilities__single"
                  }, [
                    firstSlide.value.type === "video" && firstSlide.value.videoSrc ? (openBlock(), createBlock(_component_Video, {
                      key: 0,
                      class: "production-facilities__media--item",
                      src: firstSlide.value.videoSrc,
                      poster: firstSlide.value.poster,
                      controls: true
                    }, null, 8, ["src", "poster"])) : firstSlide.value.src ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "production-facilities__media--item"
                    }, [
                      createVNode(_component_Image, {
                        class: "production-facilities__media--image",
                        src: firstSlide.value.src,
                        alt: firstSlide.value.alt || ""
                      }, null, 8, ["src", "alt"])
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ], 512)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1w = _sfc_main$1w.setup;
_sfc_main$1w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ProductionFacilities.vue");
  return _sfc_setup$1w ? _sfc_setup$1w(props, ctx) : void 0;
};
const __nuxt_component_5$3 = Object.assign(_sfc_main$1w, { __name: "ProductionFacilities" });
const ProductionFacilities = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1v = /* @__PURE__ */ defineComponent({
  __name: "SupplyBlock",
  __ssrInlineRender: true,
  setup(__props) {
    ref(/* @__PURE__ */ new Set());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$k;
      resolveDirective("click-away");
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$1v = _sfc_main$1v.setup;
_sfc_main$1v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/SupplyBlock.vue");
  return _sfc_setup$1v ? _sfc_setup$1v(props, ctx) : void 0;
};
const __nuxt_component_6$2 = Object.assign(_sfc_main$1v, { __name: "SupplyBlock" });
const SupplyBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_6$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1u = /* @__PURE__ */ defineComponent({
  __name: "NewsCard",
  __ssrInlineRender: true,
  props: {
    image: {},
    date: {},
    title: {},
    text: {},
    href: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$h;
      const _component_border_line = __nuxt_component_2$n;
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      const _component_CustomTitle = __nuxt_component_0$j;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "news-card" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "news-card__link",
        to: props.href
      }, null, _parent));
      _push(`<div class="news-card__top">`);
      _push(ssrRenderComponent(_component_border_line, {
        position: "bottom",
        design: "main"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="news-card__img"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Image, mergeProps({ class: "news-card__img--item" }, props.image), null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "news-card__img" }, [
                createVNode(_component_Image, mergeProps({ class: "news-card__img--item" }, props.image), null, 16)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "news-card__date",
        "line-height": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.date)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.date), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="news-card__content">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "news-card__title",
        tag: "p",
        mode: "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, { class: "news-card__desc" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.text), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1u = _sfc_main$1u.setup;
_sfc_main$1u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/NewsCard.vue");
  return _sfc_setup$1u ? _sfc_setup$1u(props, ctx) : void 0;
};
const __nuxt_component_0$7 = Object.assign(_sfc_main$1u, { __name: "NewsCard" });
const NewsCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1t = /* @__PURE__ */ defineComponent({
  __name: "NewsSlider",
  __ssrInlineRender: true,
  props: {
    slides: {}
  },
  setup(__props) {
    const props = __props;
    const isDesktop = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_NewsCard = __nuxt_component_0$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "news-slider" }, _attrs))}>`);
      if (!isDesktop.value) {
        _push(ssrRenderComponent(_component_BaseSwiper, {
          class: "news-slider__swiper",
          modificator: "news",
          "slides-per-view": "auto",
          "space-between": 10,
          navigation: false,
          breakpoints: { 1024: { loop: false } }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(props.slides, (slide, index2) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: index2,
                  class: "news-slider__slide"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_NewsCard, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_NewsCard, mergeProps({ ref_for: true }, slide), null, 16)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(props.slides, (slide, index2) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: index2,
                    class: "news-slider__slide"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_NewsCard, mergeProps({ ref_for: true }, slide), null, 16)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="news-slider__grid"><!--[-->`);
        ssrRenderList(props.slides, (slide, index2) => {
          _push(ssrRenderComponent(_component_NewsCard, mergeProps({ key: index2 }, { ref_for: true }, slide, { class: "news-slider__card" }), null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1t = _sfc_main$1t.setup;
_sfc_main$1t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/NewsSlider.vue");
  return _sfc_setup$1t ? _sfc_setup$1t(props, ctx) : void 0;
};
const __nuxt_component_3$a = Object.assign(_sfc_main$1t, { __name: "NewsSlider" });
const NewsSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$a
}, Symbol.toStringTag, { value: "Module" }));
const title = "Новости";
const _sfc_main$1s = /* @__PURE__ */ defineComponent({
  __name: "NewsBlock",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackSlides = [
      {
        image: {
          src: "news/news-01",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-02",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-03",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-04",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: newsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "newsList",
      () => $fetch(`${config.app.baseURL}api/news`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const slides = computed(() => {
      const items = newsData.value?.data?.items;
      if (!items || items.length === 0) return fallbackSlides;
      return items.slice(0, 4).map((item) => ({
        image: {
          src: resolveImageSrc2(item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        date: item.DATE_ACTIVE_FROM,
        title: item.NAME,
        text: decodeHtml2(item.PREVIEW_TEXT),
        href: `/news/${item.CODE}`
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_SectionWrapper = __nuxt_component_1$l;
      const _component_NewsSlider = __nuxt_component_3$a;
      const _component_NuxtLink = __nuxt_component_0$h;
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "news-block" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "news-block__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "news-block__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(title))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, { class: "news-block__title" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(title))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="news-block__wrapper">`);
      _push(ssrRenderComponent(_component_SectionWrapper, {
        class: "news-block__content",
        title: "Последнее",
        tag: "h3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NewsSlider, { slides: unref(slides) }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NewsSlider, { slides: unref(slides) }, null, 8, ["slides"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "news-block__action",
        to: "/news"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Text, {
              class: "news-block__action--title",
              tag: "span",
              weight: "medium",
              "line-height": "sm",
              design: "secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Читать все новости `);
                } else {
                  return [
                    createTextVNode(" Читать все новости ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Icon, {
              class: "news-block__action--icon",
              name: "base-arrow"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Text, {
                class: "news-block__action--title",
                tag: "span",
                weight: "medium",
                "line-height": "sm",
                design: "secondary"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Читать все новости ")
                ]),
                _: 1
              }),
              createVNode(_component_Icon, {
                class: "news-block__action--icon",
                name: "base-arrow"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1s = _sfc_main$1s.setup;
_sfc_main$1s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/NewsBlock.vue");
  return _sfc_setup$1s ? _sfc_setup$1s(props, ctx) : void 0;
};
const __nuxt_component_7$1 = Object.assign(_sfc_main$1s, { __name: "NewsBlock" });
const NewsBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_7$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1r = {};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs) {
  const _component_Modal = __nuxt_component_0$b;
  const _component_Text = __nuxt_component_4$b;
  const _component_CloseButton = __nuxt_component_1$g;
  _push(ssrRenderComponent(_component_Modal, mergeProps({
    class: "experience-card-modal",
    name: "experience-card-modal",
    mode: "center"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="experience-card-modal__container"${_scopeId}><div class="experience-card-modal__top"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "experience-card-modal__top--title",
          uppercase: true,
          "line-height": "xs",
          "letter-spacing": "sm",
          design: "primary"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Инновации`);
            } else {
              return [
                createTextVNode("Инновации")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_CloseButton, {
          class: "experience-card-modal__close",
          "is-modal-closer": "",
          name: "experience-card-modal"
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="experience-card-modal__content"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "experience-card-modal__content--desc",
          size: "sm",
          "line-height": "lg",
          "letter-spacing": "sm"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.`);
            } else {
              return [
                createTextVNode("Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div></div>`);
      } else {
        return [
          createVNode("div", { class: "experience-card-modal__container" }, [
            createVNode("div", { class: "experience-card-modal__top" }, [
              createVNode(_component_Text, {
                class: "experience-card-modal__top--title",
                uppercase: true,
                "line-height": "xs",
                "letter-spacing": "sm",
                design: "primary"
              }, {
                default: withCtx(() => [
                  createTextVNode("Инновации")
                ]),
                _: 1
              }),
              createVNode(_component_CloseButton, {
                class: "experience-card-modal__close",
                "is-modal-closer": "",
                name: "experience-card-modal"
              })
            ]),
            createVNode("div", { class: "experience-card-modal__content" }, [
              createVNode(_component_Text, {
                class: "experience-card-modal__content--desc",
                size: "sm",
                "line-height": "lg",
                "letter-spacing": "sm"
              }, {
                default: withCtx(() => [
                  createTextVNode("Завод оснащён оборудованием ведущих мировых производителей: KraussMaffei, Battenfeld-Cincinnati (Германия), Zhongyun Machinery. Использование современных экструзионных линий и автоматизированных систем управления позволяет выпускать трубы диаметром от 63 до 1220 мм в различных исполнениях и с разнообразными типами изоляции (ППУ, ППМ, ВУС). Производственные мощности предприятия достигают 15 000 тонн готовой продукции в год. Это обеспечивает высокую скорость выполнения заказов и устойчивую поставку трубной продукции на объекты различного масштаба.")
                ]),
                _: 1
              })
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1r = _sfc_main$1r.setup;
_sfc_main$1r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/ExperienceCardModal.vue");
  return _sfc_setup$1r ? _sfc_setup$1r(props, ctx) : void 0;
};
const __nuxt_component_11 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1r, [["ssrRender", _sfc_ssrRender$9]]), { __name: "ExperienceCardModal" });
const ExperienceCardModal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_11
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1q = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "О компании", href: "/about" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroVideo = __nuxt_component_4$8;
      const _component_Advantages = __nuxt_component_1$d;
      const _component_AManufacture = __nuxt_component_3$b;
      const _component_AExperience = __nuxt_component_4$5;
      const _component_APartners = __nuxt_component_5$4;
      const _component_ProductionFacilities = __nuxt_component_5$3;
      const _component_LabBlock = __nuxt_component_7$2;
      const _component_SupplyBlock = __nuxt_component_6$2;
      const _component_NewsBlock = __nuxt_component_7$1;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_ExperienceCardModal = __nuxt_component_11;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_HeroVideo, null, null, _parent));
      _push(ssrRenderComponent(_component_Advantages, null, null, _parent));
      _push(ssrRenderComponent(_component_AManufacture, null, null, _parent));
      _push(ssrRenderComponent(_component_AExperience, null, null, _parent));
      _push(ssrRenderComponent(_component_APartners, null, null, _parent));
      _push(ssrRenderComponent(_component_ProductionFacilities, { "use-api": false }, null, _parent));
      _push(ssrRenderComponent(_component_LabBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_SupplyBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_NewsBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_ExperienceCardModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1q = _sfc_main$1q.setup;
_sfc_main$1q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup$1q ? _sfc_setup$1q(props, ctx) : void 0;
};
const about = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1q
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1p = /* @__PURE__ */ defineComponent({
  __name: "MainHeroSlide",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    image: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Image = __nuxt_component_1$n;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "main-hero-slide" }, _attrs))}><div class="main-hero-slide__content">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "main-hero-slide__title",
        "line-height": "sm",
        "letter-spacing": "sm",
        design: "accent",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "main-hero-slide__description",
        size: "sm",
        "line-height": "md",
        "letter-spacing": "sm",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.description)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.description), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Image, mergeProps({ class: "main-hero-slide__img" }, _ctx.image), null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1p = _sfc_main$1p.setup;
_sfc_main$1p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/MainHeroSlide.vue");
  return _sfc_setup$1p ? _sfc_setup$1p(props, ctx) : void 0;
};
const __nuxt_component_1$a = Object.assign(_sfc_main$1p, { __name: "MainHeroSlide" });
const MainHeroSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1o = /* @__PURE__ */ defineComponent({
  __name: "MHero",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackSlides = [
      {
        title: "Новая продукция",
        description: "Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.",
        image: {
          src: "main/hero"
        }
      },
      {
        title: "Новая продукция",
        description: "Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.",
        image: {
          src: "production-facilities-poster"
        }
      },
      {
        title: "Новая продукция",
        description: "Полиэтиленовые трубы, Фасонные изделия в изоляции, Стальные трубы в изоляции и трубы для Водоснабжения и Водоотведения.",
        image: {
          src: "main/hero"
        }
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: mainBannerData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainBanner",
      () => $fetch(`${config.app.baseURL}api/mainBanner`)
    )), __temp = await __temp, __restore(), __temp);
    const resolveBannerSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const slides = computed(() => {
      const items = mainBannerData.value?.data?.items;
      if (!items || items.length === 0) return fallbackSlides;
      return items.map((item) => ({
        title: item.NAME,
        description: item.PREVIEW_TEXT,
        image: {
          src: resolveBannerSrc(item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        }
      }));
    });
    const heroRef = ref(null);
    const scaleProgress = ref(0);
    const initialHeight = ref(0);
    ref(false);
    const heroStyle = computed(() => {
      if (initialHeight.value === 0) return {};
      const heightScale = 1 - scaleProgress.value * (1 / 4);
      const currentHeight = initialHeight.value * heightScale;
      return {
        height: `${currentHeight}px`
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_MainHeroSlide = __nuxt_component_1$a;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "heroRef",
        ref: heroRef,
        class: "m-hero",
        style: unref(heroStyle)
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: "m-hero__swiper",
        "slides-per-view": 1,
        navigation: {
          nextEl: ".m-hero__nav-next",
          prevEl: ".m-hero__nav-prev"
        },
        pagination: {
          el: ".m-hero__pagination",
          clickable: true,
          renderBullet: (index2, className) => {
            return `<span class='${className}'></span>`;
          }
        },
        "show-navigation-with-pagination": false,
        effect: "fade",
        "fade-effect": { crossFade: true },
        loop: true,
        speed: 600
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(slides), (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                key: index2,
                class: "m-hero__slide"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_MainHeroSlide, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_MainHeroSlide, mergeProps({ ref_for: true }, slide), null, 16)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(slides), (slide, index2) => {
                return openBlock(), createBlock(unref(SwiperSlide), {
                  key: index2,
                  class: "m-hero__slide"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_MainHeroSlide, mergeProps({ ref_for: true }, slide), null, 16)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="m-hero__controls">`);
      _push(ssrRenderComponent(_component_Button, {
        class: "m-hero__nav-btn m-hero__nav-prev",
        icon: { name: "button-arrow-reverse", mode: "prev" }
      }, null, _parent));
      _push(`<div class="m-hero__pagination"></div>`);
      _push(ssrRenderComponent(_component_Button, {
        class: "m-hero__nav-btn m-hero__nav-next",
        icon: { name: "button-arrow-reverse", mode: "next" }
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1o = _sfc_main$1o.setup;
_sfc_main$1o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/main/MHero.vue");
  return _sfc_setup$1o ? _sfc_setup$1o(props, ctx) : void 0;
};
const __nuxt_component_0$6 = Object.assign(_sfc_main$1o, { __name: "MHero" });
const MHero = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1n = /* @__PURE__ */ defineComponent({
  __name: "ServiceCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    href: {},
    links: {}
  },
  setup(__props) {
    const props = __props;
    const isExpanded = ref(false);
    const hasLinks = computed(() => (props.links || []).length > 0);
    const hrefValue = computed(() => props.href && props.href.length > 0 ? props.href : void 0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: ["service-card", { "service-card--expanded": isExpanded.value && unref(hasLinks) }],
        href: unref(hasLinks) ? void 0 : unref(hrefValue)
      }, _attrs))}>`);
      if (!isExpanded.value || !unref(hasLinks)) {
        _push(`<div class="service-card__content">`);
        _push(ssrRenderComponent(_component_Icon, mergeProps({ class: "service-card__image" }, props.icon), null, _parent));
        _push(`<div class="service-card__title"><!--[-->`);
        ssrRenderList(props.title, (item, index2) => {
          _push(ssrRenderComponent(_component_Text, {
            key: index2,
            class: "service-card__title",
            tag: "span",
            size: "xxl",
            design: "accent",
            "line-height": "sm",
            weight: "medium",
            uppercase: true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item)}<br${_scopeId}>`);
              } else {
                return [
                  createTextVNode(toDisplayString(item), 1),
                  createVNode("br")
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="service-card__water-supply"><div class="service-card__water-supply--inner"><!--[-->`);
        ssrRenderList(props.links, (link, index2) => {
          _push(`<!--[--><a class="service-card__water-link"${ssrRenderAttr("href", link.href)}>`);
          _push(ssrRenderComponent(_component_Text, {
            tag: "span",
            size: "xxl",
            design: "accent",
            "line-height": "sm",
            weight: "medium",
            uppercase: true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(link.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(link.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</a>`);
          if (index2 < (props.links?.length || 0) - 1) {
            _push(`<div class="service-card__divider"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(ssrRenderComponent(_component_Icon, {
        class: "service-card__icon",
        name: "base-arrow"
      }, null, _parent));
      _push(`</a>`);
    };
  }
});
const _sfc_setup$1n = _sfc_main$1n.setup;
_sfc_main$1n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/ServiceCard.vue");
  return _sfc_setup$1n ? _sfc_setup$1n(props, ctx) : void 0;
};
const __nuxt_component_3$9 = Object.assign(_sfc_main$1n, { __name: "ServiceCard" });
const ServiceCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1m = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    image: {},
    title: {},
    href: {},
    mode: {}
  },
  setup(__props) {
    const props = __props;
    const imgClasses = computed(() => {
      return ["product-card__img", `product-card__img_${props.mode}`];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "product-card",
        href: props.href
      }, _attrs))}><div class="${ssrRenderClass(unref(imgClasses))}">`);
      _push(ssrRenderComponent(_component_Image, mergeProps({ class: "product-card__img--item" }, props.image), null, _parent));
      _push(`</div><div class="product-card__content">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "product-card__content--title",
        size: "xxl",
        weight: "medium",
        "line-height": "sm",
        design: "primary",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        class: "product-card__content--icon",
        name: "base-arrow"
      }, null, _parent));
      _push(`</div></a>`);
    };
  }
});
const _sfc_setup$1m = _sfc_main$1m.setup;
_sfc_main$1m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/ProductCard.vue");
  return _sfc_setup$1m ? _sfc_setup$1m(props, ctx) : void 0;
};
const __nuxt_component_3$8 = Object.assign(_sfc_main$1m, { __name: "ProductCard" });
const ProductCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$8
}, Symbol.toStringTag, { value: "Module" }));
const resolveSectionCode = (section) => {
  if (!section) return "";
  return section.CODE || section["~CODE"] || "";
};
const normalizePathSegments = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
};
const resolvePathNodes = (tree, segments) => {
  const nodes = [];
  let currentLevel = tree;
  for (const segment of segments) {
    const match = currentLevel.find((node) => {
      return resolveSectionCode(node.SECTION) === segment;
    });
    if (!match) break;
    nodes.push(match);
    currentLevel = match.CHILDREN || [];
  }
  return nodes;
};
const findSectionByPath = (tree, segments) => {
  const nodes = resolvePathNodes(tree, segments);
  if (nodes.length !== segments.length) return null;
  return nodes[nodes.length - 1] || null;
};
const decodeHtml = (value) => {
  return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
};
const resolveImageSrc = (origin, src) => {
  if (!src) return "";
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/")) return `${origin}${src}`;
  return src;
};
const chunkArray = (items, size) => {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};
const parseSort = (value) => {
  if (value === void 0 || value === null) return Number.POSITIVE_INFINITY;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};
const collectListPageProperties = (items) => {
  const map = /* @__PURE__ */ new Map();
  for (const item of items) {
    const props = item.PROPERTIES || {};
    for (const [key, prop] of Object.entries(props)) {
      if (prop?.LIST_PAGE_SHOW !== "Y") continue;
      const code = prop.CODE || key;
      if (!code) continue;
      if (!map.has(code)) {
        map.set(code, {
          code,
          name: prop.NAME || code,
          sort: parseSort(prop.SORT)
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.sort - b.sort);
};
const mapListPageValues = (props, order) => {
  return order.map((item) => {
    const value = props?.[item.code]?.VALUE;
    return value === void 0 || value === null || value === "" ? "" : String(value);
  });
};
const normalizeValue = (value) => value.trim();
const tryParseNumber = (value) => {
  const normalized = value.replace(",", ".");
  const num = Number(normalized);
  return Number.isNaN(num) ? null : num;
};
const mapListPageAggregates = (items, order) => {
  return order.map((prop) => {
    const values = /* @__PURE__ */ new Set();
    for (const item of items) {
      const raw = item.PROPERTIES?.[prop.code]?.VALUE;
      if (raw === void 0 || raw === null || raw === "") continue;
      values.add(normalizeValue(String(raw)));
    }
    const list = Array.from(values);
    if (list.length === 0) return "";
    const nums = list.map(tryParseNumber);
    if (nums.every((num) => num !== null)) {
      const numeric = nums;
      const min = Math.min(...numeric);
      const max = Math.max(...numeric);
      return min === max ? String(min) : `${min}–${max}`;
    }
    return list.join(", ");
  });
};
const _sfc_main$1l = /* @__PURE__ */ defineComponent({
  __name: "ProductCatalog",
  __ssrInlineRender: true,
  props: {
    isBorder: { type: Boolean }
  },
  async setup(__props) {
    let __temp, __restore;
    const fallbackServicesList = [
      {
        icon: {
          name: "water-supply",
          isSprite: false
        },
        title: ["Водоснабжение"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "water-drainage",
          isSprite: false
        },
        title: ["Водоотведение"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "gas-distribution",
          isSprite: false
        },
        title: ["Газораспределение"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "cable-protection",
          isSprite: false
        },
        title: ["Защита кабеля"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "oil-isolation",
          isSprite: false
        },
        title: ["Изоляция ", "в нефтегазовой ", "отрасли"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "pipes-isolation",
          isSprite: false
        },
        title: ["Стальные трубы ", "в изоляции"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "pipes",
          isSprite: false
        },
        title: ["Полиэтиленовые ", "трубы"],
        href: "/piktube/catalog"
      },
      {
        icon: {
          name: "shaped-products-isolation",
          isSprite: false
        },
        title: ["Фасонные изделия ", "в изоляции"],
        href: "/piktube/catalog"
      }
    ];
    const productsList = [
      {
        image: {
          src: "production/production-01",
          alt: "Трубы ПНД"
        },
        title: "Трубы ПНД",
        href: "/piktube/catalog",
        mode: "1"
      },
      {
        image: {
          src: "production/production-02",
          alt: "Гофрированные трубы"
        },
        title: "Гофрированные трубы",
        href: "/piktube/catalog",
        mode: "2"
      },
      {
        image: {
          src: "production/production-03",
          alt: "Газовые трубы ПНД"
        },
        title: "Газовые трубы ПНД",
        href: "/piktube/catalog",
        mode: "3"
      },
      {
        image: {
          src: "production/production-04",
          alt: "ППМ трубы"
        },
        title: "ППМ трубы",
        href: "/piktube/catalog",
        mode: "4"
      },
      {
        image: {
          src: "production/production-05",
          alt: "ППУ трубы"
        },
        title: "ППУ трубы",
        href: "/piktube/catalog",
        mode: "5"
      },
      {
        image: {
          src: "production/production-06",
          alt: "Трубы для защиты кабеля"
        },
        title: "Трубы для защиты кабеля",
        href: "/piktube/catalog",
        mode: "6"
      },
      {
        image: {
          src: "production/production-07",
          alt: "PE-RT"
        },
        title: "PE-RT",
        href: "/piktube/catalog",
        mode: "7"
      },
      {
        image: {
          src: "production/production-08",
          alt: "Фитинги"
        },
        title: "Фитинги",
        href: "/piktube/catalog",
        mode: "8"
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: productsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsCatalog",
      () => $fetch(`${config.app.baseURL}api/products`)
    )), __temp = await __temp, __restore(), __temp);
    const makeSectionHref = (section, path) => {
      const base = "catalog";
      const suffix = path.length ? `/${path.join("/")}` : "";
      return `${config.app.baseURL}${base}${suffix}`;
    };
    const buildChildLinks = (node, path) => {
      const children = node.CHILDREN || [];
      return children.map((child) => {
        const code = resolveSectionCode(child.SECTION);
        if (!code) return null;
        const childPath = [...path, code];
        return {
          title: child.SECTION.NAME,
          href: makeSectionHref(child, childPath)
        };
      }).filter(Boolean);
    };
    const flattenSections = (nodes, parentPath = [], depth = 1) => {
      return nodes.flatMap((node) => {
        const code = resolveSectionCode(node.SECTION);
        if (!code) return [];
        const path = [...parentPath, code];
        const current = [{ node, path, depth }];
        const children = node.CHILDREN ? flattenSections(node.CHILDREN, path, depth + 1) : [];
        return current.concat(children);
      });
    };
    const sectionsFlat = computed(() => {
      const tree = productsData.value?.data?.TREE || [];
      return flattenSections(tree);
    });
    const servicesList = computed(() => {
      const top = sectionsFlat.value.filter((entry2) => entry2.depth === 1);
      if (top.length === 0) return [];
      const icons = fallbackServicesList.map((item) => item.icon);
      return top.map((entry2, index2) => ({
        icon: icons[index2] || { name: "pipes", isSprite: false },
        title: [entry2.node.SECTION.NAME],
        href: entry2.node.SECTION.UF_TYPE_ELEMENT ? makeSectionHref(entry2.node, entry2.path) : "",
        links: buildChildLinks(entry2.node, entry2.path)
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_SectionWrapper = __nuxt_component_1$l;
      const _component_ServiceCard = __nuxt_component_3$9;
      const _component_ProductCard = __nuxt_component_3$8;
      const _component_BorderLine = __nuxt_component_2$n;
      if (!_ctx.isBorder) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "product-catalog" }, _attrs))}><div class="container"><div class="product-catalog__container">`);
        _push(ssrRenderComponent(_component_CustomTitle, {
          class: "product-catalog__title",
          tag: "h1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Каталог продукции `);
            } else {
              return [
                createTextVNode(" Каталог продукции ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="product-catalog__wrap">`);
        _push(ssrRenderComponent(_component_SectionWrapper, {
          class: "product-catalog__solutions",
          title: "Отраслевые решения"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="product-catalog__solutions--list"${_scopeId}><!--[-->`);
              ssrRenderList(unref(servicesList), (item, index2) => {
                _push2(ssrRenderComponent(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "product-catalog__solutions--list" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(servicesList), (item, index2) => {
                    return openBlock(), createBlock(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_SectionWrapper, {
          class: "product-catalog__products",
          title: "Наша продукция"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="product-catalog__products--list"${_scopeId}><!--[-->`);
              ssrRenderList(productsList, (item, index2) => {
                _push2(ssrRenderComponent(_component_ProductCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "product-catalog__products--list" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(productsList, (item, index2) => {
                    return createVNode(_component_ProductCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                  }), 64))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></section>`);
      } else {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "product-catalog" }, _attrs))}><div class="container">`);
        _push(ssrRenderComponent(_component_BorderLine, {
          class: "product-catalog__container",
          position: "top",
          design: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_CustomTitle, {
                class: "product-catalog__title",
                tag: "h1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Каталог продукции `);
                  } else {
                    return [
                      createTextVNode(" Каталог продукции ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="product-catalog__wrap"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_SectionWrapper, {
                class: "product-catalog__solutions",
                title: "Отраслевые решения"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="product-catalog__solutions--list"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(servicesList), (item, index2) => {
                      _push3(ssrRenderComponent(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "product-catalog__solutions--list" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(servicesList), (item, index2) => {
                          return openBlock(), createBlock(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                        }), 128))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_SectionWrapper, {
                class: "product-catalog__products",
                title: "Наша продукция"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="product-catalog__products--list"${_scopeId2}><!--[-->`);
                    ssrRenderList(productsList, (item, index2) => {
                      _push3(ssrRenderComponent(_component_ProductCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent3, _scopeId2));
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "product-catalog__products--list" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(productsList, (item, index2) => {
                          return createVNode(_component_ProductCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                        }), 64))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode(_component_CustomTitle, {
                  class: "product-catalog__title",
                  tag: "h1"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Каталог продукции ")
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "product-catalog__wrap" }, [
                  createVNode(_component_SectionWrapper, {
                    class: "product-catalog__solutions",
                    title: "Отраслевые решения"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "product-catalog__solutions--list" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(servicesList), (item, index2) => {
                          return openBlock(), createBlock(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                        }), 128))
                      ])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_SectionWrapper, {
                    class: "product-catalog__products",
                    title: "Наша продукция"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "product-catalog__products--list" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(productsList, (item, index2) => {
                          return createVNode(_component_ProductCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                        }), 64))
                      ])
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></section>`);
      }
    };
  }
});
const _sfc_setup$1l = _sfc_main$1l.setup;
_sfc_main$1l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ProductCatalog.vue");
  return _sfc_setup$1l ? _sfc_setup$1l(props, ctx) : void 0;
};
const __nuxt_component_1$9 = Object.assign(_sfc_main$1l, { __name: "ProductCatalog" });
const ProductCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1k = /* @__PURE__ */ defineComponent({
  __name: "ServiceCatalog",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackServicesList = [
      {
        icon: {
          name: "oflantsovka",
          isSprite: false
        },
        title: ["Офланцовка"],
        href: "/piktube/services"
      },
      {
        icon: {
          name: "polyurethane-isolation",
          isSprite: false
        },
        title: ["Нанесение ППУ ", "изоляции"],
        href: "/piktube/services"
      },
      {
        icon: {
          name: "pipes-isolation",
          isSprite: false
        },
        title: ["Нанесение ППМ ", "изоляции"],
        href: "/piktube/services"
      },
      {
        icon: {
          name: "oil-isolation",
          isSprite: false
        },
        title: ["Изоляция ", "в нефтегазовой ", "отрасли"],
        href: "/piktube/services"
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: servicesData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "servicesCatalogHome",
      () => $fetch(`${config.app.baseURL}api/services`)
    )), __temp = await __temp, __restore(), __temp);
    const servicesList = computed(() => {
      const tree = servicesData.value?.data?.TREE;
      if (!tree || tree.length === 0) return fallbackServicesList;
      const icons = fallbackServicesList.map((item) => item.icon);
      return tree.map((section, index2) => {
        const code = section.SECTION.CODE || section.SECTION["~CODE"] || "";
        if (!code) return null;
        return {
          icon: icons[index2] || { name: "pipes", isSprite: false },
          title: [section.SECTION.NAME],
          href: `${config.app.baseURL}services/${code}`
        };
      }).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_SectionWrapper = __nuxt_component_1$l;
      const _component_ServiceCard = __nuxt_component_3$9;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "service-catalog" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "service-catalog__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "service-catalog__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Услуги `);
                } else {
                  return [
                    createTextVNode(" Услуги ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="service-catalog__wrap"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_SectionWrapper, {
              class: "service-catalog__services",
              title: "Категории услуг",
              tag: "h3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="service-catalog__services--list"${_scopeId2}><!--[-->`);
                  ssrRenderList(unref(servicesList), (item, index2) => {
                    _push3(ssrRenderComponent(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent3, _scopeId2));
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", { class: "service-catalog__services--list" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(servicesList), (item, index2) => {
                        return openBlock(), createBlock(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_CustomTitle, { class: "service-catalog__title" }, {
                default: withCtx(() => [
                  createTextVNode(" Услуги ")
                ]),
                _: 1
              }),
              createVNode("div", { class: "service-catalog__wrap" }, [
                createVNode(_component_SectionWrapper, {
                  class: "service-catalog__services",
                  title: "Категории услуг",
                  tag: "h3"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "service-catalog__services--list" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(servicesList), (item, index2) => {
                        return openBlock(), createBlock(_component_ServiceCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, 16);
                      }), 128))
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1k = _sfc_main$1k.setup;
_sfc_main$1k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ServiceCatalog.vue");
  return _sfc_setup$1k ? _sfc_setup$1k(props, ctx) : void 0;
};
const __nuxt_component_3$7 = Object.assign(_sfc_main$1k, { __name: "ServiceCatalog" });
const ServiceCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1j = /* @__PURE__ */ defineComponent({
  __name: "MAbout",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: aboutCompanyData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainAboutCompany",
      () => $fetch(`${config.app.baseURL}api/mainAboutCompany`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: trustData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "mainTrust",
      () => $fetch(`${config.app.baseURL}api/mainTrust`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const splitParagraphs = (value) => {
      if (!value) return [];
      const normalized = decodeHtml2(value).replace(/<\/?br\s*\/?>/gi, "\n");
      return normalized.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    };
    const resolveHref = (url) => {
      if (!url) return "#";
      if (/^https?:\/\//.test(url)) return url;
      const base = config.app.baseURL.replace(/\/$/, "");
      return url.startsWith("/") ? `${base}${url}` : url;
    };
    const resolveMediaSrc = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const aboutItem = computed(() => aboutCompanyData.value?.data?.items?.[0]);
    const aboutTitle = computed(() => aboutItem.value?.NAME || "О компании");
    const aboutTexts = computed(
      () => splitParagraphs(aboutItem.value?.PREVIEW_TEXT)
    );
    const firstButtonText = computed(
      () => aboutItem.value?.PROPERTIES?.FIRST_BUTTON_TEXT?.VALUE
    );
    const firstButtonUrl = computed(
      () => aboutItem.value?.PROPERTIES?.FIRST_BUTTON_URL?.VALUE
    );
    const secondButtonText = computed(
      () => aboutItem.value?.PROPERTIES?.TWO_BUTTON_TEXT?.VALUE
    );
    const secondButtonUrl = computed(
      () => aboutItem.value?.PROPERTIES?.TWO_BUTTON_URL?.VALUE
    );
    const trustTitle = computed(
      () => trustData.value?.meta?.iblock?.name || "Нам доверяют"
    );
    const trustSlides = computed(() => {
      const items = trustData.value?.data?.items || [];
      return [...items].sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => ({
        title: item.NAME || "",
        icon: {
          name: item.NAME || "partner",
          isSprite: false,
          src: resolveMediaSrc(item.PREVIEW_PICTURE_SRC)
        }
      })).filter((item) => item.title && item.icon.src);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      const _component_PartnersSlider = __nuxt_component_4$4;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "m-about" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "m-about__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="m-about__content"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "m-about__content--title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(aboutTitle))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(aboutTitle)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="m-about__content--desc"${_scopeId}><!--[-->`);
            ssrRenderList(unref(aboutTexts), (item, index2) => {
              _push2(ssrRenderComponent(_component_Text, { key: index2 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="m-about__content--btns-wrap"${_scopeId}><div class="m-about__content--btns"${_scopeId}>`);
            if (unref(firstButtonText) && unref(firstButtonUrl)) {
              _push2(ssrRenderComponent(_component_Button, {
                class: "m-about__content--btn",
                text: unref(firstButtonText),
                href: resolveHref(unref(firstButtonUrl)),
                size: "lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(secondButtonText) && unref(secondButtonUrl)) {
              _push2(ssrRenderComponent(_component_Button, {
                class: "m-about__content--btn",
                text: unref(secondButtonText),
                href: resolveHref(unref(secondButtonUrl)),
                size: "lg"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="m-about__slider"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_PartnersSlider, {
              title: unref(trustTitle),
              list: unref(trustSlides)
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "m-about__content" }, [
                createVNode(_component_CustomTitle, { class: "m-about__content--title" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(aboutTitle)), 1)
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "m-about__content--desc" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(aboutTexts), (item, index2) => {
                    return openBlock(), createBlock(_component_Text, { key: index2 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                createVNode("div", { class: "m-about__content--btns-wrap" }, [
                  createVNode("div", { class: "m-about__content--btns" }, [
                    unref(firstButtonText) && unref(firstButtonUrl) ? (openBlock(), createBlock(_component_Button, {
                      key: 0,
                      class: "m-about__content--btn",
                      text: unref(firstButtonText),
                      href: resolveHref(unref(firstButtonUrl)),
                      size: "lg"
                    }, null, 8, ["text", "href"])) : createCommentVNode("", true),
                    unref(secondButtonText) && unref(secondButtonUrl) ? (openBlock(), createBlock(_component_Button, {
                      key: 1,
                      class: "m-about__content--btn",
                      text: unref(secondButtonText),
                      href: resolveHref(unref(secondButtonUrl)),
                      size: "lg"
                    }, null, 8, ["text", "href"])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createVNode("div", { class: "m-about__slider" }, [
                createVNode(_component_PartnersSlider, {
                  title: unref(trustTitle),
                  list: unref(trustSlides)
                }, null, 8, ["title", "list"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1j = _sfc_main$1j.setup;
_sfc_main$1j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/main/MAbout.vue");
  return _sfc_setup$1j ? _sfc_setup$1j(props, ctx) : void 0;
};
const __nuxt_component_4$3 = Object.assign(_sfc_main$1j, { __name: "MAbout" });
const MAbout = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1i = /* @__PURE__ */ defineComponent({
  __name: "SeoBlock",
  __ssrInlineRender: true,
  props: {
    title: { default: "СЕО" },
    description: { default: "CEO Блок. Трубный завод ПИК — один из ведущих российских производителей трубопроводных" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "seo-block" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="seo-block__container"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "seo-block__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(props.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(props.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Text, { class: "seo-block__desc" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(props.description)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(props.description), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "seo-block__container" }, [
                createVNode(_component_CustomTitle, { class: "seo-block__title" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(props.title), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_Text, { class: "seo-block__desc" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(props.description), 1)
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1i = _sfc_main$1i.setup;
_sfc_main$1i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/SeoBlock.vue");
  return _sfc_setup$1i ? _sfc_setup$1i(props, ctx) : void 0;
};
const __nuxt_component_4$2 = Object.assign(_sfc_main$1i, { __name: "SeoBlock" });
const SeoBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1h = /* @__PURE__ */ defineComponent({
  __name: "CookiesPopup",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(false);
    const closePopup = () => {
      isVisible.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CloseButton = __nuxt_component_1$g;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      if (isVisible.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "cookies-popup" }, _attrs))}><div class="cookies-popup__wrap">`);
        _push(ssrRenderComponent(_component_CloseButton, {
          class: "cookies-popup__close",
          onClick: closePopup
        }, null, _parent));
        _push(ssrRenderComponent(_component_CustomTitle, {
          class: "cookies-popup__title animated",
          tag: "h3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Мы используем cookies`);
            } else {
              return [
                createTextVNode("Мы используем cookies")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_Text, {
          class: "cookies-popup__content",
          tag: "span"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Продолжая работу с сайтом, Вы выражаете своё согласие на `);
              _push2(ssrRenderComponent(_component_Text, {
                class: "cookies-popup__link",
                tag: "a",
                href: "#",
                target: "_blank"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`обработку Ваших персональных данных`);
                  } else {
                    return [
                      createTextVNode("обработку Ваших персональных данных")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`. Отключить cookies Вы можете в настройках своего браузера. `);
              _push2(ssrRenderComponent(_component_Text, {
                class: "cookies-popup__link",
                tag: "a",
                href: "#",
                target: "_blank"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Подробнее о Cookies`);
                  } else {
                    return [
                      createTextVNode("Подробнее о Cookies")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`. `);
            } else {
              return [
                createTextVNode(" Продолжая работу с сайтом, Вы выражаете своё согласие на "),
                createVNode(_component_Text, {
                  class: "cookies-popup__link",
                  tag: "a",
                  href: "#",
                  target: "_blank"
                }, {
                  default: withCtx(() => [
                    createTextVNode("обработку Ваших персональных данных")
                  ]),
                  _: 1
                }),
                createTextVNode(". Отключить cookies Вы можете в настройках своего браузера. "),
                createVNode(_component_Text, {
                  class: "cookies-popup__link",
                  tag: "a",
                  href: "#",
                  target: "_blank"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Подробнее о Cookies")
                  ]),
                  _: 1
                }),
                createTextVNode(". ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="cookies-popup__actions">`);
        _push(ssrRenderComponent(_component_Button, {
          class: "cookies-popup__btn",
          size: "xl",
          text: "Даю согласие",
          onClick: closePopup
        }, null, _parent));
        _push(ssrRenderComponent(_component_Text, {
          class: "cookies-popup__link",
          tag: "a",
          href: "#",
          target: "_blank"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Согласие об использовании.`);
            } else {
              return [
                createTextVNode("Согласие об использовании.")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1h = _sfc_main$1h.setup;
_sfc_main$1h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/popups/CookiesPopup.vue");
  return _sfc_setup$1h ? _sfc_setup$1h(props, ctx) : void 0;
};
const __nuxt_component_10 = Object.assign(_sfc_main$1h, { __name: "CookiesPopup" });
const CookiesPopup = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_10
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1g = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  const _component_MHero = __nuxt_component_0$6;
  const _component_Advantages = __nuxt_component_1$d;
  const _component_ProductCatalog = __nuxt_component_1$9;
  const _component_ServiceCatalog = __nuxt_component_3$7;
  const _component_MAbout = __nuxt_component_4$3;
  const _component_ProductionFacilities = __nuxt_component_5$3;
  const _component_SupplyBlock = __nuxt_component_6$2;
  const _component_NewsBlock = __nuxt_component_7$1;
  const _component_SeoBlock = __nuxt_component_4$2;
  const _component_ConsultationBlock = __nuxt_component_5$7;
  const _component_CookiesPopup = __nuxt_component_10;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_MHero, null, null, _parent));
  _push(ssrRenderComponent(_component_Advantages, null, null, _parent));
  _push(ssrRenderComponent(_component_ProductCatalog, { "is-border": true }, null, _parent));
  _push(ssrRenderComponent(_component_ServiceCatalog, null, null, _parent));
  _push(ssrRenderComponent(_component_MAbout, null, null, _parent));
  _push(ssrRenderComponent(_component_ProductionFacilities, null, null, _parent));
  _push(ssrRenderComponent(_component_SupplyBlock, null, null, _parent));
  _push(ssrRenderComponent(_component_NewsBlock, null, null, _parent));
  _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
  _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
  _push(ssrRenderComponent(_component_CookiesPopup, null, null, _parent));
  _push(`</main>`);
}
const _sfc_setup$1g = _sfc_main$1g.setup;
_sfc_main$1g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$1g ? _sfc_setup$1g(props, ctx) : void 0;
};
const index$4 = /* @__PURE__ */ _export_sfc(_sfc_main$1g, [["ssrRender", _sfc_ssrRender$8]]);
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1f = /* @__PURE__ */ defineComponent({
  __name: "AwardCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    image: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "award-card" }, _attrs))}><div class="award-card__image">`);
      if (_ctx.image) {
        _push(ssrRenderComponent(_component_Image, {
          class: "award-card__image--item",
          src: _ctx.image,
          alt: _ctx.title
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        size: "sm",
        design: "tertiary",
        "line-height": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.description || _ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.description || _ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1f = _sfc_main$1f.setup;
_sfc_main$1f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/awards/AwardCard.vue");
  return _sfc_setup$1f ? _sfc_setup$1f(props, ctx) : void 0;
};
const __nuxt_component_0$5 = Object.assign(_sfc_main$1f, { __name: "AwardCard" });
const AwardCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1e = /* @__PURE__ */ defineComponent({
  __name: "AwardsList",
  __ssrInlineRender: true,
  props: {
    items: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AwardCard = __nuxt_component_0$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "awards-list" }, _attrs))}><div class="container"><div class="awards-list__title">${ssrInterpolate(props.title)}</div><div class="awards-list__body"><!--[-->`);
      ssrRenderList(props.items, (item, index2) => {
        _push(ssrRenderComponent(_component_AwardCard, {
          key: index2,
          title: item.title,
          description: item.description,
          image: item.image
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$1e = _sfc_main$1e.setup;
_sfc_main$1e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/awards/AwardsList.vue");
  return _sfc_setup$1e ? _sfc_setup$1e(props, ctx) : void 0;
};
const __nuxt_component_2$h = Object.assign(_sfc_main$1e, { __name: "AwardsList" });
const AwardsList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$h
}, Symbol.toStringTag, { value: "Module" }));
const fallbackTitle = "Награды и достижения";
const _sfc_main$1d = /* @__PURE__ */ defineComponent({
  __name: "awards",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Награды", href: "/awards" }
    ];
    const fallbackTexts = [
      "«Производственная Изоляционная Компания» (ООО «ПИК») – одно из крупнейших предприятий Российской Федерации по производству, изоляции и поставке пластиковых труб различного сортамента. Имея историю длиной в двадцать один год, мы создали имидж надёжного поставщика качественной трубной продукции для реализации проектов самой разной сложности.",
      "Выпуская продукт высокого качества, мы помогаем развивать промышленность и бизнес, а значит экономику страны, ведь именно наша продукция обеспечивает надёжную и бесперебойную доставку сред и ресурсов по магистралям наших партнёров. И делает это с наименьшими потерями. Высокие показатели качества и надёжности были достигнуты благодаря собственному современному производству, которое обеспечивает полный контроль соответствия заложенным требования на всех стадиях производства пластиковых труб и изоляции.",
      "Мы гордимся нашими наградами и достижениями."
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: awardsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "awards",
      () => $fetch(`${config.app.baseURL}api/awards`)
    )), __temp = await __temp, __restore(), __temp);
    const splitText = (value) => {
      if (!value) return [];
      return value.replace(/<\/?br\s*\/?>/gi, "\n").split("\n").map((item) => item.trim()).filter(Boolean);
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const awardsItem = computed(() => awardsData.value?.data?.items?.[0]);
    const pageTitle = computed(() => awardsItem.value?.NAME || fallbackTitle);
    const texts = computed(() => {
      const parsed = splitText(awardsItem.value?.PREVIEW_TEXT);
      return parsed.length ? parsed : fallbackTexts;
    });
    const awardsList = computed(() => {
      const awards2 = awardsItem.value?.PROPERTIES?.AWARDS;
      awards2?.NAME;
      const descriptions = awards2?.DESCRIPTION || [];
      const images = awards2?.SRC || [];
      if (!descriptions.length) return [];
      return descriptions.map((title2, index2) => ({
        title: title2,
        description: title2,
        image: images[index2] ? resolveImageSrc2(images[index2]) : void 0
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_ContentBlock = __nuxt_component_1$j;
      const _component_AwardsList = __nuxt_component_2$h;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_ContentBlock, {
        title: unref(pageTitle),
        texts: unref(texts)
      }, null, _parent));
      _push(ssrRenderComponent(_component_AwardsList, {
        items: unref(awardsList),
        title: unref(awardsItem)?.PROPERTIES?.AWARDS?.NAME
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$1d = _sfc_main$1d.setup;
_sfc_main$1d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/awards.vue");
  return _sfc_setup$1d ? _sfc_setup$1d(props, ctx) : void 0;
};
const awards = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1c = /* @__PURE__ */ defineComponent({
  __name: "DetailsList",
  __ssrInlineRender: true,
  props: {
    items: {},
    footerTitle: {},
    footerButtonText: {},
    footerButtonHref: {}
  },
  setup(__props) {
    const props = __props;
    const listItems = computed(() => props.items ?? []);
    const footerTitle = computed(() => props.footerTitle || "Карточка предприятия");
    const footerButton = computed(() => ({
      text: props.footerButtonText || "Смотреть",
      size: "sm",
      href: props.footerButtonHref || "#"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_LabCard = __nuxt_component_1$m;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "details-list" }, _attrs))}><div class="container"><div class="details-list__body"><!--[-->`);
      ssrRenderList(unref(listItems), (item, index2) => {
        _push(`<div class="${ssrRenderClass([{ "details-list__item_nowrap": item.nowrap }, "details-list__item"])}">`);
        _push(ssrRenderComponent(_component_Text, {
          class: "details-list__item--label",
          design: "black"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_Text, {
          href: item.href,
          class: "details-list__item--value",
          design: "black"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.value), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="details-list__footer">`);
      _push(ssrRenderComponent(_component_LabCard, {
        icon: { name: "document", isSprite: false },
        button: unref(footerButton),
        title: unref(footerTitle)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1c = _sfc_main$1c.setup;
_sfc_main$1c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/details/DetailsList.vue");
  return _sfc_setup$1c ? _sfc_setup$1c(props, ctx) : void 0;
};
const __nuxt_component_2$g = Object.assign(_sfc_main$1c, { __name: "DetailsList" });
const DetailsList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1b = /* @__PURE__ */ defineComponent({
  __name: "details",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: detailPageInfoData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "detailPageInfo",
      () => $fetch(`${config.app.baseURL}api/detailPageInfo`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const splitParagraphs = (value) => {
      if (!value) return [];
      const normalized = decodeHtml2(value).replace(/<\/?br\s*\/?>/gi, "\n");
      return normalized.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    };
    const normalizeValue2 = (value) => {
      if (!value) return "";
      return Array.isArray(value) ? value.join(", ") : value;
    };
    const detailItem = computed(
      () => detailPageInfoData.value?.data?.items?.[0]
    );
    const breadcrumbsList = computed(() => [
      { title: "Главная", href: "/" },
      { title: detailItem.value?.NAME || "Реквизиты", href: "/details" }
    ]);
    const contentTitle = computed(() => detailItem.value?.NAME || "Реквизиты");
    const contentTexts = computed(
      () => splitParagraphs(detailItem.value?.PREVIEW_TEXT)
    );
    const detailProperties = computed(
      () => detailItem.value?.PROPERTIES || {}
    );
    const detailsList = computed(() => {
      const properties = Object.values(detailProperties.value);
      return properties.filter((item) => item.LIST_PAGE_SHOW === "Y").filter((item) => item.VALUE && item.NAME).sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => {
        const value = normalizeValue2(item.VALUE);
        const code = item.CODE || "";
        const href = code === "PHONE" ? `tel:${value.replace(/[^+\d]/g, "")}` : void 0;
        return {
          label: item.NAME,
          value,
          href,
          nowrap: code === "FULL_NAME"
        };
      });
    });
    const footerTitle = computed(
      () => normalizeValue2(detailProperties.value["TEXT_BOTTOM"]?.VALUE)
    );
    const footerButtonText = computed(
      () => normalizeValue2(detailProperties.value["TEXT_BUTTON"]?.VALUE)
    );
    const footerButtonHref = computed(
      () => normalizeValue2(detailProperties.value["URL_BUTTON"]?.VALUE)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_ContentBlock = __nuxt_component_1$j;
      const _component_DetailsList = __nuxt_component_2$g;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(ssrRenderComponent(_component_ContentBlock, {
        title: unref(contentTitle),
        texts: unref(contentTexts)
      }, null, _parent));
      _push(ssrRenderComponent(_component_DetailsList, {
        items: unref(detailsList),
        "footer-title": unref(footerTitle),
        "footer-button-text": unref(footerButtonText),
        "footer-button-href": unref(footerButtonHref)
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$1b = _sfc_main$1b.setup;
_sfc_main$1b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/details.vue");
  return _sfc_setup$1b ? _sfc_setup$1b(props, ctx) : void 0;
};
const details = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1a = /* @__PURE__ */ defineComponent({
  __name: "SitemapGrid",
  __ssrInlineRender: true,
  setup(__props) {
    const sitemapItems = [
      { name: "Main", path: "/", href: "index.html" },
      { name: "About", path: "/about", href: "about.html" },
      { name: "Catalog", path: "/catalog", href: "catalog.html" },
      { name: "News", path: "/news", href: "news.html" },
      {
        name: "Products Catalog",
        path: "/products-catalog",
        href: "products-catalog.html"
      },
      { name: "Awards", path: "/awards", href: "awards.html" },
      { name: "Details", path: "/details", href: "details.html" },
      { name: "Product card", path: "/product-card", href: "product-card.html" },
      {
        name: "Services",
        path: "/services",
        href: "services/index.html"
      },
      {
        name: "Service page",
        path: "/services",
        href: "services/index.html"
      },
      {
        name: "Pro",
        path: "/pro",
        href: "pro.html"
      },
      {
        name: "Lab",
        path: "/lab",
        href: "lab.html"
      },
      {
        name: "Contacts",
        path: "/contacts",
        href: "contacts.html"
      },
      {
        name: "Product page",
        path: "/product-page",
        href: "product-page.html"
      },
      {
        name: "Solution",
        path: "/solution",
        href: "solution.html"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_NuxtLink = __nuxt_component_0$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sitemap-table" }, _attrs))}><div class="sitemap-table__header-row"><div class="sitemap-table__cell sitemap-table__cell_header">`);
      _push(ssrRenderComponent(_component_Text, {
        tag: "span",
        size: "md",
        "line-height": "sm",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Страница `);
          } else {
            return [
              createTextVNode(" Страница ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="sitemap-table__cell sitemap-table__cell_header">`);
      _push(ssrRenderComponent(_component_Text, {
        tag: "span",
        size: "md",
        "line-height": "sm",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ссылка `);
          } else {
            return [
              createTextVNode(" Ссылка ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="sitemap-table__cell sitemap-table__cell_header">`);
      _push(ssrRenderComponent(_component_Text, {
        tag: "span",
        size: "md",
        "line-height": "sm",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Статус `);
          } else {
            return [
              createTextVNode(" Статус ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><!--[-->`);
      ssrRenderList(sitemapItems, (item, index2) => {
        _push(`<div class="${ssrRenderClass([{ "sitemap-table__row_alt": index2 % 2 === 1 }, "sitemap-table__row"])}"><div class="sitemap-table__cell sitemap-table__cell_name">`);
        _push(ssrRenderComponent(_component_Text, {
          tag: "span",
          size: "sm",
          "line-height": "sm",
          design: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><div class="sitemap-table__cell sitemap-table__cell_path">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.path,
          class: "sitemap-table__link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Text, {
                tag: "span",
                size: "sm",
                "line-height": "sm",
                design: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.href)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.href), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Text, {
                  tag: "span",
                  size: "sm",
                  "line-height": "sm",
                  design: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.href), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><div class="sitemap-table__cell sitemap-table__cell_status">`);
        _push(ssrRenderComponent(_component_Text, {
          tag: "span",
          size: "sm",
          "line-height": "sm",
          design: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Готово `);
            } else {
              return [
                createTextVNode(" Готово ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SitemapGrid.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
const __nuxt_component_2$f = Object.assign(_sfc_main$1a, { __name: "SitemapGrid" });
const SitemapGrid = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$19 = /* @__PURE__ */ defineComponent({
  __name: "sitemap",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Карта сайта - PikTube",
      meta: [
        {
          name: "description",
          content: "Карта сайта компании PikTube - все страницы сайта"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_SitemapGrid = __nuxt_component_2$f;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><div class="sitemap"><div class="container"><div class="sitemap__header">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, { class: "sitemap__title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Карта сайта `);
                } else {
                  return [
                    createTextVNode(" Карта сайта ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, { class: "sitemap__title" }, {
                default: withCtx(() => [
                  createTextVNode(" Карта сайта ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_SitemapGrid, null, null, _parent));
      _push(`</div></div></main>`);
    };
  }
});
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sitemap.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const sitemap = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$19
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$18 = /* @__PURE__ */ defineComponent({
  __name: "ContactCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    address: {},
    schedule: {},
    email: {},
    phone: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "contact-card" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "contact-card__title",
        "letter-spacing": "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "contact-card__email",
        tag: "a",
        href: _ctx.email.href,
        "letter-spacing": "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.email.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.email.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "contact-card__phone",
        tag: "a",
        href: _ctx.phone.href,
        "letter-spacing": "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.phone.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.phone.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "contact-card__address",
        "letter-spacing": "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(_ctx.address, (value) => {
              _push2(`<!--[-->${ssrInterpolate(value)}<br${_scopeId}><!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.address, (value) => {
                return openBlock(), createBlock(Fragment, null, [
                  createTextVNode(toDisplayString(value), 1),
                  createVNode("br")
                ], 64);
              }), 256))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "contact-card__schedule",
        "letter-spacing": "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.schedule)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.schedule), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/ContactCard.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const __nuxt_component_2$e = Object.assign(_sfc_main$18, { __name: "ContactCard" });
const ContactCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$17 = /* @__PURE__ */ defineComponent({
  __name: "CPSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    list: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_wrapper = __nuxt_component_1$l;
      const _component_ContactCard = __nuxt_component_2$e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-p-section-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "c-p-section",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_wrapper, { title: _ctx.title }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="c-p-section__list"${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.list, (item, index2) => {
                    _push3(`<div class="c-p-section__item"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_ContactCard, mergeProps({ ref_for: true }, item), null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]--></div>`);
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    createVNode("div", { class: "c-p-section__list" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.list, (item, index2) => {
                        return openBlock(), createBlock("div", {
                          key: index2,
                          class: "c-p-section__item"
                        }, [
                          createVNode(_component_ContactCard, mergeProps({ ref_for: true }, item), null, 16)
                        ]);
                      }), 128))
                    ]),
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_wrapper, { title: _ctx.title }, {
                default: withCtx(() => [
                  createVNode("div", { class: "c-p-section__list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.list, (item, index2) => {
                      return openBlock(), createBlock("div", {
                        key: index2,
                        class: "c-p-section__item"
                      }, [
                        createVNode(_component_ContactCard, mergeProps({ ref_for: true }, item), null, 16)
                      ]);
                    }), 128))
                  ]),
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 8, ["title"])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/contacts/CPSection.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const __nuxt_component_3$6 = Object.assign(_sfc_main$17, { __name: "CPSection" });
const CPSection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$16 = /* @__PURE__ */ defineComponent({
  __name: "contacts",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Контакты", href: "/contacts" }
    ];
    const fallbackSections = [
      {
        title: "Отделы продаж",
        list: [
          {
            title: "г.Москва",
            email: {
              title: "email@mail.com",
              href: "mailto:email@mail.com"
            },
            phone: {
              title: "+7 (965) 001-30-04",
              href: "tel:79650013004"
            },
            address: ["г.Москва, Новодмитровская улица,", "2к1"],
            schedule: "Ежедневно с 12:00 до 21:00 по Московскому времени"
          },
          {
            title: "г.Екатеринбург",
            email: {
              title: "email@mail.com",
              href: "mailto:email@mail.com"
            },
            phone: {
              title: "+7 (965) 001-30-04",
              href: "tel:79650013004"
            },
            address: ["г.Екатеринбург, Онежская улица,", "4А"],
            schedule: "Ежедневно с 12:00 до 21:00 по Московскому времени"
          },
          {
            title: "г.Полевской",
            email: {
              title: "email@mail.com",
              href: "mailto:email@mail.com"
            },
            phone: {
              title: "+7 (965) 001-30-04",
              href: "tel:79650013004"
            },
            address: ["г.Полевской, ул. Володарского,", "д. 288"],
            schedule: "Ежедневно с 12:00 до 21:00 по Московскому времени"
          }
        ]
      },
      {
        title: "Производство",
        list: [
          {
            title: "г.Москва",
            email: {
              title: "email@mail.com",
              href: "mailto:email@mail.com"
            },
            phone: {
              title: "+7 (965) 001-30-04",
              href: "tel:79650013004"
            },
            address: ["г.Москва, Новодмитровская улица,", "2к1"],
            schedule: "Ежедневно с 12:00 до 21:00 по Московскому времени"
          }
        ]
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: infoContactsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "infoContacts",
      () => $fetch(`${config.app.baseURL}api/infocontacts`)
    )), __temp = await __temp, __restore(), __temp);
    const splitAddress = (value) => {
      if (!value) return [];
      const parts = value.split(",").map((item) => item.trim()).filter(Boolean);
      return parts.length ? parts : [value];
    };
    const normalizePhone = (value) => {
      if (!value) return "";
      return value.replace(/[^\d+]/g, "");
    };
    const toSectionList = (item) => {
      const email = item.PROPERTY_EMAIL_VALUE || "";
      const phone = item.PROPERTY_PHONE_VALUE || "";
      return {
        title: item.NAME,
        email: {
          title: email,
          href: email ? `mailto:${email}` : ""
        },
        phone: {
          title: phone,
          href: phone ? `tel:${normalizePhone(phone)}` : ""
        },
        address: splitAddress(item.PROPERTY_ADRESS_VALUE),
        schedule: item.PROPERTY_WORKING_VALUE || ""
      };
    };
    const sections = computed(() => {
      const tree = infoContactsData.value?.data?.TREE;
      if (!tree || tree.length === 0) return fallbackSections;
      return tree.map((section) => ({
        title: section.SECTION.NAME,
        list: section.ITEMS.map(toSectionList)
      }));
    });
    const maps = [
      "https://yandex.ru/map-widget/v1/?um=constructor%3A7726fca91e518f7d14ab80eace5fc9b54f6f8aafb2a139f8bd01eff319835126&scroll=false&source=constructor",
      "https://yandex.ru/map-widget/v1/?um=constructor%3A733c6a76dd3b5a4e06413e20505ccc36121641d3f724b2f47a5c709755e8d569&scroll=false&source=constructor"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_CPSection = __nuxt_component_3$6;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(`<div class="c-p-title-wrap"><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "c-p-title",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "c-p-title__item",
              tag: "h1"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Контакты`);
                } else {
                  return [
                    createTextVNode("Контакты")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, {
                class: "c-p-title__item",
                tag: "h1"
              }, {
                default: withCtx(() => [
                  createTextVNode("Контакты")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><!--[-->`);
      ssrRenderList(unref(sections), (section, index2) => {
        _push(ssrRenderComponent(_component_CPSection, mergeProps({
          key: `${section.title}-${index2}`,
          class: `c-p-section_${index2}`
        }, { ref_for: true }, section), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (maps[index2]) {
                _push2(`<div class="c-p-section__map"${_scopeId}><iframe${ssrRenderAttr("src", maps[index2])} width="100%" height="100%" frameborder="0" scrolling="no" scroll="no"${_scopeId}></iframe></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                maps[index2] ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "c-p-section__map"
                }, [
                  createVNode("iframe", {
                    src: maps[index2],
                    width: "100%",
                    height: "100%",
                    frameborder: "0",
                    scrolling: "no",
                    scroll: "no"
                  }, null, 8, ["src"])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contacts.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const contacts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$16
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$15 = /* @__PURE__ */ defineComponent({
  __name: "SHero",
  __ssrInlineRender: true,
  props: {
    title: {},
    descriptions: {},
    imageSrc: {}
  },
  setup(__props) {
    const fallbackDescList = [
      "Трубный завод ПИК производит трубы ПИКПАЙП из сертифицированных трубных марок полиэтилена типов ПЭ100, ПЭ100+, ПЭ112 и сверхпрочного ПЭ100RC. В производственной линейке выпускаются трубы ПИКПАЙП в полиуретановой теплоизоляции (ППУ) с различными типами защитной оболочки для надёжной защиты систем водоснабжения от промерзания в условиях холодного климата:<br />– с оцинкованной стальной оболочкой (ОЦ),<br />– с полиэтиленовой оболочкой (ПЭ).<br />Диаметр Ø 63–800 мм, SDR 6–41.",
      "Трубы выпускаются в соответствии с ГОСТ 18599-2001 с изменением №1,2, ГОСТ Р 70628.2—2023, а также ТУ 22.21.21-003-02986689-2024. Трубы предназначены для следующих способов прокладки: траншейной, бестраншейной, прокладки без песчаной подсыпки (в том числе методом горизонтально-направленного бурения). Поставляются прямыми отрезками длиной 12 м, 13 м или другой длины по согласованию с заказчиком, а также в бухтах (для труб диаметром до 110 мм)."
    ];
    const props = __props;
    const resolvedTitleLines = computed(() => {
      const title2 = props.title ?? ["Холодное", "водоснабжение"];
      return Array.isArray(title2) ? title2 : [title2];
    });
    const resolvedDescriptions = computed(() => {
      return props.descriptions !== void 0 ? props.descriptions : fallbackDescList;
    });
    const normalizeNbsp = (s) => s.replaceAll("&nbsp;", " ");
    const splitByBr = (s) => normalizeNbsp(s).split(/<br\s*\/?\s*>/i);
    const descLines = computed(() => resolvedDescriptions.value.map((t) => splitByBr(t)));
    const imageStyle = computed(() => {
      return props.imageSrc ? { backgroundImage: `url('${props.imageSrc}')` } : {};
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "s-hero-wrap" }, _attrs))}><div class="container"><div class="s-hero"><div class="s-hero__title">`);
      _push(ssrRenderComponent(_component_custom_title, {
        class: "s-hero__title--item",
        tag: "h1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(resolvedTitleLines), (line, index2) => {
              _push2(`<!--[-->${ssrInterpolate(line)} `);
              if (index2 < unref(resolvedTitleLines).length - 1) {
                _push2(`<br${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(resolvedTitleLines), (line, index2) => {
                return openBlock(), createBlock(Fragment, {
                  key: `t-${index2}`
                }, [
                  createTextVNode(toDisplayString(line) + " ", 1),
                  index2 < unref(resolvedTitleLines).length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                ], 64);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="s-hero__image" style="${ssrRenderStyle(unref(imageStyle))}"></div><div class="s-hero__desc"><!--[-->`);
      ssrRenderList(unref(descLines), (lines, index2) => {
        _push(ssrRenderComponent(_component_Text, { class: "s-hero__desc--item" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(lines, (line, i) => {
                _push2(`<!--[--><span${_scopeId}>${ssrInterpolate(line)}</span>`);
                if (i < lines.length - 1) {
                  _push2(`<br${_scopeId}>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(lines, (line, i) => {
                  return openBlock(), createBlock(Fragment, {
                    key: `d-${index2}-${i}`
                  }, [
                    createVNode("span", null, toDisplayString(line), 1),
                    i < lines.length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                  ], 64);
                }), 128))
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/Solution/SHero.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const __nuxt_component_5$2 = Object.assign(_sfc_main$15, { __name: "SHero" });
const SHero = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$14 = /* @__PURE__ */ defineComponent({
  __name: "Dropdown",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    ref("");
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$k;
      resolveDirective("click-away");
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/Dropdown.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const __nuxt_component_0$4 = Object.assign(_sfc_main$14, { __name: "Dropdown" });
const Dropdown = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$13 = /* @__PURE__ */ defineComponent({
  __name: "TableFeature",
  __ssrInlineRender: true,
  props: {
    titles: {},
    dropdowns: {}
  },
  setup(__props) {
    const props = __props;
    const resolvedTitles = computed(() => {
      if (props.titles.length >= 6) return props.titles.slice(0, 6);
      return props.titles.concat(Array(6 - props.titles.length).fill(""));
    });
    const splitLines = (value) => {
      return value.split("\n").map((item) => item.trim()).filter(Boolean);
    };
    const resolvedDropdowns = computed(() => {
      const list = props.dropdowns || [];
      if (list.length >= 6) return list.slice(0, 6);
      return list.concat(Array(6 - list.length).fill(null));
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Dropdown = __nuxt_component_0$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "table-feature" }, _attrs))}><div class="table-feature__caption">Наименование:</div><!--[-->`);
      ssrRenderList(unref(resolvedTitles), (title2, idx) => {
        _push(`<div class="table-feature__wrap">`);
        if (title2) {
          _push(`<!--[-->`);
          ssrRenderList(splitLines(title2), (line, lineIdx) => {
            _push(`<span>${ssrInterpolate(line)}`);
            if (lineIdx < splitLines(title2).length - 1) {
              _push(`<br>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (unref(resolvedDropdowns)[idx]) {
          _push(ssrRenderComponent(_component_Dropdown, {
            list: unref(resolvedDropdowns)[idx] || []
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TableFeature.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const __nuxt_component_2$d = Object.assign(_sfc_main$13, { __name: "TableFeature" });
const TableFeature = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$12 = /* @__PURE__ */ defineComponent({
  __name: "ProductTableCard",
  __ssrInlineRender: true,
  props: {
    caption: {},
    rows: {},
    rowLinks: {},
    clickableRows: {},
    purpose: {},
    gost: {},
    specification: {},
    material: {},
    diameter: {},
    sdr: {},
    layersAmount: {},
    additionalCharacteristic1: {},
    additionalCharacteristic2: {}
  },
  setup(__props) {
    const props = __props;
    const toLines = (value) => {
      if (!value) return [];
      if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
        return value.map((line) => line.filter(Boolean));
      }
      return value.map((item) => [item]);
    };
    const resolvedRows = computed(() => {
      if (props.rows && props.rows.length > 0) {
        return props.rows.slice(0, 6);
      }
      const rows = [
        toLines(props.purpose),
        toLines(props.gost),
        toLines(props.specification),
        toLines(props.material),
        toLines(props.diameter),
        toLines(props.sdr)
      ];
      if (rows.length >= 6) return rows.slice(0, 6);
      return rows.concat(Array(6 - rows.length).fill([]));
    });
    const resolvedClickableRows = computed(() => {
      if (props.clickableRows && props.clickableRows.length > 0) {
        return props.clickableRows;
      }
      return [4, 5];
    });
    const resolvedRowLinks = computed(() => {
      const rows = resolvedRows.value;
      const links = props.rowLinks || [];
      return rows.map((row, rowIndex) => {
        const rowLinks = links[rowIndex] || [];
        return row.map((line, lineIdx) => {
          const lineLinks = rowLinks[lineIdx] || [];
          return line.map((_, valueIdx) => lineLinks[valueIdx] || "");
        });
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-table-card" }, _attrs))}><div class="product-table-card__caption">`);
      _push(ssrRenderComponent(_component_Image, mergeProps({ class: "product-table-card__caption--img" }, props.caption.image), null, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "product-table-card__caption--title",
        tag: "a",
        href: props.caption.href,
        weight: "medium",
        size: "md",
        "line-height": "md",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.caption.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.caption.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(unref(resolvedRows), (row, rowIndex) => {
        _push(`<div class="product-table-card__wrap"><!--[-->`);
        ssrRenderList(row, (line, lineIdx) => {
          _push(`<span class="product-table-card__wrap--line"><!--[-->`);
          ssrRenderList(line, (value, valueIdx) => {
            _push(`<span class="${ssrRenderClass([{
              "product-table-card__wrap--line_word-clickable": unref(resolvedClickableRows).includes(rowIndex)
            }, "product-table-card__wrap--line_word"])}">`);
            if (unref(resolvedRowLinks)[rowIndex]?.[lineIdx]?.[valueIdx]) {
              _push(`<a${ssrRenderAttr("href", unref(resolvedRowLinks)[rowIndex]?.[lineIdx]?.[valueIdx])}>${ssrInterpolate(value)}</a>`);
            } else {
              _push(`<!--[-->${ssrInterpolate(value)}<!--]-->`);
            }
            _push(`</span>`);
          });
          _push(`<!--]--><br></span>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/ProductTableCard.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const __nuxt_component_0$3 = Object.assign(_sfc_main$12, { __name: "ProductTableCard" });
const ProductTableCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$11 = /* @__PURE__ */ defineComponent({
  __name: "ProductTableSlide",
  __ssrInlineRender: true,
  props: {
    slide: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_product_table_card = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-table-slide" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.slide, (card, idx) => {
        _push(`<div class="product-table-slide__item">`);
        _push(ssrRenderComponent(_component_product_table_card, mergeProps({ ref_for: true }, card), null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/ProductTableSlide.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const __nuxt_component_1$8 = Object.assign(_sfc_main$11, { __name: "ProductTableSlide" });
const ProductTableSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$10 = /* @__PURE__ */ defineComponent({
  __name: "ProductTableSlider",
  __ssrInlineRender: true,
  props: {
    slides: {}
  },
  setup(__props) {
    const instanceId = useId().replace(/:/g, "");
    const paginationClass = `product-table-slider__pagination-${instanceId}`;
    const navPrevClass = `product-table-slider__nav-prev-${instanceId}`;
    const navNextClass = `product-table-slider__nav-next-${instanceId}`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_ProductTableSlide = __nuxt_component_1$8;
      const _component_Button = __nuxt_component_1$p;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: "product-table-slider",
        loop: "",
        "no-swiping": true,
        "no-swiping-class": "swiper-no-swiping",
        effect: "fade",
        "fade-effect": { crossFade: true },
        "space-between": 0,
        "slides-per-view": 1,
        navigation: {
          nextEl: `.${navNextClass}`,
          prevEl: `.${navPrevClass}`
        },
        pagination: {
          el: `.${paginationClass}`,
          clickable: true,
          renderBullet: (index2, className) => {
            return `<span class='${className}'>${index2 + 1}</span>`;
          }
        },
        modificator: "product-table"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(_ctx.slides, (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                class: "swiper-no-swiping",
                key: index2
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_ProductTableSlide, { slide }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_ProductTableSlide, { slide }, null, 8, ["slide"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.slides, (slide, index2) => {
                return openBlock(), createBlock(unref(SwiperSlide), {
                  class: "swiper-no-swiping",
                  key: index2
                }, {
                  default: withCtx(() => [
                    createVNode(_component_ProductTableSlide, { slide }, null, 8, ["slide"])
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      if (_ctx.slides.length > 1) {
        _push(`<div class="product-table-slider__controls">`);
        _push(ssrRenderComponent(_component_Button, {
          class: ["product-table-slider__nav-btn", navPrevClass],
          icon: { name: "button-arrow", mode: "prev" }
        }, null, _parent));
        _push(`<div class="${ssrRenderClass(paginationClass)}"></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: ["product-table-slider__nav-btn", navNextClass],
          icon: { name: "button-arrow", mode: "next" }
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/ProductTableSlider.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const __nuxt_component_3$5 = Object.assign(_sfc_main$10, { __name: "ProductTableSlider" });
const ProductTableSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$$ = /* @__PURE__ */ defineComponent({
  __name: "TableSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    slides: {},
    titles: {},
    dropdowns: {}
  },
  setup(__props) {
    const btnText = ref("Показать больше");
    const isBtnActive = ref(false);
    const resolvedTitles = computed(() => {
      const list = __props.titles || [];
      const base = list.length > 0 ? list : [
        "Назначение изделия:",
        "ГОСТ изделия:",
        "ТУ изделия:",
        "Материал изделия:",
        "Диаметр изделия:",
        "SDR изделия:"
      ];
      if (base.length >= 6) return base.slice(0, 6);
      return base.concat(Array(6 - base.length).fill(""));
    });
    function handleBtnClick() {
      if (isBtnActive.value) {
        btnText.value = "Показать больше";
        isBtnActive.value = false;
      } else {
        btnText.value = "Скрыть";
        isBtnActive.value = true;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_TableFeature = __nuxt_component_2$d;
      const _component_product_table_slider = __nuxt_component_3$5;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "table-section-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: ["table-section", { "table-section_active": unref(isBtnActive) }],
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="table-section__title"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_custom_title, {
              class: "table-section__title--item",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="table-section__content-wrap"${_scopeId}><div class="table-section__content"${_scopeId}><div class="table-section__content--item"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_TableFeature, {
              titles: unref(resolvedTitles),
              dropdowns: _ctx.dropdowns
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_product_table_slider, { slides: _ctx.slides }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="table-section__content-btn"${_scopeId}><div class="${ssrRenderClass([{
              "table-section__content-btn--item_active": unref(isBtnActive)
            }, "table-section__content-btn--item"])}"${_scopeId}>${ssrInterpolate(unref(btnText))} `);
            _push2(ssrRenderComponent(_component_Icon, { name: "base-arrow" }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "table-section__title" }, [
                createVNode(_component_custom_title, {
                  class: "table-section__title--item",
                  mode: "xl"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.title), 1)
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "table-section__content-wrap" }, [
                createVNode("div", { class: "table-section__content" }, [
                  createVNode("div", { class: "table-section__content--item" }, [
                    createVNode(_component_TableFeature, {
                      titles: unref(resolvedTitles),
                      dropdowns: _ctx.dropdowns
                    }, null, 8, ["titles", "dropdowns"]),
                    createVNode(_component_product_table_slider, { slides: _ctx.slides }, null, 8, ["slides"])
                  ])
                ]),
                createVNode("div", { class: "table-section__content-btn" }, [
                  createVNode("div", {
                    class: ["table-section__content-btn--item", {
                      "table-section__content-btn--item_active": unref(isBtnActive)
                    }],
                    onClick: handleBtnClick
                  }, [
                    createTextVNode(toDisplayString(unref(btnText)) + " ", 1),
                    createVNode(_component_Icon, { name: "base-arrow" })
                  ], 2)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/TableSection.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const __nuxt_component_6$1 = Object.assign(_sfc_main$$, { __name: "TableSection" });
const TableSection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_6$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$_ = /* @__PURE__ */ defineComponent({
  __name: "FittingBlock",
  __ssrInlineRender: true,
  props: {
    title: {},
    listItem: {},
    isBigBtn: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_section_dropdown = __nuxt_component_0$e;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fitting-block-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "fitting-block",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_section_dropdown, { "is-big-btn": _ctx.isBigBtn }, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="fitting-block__top"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_custom_title, { class: "fitting-block__top--title" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(_ctx.title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(_ctx.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "fitting-block__top" }, [
                      createVNode(_component_custom_title, { class: "fitting-block__top--title" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.title), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="fitting-block__content"${_scopeId2}><div class="fitting-block__content--top"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Text, { class: "fitting-block__content--top_desc" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(_ctx.listItem.content.desc)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(_ctx.listItem.content.desc), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="fitting-block__content--measures"${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.listItem.content.measures, (measure, id) => {
                    _push3(`<div class="fitting-block__content--measure"${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_Text, {
                      class: "fitting-block__content--measure_title",
                      size: "xs",
                      "line-height": "sm"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(measure.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(measure.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_Text, { class: "fitting-block__content--measure_value" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(measure.value)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(measure.value), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  });
                  _push3(`<!--]--></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "fitting-block__content" }, [
                      createVNode("div", { class: "fitting-block__content--top" }, [
                        createVNode(_component_Text, { class: "fitting-block__content--top_desc" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(_ctx.listItem.content.desc), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "fitting-block__content--measures" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItem.content.measures, (measure, id) => {
                          return openBlock(), createBlock("div", {
                            key: `m-${id}`,
                            class: "fitting-block__content--measure"
                          }, [
                            createVNode(_component_Text, {
                              class: "fitting-block__content--measure_title",
                              size: "xs",
                              "line-height": "sm"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(measure.title), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(_component_Text, { class: "fitting-block__content--measure_value" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(measure.value), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]);
                        }), 128))
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_section_dropdown, { "is-big-btn": _ctx.isBigBtn }, {
                header: withCtx(() => [
                  createVNode("div", { class: "fitting-block__top" }, [
                    createVNode(_component_custom_title, { class: "fitting-block__top--title" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.title), 1)
                      ]),
                      _: 1
                    })
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "fitting-block__content" }, [
                    createVNode("div", { class: "fitting-block__content--top" }, [
                      createVNode(_component_Text, { class: "fitting-block__content--top_desc" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.listItem.content.desc), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "fitting-block__content--measures" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItem.content.measures, (measure, id) => {
                        return openBlock(), createBlock("div", {
                          key: `m-${id}`,
                          class: "fitting-block__content--measure"
                        }, [
                          createVNode(_component_Text, {
                            class: "fitting-block__content--measure_title",
                            size: "xs",
                            "line-height": "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(measure.title), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_Text, { class: "fitting-block__content--measure_value" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(measure.value), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]);
                      }), 128))
                    ])
                  ])
                ]),
                _: 1
              }, 8, ["is-big-btn"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/FittingBlock.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const __nuxt_component_8 = Object.assign(_sfc_main$_, { __name: "FittingBlock" });
const FittingBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Z = /* @__PURE__ */ defineComponent({
  __name: "ConstructionSlide",
  __ssrInlineRender: true,
  props: {
    image: {},
    description: {},
    points: {}
  },
  setup(__props) {
    ref(/* @__PURE__ */ new Set());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_ClientOnly = __nuxt_component_1$k;
      const _component_Text = __nuxt_component_4$b;
      resolveDirective("click-away");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "construction-slide" }, _attrs))}><div class="construction-slide__image-wrap"><div class="construction-slide__image">`);
      _push(ssrRenderComponent(_component_Image, mergeProps({ class: "construction-slide__image--item" }, _ctx.image), null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(_ctx.points, (item, idx) => {
        _push(`<div class="${ssrRenderClass([`construction-slide__dot_${idx + 1}`, "construction-slide__dot"])}" style="${ssrRenderStyle({ top: item.top, left: item.left })}">`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><div class="construction-slide__content-wrap"><div class="construction-slide__content">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "construction-slide__content--desc",
        size: "md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.description)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.description), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/ConstructionSlide.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const ConstructionSlide = Object.assign(_sfc_main$Z, { __name: "ConstructionSlide" });
const ConstructionSlide$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ConstructionSlide
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Y = /* @__PURE__ */ defineComponent({
  __name: "ConstructionSlider",
  __ssrInlineRender: true,
  props: {
    slides: {},
    isSliders: { type: Boolean },
    modificator: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "construction-slider-container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: ["construction-slider", { "construction-slider_complex": _ctx.isSliders }],
        modificator: _ctx.modificator,
        "space-between": 0,
        pagination: { type: "fraction", el: ".construction-slider__pagination" },
        navigation: true,
        "slides-per-view": 1,
        effect: "fade",
        "fade-effect": { crossFade: true }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(_ctx.slides, (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(ConstructionSlide, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(ConstructionSlide, mergeProps({ ref_for: true }, slide), null, 16)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--><div class="construction-slider__pagination"${_scopeId}></div>`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.slides, (slide, index2) => {
                return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                  default: withCtx(() => [
                    createVNode(ConstructionSlide, mergeProps({ ref_for: true }, slide), null, 16)
                  ]),
                  _: 2
                }, 1024);
              }), 128)),
              createVNode("div", { class: "construction-slider__pagination" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/ConstructionSlider.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const __nuxt_component_2$c = Object.assign(_sfc_main$Y, { __name: "ConstructionSlider" });
const ConstructionSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$X = /* @__PURE__ */ defineComponent({
  __name: "ConstructionSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    slides: {},
    sliders: {}
  },
  setup(__props) {
    const activeSliderIndex = ref(0);
    const setActiveSlider = (index2) => {
      activeSliderIndex.value = index2;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_construction_slider = __nuxt_component_2$c;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "construction-section-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "construction-section",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_custom_title, {
              class: "construction-section__title",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (_ctx.sliders) {
              _push2(`<div class="construction-section__container"${_scopeId}><div class="construction-section__btns"${_scopeId}><!--[-->`);
              ssrRenderList(_ctx.sliders, (item, idx) => {
                _push2(`<button class="${ssrRenderClass([{
                  [`construction-section__btn_${idx + 1}`]: true,
                  "construction-section__btn_active": activeSliderIndex.value === idx
                }, "construction-section__btn"])}"${_scopeId}>${ssrInterpolate(item.button)}</button>`);
              });
              _push2(`<!--]--></div><div class="construction-section__sliders"${_scopeId}><!--[-->`);
              ssrRenderList(_ctx.sliders, (item, index2) => {
                _push2(ssrRenderComponent(_component_construction_slider, {
                  key: index2,
                  slides: item.slides,
                  class: {
                    "construction-section__slider": true,
                    "construction-section__slider_active": activeSliderIndex.value === index2
                  },
                  "is-sliders": true,
                  modificator: `construction-complex-${index2 + 1}`
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else if (_ctx.slides) {
              _push2(`<div class="construction-section__container"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_construction_slider, {
                slides: _ctx.slides,
                modificator: "construction"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_custom_title, {
                class: "construction-section__title",
                mode: "xl"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ]),
                _: 1
              }),
              _ctx.sliders ? (openBlock(), createBlock("div", {
                key: 0,
                class: "construction-section__container"
              }, [
                createVNode("div", { class: "construction-section__btns" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.sliders, (item, idx) => {
                    return openBlock(), createBlock("button", {
                      key: idx,
                      class: ["construction-section__btn", {
                        [`construction-section__btn_${idx + 1}`]: true,
                        "construction-section__btn_active": activeSliderIndex.value === idx
                      }],
                      onClick: ($event) => setActiveSlider(idx)
                    }, toDisplayString(item.button), 11, ["onClick"]);
                  }), 128))
                ]),
                createVNode("div", { class: "construction-section__sliders" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.sliders, (item, index2) => {
                    return openBlock(), createBlock(_component_construction_slider, {
                      key: index2,
                      slides: item.slides,
                      class: {
                        "construction-section__slider": true,
                        "construction-section__slider_active": activeSliderIndex.value === index2
                      },
                      "is-sliders": true,
                      modificator: `construction-complex-${index2 + 1}`
                    }, null, 8, ["slides", "class", "modificator"]);
                  }), 128))
                ])
              ])) : _ctx.slides ? (openBlock(), createBlock("div", {
                key: 1,
                class: "construction-section__container"
              }, [
                createVNode(_component_construction_slider, {
                  slides: _ctx.slides,
                  modificator: "construction"
                }, null, 8, ["slides"])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/ConstructionSection.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const __nuxt_component_2$b = Object.assign(_sfc_main$X, { __name: "ConstructionSection" });
const ConstructionSection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$W = /* @__PURE__ */ defineComponent({
  __name: "ServiceItem",
  __ssrInlineRender: true,
  props: {
    listItem: {},
    isBigBtn: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_section_dropdown = __nuxt_component_0$e;
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-item" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_section_dropdown, { "is-big-btn": _ctx.isBigBtn }, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="service-item__top"${_scopeId}><div class="service-item__top--image"${_scopeId}>`);
            if (_ctx.listItem.image) {
              _push2(ssrRenderComponent(_component_Image, mergeProps({ class: "service-item__top--image_item" }, _ctx.listItem.image), null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_Text, {
              class: "service-item__top--title",
              "line-height": "md",
              design: "black"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(_ctx.listItem.title, (item, index2) => {
                    _push3(`<!--[-->${ssrInterpolate(item)}<br${_scopeId2}><!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItem.title, (item, index2) => {
                      return openBlock(), createBlock(Fragment, { key: index2 }, [
                        createTextVNode(toDisplayString(item), 1),
                        createVNode("br")
                      ], 64);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "service-item__top" }, [
                createVNode("div", { class: "service-item__top--image" }, [
                  _ctx.listItem.image ? (openBlock(), createBlock(_component_Image, mergeProps({
                    key: 0,
                    class: "service-item__top--image_item"
                  }, _ctx.listItem.image), null, 16)) : createCommentVNode("", true)
                ]),
                createVNode(_component_Text, {
                  class: "service-item__top--title",
                  "line-height": "md",
                  design: "black"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItem.title, (item, index2) => {
                      return openBlock(), createBlock(Fragment, { key: index2 }, [
                        createTextVNode(toDisplayString(item), 1),
                        createVNode("br")
                      ], 64);
                    }), 128))
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="service-item__content"${_scopeId}><div class="service-item__content--top"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Text, { class: "service-item__content--top_desc" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.listItem.content.desc)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.listItem.content.desc), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="service-item__content--measures"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.listItem.content.measures, (measure, id) => {
              _push2(`<div class="service-item__content--measure"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Text, {
                class: "service-item__content--measure_title",
                size: "xs",
                "line-height": "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(measure.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(measure.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Text, { class: "service-item__content--measure_value" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(measure.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(measure.value), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "service-item__content" }, [
                createVNode("div", { class: "service-item__content--top" }, [
                  createVNode(_component_Text, { class: "service-item__content--top_desc" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.listItem.content.desc), 1)
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "service-item__content--measures" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItem.content.measures, (measure, id) => {
                    return openBlock(), createBlock("div", {
                      key: `m-${id}`,
                      class: "service-item__content--measure"
                    }, [
                      createVNode(_component_Text, {
                        class: "service-item__content--measure_title",
                        size: "xs",
                        "line-height": "sm"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(measure.title), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_Text, { class: "service-item__content--measure_value" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(measure.value), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceItem.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const __nuxt_component_2$a = Object.assign(_sfc_main$W, { __name: "ServiceItem" });
const ServiceItem = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$V = /* @__PURE__ */ defineComponent({
  __name: "ServicesBlock",
  __ssrInlineRender: true,
  props: {
    service: {},
    listItems: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_service_item = __nuxt_component_2$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "services-block-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "services-block",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="services-block__top"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_custom_title, {
              class: "services-block__title",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Услуги `);
                } else {
                  return [
                    createTextVNode(" Услуги ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Text, {
              class: "services-block__desc",
              size: "xxl",
              "line-height": "sm",
              design: "primary",
              tag: "a",
              href: _ctx.service.href
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.service.title)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.service.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="services-block__content"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.listItems, (item, idx) => {
              _push2(`<div class="services-block__item"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_service_item, {
                "is-big-btn": true,
                "list-item": item
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "services-block__top" }, [
                createVNode(_component_custom_title, {
                  class: "services-block__title",
                  mode: "xl"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Услуги ")
                  ]),
                  _: 1
                }),
                createVNode(_component_Text, {
                  class: "services-block__desc",
                  size: "xxl",
                  "line-height": "sm",
                  design: "primary",
                  tag: "a",
                  href: _ctx.service.href
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.service.title), 1)
                  ]),
                  _: 1
                }, 8, ["href"])
              ]),
              createVNode("div", { class: "services-block__content" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.listItems, (item, idx) => {
                  return openBlock(), createBlock("div", {
                    key: idx,
                    class: "services-block__item"
                  }, [
                    createVNode(_component_service_item, {
                      "is-big-btn": true,
                      "list-item": item
                    }, null, 8, ["list-item"])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/ServicesBlock.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const __nuxt_component_3$4 = Object.assign(_sfc_main$V, { __name: "ServicesBlock" });
const ServicesBlock = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$U = /* @__PURE__ */ defineComponent({
  __name: "PipeCard",
  __ssrInlineRender: true,
  props: {
    image: {},
    name: {},
    settings: {},
    href: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pipe-card" }, _attrs))}><div class="pipe-card__content">`);
      _push(ssrRenderComponent(_component_Image, mergeProps({ class: "pipe-card__content--img" }, props.image), null, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "pipe-card__content--title",
        size: "md",
        "line-height": "md",
        design: "black"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--[-->`);
      ssrRenderList(props.settings, (value, index2) => {
        _push(`<div class="${ssrRenderClass([`pipe-card__measure_${index2 + 1}`, "pipe-card__measure"])}">`);
        _push(ssrRenderComponent(_component_Text, {
          class: "pipe-card__measure--item",
          size: "md",
          "line-height": "md",
          design: "black"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(value), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><div class="pipe-card__action">`);
      _push(ssrRenderComponent(_component_Button, {
        size: "sm",
        href: props.href,
        text: "Подробнее"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/PipeCard.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const __nuxt_component_2$9 = Object.assign(_sfc_main$U, { __name: "PipeCard" });
const PipeCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$T = /* @__PURE__ */ defineComponent({
  __name: "PipesList",
  __ssrInlineRender: true,
  props: {
    titleList: {},
    slides: {},
    cardList: {}
  },
  setup(__props) {
    const props = __props;
    const isSlider = props.slides ? true : false;
    const instanceId = useId().replace(/:/g, "");
    const paginationClass = `pipes-list__pagination-${instanceId}`;
    const navPrevClass = `pipes-list__nav-prev-${instanceId}`;
    const navNextClass = `pipes-list__nav-next-${instanceId}`;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_PipeCard = __nuxt_component_2$9;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pipes-list" }, _attrs))}><div class="pipes-list__viewport"><div class="pipes-list__content"><div class="pipes-list__top"><div></div><!--[-->`);
      ssrRenderList(props.titleList, (value, index2) => {
        _push(`<div class="${ssrRenderClass([`pipes-list__top--measure_${index2 + 1}`, "pipes-list__top--measure"])}">`);
        _push(ssrRenderComponent(_component_Text, {
          size: "md",
          "line-height": "sm",
          design: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(value), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--><div></div></div>`);
      if (unref(isSlider)) {
        _push(`<div class="pipes-list__slider">`);
        _push(ssrRenderComponent(_component_BaseSwiper, {
          "space-between": 0,
          "slides-per-view": 1,
          navigation: {
            nextEl: `.${navNextClass}`,
            prevEl: `.${navPrevClass}`
          },
          pagination: {
            el: `.${paginationClass}`,
            clickable: true,
            renderBullet: (index2, className) => {
              return `<span class='${className}'>${index2 + 1}</span>`;
            }
          },
          "show-navigation-with-pagination": false,
          loop: true,
          effect: "fade",
          "fade-effect": { crossFade: true },
          "no-swiping": true,
          "no-swiping-class": "swiper-no-swiping",
          mode: "overflow-controls",
          modificator: "pipes"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(props.slides, (slide, slideIndex) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  class: "swiper-no-swiping",
                  key: slideIndex
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="pipes-list__slide"${_scopeId2}><!--[-->`);
                      ssrRenderList(slide, (item, idx) => {
                        _push3(ssrRenderComponent(_component_PipeCard, mergeProps({ key: idx }, { ref_for: true }, item), null, _parent3, _scopeId2));
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "pipes-list__slide" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(slide, (item, idx) => {
                            return openBlock(), createBlock(_component_PipeCard, mergeProps({ key: idx }, { ref_for: true }, item), null, 16);
                          }), 128))
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(props.slides, (slide, slideIndex) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    class: "swiper-no-swiping",
                    key: slideIndex
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "pipes-list__slide" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(slide, (item, idx) => {
                          return openBlock(), createBlock(_component_PipeCard, mergeProps({ key: idx }, { ref_for: true }, item), null, 16);
                        }), 128))
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="pipes-list__slide"><!--[-->`);
        ssrRenderList(props.cardList, (item, index2) => {
          _push(ssrRenderComponent(_component_PipeCard, mergeProps({ key: index2 }, { ref_for: true }, item), null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
      if (unref(isSlider) && props.slides && props.slides.length > 1) {
        _push(`<div class="pipes-list__controls">`);
        _push(ssrRenderComponent(_component_Button, {
          class: ["pipes-list__nav-btn", navPrevClass],
          icon: { name: "button-arrow", mode: "prev" }
        }, null, _parent));
        _push(`<div class="${ssrRenderClass(paginationClass)}"></div>`);
        _push(ssrRenderComponent(_component_Button, {
          class: ["pipes-list__nav-btn", navNextClass],
          icon: { name: "button-arrow", mode: "next" }
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/list/PipesList.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const __nuxt_component_0$2 = Object.assign(_sfc_main$T, { __name: "PipesList" });
const PipesList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$S = /* @__PURE__ */ defineComponent({
  __name: "CatalogSection",
  __ssrInlineRender: true,
  props: {
    title: {},
    slides: {},
    titleList: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_PipesList = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "catalog-section-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "catalog-section",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="catalog-section__title"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_custom_title, {
              class: "catalog-section__title--item",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(_ctx.title, (value, idx) => {
                    _push3(`<span${_scopeId2}>${ssrInterpolate(value)}</span>`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.title, (value, idx) => {
                      return openBlock(), createBlock("span", { key: idx }, toDisplayString(value), 1);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_PipesList, {
              "title-list": _ctx.titleList,
              slides: _ctx.slides
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "catalog-section__title" }, [
                createVNode(_component_custom_title, {
                  class: "catalog-section__title--item",
                  mode: "xl"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.title, (value, idx) => {
                      return openBlock(), createBlock("span", { key: idx }, toDisplayString(value), 1);
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              createVNode(_component_PipesList, {
                "title-list": _ctx.titleList,
                slides: _ctx.slides
              }, null, 8, ["title-list", "slides"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sections/CatalogSection.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const __nuxt_component_7 = Object.assign(_sfc_main$S, { __name: "CatalogSection" });
const CatalogSection = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$R = /* @__PURE__ */ defineComponent({
  __name: "PPCatalog",
  __ssrInlineRender: true,
  props: {
    title: {},
    titleList: {},
    slides: {}
  },
  setup(__props) {
    const fallbackTitle2 = ["Полный каталог труб ПНД ", "ПИКПАЙП"];
    const fallbackTitleList = [
      "Толщина стенки:",
      "Марка стали:",
      "ГОСТ/ТУ:",
      "d:",
      "Толщина изоляции:",
      "d оболочки:"
    ];
    const fallbackSlides = [
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["6", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["7", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["8", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["9", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["10", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["11", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["12", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["13", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["14", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ]
    ];
    const props = __props;
    const resolvedTitle = computed(() => {
      if (props.title) return props.title;
      return fallbackTitle2;
    });
    const resolvedTitleList = computed(() => {
      if (props.titleList) return props.titleList;
      return fallbackTitleList;
    });
    const resolvedSlides = computed(() => {
      if (props.slides) return props.slides;
      return fallbackSlides;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_catalog_section = __nuxt_component_7;
      _push(ssrRenderComponent(_component_catalog_section, mergeProps({
        title: unref(resolvedTitle),
        "title-list": unref(resolvedTitleList),
        slides: unref(resolvedSlides)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productPage/PPCatalog.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const __nuxt_component_4$1 = Object.assign(_sfc_main$R, { __name: "PPCatalog" });
const PPCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "OwnCapacities",
  __ssrInlineRender: true,
  setup(__props) {
    const descList = [
      "Мы предлагаем организациям заказать у нас трубную продукцию по индивидуальному техническому заданию или стандартного размера. Мы производим трубы диаметром от 63 до 1220 мм и фасонные изделия из пластика в тепловой изоляции различных модификаций, включая ППУ, ППМ, оцинкованную. Производство труб в ППУ изоляции осуществляется в городе Полевской Свердловской области. Наш завод оборудован новейшими производственными линиями, европейским экструзионным оборудованием, заливочными машинами ВД для переработки пенополиуретана (ППУ). Заводские мощности ориентированы на объем изготовления 11000 т/год. Вся продукция произведена в соответствии с ГОСТ Р 56227-2014, сертифицирована, промаркирована, упакована по действующим нормативам.",
      "Выпускаемые ООО «ПИК» изделия востребованы покупателями, применяются в промышленности, для нужд химического производства и системного водоснабжения. Мы производим водопроводные (для технической и питьевой воды), газопроводные канализационные трубы, специальные изделия. Будем рады видеть вас в числе наших клиентов."
    ];
    const slides = [
      {
        type: "video",
        videoSrc: [
          { src: "/piktube/videos/production.webm", type: "video/webm" },
          { src: "/piktube/videos/production.mp4", type: "video/mp4" }
        ],
        poster: "/piktube/images/production-facilities-poster.webp"
      },
      {
        type: "image",
        src: "main/hero"
      }
    ];
    const isSlider = computed(() => slides.length > 1);
    const firstSlide = computed(() => slides[0]);
    const swiperContainer = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_border_line = __nuxt_component_2$n;
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_Video = __nuxt_component_4$9;
      const _component_Image = __nuxt_component_1$n;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "own-capacities-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_border_line, {
        class: "own-capacities",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="own-capacities__title"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_custom_title, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Собственные <br${_scopeId2}>производственные <br${_scopeId2}>мощности`);
                } else {
                  return [
                    createTextVNode("Собственные "),
                    createVNode("br"),
                    createTextVNode("производственные "),
                    createVNode("br"),
                    createTextVNode("мощности")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="own-capacities__desc"${_scopeId}><!--[-->`);
            ssrRenderList(descList, (item, idx) => {
              _push2(ssrRenderComponent(_component_Text, {
                key: idx,
                class: "own-capacities__desc--item"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="own-capacities__video"${_scopeId}>`);
            if (isSlider.value) {
              _push2(ssrRenderComponent(_component_BaseSwiper, {
                class: "own-capacities__swiper",
                "slides-per-view": 1,
                navigation: true,
                modificator: "own-capacities",
                "navigation-mode": "centered",
                loop: true,
                effect: "fade",
                "fade-effect": { crossFade: true },
                "is-buttons-reverse": true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(slides, (slide, index2) => {
                      _push3(ssrRenderComponent(unref(SwiperSlide), {
                        key: index2,
                        class: "own-capacities__slide"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="own-capacities__slide-content"${_scopeId3}>`);
                            if (slide.type === "video" && slide.videoSrc) {
                              _push4(ssrRenderComponent(_component_Video, {
                                class: "own-capacities__video--item",
                                src: slide.videoSrc,
                                poster: slide.poster,
                                controls: true
                              }, null, _parent4, _scopeId3));
                            } else if (slide.src) {
                              _push4(`<div class="own-capacities__video--item"${_scopeId3}>`);
                              _push4(ssrRenderComponent(_component_Image, {
                                class: "own-capacities__video--image",
                                src: slide.src,
                                alt: slide.alt || ""
                              }, null, _parent4, _scopeId3));
                              _push4(`</div>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div>`);
                          } else {
                            return [
                              createVNode("div", { class: "own-capacities__slide-content" }, [
                                slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                                  key: 0,
                                  class: "own-capacities__video--item",
                                  src: slide.videoSrc,
                                  poster: slide.poster,
                                  controls: true
                                }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "own-capacities__video--item"
                                }, [
                                  createVNode(_component_Image, {
                                    class: "own-capacities__video--image",
                                    src: slide.src,
                                    alt: slide.alt || ""
                                  }, null, 8, ["src", "alt"])
                                ])) : createCommentVNode("", true)
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(), createBlock(Fragment, null, renderList(slides, (slide, index2) => {
                        return createVNode(unref(SwiperSlide), {
                          key: index2,
                          class: "own-capacities__slide"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "own-capacities__slide-content" }, [
                              slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                                key: 0,
                                class: "own-capacities__video--item",
                                src: slide.videoSrc,
                                poster: slide.poster,
                                controls: true
                              }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "own-capacities__video--item"
                              }, [
                                createVNode(_component_Image, {
                                  class: "own-capacities__video--image",
                                  src: slide.src,
                                  alt: slide.alt || ""
                                }, null, 8, ["src", "alt"])
                              ])) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 2
                        }, 1024);
                      }), 64))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (firstSlide.value) {
              _push2(`<div class="own-capacities__single"${_scopeId}>`);
              if (firstSlide.value.type === "video" && firstSlide.value.videoSrc) {
                _push2(ssrRenderComponent(_component_Video, {
                  class: "own-capacities__video--item",
                  src: firstSlide.value.videoSrc,
                  poster: firstSlide.value.poster,
                  controls: true
                }, null, _parent2, _scopeId));
              } else if (firstSlide.value.src) {
                _push2(`<div class="own-capacities__video--item"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_Image, {
                  class: "own-capacities__video--image",
                  src: firstSlide.value.src,
                  alt: firstSlide.value.alt || ""
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "own-capacities__title" }, [
                createVNode(_component_custom_title, null, {
                  default: withCtx(() => [
                    createTextVNode("Собственные "),
                    createVNode("br"),
                    createTextVNode("производственные "),
                    createVNode("br"),
                    createTextVNode("мощности")
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", { class: "own-capacities__desc" }, [
                (openBlock(), createBlock(Fragment, null, renderList(descList, (item, idx) => {
                  return createVNode(_component_Text, {
                    key: idx,
                    class: "own-capacities__desc--item"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(item), 1)
                    ]),
                    _: 2
                  }, 1024);
                }), 64))
              ]),
              createVNode("div", {
                ref_key: "swiperContainer",
                ref: swiperContainer,
                class: "own-capacities__video"
              }, [
                isSlider.value ? (openBlock(), createBlock(_component_BaseSwiper, {
                  key: 0,
                  class: "own-capacities__swiper",
                  "slides-per-view": 1,
                  navigation: true,
                  modificator: "own-capacities",
                  "navigation-mode": "centered",
                  loop: true,
                  effect: "fade",
                  "fade-effect": { crossFade: true },
                  "is-buttons-reverse": true
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(Fragment, null, renderList(slides, (slide, index2) => {
                      return createVNode(unref(SwiperSlide), {
                        key: index2,
                        class: "own-capacities__slide"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "own-capacities__slide-content" }, [
                            slide.type === "video" && slide.videoSrc ? (openBlock(), createBlock(_component_Video, {
                              key: 0,
                              class: "own-capacities__video--item",
                              src: slide.videoSrc,
                              poster: slide.poster,
                              controls: true
                            }, null, 8, ["src", "poster"])) : slide.src ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "own-capacities__video--item"
                            }, [
                              createVNode(_component_Image, {
                                class: "own-capacities__video--image",
                                src: slide.src,
                                alt: slide.alt || ""
                              }, null, 8, ["src", "alt"])
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 2
                      }, 1024);
                    }), 64))
                  ]),
                  _: 1
                })) : firstSlide.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "own-capacities__single"
                }, [
                  firstSlide.value.type === "video" && firstSlide.value.videoSrc ? (openBlock(), createBlock(_component_Video, {
                    key: 0,
                    class: "own-capacities__video--item",
                    src: firstSlide.value.videoSrc,
                    poster: firstSlide.value.poster,
                    controls: true
                  }, null, 8, ["src", "poster"])) : firstSlide.value.src ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "own-capacities__video--item"
                  }, [
                    createVNode(_component_Image, {
                      class: "own-capacities__video--image",
                      src: firstSlide.value.src,
                      alt: firstSlide.value.alt || ""
                    }, null, 8, ["src", "alt"])
                  ])) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
              ], 512)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/OwnCapacities.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const __nuxt_component_5$1 = Object.assign(_sfc_main$Q, { __name: "OwnCapacities" });
const OwnCapacities = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$P = {};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs) {
  const _component_PopupButton = __nuxt_component_0$c;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "actions-popup" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_PopupButton, {
    class: "actions-popup__item actions-popup__item_top",
    isModalOpener: "",
    text: "Документация",
    modalName: "documentation-modal",
    icon: { name: "document-small" }
  }, null, _parent));
  _push(ssrRenderComponent(_component_PopupButton, {
    class: "actions-popup__item",
    isModalOpener: "",
    text: "Оформить заказ",
    modalName: "order-modal"
  }, null, _parent));
  _push(ssrRenderComponent(_component_PopupButton, {
    class: "actions-popup__item",
    text: "Получить консультацию",
    href: "#consultation-block"
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/popups/ActionsPopup.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const __nuxt_component_15 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$P, [["ssrRender", _sfc_ssrRender$7]]), { __name: "ActionsPopup" });
const ActionsPopup = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_15
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$O = {};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs) {
  const _component_Modal = __nuxt_component_0$b;
  const _component_CustomTitle = __nuxt_component_0$j;
  const _component_CloseButton = __nuxt_component_1$g;
  const _component_Text = __nuxt_component_4$b;
  const _component_DocumentSlider = __nuxt_component_2$k;
  _push(ssrRenderComponent(_component_Modal, mergeProps({
    class: "documentation-modal",
    name: "documentation-modal",
    mode: "left"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="documentation-modal__container"${_scopeId}><div class="documentation-modal__top"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_CustomTitle, {
          class: "documentation-modal__title",
          tag: "p",
          mode: "lg"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Документы для <br${_scopeId2}> скачивания `);
            } else {
              return [
                createTextVNode("Документы для "),
                createVNode("br"),
                createTextVNode(" скачивания ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_CloseButton, {
          class: "documentation-modal__close",
          "is-modal-closer": "",
          name: "documentation-modal"
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list-wrapper"${_scopeId}><div class="documentation-modal__list"${_scopeId}><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Каталоги`);
            } else {
              return [
                createTextVNode("Каталоги")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "catalog-list-modal",
          modificator: "catalog-list-modal",
          slides: [
            {
              text: ["Альбом проектных ", "решений №1"],
              size: "10"
            },
            {
              text: ["Альбом проектных ", "решений №2"],
              size: "10"
            },
            {
              text: ["Альбом проектных ", "решений №3"],
              size: "10"
            },
            {
              text: ["Альбом проектных ", "решений №4"],
              size: "10"
            },
            {
              text: ["Альбом проектных ", "решений №5"],
              size: "10"
            },
            {
              text: ["Альбом проектных ", "решений №6"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Прайс-листы`);
            } else {
              return [
                createTextVNode("Прайс-листы")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "price-list-modal",
          modificator: "price-list-modal",
          slides: [
            {
              text: ["Прайс-лист №1"],
              size: "10"
            },
            {
              text: ["Прайс-лист №2"],
              size: "10"
            },
            {
              text: ["Прайс-лист №3"],
              size: "10"
            },
            {
              text: ["Прайс-лист №4"],
              size: "10"
            },
            {
              text: ["Прайс-лист №5"],
              size: "10"
            },
            {
              text: ["Прайс-лист №6"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Сертификаты`);
            } else {
              return [
                createTextVNode("Сертификаты")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "certificates-list-modal",
          modificator: "certificates-list-modal",
          slides: [
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`ГОСТы`);
            } else {
              return [
                createTextVNode("ГОСТы")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "gosts-list-modal",
          modificator: "gosts-list-modal",
          slides: [
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`СНИПы`);
            } else {
              return [
                createTextVNode("СНИПы")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "snipes-list-modal",
          modificator: "snipes-list-modal",
          slides: [
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Инструкции по монтажу`);
            } else {
              return [
                createTextVNode("Инструкции по монтажу")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "mounting-instructions-list-modal",
          modificator: "mounting-instructions-list-modal",
          slides: [
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div><div class="documentation-modal__list--item"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          class: "documentation-modal__list--item_title",
          "letter-spacing": "sm",
          design: "primary",
          "line-height": "sm",
          uppercase: true
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Схемы соединений`);
            } else {
              return [
                createTextVNode("Схемы соединений")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DocumentSlider, {
          id: "connection-schemes-list-modal",
          modificator: "connection-schemes-list-modal",
          slides: [
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            },
            {
              text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
              size: "10"
            }
          ]
        }, null, _parent2, _scopeId));
        _push2(`</div></div></div></div>`);
      } else {
        return [
          createVNode("div", { class: "documentation-modal__container" }, [
            createVNode("div", { class: "documentation-modal__top" }, [
              createVNode(_component_CustomTitle, {
                class: "documentation-modal__title",
                tag: "p",
                mode: "lg"
              }, {
                default: withCtx(() => [
                  createTextVNode("Документы для "),
                  createVNode("br"),
                  createTextVNode(" скачивания ")
                ]),
                _: 1
              }),
              createVNode(_component_CloseButton, {
                class: "documentation-modal__close",
                "is-modal-closer": "",
                name: "documentation-modal"
              })
            ]),
            createVNode("div", { class: "documentation-modal__list-wrapper" }, [
              createVNode("div", { class: "documentation-modal__list" }, [
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Каталоги")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "catalog-list-modal",
                    modificator: "catalog-list-modal",
                    slides: [
                      {
                        text: ["Альбом проектных ", "решений №1"],
                        size: "10"
                      },
                      {
                        text: ["Альбом проектных ", "решений №2"],
                        size: "10"
                      },
                      {
                        text: ["Альбом проектных ", "решений №3"],
                        size: "10"
                      },
                      {
                        text: ["Альбом проектных ", "решений №4"],
                        size: "10"
                      },
                      {
                        text: ["Альбом проектных ", "решений №5"],
                        size: "10"
                      },
                      {
                        text: ["Альбом проектных ", "решений №6"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Прайс-листы")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "price-list-modal",
                    modificator: "price-list-modal",
                    slides: [
                      {
                        text: ["Прайс-лист №1"],
                        size: "10"
                      },
                      {
                        text: ["Прайс-лист №2"],
                        size: "10"
                      },
                      {
                        text: ["Прайс-лист №3"],
                        size: "10"
                      },
                      {
                        text: ["Прайс-лист №4"],
                        size: "10"
                      },
                      {
                        text: ["Прайс-лист №5"],
                        size: "10"
                      },
                      {
                        text: ["Прайс-лист №6"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Сертификаты")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "certificates-list-modal",
                    modificator: "certificates-list-modal",
                    slides: [
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("ГОСТы")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "gosts-list-modal",
                    modificator: "gosts-list-modal",
                    slides: [
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("СНИПы")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "snipes-list-modal",
                    modificator: "snipes-list-modal",
                    slides: [
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Инструкции по монтажу")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "mounting-instructions-list-modal",
                    modificator: "mounting-instructions-list-modal",
                    slides: [
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      }
                    ]
                  })
                ]),
                createVNode("div", { class: "documentation-modal__list--item" }, [
                  createVNode(_component_Text, {
                    class: "documentation-modal__list--item_title",
                    "letter-spacing": "sm",
                    design: "primary",
                    "line-height": "sm",
                    uppercase: true
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Схемы соединений")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_DocumentSlider, {
                    id: "connection-schemes-list-modal",
                    modificator: "connection-schemes-list-modal",
                    slides: [
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      },
                      {
                        text: ["Прайс на однослойную трубу ПНД ", "ПИКПАЙП"],
                        size: "10"
                      }
                    ]
                  })
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/DocumentationModal.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const __nuxt_component_16 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$O, [["ssrRender", _sfc_ssrRender$6]]), { __name: "DocumentationModal" });
const DocumentationModal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_16
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$N = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  const _component_Modal = __nuxt_component_0$b;
  const _component_CustomTitle = __nuxt_component_0$j;
  const _component_CloseButton = __nuxt_component_1$g;
  const _component_Text = __nuxt_component_4$b;
  const _component_order_form = __nuxt_component_4$a;
  _push(ssrRenderComponent(_component_Modal, mergeProps({
    class: "order-modal",
    name: "order-modal",
    mode: "right"
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="order-modal__container"${_scopeId}><div class="order-modal__top"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_CustomTitle, {
          class: "order-modal__title",
          tag: "p",
          mode: "lg"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Заявка на <br${_scopeId2}> оформление заказа `);
            } else {
              return [
                createTextVNode("Заявка на "),
                createVNode("br"),
                createTextVNode(" оформление заказа ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_CloseButton, {
          class: "order-modal__close",
          "is-modal-closer": "",
          name: "order-modal"
        }, null, _parent2, _scopeId));
        _push2(`<div class="order-modal__top--desc"${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Text, {
          size: "xl",
          tag: "span"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`У вас возникли вопросы? Мы с удовольствием ответим! `);
            } else {
              return [
                createTextVNode("У вас возникли вопросы? Мы с удовольствием ответим! ")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_Text, {
          class: "order-modal__top--desc_middle",
          size: "xl",
          tag: "span"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Просто закажите обратный звонок.`);
            } else {
              return [
                createTextVNode("Просто закажите обратный звонок.")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_Text, {
          class: "order-modal__top--desc_bottom",
          size: "xl",
          tag: "span"
        }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`И мы свяжемся с вами как можно скорее.`);
            } else {
              return [
                createTextVNode("И мы свяжемся с вами как можно скорее.")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(`</div></div>`);
        _push2(ssrRenderComponent(_component_order_form, { prefix: "order-modal" }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "order-modal__container" }, [
            createVNode("div", { class: "order-modal__top" }, [
              createVNode(_component_CustomTitle, {
                class: "order-modal__title",
                tag: "p",
                mode: "lg"
              }, {
                default: withCtx(() => [
                  createTextVNode("Заявка на "),
                  createVNode("br"),
                  createTextVNode(" оформление заказа ")
                ]),
                _: 1
              }),
              createVNode(_component_CloseButton, {
                class: "order-modal__close",
                "is-modal-closer": "",
                name: "order-modal"
              }),
              createVNode("div", { class: "order-modal__top--desc" }, [
                createVNode(_component_Text, {
                  size: "xl",
                  tag: "span"
                }, {
                  default: withCtx(() => [
                    createTextVNode("У вас возникли вопросы? Мы с удовольствием ответим! ")
                  ]),
                  _: 1
                }),
                createVNode(_component_Text, {
                  class: "order-modal__top--desc_middle",
                  size: "xl",
                  tag: "span"
                }, {
                  default: withCtx(() => [
                    createTextVNode("Просто закажите обратный звонок.")
                  ]),
                  _: 1
                }),
                createVNode(_component_Text, {
                  class: "order-modal__top--desc_bottom",
                  size: "xl",
                  tag: "span"
                }, {
                  default: withCtx(() => [
                    createTextVNode("И мы свяжемся с вами как можно скорее.")
                  ]),
                  _: 1
                })
              ])
            ]),
            createVNode(_component_order_form, { prefix: "order-modal" })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/OrderModal.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$N, [["ssrRender", _sfc_ssrRender$5]]), { __name: "OrderModal" });
const OrderModal = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "solution",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог", href: "/catalog" },
      { title: "Холодное водоснабжение", href: "/solution" }
    ];
    const fitting = {
      content: {
        desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
        measures: [
          {
            title: "Толщина изоляции:",
            value: "10-100"
          },
          {
            title: "d оболочки:",
            value: "30-140"
          },
          {
            title: "Срок годности:",
            value: "20 лет"
          }
        ]
      }
    };
    const servicesList = [
      {
        title: ["Нанесение ППМ изоляции на стальную трубу"],
        content: {
          desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
          measures: [
            {
              title: "Толщина изоляции:",
              value: "10-100"
            },
            {
              title: "d оболочки:",
              value: "30-140"
            },
            {
              title: "Срок годности:",
              value: "20 лет"
            }
          ]
        }
      },
      {
        title: [
          "Нанесение ППМ изоляции на трубу напорную из полиэтилена повышенной термостойкости ПИКПАЙП PE-RT"
        ],
        content: {
          desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
          measures: [
            {
              title: "Толщина изоляции:",
              value: "10-100"
            },
            {
              title: "d оболочки:",
              value: "30-140"
            },
            {
              title: "Срок годности:",
              value: "20 лет"
            }
          ]
        }
      }
    ];
    const constructionSlides = [
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности.",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "65%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "57%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "28.5%",
            left: "71%"
          }
        ]
      },
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 1",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "45%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "77%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "18.5%",
            left: "71%"
          }
        ]
      },
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 2",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "65%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "57%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "28.5%",
            left: "71%"
          }
        ]
      }
    ];
    const constructionSliders = [
      {
        button: "Cпособ 1",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности.",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 1",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 2",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      },
      {
        button: "Cпособ 2",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 3",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 4",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 5",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      },
      {
        button: "Cпособ 3",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 6",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 7",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 8",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      }
    ];
    const productTableSlides = [
      [
        {
          caption: {
            title: "Однослойная труба ПИКПАЙП",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["63", "80", "110", "120", "130", "160"],
            ["200", "240", "400", "800"]
          ],
          sdr: [["6", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["1"],
          additionalCharacteristic1: ["2"],
          additionalCharacteristic2: ["3"]
        },
        {
          caption: {
            title: "Двухслойная труба ПИКПАЙП II",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["2"],
          additionalCharacteristic1: ["3"],
          additionalCharacteristic2: ["4"]
        },
        {
          caption: {
            title: "Трехслойная труба ПИКПАЙП III",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["4"],
          additionalCharacteristic2: ["5"]
        },
        {
          caption: {
            title: "Трехслойная труба ПИКПАЙП ХАРД",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["4"],
          additionalCharacteristic2: ["5"]
        },
        {
          caption: {
            title: "ПИКПАЙП с защитным покрытием COVER",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["5"],
          additionalCharacteristic2: ["6"]
        }
      ],
      [
        {
          caption: {
            title: "Однослойная труба ПИКПАЙП (1)",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["63", "80", "110", "120", "130", "160"],
            ["200", "240", "400", "800"]
          ],
          sdr: [["6", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["1"],
          additionalCharacteristic1: ["2"],
          additionalCharacteristic2: ["3"]
        },
        {
          caption: {
            title: "Двухслойная труба ПИКПАЙП II (1)",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["2"],
          additionalCharacteristic1: ["3"],
          additionalCharacteristic2: ["4"]
        },
        {
          caption: {
            title: "Трехслойная труба ПИКПАЙП III (1)",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["4"],
          additionalCharacteristic2: ["5"]
        },
        {
          caption: {
            title: "Трехслойная труба ПИКПАЙП ХАРД (1)",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["4"],
          additionalCharacteristic2: ["5"]
        },
        {
          caption: {
            title: "ПИКПАЙП с защитным покрытием COVER (1)",
            image: {
              src: "product-table/product-01",
              alt: "Продукт"
            },
            href: "/piktube/catalog"
          },
          purpose: ["Холодное водоснабжение"],
          gost: ["ГОСТ 18599-2001", "(Изменение 1, 2);", "ГОСТ Р 70628.2"],
          specification: ["ТУ 22.21.21-002-02986689", "-2018"],
          material: ["ПЭ100, ПЭ100+, ПЭ112,", "ПЭ100RС"],
          diameter: [
            ["16", "21", "26", "41", "60", "80", "110"],
            ["120", "130", "160", "200", "240"],
            ["400", "800", "1200", "1600"]
          ],
          sdr: [["9", "11", "13.6", "17", "21", "26", "41"]],
          layersAmount: ["3"],
          additionalCharacteristic1: ["5"],
          additionalCharacteristic2: ["6"]
        }
      ]
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroVideo = __nuxt_component_4$8;
      const _component_SHero = __nuxt_component_5$2;
      const _component_TableSection = __nuxt_component_6$1;
      const _component_FittingBlock = __nuxt_component_8;
      const _component_ConstructionSection = __nuxt_component_2$b;
      const _component_services_block = __nuxt_component_3$4;
      const _component_PPCatalog = __nuxt_component_4$1;
      const _component_OwnCapacities = __nuxt_component_5$1;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_ActionsPopup = __nuxt_component_15;
      const _component_DocumentationModal = __nuxt_component_16;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_HeroVideo, null, null, _parent));
      _push(ssrRenderComponent(_component_SHero, null, null, _parent));
      _push(ssrRenderComponent(_component_TableSection, {
        title: "Варианты труб",
        slides: productTableSlides
      }, null, _parent));
      _push(ssrRenderComponent(_component_FittingBlock, {
        "list-item": fitting,
        "is-big-btn": true,
        title: "Фитинги"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConstructionSection, {
        title: "Конструкция",
        slides: constructionSlides
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConstructionSection, {
        title: "Способы соединения",
        sliders: constructionSliders
      }, null, _parent));
      _push(ssrRenderComponent(_component_services_block, {
        service: {
          title: "Нанесение ППМ изоляции",
          href: "/piktube/services"
        },
        "list-items": servicesList
      }, null, _parent));
      _push(ssrRenderComponent(_component_PPCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_OwnCapacities, null, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ActionsPopup, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_DocumentationModal, null, null, _parent));
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/solution.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const solution = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$M
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "news-item",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Новости", href: "/news" },
      { title: "Новость", href: "/news-item" }
    ];
    const descriptionsList = [
      `Настоящая публичная оферта (далее - Оферта) является официальным предложением укажите название юр.лица или ИП в адрес любого физического лица заключить с укажите название юр.лица или ИП договор розничной купли-продажи товара на Сайте дистанционным образом на условиях, определенных в настоящем Договоре и содержит все существенные условия Оферты.`,
      `Сайт предоставляет Покупателю полную и достоверную информацию о товаре/услугах, включая информацию об основных потребительских свойствах товара, месте изготовления, а также информацию о гарантийном сроке и сроке годности товара на Сайте в карточке товара или разделе укажите название раздела.`
    ];
    const sliderImages = [
      {
        src: "news/news-01",
        alt: "Новость 1"
      },
      {
        src: "news/news-02",
        alt: "Новость 2"
      },
      {
        src: "news/news-03",
        alt: "Новость 3"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_Image = __nuxt_component_1$n;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><div class="n-i-page">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(`<div class="n-i-page__wrapper"><div class="container"><div class="n-i-page__content"><div class="n-i-page__top">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "n-i-page__title",
        tag: "h1",
        mode: "xxl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Заголовок H1`);
          } else {
            return [
              createTextVNode("Заголовок H1")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "n-i-page__top--description",
        size: "lg",
        "line-height": "lg",
        "letter-spacing": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Настоящий документ – это публичная оферта (предложение) интернет-магазина укажите домен магазина или его название о продаже товаров.`);
          } else {
            return [
              createTextVNode("Настоящий документ – это публичная оферта (предложение) интернет-магазина укажите домен магазина или его название о продаже товаров.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="n-i-page__slider">`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: "n-i-page__slider-swiper",
        modificator: "news-item",
        "slides-per-view": 1,
        "space-between": 0,
        navigation: true,
        "navigation-mode": "centered",
        effect: "fade",
        "fade-effect": { crossFade: true },
        loop: true,
        "is-buttons-reverse": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(sliderImages, (image, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                key: index2,
                class: "n-i-page__slider-slide"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Image, {
                      class: "n-i-page__slider-image",
                      src: image.src,
                      alt: image.alt
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Image, {
                        class: "n-i-page__slider-image",
                        src: image.src,
                        alt: image.alt
                      }, null, 8, ["src", "alt"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(sliderImages, (image, index2) => {
                return createVNode(unref(SwiperSlide), {
                  key: index2,
                  class: "n-i-page__slider-slide"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_Image, {
                      class: "n-i-page__slider-image",
                      src: image.src,
                      alt: image.alt
                    }, null, 8, ["src", "alt"])
                  ]),
                  _: 2
                }, 1024);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="n-i-page__bottom">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "n-i-page__bottom--title",
        tag: "h2",
        mode: "xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Заголовок H2`);
          } else {
            return [
              createTextVNode("Заголовок H2")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "n-i-page__bottom--subtitle",
        tag: "h3",
        mode: "xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Заголовок H3`);
          } else {
            return [
              createTextVNode("Заголовок H3")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="n-i-page__bottom--list"><!--[-->`);
      ssrRenderList(descriptionsList, (item, idx) => {
        _push(ssrRenderComponent(_component_Text, {
          class: "n-i-page__bottom--list_item",
          key: idx
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div></div>`);
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news-item.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const newsItem = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$L
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$K = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_CustomTitle = __nuxt_component_0$j;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "n-title" }, _attrs))}><div class="container">`);
  _push(ssrRenderComponent(_component_CustomTitle, {
    class: "n-title__item",
    tag: "h1",
    mode: "xxl"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Новости`);
      } else {
        return [
          createTextVNode("Новости")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/news/NTitle.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const __nuxt_component_1$7 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$K, [["ssrRender", _sfc_ssrRender$4]]), { __name: "NTitle" });
const NTitle = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "CustomControls",
  __ssrInlineRender: true,
  props: {
    page: {},
    pages: {},
    queryKey: { default: "page" }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const page = computed(() => Math.max(1, props.page));
    const pages = computed(() => Math.max(1, props.pages));
    const getLinkClass = (index2) => {
      return `custom-controls__pagination--link${page.value === index2 ? " custom-controls__pagination--link_active" : ""}`;
    };
    const goToPage = (index2) => {
      if (index2 < 1 || index2 > pages.value) return;
      const query = { ...route.query, [props.queryKey]: String(index2) };
      return navigateTo({ path: route.path, query });
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = __nuxt_component_1$p;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "custom-controls" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Button, {
        class: "custom-controls__button custom-controls__button_prev",
        icon: { name: "button-arrow", mode: "prev" },
        onClick: ($event) => goToPage(unref(page) - 1)
      }, null, _parent));
      _push(`<div class="custom-controls__pagination"><!--[-->`);
      ssrRenderList(unref(pages), (n) => {
        _push(ssrRenderComponent(_component_Text, {
          key: n,
          class: getLinkClass(n),
          tag: "a",
          "line-height": "xs",
          size: "sm",
          design: "primary",
          onClick: ($event) => goToPage(n)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(n)}`);
            } else {
              return [
                createTextVNode(toDisplayString(n), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_Button, {
        class: "custom-controls__button custom-controls__button_next",
        icon: { name: "button-arrow", mode: "next" },
        onClick: ($event) => goToPage(unref(page) + 1)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/CustomControls.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const __nuxt_component_1$6 = Object.assign(_sfc_main$J, { __name: "CustomControls" });
const CustomControls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "NList",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fallbackCards = [
      {
        image: {
          src: "news/news-01",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-02",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-03",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-04",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-03",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-04",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-01",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-02",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-01",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-02",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-03",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Поддерживаем спорт и наших спортсменов",
        text: 'ООО "ПИК" с радостью поддерживает молодых талантов и развитие спорта в регионе! Мы в очередной раз оказали поддержку перспективным спортсменам, помогая им достигать новых высот.',
        href: "/piktube/news-item"
      },
      {
        image: {
          src: "news/news-04",
          alt: "Новость"
        },
        date: "06.20.24",
        title: "Получение статуса официального партнера",
        text: 'Рады сообщить, что наша компания ООО "Производственная Изоляционная Компания" получила статус официального партнера крупнейших строительных проектов региона.',
        href: "/piktube/news-item"
      }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const route = useRoute();
    const page = computed(() => Number(route.query.page || 1) || 1);
    const { data: newsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `newsList-${page.value}`,
      () => $fetch(`${config.app.baseURL}api/news`, {
        query: { page: page.value }
      }),
      { watch: [page] }
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const cards = computed(() => {
      const items = newsData.value?.data?.items;
      if (!items || items.length === 0) return fallbackCards;
      return items.map((item) => ({
        image: {
          src: resolveImageSrc2(item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        date: item.DATE_ACTIVE_FROM,
        title: item.NAME,
        text: decodeHtml2(item.PREVIEW_TEXT),
        href: `/news/${item.CODE}`
      }));
    });
    const totalPages = computed(() => newsData.value?.data?.pagination?.pages || 1);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NewsCard = __nuxt_component_0$7;
      const _component_CustomControls = __nuxt_component_1$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "n-list" }, _attrs))}><div class="container"><div class="n-list__container"><div class="n-list__grid"><!--[-->`);
      ssrRenderList(unref(cards), (card, index2) => {
        _push(ssrRenderComponent(_component_NewsCard, mergeProps({ key: index2 }, { ref_for: true }, card), null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_component_CustomControls, {
        page: unref(page),
        pages: unref(totalPages)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/news/NList.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const __nuxt_component_2$8 = Object.assign(_sfc_main$I, { __name: "NList" });
const NList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Новости", href: "/news" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_NTitle = __nuxt_component_1$7;
      const _component_NList = __nuxt_component_2$8;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_NTitle, null, null, _parent));
      _push(ssrRenderComponent(_component_NList, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/index.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$H
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "[code]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const code = computed(() => String(route.params.code || ""));
    const { data: newsData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `news-${code.value}`,
      () => $fetch(`${config.app.baseURL}api/news`, {
        query: { code: code.value }
      }),
      { watch: [code] }
    )), __temp = await __temp, __restore(), __temp);
    const item = computed(() => newsData.value?.data?.item);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const breadcrumbsList = computed(() => [
      { title: "Главная", href: "/" },
      { title: "Новости", href: "/news" },
      {
        title: item.value?.NAME || "Новость",
        href: `/news/${code.value}`
      }
    ]);
    const previewText = computed(() => decodeHtml2(item.value?.PREVIEW_TEXT || ""));
    const detailHtml = computed(() => item.value?.DETAIL_TEXT || "");
    const sliderImages = computed(() => {
      const src = item.value?.PROPERTIES?.MORE_PHOTO?.SRC;
      if (Array.isArray(src) && src.length > 0) return src;
      if (typeof src === "string" && src) return [src];
      if (item.value?.PREVIEW_PICTURE_SRC) return [item.value.PREVIEW_PICTURE_SRC];
      return [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_Image = __nuxt_component_1$n;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><div class="n-i-page">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(`<div class="n-i-page__wrapper"><div class="container"><div class="n-i-page__content"><div class="n-i-page__top">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "n-i-page__title",
        tag: "h1",
        mode: "xxl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(item)?.NAME)}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(item)?.NAME), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "n-i-page__top--description",
        size: "lg",
        "line-height": "lg",
        "letter-spacing": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>${unref(previewText) ?? ""}</span>`);
          } else {
            return [
              createVNode("span", { innerHTML: unref(previewText) }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(sliderImages).length) {
        _push(`<div class="n-i-page__slider">`);
        _push(ssrRenderComponent(_component_BaseSwiper, {
          class: "n-i-page__slider-swiper",
          modificator: "news-item",
          "slides-per-view": 1,
          "space-between": 0,
          navigation: true,
          "navigation-mode": "centered",
          effect: "fade",
          "fade-effect": { crossFade: true },
          loop: true,
          "is-buttons-reverse": true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(unref(sliderImages), (image, index2) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: index2,
                  class: "n-i-page__slider-slide"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_Image, {
                        class: "n-i-page__slider-image",
                        src: resolveImageSrc2(image),
                        alt: unref(item)?.NAME || "Новость"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_Image, {
                          class: "n-i-page__slider-image",
                          src: resolveImageSrc2(image),
                          alt: unref(item)?.NAME || "Новость"
                        }, null, 8, ["src", "alt"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(sliderImages), (image, index2) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: index2,
                    class: "n-i-page__slider-slide"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_Image, {
                        class: "n-i-page__slider-image",
                        src: resolveImageSrc2(image),
                        alt: unref(item)?.NAME || "Новость"
                      }, null, 8, ["src", "alt"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="n-i-page__bottom"><div class="n-i-page__detail">${unref(detailHtml) ?? ""}</div></div></div></div></div>`);
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[code].vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _code_$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$G
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "PCHeroSlide",
  __ssrInlineRender: true,
  props: {
    image: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Image = __nuxt_component_1$n;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-c-hero-slide" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Image, {
        class: "p-c-hero-slide__img",
        src: props.image.src,
        alt: props.image.alt || "Изображение"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/slides/PCHeroSlide.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __nuxt_component_1$5 = Object.assign(_sfc_main$F, { __name: "PCHeroSlide" });
const PCHeroSlide = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "PCHeroSlider",
  __ssrInlineRender: true,
  props: {
    slides: { default: void 0 }
  },
  setup(__props) {
    const fallbackSlides = [
      {
        image: {
          src: "product-card/product-card-01",
          alt: "Труба"
        }
      },
      {
        image: {
          src: "product-card/product-card-01",
          alt: "Труба"
        }
      },
      {
        image: {
          src: "product-card/product-card-01",
          alt: "Труба"
        }
      }
    ];
    const props = __props;
    const slides = computed(() => {
      if (props.slides !== void 0) return props.slides;
      return fallbackSlides;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseSwiper = __nuxt_component_0$f;
      const _component_PCHeroSlide = __nuxt_component_1$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-c-hero-slider-container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_BaseSwiper, {
        class: "p-c-hero-slider",
        loop: "",
        modificator: "p-c-hero-slider",
        "space-between": 0,
        navigation: false,
        pagination: {
          el: ".p-c-hero-slider-pagination",
          clickable: true,
          renderBullet: (index2, className) => {
            return `<div class='${className} pagination-bullet'></div>`;
          }
        },
        "show-navigation-with-pagination": false,
        "slides-per-view": 1,
        effect: "fade",
        "fade-effect": { crossFade: true }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(slides), (slide, index2) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: index2 }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_PCHeroSlide, mergeProps({ ref_for: true }, slide), null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_PCHeroSlide, mergeProps({ ref_for: true }, slide), null, 16)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(slides), (slide, index2) => {
                return openBlock(), createBlock(unref(SwiperSlide), { key: index2 }, {
                  default: withCtx(() => [
                    createVNode(_component_PCHeroSlide, mergeProps({ ref_for: true }, slide), null, 16)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="p-c-hero-slider-pagination"></div></div>`);
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/sliders/PCHeroSlider.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const __nuxt_component_1$4 = Object.assign(_sfc_main$E, { __name: "PCHeroSlider" });
const PCHeroSlider = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "PCHero",
  __ssrInlineRender: true,
  props: {
    title: {},
    application: {},
    details: {},
    slides: {}
  },
  setup(__props) {
    const fallbackDetails = [
      {
        title: "Толщина стенки:",
        value: "3"
      },
      {
        title: "Марка стали:",
        value: "ст 09Г2С"
      },
      {
        title: "ГОСТ/ТУ:",
        value: "8732-78"
      },
      {
        title: "d:",
        value: "32"
      },
      {
        title: "Толщина изоляции:",
        value: "34"
      },
      {
        title: "d оболочки:",
        value: "121"
      }
    ];
    const props = __props;
    const resolvedTitle = computed(
      () => props.title || "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200"
    );
    const resolvedApplication = computed(
      () => props.application || "Применяются в системах водоснабжения и водоотведения, а также для технических трубопроводов с повышенными требованиями к прочности и визуальному контролю протока."
    );
    const resolvedDetails = computed(() => {
      return props.details !== void 0 ? props.details : fallbackDetails;
    });
    const resolvedSlides = computed(() => props.slides || []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_PCHeroSlider = __nuxt_component_1$4;
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_Text = __nuxt_component_4$b;
      const _component_Button = __nuxt_component_1$p;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-c-hero" }, _attrs))}><div class="container"><div class="p-c-hero__container"><div class="p-c-hero__title">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "p-c-hero__title--item",
        tag: "h1",
        mode: "xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(resolvedTitle))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(resolvedTitle)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-c-hero__slider">`);
      _push(ssrRenderComponent(_component_PCHeroSlider, { slides: unref(resolvedSlides) }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "p-c-hero__content",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-c-hero__content--wrap"${_scopeId}><div class="p-c-hero__content--wrap_top"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Text, {
              class: "p-c-hero__content--title",
              size: "md",
              "line-height": "sm",
              design: "primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Область применения `);
                } else {
                  return [
                    createTextVNode(" Область применения ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Text, { class: "p-c-hero__content--desc" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(resolvedApplication))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(resolvedApplication)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_Button, {
              class: "p-c-hero__content--btn",
              text: "Заказать",
              modalName: "order-modal",
              "is-modal-opener": true
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "p-c-hero__content--wrap" }, [
                createVNode("div", { class: "p-c-hero__content--wrap_top" }, [
                  createVNode(_component_Text, {
                    class: "p-c-hero__content--title",
                    size: "md",
                    "line-height": "sm",
                    design: "primary"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Область применения ")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Text, { class: "p-c-hero__content--desc" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(resolvedApplication)), 1)
                    ]),
                    _: 1
                  })
                ]),
                createVNode(_component_Button, {
                  class: "p-c-hero__content--btn",
                  text: "Заказать",
                  modalName: "order-modal",
                  "is-modal-opener": true
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="p-c-hero__details"><div class="p-c-hero__details--top">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "p-c-hero__details--title",
        design: "primary",
        "line-height": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Характеристики`);
          } else {
            return [
              createTextVNode("Характеристики")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-c-hero__details--list"><!--[-->`);
      ssrRenderList(unref(resolvedDetails), (item, index2) => {
        _push(ssrRenderComponent(_component_BorderLine, {
          key: index2,
          class: "p-c-hero__details--item",
          position: "top",
          design: "primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Text, {
                class: "p-c-hero__details--item_title",
                size: "md",
                "line-height": "sm",
                design: "primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Text, {
                class: "p-c-hero__details--item_desc",
                size: "md",
                "line-height": "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.value), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Text, {
                  class: "p-c-hero__details--item_title",
                  size: "md",
                  "line-height": "sm",
                  design: "primary"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.title), 1)
                  ]),
                  _: 2
                }, 1024),
                createVNode(_component_Text, {
                  class: "p-c-hero__details--item_desc",
                  size: "md",
                  "line-height": "sm"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.value), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productCard/PCHero.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const __nuxt_component_1$3 = Object.assign(_sfc_main$D, { __name: "PCHero" });
const PCHero = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "PCDocuments",
  __ssrInlineRender: true,
  props: {
    slides: {}
  },
  setup(__props) {
    const fallbackSlides = [
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      },
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      },
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      },
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      },
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      },
      {
        text: [
          "Методическое пособие ",
          "по проектированию труб AQUASAFE ",
          "из ПЭ"
        ],
        size: "10"
      }
    ];
    const props = __props;
    const resolvedSlides = computed(() => {
      return props.slides && props.slides.length > 0 ? props.slides : fallbackSlides;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_document_slider = __nuxt_component_2$k;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-c-documents" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "p-c-documents__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "p-c-documents__title",
              tag: "h2",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Документы для скачивания`);
                } else {
                  return [
                    createTextVNode("Документы для скачивания")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_document_slider, {
              slides: unref(resolvedSlides),
              mode: "wide"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, {
                class: "p-c-documents__title",
                tag: "h2",
                mode: "xl"
              }, {
                default: withCtx(() => [
                  createTextVNode("Документы для скачивания")
                ]),
                _: 1
              }),
              createVNode(_component_document_slider, {
                slides: unref(resolvedSlides),
                mode: "wide"
              }, null, 8, ["slides"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productCard/PCDocuments.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const __nuxt_component_2$7 = Object.assign(_sfc_main$C, { __name: "PCDocuments" });
const PCDocuments = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "PCCatalog",
  __ssrInlineRender: true,
  props: {
    title: {},
    titleList: {},
    cardList: {}
  },
  setup(__props) {
    const fallbackTitleList = [
      "Толщина стенки:",
      "Марка стали:",
      "ГОСТ/ТУ:",
      "d:",
      "Толщина изоляции:",
      "d оболочки:"
    ];
    const fallbackCardList = [
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      },
      {
        image: { src: "production/production-07-small", alt: "Труба" },
        name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
        href: "#"
      }
    ];
    const props = __props;
    const resolvedTitle = computed(
      () => props.title || "Другие варианты трубы ПНД SDR 11 ПИКПАЙП II"
    );
    const resolvedTitleList = computed(() => {
      return props.titleList && props.titleList.length > 0 ? props.titleList : fallbackTitleList;
    });
    const resolvedCardList = computed(() => {
      return props.cardList && props.cardList.length > 0 ? props.cardList : fallbackCardList;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_pipes_list = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-c-catalog" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "p-c-catalog__container",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "p-c-catalog__title",
              tag: "h2",
              mode: "xl"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(resolvedTitle))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(resolvedTitle)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_pipes_list, {
              "title-list": unref(resolvedTitleList),
              "card-list": unref(resolvedCardList)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, {
                class: "p-c-catalog__title",
                tag: "h2",
                mode: "xl"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(resolvedTitle)), 1)
                ]),
                _: 1
              }),
              createVNode(_component_pipes_list, {
                "title-list": unref(resolvedTitleList),
                "card-list": unref(resolvedCardList)
              }, null, 8, ["title-list", "card-list"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productCard/PCCatalog.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const __nuxt_component_3$3 = Object.assign(_sfc_main$B, { __name: "PCCatalog" });
const PCCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "product-card",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог", href: "/catalog" },
      { title: "Холодное водоснабжение", href: "/solution" },
      {
        title: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
        href: "/product-card"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PCHero = __nuxt_component_1$3;
      const _component_PCDocuments = __nuxt_component_2$7;
      const _component_PCCatalog = __nuxt_component_3$3;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_PCHero, null, null, _parent));
      _push(ssrRenderComponent(_component_PCDocuments, null, null, _parent));
      _push(ssrRenderComponent(_component_PCCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product-card.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const productCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$A
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "[...path]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const pathSegments = computed(() => normalizePathSegments(route.params.path));
    const itemCode = computed(() => pathSegments.value[pathSegments.value.length - 1] || "");
    const sectionSegments = computed(() => pathSegments.value.slice(0, -1));
    const sectionPath = computed(() => sectionSegments.value.join("/"));
    const { data: treeData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsTree",
      () => $fetch(`${config.app.baseURL}api/products`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: sectionData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `product-section-${sectionPath.value}`,
      () => sectionPath.value ? $fetch(`${config.app.baseURL}api/products`, {
        query: { path: sectionPath.value }
      }) : null,
      { watch: [sectionPath] }
    )), __temp = await __temp, __restore(), __temp);
    const section = computed(() => sectionData.value?.data?.SECTION);
    const items = computed(() => sectionData.value?.data?.ITEMS || []);
    const currentItem = computed(() => {
      const code = itemCode.value;
      if (!code) return void 0;
      return items.value.find((item) => (item.CODE || item["~CODE"] || "") === code);
    });
    const listPageProperties = computed(() => collectListPageProperties(items.value));
    const titleList = computed(
      () => listPageProperties.value.map((item) => `${item.name}:`)
    );
    const detailsList = computed(() => {
      const props = currentItem.value?.PROPERTIES;
      const detailProps = collectListPageProperties([{ PROPERTIES: props || {} }]);
      return detailProps.map((item) => ({
        title: `${item.name}:`,
        value: props?.[item.code]?.VALUE === void 0 || props?.[item.code]?.VALUE === null || props?.[item.code]?.VALUE === "" ? "" : String(props?.[item.code]?.VALUE)
      }));
    });
    const slides = computed(() => {
      const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO;
      const sources = gallery?.SRC || gallery?.FILES?.map((file) => file.SRC).filter(Boolean) || [];
      const uniqueSources = sources.filter(Boolean);
      if (uniqueSources.length > 0) {
        return uniqueSources.map((src) => ({
          image: {
            src: resolveImageSrc(config.public.apiOrigin, src),
            alt: currentItem.value?.NAME || "Изображение"
          }
        }));
      }
      const preview = currentItem.value?.PREVIEW_PICTURE_SRC;
      return preview ? [
        {
          image: {
            src: resolveImageSrc(config.public.apiOrigin, preview),
            alt: currentItem.value?.NAME || "Изображение"
          }
        }
      ] : [];
    });
    const documents = computed(() => {
      const docs = currentItem.value?.PROPERTIES?.DOCUMNETS;
      const files = docs?.FILES || [];
      if (files.length > 0) {
        return files.map((file) => ({
          text: [file.ORIGINAL_NAME || "Документ"],
          size: Number.isFinite(Number(file.FILE_SIZE)) ? (Number(file.FILE_SIZE) / (1024 * 1024)).toFixed(1) : void 0,
          href: file.SRC ? resolveImageSrc(config.public.apiOrigin, file.SRC) : void 0
        }));
      }
      const rawSources = docs?.SRC ?? docs?.VALUE ?? [];
      const srcs = Array.isArray(rawSources) ? rawSources : rawSources ? [rawSources] : [];
      const normalized = srcs.map((src) => {
        if (typeof src === "string") return src;
        if (src && typeof src === "object") {
          const obj = src;
          return obj.SRC || "";
        }
        return "";
      }).filter(Boolean);
      return normalized.map((src) => ({
        text: ["Документ"],
        href: resolveImageSrc(config.public.apiOrigin, src)
      }));
    });
    const otherCards = computed(() => {
      return items.value.filter((item) => (item.CODE || item["~CODE"] || "") !== itemCode.value).map((item) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          listPageProperties.value
        ),
        href: `${config.app.baseURL}product-card/${sectionPath.value}/${item.CODE || item["~CODE"] || ""}`
      }));
    });
    const catalogTitle = computed(() => {
      return section.value?.NAME ? `Другие варианты ${section.value.NAME}` : "";
    });
    const breadcrumbsList = computed(() => {
      const tree = treeData.value?.data?.TREE || [];
      const nodes = resolvePathNodes(tree, sectionSegments.value);
      const trail = nodes.map((node, index2) => {
        const codes = nodes.slice(0, index2 + 1).map((item) => resolveSectionCode(item.SECTION)).filter(Boolean);
        const href = `${config.app.baseURL}catalog/${codes.join("/")}`;
        return { title: node.SECTION.NAME, href };
      });
      const currentTitle = currentItem.value?.NAME || "Товар";
      return [
        { title: "Главная", href: "/" },
        { title: "Каталог", href: "/catalog" },
        ...trail,
        { title: currentTitle, href: `${config.app.baseURL}product-card/${pathSegments.value.join("/")}` }
      ];
    });
    const heroTitle2 = computed(() => currentItem.value?.NAME || "");
    const heroDesc = computed(
      () => currentItem.value?.PREVIEW_TEXT ? decodeHtml(currentItem.value.PREVIEW_TEXT) : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PCHero = __nuxt_component_1$3;
      const _component_PCDocuments = __nuxt_component_2$7;
      const _component_PCCatalog = __nuxt_component_3$3;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(ssrRenderComponent(_component_PCHero, {
        title: unref(heroTitle2),
        application: unref(heroDesc),
        details: unref(detailsList),
        slides: unref(slides).length ? unref(slides) : void 0
      }, null, _parent));
      if (unref(documents).length) {
        _push(ssrRenderComponent(_component_PCDocuments, { slides: unref(documents) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(otherCards).length) {
        _push(ssrRenderComponent(_component_PCCatalog, {
          title: unref(catalogTitle),
          "title-list": unref(titleList),
          "card-list": unref(otherCards)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product-card/[...path].vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const ____path_$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$z
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "POText",
  __ssrInlineRender: true,
  props: {
    title: {},
    list: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-o-text" }, _attrs))}><div class="p-o-text__title">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "p-o-text__title--item",
        tag: "h2",
        "line-height": "lg",
        weight: "medium",
        "letter-spacing": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-o-text__list"><!--[-->`);
      ssrRenderList(_ctx.list, (item, idx) => {
        _push(`<span class="p-o-text__item">`);
        _push(ssrRenderComponent(_component_Text, {
          class: "p-o-text__item--title",
          tag: "span",
          size: "lg",
          weight: "semi-bold",
          "letter-spacing": "sm",
          "line-height": "lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.currentTitle)} `);
            } else {
              return [
                createTextVNode(toDisplayString(item.currentTitle) + " ", 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_Text, {
          class: "p-o-text__item--desc",
          tag: "span",
          size: "lg",
          "letter-spacing": "sm",
          "line-height": "lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.description)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.description), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</span>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/publicOffer/POText.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$y, { __name: "POText" });
const POText = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "public-offer",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Публичная оферта", href: "/public-offer" }
    ];
    const list = [
      {
        title: "1. Общие положения",
        list: [
          {
            currentTitle: "1.1.",
            description: "Настоящая публичная оферта (далее - Оферта) является официальным предложением укажите название юр.лица или ИП в адрес любого физического лица заключить с укажите название юр.лица или ИП договор розничной купли-продажи товара на Сайте дистанционным образом на условиях, определенных в настоящем Договоре и содержит все существенные условия Оферты."
          },
          {
            currentTitle: "1.2.",
            description: "Заказ Покупателем товара, размещенного на Сайте, означает, что Покупатель согласен со всеми условиями настоящей Оферты, Политики конфиденциальности и Пользовательского соглашения."
          },
          {
            currentTitle: "1.3.",
            description: "Сайт имеет право вносить изменения в Оферту без уведомления Покупателя."
          },
          {
            currentTitle: "1.4.",
            description: "Срок действия Оферты не ограничен, если иное не указано на Сайте."
          },
          {
            currentTitle: "1.5.",
            description: "Сайт предоставляет Покупателю полную и достоверную информацию о товаре/услугах, включая информацию об основных потребительских свойствах товара, месте изготовления, а также информацию о гарантийном сроке и сроке годности товара на Сайте в карточке товара или разделе укажите название раздела."
          }
        ]
      },
      {
        title: "2. Предмет Оферты",
        list: [
          {
            currentTitle: "2.1.",
            description: "Укажите название юр.лица или ИП обязуется передать Покупателю товар, предназначенный для личного, семейного, домашнего или иного использования, не связанного с предпринимательской деятельностью, на основании размещенных Заказов, а Покупатель обязуется принять и оплатить Товар на условиях настоящей Оферты."
          },
          {
            currentTitle: "2.2.",
            description: "Наименование, цена, количество товара, а также прочие необходимые условия Оферты определяются на основании сведений, предоставленных Покупателем при оформлении заказа."
          },
          {
            currentTitle: "2.3.",
            description: "Право собственности на заказанные товары переходит к Покупателю с момента фактической передачи товара Покупателю и оплаты последним полной стоимости товара. Риск его случайной гибели или повреждения товара переходит к Покупателю с момента фактической передачи товара Покупателю."
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      const _component_POText = __nuxt_component_4;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}><div class="p-o-page">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(`<div class="p-o-page__wrap"><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "p-o-page__title",
        position: "top",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CustomTitle, {
              class: "p-o-page__title--item",
              tag: "h1"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Публичная оферта`);
                } else {
                  return [
                    createTextVNode("Публичная оферта")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CustomTitle, {
                class: "p-o-page__title--item",
                tag: "h1"
              }, {
                default: withCtx(() => [
                  createTextVNode("Публичная оферта")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="p-o-page__desc">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "p-o-page__desc--item",
        size: "lg",
        "line-height": "lg",
        "letter-spacing": "sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Настоящий документ – это публичная оферта (предложение) интернет-магазина укажите домен магазина или его название о продаже товаров.`);
          } else {
            return [
              createTextVNode("Настоящий документ – это публичная оферта (предложение) интернет-магазина укажите домен магазина или его название о продаже товаров.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-o-page__list"><!--[-->`);
      ssrRenderList(list, (currentObject, index2) => {
        _push(ssrRenderComponent(_component_POText, mergeProps({
          class: "p-o-page__list--item",
          key: index2
        }, { ref_for: true }, currentObject), null, _parent));
      });
      _push(`<!--]--></div></div></div>`);
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/public-offer.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const publicOffer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$x
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "SPList",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ServiceItem = __nuxt_component_2$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "s-p-list-wrap" }, _attrs))}><div class="container"><div class="s-p-list"><!--[-->`);
      ssrRenderList(props.list, (item, index2) => {
        _push(ssrRenderComponent(_component_ServiceItem, {
          key: index2,
          "list-item": item
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/servicePage/SPList.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const __nuxt_component_2$6 = Object.assign(_sfc_main$w, { __name: "SPList" });
const SPList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$6
}, Symbol.toStringTag, { value: "Module" }));
const heroTitle = "Нанесение ППУ изоляции";
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "service-page",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог Услуг", href: "/services" },
      { title: "Нанесение ППУ изоляции", href: "/service-page" }
    ];
    const heroTexts = [
      "«Производственная Изоляционная Компания» (ООО «ПИК») - предоставляет услуги по нанесению ППУ изоляции, вы можете самостоятельно ознакомиться со всеми услугами, и заказать нужные вам через форму ниже, не стесняйтесь обратиться к нам через форму обратной связи."
    ];
    const fallbackList = [
      {
        title: ["ППУ-изоляция стальных труб с ", "оцинкованной оболочкой (ППУ-ОЦ)"],
        content: {
          desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
          measures: [
            { title: "Толщина изоляции:", value: "10-100" },
            { title: "d оболочки:", value: "30-140" },
            { title: "Срок годности:", value: "20 лет" }
          ]
        }
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroWrapper = __nuxt_component_1$i;
      const _component_SPList = __nuxt_component_2$6;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_HeroWrapper, {
        class: "s-p-hero",
        title: heroTitle,
        texts: heroTexts
      }, null, _parent));
      _push(ssrRenderComponent(_component_SPList, { list: fallbackList }, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/service-page.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const servicePage = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$v
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "CPipeCatalog",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: productsTreeData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsTree-catalog",
      () => $fetch(`${config.app.baseURL}api/products`)
    )), __temp = await __temp, __restore(), __temp);
    const flattenItems = (nodes, parentPath = []) => {
      const result = [];
      for (const node of nodes) {
        const code = resolveSectionCode(node.SECTION);
        if (!code) continue;
        const path = [...parentPath, code];
        const items2 = node.ITEMS || [];
        for (const item of items2) {
          result.push({ item, path });
        }
        if (node.CHILDREN?.length) {
          result.push(...flattenItems(node.CHILDREN, path));
        }
      }
      return result;
    };
    const catalogEntries = computed(() => {
      const tree = productsTreeData.value?.data?.TREE || [];
      const entries = flattenItems(tree);
      const seen = /* @__PURE__ */ new Set();
      return entries.filter((entry2) => {
        const code = entry2.item.CODE || entry2.item["~CODE"] || "";
        if (!code) return false;
        const key = `${entry2.path.join("/")}/${code}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
    const items = computed(() => catalogEntries.value.map((entry2) => entry2.item));
    const listPageProps = computed(
      () => collectListPageProperties(items.value).slice(0, 6)
    );
    const titleList = computed(
      () => listPageProps.value.map((item) => `${item.name}:`)
    );
    const slides = computed(() => {
      const cards = catalogEntries.value.map((entry2) => ({
        // Use preview image for catalog cards
        image: {
          src: entry2.item.PREVIEW_PICTURE_SRC ? resolveImageSrc(config.public.apiOrigin, entry2.item.PREVIEW_PICTURE_SRC) : "",
          alt: entry2.item.NAME
        },
        name: entry2.item.NAME,
        settings: mapListPageValues(
          entry2.item.PROPERTIES,
          listPageProps.value
        ),
        href: `/catalog/${entry2.path.join("/")}/${entry2.item.CODE || entry2.item["~CODE"] || ""}`
      }));
      return chunkArray(cards, 3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_section_dropdown = __nuxt_component_0$e;
      const _component_PipesList = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-pipe-catalog-wrap" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_section_dropdown, {
        class: "c-pipe-catalog",
        title: "Каталог труб"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PipesList, {
              "title-list": unref(titleList),
              slides: unref(slides)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_PipesList, {
                "title-list": unref(titleList),
                slides: unref(slides)
              }, null, 8, ["title-list", "slides"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/catalog/CPipeCatalog.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __nuxt_component_2$5 = Object.assign(_sfc_main$u, { __name: "CPipeCatalog" });
const CPipeCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог", href: "/catalog" }
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: productsListData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsList",
      () => $fetch(`${config.app.baseURL}api/productsList`)
    )), __temp = await __temp, __restore(), __temp);
    const productsListItems = computed(() => productsListData.value?.data?.items || []);
    const listPageProperties = computed(
      () => collectListPageProperties(productsListItems.value).slice(0, 6)
    );
    computed(
      () => listPageProperties.value.map((item) => `${item.name}:`)
    );
    computed(() => {
      const cards = productsListItems.value.map((item) => ({
        image: {
          src: item.PREVIEW_PICTURE_SRC ? resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC) : "",
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          listPageProperties.value
        ),
        href: `/catalog/${item.CODE || item["~CODE"] || ""}`
      }));
      return chunkArray(cards, 3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_ProductCatalog = __nuxt_component_1$9;
      const _component_CPipeCatalog = __nuxt_component_2$5;
      const _component_ServiceCatalog = __nuxt_component_3$7;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_ActionsPopup = __nuxt_component_15;
      const _component_DocumentationModal = __nuxt_component_16;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_ProductCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_CPipeCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_ServiceCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ActionsPopup, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_DocumentationModal, null, null, _parent));
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog/index.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$t
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "SCList",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      const _component_Button = __nuxt_component_1$p;
      const _component_ServiceItem = __nuxt_component_2$a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "s-c-list-wrap" }, _attrs))}><div class="container"><div class="s-c-list"><!--[-->`);
      ssrRenderList(props.list, (item, index2) => {
        _push(`<div class="s-c-list-block"><div class="s-c-list-block__top">`);
        _push(ssrRenderComponent(_component_CustomTitle, {
          class: "s-c-list-block__title",
          mode: "xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(_component_Button, {
          class: "s-c-list-block__btn",
          href: item.href,
          text: "Подробнее",
          size: "sm"
        }, null, _parent));
        _push(`</div><div class="s-c-list-block__content"><!--[-->`);
        ssrRenderList(item.list, (listItem, idx) => {
          _push(`<div class="s-c-list-item">`);
          _push(ssrRenderComponent(_component_ServiceItem, { "list-item": listItem }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/servicesCatalog/SCList.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const __nuxt_component_2$4 = Object.assign(_sfc_main$s, { __name: "SCList" });
const SCList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$4
}, Symbol.toStringTag, { value: "Module" }));
const fallbackHeroTitle = "Услуги";
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог Услуг", href: "/services" }
    ];
    const fallbackHeroTexts = [
      "Трубный завод ПИК оказывает полный спектр услуг по нанесению теплоизоляционных и антикоррозионных покрытий на стальные и полиэтиленовые трубы. Все операции выполняются на собственном оборудовании с обязательным лабораторным контролем качества."
    ];
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: servicesData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "servicesCatalog",
      () => $fetch(`${config.app.baseURL}api/services`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: servicesTopData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "servicesTop",
      () => $fetch(`${config.app.baseURL}api/servicesTop`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: serviceSeoData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "serviceSeo",
      () => $fetch(`${config.app.baseURL}api/serviceSeo`)
    )), __temp = await __temp, __restore(), __temp);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const mapProperties = (props) => {
      if (!props) return [];
      return Object.values(props).filter((item) => item?.NAME && item?.VALUE).map((item) => ({
        title: `${item.NAME}:`,
        value: String(item.VALUE)
      }));
    };
    const mapImage = (src) => {
      if (!src) return void 0;
      return { src: resolveImageSrc2(src), alt: "" };
    };
    const mapItems = (items) => {
      return items.map((item) => ({
        title: [item.NAME],
        content: {
          desc: decodeHtml2(item.PREVIEW_TEXT || ""),
          measures: mapProperties(item.PROPERTIES)
        },
        image: mapImage(item.PREVIEW_PICTURE_SRC)
      }));
    };
    const sections = computed(() => {
      const tree = servicesData.value?.data?.TREE || [];
      return tree.map((section) => ({
        title: section.SECTION.NAME,
        code: section.SECTION.CODE || section.SECTION["~CODE"] || "",
        list: mapItems(section.ITEMS || [])
      })).filter((section) => Boolean(section.code)).map((section) => ({
        title: section.title,
        href: `${config.app.baseURL}services/${section.code}`,
        list: section.list
      }));
    });
    const servicesTopItem = computed(() => servicesTopData.value?.data?.items?.[0]);
    const heroTitle2 = computed(() => servicesTopItem.value?.NAME || fallbackHeroTitle);
    const heroTexts = computed(() => {
      const text = servicesTopItem.value?.PREVIEW_TEXT;
      if (!text) return fallbackHeroTexts;
      return [decodeHtml2(text)];
    });
    const serviceSeoItem = computed(() => serviceSeoData.value?.data?.items?.[0]);
    const seoTitle = computed(() => serviceSeoItem.value?.NAME || "СЕО");
    const seoDescription = computed(
      () => serviceSeoItem.value?.PREVIEW_TEXT ? decodeHtml2(serviceSeoItem.value.PREVIEW_TEXT) : ""
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroWrapper = __nuxt_component_1$i;
      const _component_SCList = __nuxt_component_2$4;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_HeroWrapper, {
        class: "s-c-hero",
        title: unref(heroTitle2),
        texts: unref(heroTexts)
      }, null, _parent));
      _push(ssrRenderComponent(_component_SCList, { list: unref(sections) }, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, {
        title: unref(seoTitle),
        description: unref(seoDescription)
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services/index.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$r
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "[code]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const code = computed(() => String(route.params.code || ""));
    const { data: servicesData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `services-${code.value}`,
      () => $fetch(`${config.app.baseURL}api/services`, {
        query: { code: code.value }
      }),
      { watch: [code] }
    )), __temp = await __temp, __restore(), __temp);
    const section = computed(() => servicesData.value?.data?.SECTION);
    const decodeHtml2 = (value) => {
      return value.replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    };
    const resolveImageSrc2 = (src) => {
      if (!src) return "";
      if (/^https?:\/\//.test(src)) return src;
      if (src.startsWith("/")) return `${config.public.apiOrigin}${src}`;
      return src;
    };
    const mapProperties = (props) => {
      if (!props) return [];
      return Object.values(props).filter((item) => item?.NAME && item?.VALUE).map((item) => ({
        title: `${item.NAME}:`,
        value: String(item.VALUE)
      }));
    };
    const mapImage = (src) => {
      if (!src) return void 0;
      return { src: resolveImageSrc2(src), alt: "" };
    };
    const listItems = computed(() => {
      const items = servicesData.value?.data?.ITEMS || [];
      return items.map((item) => ({
        title: [item.NAME],
        content: {
          desc: decodeHtml2(item.PREVIEW_TEXT || ""),
          measures: mapProperties(item.PROPERTIES)
        },
        image: mapImage(item.PREVIEW_PICTURE_SRC)
      }));
    });
    const heroTitle2 = computed(() => section.value?.NAME || "");
    const heroTexts = computed(
      () => section.value?.DESCRIPTION ? decodeHtml2(section.value.DESCRIPTION).split("\n").filter(Boolean) : []
    );
    const seoTitle = computed(() => section.value?.UF_SEO_TITLE || "");
    const seoDescription = computed(
      () => section.value?.UF_SEO_DESCRIPTION ? decodeHtml2(section.value.UF_SEO_DESCRIPTION) : ""
    );
    const breadcrumbsList = computed(() => [
      { title: "Главная", href: "/" },
      { title: "Каталог Услуг", href: "/services" },
      { title: heroTitle2.value || "Услуга", href: `/services/${code.value}` }
    ]);
    useHead(() => ({
      title: section.value?.UF_SEO_TITLE || heroTitle2.value,
      meta: [
        {
          name: "description",
          content: section.value?.UF_SEO_DESCRIPTION || ""
        }
      ]
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_HeroWrapper = __nuxt_component_1$i;
      const _component_SPList = __nuxt_component_2$6;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(ssrRenderComponent(_component_HeroWrapper, {
        class: "s-p-hero",
        title: unref(heroTitle2),
        texts: unref(heroTexts)
      }, null, _parent));
      _push(ssrRenderComponent(_component_SPList, { list: unref(listItems) }, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, {
        title: unref(seoTitle),
        description: unref(seoDescription)
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services/[code].vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _code_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$q
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "PSCTitle",
  __ssrInlineRender: true,
  props: {
    title: { default: "Холодное водоснабжение" },
    subtitle: { default: "(SDR 11)" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CustomTitle = __nuxt_component_0$j;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-s-c-title" }, _attrs))}><div class="container">`);
      _push(ssrRenderComponent(_component_CustomTitle, {
        class: "p-s-c-title__item",
        tag: "h1",
        mode: "xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)} `);
            if (props.subtitle) {
              _push2(`<br${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (props.subtitle) {
              _push2(`<span${_scopeId}>${ssrInterpolate(props.subtitle)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(toDisplayString(props.title) + " ", 1),
              props.subtitle ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true),
              props.subtitle ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(props.subtitle), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productsCatalog/PSCTitle.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const __nuxt_component_1$2 = Object.assign(_sfc_main$p, { __name: "PSCTitle" });
const PSCTitle = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "PSCList",
  __ssrInlineRender: true,
  props: {
    titleList: {},
    slides: {}
  },
  setup(__props) {
    const fallbackTitleList = [
      "Толщина стенки:",
      "Марка стали:",
      "ГОСТ/ТУ:",
      "d:",
      "Толщина изоляции:",
      "d оболочки:"
    ];
    const fallbackSlides = [
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ],
      [
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["3", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["5", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        },
        {
          image: { src: "production/production-07-small", alt: "Труба" },
          name: "Двухслойная труба ПНД SDR 11 ПИКПАЙП II D200",
          settings: ["4", "ст 09Г2С", "8732-78", "32", "34", "121"],
          href: "/piktube/product-card"
        }
      ]
    ];
    const props = __props;
    const resolvedTitleList = computed(() => {
      return props.titleList !== void 0 ? props.titleList : fallbackTitleList;
    });
    const resolvedSlides = computed(() => {
      return props.slides !== void 0 ? props.slides : fallbackSlides;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PipesList = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-s-c-list" }, _attrs))}><div class="container"><div class="p-s-c-list__container">`);
      _push(ssrRenderComponent(_component_PipesList, {
        "title-list": unref(resolvedTitleList),
        slides: unref(resolvedSlides)
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productsCatalog/PSCList.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __nuxt_component_2$3 = Object.assign(_sfc_main$o, { __name: "PSCList" });
const PSCList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "products-catalog",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог", href: "/catalog" },
      { title: "Холодное водоснабжение", href: "/solution" },
      { title: "SDR 11", href: "/products-catalog" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PSCTitle = __nuxt_component_1$2;
      const _component_PSCList = __nuxt_component_2$3;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_PSCTitle, null, null, _parent));
      _push(ssrRenderComponent(_component_PSCList, null, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products-catalog.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const productsCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$n
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "services-catalog",
  setup(__props) {
    return () => {
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services-catalog.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const servicesCatalog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "PPHero",
  __ssrInlineRender: true,
  props: {
    title: {},
    descriptions: {},
    measures: {},
    imageSrc: {}
  },
  setup(__props) {
    const fallbackDescList = [
      "Хозяйственно-питьевое водоснабжение, напорное водоотведение. Очень высокая термоустойчивость, простой способ прокладки, доступный практически всем, удобная для применения комбинированная система.",
      "ПИК производит трубы в России — качественные отечественные трубы от российского производителя.",
      'Чтобы заказать товар Труба 32х3 ГОСТ 8732-78 ст 20-ППМ-44,5 нажмите кнопку "Заказать". Если у Вас есть какие-либо вопросы, Вы можете заказать звонок.'
    ];
    const fallbackMeasures = [
      {
        title: "Толщина стенки:",
        value: "1-3"
      },
      {
        title: "Марка стали:",
        value: "ст 09Г2С"
      },
      {
        title: "ГОСТ/ТУ:",
        value: "8732-78"
      },
      {
        title: "d:",
        value: "32-1600"
      },
      {
        title: "Толщина изоляции:",
        value: "30-100"
      },
      {
        title: "d оболочки:",
        value: "120-1800"
      }
    ];
    const props = __props;
    const resolvedTitleLines = computed(() => {
      const title2 = props.title ?? ["Однослойная труба", "ПНД ПИКПАЙП"];
      return Array.isArray(title2) ? title2 : [title2];
    });
    const resolvedDescriptions = computed(() => {
      return props.descriptions !== void 0 ? props.descriptions : fallbackDescList;
    });
    const resolvedMeasures = computed(() => {
      return props.measures !== void 0 ? props.measures : fallbackMeasures;
    });
    const imageStyle = computed(() => {
      if (!props.imageSrc) return void 0;
      return {
        backgroundImage: `url(${props.imageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_custom_title = __nuxt_component_0$j;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-p-hero-wrap" }, _attrs))}><div class="container"><div class="p-p-hero"><div class="p-p-hero__title">`);
      _push(ssrRenderComponent(_component_custom_title, {
        class: "p-p-hero__title--item",
        tag: "h1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(resolvedTitleLines), (line, index2) => {
              _push2(`<!--[-->${ssrInterpolate(line)}`);
              if (index2 < unref(resolvedTitleLines).length - 1) {
                _push2(`<br${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(resolvedTitleLines), (line, index2) => {
                return openBlock(), createBlock(Fragment, {
                  key: `t-${index2}`
                }, [
                  createTextVNode(toDisplayString(line), 1),
                  index2 < unref(resolvedTitleLines).length - 1 ? (openBlock(), createBlock("br", { key: 0 })) : createCommentVNode("", true)
                ], 64);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="p-p-hero__image" style="${ssrRenderStyle(unref(imageStyle))}"></div><div class="p-p-hero__desc"><!--[-->`);
      ssrRenderList(unref(resolvedDescriptions), (item, index2) => {
        _push(ssrRenderComponent(_component_Text, {
          key: index2,
          class: "p-p-hero__desc--item"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="p-p-hero__measures"><!--[-->`);
      ssrRenderList(unref(resolvedMeasures), (measure, idx) => {
        _push(`<div class="p-p-hero__measure"><span class="p-p-hero__measure--item">${ssrInterpolate(measure.title)}</span><span class="p-p-hero__measure--item">${ssrInterpolate(measure.value)}</span></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/pages/productPage/PPHero.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __nuxt_component_1$1 = Object.assign(_sfc_main$l, { __name: "PPHero" });
const PPHero = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1$1
}, Symbol.toStringTag, { value: "Module" }));
const tableRowLimit = 6;
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "[...path]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const fitting = {
      content: {
        desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
        measures: [
          {
            title: "Толщина изоляции:",
            value: "10-100"
          },
          {
            title: "d оболочки:",
            value: "30-140"
          },
          {
            title: "Срок годности:",
            value: "20 лет"
          }
        ]
      }
    };
    const route = useRoute();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const pathSegments = computed(() => normalizePathSegments(route.params.path));
    const pathString = computed(() => pathSegments.value.join("/"));
    const itemCode = computed(() => pathSegments.value[pathSegments.value.length - 1] || "");
    const sectionSegmentsForItem = computed(() => pathSegments.value.slice(0, -1));
    const sectionPathForItem = computed(() => sectionSegmentsForItem.value.join("/"));
    const withBasePath2 = (path) => {
      const normalized = path.startsWith("/") ? path : `/${path}`;
      const base = config.app.baseURL || "/";
      const baseNormalized = base.endsWith("/") ? base.slice(0, -1) : base;
      if (normalized.startsWith(baseNormalized + "/")) return normalized;
      return `${baseNormalized}${normalized}`;
    };
    const { data: treeData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsTree",
      () => $fetch(`${config.app.baseURL}api/products`)
    )), __temp = await __temp, __restore(), __temp);
    const pathIsSection = computed(() => {
      const tree = treeData.value?.data?.TREE || [];
      return Boolean(findSectionByPath(tree, pathSegments.value));
    });
    const viewNodeForItem = computed(() => {
      if (!sectionSegmentsForItem.value.length) return null;
      const tree = treeData.value?.data?.TREE || [];
      return findSectionByPath(tree, sectionSegmentsForItem.value);
    });
    const { data: sectionData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `catalog-section-${pathString.value}`,
      async () => {
        if (!pathString.value) return null;
        const primary = await $fetch(
          `${config.app.baseURL}api/products`,
          { query: { path: pathString.value } }
        );
        if (pathIsSection.value) return primary;
        if (itemCode.value && viewNodeForItem.value?.SECTION?.ID) {
          const byId = await $fetch(
            `${config.app.baseURL}api/products`,
            { query: { section_id: viewNodeForItem.value.SECTION.ID } }
          );
          if ((byId?.data?.ITEMS || []).length > 0) return byId;
        }
        const primaryItems = primary?.data?.ITEMS || [];
        const hasPrimarySection = Boolean(primary?.data?.SECTION);
        const shouldFallback = itemCode.value && sectionPathForItem.value && sectionPathForItem.value !== pathString.value && (!hasPrimarySection || primaryItems.length === 0);
        if (shouldFallback) {
          return $fetch(
            `${config.app.baseURL}api/products`,
            { query: { path: sectionPathForItem.value } }
          );
        }
        return primary;
      },
      { watch: [pathString, sectionPathForItem, itemCode] }
    )), __temp = await __temp, __restore(), __temp);
    const section = computed(() => sectionData.value?.data?.SECTION);
    const treeNode = computed(() => {
      const tree = treeData.value?.data?.TREE || [];
      const nodeByFull = findSectionByPath(tree, pathSegments.value);
      if (nodeByFull) return nodeByFull;
      if (sectionSegmentsForItem.value.length) {
        return findSectionByPath(tree, sectionSegmentsForItem.value);
      }
      return null;
    });
    const items = computed(() => {
      const direct = sectionData.value?.data?.ITEMS || [];
      if (direct.length > 0) {
        const seen = /* @__PURE__ */ new Set();
        return direct.filter((item) => {
          const key = String(item.ID || item.CODE || item["~CODE"] || item.NAME || "");
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }
      if (pathIsSection.value) return direct;
      return treeNode.value?.ITEMS || [];
    });
    const currentItem = computed(() => {
      const code = itemCode.value;
      if (!code) return void 0;
      return items.value.find((item) => (item.CODE || item["~CODE"] || "") === code);
    });
    const isItemPage = computed(() => Boolean(currentItem.value));
    const resolveSectionType = (sectionValue, sectionItems) => {
      const raw = sectionValue?.UF_TYPE_ELEMENT ?? sectionValue?.["~UF_TYPE_ELEMENT"];
      const normalized = String(raw || "").toUpperCase();
      if (normalized === "INDUSTRY" || normalized === "VIEW") {
        return normalized;
      }
      return sectionItems.length > 0 ? "VIEW" : "INDUSTRY";
    };
    const sectionType = computed(() => resolveSectionType(section.value, items.value));
    const isIndustry = computed(() => sectionType.value === "INDUSTRY");
    const industryPicture = computed(
      () => section.value?.PICTURE_SRC ? resolveImageSrc(config.public.apiOrigin, section.value.PICTURE_SRC) : ""
    );
    const industrySliderSlides = computed(() => {
      const raw = section.value?.UF_SLIDER_RU || section.value?.UF_SLIDER_RU_FILES?.map((file) => file.SRC).filter(Boolean) || [];
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      return list.map((src) => src ? resolveImageSrc(config.public.apiOrigin, src) : "").filter(Boolean).map((src) => ({
        type: "image",
        src,
        alt: section.value?.NAME || ""
      }));
    });
    const constructionSectionId = computed(() => {
      const value = section.value?.UF_CONSTRUCTION_RU;
      if (!value) return "";
      return String(value).split(",").map((v) => v.trim()).filter(Boolean)[0];
    });
    const { data: constructionData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `catalog-construction-${constructionSectionId.value}`,
      () => constructionSectionId.value ? $fetch(`${config.app.baseURL}api/construction`, {
        query: {
          section_id: constructionSectionId.value,
          include_subsections: 1
        }
      }) : null,
      { watch: [constructionSectionId] }
    )), __temp = await __temp, __restore(), __temp);
    const normalizeConstructionText = (value) => {
      if (!value) return "";
      const decoded = decodeHtml(value);
      return decoded.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, "").trim();
    };
    const constructionSlides = computed(() => {
      const root = constructionData.value?.data?.TREE?.[0];
      const children = root?.CHILDREN || [];
      return children.map((child) => {
        const description2 = normalizeConstructionText(
          child.SECTION.DESCRIPTION || child.SECTION["~DESCRIPTION"]
        );
        const imageSrc = child.SECTION.PICTURE_SRC ? resolveImageSrc(config.public.apiOrigin, child.SECTION.PICTURE_SRC) : "";
        const points = (child.ITEMS || []).map((item) => {
          const props = item.PROPERTIES || {};
          const title2 = props.POINT_DESCRIPTION?.VALUE || "";
          const top = props.POINT_TOP?.VALUE || "";
          const left = props.POINT_LEFT?.VALUE || "";
          if (!title2 || !top || !left) return null;
          return { title: title2, top, left };
        }).filter(Boolean);
        return {
          image: {
            src: imageSrc,
            alt: child.SECTION.NAME || "Конструкция"
          },
          description: description2,
          points
        };
      });
    });
    const compoundSectionId = computed(() => {
      const value = section.value?.UF_COMPOUND_RU;
      if (!value) return "";
      return String(value).split(",").map((v) => v.trim()).filter(Boolean)[0];
    });
    const { data: compoundData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `catalog-compound-${compoundSectionId.value}`,
      () => compoundSectionId.value ? $fetch(`${config.app.baseURL}api/compound`, {
        query: {
          section_id: compoundSectionId.value,
          include_subsections: 1
        }
      }) : null,
      { watch: [compoundSectionId] }
    )), __temp = await __temp, __restore(), __temp);
    const compoundSliders = computed(() => {
      const root = compoundData.value?.data?.TREE?.[0];
      const tabs = root?.CHILDREN || [];
      return tabs.filter((tab) => {
        const type = String(
          tab.SECTION.UF_TYPE_RU || tab.SECTION["~UF_TYPE_RU"] || ""
        ).toUpperCase();
        return type === "TAB";
      }).map((tab) => {
        const slides2 = (tab.CHILDREN || []).filter((child) => {
          const type = String(
            child.SECTION.UF_TYPE_RU || child.SECTION["~UF_TYPE_RU"] || ""
          ).toUpperCase();
          return type === "ITEM" || type === "ELEMENT";
        }).map((child) => {
          const description2 = normalizeConstructionText(
            child.SECTION.DESCRIPTION || child.SECTION["~DESCRIPTION"]
          );
          const imageSrc = child.SECTION.PICTURE_SRC ? resolveImageSrc(config.public.apiOrigin, child.SECTION.PICTURE_SRC) : "";
          const points = (child.ITEMS || []).map((item) => {
            const props = item.PROPERTIES || {};
            const title2 = props.POINT_DESCRIPTION?.VALUE || "";
            const top = props.POINT_TOP?.VALUE || "";
            const left = props.POINT_LEFT?.VALUE || "";
            if (!title2 || !top || !left) return null;
            return { title: title2, top, left };
          }).filter(Boolean);
          return {
            image: {
              src: imageSrc,
              alt: child.SECTION.NAME || "Способ соединения"
            },
            description: description2,
            points
          };
        });
        return {
          button: tab.SECTION.NAME || "Способ",
          slides: slides2
        };
      }).filter((tab) => tab.slides.length > 0);
    });
    const sectionChildren = computed(() => {
      return sectionData.value?.data?.CHILDREN || [];
    });
    const treeChildren = computed(() => {
      return treeNode.value?.CHILDREN || [];
    });
    const variantChildren = computed(() => {
      if (treeChildren.value.length > 0) return treeChildren.value;
      return sectionChildren.value;
    });
    const resolveNodeType = (node) => {
      return resolveSectionType(
        node.SECTION,
        node.ITEMS || []
      );
    };
    const viewSections = computed(() => {
      return variantChildren.value.filter((child) => resolveNodeType(child) === "VIEW");
    });
    const collectVariantSections = (nodes, parentSegments = []) => {
      const result = [];
      for (const node of nodes) {
        const nodeCode = resolveSectionCode(node.SECTION);
        const nextSegments = nodeCode ? [...parentSegments, nodeCode] : parentSegments;
        if ((node.ITEMS || []).length > 0) {
          result.push({
            SECTION: node.SECTION,
            ITEMS: node.ITEMS,
            pathSegments: nextSegments
          });
        }
        if (node.CHILDREN?.length) {
          result.push(...collectVariantSections(node.CHILDREN, nextSegments));
        }
      }
      return result;
    };
    const buildCatalogSection = (node) => {
      const nodeCode = resolveSectionCode(node.SECTION);
      const sectionSegments = node.pathSegments && node.pathSegments.length > 0 ? node.pathSegments : nodeCode ? [nodeCode] : [];
      const currentSegments = pathSegments.value;
      const tailMatches = sectionSegments.length > 0 && currentSegments.slice(-sectionSegments.length).join("/") === sectionSegments.join("/");
      const baseSegments = tailMatches ? currentSegments : [...currentSegments, ...sectionSegments];
      const basePath = baseSegments.filter(Boolean).join("/");
      const listPageProps = collectListPageProperties(node.ITEMS || []);
      const titleList2 = listPageProps.map((item) => `${item.name}:`);
      const cards = (node.ITEMS || []).map((item) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          listPageProps
        ),
        href: withBasePath2(
          `/catalog/${basePath}/${item.CODE || item["~CODE"] || ""}`
        )
      }));
      return {
        title: node.SECTION.NAME ? ["Каталог", node.SECTION.NAME] : ["Каталог"],
        titleList: titleList2,
        slides: chunkArray(cards, 7)
      };
    };
    computed(() => {
      if (viewSections.value.length > 0) {
        return viewSections.value.map(buildCatalogSection);
      }
      const variantSections = collectVariantSections(variantChildren.value);
      if (variantSections.length > 0) {
        return variantSections.map(buildCatalogSection);
      }
      if (items.value.length > 0) {
        return [
          buildCatalogSection({
            SECTION: section.value,
            ITEMS: items.value
          })
        ];
      }
      return [];
    });
    const listPageProperties = computed(
      () => collectListPageProperties(items.value).slice(0, 6)
    );
    const titleList = computed(
      () => listPageProperties.value.map((item) => `${item.name}:`)
    );
    const slides = computed(() => {
      const cards = items.value.map((item) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          listPageProperties.value
        ),
        href: withBasePath2(
          `/catalog/${pathString.value}/${item.CODE || item["~CODE"] || ""}`
        )
      }));
      return chunkArray(cards, 3);
    });
    const heroTitle2 = computed(() => section.value?.NAME || "");
    const heroDescriptions = computed(() => {
      const description2 = section.value?.DESCRIPTION;
      if (!description2) return [];
      return [decodeHtml(description2)];
    });
    const heroMeasures = computed(() => {
      const values = mapListPageAggregates(items.value, listPageProperties.value);
      return listPageProperties.value.map((prop, index2) => ({
        title: `${prop.name}:`,
        value: values[index2] || ""
      })).filter((item) => item.value !== "");
    });
    const viewPicture = computed(() => {
      const src = section.value?.PICTURE_SRC;
      return src ? resolveImageSrc(config.public.apiOrigin, src) : "";
    });
    const tableViewSections = computed(() => {
      return variantChildren.value.map((child) => {
        const code = resolveSectionCode(child.SECTION);
        if (!code) return null;
        return { node: child, pathSegments: [...pathSegments.value, code] };
      }).filter(Boolean);
    });
    const viewIds = computed(
      () => tableViewSections.value.map((entry2) => entry2.node.SECTION.ID).join(",")
    );
    const { data: viewDetailsData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      () => `catalog-view-items-${pathString.value}-${viewIds.value}`,
      async () => {
        if (!viewIds.value) return [];
        const entries = tableViewSections.value;
        const responses = await Promise.all(
          entries.map(
            (entry2) => $fetch(`${config.app.baseURL}api/products`, {
              query: { section_id: entry2.node.SECTION.ID }
            })
          )
        );
        return responses.map((res, index2) => ({
          entry: entries[index2],
          section: res.data?.SECTION || entries[index2].node.SECTION,
          items: res.data?.ITEMS || []
        }));
      },
      { watch: [viewIds] }
    )), __temp = await __temp, __restore(), __temp);
    const tableAllItems = computed(() => {
      const list = viewDetailsData.value || [];
      const seen = /* @__PURE__ */ new Set();
      const result = [];
      for (const entry2 of list) {
        for (const item of entry2.items || []) {
          const id = String(item.ID || item.CODE || item["~CODE"] || "");
          if (id && seen.has(id)) continue;
          if (id) seen.add(id);
          result.push(item);
        }
      }
      return result;
    });
    const tableProperties = computed(() => {
      const list = collectListPageProperties(tableAllItems.value);
      if (list.length > 0) return list.slice(0, tableRowLimit);
      const map = /* @__PURE__ */ new Map();
      for (const item of tableAllItems.value) {
        const props = item.PROPERTIES || {};
        for (const [key, prop] of Object.entries(props)) {
          const code = prop?.CODE || key;
          if (!code) continue;
          if (!map.has(code)) {
            map.set(code, {
              code,
              name: prop?.NAME || code,
              sort: Number(prop?.SORT || 0)
            });
          }
        }
      }
      return Array.from(map.values()).sort((a, b) => a.sort - b.sort).slice(0, tableRowLimit);
    });
    const tableTitles = computed(() => {
      const resolveTitle = (code, name) => {
        const upper = code.toUpperCase();
        if (upper.includes("DIAMETR")) return "Диаметр изделия:";
        if (upper.includes("SDR")) return "SDR изделия:";
        if (upper.includes("GOST")) return "ГОСТ изделия:";
        if (upper.includes("TU") || upper.includes("SPEC")) return "ТУ изделия:";
        if (upper.includes("MATERIAL")) return "Материал изделия:";
        return name ? `${name}:` : "";
      };
      const titles = tableProperties.value.map(
        (item) => resolveTitle(item.code, item.name)
      );
      if (titles.length >= tableRowLimit) return titles.slice(0, tableRowLimit);
      return titles.concat(Array(tableRowLimit - titles.length).fill(""));
    });
    const itemDetailsList = computed(() => {
      const props = currentItem.value?.PROPERTIES;
      const list = collectListPageProperties([{ PROPERTIES: props || {} }]);
      return list.map((item) => ({
        title: `${item.name}:`,
        value: props?.[item.code]?.VALUE === void 0 || props?.[item.code]?.VALUE === null || props?.[item.code]?.VALUE === "" ? "" : String(props?.[item.code]?.VALUE)
      })).filter((item) => item.value !== "");
    });
    const itemSlides = computed(() => {
      const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO;
      const sources = gallery?.SRC || gallery?.FILES?.map((file) => file.SRC).filter(Boolean) || [];
      const uniqueSources = sources.filter(Boolean);
      return uniqueSources.map((src) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, src),
          alt: currentItem.value?.NAME || "Изображение"
        }
      }));
    });
    const itemDocuments = computed(() => {
      const docs = currentItem.value?.PROPERTIES?.DOCUMNETS;
      const files = docs?.FILES || [];
      if (files.length > 0) {
        return files.map((file) => ({
          text: [file.ORIGINAL_NAME || "Документ"],
          size: Number.isFinite(Number(file.FILE_SIZE)) ? (Number(file.FILE_SIZE) / (1024 * 1024)).toFixed(1) : void 0,
          href: file.SRC ? resolveImageSrc(config.public.apiOrigin, file.SRC) : void 0
        }));
      }
      const rawSources = docs?.SRC ?? docs?.VALUE ?? [];
      const srcs = Array.isArray(rawSources) ? rawSources : rawSources ? [rawSources] : [];
      const normalized = srcs.map((src) => {
        if (typeof src === "string") return src;
        if (src && typeof src === "object") {
          const obj = src;
          return obj.SRC || "";
        }
        return "";
      }).filter(Boolean);
      return normalized.map((src) => ({
        text: ["Документ"],
        href: resolveImageSrc(config.public.apiOrigin, src)
      }));
    });
    const itemCatalogProperties = computed(() => {
      const list = collectListPageProperties(items.value);
      return list.slice(0, 6);
    });
    const itemCatalogTitleList = computed(
      () => itemCatalogProperties.value.map((item) => `${item.name}:`)
    );
    const itemOtherCards = computed(() => {
      const seen = /* @__PURE__ */ new Set();
      return items.value.filter((item) => (item.CODE || item["~CODE"] || "") !== itemCode.value).filter((item) => {
        const key = String(item.ID || item.CODE || item["~CODE"] || item.NAME || "");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      }).map((item) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          itemCatalogProperties.value
        ),
        href: withBasePath2(
          `/catalog/${sectionPathForItem.value}/${item.CODE || item["~CODE"] || ""}`
        )
      }));
    });
    const itemCatalogTitle = computed(() => {
      return section.value?.NAME ? `Другие варианты ${section.value.NAME}` : "Другие варианты";
    });
    const itemHeroTitle = computed(() => currentItem.value?.NAME || "");
    const itemHeroDesc = computed(
      () => currentItem.value?.PREVIEW_TEXT ? decodeHtml(currentItem.value.PREVIEW_TEXT) : ""
    );
    const getItemSeoValue = (key) => {
      const item = currentItem.value;
      if (!item) return "";
      const direct = item[key];
      if (typeof direct === "string" && direct.trim()) return direct.trim();
      const propValue = item.PROPERTIES?.[key]?.VALUE;
      if (typeof propValue === "string" && propValue.trim()) return propValue.trim();
      if (propValue && typeof propValue === "object" && "TEXT" in propValue && typeof propValue.TEXT === "string" && propValue.TEXT?.trim()) {
        return propValue.TEXT.trim();
      }
      return "";
    };
    const seoTitle = computed(() => {
      const itemTitle = getItemSeoValue("SEO_TITLE");
      return itemTitle || section.value?.UF_SEO_TITLE || "";
    });
    const seoDescription = computed(() => {
      const itemDescription = getItemSeoValue("SEO_DESCRIPTION");
      return itemDescription || section.value?.UF_SEO_DESCRIPTION || "";
    });
    const collectPropertyValues = (list, code) => {
      const values = /* @__PURE__ */ new Set();
      for (const item of list) {
        const raw = item.PROPERTIES?.[code]?.VALUE;
        if (raw === void 0 || raw === null || raw === "") continue;
        values.add(String(raw).trim());
      }
      const result = Array.from(values);
      const numeric = result.map((value) => Number(String(value).replace(",", "."))).filter((value) => !Number.isNaN(value));
      if (numeric.length === result.length) {
        return result.map((value) => Number(String(value).replace(",", "."))).sort((a, b) => a - b).map((value) => String(value));
      }
      return result.sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
    };
    const formatRowValues = (values) => {
      if (values.length === 0) return [];
      const chunks = chunkArray(values, 7);
      return chunks;
    };
    const isClickableProperty = (code, name) => {
      const upper = code.toUpperCase();
      if (upper.includes("DIAMETR")) return true;
      if (upper.includes("SDR")) return true;
      if (name.toLowerCase().includes("диаметр")) return true;
      if (name.toLowerCase().includes("sdr")) return true;
      return false;
    };
    const tableClickableRows = computed(() => {
      return tableProperties.value.map(
        (prop, index2) => isClickableProperty(prop.code, prop.name) ? index2 : -1
      ).filter((index2) => index2 >= 0);
    });
    const tableDropdowns = computed(() => {
      return tableProperties.value.map((prop) => {
        if (!isClickableProperty(prop.code, prop.name)) return null;
        const values = collectPropertyValues(tableAllItems.value, prop.code);
        return values.length > 0 ? values : null;
      });
    });
    const buildItemHref = (segments, code) => {
      if (!code) return "";
      return withBasePath2(`/catalog/${segments.join("/")}/${code}`);
    };
    const buildValueLinks = (itemsList, propCode, entrySegments) => {
      const map = /* @__PURE__ */ new Map();
      for (const item of itemsList) {
        const raw = item.PROPERTIES?.[propCode]?.VALUE;
        if (raw === void 0 || raw === null || raw === "") continue;
        const value = String(raw).trim();
        const code = item.CODE || item["~CODE"] || "";
        if (!value || !code) continue;
        if (!map.has(value)) {
          map.set(value, buildItemHref(entrySegments, code));
        }
      }
      return map;
    };
    const productTableSlides = computed(() => {
      if (!isIndustry.value) return [];
      const list = viewDetailsData.value || [];
      const cards = list.filter((item) => item.items && item.items.length > 0).map((item) => {
        const itemsList = item.items;
        const sectionInfo = item.section || item.entry.node.SECTION;
        const entry2 = item.entry;
        const rows = tableProperties.value.map((prop) => {
          const values = collectPropertyValues(itemsList, prop.code);
          return formatRowValues(values);
        });
        const rowLinks = tableProperties.value.map((prop) => {
          if (!isClickableProperty(prop.code, prop.name)) return [];
          const valueLinks = buildValueLinks(itemsList, prop.code, entry2.pathSegments);
          const values = collectPropertyValues(itemsList, prop.code);
          const lines = formatRowValues(values);
          return lines.map(
            (line) => line.map((value) => valueLinks.get(value) || "")
          );
        });
        const preview = itemsList.find((item2) => item2.PREVIEW_PICTURE_SRC)?.PREVIEW_PICTURE_SRC || sectionInfo.PICTURE_SRC || "production/product-01";
        const href = withBasePath2(`/catalog/${entry2.pathSegments.join("/")}`);
        return {
          caption: {
            title: sectionInfo.NAME,
            image: {
              src: resolveImageSrc(config.public.apiOrigin, preview),
              alt: sectionInfo.NAME
            },
            href
          },
          rows,
          clickableRows: tableClickableRows.value,
          rowLinks
        };
      });
      return chunkArray(cards, 5);
    });
    const catalogItems = computed(() => {
      const list = viewDetailsData.value || [];
      const seen = /* @__PURE__ */ new Set();
      const result = [];
      for (const entry2 of list) {
        const entryPath = entry2.entry?.pathSegments || pathSegments.value;
        for (const item of entry2.items || []) {
          const id = String(item.ID || item.CODE || item["~CODE"] || "");
          if (id && seen.has(id)) continue;
          if (id) seen.add(id);
          result.push({ item, pathSegments: entryPath });
        }
      }
      return result;
    });
    const uniqueByName = (list) => {
      const seen = /* @__PURE__ */ new Set();
      return list.filter((item) => {
        const key = item.name?.toLowerCase() || item.code;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    const catalogProperties = computed(() => {
      const list = collectListPageProperties(catalogItems.value.map((entry2) => entry2.item));
      return uniqueByName(list).slice(0, 6);
    });
    const catalogTitleList = computed(
      () => catalogProperties.value.map((item) => `${item.name}:`)
    );
    const catalogSlides = computed(() => {
      const dedupeValues = (values) => {
        const seen = /* @__PURE__ */ new Set();
        return values.map((value) => {
          const key = String(value || "").trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
          if (!key) return "";
          if (seen.has(key)) return "";
          seen.add(key);
          return value;
        });
      };
      const cards = catalogItems.value.map((entry2) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, entry2.item.PREVIEW_PICTURE_SRC),
          alt: entry2.item.NAME
        },
        name: entry2.item.NAME,
        settings: dedupeValues(
          mapListPageValues(
            entry2.item.PROPERTIES,
            catalogProperties.value
          )
        ),
        href: buildItemHref(
          entry2.pathSegments,
          entry2.item.CODE || entry2.item["~CODE"] || ""
        )
      }));
      return chunkArray(cards, 7);
    });
    const breadcrumbsList = computed(() => {
      const tree = treeData.value?.data?.TREE || [];
      const nodes = resolvePathNodes(
        tree,
        isItemPage.value ? sectionSegmentsForItem.value : pathSegments.value
      );
      const trail = nodes.map((node, index2) => {
        const codes = nodes.slice(0, index2 + 1).map((item) => resolveSectionCode(item.SECTION)).filter(Boolean);
        const href = `/catalog/${codes.join("/")}`;
        return { title: node.SECTION.NAME, href };
      });
      return [
        { title: "Главная", href: "/" },
        { title: "Каталог", href: "/catalog" },
        ...trail,
        ...isItemPage.value && currentItem.value ? [
          {
            title: currentItem.value.NAME || "Товар",
            href: `/catalog/${pathSegments.value.join("/")}`
          }
        ] : []
      ];
    });
    const resolveServiceImage = (src) => {
      if (!src) return void 0;
      return { src: resolveImageSrc(config.public.apiOrigin, src), alt: "" };
    };
    const mapServiceProperties = (props) => {
      if (!props) return [];
      return Object.values(props).filter((item) => item?.NAME && item?.VALUE).map((item) => ({
        title: `${item.NAME}:`,
        value: String(item.VALUE)
      }));
    };
    const serviceSectionId = computed(() => {
      const value = section.value?.UF_SERVICES;
      if (!value) return "";
      return String(value).split(",").map((v) => v.trim()).filter(Boolean)[0];
    });
    const { data: servicesData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `catalog-services-${serviceSectionId.value}`,
      () => serviceSectionId.value ? $fetch(`${config.app.baseURL}api/services`, {
        query: { section_id: serviceSectionId.value }
      }) : null,
      { watch: [serviceSectionId] }
    )), __temp = await __temp, __restore(), __temp);
    const serviceSection = computed(() => servicesData.value?.data?.SECTION);
    const servicesList = computed(() => {
      const list = servicesData.value?.data?.ITEMS || [];
      return list.map((item) => ({
        title: [item.NAME],
        content: {
          desc: decodeHtml(item.PREVIEW_TEXT || ""),
          measures: mapServiceProperties(item.PROPERTIES)
        },
        image: resolveServiceImage(item.PREVIEW_PICTURE_SRC)
      }));
    });
    const servicesLinkTitle = computed(() => serviceSection.value?.NAME || "");
    const servicesLinkHref = computed(() => {
      const code = serviceSection.value?.CODE || serviceSection.value?.["~CODE"] || "";
      return code ? `${config.app.baseURL}services/${code}` : `${config.app.baseURL}services`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PCHero = __nuxt_component_1$3;
      const _component_PCDocuments = __nuxt_component_2$7;
      const _component_PCCatalog = __nuxt_component_3$3;
      const _component_HeroVideo = __nuxt_component_4$8;
      const _component_SHero = __nuxt_component_5$2;
      const _component_TableSection = __nuxt_component_6$1;
      const _component_CatalogSection = __nuxt_component_7;
      const _component_FittingBlock = __nuxt_component_8;
      const _component_ConstructionSection = __nuxt_component_2$b;
      const _component_PPHero = __nuxt_component_1$1;
      const _component_PPCatalog = __nuxt_component_4$1;
      const _component_ServicesBlock = __nuxt_component_3$4;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_ActionsPopup = __nuxt_component_15;
      const _component_DocumentationModal = __nuxt_component_16;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      if (unref(isItemPage)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_PCHero, {
          title: unref(itemHeroTitle),
          application: unref(itemHeroDesc),
          details: unref(itemDetailsList),
          slides: unref(itemSlides)
        }, null, _parent));
        if (unref(itemDocuments).length) {
          _push(ssrRenderComponent(_component_PCDocuments, { slides: unref(itemDocuments) }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(itemOtherCards).length) {
          _push(ssrRenderComponent(_component_PCCatalog, {
            title: unref(itemCatalogTitle),
            "title-list": unref(itemCatalogTitleList),
            "card-list": unref(itemOtherCards)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (unref(isIndustry) && unref(industrySliderSlides).length) {
          _push(ssrRenderComponent(_component_HeroVideo, { slides: unref(industrySliderSlides) }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isIndustry)) {
          _push(ssrRenderComponent(_component_SHero, {
            title: unref(heroTitle2),
            descriptions: unref(heroDescriptions),
            "image-src": unref(industryPicture)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isIndustry) && unref(productTableSlides).length) {
          _push(ssrRenderComponent(_component_TableSection, {
            title: "Варианты труб",
            titles: unref(tableTitles),
            dropdowns: unref(tableDropdowns),
            slides: unref(productTableSlides)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isIndustry) && unref(catalogSlides).length) {
          _push(ssrRenderComponent(_component_CatalogSection, {
            title: ["Каталог труб"],
            "title-list": unref(catalogTitleList),
            slides: unref(catalogSlides)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isIndustry)) {
          _push(ssrRenderComponent(_component_FittingBlock, {
            "list-item": fitting,
            "is-big-btn": true,
            title: "Фитинги"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isIndustry) && unref(constructionSlides).length) {
          _push(ssrRenderComponent(_component_ConstructionSection, {
            title: "Конструкция",
            slides: unref(constructionSlides)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!unref(isIndustry)) {
          _push(ssrRenderComponent(_component_PPHero, {
            title: unref(heroTitle2),
            descriptions: unref(heroDescriptions),
            measures: unref(heroMeasures),
            "image-src": unref(viewPicture)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!unref(isIndustry) && unref(constructionSlides).length) {
          _push(ssrRenderComponent(_component_ConstructionSection, {
            title: "Конструкция",
            slides: unref(constructionSlides)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(compoundSliders).length) {
          _push(ssrRenderComponent(_component_ConstructionSection, {
            title: "Способы соединения",
            sliders: unref(compoundSliders)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!unref(isIndustry)) {
          _push(ssrRenderComponent(_component_PPCatalog, {
            title: unref(heroTitle2) ? ["Полный каталог", unref(heroTitle2)] : ["Полный каталог"],
            "title-list": unref(titleList),
            slides: unref(slides)
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (unref(servicesList).length) {
        _push(ssrRenderComponent(_component_ServicesBlock, {
          service: { title: unref(servicesLinkTitle), href: unref(servicesLinkHref) },
          "list-items": unref(servicesList)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(seoTitle) || unref(seoDescription)) {
        _push(ssrRenderComponent(_component_SeoBlock, {
          title: unref(seoTitle),
          description: unref(seoDescription)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ActionsPopup, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_DocumentationModal, null, null, _parent));
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog/[...path].vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const ____path_$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$k
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbsList = [
      { title: "Главная", href: "/" },
      { title: "Каталог", href: "/catalog" },
      { title: "Холодное водоснабжение", href: "/solution" }
    ];
    const servicesList = [
      {
        title: ["Нанесение ППМ изоляции на стальную трубу"],
        content: {
          desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
          measures: [
            {
              title: "Толщина изоляции:",
              value: "10-100"
            },
            {
              title: "d оболочки:",
              value: "30-140"
            },
            {
              title: "Срок годности:",
              value: "20 лет"
            }
          ]
        }
      },
      {
        title: [
          "Нанесение ППМ изоляции на трубу напорную из полиэтилена повышенной термостойкости ПИКПАЙП PE-RT"
        ],
        content: {
          desc: "Для надземной прокладки теплотрасс и промышленных сетей. Обеспечивает высокую механическую прочность и стойкость к внешним воздействиям.",
          measures: [
            {
              title: "Толщина изоляции:",
              value: "10-100"
            },
            {
              title: "d оболочки:",
              value: "30-140"
            },
            {
              title: "Срок годности:",
              value: "20 лет"
            }
          ]
        }
      }
    ];
    const constructionSlides = [
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности.",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "65%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "57%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "28.5%",
            left: "71%"
          }
        ]
      },
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 1",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "45%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "77%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "18.5%",
            left: "71%"
          }
        ]
      },
      {
        image: {
          src: "construction-bg",
          alt: "Конструкция"
        },
        description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 2",
        points: [
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "65%",
            left: "23%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "57%",
            left: "68%"
          },
          {
            title: "Описание краткое на пару предложений к картинке",
            top: "28.5%",
            left: "71%"
          }
        ]
      }
    ];
    const constructionSliders = [
      {
        button: "Cпособ 1",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности.",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 1",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 2",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      },
      {
        button: "Cпособ 2",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 3",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 4",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 5",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      },
      {
        button: "Cпособ 3",
        slides: [
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 6",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 7",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "45%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "77%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "18.5%",
                left: "71%"
              }
            ]
          },
          {
            image: {
              src: "construction-bg",
              alt: "Конструкция"
            },
            description: "Наружный слой синего цвета производится из ПЭ 100-RC. Упрощает контроль повреждений трубы, а также предотвращает разрушение трубы, вызванное развитием царапин, задиров и иных повреждений внешней поверхности. 8",
            points: [
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "65%",
                left: "23%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "57%",
                left: "68%"
              },
              {
                title: "Описание краткое на пару предложений к картинке",
                top: "28.5%",
                left: "71%"
              }
            ]
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PPHero = __nuxt_component_1$1;
      const _component_ConstructionSection = __nuxt_component_2$b;
      const _component_services_block = __nuxt_component_3$4;
      const _component_PPCatalog = __nuxt_component_4$1;
      const _component_OwnCapacities = __nuxt_component_5$1;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "main" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: breadcrumbsList }, null, _parent));
      _push(ssrRenderComponent(_component_PPHero, null, null, _parent));
      _push(ssrRenderComponent(_component_ConstructionSection, {
        title: "Конструкция",
        slides: constructionSlides
      }, null, _parent));
      _push(ssrRenderComponent(_component_ConstructionSection, {
        title: "Способы соединения",
        sliders: constructionSliders
      }, null, _parent));
      _push(ssrRenderComponent(_component_services_block, {
        service: {
          title: "Нанесение ППМ изоляции",
          href: "/piktube/services"
        },
        "list-items": servicesList
      }, null, _parent));
      _push(ssrRenderComponent(_component_PPCatalog, null, null, _parent));
      _push(ssrRenderComponent(_component_OwnCapacities, null, null, _parent));
      _push(ssrRenderComponent(_component_SeoBlock, null, null, _parent));
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product-page/index.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "[...path]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const pathSegments = computed(() => normalizePathSegments(route.params.path));
    const itemCode = computed(() => pathSegments.value[pathSegments.value.length - 1] || "");
    const sectionSegments = computed(() => pathSegments.value.slice(0, -1));
    const sectionPath = computed(() => sectionSegments.value.join("/"));
    const { data: treeData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "productsTree",
      () => $fetch(`${config.app.baseURL}api/products`)
    )), __temp = await __temp, __restore(), __temp);
    const { data: sectionData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      () => `product-page-section-${sectionPath.value}`,
      () => sectionPath.value ? $fetch(`${config.app.baseURL}api/products`, {
        query: { path: sectionPath.value }
      }) : null,
      { watch: [sectionPath] }
    )), __temp = await __temp, __restore(), __temp);
    const section = computed(() => sectionData.value?.data?.SECTION);
    const items = computed(() => sectionData.value?.data?.ITEMS || []);
    const currentItem = computed(() => {
      const code = itemCode.value;
      if (!code) return void 0;
      return items.value.find((item) => (item.CODE || item["~CODE"] || "") === code);
    });
    const detailProperties = computed(() => {
      const props = currentItem.value?.PROPERTIES;
      const list = collectListPageProperties([{ PROPERTIES: props || {} }]);
      return list;
    });
    const detailsList = computed(() => {
      const props = currentItem.value?.PROPERTIES;
      return detailProperties.value.map((item) => ({
        title: `${item.name}:`,
        value: props?.[item.code]?.VALUE === void 0 || props?.[item.code]?.VALUE === null || props?.[item.code]?.VALUE === "" ? "" : String(props?.[item.code]?.VALUE)
      })).filter((item) => item.value !== "");
    });
    const slides = computed(() => {
      const gallery = currentItem.value?.PROPERTIES?.MORE_PHOTO;
      const sources = gallery?.SRC || gallery?.FILES?.map((file) => file.SRC).filter(Boolean) || [];
      const uniqueSources = sources.filter(Boolean);
      return uniqueSources.map((src) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, src),
          alt: currentItem.value?.NAME || "Изображение"
        }
      }));
    });
    const documents = computed(() => {
      const docs = currentItem.value?.PROPERTIES?.DOCUMNETS;
      const files = docs?.FILES || [];
      if (files.length > 0) {
        return files.map((file) => ({
          text: [file.ORIGINAL_NAME || "Документ"],
          size: Number.isFinite(Number(file.FILE_SIZE)) ? (Number(file.FILE_SIZE) / (1024 * 1024)).toFixed(1) : void 0,
          href: file.SRC ? resolveImageSrc(config.public.apiOrigin, file.SRC) : void 0
        }));
      }
      const rawSources = docs?.SRC ?? docs?.VALUE ?? [];
      const srcs = Array.isArray(rawSources) ? rawSources : rawSources ? [rawSources] : [];
      const normalized = srcs.map((src) => {
        if (typeof src === "string") return src;
        if (src && typeof src === "object") {
          const obj = src;
          return obj.SRC || "";
        }
        return "";
      }).filter(Boolean);
      return normalized.map((src) => ({
        text: ["Документ"],
        href: resolveImageSrc(config.public.apiOrigin, src)
      }));
    });
    const catalogProperties = computed(() => {
      const list = collectListPageProperties(items.value);
      if (list.length > 0) return list.slice(0, 6);
      const map = /* @__PURE__ */ new Map();
      for (const item of items.value) {
        const props = item.PROPERTIES || {};
        for (const [key, prop] of Object.entries(props)) {
          const code = prop?.CODE || key;
          if (!code) continue;
          if (!map.has(code)) {
            map.set(code, {
              code,
              name: prop?.NAME || code,
              sort: Number(prop?.SORT || 0)
            });
          }
        }
      }
      return Array.from(map.values()).sort((a, b) => a.sort - b.sort).slice(0, 6);
    });
    const titleList = computed(() => catalogProperties.value.map((item) => `${item.name}:`));
    const otherCards = computed(() => {
      return items.value.filter((item) => (item.CODE || item["~CODE"] || "") !== itemCode.value).map((item) => ({
        image: {
          src: resolveImageSrc(config.public.apiOrigin, item.PREVIEW_PICTURE_SRC),
          alt: item.NAME
        },
        name: item.NAME,
        settings: mapListPageValues(
          item.PROPERTIES,
          catalogProperties.value
        ),
        href: withBasePath(
          `/catalog/${sectionPath.value}/${item.CODE || item["~CODE"] || ""}`
        )
      }));
    });
    const catalogTitle = computed(() => {
      return section.value?.NAME ? `Другие варианты ${section.value.NAME}` : "Другие варианты";
    });
    const breadcrumbsList = computed(() => {
      const tree = treeData.value?.data?.TREE || [];
      const nodes = resolvePathNodes(tree, sectionSegments.value);
      const trail = nodes.map((node, index2) => {
        const codes = nodes.slice(0, index2 + 1).map((item) => resolveSectionCode(item.SECTION)).filter(Boolean);
        const href = `/catalog/${codes.join("/")}`;
        return { title: node.SECTION.NAME, href };
      });
      const currentTitle = currentItem.value?.NAME || "Товар";
      return [
        { title: "Главная", href: "/" },
        { title: "Каталог", href: "/catalog" },
        ...trail,
        { title: currentTitle, href: `/catalog/${pathSegments.value.join("/")}` }
      ];
    });
    const heroTitle2 = computed(() => currentItem.value?.NAME || "");
    const heroDesc = computed(
      () => currentItem.value?.PREVIEW_TEXT ? decodeHtml(currentItem.value.PREVIEW_TEXT) : ""
    );
    const seoTitle = computed(() => {
      const itemTitle = currentItem.value?.SEO_TITLE || "";
      return itemTitle || section.value?.UF_SEO_TITLE || "";
    });
    const seoDescription = computed(() => {
      const itemDesc = currentItem.value?.SEO_DESCRIPTION || "";
      return itemDesc || section.value?.UF_SEO_DESCRIPTION || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Breadcrumbs = __nuxt_component_0$g;
      const _component_PCHero = __nuxt_component_1$3;
      const _component_PCDocuments = __nuxt_component_2$7;
      const _component_PCCatalog = __nuxt_component_3$3;
      const _component_SeoBlock = __nuxt_component_4$2;
      const _component_ConsultationBlock = __nuxt_component_5$7;
      const _component_OrderModal = __nuxt_component_6;
      _push(`<!--[--><main class="main">`);
      _push(ssrRenderComponent(_component_Breadcrumbs, { list: unref(breadcrumbsList) }, null, _parent));
      _push(ssrRenderComponent(_component_PCHero, {
        title: unref(heroTitle2),
        application: unref(heroDesc),
        details: unref(detailsList),
        slides: unref(slides)
      }, null, _parent));
      if (unref(documents).length) {
        _push(ssrRenderComponent(_component_PCDocuments, { slides: unref(documents) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(otherCards).length) {
        _push(ssrRenderComponent(_component_PCCatalog, {
          title: unref(catalogTitle),
          "title-list": unref(titleList),
          "card-list": unref(otherCards)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(seoTitle) || unref(seoDescription)) {
        _push(ssrRenderComponent(_component_SeoBlock, {
          title: unref(seoTitle),
          description: unref(seoDescription)
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ConsultationBlock, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_component_OrderModal, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/product-page/[...path].vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const ____path_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "PromoStrip",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(true);
    function closePromoStrip() {
      isVisible.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_CloseButton = __nuxt_component_1$g;
      if (isVisible.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "promo-strip" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_Text, {
          class: "promo-strip__content",
          size: "xs",
          "line-height": "xs",
          design: "accent"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Сообщение / Уведомление. Новостная строка.`);
            } else {
              return [
                createTextVNode("Сообщение / Уведомление. Новостная строка.")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_CloseButton, {
          class: "promo-strip__close",
          size: "md",
          onClick: closePromoStrip
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PromoStrip.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$h, { __name: "PromoStrip" });
const PromoStrip = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$1
}, Symbol.toStringTag, { value: "Module" }));
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useSearch = () => {
  const isSearchActive = useState("isSearchActive", () => false);
  const openSearch = () => {
    isSearchActive.value = true;
  };
  const closeSearch = () => {
    isSearchActive.value = false;
  };
  return {
    isSearchActive: readonly(isSearchActive),
    openSearch,
    closeSearch
  };
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "SearchComponent",
  __ssrInlineRender: true,
  setup(__props) {
    const dropdownList = [
      {
        title: "Однослойная труба ПИКПАЙП",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП II",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП III",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП II",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД III",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД III",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП II",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП III",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП II",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД III",
        href: "/piktube/catalog"
      },
      {
        title: "Однослойная труба ПИКПАЙП ХАРД III",
        href: "/piktube/catalog"
      }
    ];
    const searchText = ref("");
    ref(null);
    const isDropdown = computed(() => searchText.value.toUpperCase().includes(""));
    useSearch();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_close_button = __nuxt_component_1$g;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "search" }, _attrs))}><div class="search__top"><div class="search__input"><input${ssrRenderAttr("value", unref(searchText))} class="search__input--item" type="text" placeholder="Услуги"><button class="search__input--search">`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "search__input--search_icon",
        name: "search-button"
      }, null, _parent));
      _push(`</button></div>`);
      if (!unref(searchText)) {
        _push(`<div class="search__close-btn">`);
        _push(ssrRenderComponent(_component_close_button, {
          class: "search__close-btn--icon",
          size: "md"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<button class="search__clear-btn">`);
        _push(ssrRenderComponent(_component_Icon, {
          class: "search__clear-btn--icon",
          name: "close-button"
        }, null, _parent));
        _push(`</button>`);
      }
      _push(`</div>`);
      if (unref(isDropdown) && unref(searchText)) {
        _push(`<div class="search__dropdown"><div class="search__dropdown--body"><div class="search__dropdown--list"><!--[-->`);
        ssrRenderList(dropdownList, (item, index2) => {
          _push(ssrRenderComponent(_component_Text, {
            key: index2,
            class: "search__dropdown--item",
            tag: "a",
            href: item.href,
            size: "xs",
            "line-height": "sm",
            uppercase: true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SearchComponent.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$g, { __name: "SearchComponent" });
const SearchComponent = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "none" } }, _attrs))}><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><symbol viewBox="0 0 10 6" fill="currentColor" id="icon--base-arrow" xmlns="http://www.w3.org/2000/svg"><path d="M4.46361 5.30694L0.224612 1.6252C-0.253488 1.20997 0.0818653 0.5 0.757959 0.5L9.24072 0.5C9.91682 0.5 10.2539 1.20997 9.77583 1.6252L5.53684 5.30694C5.24047 5.56435 4.75998 5.56435 4.46361 5.30694Z" fill="currentColor"></path></symbol><symbol viewBox="0 0 38 38" fill="none" id="icon--button-arrow" xmlns="http://www.w3.org/2000/svg"><rect y="38" width="38" height="38" rx="19" transform="rotate(-90 0 38)" fill="#11437A"></rect><path d="M18.4636 21.8069L14.2246 18.1252C13.7465 17.71 14.0819 17 14.758 17L23.2407 17C23.9168 17 24.2539 17.71 23.7758 18.1252L19.5368 21.8069C19.2405 22.0644 18.76 22.0644 18.4636 21.8069Z" fill="white"></path></symbol><symbol viewBox="0 0 38 38" fill="none" id="icon--button-arrow-reverse" xmlns="http://www.w3.org/2000/svg"><rect x="38" y="38" width="38" height="38" rx="19" transform="rotate(-180 38 38)" fill="white"></rect><path d="M21.8069 19.5364L18.1252 23.7754C17.71 24.2535 17 23.9181 17 23.242V14.7593C17 14.0832 17.71 13.7461 18.1252 14.2242L21.8069 18.4632C22.0644 18.7595 22.0644 19.24 21.8069 19.5364Z" fill="#11437A"></path></symbol><symbol viewBox="0 0 7 6" fill="none" id="icon--check-arrow" xmlns="http://www.w3.org/2000/svg"><path d="M1 2.5L3 4.5L6 1" stroke="#11437A"></path></symbol><symbol viewBox="0 0 13 14" fill="none" id="icon--close-button" xmlns="http://www.w3.org/2000/svg"><path d="M2 2.50098L10.9978 11.4987" stroke="currentColor" stroke-linecap="round"></path><path d="M10.9997 2.50098L2.00195 11.4987" stroke="currentColor" stroke-linecap="round"></path></symbol><symbol viewBox="0 0 18 18" fill="none" id="icon--close-button-lg" xmlns="http://www.w3.org/2000/svg"><path d="M4.05029 4.05005L13.9498 13.9495" stroke="#2E4169" stroke-linecap="square"></path><path d="M13.9497 4.05005L4.05021 13.9495" stroke="#2E4169" stroke-linecap="square"></path></symbol><symbol viewBox="0 0 9 9" fill="none" id="icon--copy-button" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="3.5" width="5" height="5" rx="0.5" stroke="currentColor"></rect><rect x="3.5" y="0.5" width="5" height="5" rx="0.5" stroke="currentColor"></rect></symbol><symbol viewBox="0 0 16 17" fill="none" id="icon--search-button" xmlns="http://www.w3.org/2000/svg"><path d="M11.5998 12.1L11.3998 12.28C11.5298 12.16 11.6498 12.04 11.7698 11.91L11.5998 12.1Z" fill="#101011"></path><path d="M7 0.5C3.13 0.5 0 3.63 0 7.5C0 11.37 3.13 14.5 7 14.5C8.75 14.5 10.35 13.85 11.58 12.79L14.935 16.145C15.1311 16.3411 15.4489 16.3411 15.645 16.145C15.8411 15.9489 15.8411 15.6311 15.645 15.435L12.29 12.08C13.35 10.85 14 9.25 14 7.5C14 3.63 10.87 0.5 7 0.5ZM7 13.5C3.69 13.5 1 10.81 1 7.5C1 4.19 3.69 1.5 7 1.5C10.31 1.5 13 4.19 13 7.5C13 10.81 10.31 13.5 7 13.5Z" fill="#101011"></path></symbol><symbol viewBox="0 0 30 30" fill="none" id="icon--vk" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#hclip0_1033_1138)"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.10883 2.10883C0 4.21766 0 7.61175 0 14.4V15.6C0 22.3883 0 25.7823 2.10883 27.8912C4.21766 30 7.61175 30 14.4 30H15.6C22.3883 30 25.7823 30 27.8912 27.8912C30 25.7823 30 22.3883 30 15.6V14.4C30 7.61175 30 4.21766 27.8912 2.10883C25.7823 0 22.3883 0 15.6 0H14.4C7.61175 0 4.21766 0 2.10883 2.10883ZM5.06257 9.12506C5.22507 16.9251 9.12506 21.6126 15.9626 21.6126H16.3501V17.1501C18.8626 17.4001 20.7625 19.2376 21.525 21.6126H25.0751C24.1001 18.0626 21.5374 16.1001 19.9374 15.3501C21.5374 14.4251 23.7874 12.1751 24.3249 9.12506H21.0999C20.3999 11.6001 18.3251 13.8501 16.3501 14.0626V9.12506H13.125V17.7751C11.125 17.2751 8.60006 14.8501 8.48756 9.12506H5.06257Z" fill="white"></path></g><defs><clipPath id="hclip0_1033_1138"><rect width="30" height="30" fill="white"></rect></clipPath></defs></symbol><symbol viewBox="0 0 30 30" fill="none" id="icon--whatsapp" xmlns="http://www.w3.org/2000/svg"><path d="M0 30L2.10875 22.2962C0.807498 20.0413 0.12375 17.485 0.125 14.8637C0.12875 6.66875 6.79749 0 14.9912 0C18.9675 0.00125 22.7 1.55 25.5074 4.36C28.3137 7.17 29.8587 10.905 29.8574 14.8775C29.8537 23.0738 23.1849 29.7425 14.9912 29.7425C12.5037 29.7413 10.0525 29.1175 7.88123 27.9325L0 30ZM8.24623 25.2413C10.3412 26.485 12.3412 27.23 14.9862 27.2313C21.7962 27.2313 27.3437 21.6887 27.3474 14.875C27.3499 8.0475 21.8287 2.5125 14.9962 2.51C8.18123 2.51 2.63749 8.0525 2.63499 14.865C2.63374 17.6462 3.44874 19.7287 4.81749 21.9075L3.56874 26.4675L8.24623 25.2413ZM22.48 18.4113C22.3875 18.2563 22.14 18.1637 21.7675 17.9775C21.3962 17.7913 19.57 16.8925 19.2287 16.7687C18.8887 16.645 18.6412 16.5825 18.3925 16.955C18.145 17.3263 17.4325 18.1637 17.2162 18.4113C17 18.6588 16.7825 18.69 16.4112 18.5037C16.04 18.3175 14.8425 17.9263 13.4237 16.66C12.32 15.675 11.5737 14.4587 11.3575 14.0863C11.1412 13.715 11.335 13.5138 11.52 13.3288C11.6875 13.1625 11.8912 12.895 12.0775 12.6775C12.2662 12.4625 12.3275 12.3075 12.4525 12.0588C12.5762 11.8113 12.515 11.5938 12.4212 11.4075C12.3275 11.2225 11.585 9.39375 11.2762 8.65C10.9737 7.92625 10.6675 8.02375 10.44 8.0125L9.72748 8C9.47998 8 9.07748 8.0925 8.73748 8.465C8.39748 8.8375 7.43748 9.735 7.43748 11.5638C7.43748 13.3925 8.76873 15.1587 8.95373 15.4062C9.13998 15.6537 11.5725 19.4062 15.2987 21.015C16.185 21.3975 16.8775 21.6262 17.4162 21.7975C18.3062 22.08 19.1162 22.04 19.7562 21.945C20.47 21.8387 21.9537 21.0462 22.2637 20.1787C22.5737 19.31 22.5737 18.5662 22.48 18.4113Z" fill="white"></path></symbol></svg></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SvgSprite.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __nuxt_component_3$2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$3]]), { __name: "SvgSprite" });
const SvgSprite = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "collapsible-text" }, _attrs))}></div>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/CollapsibleText.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const CollapsibleText = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$2]]), { __name: "CollapsibleText" });
const CollapsibleText$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CollapsibleText
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "factory" }, _attrs))}></div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blocks/Factory.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const Factory = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Factory" });
const Factory$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Factory
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "EquipmentCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    href: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "equipment-card",
        href: _ctx.href
      }, _attrs))}><div class="equipment-card__content">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "equipment-card__content--title",
        size: "xxl",
        weight: "medium",
        "line-height": "sm",
        design: "primary",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Icon, {
        class: "equipment-card__content--icon",
        name: "base-arrow",
        mode: "next"
      }, null, _parent));
      _push(`</div><div class="equipment-card__icon">`);
      _push(ssrRenderComponent(_component_Icon, {
        class: "equipment-card__icon--item",
        name: "extended",
        "is-sprite": false
      }, null, _parent));
      _push(`</div></a>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/cards/EquipmentCard.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const EquipmentCard = Object.assign(_sfc_main$c, { __name: "EquipmentCard" });
const EquipmentCard$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EquipmentCard
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-table" }, _attrs))}></div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tables/ProductTable.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const ProductTable = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender]]), { __name: "ProductTable" });
const ProductTable$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProductTable
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "NavBtn",
  __ssrInlineRender: true,
  props: {
    text: {},
    href: {},
    icon: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(ssrRenderComponent(_component_Text, mergeProps({
        class: "nav-btn",
        tag: "a",
        size: "xs",
        "line-height": "xs",
        design: "accent",
        uppercase: true,
        href: props.href
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.text)} `);
            if (props.icon) {
              _push2(ssrRenderComponent(_component_Icon, { name: "base-arrow" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(toDisplayString(props.text) + " ", 1),
              props.icon ? (openBlock(), createBlock(_component_Icon, {
                key: 0,
                name: "base-arrow"
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/NavBtn.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$a, { __name: "NavBtn" });
const NavBtn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "NavLink",
  __ssrInlineRender: true,
  props: {
    text: {},
    href: {},
    icon: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      const _component_Icon = __nuxt_component_0$i;
      _push(ssrRenderComponent(_component_Text, mergeProps({
        class: "nav-link",
        tag: "a",
        size: "xs",
        "line-height": "xs",
        uppercase: true,
        href: props.href
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.text)} `);
            if (props.icon) {
              _push2(ssrRenderComponent(_component_Icon, { name: "base-arrow" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(toDisplayString(props.text) + " ", 1),
              props.icon ? (openBlock(), createBlock(_component_Icon, {
                key: 0,
                name: "base-arrow"
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/base/NavLink.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const NavLink = Object.assign(_sfc_main$9, { __name: "NavLink" });
const NavLink$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NavLink
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "FooterList",
  __ssrInlineRender: true,
  props: {
    title: {},
    href: {},
    list: {}
  },
  setup(__props) {
    const props = __props;
    const isComplex = props.list ? true : false;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["footer-list", { "footer-list_complex": unref(isComplex) }]
      }, _attrs))}><div class="footer-list__top">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "footer-list__title",
        tag: "a",
        href: props.href,
        uppercase: true,
        size: "sm",
        "line-height": "xl",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(isComplex)) {
        _push(`<ul class="footer-list__list"><!--[-->`);
        ssrRenderList(props.list, (item, index2) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_Text, {
            class: "footer-list__list--link",
            tag: "a",
            design: "accent",
            href: item.href,
            uppercase: true
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/footer/FooterList.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_2$2 = Object.assign(_sfc_main$8, { __name: "FooterList" });
const FooterList = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "FooterCard",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "footer-card" }, _attrs))}><div class="footer-card__top">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: props.icon,
        "is-sprite": false
      }, null, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "footer-card__title",
        tag: "span",
        "line-height": "xs",
        design: "accent",
        uppercase: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/footer/FooterCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_3$1 = Object.assign(_sfc_main$7, { __name: "FooterCard" });
const FooterCard = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: menuData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "menu",
      () => $fetch(`${config.app.baseURL}api/menu`)
    )), __temp = await __temp, __restore(), __temp);
    const basePrefix = config.app.baseURL.replace(/\/$/, "");
    const resolveHref = (name, url) => {
      const map = {
        "О компании": "/about",
        "О нас": "/about",
        Новости: "/news",
        Награды: "/awards",
        Реквизиты: "/details",
        Продукция: "/catalog",
        Услуги: "/services",
        Фитинги: "/",
        Лаборатория: "/lab",
        Проектировщики: "/pro",
        Проектировщикам: "/pro",
        Контакты: "/contacts"
      };
      const fromMap = name ? map[name] : void 0;
      const raw = fromMap || url || "#";
      if (/^https?:\/\//.test(raw)) return raw;
      if (raw.startsWith("/")) return `${basePrefix}${raw}`;
      return raw;
    };
    const buildFooterEntries = () => {
      const tree = menuData.value?.data?.TREE || [];
      const rootItems = menuData.value?.data?.ROOT_ITEMS || [];
      const sections = tree.map((section) => {
        const sectionTitle = section.SECTION?.NAME || "";
        const sectionHref = resolveHref(sectionTitle, section.SECTION?.UF_URL_TO);
        const childSections = (section.CHILDREN || []).slice().sort(
          (a, b) => Number(a.SECTION?.SORT || 0) - Number(b.SECTION?.SORT || 0)
        ).map((child) => ({
          title: child.SECTION?.NAME || "",
          href: resolveHref(
            child.SECTION?.NAME,
            child.SECTION?.UF_URL_TO || section.SECTION?.UF_URL_TO
          )
        })).filter((item) => item.title);
        const items = (section.ITEMS || []).slice().sort((a, b) => Number(a.SORT || 0) - Number(b.SORT || 0)).map((item) => ({
          title: item.NAME || "",
          href: resolveHref(item.NAME, section.SECTION?.UF_URL_TO)
        })).filter((item) => item.title);
        const list = childSections.length ? childSections : items;
        return {
          title: sectionTitle,
          href: sectionHref,
          list: list.length ? list : void 0,
          sort: Number(section.SECTION?.SORT || 0)
        };
      });
      const roots = rootItems.map((item) => ({
        title: item.NAME || "",
        href: resolveHref(item.NAME),
        sort: Number(item.SORT || 0)
      }));
      return [...sections, ...roots].filter((item) => item.title);
    };
    const footerEntries = computed(
      () => buildFooterEntries().sort((a, b) => a.sort - b.sort)
    );
    const splitIndex = computed(() => Math.ceil(footerEntries.value.length / 2));
    const footerTopList = computed(
      () => footerEntries.value.slice(0, splitIndex.value)
    );
    const footerBottomList = computed(
      () => footerEntries.value.slice(splitIndex.value)
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_Image = __nuxt_component_1$n;
      const _component_FooterList = __nuxt_component_2$2;
      const _component_FooterCard = __nuxt_component_3$1;
      const _component_CopyLink = __nuxt_component_3$f;
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))}><div class="footer__container"><div class="container">`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "footer__wrap",
        position: "top",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="footer__top"${_scopeId}><a href="#" class="footer__logo"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Image, {
              class: "footer__logo--item",
              src: "footer-logo",
              alt: "Производственная Изоляционная Компания"
            }, null, _parent2, _scopeId));
            _push2(`</a><div class="footer__list"${_scopeId}><div class="footer__list--top"${_scopeId}><!--[-->`);
            ssrRenderList(unref(footerTopList), (item) => {
              _push2(ssrRenderComponent(_component_FooterList, mergeProps({
                key: item.title
              }, { ref_for: true }, item), null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="footer__list--bottom"${_scopeId}><!--[-->`);
            ssrRenderList(unref(footerBottomList), (item) => {
              _push2(ssrRenderComponent(_component_FooterList, mergeProps({
                key: item.title
              }, { ref_for: true }, item), null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></div><div class="footer__cards"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_FooterCard, {
              class: "footer__card footer__activity",
              icon: "activity",
              title: "деятельность"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="footer__activity--content"${_scopeId2}><p class="footer__card--text"${_scopeId2}> Лауреат награды «100 лучших <br${_scopeId2}>товаров России» </p><p class="footer__card--text"${_scopeId2}>Член АПТС</p><p class="footer__card--text"${_scopeId2}>Член РАВВ</p><p class="footer__card--text"${_scopeId2}>Участник ГИСП</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "footer__activity--content" }, [
                      createVNode("p", { class: "footer__card--text" }, [
                        createTextVNode(" Лауреат награды «100 лучших "),
                        createVNode("br"),
                        createTextVNode("товаров России» ")
                      ]),
                      createVNode("p", { class: "footer__card--text" }, "Член АПТС"),
                      createVNode("p", { class: "footer__card--text" }, "Член РАВВ"),
                      createVNode("p", { class: "footer__card--text" }, "Участник ГИСП")
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FooterCard, {
              class: "footer__card footer__address",
              icon: "address",
              title: "Адрес"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="footer__address--content"${_scopeId2}><p class="footer__card--text"${_scopeId2}> Россия, Москва, <br${_scopeId2}>Котельническая набережная <br${_scopeId2}>д.17 </p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "footer__address--content" }, [
                      createVNode("p", { class: "footer__card--text" }, [
                        createTextVNode(" Россия, Москва, "),
                        createVNode("br"),
                        createTextVNode("Котельническая набережная "),
                        createVNode("br"),
                        createTextVNode("д.17 ")
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_FooterCard, {
              class: "footer__card footer__contacts",
              icon: "contacts",
              title: "Контакты"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="footer__contacts--content"${_scopeId2}><div class="footer__contacts--content_top"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_CopyLink, {
                    mode: "accent",
                    text: "8 (800) 250-9288",
                    href: "tel:+78002509288"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CopyLink, {
                    mode: "accent",
                    text: "zakaz@piktube.ru",
                    href: "mailto:zakaz@piktube.ru"
                  }, null, _parent3, _scopeId2));
                  _push3(`</div><div class="footer__contacts--socials"${_scopeId2}><a class="footer__contacts--socials_item" href="https://vk.com/piktube" target="_blank"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, { name: "vk" }, null, _parent3, _scopeId2));
                  _push3(`</a><a class="footer__contacts--socials_item" href="https://wa.me/78002509288" target="_blank"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Icon, { name: "whatsapp" }, null, _parent3, _scopeId2));
                  _push3(`</a></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "footer__contacts--content" }, [
                      createVNode("div", { class: "footer__contacts--content_top" }, [
                        createVNode(_component_CopyLink, {
                          mode: "accent",
                          text: "8 (800) 250-9288",
                          href: "tel:+78002509288"
                        }),
                        createVNode(_component_CopyLink, {
                          mode: "accent",
                          text: "zakaz@piktube.ru",
                          href: "mailto:zakaz@piktube.ru"
                        })
                      ]),
                      createVNode("div", { class: "footer__contacts--socials" }, [
                        createVNode("a", {
                          class: "footer__contacts--socials_item",
                          href: "https://vk.com/piktube",
                          target: "_blank"
                        }, [
                          createVNode(_component_Icon, { name: "vk" })
                        ]),
                        createVNode("a", {
                          class: "footer__contacts--socials_item",
                          href: "https://wa.me/78002509288",
                          target: "_blank"
                        }, [
                          createVNode(_component_Icon, { name: "whatsapp" })
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "footer__top" }, [
                createVNode("a", {
                  href: "#",
                  class: "footer__logo"
                }, [
                  createVNode(_component_Image, {
                    class: "footer__logo--item",
                    src: "footer-logo",
                    alt: "Производственная Изоляционная Компания"
                  })
                ]),
                createVNode("div", { class: "footer__list" }, [
                  createVNode("div", { class: "footer__list--top" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(footerTopList), (item) => {
                      return openBlock(), createBlock(_component_FooterList, mergeProps({
                        key: item.title
                      }, { ref_for: true }, item), null, 16);
                    }), 128))
                  ]),
                  createVNode("div", { class: "footer__list--bottom" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(footerBottomList), (item) => {
                      return openBlock(), createBlock(_component_FooterList, mergeProps({
                        key: item.title
                      }, { ref_for: true }, item), null, 16);
                    }), 128))
                  ])
                ])
              ]),
              createVNode("div", { class: "footer__cards" }, [
                createVNode(_component_FooterCard, {
                  class: "footer__card footer__activity",
                  icon: "activity",
                  title: "деятельность"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "footer__activity--content" }, [
                      createVNode("p", { class: "footer__card--text" }, [
                        createTextVNode(" Лауреат награды «100 лучших "),
                        createVNode("br"),
                        createTextVNode("товаров России» ")
                      ]),
                      createVNode("p", { class: "footer__card--text" }, "Член АПТС"),
                      createVNode("p", { class: "footer__card--text" }, "Член РАВВ"),
                      createVNode("p", { class: "footer__card--text" }, "Участник ГИСП")
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_FooterCard, {
                  class: "footer__card footer__address",
                  icon: "address",
                  title: "Адрес"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "footer__address--content" }, [
                      createVNode("p", { class: "footer__card--text" }, [
                        createTextVNode(" Россия, Москва, "),
                        createVNode("br"),
                        createTextVNode("Котельническая набережная "),
                        createVNode("br"),
                        createTextVNode("д.17 ")
                      ])
                    ])
                  ]),
                  _: 1
                }),
                createVNode(_component_FooterCard, {
                  class: "footer__card footer__contacts",
                  icon: "contacts",
                  title: "Контакты"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "footer__contacts--content" }, [
                      createVNode("div", { class: "footer__contacts--content_top" }, [
                        createVNode(_component_CopyLink, {
                          mode: "accent",
                          text: "8 (800) 250-9288",
                          href: "tel:+78002509288"
                        }),
                        createVNode(_component_CopyLink, {
                          mode: "accent",
                          text: "zakaz@piktube.ru",
                          href: "mailto:zakaz@piktube.ru"
                        })
                      ]),
                      createVNode("div", { class: "footer__contacts--socials" }, [
                        createVNode("a", {
                          class: "footer__contacts--socials_item",
                          href: "https://vk.com/piktube",
                          target: "_blank"
                        }, [
                          createVNode(_component_Icon, { name: "vk" })
                        ]),
                        createVNode("a", {
                          class: "footer__contacts--socials_item",
                          href: "https://wa.me/78002509288",
                          target: "_blank"
                        }, [
                          createVNode(_component_Icon, { name: "whatsapp" })
                        ])
                      ])
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="footer__bottom"><div class="footer__bottom--content">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "footer__bottom--content_top",
        size: "sm",
        "line-height": "xl",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Сделано в Дзен.Дизайн`);
          } else {
            return [
              createTextVNode("Сделано в Дзен.Дизайн")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="footer__bottom--content_wrap"><div class="footer__bottom--content_inner">`);
      _push(ssrRenderComponent(_component_Text, {
        class: "footer__bottom--content_link",
        tag: "a",
        href: "/piktube/public-offer",
        size: "sm",
        "line-height": "xl",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Политика конфиденциальности`);
          } else {
            return [
              createTextVNode("Политика конфиденциальности")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Text, {
        class: "footer__bottom--content_link",
        tag: "a",
        href: "/piktube/public-offer",
        size: "sm",
        "line-height": "xl",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Публичная оферта`);
          } else {
            return [
              createTextVNode("Публичная оферта")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Text, {
        class: "footer__copyright",
        tag: "small",
        size: "sm",
        "line-height": "xl",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`2024 © &quot;PIKTUBE&quot;`);
          } else {
            return [
              createTextVNode('2024 © "PIKTUBE"')
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><a class="footer__bottom--btn" href="#">`);
      _push(ssrRenderComponent(_component_Icon, { name: "base-arrow" }, null, _parent));
      _push(`</a></div></div></div></footer>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/footer/Footer.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2$1 = Object.assign(_sfc_main$6, { __name: "Footer" });
const Footer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "HeaderNav",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const { data: menuData } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "menu",
      () => $fetch(`${config.app.baseURL}api/menu`)
    )), __temp = await __temp, __restore(), __temp);
    const basePrefix = config.app.baseURL.replace(/\/$/, "");
    const resolveHref = (name, url) => {
      const map = {
        "О компании": "/about",
        "О нас": "/about",
        Новости: "/news",
        Награды: "/awards",
        Реквизиты: "/details",
        Продукция: "/catalog",
        Услуги: "/services",
        Фитинги: "/",
        Лаборатория: "/lab",
        Проектировщики: "/pro",
        Проектировщикам: "/pro",
        Контакты: "/contacts"
      };
      const fromMap = name ? map[name] : void 0;
      const raw = fromMap || url || "#";
      if (/^https?:\/\//.test(raw)) return raw;
      if (raw.startsWith("/")) return `${basePrefix}${raw}`;
      return raw;
    };
    const menuItems = computed(() => {
      const tree = menuData.value?.data?.TREE || [];
      const rootItems = menuData.value?.data?.ROOT_ITEMS || [];
      const sections = tree.map((section, index2) => ({
        text: section.SECTION?.NAME || "",
        href: resolveHref(section.SECTION?.NAME, section.SECTION?.UF_URL_TO),
        sort: Number(section.SECTION?.SORT || 0),
        index: index2,
        hasChildren: (section.ITEMS?.length || 0) > 0 || (section.CHILDREN?.length || 0) > 0
      }));
      const roots = rootItems.map((item, index2) => ({
        text: item.NAME || "",
        href: resolveHref(item.NAME),
        sort: Number(item.SORT || 0),
        index: tree.length + index2,
        hasChildren: false
      }));
      return [...sections, ...roots].filter((item) => item.text).sort((a, b) => a.sort - b.sort || a.index - b.index);
    });
    const splitIndex = computed(() => {
      const total = menuItems.value.length;
      if (total <= 1) return total;
      return Math.floor(total / 2);
    });
    const navTopList = computed(
      () => menuItems.value.slice(0, splitIndex.value).map((item) => ({
        text: item.text,
        href: item.href,
        icon: item.hasChildren
      }))
    );
    const navBottomList = computed(
      () => menuItems.value.slice(splitIndex.value).map((item) => ({
        text: item.text,
        href: item.href,
        icon: false
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavBtn = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "header-nav" }, _attrs))}><div class="header-nav__top"><ul class="header-nav__top--list"><!--[-->`);
      ssrRenderList(unref(navTopList), (item) => {
        _push(`<li class="header-nav__top--item">`);
        _push(ssrRenderComponent(_component_NavBtn, mergeProps({ ref_for: true }, item), null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div><div class="header-nav__bottom"><ul class="header-nav__bottom--list"><!--[-->`);
      ssrRenderList(unref(navBottomList), (item) => {
        _push(`<li class="header-nav__bottom--item">`);
        _push(ssrRenderComponent(NavLink, mergeProps({ ref_for: true }, item), null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></nav>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/header/HeaderNav.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$5, { __name: "HeaderNav" });
const HeaderNav = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HeaderActions",
  __ssrInlineRender: true,
  setup(__props) {
    const language = ref("РУ");
    const { isSearchActive } = useSearch();
    const languageList = ref(["РУ", "EN"]);
    const dropdownIsVisible = ref(false);
    function selectLanguage(selectedLang) {
      language.value = selectedLang;
      dropdownIsVisible.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$i;
      const _component_Text = __nuxt_component_4$b;
      const _component_BorderLine = __nuxt_component_2$n;
      const _component_CopyLink = __nuxt_component_3$f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "header-actions" }, _attrs))}><div class="header-actions__wrap"><button class="${ssrRenderClass([{ "search-active": unref(isSearchActive) }, "header-actions__search"])}">`);
      _push(ssrRenderComponent(_component_Icon, { name: "search-button" }, null, _parent));
      _push(`</button><div class="${ssrRenderClass([{ "header-actions__language_active": unref(dropdownIsVisible) }, "header-actions__language"])}">`);
      _push(ssrRenderComponent(_component_Text, {
        tag: "span",
        size: "sm",
        "line-height": "xl",
        design: "secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(language))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(language)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Icon, { name: "base-arrow" }, null, _parent));
      _push(`<div class="header-actions__language--list"><!--[-->`);
      ssrRenderList(unref(languageList), (value) => {
        _push(ssrRenderComponent(_component_Text, {
          key: value,
          class: [
            "header-actions__language--list_item",
            value === unref(language) ? "header-actions__language--list_item_active" : ""
          ],
          tag: "span",
          size: "sm",
          "line-height": "sm",
          onClick: ($event) => selectLanguage(value)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(value), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></div>`);
      _push(ssrRenderComponent(_component_BorderLine, {
        class: "header-actions__links",
        position: "left",
        design: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CopyLink, {
              text: "8 (800) 250-9288",
              href: "tel:+78002509288"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CopyLink, {
              text: "zakaz@piktube.ru",
              href: "mailto:zakaz@piktube.ru"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_CopyLink, {
                text: "8 (800) 250-9288",
                href: "tel:+78002509288"
              }),
              createVNode(_component_CopyLink, {
                text: "zakaz@piktube.ru",
                href: "mailto:zakaz@piktube.ru"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/header/HeaderActions.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$4, { __name: "HeaderActions" });
const HeaderActions = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const menuBtnText = ref("меню");
    const menuIsVisible = ref(false);
    const { isSearchActive } = useSearch();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$h;
      const _component_Image = __nuxt_component_1$n;
      const _component_HeaderNav = __nuxt_component_2;
      const _component_HeaderActions = __nuxt_component_3;
      const _component_Text = __nuxt_component_4$b;
      const _component_SearchComponent = __nuxt_component_5;
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["header", { "search-active": unref(isSearchActive) }]
      }, _attrs))}><div class="header__container">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "header__logo",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Image, {
              class: "header__logo--item",
              src: "logo",
              alt: "Производственная Изоляционная Компания"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Image, {
                class: "header__logo--item",
                src: "logo",
                alt: "Производственная Изоляционная Компания"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="header__nav">`);
      _push(ssrRenderComponent(_component_HeaderNav, null, null, _parent));
      _push(`</div><div class="header__right"><div class="header__actions">`);
      _push(ssrRenderComponent(_component_HeaderActions, null, null, _parent));
      _push(`</div><button class="header__menu-btn">`);
      _push(ssrRenderComponent(_component_Text, {
        tag: "span",
        uppercase: true,
        size: "xs",
        design: "accent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(menuBtnText))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(menuBtnText)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</button></div>`);
      if (unref(isSearchActive)) {
        _push(`<div class="header__search">`);
        _push(ssrRenderComponent(_component_SearchComponent, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([{
        header__menu_active: unref(menuIsVisible)
      }, "header__menu"])}"><div class="header__menu--top">`);
      if (!unref(isSearchActive)) {
        _push(ssrRenderComponent(_component_HeaderActions, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(isSearchActive)) {
        _push(ssrRenderComponent(_component_HeaderNav, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(isSearchActive)) {
        _push(ssrRenderComponent(_component_SearchComponent, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/layout/header/Header.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$3, { __name: "Header" });
const Header = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PromoStrip = __nuxt_component_0$1;
      const _component_Header = __nuxt_component_1;
      const _component_Footer = __nuxt_component_2$1;
      const _component_SvgSprite = __nuxt_component_3$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_PromoStrip, null, null, _parent));
      _push(ssrRenderComponent(_component_Header, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(`<div class="overlay js-overlay"></div>`);
      _push(ssrRenderComponent(_component_SvgSprite, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = {
  __name: "error-404",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    statusCode: {
      type: Number,
      default: 404
    },
    statusMessage: {
      type: String,
      default: "Page not found"
    },
    description: {
      type: String,
      default: "Sorry, the page you are looking for could not be found."
    },
    backHome: {
      type: String,
      default: "Go back home"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [
        {
          innerHTML: `!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();`
        }
      ],
      style: [
        {
          innerHTML: `*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide" }, _attrs))} data-v-b728498f><div class="max-w-520px text-center" data-v-b728498f><h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]" data-v-b728498f>${ssrInterpolate(__props.statusCode)}</h1><h2 class="font-semibold mb-2 sm:text-3xl text-2xl" data-v-b728498f>${ssrInterpolate(__props.statusMessage)}</h2><p class="mb-4 px-2 text-[#64748B] text-md" data-v-b728498f>${ssrInterpolate(__props.description)}</p><div class="flex items-center justify-center w-full" data-v-b728498f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-medium hover:text-[#00DC82] text-sm underline underline-offset-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/error-404.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const error404 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b728498f"]]);
const error404$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: error404
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "error-500",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    statusCode: {
      type: Number,
      default: 500
    },
    statusMessage: {
      type: String,
      default: "Internal server error"
    },
    description: {
      type: String,
      default: "This page is temporarily unavailable."
    },
    refresh: {
      type: String,
      default: "Refresh this page"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [
        {
          innerHTML: `!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();`
        }
      ],
      style: [
        {
          innerHTML: `*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide" }, _attrs))} data-v-70d84538><div class="max-w-520px text-center" data-v-70d84538><h1 class="font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]" data-v-70d84538>${ssrInterpolate(__props.statusCode)}</h1><h2 class="font-semibold mb-2 sm:text-3xl text-2xl" data-v-70d84538>${ssrInterpolate(__props.statusMessage)}</h2><p class="mb-4 px-2 text-[#64748B] text-md" data-v-70d84538>${ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/error-500.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const error500 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-70d84538"]]);
const error500$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: error500
}, Symbol.toStringTag, { value: "Module" }));

export { entry$1 as default };
//# sourceMappingURL=server.mjs.map
