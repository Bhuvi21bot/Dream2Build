"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// package.json
var version = "0.5.21";

// src/cartographer.ts
var _promises = require('fs/promises'); var _promises2 = _interopRequireDefault(_promises);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _url = require('url');
var _parser = require('@babel/parser');
var _magicstring = require('magic-string'); var _magicstring2 = _interopRequireDefault(_magicstring);

// src/constants.ts
var DATA_ATTRIBUTES = {
  METADATA: "data-replit-metadata",
  COMPONENT_NAME: "data-component-name"
};
var R3F_IMPORT_SOURCES = /* @__PURE__ */ new Set([
  "@react-three/fiber",
  "@react-three/drei",
  "react-three-fiber"
]);
var R3F_BAILOUT_ELEMENTS = /* @__PURE__ */ new Set([
  "Canvas",
  // Top-level R3F component
  "mesh",
  "group",
  "scene",
  "primitive",
  "points",
  "instancedMesh",
  "fog",
  "fogExp2",
  "object3D"
]);
var R3F_BAILOUT_PATTERNS = [
  /Geometry$/,
  /Material$/,
  /Light$/,
  /Camera$/,
  /Helper$/,
  /Control$/
];

// src/theme/parseThemeTokens.ts
var MULTI_SEGMENT_NAMESPACES = [
  "font-weight",
  "text-shadow",
  "inset-shadow",
  "drop-shadow"
];
function splitNamespace(name) {
  const bare = name.slice(2);
  const ns = _nullishCoalesce(MULTI_SEGMENT_NAMESPACES.find((m) => bare.startsWith(`${m}-`)), () => ( bare.split("-", 1)[0]));
  return { ns, suffix: bare.slice(ns.length + 1) };
}
function parseThemeTokens(css) {
  try {
    const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+?)\s*(?:;|$)/g;
    const source = {};
    let found = false;
    let searchFrom = 0;
    while (true) {
      const keywordIndex = stripped.indexOf("@theme", searchFrom);
      if (keywordIndex === -1) {
        break;
      }
      const openBrace = stripped.indexOf("{", keywordIndex);
      if (openBrace === -1) {
        break;
      }
      let depth = 1;
      let cursor = openBrace + 1;
      while (cursor < stripped.length && depth > 0) {
        const char = stripped[cursor];
        if (char === "{") {
          depth += 1;
        } else if (char === "}") {
          depth -= 1;
        }
        cursor += 1;
      }
      if (depth > 0) {
        break;
      }
      const body = stripped.slice(openBrace + 1, cursor - 1);
      searchFrom = cursor;
      for (const match of body.matchAll(declRegex)) {
        const name = match[1];
        const expr = match[2].trim().replace(/\s+/g, " ");
        const { ns, suffix } = splitNamespace(name);
        if (suffix.includes("--")) {
          continue;
        }
        if (suffix !== "") {
          const entries = source[ns] ??= [];
          const existing = entries.findIndex((e) => e.suffix === suffix);
          if (existing === -1) {
            entries.push({ suffix, expr });
          } else {
            entries[existing] = { suffix, expr };
          }
          found = true;
        }
      }
    }
    if (!found) {
      return void 0;
    }
    return source;
  } catch (e2) {
    return void 0;
  }
}

