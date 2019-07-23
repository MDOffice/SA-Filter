export default class Button {

    constructor(props) {
        this.props = props;//id, is_subtle, title, label, labelAlways, labelAll

        this.container = this.templateContainer();
        this.refresh();
    }

    setValue(labelValue, title) {
        this.props.title = title;
        this.props.labelValue = labelValue;
        this.refresh();
    }

    refresh() {
        this.container.html(this.templateContent());
    }

    render() {
        return this.container;
    }

    templateContainer() {
        return $('<button type="button" data-toggle="dropdown" aria-controls="' + this.props.id + '" class="btn btn-default btn-xs ' + (this.props.className || '') + (this.props.is_subtle ? ' aui-button-subtle' : '') + '" />');
    }

    templateContent() {
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
