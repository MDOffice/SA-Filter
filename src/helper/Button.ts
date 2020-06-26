export interface ButtonInterface {
    setValue(labelValue: string, title: string): void;

    render(): JQuery;
}

export interface ButtonProps {
    id: string
    className: string
    label: string
    labelValue?: string
    labelAlways: boolean
    labelAll: string
    title?: string
}

export default class Button implements ButtonInterface {

    props: ButtonProps;
    container: JQuery;

    constructor(props: ButtonProps) {
        this.props = props;

        this.container = this.templateContainer();
        this.refresh();
    }

    refresh(): void {
        this.container.html(this.templateContent());
    }

    setValue(labelValue: string, title: string): void {
        this.props.labelValue = labelValue;
        this.props.title = title;
        this.refresh();
    }

    render(): JQuery {
        return this.container;
    }

    templateContainer(): JQuery {
        return $('<button type="button" data-toggle="dropdown" aria-controls="' + this.props.id + '" class="btn btn-xs ' + (this.props.className || 'btn-default') + '" />');
    }

    templateContent(): string {
        let html = '';
        let title = '';
        let has_value = this.props.labelValue && this.props.labelValue !== '';

        html += '<div class="criteria-wrap" title="' + (this.props.title || '') + '">';
        if (!has_value || this.props.labelAlways) {
            html += '<span class="fieldLabel">' + this.props.label + ':</span> ';
        }
        html += has_value ? this.props.labelValue : this.props.labelAll;
        html += ' <span class="caret" />';
        html += '</div>';

        return html;
    }
}

class Button2 extends HTMLElement {

    disabled: boolean;
    _title: string;

    constructor() {
        super();
    }

    connectedCallback() {
        const mountPoint = document.createElement('button');
        mountPoint.setAttribute('data-toggle', 'dropdown');
        this.appendChild(mountPoint);
    }

    static get observedAttributes() {
        return ['disabled', 'title'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        switch (attrName) {
            case 'disabled':
                this.disabled = newValue;
                break;
            case 'title':
                this._title = newValue;
                break;
            default:
        }
    }

    set title(newValue: string) {
        this._title = newValue;
    }
}
