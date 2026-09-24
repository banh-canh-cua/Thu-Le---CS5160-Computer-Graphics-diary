/* =========================================================================
   PROJECT 1 SKELETON: INTERACTIVE SCENERY DISPLAY
   =========================================================================
   CONCEPT:
   - Interactive 3D Scenery: 2 Mountains, 3 Clouds, and 1 Sun/Moon
   - Interactivity: Clicking the Sun/Moon toggles Day/Night mode
   - Camera: Keyboard (W/A/S/D) moves the camera in 3D world space
   - Levels (Keys 1, 2, 3):
     * Level 1: Wireframe using built-in HTML5 Canvas 2D line functions
     * Level 2: Wireframe using custom incremental line algorithm + Z-buffer
     * Level 3: Solid filled triangles using Bounding Box, Barycentric weights
   ========================================================================= */


/* =========================================================================
   1. GLOBAL STATE & CONFIGURATION
   ========================================================================= */
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 200;

let renderLevel = 1;       // 1: Built-in Lines | 2: Custom Lines | 3: Filled Triangles
let isNight = false;   // Toggled by clicking the Sun/Moon

// Camera placed at (0, 5, -20) looking down +Z towards the scene
let camera = { x: 0, y: 5, z: -20 };

// 1D depth array matching screen resolution (WIDTH * HEIGHT)
let zBuffer = new Float32Array(CANVAS_WIDTH * CANVAS_HEIGHT);


/* =========================================================================
   2. GEOMETRY & OBJECT DATA STRUCTURES
   =========================================================================
   Objects consist of:
   - Vertices: Array of 3D points {x, y, z}
   - Faces:    Array of triangles defined by vertex indices + Day/Night colors
   ========================================================================= */

// Generic function to instantiate 3D objects
function create3DObject(vertices, faces) {
    return { vertices, faces };
}

// Scene Objects Overview:
// - Mountains: 3D Pyramids (5 Vertices, 4 Triangles)
// - Clouds:    Flat 3D Polygon Fans (6 Vertices, 4 Triangles)
// - Sun/Moon:  8-sided Regular Polygon Fan (9 Vertices, 8 Triangles)
const sceneObjects = [mountain1, mountain2, cloud1, cloud2, cloud3, sunMoon];


/* =========================================================================
   3. CAMERA & PERSPECTIVE PROJECTION ENGINE
   =========================================================================
   Transforms 3D World Coordinates (X, Y, Z) into 2D Screen Pixels (u, v, z)
   - Convert Base Vertices -> World Space -> Camera Space -> Screen Space:
   1. World Pos:    W = (V_base * S) + T
   2. Camera Space: C = W - Camera_Pos
   3. Near Culling: Discard if C.z < 0.5
   4. Projection:   u_norm = C.x / C.z,  v_norm = C.y / C.z
   5. Screen Space: Map to Canvas pixels & invert vertical Y axis
   ========================================================================= */
function project(vertex3D) {
    // A. Camera-Relative Translation
    let camX = vertex3D.x - camera.x;
    let camY = vertex3D.y - camera.y;
    let camZ = vertex3D.z - camera.z;

    // B. Near-Plane Culling (Discard points at or behind camera)
    if (camZ < 0.5) return null;

    // C. Perspective Division (Unit camera focal distance d = 1)
    let uNorm = camX / camZ;
    let vNorm = camY / camZ;

    // D. Viewport Mapping (Scale to canvas size and invert Y axis)
    let pixelU = Math.round((uNorm + 0.5) * CANVAS_WIDTH);
    let pixelV = Math.round(CANVAS_HEIGHT - (vNorm + 0.5) * CANVAS_HEIGHT);

    return { u: pixelU, v: pixelV, z: camZ };
}


/* =========================================================================
   4. RASTERIZATION ENGINES (LEVELS 1, 2, AND 3)
   ========================================================================= */

// --- LEVEL 1: Built-In HTML5 Canvas 2D Lines ---
function drawLevel1Wireframe(ctx, p0, p1, p2, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p0.u, p0.v);
    ctx.lineTo(p1.u, p1.v);
    ctx.lineTo(p2.u, p2.v);
    ctx.closePath();
    ctx.stroke();
}

// --- LEVEL 2: Custom DDA Line Rasterization with Z-Buffering ---
function drawLevel2CustomLine(p1, p2, color) {
    // 1. Determine step count along primary axis
    // 2. Interpolate u, v, and depth z incrementally along the line
    // 3. For each pixel: check if z < zBuffer[index], update zBuffer, and set pixel color
}

// --- LEVEL 3: Custom Filled Triangle Surface Rasterization ---
function drawLevel3FilledTriangle(p0, p1, p2, color) {
    // 1. Calculate 2D Bounding Box around p0, p1, p2
    // 2. Loop over pixels (u, v) within the bounding box:
    //    a. Compute Barycentric Weights (alpha, beta, gamma)
    //    b. Test if point is inside triangle (alpha >= 0 && beta >= 0 && gamma >= 0)
    //    c. Interpolate depth z = (alpha * p0.z + beta * p1.z + gamma * p2.z)
    //    d. Z-buffer test: if z < zBuffer[index], write to zBuffer and set pixel color
}


/* =========================================================================
   5. FRAME RENDER LOOP & EVENT HANDLERS
   ========================================================================= */
function renderFrame(ctx) {
    // A. Clear Background (Light Blue for Day, Dark Navy for Night)
    clearBackground(isNight ? "#0b132b" : "#87ceeb");

    // B. Reset Z-Buffer to Infinity
    zBuffer.fill(Infinity);

    // C. Process and Draw All Objects
    for (let obj of sceneObjects) {
        for (let face of obj.faces) {
            // Project vertices to screen space
            let p0 = project(obj.vertices[face.v[0]]);
            let p1 = project(obj.vertices[face.v[1]]);
            let p2 = project(obj.vertices[face.v[2]]);

            // Skip face if any vertex is culled behind camera
            if (!p0 || !p1 || !p2) continue;

            let faceColor = isNight ? face.colorNight : face.colorDay;

            // Dispatch to active rendering pipeline
            if (renderLevel === 1) drawLevel1Wireframe(ctx, p0, p1, p2, faceColor);
            else if (renderLevel === 2) drawLevel2Wireframe(p0, p1, p2, faceColor);
            else if (renderLevel === 3) drawLevel3FilledTriangle(p0, p1, p2, faceColor);
        }
    }
}

// --- Event Listeners ---
// - Click Listener:   Check if click distance to projected Sun/Moon < radius -> Toggle isNight
// - Keydown Listener: W/A/S/D to shift camera position; 1/2/3 to switch renderLevel
