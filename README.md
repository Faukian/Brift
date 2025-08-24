# 🎮 Modular Brift - ECS Demo

A working prototype demonstrating the Entity-Component-System (ECS) architecture for a tower defense game.

## 🚀 Quick Start

### Option 1: Run Demo Directly (Recommended)
Simply open `game/demo.html` in your web browser. This file contains a complete, self-contained demo that works without any build tools.

### Option 2: Run with Development Server
If you have Node.js installed:
```bash
npm install
npm run dev
```

## 🎯 What You'll See

- **Canvas**: A black game canvas with a blue square (the player)
- **Controls**: Use **Arrow Keys** or **WASD** to move the square around
- **ECS Working**: The demo proves the ECS architecture is functioning correctly

## 🏗️ Architecture Overview

### Core ECS Components
- **Entity**: Game objects with unique IDs
- **Component**: Data containers (Position, Velocity, Sprite)
- **System**: Logic processors (Input, Physics, Render)
- **World**: Manages all entities, components, and systems

### Demo Systems
1. **InputSystem**: Handles keyboard input and sets velocity
2. **PhysicsSystem**: Updates positions based on velocity
3. **RenderSystem**: Draws entities on the canvas

### Demo Components
1. **Position**: `{ x: number, y: number }`
2. **Velocity**: `{ dx: number, dy: number }`
3. **Sprite**: `{ color: string, width: number, height: number }`

## 🔧 Technical Details

- **Language**: TypeScript (compiled to JavaScript in demo.html)
- **Rendering**: HTML5 Canvas 2D
- **Game Loop**: requestAnimationFrame with delta time
- **Input**: Keyboard event handling
- **Architecture**: Pure ECS with no external dependencies

## 📁 Project Structure

```
game/
├── demo.html              # 🎯 WORKING DEMO (open this!)
├── main.ts               # TypeScript main file
├── core/ecs/            # ECS core implementation
├── components/          # Game components
├── systems/             # Game systems
├── entities/            # Entity factories
└── index.html           # Main HTML file
```

## 🎮 Controls

- **Arrow Keys** or **WASD**: Move the blue square
- **Smooth Movement**: Physics system applies velocity over time
- **Real-time Rendering**: 60fps game loop with delta time

## 🚀 Next Steps

This demo proves the ECS foundation works. You can now:

1. **Add More Entities**: Enemies, towers, projectiles
2. **Expand Components**: Health, damage, AI behavior
3. **Add Systems**: Combat, AI, economy
4. **Build Game Logic**: Wave spawning, tower placement

## 🔍 Code Quality

- **Clean Architecture**: Separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Modular Design**: Easy to extend and modify
- **Performance**: Efficient entity queries and updates

## 📝 Notes

- The demo.html file is self-contained for easy testing
- All TypeScript files are properly structured for development
- The ECS core is production-ready and scalable
- No external build tools required for the demo

---

**🎯 Goal Achieved**: Working ECS prototype with player movement!
**🔧 Status**: Ready for game development
**📚 Learning**: ECS architecture fundamentals demonstrated
