import {IdleUpWidgetState, Window, Widget, RoleType, EventArgs} from "../core/ui";
import {Rect, Text, G} from "../core/ui";

class RadioButton extends Widget {
    private _circle: G;
    private _dot: G;
    private _label: Text;
    private _checked: boolean = false;
    private _labelText: string = "Radio";
    private _fontSize: number = 14;
    private defaultSize: number = 20;
    private _onChangeCallback?: (id: number, checked: boolean) => void;
    protected _group: G;
    private _id: number;
    private static _radioGroups: Map<Window, RadioButton[]> = new Map();

    constructor(parent: Window, id: number) {
        super(parent);
        this._id = id;
        
        // Set defaults
        this.width = this.defaultSize;
        this.height = this.defaultSize;
        
        // Set ARIA role
        this.role = RoleType.button;
        
        // Add to radio group
        let group = RadioButton._radioGroups.get(parent) || [];
        group.push(this);
        RadioButton._radioGroups.set(parent, group);
        
        // Render widget
        this.render();
        
        // Set default state
        this.setState(new IdleUpWidgetState());
        
        // Prevent text selection
        this.selectable = false;
    }

    render(): void {
        this._group = (this.parent as Window).window.group();
        
        // Create radio circle
        this._circle = this._group.group();
        this._circle.circle(this.width)
            .fill('white')
            .stroke({ color: '#8a8a8a', width: 2 });

        // Create dot
        this._dot = this._group.group();
        this._dot.circle(this.width * 0.5)
            .fill('#4CAF50')
            .move(this.width * 0.25, this.width * 0.25);
        this._dot.hide();

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
        if (value && !this._checked) {
            // Uncheck all other radio buttons in the group
            let group = RadioButton._radioGroups.get(this.parent as Window);
            group?.forEach(radio => {
                if (radio !== this && radio.checked) {
                    radio.checked = false;
                }
            });
        }
        this._checked = value;
        this.update();
        if (this._onChangeCallback) {
            this._onChangeCallback(this._id, this._checked);
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

    onChange(callback: (id: number, checked: boolean) => void): void {
        this._onChangeCallback = callback;
    }

    override update(): void {
        if (this._dot) {
            if (this._checked) {
                this._dot.show();
            } else {
                this._dot.hide();
            }
        }
        super.update();
    }

    // State implementations
    pressReleaseState(): void {
        this.checked = true;  // Only allow checking, not unchecking
    }

    idleupState(): void {
        this.backcolor = "#ffffff";
        this._circle.stroke({ color: '#8a8a8a', width: 2 });
    }

    idledownState(): void {
        this.backcolor = "#f0f0f0";
        this._circle.stroke({ color: '#8a8a8a', width: 2 });
    }

    pressedState(): void {
        this.backcolor = "#4CAF50";
        this._circle.stroke({ color: '#45a049', width: 2 });
    }

    hoverState(): void {
        this.backcolor = "#fafafa";
        this._circle.stroke({ color: '#8a8a8a', width: 2 });
    }

    hoverPressedState(): void {
        this.backcolor = "#4CAF50";
        this._circle.stroke({ color: '#388e3c', width: 2 });
    }

    pressedoutState(): void {
        this.backcolor = "#4CAF50";
        this._circle.stroke({ color: '#45a049', width: 2 });
    }

    moveState(): void {
        this.update();
    }

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.code === 'Space' || keyEvent.code === 'Enter')) {
            this.checked = true;
        }
    }
}

export { RadioButton } 