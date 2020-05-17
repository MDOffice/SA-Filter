import Component, { ComponentProps } from './Component';
import NumRangeBlock, { NumRangeInterface } from '../block/NumRange';
import { SAFilterOptions } from '../options/index';

interface NumRangeProps extends ComponentProps {
    name: string
    value: string
    title_min: string
    title_max: string
    clear_text: string
}

export default class NumRangeComponent extends Component {

    props: NumRangeProps;
    blockNumRange: NumRangeInterface;

    constructor(component: HTMLElement, opts: SAFilterOptions) {
        super(component, opts);

        this.readOptions();
        this.createBlocks();
        this.additionRender();
    }

    readOptions() {
        this.props = Object.assign(this.props, {
            name: this.component.attr('data-name'),
            value: this.component.attr('data-value'),
            min: this.component.attr('data-min'),
            max: this.component.attr('data-max'),
            type: this.component.attr('data-type') || '',
            title_min: this.component.attr('data-title-min'),
            title_max: this.component.attr('data-title-max')
        });
    }

    createBlocks() {
        this.blockNumRange = new NumRangeBlock({
            name: this.props.name,
            value: this.props.value,
            title: {
                min: this.props.title_min,
                max: this.props.title_max
            },
            error_date: 'Значення початку не може бути більше закінчення'
        });
        this.dropdown.addBlock(this.blockNumRange);
    }

    private additionRender() {
        this.component.append(this.blockNumRange.renderInput());
    }
}
