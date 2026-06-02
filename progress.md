# Progress Tracker

Use this file to store your game development progress, tasks, and notes.

## Initial setup
 
- [x] Create local repository
- [x] Add sample game files (`index.html`, `style.css`, `game.js`)
- [x] Connect to GitHub remote repository and pushed initial commit

## Ramen Dash prototype (added)

- Date: 2026-06-02
- Files added:
	- `index.html` : game UI and overlays (start, game over, coupon modal)
	- `style.css`  : mobile-first responsive styling and canvas sizing
	- `game.js`    : core game loop, input handlers, obstacles, collision, difficulty scaling, coupon logic

- Key features implemented:
	- Mobile-first portrait canvas (approx 9:16)
	- Tap/click/Space to jump controls
	- Obstacle spawning and collision detection
	- Survival timer shown during play
	- Coupon milestone system (only highest coupon unlocked per run)
	- Start / Game Over / Claim Coupon / Play Again flows
	- Small fix: UI buttons now receive touch events correctly on mobile

## How to run locally

You can open `index.html` directly in a browser, but serving via a simple HTTP server is recommended for consistent behavior.

Example using Python 3:

```bash
python -m http.server 8000
# then open: http://localhost:8000
```

## Next steps

- [ ] Test on multiple mobile devices and tune difficulty
- [ ] Optionally add themed graphics and sounds
- [ ] Push prototype to GitHub (completed now)
 - [ ] Add assets: place background and player images in `assets/` folder

Asset filenames expected (place in project root `assets/`):

- `assets/bp.jpg`  — background ramen shop image (suggested: provided attachment)
- `assets/player.png` — ramen bowl character (suggested: provided attachment)

After adding images, reload the page. The game will use the images automatically and fall back to placeholders if images are missing.

## Asset Processing (v2 - Updated)

- Date: 2026-06-02
- Added `process-assets.html` — Use this utility to process your images:
  1. Remove white background from player.png to make it transparent
  2. Split obstacle.png into obstacle-top.png and obstacle-bottom.png (for top/bottom pipe-like obstacles)
  
How to use:
1. Open `process-assets.html` in your browser
2. For player: Select player.png → Click "Process Player" → Download result → Save to `assets/player.png`
3. For obstacle: Select obstacle.png → Click "Split Obstacle" → Download both files → Save to `assets/obstacle-top.png` and `assets/obstacle-bottom.png`
4. Refresh the game page. New assets will load automatically.

Updated game code:
- Obstacle images now render instead of rectangles
- Player image loads with transparent background support
- Images fall back to placeholders if files not found

## Obstacle Size Fix (v4 - Current)

- Date: 2026-06-02
- **Increased obstacle width** from 70px to 120px for mobile visibility
- **Fixed obstacle rendering** to fill from screen edge to gap (like Flappy Bird)
  - Top obstacle: extends from top of screen (y=0) down to gap start
  - Bottom obstacle: extends from gap end up to ground
- **Updated collision detection** to match actual drawn obstacle dimensions
- **Preserved aspect ratio** while ensuring obstacles are large enough to see

- Date: 2026-06-02
- **Fixed obstacle distortion**: Obstacles now use proper aspect ratio scaling instead of stretching
- **Preserved image quality**: Top and bottom obstacles drawn at natural proportions
- **Improved positioning**: Top obstacle hangs from top, bottom rises from bottom with gap between
- **Collision detection updated**: Uses actual drawn obstacle dimensions

**Important: Process obstacle images to remove white background:**
1. Open `process-assets.html` in your browser
2. For obstacle-top.png:
   - Select `assets/obstacle-top.png` 
   - Treat it like the "player" process - remove white background to make transparent
   - You may need to process it manually or use an image editor
3. For obstacle-bottom.png:
   - Same as above - process to remove white background
4. Save the transparent versions back to assets
5. Refresh the game to see clean obstacles without white background

If you don't have an image editor handy, please let me know and I can provide a more advanced asset processor tool.
