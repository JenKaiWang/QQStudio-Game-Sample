# QQStudio Game Sample - Ramen Dash

Ramen Dash is a simple mobile-friendly browser game built with HTML, CSS, and vanilla JavaScript. The game uses a ramen restaurant theme where the player controls a cute ramen bowl character and tries to survive as long as possible while avoiding obstacles.

The longer the player survives, the better coupon reward they unlock.

## Game Topic

This game is designed as a restaurant promotion mini-game. A ramen shop can use it to let customers play for digital coupon rewards, such as a free appetizer, free drink, ramen discount, or free topping.

The current version includes:

- A ramen-themed background
- A ramen bowl player character
- Tap, click, and keyboard controls
- Survival timer
- Increasing difficulty over time
- Coupon rewards based on survival time
- Game over and coupon claim screens

## How To Download And Play

### Option 1: Download From GitHub

1. Open the GitHub repository page.
2. Click the green **Code** button.
3. Click **Download ZIP**.
4. Extract the ZIP file on your computer.
5. Open `index.html` in a web browser.

### Option 2: Clone With Git

```bash
git clone https://github.com/JenKaiWang/QQStudio-Game-Sample.git
cd QQStudio-Game-Sample
```

Then open `index.html` in a browser.

### Recommended Local Server

For the best result, run the project with a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Gameplay Logic

The player controls a ramen bowl character. The character falls because of gravity, and the player must jump to avoid hitting the top, bottom, or moving obstacles.

Controls:

- Tap the screen to jump
- Click the mouse to jump
- Press the Space key to jump

The game ends when the player hits an obstacle, the top of the screen, or the ground.

## Coupon Reward Logic

Rewards are based on how long the player survives:

- 10 seconds: Free appetizer
- 20 seconds: Free drink
- 30 seconds: 10% off ramen
- 45 seconds: Free ramen topping
- 60 seconds: Buy one ramen, get one half off

When the game ends, the highest unlocked reward is shown. The player can then claim the coupon and view the coupon code.

## Project Files

- `index.html`: Main game page and UI screens
- `style.css`: Mobile-first layout and visual styling
- `game.js`: Game loop, player physics, obstacle logic, collision detection, and coupon system
- `assets/`: Game images such as the background and player character
- `process-assets.html`: Helper page for preparing image assets
- `progress.md`: Development progress notes

## Current Status

Ramen Dash is playable as a browser prototype. Future improvements may include more visual polish, audio effects, better obstacle art, mobile testing, and additional coupon customization.
