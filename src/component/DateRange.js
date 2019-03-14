import Component from './Component';
import DateRangeBlock from '../block/DateRange';
import SingleSelectBlock from '../block/SingleSelect';

//TODO if has submit_text need send "null" to clear for submit

export default class DateRangeComponent extends Component {

    constructor(component) {
        super(component);
        this.setOptions();

        this.createBlocks();
        this.assignEvent();
        this.additionRender();
    }

    setOptions() {
        this.elements = this.component.find('select')
            .find('option');
        this.props = Object.assign(this.props, {
            name: this.component.attr('data-name'),
            value: this.component.attr('data-value'),
            title_min: this.component.attr('data-min'),
            title_max: this.component.attr('data-max')
        });
    }

    createBlocks() {
        this.blockDateRange = new DateRangeBlock({
            'name': this.props.name,
            'value': this.props.value,
            'title': {
                'min': this.props.title_min,
                'max': this.props.title_max
            },
            'error_date': 'Дата початку не може бути більше закінчення'
        });
        this.addComponent(this.blockDateRange);
        this.blockSingleSelect = new SingleSelectBlock({
            'name': this.props.name,
            'value': this.props.value,
            'has_search': false,
            'clearTitle': this.props.clear_text,
            'options': this.elements
        });
        this.addComponent(this.blockSingleSelect);
    }

    assignEvent() {
        let instance = this;
        this.component.on('shown.bs.dropdown', function () {
            instance.blockSingleSelect.refresh();
        });
    }

    additionRender() {
        this.component.append(this.blockDateRange.renderInput());
    }

}
