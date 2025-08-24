# Modular Brift - Tower Defense Game

A modular tower defense game built with TypeScript and Entity-Component-System (ECS) architecture, featuring a Brotato-style gameplay with tower defense mechanics.

## 🎮 Game Features

- **ECS Architecture**: Clean, modular, and scalable game engine
- **Data-Driven Design**: All game entities configured via JSON files
- **Responsive Canvas**: Automatically scales to fit any screen size
- **Debug Mode**: Built-in performance monitoring and debugging tools
- **Modular Systems**: Easy to extend with new game mechanics

## 🏗️ Project Structure

```
game/
├── core/           # Core engine systems
│   ├── ecs/       # Entity-Component-System implementation
│   ├── input.ts   # Input management
│   ├── camera.ts  # Camera system
│   └── utils.ts   # Utility functions
├── systems/        # Game logic systems
│   ├── render.ts  # Rendering system
│   ├── physics.ts # Physics and movement
│   ├── input.ts   # Input handling
│   ├── ai.ts      # AI behavior (stub)
│   ├── combat.ts  # Combat system (stub)
│   ├── tower.ts   # Tower logic (stub)
│   ├── building.ts # Building system (stub)
│   └── economy.ts # Economy system (stub)
├── components/     # Entity components
├── entities/       # Entity factories
├── scenes/         # Game scenes and state management
├── ui/            # User interface components
├── data/          # JSON configuration files
└── assets/        # Game assets (sprites, sounds, fonts)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🎯 Controls

### Player Movement
- **WASD** or **Arrow Keys**: Move player character
- **Mouse**: Look around (future feature)

### Debug Controls
- **F1**: Toggle debug mode
- **F2**: Log game state to console
- **F3**: Reset performance counters

## 🔧 Development

### Adding New Entities
1. Create component classes in `components/`
2. Create entity factory in `entities/`
3. Add JSON configuration in `data/`
4. Create systems in `systems/` if needed

### Adding New Systems
1. Extend the `System` base class
2. Implement `update()` and optionally `render()` methods
3. Register system in `main.ts`

### JSON Configuration
All entities use JSON files for configuration:
- `player.json` - Player stats and appearance
- `enemies.json` - Enemy types and properties
- `towers.json` - Tower types and stats
- `weapons.json` - Weapon configurations
- `upgrades.json` - Upgrade paths
- `levels.json` - Level configurations

## 📊 Debug Features

- **FPS Counter**: Real-time frame rate monitoring
- **Entity Count**: Shows active entities
- **Performance Metrics**: Frame time and status
- **Hitbox Visualization**: Red dashed rectangles around entities
- **Performance Warnings**: Color-coded status indicators

## 🎨 Architecture Highlights

### ECS Core
- **Entity**: Container for components
- **Component**: Data-only objects
- **System**: Logic that operates on components
- **World**: Manages all entities and systems

### Data Flow
1. JSON files define entity properties
2. Entity factories create entities with components
3. Systems process components each frame
4. Render system draws entities to canvas

### Performance
- Efficient component queries
- Frame time tracking
- Automatic performance warnings
- Responsive canvas scaling

## 🚧 Future Features

- Enemy AI and pathfinding
- Tower targeting and combat
- Resource management
- Wave system
- Upgrade trees
- Sound effects and music
- Particle effects
- Save/load system

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with TypeScript, ECS Architecture, and ❤️**
