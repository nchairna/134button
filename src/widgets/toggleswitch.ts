import { IdleUpWidgetState, Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, G } from "../core/ui";

class ToggleSwitch extends Widget {
    private _track: Rect;
    private _handle: Rect;
    private _isOn: boolean = false;
    private _onToggleCallback?: (isOn: boolean) => void;
    private readonly TRACK_WIDTH = 50;
    private readonly TRACK_HEIGHT = 24;
    private readonly HANDLE_SIZE = 20;

    constructor(parent: Window) {
        super(parent);
        this.width = this.TRACK_WIDTH;
        this.height = this.TRACK_HEIGHT;
        this.role = RoleType.button;
        this.setState(new IdleUpWidgetState());
        this.render();
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        // Track (background)
        this._track = this._group.rect(this.TRACK_WIDTH, this.TRACK_HEIGHT)
            .radius(this.TRACK_HEIGHT / 2)
            .fill('#ccc');

        // Handle (knob)
        this._handle = this._group.rect(this.HANDLE_SIZE, this.HANDLE_SIZE)
            .radius(this.HANDLE_SIZE / 2)
            .fill('#fff')
            .stroke({ color: '#bbb', width: 1 })
            .move(2, 2);

        this.outerSvg = this._group;

        // Add invisible rect for event handling that covers the entire widget
        const eventRect = this._group.rect(this.TRACK_WIDTH, this.TRACK_HEIGHT)
            .opacity(0)
            .attr('id', 0);

        // Register events
        this.registerEvent(eventRect);
    }

    private updateState(): void {
        // Keep the handle within its parent group's coordinate space
        const handleX = this._isOn ? 
            this.TRACK_WIDTH - this.HANDLE_SIZE - 2 : 2;
            
        this._track.fill(this._isOn ? '#4CAF50' : '#ccc');
        this._handle.move(handleX, 2);

        if (this._onToggleCallback) {
            this._onToggleCallback(this._isOn);
        }
    }

    public onToggle(callback: (isOn: boolean) => void): void {
        this._onToggleCallback = callback;
    }

    pressReleaseState(): void {
        this._isOn = !this._isOn;
        this.updateState();
    }

    // Required state methods
    idleupState(): void {}
    idledownState(): void {}
    pressedState(): void {}
    hoverState(): void {
        this._track.fill(this._isOn ? '#45a049' : '#bbb');
    }
    hoverPressedState(): void {}
    pressedoutState(): void {}
    moveState(): void {}
    keyupState(): void {}
}

export { ToggleSwitch } 