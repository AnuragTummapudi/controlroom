# Mining Fleet Control Room Dashboard

An enterprise-grade autonomous mining asset management and fleet telemetry control room dashboard. The interface features a real-time satellite radar of the **Bailadila Iron Ore Mining Complex** in Chhattisgarh, India, interactive 3D vehicle modeling, and operational zone monitoring.

---

## Features

- **Real-World Satellite Operations**: Live MapTiler satellite imagery of the Bailadila open-cast iron ore deposits (Deposit 14 & 11C, Kirandul).
- **Haul Route Overlays**: GeoJSON operational haul corridors with operational green glow line styling.
- **Operational Zones**: Semi-transparent polygon boundaries for Excavation Pits, Loading Benches, Waste Rock Dumps, and Staging Yards.
- **Active Haul Fleet**: Custom SVG yellow haul-truck markers oriented with true heading bearings and subtle telemetry simulation.
- **Bidirectional Fleet Synchronization**: Selecting any vehicle in the left asset list smoothly shifts and focuses the radar camera and updates real-time telemetry details. Selecting markers on the map directly synchronizes the list and right-hand telemetry deck.
- **Interactive 3D Digital Twin**: Embedded Volvo A40G articulated haul truck GLB model loaded via Google's native `<model-viewer>`.

---

## MapTiler Map Setup

Follow these instructions to configure and run the MapTiler satellite map in local development and production.

### 1. Create a MapTiler Account
1. Visit [MapTiler Cloud](https://cloud.maptiler.com/).
2. Sign up for a free or commercial account.

### 2. Generate an API Key
1. Navigate to **Account** -> **API Keys** in the MapTiler dashboard ([https://cloud.maptiler.com/account/keys/](https://cloud.maptiler.com/account/keys/)).
2. Click **Create Key** or use the default key provided with your account.
3. Copy your API key token (e.g., `po7tI1Ksj7xxtLCTn0Ek`).

### 3. Add Key to Local Environment Configuration
For local development, store the key in [`config.js`](file:///Users/anuragtummapudi/controlroom/config.js) or define it in your `.env` file:

```bash
# .env
MAPTILER_API_KEY=po7tI1Ksj7xxtLCTn0Ek
```

In [`config.js`](file:///Users/anuragtummapudi/controlroom/config.js), the key is exposed safely to the client via `window.APP_CONFIG`:
```javascript
window.APP_CONFIG = {
    MAPTILER_API_KEY: window.ENV?.MAPTILER_API_KEY || "po7tI1Ksj7xxtLCTn0Ek",
    MAP_CENTER: [81.2385, 18.6395],
    DEFAULT_ZOOM: 14.3,
    DEFAULT_PITCH: 25,
    DEFAULT_BEARING: -15
};
```

If migrating to **Vite** or **Next.js**, define the appropriate prefix:
- Vite: `VITE_MAPTILER_API_KEY=po7tI1Ksj7xxtLCTn0Ek`
- Next.js: `NEXT_PUBLIC_MAPTILER_API_KEY=po7tI1Ksj7xxtLCTn0Ek`

### 4. Start the Development Server
Serve the repository using any standard static file server:

```bash
# Using Python
python3 -m http.server 5500

# Or using Node http-server / Live Server
npx serve .
```

Navigate to `http://localhost:5500/dashboard.html` in your web browser.

### 5. MapTiler Satellite Imagery
The center radar uses MapTiler's official high-resolution satellite imagery layer:
```javascript
maptilersdk.config.apiKey = window.APP_CONFIG.MAPTILER_API_KEY;

const map = new maptilersdk.Map({
    container: 'mining-map',
    style: maptilersdk.MapStyle.SATELLITE,
    center: window.APP_CONFIG.MAP_CENTER,
    zoom: window.APP_CONFIG.DEFAULT_ZOOM,
    pitch: window.APP_CONFIG.DEFAULT_PITCH,
    bearing: window.APP_CONFIG.DEFAULT_BEARING
});
```

### 6. Changing the Bailadila Center & Zoom
The default viewport coordinates and camera orientation can be modified directly in [`config.js`](file:///Users/anuragtummapudi/controlroom/config.js):
- `MAP_CENTER`: `[longitude, latitude]` in decimal degrees (default: `[81.2385, 18.6395]` for Bailadila Deposit 14).
- `DEFAULT_ZOOM`: Camera elevation scale (default: `14.3`).
- `DEFAULT_PITCH`: Top-down tilt angle for aerial perspective (default: `25` degrees).
- `DEFAULT_BEARING`: Compass rotation angle (default: `-15` degrees).

### 7. Vehicle Telemetry & Coordinate Storage
Vehicle positions, headings, and live telemetry data are maintained in the `assets` array inside [`dashboard.html`](file:///Users/anuragtummapudi/controlroom/dashboard.html#L686-L701):
```javascript
{
    id: "AST-10042",
    status: "Hauling",
    battery: 78,
    fuel: 50,
    speed: 18,
    location: "Haul Road A - North",
    coords: [81.2388, 18.6392], // [Longitude, Latitude]
    heading: 145,               // Compass angle in degrees
    selected: true,
    routeId: "main-corridor"
}
```

### 8. Haul Routes Storage (GeoJSON)
Haul road corridors are defined as GeoJSON `LineString` features inside `haulRoutesGeoJSON` in [`dashboard.html`](file:///Users/anuragtummapudi/controlroom/dashboard.html#L790-L850). Routes follow actual surveyed Bailadila haul roads and are rendered using a dual-layer approach (emerald core line + green glow).

### 9. Adding Additional Mining Zones
New operational zones (Excavation pits, blasting perimeters, stockpile yards) can be added as GeoJSON polygons to `miningZonesGeoJSON` in [`dashboard.html`](file:///Users/anuragtummapudi/controlroom/dashboard.html#L735-L788):
```javascript
{
    type: "Feature",
    properties: {
        name: "NEW ZONE NAME",
        color: "#f59e0b", // Hex accent color
        type: "Excavation"
    },
    geometry: {
        type: "Polygon",
        coordinates: [[
            [81.2300, 18.6300],
            [81.2350, 18.6300],
            [81.2350, 18.6350],
            [81.2300, 18.6350],
            [81.2300, 18.6300]
        ]]
    }
}
```

### 10. Restricting the API Key for Production
Before deploying to production:
1. Go to the [MapTiler Cloud Keys Console](https://cloud.maptiler.com/account/keys/).
2. Select your API key.
3. Under **Allowed HTTP origins (referrers)**, add your production domain (e.g. `https://controlroom.yourcompany.com/*`).
4. Save changes. This prevents unauthorized usage of your map quota from other domains.

---

## Official Documentation References

- **MapTiler SDK JS**: [https://docs.maptiler.com/sdk-js/](https://docs.maptiler.com/sdk-js/)
- **Satellite Map Example**: [https://docs.maptiler.com/sdk-js/examples/satellite-map/](https://docs.maptiler.com/sdk-js/examples/satellite-map/)
- **MapLibre GL + MapTiler**: [https://docs.maptiler.com/maplibre/](https://docs.maptiler.com/maplibre/)
- **MapTiler Cloud Tiles API**: [https://docs.maptiler.com/cloud/api/tiles/](https://docs.maptiler.com/cloud/api/tiles/)
- **MapTiler Styles Reference**: [https://docs.maptiler.com/sdk-js/api/map-styles/](https://docs.maptiler.com/sdk-js/api/map-styles/)
