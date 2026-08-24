# Focus Tab Groups

Focus Obsidian editor tab groups by number using configurable hotkeys.

The plugin adds commands for focusing editor groups directly, similar to the editor group navigation available in IDEs such as Visual Studio Code.

## Features

- Focus editor groups 1–9
- Visual group numbering
- Configurable through Obsidian Hotkeys
- No default hotkeys
- Sidebars are excluded from group numbering

## Usage

After enabling the plugin, open:

`Settings → Hotkeys`

Search for:

`Focus tab group`

The plugin adds the following commands:

- Focus tab group 1
- Focus tab group 2
- Focus tab group 3
- ...
- Focus tab group 9

You can assign any shortcuts you prefer.

For example:

```text
Ctrl+1 → Focus tab group 1
Ctrl+2 → Focus tab group 2
Ctrl+3 → Focus tab group 3
```

This works well together with separate shortcuts for selecting tabs inside the current group.

For example:

```text
Ctrl+1 → Group 1
Ctrl+2 → Group 2
Ctrl+3 → Group 3

Alt+1 → Tab 1 in the current group
Alt+2 → Tab 2 in the current group
Alt+3 → Tab 3 in the current group
```

## Group numbering

Tab groups are numbered according to their visual position

Groups are ordered:
1. Left to right
2. Top to bottom

Example:
```text
┌──────────────┬──────────────┐
│   Group 1    │   Group 2    │
├──────────────┼──────────────┤
│   Group 3    │   Group 4    │
└──────────────┴──────────────┘
```

Only groups in the main editor workspace are counted.

The left and right Obsidian sidebars are ignored.

When switching to a group, the plugin focuses the tab that is already selected in that group.

# Installation

## Community Plugins

The plugin is not yet available in the official Obsidian Community Plugins directory

## Manual installation

Download the following files from the latest GitHub release:
- `main.js`
- `manifest.json`

Create the following directory inside your vault:
```text
<path>/<to>/<vault>/.obsidian/plugins/focus-tab-groups/
```

Copy the downloaded files into it
```text
.obsidian/
└── plugins/
    └── focus-tab-groups/
        ├── main.js
        └── manifest.json
```

Restart Obsidian

Then open `Settings -> Community plugins` and enable **Focus Tab Groups**

# Development

Requirements:
- Node.js
- npm

Clone the repository and install dependencies:
```bash
git clone https://github.com/raykotarou/focus-tab-groups-obsidian.git
cd focus-tab-groups-obsidian
npm install
```

Run the development build

```bash
npm run dev
```

Create a production build

```bash
npm run build
```

Run the linter

```bash
npm run lint
```

The production build creates `main.js` in the project root

# License

Focus Tab Groups is licensed under the GNU General Public License v3.0

See [LICENSE](LICENSE) for details.