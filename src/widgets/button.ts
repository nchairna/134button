// importing local code, code we have written
import {IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import {Window, Widget, RoleType, EventArgs} from "../core/ui";
// importing code from SVG.js library
import {Rect, Text, Box} from "../core/ui";

class Button extends Widget{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string= "Click Me";
    private defaultFontSize: number = 20;  // Bigger font
    private defaultWidth: number = 120;    // Wider button
    private defaultHeight: number = 40;    // Taller button
    private _clickCallback?: () => void;  // Add this property to store the callback

    constructor(parent:Window){
        super(parent);
        // set defaults
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        // set Aria role
        this.role = RoleType.button;
        // render widget
        this.render();
        // set default or starting state
        this.setState(new IdleUpWidgetState());
        // prevent text selection
        this.selectable = false;
    }

    set fontSize(size:number){
        this._fontSize= size;
        this.update();
    }

    set text(text: string) {
        this._input = text;
        this.update();
    }

    get text(): string {
        return this._input;
    }

    set buttonWidth(width: number) {
        this.width = width;
        if (this._rect) {
            this._rect.width(width);
            this.positionText();
        }
    }

    set buttonHeight(height: number) {
        this.height = height;
        if (this._rect) {
            this._rect.height(height);
            this.positionText();
        }
    }

    private positionText(){
        let box:Box = this._text.bbox();
        // Center text horizontally and vertically
        this._text_x = (+this._rect.x() + (this.width/2) - (box.width/2));
        this._text_y = (+this._rect.y() + (this.height/2) - (box.height/2));
        
        this._text.x(this._text_x);
        if (this._text_y > 0){
            this._text.y(this._text_y);
        }
    }
    
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height)
                               .radius(10)
                               .stroke({ color: '#8a8a8a', width: 2 });  
        this._rect.fill("#ffffff");  
        this._text = this._group.text(this._input)
            .font({
                family: 'Arial, Helvetica, sans-serif',
                size: this._fontSize,
                weight: 'bold'
            });
      
        this.outerSvg = this._group;
       
        let eventrect = this._group.rect(this.width, this.height)
                                  .opacity(0)
                                  .radius(8) 
                                  .attr('id', 0);


      

     
        
        // Position the text
        this.positionText();

        // register objects that should receive event notifications.
        this.registerEvent(eventrect);
    }

    override update(): void {
        if(this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }

        if(this._rect != null) {
            this._rect.fill(this.backcolor);  // Make sure fill is applied
        }
        
        super.update();
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.backcolor = "#4CAF50";  // Stay green
            this._rect.stroke({ color: '#45a049', width: 2 });
            this._text.text("Clicked!");
            this.positionText();
            this._rect.fill(this.backcolor);
            this.raise(new EventArgs(this));
            if (this._clickCallback) {
                this._clickCallback();
            }
        }
    }

    onClick(callback: () => void): void {
        this._clickCallback = callback;
    }

    //TODO: give the states something to do! Use these methods to control the visual appearance of your
    //widget
    idleupState(): void {
        this.backcolor = "#ffffff";  // Pure white background
        this._rect.stroke({ color: '#8a8a8a', width: 2 });
        this._text.text("Click me!");  // Default text
        this.positionText();
        this.update();
    }
    idledownState(): void {
        this.backcolor = "#ffffff";
        this._rect.stroke({ color: '#8a8a8a', width: 2 });
        this._text.text("Click me!");
        this.update();
    }
    pressedState(): void {
        this.backcolor = "#4CAF50";  
        this._rect.stroke({ color: '#45a049', width: 2 });
        this._text.text("Clicked!");  
        this.positionText();
        this._rect.fill(this.backcolor);
        this.update();
    }
    hoverState(): void {
        this.backcolor = "#c1c2c2";  
        this._rect.stroke({ color: '#8a8a8a', width: 2 });
        this._text.text("Click me!");
        this.positionText();
        this.update();
    }
    hoverPressedState(): void {
        this.backcolor = "#c1c2c2"; 
        this._rect.stroke({ color: '#45a049', width: 2 });
        this._text.text("Clicked!");
        this.update();
    }
    pressedoutState(): void {
        this.backcolor = "#ea4100";  // Stay green
        this._rect.stroke({ color: '#45a049', width: 2 });
        this._text.text("Clicked!");
        this.update();
    }
    moveState(): void {
        // Keep current state
        this.update();
    }
    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.code === 'Space' || keyEvent.code === 'Enter')) {
            
            this.backcolor = "#4CAF50";  
            this._rect.stroke({ color: '#45a049', width: 2 });
            this._text.text("Clicked!");
            this.positionText();
            if (this._clickCallback) {
                this._clickCallback();
            }
        } else {
            // For other keys, return to default state
            this.backcolor = "#ffffff";
            this._rect.stroke({ color: '#8a8a8a', width: 2 });
            this._text.text("Click me!");
            this.positionText();
        }
        this.update();
    }

    center(): void {
        const windowWidth = Number((this.parent as Window).window.width());
        const windowHeight = Number((this.parent as Window).window.height());
        
        const centerX = (windowWidth - this.width) / 2;
        const centerY = (windowHeight - this.height) / 2;
        
        this._group.move(centerX, centerY);
    }
}

export {Button}