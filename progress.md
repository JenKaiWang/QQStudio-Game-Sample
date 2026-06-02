# Progress Tracker

Use this file to store the game development status, current implementation details, and next tasks.

## Initial setup

- [x] Create local repository
- [x] Add sample game files (`index.html`, `style.css`, `game.js`)
- [x] Connect to GitHub remote repository and push initial commit

## Ramen Dash prototype

- Date: 2026-06-02
- Files added / updated:
  - `index.html`: game UI and overlays (start screen, game over, coupon modal)
  - `style.css`: mobile-first responsive layout and canvas sizing
  - `game.js`: core game loop, input handling, obstacle logic, collision, difficulty scaling, coupon flow

- Current implementation:
  - Mobile-first portrait canvas game (~9:16)
  - Tap / click / Space to jump controls
  - Player character uses `assets/player.png` if available, otherwise an in-game placeholder
  - Obstacle pairs are now canvas-drawn rounded rectangles, not image sprites
  - Warm ramen-themed obstacle colors with dark outline and light highlight band
  - One top obstacle and one bottom obstacle per pair
  - Clear gap remains between top and bottom obstacles for player passage
  - Survival timer and coupon milestone system remain active
  - Start / Game Over / Claim Coupon / Play Again states are intact
  - Game supports mobile touch and button interactions correctly

## Current status

- [x] Simplified obstacle system to canvas-drawn shapes
- [x] Removed image-based obstacle rendering and scaling issues
- [x] Kept background image support and player image support
- [x] Adjusted obstacle width to be slimmer for mobile readability
- [x] Committed and pushed `game.js` updates to GitHub

## How to run locally

You can open `index.html` directly in a browser, but using a local HTTP server is recommended.

Example using Python 3:

```bash
python -m http.server 8000
# then open: http://localhost:8000
```

## Notes

- `assets/` may contain optional image files, but the current obstacle rendering does not depend on `obstacle-top.png` or `obstacle-bottom.png`.
- The current game still supports `assets/player.png` if present.
- `process-assets.html` exists in the repository, but the obstacle image pipeline is not required for the current playable version.

## Next steps

- [ ] Test gameplay and obstacle spacing on multiple mobile devices
- [ ] Tune difficulty and spawn/gap sizing if needed
- [ ] Add themed audio and visual polish later
- [ ] Clean up obsolete asset files or update docs if image-based obstacles are restored
- [ ] Keep `progress.md` updated with any future changes so it stays easy for both humans and agents to read
