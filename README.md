# Auto Toggle Mode Plugin for Obsidian

This plugin automatically toggles between reading and editing modes in Obsidian.

## Features

- When you're in reading mode and click on the note, it switches to editing mode
- After 10 seconds of inactivity in editing mode, it automatically switches back to reading mode

## Installation

1. Download the latest release of the plugin
2. Extract the files to your Obsidian vault's plugins folder:
   - `<your-vault>/.obsidian/plugins/auto-toggle-mode/`
3. In Obsidian, go to Settings > Community Plugins
4. Enable the "Auto Toggle Mode" plugin

## Usage

1. Open any note in Obsidian
2. Ensure you're in reading mode (preview mode)
3. Click anywhere on the note to switch to editing mode
4. If you don't make any edits within 10 seconds, the plugin will automatically switch back to reading mode

## Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the plugin
4. The compiled plugin will be in the `main.js` file

## Configuration

Currently, the plugin does not have any configurable settings. The timeout is fixed at 10 seconds.

## Support

If you encounter any issues or have feature requests, please open an issue on the GitHub repository.