# Progress Tracker

Use this file to store the game development status, current implementation details, and next tasks.

## Initial setup

- [x] Create local repository
- [x] Add sample game files (`index.html`, `style.css`, `game.js`)
- [x] Connect to GitHub remote repository and push initial commit

## Flappy Ramen prototype

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

## Character animation update

- Date: 2026-06-04
- Files added / updated:
  - `game.js`: added simple 2-frame character sprite swapping on jump input
  - `assets/character_open.png`: default idle character frame
  - `assets/character_close.png`: brief jump animation frame

- Current implementation:
  - The player uses `assets/character_open.png` while idle
  - Tap / click / Space jump input briefly switches the player to `assets/character_close.png`
  - The closed frame stays visible for about 125ms, then returns to the open frame
  - Player size, player position, gravity, controls, timer, coupons, and obstacle logic remain unchanged
  - The animation uses whole-sprite image swapping only, with no separated eye or chopstick layers

## Time UI and background music update

- Date: 2026-06-05
- Files added / updated:
  - `index.html`: replaced the plain time text with a progress bar structure
  - `style.css`: added responsive ramen-themed styling for the time progress bar
  - `game.js`: updates time text and progress fill every frame, capped at 60 seconds
  - `assets/bgm.mp3`: added background music for gameplay

- Current implementation:
  - The Time HUD now displays a horizontal progress bar that fills from 0 to 60 seconds
  - Time progress uses `Math.min(currentTime / 60, 1)` so the bar never exceeds 100%
  - The time text remains readable on top of the warm orange progress fill
  - Background music starts only after the user starts the game
  - Music loops during gameplay at low volume (`0.3`)
  - Music pauses on Game Over and resets when the player returns to the start/play-again flow
  - Gameplay, player movement, obstacles, timer calculation, coupon logic, layout, and character animation remain unchanged

## Prize notification update

- Date: 2026-06-05
- Files added / updated:
  - `index.html`: added a top-center prize notification overlay inside the game container
  - `style.css`: added a lightweight ramen-themed banner style with fade/slide animation
  - `game.js`: added one-time reward milestone tracking and auto-hide notification logic

- Current implementation:
  - A "Prize Unlocked!" banner appears when the player reaches a new coupon milestone
  - The banner shows the unlocked reward name and disappears automatically after about 2 seconds
  - Each milestone notification triggers only once per game run
  - The notification resets when starting a new game and hides on Game Over
  - Player movement, obstacles, timer system, coupon logic, game over screen, and overall layout remain unchanged

## How to run locally

You can open `index.html` directly in a browser, but using a local HTTP server is recommended.

Example using Python 3:

```bash
python -m http.server 8000
# then open: http://localhost:8000
```

## Notes

- `assets/` may contain optional image files, but the current obstacle rendering does not depend on `obstacle-top.png` or `obstacle-bottom.png`.
- The current game uses `assets/character_open.png` and `assets/character_close.png` for the player character animation.
- `process-assets.html` exists in the repository, but the obstacle image pipeline is not required for the current playable version.

## Next steps

- [ ] Test gameplay and obstacle spacing on multiple mobile devices
- [ ] Tune difficulty and spawn/gap sizing if needed
- [ ] Add themed audio and visual polish later
- [ ] Clean up obsolete asset files or update docs if image-based obstacles are restored
- [ ] Keep `progress.md` updated with any future changes so it stays easy for both humans and agents to read
