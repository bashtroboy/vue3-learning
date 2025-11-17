# Plugin Builder Exercise - Solution

This is a complete implementation of the plugin system exercise.

## What's Included

- **Notification Plugin**: Complete toast system with Teleport
- **Theme Plugin**: Light/dark mode with persistence
- **Analytics Plugin**: Event tracking system  
- **Custom Directives**: v-toast, v-track, v-theme
- **Composables**: Type-safe access to all plugins

## Running the Solution

```bash
npm install
npm run dev
```

## Key Implementation Details

### Plugin Architecture
- Each plugin uses provide/inject
- Symbols used as injection keys
- Configuration support
- Composables for easy access

### Features Implemented
- Toast notifications with auto-dismiss
- Theme switching with localStorage
- Analytics event tracking
- Custom directives integration
- Full TypeScript support (bonus)

Compare with starter to see the implementation!
