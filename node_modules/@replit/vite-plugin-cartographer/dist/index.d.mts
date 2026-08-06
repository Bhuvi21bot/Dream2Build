import { Plugin } from 'vite';

var version = "0.5.21";

/**
 * Tailwind v4 `@theme` token registry types, shared across the cartographer
 * plugin (Node), the beacon (iframe), and the Visual Editor UI. Namespaces
 * (the keys) come verbatim from the app's @theme block, e.g. 'color' | 'radius' | 'font'.
 */
/**
 * What `parseThemeTokens` produces and what cartographer injects as
 * `window.REPLIT_APP_THEME_TOKENS`: each token split into `suffix` plus its
 * raw @theme value `expr` (e.g. 'hsl(var(--primary))'), captured verbatim and
 * resolved to a concrete value later, in the browser.
 */
type ThemeTokenSource = Record<string, Array<{
    suffix: string;
    expr: string;
}>>;
/**
 * What the beacon attaches to `ElementMetadata.themeTokens`: each `suffix`
 * plus a browser-resolved concrete `value` (e.g. 'rgb(24 24 27)'). Absent
 * entirely when the app has no @theme (-> legacy CSS-vars fallback).
 */
type ThemeTokenRegistry = Record<string, Array<{
    suffix: string;
    value: string;
}>>;
/** A resolved link between an element class and a named @theme token. */
interface TokenBinding {
    /** e.g. 'background-color' */
    property: string;
    /** e.g. '--color-primary' */
    token: string;
}
/**
 * The value chosen for a property in the editor — one of the three forms a
 * Tailwind utility value can take. Consumed by `getTailwindClass`.
 */
type UtilityValue = {
    kind: 'token';
    token: string;
} | {
    kind: 'step';
    n: number;
} | {
    kind: 'arbitrary';
    value: string;
};

