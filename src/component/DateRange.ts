import Component, { ComponentProps } from './Component';
import DateRangeBlock, { DateInterface } from '../block/DateRange';
import SingleSelectBlock, { SingleSelectInterface } from '../block/SingleSelect';
import { SAFilterOptions } from '../options/index';

//TODO if has submit_text need send "null" to clear for submit

interface DateRangeProps extends ComponentProps {
    name: string
    value: string
    title_min: string
    title_max: string
    clear_text: string
}

export default class DateRangeComponent extends Component {

    originSelect: JQuery;
    originOptions: JQuery;
    props: DateRangeProps;
    blockDateRange: DateInterface;
    blockSingleSelect: SingleSelectInterface;

    constructor(component: Element, opts: SAFilterOptions) {
        super(component, opts);
        this.readOptions();

        this.createBlocks();
        this.additionAssignEvent();
        this.additionRender();
    }

    readOptions() {
        const selectElement = this.component.find('select');

        this.originSelect = selectElement;
        this.originOptions = selectElement.find('option');
        this.props = Object.assign(this.props, {
            name: this.component.attr('data-name'),
            value: this.component.attr('data-value'),
            title_min: this.component.attr('data-min'),
            title_max: this.component.attr('data-max')
        });
    }

    createBlocks() {
        this.blockDateRange = new DateRangeBlock({
            name: this.props.name,
            value: this.props.value,
            title: {
                min: this.props.title_min,
                max: this.props.title_max
            },
            clearTitle: this.props.clear_text,
            error_date: 'Дата початку не може бути більше закінчення',
            initDatepicker: null
        }, this.opts);
        this.addComponent(this.blockDateRange);

        if (this.originOptions.length > 0) {
            this.blockSingleSelect = new SingleSelectBlock({
                name: this.props.name,
                value: this.props.value,
                has_search: false,
                clearTitle: this.props.clear_text,
                originSelect: this.originSelect,
                originOptions: this.originOptions
            });
            this.addComponent(this.blockSingleSelect);
        }
    }

    private additionAssignEvent() {
        if (this.blockSingleSelect) {
            this.component.on('shown.bs.dropdown', () => {
                this.blockSingleSelect.refresh();
            });
        }
    }

    private additionRender() {
        this.component.append(this.blockDateRange.renderInput());
    }

}
