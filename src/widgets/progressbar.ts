import { IdleUpWidgetState, Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, G } from "../core/ui";

class ProgressBar extends Widget {
    private _track: Rect;
    private _fill: Rect;
    private _label: Text;
    private _value: number = 0;
    private _increment: number = 10;
    private _width: number = 200;
    private readonly HEIGHT = 20;
    private _onProgressCallback?: (value: number) => void;
    private _onStateChangeCallback?: (state: string) => void;

    constructor(parent: Window) {
        super(parent);
        this.width = this._width;
        this.height = this.HEIGHT;
        this.role = RoleType.button;
        this.setState(new IdleUpWidgetState());
        this.render();
    }

    // Public API
    public setWidth(width: number): void {
        this._width = width;
        this.width = width;
        this.updateLayout();
    }

    public setIncrement(value: number): void {
        this._increment = Math.max(0, Math.min(100, value));
    }

    public getIncrement(): number {
        return this._increment;
    }

    public setValue(value: number): void {
        const oldValue = this._value;
        this._value = Math.max(0, Math.min(100, value));
        
        if (oldValue !== this._value) {
            this.updateProgress();
            if (this._onProgressCallback) {
                this._onProgressCallback(this._value);
            }
        }
    }

    public increment(amount: number = this._increment): void {
        this.setValue(this._value + amount);
    }

    public onProgress(callback: (value: number) => void): void {
        this._onProgressCallback = callback;
    }

    public onStateChange(callback: (state: string) => void): void {
        this._onStateChangeCallback = callback;
    }

    private updateLayout(): void {
        if (!this._track) return;

        this._track.width(this._width);
        this.updateProgress();
    }

    private updateProgress(): void {
        if (!this._fill || !this._label) return;

        const fillWidth = (this._value / 100) * this._width;
        this._fill.width(fillWidth);
        this._label.text(`${Math.round(this._value)}%`);
        
        // Center the label - use plain numbers instead of bbox()
        this._label.move(
            this._width / 2,
            this.HEIGHT / 2
        ).center(this._width / 2, this.HEIGHT / 2);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        // Track (background)
        this._track = this._group.rect(this._width, this.HEIGHT)
            .fill('#f0f0f0')
            .stroke({ color: '#8a8a8a', width: 1 })
            .radius(3);

        // Fill (progress)
        this._fill = this._group.rect(0, this.HEIGHT)
            .fill('#4CAF50')
            .radius(3);

        // Label
        this._label = this._group.text('0%')
            .font({
                family: 'Arial, Helvetica, sans-serif',
                size: 12,
                weight: 'bold',
                anchor: 'middle', // Add this to center the text horizontally
                leading: '1.2em'
            })
            .fill('#000000')
            .center(this._width / 2, this.HEIGHT / 2); // Center initially

        this.outerSvg = this._group;
        this.updateProgress();
    }

    // State implementations with state change notifications
    idleupState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('idle');
        }
    }

    idledownState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('idle-down');
        }
    }

    pressedState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('pressed');
        }
    }

    pressReleaseState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('released');
        }
    }

    hoverState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('hover');
        }
    }

    hoverPressedState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('hover-pressed');
        }
    }

    pressedoutState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('pressed-out');
        }
    }

    moveState(): void {
        if (this._onStateChangeCallback) {
            this._onStateChangeCallback('move');
        }
    }

    keyupState(): void {}
}

export { ProgressBar } 