"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv4 = void 0;
/**
 * This function generates a UUID using Math.random().
 * The distribution of unique values is not guaranteed to be as robust
 * as with a crypto module but works across all platforms (Node, React Native, browser JS).
 *
 * We use it for connection id generation which is not critical for security.
 */
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.uuidv4 = uuidv4;
//# sourceMappingURL=uuidv4.js.map