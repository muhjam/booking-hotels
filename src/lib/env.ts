/**
 * Centralized environment variables configuration.
 */

export const env = {
    // Base URL of the application, used for absolute URLs (e.g., links, OAuth redirects)
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};
