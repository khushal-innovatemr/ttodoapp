/**
 * This function generates a UUID using Math.random().
 * The distribution of unique values is not guaranteed to be as robust
 * as with a crypto module but works across all platforms (Node, React Native, browser JS).
 *
 * We use it for connection id generation which is not critical for security.
 */
export declare const uuidv4: () => string;
//# sourceMappingURL=uuidv4.d.ts.map