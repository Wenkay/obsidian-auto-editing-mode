import { Plugin, MarkdownView } from 'obsidian';
import { AutoToggleModeSettingTab, AutoToggleModeSettings, DEFAULT_SETTINGS } from './settings';

export default class AutoToggleModePlugin extends Plugin {
    settings: AutoToggleModeSettings;
    private clickListener: EventListener | null = null;
    private visibilityListener: EventListener | null = null;
    private timer: NodeJS.Timeout | null = null;
    private lastClickTime: number = 0;
    private clickDelay: number = 300; // 300ms 防抖延迟

    async onload() {
        console.log('Loading Auto Toggle Mode plugin');
        
        // Load settings
        await this.loadSettings();
        
        // Add settings tab
        this.addSettingTab(new AutoToggleModeSettingTab(this.app, this));
        
        // Register event to handle layout changes
        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.setupClickListener();
                this.setupVisibilityListener();
            })
        );
        
        // Initial setup
        this.setupClickListener();
        this.setupVisibilityListener();
    }

    async onunload() {
        console.log('Unloading Auto Toggle Mode plugin');
        
        // Clean up event listeners
        if (this.clickListener) {
            document.removeEventListener('click', this.clickListener);
        }
        
        if (this.visibilityListener) {
            document.removeEventListener('visibilitychange', this.visibilityListener);
        }
        
        // Clear timer if active
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    private setupClickListener() {
        // Remove existing listener if any
        if (this.clickListener) {
            document.removeEventListener('click', this.clickListener);
        }
        
        // Add click listener to the document
        this.clickListener = (e: MouseEvent) => {
            this.handleDocumentClick(e);
        };
        
        document.addEventListener('click', this.clickListener);
    }

    private setupVisibilityListener() {
        // Remove existing visibility listener if any
        if (this.visibilityListener) {
            document.removeEventListener('visibilitychange', this.visibilityListener);
        }
        
        // Add visibility change listener
        this.visibilityListener = () => {
            this.handleVisibilityChange();
        };
        
        document.addEventListener('visibilitychange', this.visibilityListener);
    }

    // 检查元素是否为 Obsidian 的模式切换控件
    private isModeToggleControl(element: HTMLElement): boolean {
        // 检查元素本身或其父元素是否具有 Obsidian 模式切换控件的特征
        let currentElement: HTMLElement | null = element;
        
        while (currentElement) {
            // 检查是否为模式切换按钮
            if (currentElement.classList && currentElement.getAttribute('aria-label')) {
                const ariaLabel = currentElement.getAttribute('aria-label');
                if (ariaLabel && (ariaLabel.includes('mode') || ariaLabel.includes('模式') || 
                    ariaLabel.includes('Edit') || ariaLabel.includes('编辑') ||
                    ariaLabel.includes('Preview') || ariaLabel.includes('预览'))) {
                    return true;
                }
            }
            
            // 检查是否为视图动作按钮容器
            if (currentElement.classList && currentElement.classList.contains('view-action')) {
                return true;
            }
            
            // 检查是否为导航栏中的按钮
            if (currentElement.classList && currentElement.classList.contains('nav-action-button')) {
                return true;
            }
            
            // 检查是否为工具栏按钮
            if (currentElement.classList && currentElement.classList.contains('clickable-icon')) {
                return true;
            }
            
            // 向上查找父元素
            currentElement = currentElement.parentElement;
            
            // 限制查找层级，避免性能问题
            if (currentElement && currentElement.closest && currentElement.closest('.workspace-split')) {
                break;
            }
        }
        
        return false;
    }

    private handleDocumentClick(e: MouseEvent) {
        // 防抖处理：避免短时间内多次点击
        const currentTime = Date.now();
        if (currentTime - this.lastClickTime < this.clickDelay) {
            return;
        }
        this.lastClickTime = currentTime;
        
        // 检查是否点击了 Obsidian 的模式切换控件
        const target = e.target as HTMLElement;
        if (this.isModeToggleControl(target)) {
            // 如果点击的是模式切换控件，不进行干预，让 Obsidian 自己处理
            console.log('Clicked on mode toggle control, allowing Obsidian to handle it');
            return;
        }
        
        // 获取当前视图
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;
        
        const state = view.getState();
        
        // 如果当前处于阅读模式，点击后切换到编辑模式
        if (view.getViewType() === 'markdown' && state.mode !== 'source') {
            console.log('Switching from reading mode to editing mode');
            view.leaf.setViewState({
                type: 'markdown',
                state: { mode: 'source' }
            });
        }
        // 如果当前处于编辑模式，不进行干预，用户可以通过 Obsidian 的控件切换回阅读模式
        // 这样就避免了循环切换的问题
        else if (view.getViewType() === 'markdown' && state.mode === 'source') {
            console.log('Already in editing mode, not interfering with user actions');
        }
    }

    private handleVisibilityChange() {
        // If document is hidden (window minimized or tab switched) and we're in editing mode
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (document.hidden && view && view.getViewType() === 'markdown' && view.getState().mode === 'source') {
            // Clear any existing timer
            if (this.timer) {
                clearTimeout(this.timer);
            }
            
            // Set timer to switch back to reading mode after configured duration
            this.timer = setTimeout(() => {
                const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (currentView && currentView.getViewType() === 'markdown' && currentView.getState().mode === 'source') {
                    // Switch back to reading mode
                    console.log('Switching back to reading mode after window minimization timeout');
                    currentView.leaf.setViewState({
                        type: 'markdown',
                        state: { mode: 'preview' }
                    });
                }
                this.timer = null;
            }, this.settings.timeoutDuration); // Use configured timeout duration
        } else if (!document.hidden && this.timer) {
            // If document is visible again and we have a timer, clear it
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}