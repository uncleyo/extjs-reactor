export default class HTMLElementWrapper {
    contentEl = null;

    constructor(type, props) {
        this.type = type;
        this.props = props;
    }

    getType() { return this.type; }
    getProps() { return this.props; }
    setContentEl(el) { this.contentEl = el; }
    getContentEl() { return this.contentEl; } 
}