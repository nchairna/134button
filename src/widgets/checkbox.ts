import {IdleUpWidgetState, Window, Widget, RoleType, EventArgs} from "../core/ui";
import {Rect, Text, G} from "../core/ui";

class Checkbox extends Widget {
    private _box: Rect;
    private _checkmark: G;
    private _label: Text;
    private _checked: boolean = false;
    private _labelText: string = "Checkbox";
    private _fontSize: number = 14;
    private defaultSize: number = 20;
    private _onChangeCallback?: (checked: boolean) => void;

    constructor(parent: Window) {
        super(parent);
        
        // Set defaults
        this.width = this.defaultSize;
        this.height = this.defaultSize;
        
        // Set ARIA role
        this.role = RoleType.button;
        
        // Render widget
        this.render();
        
        // Set default state
        this.setState(new IdleUpWidgetState());
        
        // Prevent text selection
        this.selectable = false;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        
        // Create checkbox
        this._box = this._group.rect(this.width, this.height)
            .radius(3)
            .fill('#ffffff')
            .stroke({ color: '#8a8a8a', width: 2 });

        // Create checkmark group and path
        this._checkmark = this._group.group();
        this._checkmark.path('M5 10 L8 15 L15 5')
            .fill('none')
            .stroke({ color: '#4CAF50', width: 3 });
        this._checkmark.hide();

        // Create label
        this._label = this._group.text(this._labelText)
            .font({
                family: 'Arial, Helvetica, sans-serif',
                size: this._fontSize
            })
            .move(this.width + 10, 3);

        this.outerSvg = this._group;

        // Add invisible rect for better click handling
        let eventRect = this._group.rect(this.width + this._label.length() + 10, this.height)
            .opacity(0);

        // Register events
        this.registerEvent(eventRect);
    }

    set checked(value: boolean) {
        this._checked = value;
        this.update();
        if (this._onChangeCallback) {
            this._onChangeCallback(this._checked);
        }
    }

    get checked(): boolean {
        return this._checked;
    }

    set label(text: string) {
        this._labelText = text;
        if (this._label) {
            this._label.text(text);
        }
    }

    onChange(callback: (checked: boolean) => void): void {
        this._onChangeCallback = callback;
    }

    override update(): void {
        if (this._checkmark) {
            if (this._checked) {
                this._checkmark.show();
            } else {
                this._checkmark.hide();
            }
        }
        super.update();
    }

    // State implementations
    pressReleaseState(): void {
        this.checked = !this.checked;
        this.backcolor = "#ffffff";
        this._box.stroke({ color: '#8a8a8a', width: 2 });
        this.raise(new EventArgs(this));
    }

    idleupState(): void {
        this.backcolor = "#ffffff";
        this._box.stroke({ color: '#8a8a8a', width: 2 });
    }

    idledownState(): void {
        this.backcolor = "#e0e0e0";
        this._box.stroke({ color: '#8a8a8a', width: 2 });
    }

    pressedState(): void {
        this.backcolor = "#e0e0e0";
        this._box.stroke({ color: '#4CAF50', width: 2 });
    }

    hoverState(): void {
        this.backcolor = "#f5f5f5";
        this._box.stroke({ color: '#4CAF50', width: 2 });
    }

    hoverPressedState(): void {
        this.backcolor = "#e0e0e0";
        this._box.stroke({ color: '#4CAF50', width: 2 });
    }

    pressedoutState(): void {
        this.backcolor = "#ffffff";
        this._box.stroke({ color: '#8a8a8a', width: 2 });
    }

    moveState(): void {
        // Keep current state
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.code === 'Space' || keyEvent.code === 'Enter')) {
            this.checked = !this.checked;
            if (this._onChangeCallback) {
                this._onChangeCallback(this._checked);
            }
        }
    }
}

export { Checkbox } 