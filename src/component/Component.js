import Button from '../helper/Button';
import Dropdown from '../helper/Dropdown';

export default class Component {

    constructor(component) {
        this.container_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));
        this.component = $(component);

        this.props = {
            btn_subtle: this.component.hasClass('subtle'),
            btn_class: this.component.attr('data-btn-class'),
            title: this.component.attr('data-title'),
            title_always: this.component.attr('data-title-always'),
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
        let instance = this;
        this.button = new Button({
            id: instance.container_id + '-dropdown',
            is_subtle: instance.props.btn_subtle,
            className: instance.props.btn_class,
            label: instance.props.title,
            labelAlways: instance.props.title_always,
            labelAll: instance.props.ALL
        });
    }

    setButtonValue(label, title) {
        this.button.setValue(label, title);
    }

    createDropdownController() {
        let instance = this;

        this.dropdown = new Dropdown({
            id: this.container_id + '-dropdown',
            submitText: this.props.submit_text
        });
        this.dropdown.on({
                change: () => {
                    instance.setButtonValue(instance.dropdown.getValueLabel(), instance.dropdown.getValueTitle());
                },
                submit: () => {
                    instance.props.onSubmit = true;
                    eval(instance.props.submit);
                    instance.component
                        .dropdown('toggle');
                }
            }
        );
    }

    addComponent(component) {
        this.dropdown.addComponent(component);
    }

    assignEvents() {
        let instance = this;
        this.component
            .on('hidden.bs.dropdown', function () {
                console.log('hidden.bs.dropdown');
                if (instance.props.submit && !instance.props.onSubmit) {
                    if (instance.dropdown.getInitValue() !== instance.dropdown.getValue()) {
                        instance.dropdown.resetToInitValue();
                    }
                }

                if (instance.props.onSubmit) {
                    instance.props.onSubmit = false;
                }
            });
    }

    render() {
        this.component.append(this.button.render());
        this.component.append(this.dropdown.render());
    }

}