declare global {
    interface Window {
        REPLIT_APP_THEME_TOKENS?: ThemeTokenSource;
    }
}
interface RelatedElements {
    children: Array<BaseElement>;
    parent: BaseElement | null;
}
interface ElementMetadata extends BaseElement {
    elementPath: string;
    elementName: string;
    originalTextContent?: string;
    screenshotBlob?: Blob;
    srcAttribute?: string;
    siblingCount?: number;
    hasChildElements?: boolean;
    colorVariables?: Record<string, string>;
    themeTokens?: ThemeTokenRegistry;
    computedStyles: {
        backgroundColor: string;
        borderTopColor: string;
        borderRightColor: string;
        borderBottomColor: string;
        borderLeftColor: string;
        borderTopLeftRadius: string;
        borderTopRightRadius: string;
        borderBottomRightRadius: string;
        borderBottomLeftRadius: string;
        borderTopWidth: string;
        borderRightWidth: string;
        borderBottomWidth: string;
        borderLeftWidth: string;
        color: string;
        display: string;
        position: string;
        width: string;
        height: string;
        fontSize: string;
        fontFamily: string;
        fontWeight: string;
        margin: string;
        padding: string;
        opacity: string;
        textAlign: string;
        flexDirection: string;
        flexWrap: string;
        justifyContent: string;
        alignItems: string;
        gap: string;
        rowGap: string;
        columnGap: string;
    };
    relatedElements: RelatedElements & {
        /** @deprecated */
        nextSibling?: BaseElement;
        /** @deprecated */
        grandParent?: BaseElement;
    };
}
interface BaseElement {
    tagName: string;
    className?: string;
    textContent: string;
    id?: string;
    nodeId?: number;
    relatedElements: RelatedElements;
}
interface SerializedRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
type BeaconSource = 'installed' | 'standalone';
interface BeaconRuntimeOptions {
    source?: BeaconSource;
    acceptsRawMessages?: boolean;
    installedVersion?: string;
}
type BeaconCommandMessage = {
    type: 'TOGGLE_REPLIT_VISUAL_EDITOR';
    timestamp: number;
    enabled: boolean;
    enableEditing?: boolean;
    /** When true the beacon suppresses its own overlays and instead emits
     *  `ELEMENT_HOVERED` messages with element geometry on every mousemove. */
    hoverMessages?: boolean;
} | {
    type: 'CLEAR_SELECTION';
    timestamp: number;
} | {
    type: 'UPDATE_SELECTED_ELEMENT';
    timestamp: number;
    attributes: {
        style?: string;
        textContent?: string;
        className?: string;
        src?: string;
    };
} | {
    type: 'CLEAR_ELEMENT_DIRTY';
    timestamp: number;
} | {
    type: 'RESTORE_DIRTY_ELEMENTS';
    timestamp: number;
} | {
    type: 'APPLY_THEME_PREVIEW';
    timestamp: number;
    themeContent: string;
} | {
    type: 'CLEAR_THEME_PREVIEW';
    timestamp: number;
} | {
    type: 'SCREENSHOT_PAGE';
    timestamp: number;
    /** Opaque caller-provided ID echoed back in the result so the requester
     *  can correlate the response when multiple screenshots are in-flight. */
    requestId: string;
    capture?: 'page' | 'viewport';
} | {
    type: 'REQUEST_CONTENT_HEIGHT';
    timestamp: number;
    requestId: string;
} | {
    type: 'RELAY_TO_IFRAME';
    timestamp: number;
    event: RelayedEventToIframe;
};
type Message = BeaconCommandMessage | {
    type: 'REPLIT_BEACON_TARGETED_MESSAGE';
    timestamp: number;
    targetSource: BeaconSource;
    message: BeaconCommandMessage;
} | {
    type: 'REPLIT_VISUAL_EDITOR_ENABLED';
    timestamp: number;
    /** Echoed from the toggle request so the parent can distinguish
     *  headless hit-testing activation from full visual-edit activation. */
    hoverMessages?: boolean;
} | {
    type: 'REPLIT_VISUAL_EDITOR_DISABLED';
    timestamp: number;
} | {
    type: 'ELEMENT_SELECTED';
    payload: ElementMetadata;
    timestamp: number;
    /** Present when the beacon was activated with `hoverMessages: true`. */
    elementBounds?: SerializedRect;
} | {
    type: 'ELEMENT_UNSELECTED';
    timestamp: number;
} | {
    type: 'ELEMENT_HOVERED';
    timestamp: number;
    /** `null` when the mouse has left the iframe (hover cleared). */
    elementBounds: SerializedRect | null;
    elementName: string;
} | {
    type: 'ELEMENT_TEXT_CHANGED';
    payload: ElementMetadata;
    timestamp: number;
} | {
    type: 'SELECTOR_SCRIPT_LOADED';
    timestamp: number;
    version: string;
    source?: BeaconSource;
    supportsTargetedRouting?: boolean;
    installedVersion?: string;
} | {
    type: 'LIGHT_MODE_USED';
    timestamp: number;
} | {
    type: 'DARK_MODE_USED';
    timestamp: number;
} | {
    type: 'SCREENSHOT_PAGE_RESULT';
    timestamp: number;
    requestId: string;
    screenshotBlob?: Blob;
    error?: string;
} | {
    type: 'PINCH_WHEEL';
    timestamp: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'IFRAME_DOUBLE_CLICK';
    timestamp: number;
    clientX: number;
    clientY: number;
} | {
    type: 'IFRAME_CONTEXT_MENU';
    timestamp: number;
    clientX: number;
    clientY: number;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
} | {
    type: 'DRAG_START';
    timestamp: number;
    pointerId: number;
    button: number;
    pressure: number;
    isPen: boolean;
    clientX: number;
    clientY: number;
    startClientX: number;
    startClientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'DRAG_MOVE';
    timestamp: number;
    pointerId: number;
    movementX: number;
    movementY: number;
    pressure: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'DRAG_END';
    timestamp: number;
    pointerId: number;
    button: number;
    clientX: number;
    clientY: number;
    pressure: number;
    isPen: boolean;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'SCROLL_BOUNDARY';
    timestamp: number;
    deltaX: number;
    deltaY: number;
    clientX: number;
    clientY: number;
    shiftKey: boolean;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
} | {
    type: 'CONTENT_HEIGHT_RESULT';
    timestamp: number;
    requestId: string;
    contentHeight?: number;
    error?: string;
};
type RelayedEventToIframe = {
    kind: 'cancel-interaction';
} | {
    kind: 'set-canvas-gesture-relay';
    enabled: boolean;
} | {
    kind: 'set-canvas-relay-context-menu';
    enabled: boolean;
    /**
     * Whether right-click relaying is scoped to normal canvas interaction
     * (`true`, the default) or also applies to a locked preview surface
     * (`false`, e.g. the slides locked preview where left-click / scroll
     * still pass through to the iframe). Contextmenu relaying is independent
     * of `set-canvas-gesture-relay`: a parent enables it explicitly via this
     * message regardless of whether pinch / drag / scroll gestures relay.
     */
    canvasOnly?: boolean;
};

interface CartographerOptions {
    /** Override the root directory for metadata path resolution (absolute or relative to Vite root) */
    root?: string;
}
declare function cartographer(options?: CartographerOptions): Plugin;

export { type BaseElement, type BeaconCommandMessage, type BeaconRuntimeOptions, type BeaconSource, type CartographerOptions, type ElementMetadata, type Message, type SerializedRect, type ThemeTokenRegistry, type ThemeTokenSource, type TokenBinding, type UtilityValue, cartographer, version };
