import {Window} from "./core/ui"
import {Button} from "./widgets/button"
import {Heading} from "./widgets/heading"
import { Checkbox } from "./widgets/checkbox";
import { RadioButton } from "./widgets/radiobutton";
import { ScrollBar } from "./widgets/scrollbar";
import { ProgressBar } from "./widgets/progressbar";
import { ToggleSwitch } from "./widgets/toggleswitch";


let w = new Window(window.innerHeight-10,'100%');

// Button section
let lbl1 = new Heading(w);
lbl1.text = "Button Demo";
lbl1.fontSize = 16;
lbl1.move(10, 20);

let btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.move(12, 50);

// Checkbox section
let checkboxLabel = new Heading(w);
checkboxLabel.text = "Checkbox Demo";
checkboxLabel.fontSize = 16;
checkboxLabel.move(10, 110);

let checkbox = new Checkbox(w);
checkbox.move(12, 140);
checkbox.onChange((checked) => {
    console.log("Checkbox is now:", checked);
});

// Radio button section
let radioLabel = new Heading(w);
radioLabel.text = "Radio Button Demo";
radioLabel.fontSize = 16;
radioLabel.move(10, 190);

// Create radio buttons
let radio1 = new RadioButton(w, 1);
radio1.move(12, 220);
radio1.label = "Option 1";

let radio2 = new RadioButton(w, 2);
radio2.move(12, 250);
radio2.label = "Option 2";

let radio3 = new RadioButton(w, 3);
radio3.move(12, 280);
radio3.label = "Option 3";

// Add change handler
const onRadioChange = (id: number, checked: boolean) => {
    if (checked) {
        console.log(`Radio button ${id} selected`);
    }
};

radio1.onChange(onRadioChange);
radio2.onChange(onRadioChange);
radio3.onChange(onRadioChange);

// Scrollbar section
let scrollLabel = new Heading(w);
scrollLabel.text = "Scrollbar Demo";
scrollLabel.fontSize = 16;
scrollLabel.move(10, 320);

let scrollbar = new ScrollBar(w);
scrollbar.setScrollHeight(200);
scrollbar.move(12, 350);

// Add scroll handler
scrollbar.onScroll((position, direction) => {
    console.log(`Scrolled ${direction} to position ${position}`);
});

// Progress bar section
let progressLabel = new Heading(w);
progressLabel.text = "Progress Bar Demo";
progressLabel.fontSize = 16;
progressLabel.move(10, 580);

let progressBar = new ProgressBar(w);
progressBar.setWidth(200);
progressBar.move(12, 610);

// Add progress handler
progressBar.onProgress((value) => {
    console.log(`Progress: ${value}%`);
});

// Add state change handler
progressBar.onStateChange((state) => {
    console.log(`Progress bar state: ${state}`);
});

let incrementBtn = new Button(w);
incrementBtn.text = "Increment";
incrementBtn.fontSize = 14;
incrementBtn.buttonWidth = 100;
incrementBtn.move(12, 640);
incrementBtn.onClick(() => {
    progressBar.increment();
});

// Toggle switch section
let toggleLabel = new Heading(w);
toggleLabel.text = "Toggle Switch Demo";
toggleLabel.fontSize = 16;
toggleLabel.move(10, 710);

let toggleSwitch = new ToggleSwitch(w);
toggleSwitch.move(12, 730);

// Add toggle handler
toggleSwitch.onToggle((isOn) => {
    console.log(`Toggle switch is: ${isOn ? 'ON' : 'OFF'}`);
});

    