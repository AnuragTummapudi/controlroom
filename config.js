/**
 * Control Room Dashboard Configuration
 * 
 * In development, reads from window.ENV if injected or falls back to the configured key.
 * For production deployments, restrict this API key by HTTP referrer (domain) in MapTiler Cloud:
 * https://cloud.maptiler.com/account/keys/
 */
window.APP_CONFIG = {
    MAPTILER_API_KEY: (typeof window.ENV !== 'undefined' && window.ENV.MAPTILER_API_KEY) 
        ? window.ENV.MAPTILER_API_KEY 
        : "po7tI1Ksj7xxtLCTn0Ek",
    
    // Bailadila Iron Ore Mining Complex (Deposit 14 / Kirandul, Chhattisgarh, India)
    MAP_CENTER: [81.2385, 18.6395], // [Longitude, Latitude]
    DEFAULT_ZOOM: 14.3,
    DEFAULT_PITCH: 25, // Top-down with slight command-center aerial tilt
    DEFAULT_BEARING: -15
};
