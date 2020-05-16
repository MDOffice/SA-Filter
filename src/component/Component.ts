import Button, { ButtonInterface } from '../helper/Button';
import Dropdown, { DropdownInterface } from '../helper/Dropdown';
import { SAFilterOptions } from '../options/index';

export interface ComponentProps {
    btn_class: string
    title: string
    title_always: boolean
    ALL: string
    clear_text: string
    submit: string
    submit_text: string
}

export default class Component {

    containerId: string;
    component: any;
    props: ComponentProps;
    opts: SAFilterOptions;

    button: ButtonInterface;
    dropdown: DropdownInterface;

    private onSubmitProcess: boolean;

    constructor(component: Element, opts: SAFilterOptions) {
        this.opts = opts;
        this.containerId =
            '_' + Math.round((Math.random() % 10) * Math.pow(10, 10));
        this.component = $(component);

        this.props = {
            btn_class: this.component.attr('data-btn-class'),
            title: this.component.attr('data-title'),
            title_always: this.component.attr('data-title-always') == '1',
            ALL: this.component.attr('data-ALL'),
            clear_text: this.component.attr('data-clear'),
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
            className: this.props.btn_class,
            label: this.props.title,
            labelAlways: this.props.title_always,
            labelAll: this.props.ALL
        });
    }

    createDropdownController() {
        this.dropdown = new Dropdown({
            id: this.containerId + '-dropdown',
            submitText: this.props.submit_text
        });
        this.dropdown.on({
            change: () => {
                this.button.setValue(this.dropdown.getValueLabel(), this.dropdown.getValueTitle());
            },
            submit: () => {
                this.onSubmitProcess = true;
                const submitFunc = new Function('', this.props.submit);
                submitFunc();
                //this.component.trigger('hide.bs.dropdown');
                //this.component.dropdown('toggle');
            }
        });
    }

    addComponent(component: any) {
        this.dropdown.addComponent(component);
    }

    assignEvents() {
        this.component.on('hidden.bs.dropdown', () => {
            console.log('hidden.bs.dropdown');
            if (this.props.submit && !this.onSubmitProcess) {
                if (this.dropdown.getInitValue() !== this.dropdown.getValue()) {
                    this.dropdown.resetToInitValue();
                }
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
}
