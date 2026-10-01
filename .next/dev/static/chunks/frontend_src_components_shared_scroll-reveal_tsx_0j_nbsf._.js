(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/src/components/shared/scroll-reveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollReveal",
    ()=>ScrollReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
const variants = {
    up: {
        hidden: {
            opacity: 0,
            y: 40
        },
        visible: {
            opacity: 1,
            y: 0
        }
    },
    down: {
        hidden: {
            opacity: 0,
            y: -40
        },
        visible: {
            opacity: 1,
            y: 0
        }
    },
    left: {
        hidden: {
            opacity: 0,
            x: -40
        },
        visible: {
            opacity: 1,
            x: 0
        }
    },
    right: {
        hidden: {
            opacity: 0,
            x: 40
        },
        visible: {
            opacity: 1,
            x: 0
        }
    }
};
function ScrollReveal({ children, className = "", direction = "up", delay = 0, duration = 0.5, amount = 0.15, once = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: className,
        initial: "hidden",
        whileInView: "visible",
        viewport: {
            once,
            amount
        },
        transition: {
            duration,
            delay,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        variants: variants[direction],
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/components/shared/scroll-reveal.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_c = ScrollReveal;
var _c;
__turbopack_context__.k.register(_c, "ScrollReveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_src_components_shared_scroll-reveal_tsx_0j_nbsf._.js.map