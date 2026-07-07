export const PREVIEW_PERSPECTIVE_PX = 3000;
export const MAX_CAMERA_YAW_DEG = 20;

/**
 * Fixed horizontal width for any single section's seat cluster. Every
 * section uses this same width, which is what keeps camera yaw bounded
 * by construction — worldX can never exceed this regardless of how many
 * sections/clusters exist or how far back one is.
 */
export const CLUSTER_WIDTH_PX = 2000;

/** Depth step between adjacent sections, stacked back-to-back. */
export const SECTION_Z_STEP_PX = 200;

/** Depth step between rows within the same section. */
export const ROW_Z_STEP_PX = 100;

/** Vertical elevation step between sections — each section is higher
 * (more negative worldY) than the one before it. Must be >= ROW_Y_STEP_PX
 * so each section starts at the same height as the previous section's
 * back row. */
export const SECTION_Y_STEP_PX = 80;

/** Base vertical offset for the front-most row of section 0, in px
 * below viewport center. Positive = lower. */
export const BASE_Y_OFFSET_PX = 500;

/** Vertical step between rows within the same section, in px.
 * Front-to-back row height difference. */
export const ROW_Y_STEP_PX = 80;

/** World-space position of the screen (same coordinate system as seats). */
export const SCREEN_WORLD_X = 0;
export const SCREEN_WORLD_Y = -50;
export const SCREEN_WORLD_Z = -400;
export const SCREEN_WIDTH_PX = 1600;
export const SCREEN_HEIGHT_PX = 900;
