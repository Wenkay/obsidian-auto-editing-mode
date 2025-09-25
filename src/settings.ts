import { App, PluginSettingTab, Setting } from 'obsidian';

export interface AutoToggleModeSettings {
    timeoutDuration: number; // in milliseconds
}

export const DEFAULT_SETTINGS: AutoToggleModeSettings = {
    timeoutDuration: 10000 // 10 seconds
}

export class AutoToggleModeSettingTab extends PluginSettingTab {
    plugin: any; // We'll use any to avoid circular dependency

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Auto Toggle Mode Settings' });

        new Setting(containerEl)
            .setName('Timeout duration')
            .setDesc('Time in seconds before switching back to reading mode after window is minimized')
            .addSlider(slider => slider
                .setLimits(1, 60, 1)
                .setValue(this.plugin.settings.timeoutDuration / 1000)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.timeoutDuration = value * 1000;
                    await this.plugin.saveSettings();
                }));
    }
}