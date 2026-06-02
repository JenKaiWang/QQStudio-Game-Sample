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
