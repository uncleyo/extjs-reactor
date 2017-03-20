/**
 * Wraps an HTML element that is a descendant of ExtReactProvider in the component tree for lazy rendering.
 */
export default class HTMLElementWrapper {
    contentEl = null;

    /**
     * @param {string} type The react element type
     * @param {object} props The props for the element
     */
    constructor(type, props) {
        this.type = type;
        this.props = props;
    }

    getType() { return this.type; }
    getProps() { return this.props; }

    /**
     * Sets the DOM element into which this element was rendered
     * @param {HTMLElement} el 
     */
    setContentEl(el) { this.contentEl = el; }

    /**
     * Gets the DOM element into which this element was rendered.
     * @returns {HTMLElement}
     */
    getContentEl() { return this.contentEl; } 
}