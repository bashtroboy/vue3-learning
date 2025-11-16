# Lists & Conditionals

## What We're Building

A **Content Server Object Browser** that demonstrates rendering lists with dynamic filtering and sorting, plus conditional rendering based on data values.

This is the first lesson using **Vite** as our build tool – marking the transition from simple CDN-based apps to professional project structure.

## Key Concepts Learned

1. **v-for** - Rendering lists and iterating over data
2. **v-if / v-show** - Conditional rendering
3. **Computed Properties** - Dynamic filtering and sorting
4. **Two-way Binding (v-model)** - Form control with computed lists
5. **Array Methods** - Using computed properties with filters and sort
6. **Vite Project Structure** - Professional development setup

## Features

- **Dynamic List Rendering** - Display objects using v-for
- **Search Filtering** - Filter objects by name (v-model + computed)
- **Type Filtering** - Filter by object type
- **Smart Sorting** - Sort by name, size, modified date, or favorites
- **Conditional Badges** - Show status/size badges based on conditions (v-if/v-else)
- **Computed Statistics** - Calculate favorites count and average size
- **Responsive Design** - Works on mobile and desktop

## File Structure

```
03-lists-and-conditionals/
├── index.html              # Entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── src/
│   ├── main.js             # App initialization
│   ├── App.vue             # Main component
│   └── components/
│       ├── FilterPanel.vue  # Search, type, sort controls
│       └── ObjectItem.vue   # Card component for each object
├── README.md               # This file
└── NOTES.md                # Detailed learnings
```

## How to Run

### First Time Setup
```bash
cd 01-fundamentals/03-lists-and-conditionals
npm install
```

### Development
```bash
npm run dev
```
Opens automatically at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## What You'll Learn

### Technical Concepts
- **v-for**: Rendering lists and accessing index
- **v-if/v-else**: Conditional rendering based on logic
- **v-show**: Toggle visibility with CSS
- **Computed Properties**: Derived data that updates reactively
- **Array Methods**: .filter(), .sort(), .map() with computed
- **Two-way Binding**: v-model on form inputs connecting to computed filters

### Vue Patterns
- Parent component managing state and computed properties
- Child components receiving props and emitting events
- Computed properties for derived/filtered data
- Component composition and reusability

### Application Skills
- Filtering and searching lists
- Sorting by multiple criteria
- Empty states and loading states
- Responsive list layouts with CSS Grid

## Key Code Examples

### Using v-for to render a list
```vue
<ObjectItem
  v-for="obj in filteredAndSortedObjects"
  :key="obj.id"
  :object="obj"
  @toggle-favorite="toggleFavorite"
/>
```

### Computed property with filter and sort
```javascript
const filteredAndSortedObjects = computed(() => {
  const items = [...filteredObjects.value]
  // Apply sorting logic
  return items.sort(...)
})
```

### Conditional rendering with v-if/v-else
```vue
<span v-if="isRecent" class="badge badge-recent">Recent</span>
<span v-else-if="isModerateAge" class="badge badge-moderate">Moderate</span>
<span v-else class="badge badge-old">Old</span>
```

### Two-way binding with computed filters
```vue
<input
  :value="search"
  @input="$emit('update:search', $event.target.value)"
/>
```

## Differences from Previous Lessons

### From Lesson 1 & 2 (CDN to Vite)
- **Development Server** - `npm run dev` with hot reload
- **Component Files** - Single .vue files instead of templates as strings
- **Proper Imports** - ES modules instead of global Vue
- **Build Tool** - Vite for optimized production builds
- **Project Structure** - Real project layout vs. single HTML file

### Vue Features Used
- Lesson 1: Basic reactivity, ref(), v-model
- Lesson 2: Components, props, events
- **Lesson 3: Lists, conditionals, computed with filtering**

## Practice Challenges

Try these enhancements:

1. **Add a delete button** - Remove items from the list
2. **Bulk operations** - Select multiple items with checkboxes
3. **Pagination** - Show 5 items per page with prev/next buttons
4. **Persistent favorites** - Save favorites to localStorage
5. **Date range filter** - Add "modified between dates" filter
6. **Advanced search** - Search by ID, type, or size ranges

## Next Lesson Preview

Lesson 4 will introduce **Forms** with:
- Form validation
- v-model for different input types
- Form submission handling
- Complex form state management

## Common Gotchas

1. **Array vs. String in v-for** - Remember to use `:key` for unique identification
2. **Computed vs. Methods** - Use computed for reactive filtering, methods for one-off operations
3. **v-if vs. v-show** - v-if removes from DOM, v-show uses CSS display
4. **Modifying sorted arrays** - Always use computed properties that return new arrays
5. **Index as key** - Avoid using index as :key if the list can be reordered

## Related Content Server Concepts

This lesson teaches patterns you'll see in Application Analyzer:
- **Tree View Lists** - Recursive v-for for folder hierarchies
- **Data Tables** - Large lists with filtering and sorting
- **Filter Panels** - Multi-criteria filtering
- **Conditional Status Indicators** - Show state with color/badges
- **Computed Aggregations** - Summary statistics (count, sum, avg)

## Helpful Links

- [Vue 3 List Rendering](https://vuejs.org/guide/essentials/list.html)
- [Vue 3 Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html)
- [Vue 3 Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [Vite Documentation](https://vitejs.dev/)

---

**Ready to dive deeper?** Check out `NOTES.md` for detailed explanations and additional examples.
