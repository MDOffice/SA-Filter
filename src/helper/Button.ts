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

export default class Button implements ButtonInterface{

    props: ButtonProps;
    container: JQuery;

    constructor(props: ButtonProps) {
        this.props = props;//id, title, label, labelAlways, labelAll

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
        html += ' <span class="caret"></span>';
        html += '</div>';

        return html;
    }
}
