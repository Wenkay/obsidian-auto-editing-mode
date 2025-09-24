import { Plugin, MarkdownView, WorkspaceLeaf } from 'obsidian';

export default class AutoToggleModePlugin extends Plugin {
    private timer: NodeJS.Timeout | null = null;
    private isEditing = false;
    private clickListener: EventListener | null = null;

    async onload() {
        console.log('Loading Auto Toggle Mode plugin');
        
        // Register event to handle layout changes
        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.setupClickListener();
            })
        );
        
        // Initial setup
        this.setupClickListener();
    }

    async onunload() {
        console.log('Unloading Auto Toggle Mode plugin');
        
        // Clean up event listeners
        if (this.clickListener) {
            document.removeEventListener('click', this.clickListener);
        }
        
        // Clear timer if active
        if (this.timer) {
            clearTimeout(this.timer);
        }
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

    private handleDocumentClick(e: MouseEvent) {
        // Get the current view
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        
        if (!view) return;
        
        // Check if we're in reading mode (preview mode)
        if (view.getViewType() === 'markdown' && !this.isEditing) {
            // Switch to editing mode
            view.leaf.setViewState({
                type: 'markdown',
                state: { mode: 'source' } // or 'live' for live preview
            });
            this.isEditing = true;
            
            // Clear any existing timer
            if (this.timer) {
                clearTimeout(this.timer);
            }
            
            // Set timer to switch back to reading mode after 10 seconds
            this.timer = setTimeout(() => {
                // Only switch back if we're still in editing mode
                if (this.isEditing) {
                    const currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (currentView && currentView.getViewType() === 'markdown') {
                        // Switch back to reading mode
                        currentView.leaf.setViewState({
                            type: 'markdown',
                            state: { mode: 'preview' }
                        });
                        this.isEditing = false;
                    }
                }
            }, 10000); // 10 seconds
        }
    }
}