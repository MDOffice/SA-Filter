import * as React from "react";

export interface ButtonProps {
    id: string
    is_subtle: boolean
    className: string
    label: string
    labelValue: string
    labelAlways: boolean
    labelAll: string
}

export class Button extends React.Component<ButtonProps> {

    render() {
        const has_value = this.props.labelValue && this.props.labelValue !== '';
        const showLabel = (!has_value || this.props.labelAlways) && this.props.label !== '';
        let className = "btn btn-default btn-xs " + this.props.className + (this.props.is_subtle ? ' aui-button-subtle' : '');

        return <button type="button"
                       data-toggle="dropdown"
                       aria-controls={this.props.id}
                       className={className}>
            <div className="criteria-wrap" title={this.props.title}>
                {showLabel ? (<span className="fieldLabel">{this.props.label}:</span> ) : ('')}
                {has_value ? (this.props.labelValue) : (this.props.labelAll)}
                <span className="caret"/>
            </div>
        </button>
    }
}
