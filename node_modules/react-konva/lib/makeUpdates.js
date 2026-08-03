"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS_NAMESPACE = void 0;
exports.toggleStrictMode = toggleStrictMode;
exports._injectFlush = _injectFlush;
exports.applyNodeProps = applyNodeProps;
exports.updatePicture = updatePicture;
const Global_js_1 = require("konva/lib/Global.js");
const propsToSkip = {
    children: true,
    ref: true,
    key: true,
    style: true,
    forwardedRef: true,
    unstable_applyCache: true,
    unstable_applyDrawHitFromCache: true,
};
let zIndexWarningShowed = false;
let dragWarningShowed = false;
exports.EVENTS_NAMESPACE = '.react-konva-event';
let useStrictMode = false;
function toggleStrictMode(value) {
    useStrictMode = value;
}
const DRAGGABLE_WARNING = `ReactKonva: You have a Konva node with draggable = true and position defined but no onDragMove or onDragEnd events are handled.
Position of a node will be changed during drag&drop, so you should update state of the react app as well.
Consider to add onDragMove or onDragEnd events.
For more info see: https://github.com/konvajs/react-konva/issues/256
`;
const Z_INDEX_WARNING = `ReactKonva: You are using "zIndex" attribute for a Konva node.
react-konva may get confused with ordering. Just define correct order of elements in your render function of a component.
For more info see: https://github.com/konvajs/react-konva/issues/194
`;
const EMPTY_PROPS = {};
// Konva internals synchronously read node state right after firing events —
// e.g. Transformer fires "transform", the user handler calls setState, and
// Transformer.update() immediately repositions its anchors from the node.
// React commits async (microtask), so without a flush the chrome is measured
// from the stale node on every event. Draining the reconciler's pending sync
// work right after the user handler returns keeps Konva's read-after-fire
// contract. Injected from ReactKonvaCore to avoid an import cycle.
let flushPendingWork = () => { };
function _injectFlush(fn) {
    flushPendingWork = fn;
}
let isFlushing = false;
function wrapEventHandler(handler) {
    return function (...args) {
        const result = handler.apply(this, args);
        if (!isFlushing) {
            isFlushing = true;
            try {
                flushPendingWork();
            }
            finally {
                isFlushing = false;
            }
        }
        return result;
    };
}
function applyNodeProps(instance, props, oldProps = EMPTY_PROPS) {
    // don't use zIndex in react-konva
    if (!zIndexWarningShowed && 'zIndex' in props) {
        console.warn(Z_INDEX_WARNING);
        zIndexWarningShowed = true;
    }
    // check correct draggable usage
    if (!dragWarningShowed && props.draggable) {
        var hasPosition = props.x !== undefined || props.y !== undefined;
        var hasEvents = props.onDragEnd || props.onDragMove;
        if (hasPosition && !hasEvents) {
            console.warn(DRAGGABLE_WARNING);
            dragWarningShowed = true;
        }
    }
    // check old props
    // we need to unset properties that are not in new props
    // and remove all events
    for (var key in oldProps) {
        if (propsToSkip[key]) {
            continue;
        }
        var isEvent = key.slice(0, 2) === 'on';
        var propChanged = oldProps[key] !== props[key];
        // if that is a changed event, we need to remove it
        if (isEvent && propChanged) {
            var eventName = key.substr(2).toLowerCase();
            if (eventName.substr(0, 7) === 'content') {
                eventName =
                    'content' +
                        eventName.substr(7, 1).toUpperCase() +
                        eventName.substr(8);
            }
            // the bound listener is a wrapper, not the user handler, so remove by
            // our namespace (react-konva binds at most one listener per event there)
            instance.off(eventName + exports.EVENTS_NAMESPACE);
        }
        var toRemove = !props.hasOwnProperty(key);
        if (toRemove) {
            instance.setAttr(key, undefined);
        }
    }
    var strictUpdate = useStrictMode || props._useStrictMode;
    var updatedProps = {};
    var hasUpdates = false;
    const newEvents = {};
    for (var key in props) {
        if (propsToSkip[key]) {
            continue;
        }
        var isEvent = key.slice(0, 2) === 'on';
        var toAdd = oldProps[key] !== props[key];
        if (isEvent && toAdd) {
            var eventName = key.substr(2).toLowerCase();
            if (eventName.substr(0, 7) === 'content') {
                eventName =
                    'content' +
                        eventName.substr(7, 1).toUpperCase() +
                        eventName.substr(8);
            }
            // check that event is not undefined
            if (props[key]) {
                newEvents[eventName] = props[key];
            }
        }
        if (!isEvent &&
            (props[key] !== oldProps[key] ||
                (strictUpdate && props[key] !== instance.getAttr(key)))) {
            hasUpdates = true;
            updatedProps[key] = props[key];
        }
    }
    if (hasUpdates) {
        instance.setAttrs(updatedProps);
        updatePicture(instance);
    }
    // subscribe to events AFTER we set attrs
    // we need it to fix https://github.com/konvajs/react-konva/issues/471
    // settings attrs may add events. Like "draggable: true" will add "mousedown" listener
    for (var eventName in newEvents) {
        // first clear any existing listeners, it is required for strict mode
        instance.off(eventName + exports.EVENTS_NAMESPACE);
        // then attach new one
        instance.on(eventName + exports.EVENTS_NAMESPACE, wrapEventHandler(newEvents[eventName]));
    }
}
function updatePicture(node) {
    if (!Global_js_1.Konva.autoDrawEnabled) {
        var drawingNode = node.getLayer() || node.getStage();
        drawingNode && drawingNode.batchDraw();
    }
}
