# Vanilla Dropdown

A beautiful, accessible dropdown component with glassmorphism dark theme built in vanilla JavaScript.

## Features

- Glassmorphism dark theme design
- Click or hover triggers
- Full accessibility support (ARIA, keyboard navigation)
- Responsive design
- Multiple dropdowns support
- Auto-initialization
- Zero dependencies

## Installation

```bash
npm install vanilla-dropdown
```

## Usage

### Basic HTML

```html
<div class="dropdown" data-trigger="click">
  <button class="dropdown-toggle">Menu ▼</button>
  <ul class="dropdown-menu">
    <li><a href="#" data-value="option1">Option 1</a></li>
    <li><a href="#" data-value="option2">Option 2</a></li>
  </ul>
</div>
```

### Include CSS and JS

```html
<link rel="stylesheet" href="node_modules/vanilla-dropdown/src/dropdown.css" />
<script src="node_modules/vanilla-dropdown/src/dropdown.js"></script>
```

### Programmatic Usage

```javascript
// Auto-initializes all .dropdown elements
// Or create manually:
const dropdown = new VanillaDropdown(element, {
  trigger: 'click', // or 'hover'
  closeOnClickOutside: true,
});

// Get selected values
dropdown.getSelectedValue();
dropdown.getSelectedText();
```

## License

MIT © Alex Huaracha
