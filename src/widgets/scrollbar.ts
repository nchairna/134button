import { IdleUpWidgetState, Window, Widget, RoleType, EventArgs, DragWindowState } from "../core/ui";
import { Rect, G } from "../core/ui";

class ScrollBar extends Widget {
    private _track: Rect;
    private _thumb: Rect;
    private _upButton: G;
    private _downButton: G;
    private _thumbHeight: number = 30;
    private _position: number = 0;
    private _scrollHeight: number = 200;
    private _onScrollCallback?: (position: number, direction: 'up' | 'down') => void;
    private readonly BUTTON_SIZE = 20;
    private readonly BAR_WIDTH = 16;

    constructor(parent: Window) {
        super(parent);
        this.width = this.BAR_WIDTH;
        this.isDraggable = true;
        this.role = RoleType.scrollbar;
        this.setState(new IdleUpWidgetState());
        this.render();
    }

    // Public API
    public setScrollHeight(height: number): void {
        this._scrollHeight = Math.max(height, this._thumbHeight + 2 * this.BUTTON_SIZE);
        this._position = Math.min(this._position, this.maxScrollPosition);
        this.updateLayout();
    }

    public getThumbPosition(): number {
        return this._position;
    }

    public onScroll(callback: (position: number, direction: 'up' | 'down') => void): void {
        this._onScrollCallback = callback;
    }

    // Private helpers
    private get trackHeight(): number {
        return this._scrollHeight - (2 * this.BUTTON_SIZE);
    }

    private get maxScrollPosition(): number {
        return this.trackHeight - this._thumbHeight;
    }

    private updateLayout(): void {
        if (!this._track) return;

        // Update track
        this._track.height(this.trackHeight);

        // Update thumb position
        this._thumb.move(2, this.BUTTON_SIZE + this._position);

        // Update down button position
        this._downButton.move(0, this._scrollHeight - this.BUTTON_SIZE);
    }

    private moveThumbTo(y: number, isDragging: boolean = false): void {
        // Calculate relative position within track
        const trackRect = this._track.node.getBoundingClientRect();
        const thumbRect = this._thumb.node.getBoundingClientRect();
        const groupRect = this._group.node.getBoundingClientRect();
        
        let relativeY;
        if (isDragging) {
            // When dragging, calculate position relative to track's top
            relativeY = y - trackRect.top - (thumbRect.height / 2);
        } else {
            // When clicking track, use direct position
            relativeY = y - trackRect.top;
        }
        
        // Constrain to track bounds
        const adjustedY = Math.max(0, Math.min(this.trackHeight - this._thumbHeight, relativeY));
        
        if (adjustedY === this._position) return;

        const direction = adjustedY > this._position ? 'down' : 'up';
        this._position = adjustedY;
        
        // Move thumb relative to track position
        this._thumb.move(2, this.BUTTON_SIZE + this._position);

        if (this._onScrollCallback) {
            this._onScrollCallback(this._position, direction);
        }
    }

    private scrollUp(): void {
        const newPos = Math.max(0, this._position - 10);
        this.moveThumbTo(newPos + this._track.node.getBoundingClientRect().top);
    }

    private scrollDown(): void {
        const newPos = Math.min(this.trackHeight - this._thumbHeight, this._position + 10);
        this.moveThumbTo(newPos + this._track.node.getBoundingClientRect().top);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        // Up button
        this._upButton = this._group.group();
        this._upButton.rect(this.BAR_WIDTH, this.BUTTON_SIZE)
            .fill('#ffffff')
            .stroke({ color: '#8a8a8a', width: 1 });
        this._upButton.path('M4 12 L8 8 L12 12')
            .fill('none')
            .stroke({ color: '#8a8a8a', width: 2 });

        // Track
        this._track = this._group.rect(this.BAR_WIDTH, this.trackHeight)
            .move(0, this.BUTTON_SIZE)
            .fill('#f0f0f0')
            .stroke({ color: '#8a8a8a', width: 1 });

        // Thumb
        this._thumb = this._group.rect(this.BAR_WIDTH - 4, this._thumbHeight)
            .move(2, this.BUTTON_SIZE)
            .fill('#c0c0c0')
            .radius(2);

        // Down button
        this._downButton = this._group.group();
        this._downButton.rect(this.BAR_WIDTH, this.BUTTON_SIZE)
            .fill('#ffffff')
            .stroke({ color: '#8a8a8a', width: 1 });
        this._downButton.path('M4 8 L8 12 L12 8')
            .fill('none')
            .stroke({ color: '#8a8a8a', width: 2 });
        this._downButton.move(0, this._scrollHeight - this.BUTTON_SIZE);

        this.outerSvg = this._group;

        // Event handling
        this._upButton.click(() => this.scrollUp());
        this._downButton.click(() => this.scrollDown());
        this._track.click((event: MouseEvent) => this.moveThumbTo(event.clientY, false));
        this.registerEvent(this._thumb);
    }

    // State implementations
    moveState(): void {
        if (this.rawEvent && this.state instanceof DragWindowState) {
            this.moveThumbTo(this.rawEvent.clientY, true);
        }
    }

    // Required state methods with minimal implementation
    idleupState(): void {}
    idledownState(): void {}
    pressedState(): void {}
    pressReleaseState(): void {}
    hoverState(): void {}
    hoverPressedState(): void {}
    pressedoutState(): void {}
    keyupState(): void {}
}

export { ScrollBar } 