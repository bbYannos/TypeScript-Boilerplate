interface BootstrapColorpickerOptionsSlider {
    maxLeft: number;
    maxTop: number;
    callLeft: string;
    callTop: string;
}

interface BootstrapColorpickerOptions {
    /**
     * If not false, forces the color format to be hex, rgb or rgba, otherwise the format is automatically detected.
     */
    format?: string;
    /**
     * If not false, sets the color to this value.
     */
    color?: string;
    /**
     * If not false, the picker will be contained inside this element, otherwise it will be appended to the document body.
     */
    container?: boolean | string | JQuery;
    /**
     * Children selector for the component or element that trigger the colorpicker and which background color will change (needs an inner <i> element).
     */
    component?: string | JQuery;
    /**
     * Children selector for the input that will store the picker selected value.
     */
    input?: string | JQuery;
    /**
     * If true, the hue and alpha channel bars will be rendered horizontally, above the saturation selector.
     */
    horizontal?: boolean;
    /**
     * If true, forces to show the colorpicker as an inline element.
     */
    inline?: boolean;
    /**
     * Vertical sliders configuration
     */
    sliders?: {
        saturation: BootstrapColorpickerOptionsSlider;
        hue: BootstrapColorpickerOptionsSlider;
        alpha: BootstrapColorpickerOptionsSlider;
    };
    /**
     * Horizontal sliders configuration
     */
    slidersHorz?: {
        saturation: BootstrapColorpickerOptionsSlider;
        hue: BootstrapColorpickerOptionsSlider;
        alpha: BootstrapColorpickerOptionsSlider;
    };
    /**
     * Customizes the default colorpicker HTML template.
     */
    template?: string;
    /**
     * By default, the colorpicker is aligned to the right of the input. If you need to switch it to the left, set align to 'left'.
     */
    align?: string;
    /**
     * Adds this class to the colorpicker widget.
     */
    customClass?: string;
    /**
     * List of pre selected colors (hex format). If you choose one of these colors, the alias is returned instead of the hex code.}
     */
    colorSelectors?: { [colorName: string]: string };

    extensions?: any;
}

interface BootstrapColorpicker {
    /**
     * Access to the colorpicker Color object information
     */
    color: BootstrapColorpickerColor;
}

interface BootstrapColorpickerEvent extends Event {
    color: BootstrapColorpickerColor;
}

interface BootstrapColorpickerColor {

    /**
     * Set a new color.The value is parsed and tries to do a quess on the format.
     */
    setColor(value: any): void;
    /**
     * Set the HUE with a value between 0 and 1.
     */
    setHue(value: number): void;
    /**
     * Set the saturation with a value between 0 and 1.
     */
    setSaturation(value: number): void;
    /**
     * Set the brightness with a value between 0 and 1.
     */
    setBrightness(value: number): void;
    /**
     * Set the transparency with a value between 0 and 1.
     */
    setAlpha(value: number): void;
    /**
     * Returns a hash with red, green, blue and alpha.
     */
    toRGB(h?: number, s?: number, b?: number, a?: number): { r: number; g: number; b: number; a: number; };
    /**
     * Returns a string with HEX format for the current color.
     */
    toHex(h?: number, s?: number, b?: number, a?: number): string;
    /**
     * Returns a hash with HSLA values.
     */
    toHSL(h?: number, s?: number, b?: number, a?: number): { h: number; s: number; l: number; a: number; };

    toAlias(r: number, g: number, b: number, a: number): string;
    RGBtoHSB(r: number, g: number, b: number, a: number): { h: number; s: number; b: number; a: number; };
    HueToRGB(p: number, q: number, h: number): number;
    HSLtoRGB(h: number, s: number, l: number, a: number): number[]; // [r,g,b,a]
    toString(format: 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hex' | 'alias'): string;
    colorNameToHex(name: string): string;
}

interface JQueryStatic {
    colorpicker: BootstrapColorpicker;
}

interface JQuery {

    /**
     * Initializes an colorpicker.
     */
    colorpicker(options: BootstrapColorpickerOptions): JQuery;
    /**
     * Gets the value from the input or the data attribute (if has no input), otherwise returns the default value, which defaults to #000000 if not specified.
     */
    colorpicker(method: 'getValue', defaultValue: string): String;
    /**
     * Set a new value for the color picker (also updates everything).Triggers 'changeColor' event.
     */
    colorpicker(method: 'setValue', value: string): void;
    /**
     * Show the color picker
     */
    colorpicker(method: 'show'): void;
    /**
     * Hide the color picker
     */
    colorpicker(method: 'hide'): void;
    /**
     * Updates the color picker's position relative to the element
     */
    colorpicker(method: 'reposition'): void;
    /**
     * Refreshes the widget colors (this is done automatically)
     */
    colorpicker(method: 'update'): void;
    /**
     * Enable the color picker.
     */
    colorpicker(method: 'enable'): void;
    /**
     * Disable the color picker.
     */
    colorpicker(method: 'disable'): void;
    /**
     * Destroys the colorpicker widget and unbind all .colorpicker events from the element and component
     */
    colorpicker(method: 'destroy'): void;

    /**
     * Access to the colorpicker API directly
     */
    data(key: 'colorpicker'): BootstrapColorpicker;

    /**
     * This event fires immediately when the color picker is created.
     */
    on(events: 'create', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event fires immediately when the color picker is displayed.
     */
    on(events: 'showPicker', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event is fired immediately when the color picker is hidden.
     */
    on(events: 'hidePicker', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event is fired when the color is changed.
     */
    on(events: 'changeColor', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event is fired immediately when the color picker is disabled, except if it was initialized as disabled.
     */
    on(events: 'disable', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event is fired immediately when the color picker is enabled, except upon initialization.
     */
    on(events: 'enable', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
    /**
     * This event fires immediately when the color picker is destroyed.
     */
    on(events: 'destroy', selector?: string, data?: any, handler?: (eventObject: BootstrapColorpickerEvent) => any): JQuery;
}