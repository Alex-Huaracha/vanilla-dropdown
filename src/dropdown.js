class VanillaDropdown {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      trigger: element.dataset.trigger || options.trigger || 'click',
      closeOnClickOutside: options.closeOnClickOutside !== false,
      ...options,
    };

    this.toggle = element.querySelector('.dropdown-toggle');
    this.menu = element.querySelector('.dropdown-menu');
    this.isOpen = false;

    this.selectedValue = null;
    this.selectedText = null;

    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) {
      console.warn(
        'Dropdown requires .dropdown-toggle and .dropdown-menu elements'
      );
      return;
    }

    this.setupEventListeners();
    this.setupAccessibility();
  }

  setupEventListeners() {
    if (this.options.trigger === 'click') {
      this.toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      });
    } else if (this.options.trigger === 'hover') {
      this.element.addEventListener('mouseenter', () => {
        this.openDropdown();
      });

      this.element.addEventListener('mouseleave', () => {
        this.closeDropdown();
      });
    }

    // Close on click outside
    if (this.options.closeOnClickOutside) {
      document.addEventListener('click', (e) => {
        if (!this.element.contains(e.target) && this.isOpen) {
          this.closeDropdown();
        }
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDropdown();
        this.toggle.focus();
      }
    });

    // Handle menu item clicks
    this.menu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();

        this.selectedValue =
          e.target.getAttribute('data-value') || e.target.href;
        this.selectedText = e.target.textContent.trim();

        if (this.options.updateToggleText) {
          this.toggle.textContent = this.selectedText + ' ▼';
        }

        this.element.dispatchEvent(
          new CustomEvent('dropdown:select', {
            detail: {
              dropdown: this,
              value: this.selectedValue,
              text: this.selectedText,
              element: e.target,
            },
          })
        );

        this.closeDropdown();
      }
    });
  }

  getSelectedValue() {
    return this.selectedValue;
  }

  getSelectedText() {
    return this.selectedText;
  }

  setupAccessibility() {
    // Set ARIA attributes
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-haspopup', 'true');
    this.menu.setAttribute('role', 'menu');

    // Make menu items focusable and add role
    const menuItems = this.menu.querySelectorAll('a');
    menuItems.forEach((item, index) => {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '-1');
    });

    // Keyboard navigation
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.openDropdown();
        this.focusFirstMenuItem();
      }
    });

    // Menu keyboard navigation
    this.menu.addEventListener('keydown', (e) => {
      const menuItems = Array.from(this.menu.querySelectorAll('a'));
      const currentIndex = menuItems.indexOf(document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % menuItems.length;
          menuItems[nextIndex].focus();
          break;

        case 'ArrowUp':
          e.preventDefault();
          const prevIndex =
            currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          menuItems[prevIndex].focus();
          break;
      }
    });
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    if (this.isOpen) return;

    // Close other open dropdowns
    VanillaDropdown.closeAllDropdowns(this);

    this.isOpen = true;
    this.menu.classList.add('show');
    this.element.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');

    // Emit custom event
    this.element.dispatchEvent(
      new CustomEvent('dropdown:open', {
        detail: { dropdown: this },
      })
    );
  }

  closeDropdown() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.menu.classList.remove('show');
    this.element.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');

    // Emit custom event
    this.element.dispatchEvent(
      new CustomEvent('dropdown:close', {
        detail: { dropdown: this },
      })
    );
  }

  focusFirstMenuItem() {
    const firstMenuItem = this.menu.querySelector('a');
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }

  destroy() {
    this.closeDropdown();
    const index = VanillaDropdown.instances.indexOf(this);
    if (index > -1) {
      VanillaDropdown.instances.splice(index, 1);
    }
    delete this.element.vanillaDropdown;
  }

  // Static method to close all open dropdowns except the current one
  static closeAllDropdowns(except = null) {
    VanillaDropdown.instances.forEach((instance) => {
      if (instance !== except && instance.isOpen) {
        instance.closeDropdown();
      }
    });
  }

  // Static method to initialize all dropdowns on the page
  static initAll() {
    const dropdownElements = document.querySelectorAll('.dropdown');

    dropdownElements.forEach((element) => {
      // Avoid double initialization
      if (!element.vanillaDropdown) {
        const dropdown = new VanillaDropdown(element);
        element.vanillaDropdown = dropdown;
        VanillaDropdown.instances.push(dropdown);
      }
    });
  }
}

// Static property to keep track of all instances
VanillaDropdown.instances = [];

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', VanillaDropdown.initAll);
} else {
  VanillaDropdown.initAll();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VanillaDropdown;
}

// Global variable for direct usage
window.VanillaDropdown = VanillaDropdown;
