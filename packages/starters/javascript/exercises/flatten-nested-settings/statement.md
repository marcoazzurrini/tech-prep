# Flatten Nested Settings (medium)

Write `flattenSettings(settings)`. Settings are objects inside objects, to any depth. Return one flat object. Each key is the path to a value, with the names joined by dots.

A value is a string, a number, a boolean or `null`. An empty object adds nothing.

Example 1:
  flattenSettings({ theme: "dark", editor: { tabs: 2, font: { size: 14 } } })
  ->  { theme: "dark", "editor.tabs": 2, "editor.font.size": 14 }
Example 2: flattenSettings({ user: { name: null } })  ->  { "user.name": null }
Example 3: flattenSettings({})  ->  {}