// src/cartographer.ts
var validExtensions = /* @__PURE__ */ new Set([".jsx", ".tsx"]);
function normalizePath(p) {
  return p.replace(/\\/g, "/");
}
var TAILWIND_CONFIG_FILES = [
  "tailwind.config.ts",
  "tailwind.config.js",
  "tailwind.config.mjs",
  "tailwind.config.cjs"
];
var THEME_CSS_FILES = [
  "src/index.css",
  "index.css",
  "src/main.css",
  "src/styles.css",
  "src/App.css",
  "src/app.css",
  "src/global.css",
  "src/globals.css",
  "src/style.css",
  "styles.css",
  "app/globals.css"
];
var TAILWIND_V4_CDN_URL = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.14";
var TAILWIND_V3_CDN_URL = "https://cdn.tailwindcss.com/3.4.17";
function cartographer(options) {
  let clientScript;
  let viteRoot;
  let configuredRoot;
  let configuredRootName;
  let tailwindConfigPath = null;
  let tailwindMajorVersion = 4;
  let tailwindInjectionTarget = null;
  let themeSource = void 0;
  return {
    name: "@replit/vite-plugin-cartographer",
    enforce: "pre",
    async configResolved(config) {
      viteRoot = normalizePath(config.root);
      if (_optionalChain([options, 'optionalAccess', _ => _.root])) {
        configuredRoot = normalizePath(
          _path2.default.isAbsolute(options.root) ? options.root : _path2.default.resolve(config.root, options.root)
        );
      } else {
        configuredRoot = viteRoot;
      }
      configuredRootName = _path2.default.basename(configuredRoot);
      const currentFileUrl = typeof __dirname === "string" ? _path2.default.join(__dirname, "../dist/beacon/index.global.js") : _url.fileURLToPath.call(void 0, 
        new URL("../dist/beacon/index.global.js", import.meta.url)
      );
      try {
        clientScript = await _promises2.default.readFile(currentFileUrl, "utf-8");
      } catch (error) {
        console.error(
          "[replit-cartographer] Failed to load client script:",
          error
        );
      }
      const packageDir = await findClosestPackageDir(configuredRoot);
      const tailwindSearchRoot = _nullishCoalesce(packageDir, () => ( configuredRoot));
      const [rawTailwindConfigPath, majorVersion, themeCss] = await Promise.all(
        [
          findTailwindConfigPath(tailwindSearchRoot),
          detectTailwindMajorVersion(tailwindSearchRoot),
          findThemeSource(viteRoot)
        ]
      );
      tailwindConfigPath = rawTailwindConfigPath ? normalizePath(rawTailwindConfigPath) : null;
      tailwindMajorVersion = majorVersion;
      if (themeCss) {
        themeSource = themeCss.source;
        config.logger.info(
          `[replit-cartographer] Loaded @theme tokens from ${themeCss.path}`
        );
      }
    },
    resolveId(_source, _importer) {
      return null;
    },
    transform: {
      order: "pre",
      async handler(code, id) {
        const traverseModule = await Promise.resolve().then(() => _interopRequireWildcard(require("@babel/traverse")));
        const traverse = _optionalChain([traverseModule, 'access', _2 => _2.default, 'optionalAccess', _3 => _3.default]) || traverseModule.default || traverseModule;
        if (tailwindConfigPath && id === tailwindConfigPath) {
          if (typeof traverse !== "function") {
            return null;
          }
          return makeTailwindConfigBrowserSafe(code, traverse);
        }
        if (!validExtensions.has(_path2.default.extname(id)) || id.includes("node_modules")) {
          return null;
        }
        try {
          const ast = _parser.parse.call(void 0, code, {
            sourceType: "module",
            plugins: ["jsx", "typescript"]
          });
          let isR3FFile = usesReactThreeFiber(ast);
          if (isR3FFile) {
            return null;
          }
          const magicString = new (0, _magicstring2.default)(code);
          let didInjectTailwind = false;
          if (tailwindConfigPath) {
            const isInjectionCandidate = tailwindInjectionTarget === id || tailwindInjectionTarget === null && id.startsWith(viteRoot + "/");
            if (isInjectionCandidate) {
              const relativeConfigPath = normalizePath(
                _path2.default.relative(_path2.default.dirname(id), tailwindConfigPath)
              );
              const importPath = relativeConfigPath.startsWith(".") ? relativeConfigPath : `./${relativeConfigPath}`;
              magicString.prepend(
                [
                  `(async () => {`,
                  `  try {`,
                  `    const __replit_tw_mod = await import(${JSON.stringify(importPath)});`,
                  `    const __replit_tw_raw = __replit_tw_mod.default ?? __replit_tw_mod;`,
                  `    if (typeof window !== 'undefined' && __replit_tw_raw && typeof __replit_tw_raw === 'object') {`,
                  `      window.REPLIT_APP_TAILWIND_CONFIG = __replit_tw_raw;`,
                  `      window.dispatchEvent(new CustomEvent('replit-tailwind-config-ready'));`,
                  `    }`,
                  `  } catch (e) {`,
                  `    console.warn('[replit-cartographer] Skipped loading tailwind config due to an incompatible Node plugin:', e);`,
                  `  }`,
                  `})();
`
                ].join("\n")
              );
              didInjectTailwind = true;
            }
          }
          let currentElement = null;
          if (typeof traverse !== "function") {
            console.error(
              `[replit-cartographer] @babel/traverse did not resolve to a function.`
            );
            return null;
          }
          const fragmentAliases = collectFragmentAliases(ast);
          traverse(ast, {
            JSXElement: {
              enter(elementPath) {
                if (isR3FFile) {
                  return;
                }
                currentElement = elementPath.node;
              },
              exit() {
                currentElement = null;
              }
            },
            JSXOpeningElement(elementPath) {
              if (isR3FFile) {
                return;
              }
              const jsxNode = elementPath.node;
              const elementName = getElementName(jsxNode);
              if (!elementName) {
                return;
              }
              if (shouldBailout(elementName)) {
                isR3FFile = true;
                elementPath.stop();
                return;
              }
              if (elementName === "line") {
                return;
              }
              if (isFragment(elementName, fragmentAliases)) {
                return;
              }
              if (currentElement) {
                const { line = 0, column: col = 0 } = _nullishCoalesce(_optionalChain([jsxNode, 'access', _4 => _4.loc, 'optionalAccess', _5 => _5.start]), () => ( {}));
                const relativeToConfigured = _path2.default.relative(configuredRoot, id);
                const componentPath = normalizePath(
                  _path2.default.join(configuredRootName, relativeToConfigured)
                );
                const componentMetadata = col === 0 ? `${componentPath}:${line}` : `${componentPath}:${line}:${col}`;
                magicString.appendLeft(
                  _nullishCoalesce(jsxNode.name.end, () => ( 0)),
                  ` ${DATA_ATTRIBUTES.METADATA}="${componentMetadata}" ${DATA_ATTRIBUTES.COMPONENT_NAME}="${elementName}"`
                );
              }
            }
          });
          if (isR3FFile) {
            return null;
          }
          if (didInjectTailwind) {
            tailwindInjectionTarget = id;
          }
          return {
            code: magicString.toString(),
            map: magicString.generateMap({ hires: true })
          };
        } catch (error) {
          console.error(`[replit-cartographer] Error processing ${id}:`, error);
          return null;
        }
      }
    },
    transformIndexHtml() {
      if (!clientScript) {
        return [];
      }
      const tags = [
        {
          tag: "script",
          attrs: { type: "module" },
          children: clientScript,
          injectTo: "head"
        },
        {
          tag: "script",
          attrs: {},
          children: generateClientSideTailwindScript(tailwindMajorVersion),
          injectTo: "head"
        }
      ];
      if (themeSource) {
        tags.push({
          tag: "script",
          attrs: {},
          children: `window.REPLIT_APP_THEME_TOKENS = ${JSON.stringify(themeSource).replace(/</g, "\\u003c")};`,
          injectTo: "head"
        });
      }
      return tags;
    }
  };
}
function getElementName(jsxNode) {
  if (jsxNode.name.type === "JSXIdentifier") {
    return jsxNode.name.name;
  }
  if (jsxNode.name.type === "JSXMemberExpression") {
    const memberExpr = jsxNode.name;
    const object = memberExpr.object;
    const property = memberExpr.property;
    return `${object.name}.${property.name}`;
  }
  return null;
}
function usesReactThreeFiber(ast) {
  return ast.program.body.some(
    (node) => node.type === "ImportDeclaration" && typeof node.source.value === "string" && R3F_IMPORT_SOURCES.has(node.source.value)
  );
}
function shouldBailout(name) {
  if (R3F_BAILOUT_ELEMENTS.has(name)) {
    return true;
  }
  return R3F_BAILOUT_PATTERNS.some((pattern) => name.match(pattern));
}
var FRAGMENT_IMPORT_SOURCES = /* @__PURE__ */ new Set(["react", "react/jsx-runtime"]);
function collectFragmentAliases(ast) {
  const namedAliases = /* @__PURE__ */ new Set();
  const namespaceAliases = /* @__PURE__ */ new Set();
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration" && typeof node.source.value === "string" && FRAGMENT_IMPORT_SOURCES.has(node.source.value)) {
      for (const specifier of node.specifiers) {
        if (specifier.type === "ImportSpecifier" && specifier.imported.type === "Identifier" && specifier.imported.name === "Fragment") {
          namedAliases.add(specifier.local.name);
        } else if (specifier.type === "ImportDefaultSpecifier" || specifier.type === "ImportNamespaceSpecifier") {
          namespaceAliases.add(specifier.local.name);
        }
      }
    }
  }
  return { namedAliases, namespaceAliases };
}
function isFragment(name, bindings) {
  if (bindings.namedAliases.has(name)) {
    return true;
  }
  const dotIndex = name.indexOf(".");
  if (dotIndex !== -1) {
    const ns = name.slice(0, dotIndex);
    const prop = name.slice(dotIndex + 1);
    if (prop === "Fragment" && bindings.namespaceAliases.has(ns)) {
      return true;
    }
  }
  return false;
}
async function findClosestPackageDir(startDir) {
  let current = _path2.default.resolve(startDir);
  while (true) {
    try {
      await _promises2.default.access(_path2.default.join(current, "package.json"));
      return current;
    } catch (e3) {
    }
    const parent = _path2.default.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}
async function findTailwindConfigPath(dir) {
  for (const configFile of TAILWIND_CONFIG_FILES) {
    const configPath = _path2.default.join(dir, configFile);
    try {
      await _promises2.default.access(configPath);
      return configPath;
    } catch (e4) {
    }
  }
  return null;
}
async function findThemeSource(viteRoot) {
  for (const candidate of THEME_CSS_FILES) {
    const cssPath = _path2.default.join(viteRoot, candidate);
    try {
      const css = await _promises2.default.readFile(cssPath, "utf-8");
      const source = parseThemeTokens(css);
      if (source) {
        return { path: cssPath, source };
      }
    } catch (e5) {
    }
  }
  return void 0;
}
async function detectTailwindMajorVersion(packageDir) {
  try {
    const packageJsonPath = _path2.default.join(packageDir, "package.json");
    const packageJsonContent = await _promises2.default.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);
    const versionSpec = _nullishCoalesce(_optionalChain([packageJson, 'access', _6 => _6.dependencies, 'optionalAccess', _7 => _7.tailwindcss]), () => ( _optionalChain([packageJson, 'access', _8 => _8.devDependencies, 'optionalAccess', _9 => _9.tailwindcss])));
    if (!versionSpec) {
      return 4;
    }
    const match = versionSpec.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 4;
  } catch (e6) {
    return 4;
  }
}
function makeTailwindConfigBrowserSafe(code, traverseFn) {
  const ast = _parser.parse.call(void 0, code, {
    sourceType: "module",
    plugins: ["typescript"]
  });
  const s = new (0, _magicstring2.default)(code);
  let modified = false;
  const importBindings = /* @__PURE__ */ new Map();
  let bindingCounter = 0;
  const requireSites = [];
  traverseFn(ast, {
    CallExpression(nodePath) {
      const node = nodePath.node;
      if (node.callee.type === "Identifier" && node.callee.name === "require" && node.arguments.length === 1 && node.arguments[0].type === "StringLiteral") {
        if (node.start == null || node.end == null) {
          return;
        }
        const moduleName = node.arguments[0].value;
        let binding = importBindings.get(moduleName);
        if (!binding) {
          binding = `__req_${bindingCounter++}`;
          importBindings.set(moduleName, binding);
        }
        requireSites.push({ start: node.start, end: node.end, binding });
      }
    }
  });
  if (requireSites.length === 0) {
    return null;
  }
  const importLines = [];
  for (const [moduleName, binding] of importBindings) {
    importLines.push(`import ${binding} from ${JSON.stringify(moduleName)};`);
  }
  s.prepend(importLines.join("\n") + "\n");
  for (const site of requireSites) {
    s.overwrite(site.start, site.end, site.binding);
    modified = true;
  }
  if (!modified) {
    return null;
  }
  return {
    code: s.toString(),
    map: s.generateMap({ hires: true })
  };
}
function generateClientSideTailwindScript(majorVersion) {
  const cdnUrl = majorVersion >= 4 ? JSON.stringify(TAILWIND_V4_CDN_URL) : JSON.stringify(TAILWIND_V3_CDN_URL);
  const loadTailwindBody = majorVersion >= 4 ? `
        var script = document.createElement('script');
        script.src = ${cdnUrl};

        if (window.REPLIT_APP_TAILWIND_CONFIG) {
          script.setAttribute('data-config', JSON.stringify(window.REPLIT_APP_TAILWIND_CONFIG));
        }

        document.head.appendChild(script);` : `
        var script = document.createElement('script');
        script.src = ${cdnUrl};

        script.onload = function() {
          if (window.REPLIT_APP_TAILWIND_CONFIG) {
            window.tailwind.config = window.REPLIT_APP_TAILWIND_CONFIG;
          }
        };

        document.head.appendChild(script);`;
  return `
(function() {
  var initialized = false;

  function loadTailwind() {
    if (initialized) { return; }
    initialized = true;
${loadTailwindBody}
  }

  // Listen for the beacon requesting tailwind initialization.
  window.addEventListener('replit-init-tailwind', function() {
    if (window.REPLIT_APP_TAILWIND_CONFIG) {
      loadTailwind();
    } else {
      // Config not ready yet \u2014 wait for the config-ready event, but proceed
      // without a config after 1 second.  The config is optional (projects
      // without a tailwind config file will never fire the ready event).
      var configTimeout = setTimeout(function() { loadTailwind(); }, 1000);
      window.addEventListener('replit-tailwind-config-ready', function() {
        clearTimeout(configTimeout);
        loadTailwind();
      }, { once: true });
    }
  });
})();
`.trim();
}



exports.cartographer = cartographer; exports.version = version;
//# sourceMappingURL=index.js.map