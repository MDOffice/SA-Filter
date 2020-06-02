import Button, { ButtonInterface } from '../helper/Button';
import Dropdown, { DropdownInterface } from '../helper/Dropdown';
import { SAFilterOptions } from '../options/index';

export interface ComponentProps {
    btnClass: string
    title: string
    titleAlways: boolean
    titleAll: string
    clearTitle: string
    submit: string
    submit_text: string
}

export default class Component {

    containerId: string;
    component: JQuery;
    props: ComponentProps;
    opts: SAFilterOptions;

    button: ButtonInterface;
    dropdown: DropdownInterface;

    private onSubmitProcess: boolean;

    constructor(component: HTMLElement, opts: SAFilterOptions) {
        this.opts = opts;
        this.containerId = Component.makeId();
        this.component = $(component);

        this.props = {
            btnClass: this.component.attr('data-btn-class'),
            title: this.component.attr('data-title'),
            titleAlways: this.component.attr('data-title-always') == '1',
            titleAll: this.component.attr('data-ALL'),
            clearTitle: this.component.attr('data-clear'),
            submit: this.component.attr('data-submit'),
            submit_text: this.component.attr('data-submit-text')
        };

        this.createButton();
        this.createDropdownController();
        this.assignEvents();
        this.render();
    }

    createButton() {
        this.button = new Button({
            id: this.containerId + '-dropdown',
            className: this.props.btnClass,
            label: this.props.title,
            labelAlways: this.props.titleAlways,
            labelAll: this.props.titleAll
        });
    }

    createDropdownController() {
        this.dropdown = new Dropdown({
            id: this.containerId + '-dropdown',
            submitText: this.props.submit_text,
            onChange: (valueLabel, valueTitle) => {
                this.button.setValue(valueLabel, valueTitle);
            },
            onSubmit: () => {
                this.onSubmitProcess = true;
                const submitFunc = new Function('', this.props.submit);
                submitFunc();
                //this.component.trigger('hide.bs.dropdown');
                //this.component.dropdown('toggle');
            }
        });
    }

    assignEvents() {
        this.component.on('hidden.bs.dropdown', () => {
            console.log('hidden.bs.dropdown');
            if (this.props.submit && !this.onSubmitProcess) {
                this.dropdown.resetToInitValue();
            }

            if (this.onSubmitProcess) {
                this.onSubmitProcess = false;
            }
        });
    }

    render() {
        this.component.append(this.button.render());
        this.component.append(this.dropdown.render());
    }

    static makeId() {
        return '_' + Math.round((Math.random() % 10) * Math.pow(10, 10));
    }
}
