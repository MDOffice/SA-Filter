import { clone, arraysEqual } from './utils';
import { BlockInterface, valuesType } from '../block/Block';

export interface DropdownProps {
    id: string
    submitText: string
    onChange: (valueLabel: string, valueTitle: string) => void
    onSubmit: () => void
}

export interface DropdownInterface {
    addBlock(block: BlockInterface<valuesType>): void
    resetToInitValue(): void
    render(): JQuery
}

interface IBlock {
    [index: string]: any;
}

export default class Dropdown implements DropdownInterface {

    props: DropdownProps;
    blocks: IBlock;
    container: JQuery;
    form: JQuery;
    initValue: valuesType;
    value: valuesType;

    constructor(props: DropdownProps) {
        this.props = props;
        this.init();
    }

    private init() {
        this.blocks = [];
        this.initValue = '';

        this.container = $(this.templateContainer());
        this.form = this.container.find('form');

        this.container.on('click', '.submit-footer', () => {
            this.props.onSubmit();
        });
    }

    addBlock(block: BlockInterface<valuesType>): void {
        const id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this.setInitValue(block);

        this.blocks.push(id);
        this.blocks[id] = block;
        //this._setComponentValue(id);
        block.on('change', () => {
            this.setComponentValue(id);
        });
        this.form.append(block.render());
    }

    private setInitValue(block: BlockInterface<valuesType>) {
        let value: valuesType = clone(block.getValue());
        if (value) {
            if ((value instanceof Array && value !== [])
                || (typeof value === 'string' && value !== '')) {
                this.initValue = value;
                if (block.validValue(value)) {
                    this.value = value;

                    this.props.onChange(block.getValueLabel(), block.getValueTitle());
                }
            }
        }
    }

    private setComponentValue(blockId: string) {
        const block = this.blocks[blockId];
        const value = block.getValue() || '';
        console.log('Dropdown.setComponentValue', value);
        if (value !== '') {
            for (let i = 0, len = this.blocks.length; i < len; i++) {
                let key = this.blocks[i];
                if (key !== blockId) {
                    this.blocks[key].setValue(null);
                }
            }
        } else {//value is null maybe in dateRange, numRange
            //set init and get Label if not null
            block.setEmptyValue();
        }

        this.value = value;

        this.showSubmit(!arraysEqual(this.initValue, value));//    TODO: some error with many blocks
        this.props.onChange(block.getValueLabel(), block.getValueTitle());
    }

    resetToInitValue(): void {
        if (this.initValue !== this.value) {
            for (let i = 0, len = this.blocks.length; i < len; i++) {
                let block_id = this.blocks[i],
                    block = this.blocks[block_id];
                if (block.validValue(this.initValue)) {
                    block.setValue(this.initValue);
                    this.setComponentValue(block_id);
                }
            }
        }
    }

    render(): JQuery {
        return this.container;
    }

    private showSubmit(visible: boolean) {
        /*var show = false;
        for (var i in this.submits) {
            if (this.submits[i].hasOwnProperty(i))
                if (this.submits[i] === true) {
                    show = true;
                    break;
                }
        }*/
        this.container.find('.submit-footer')
            .toggle(visible);
    }

    private templateContainer(): string {
        let html = '';
        html += '<div id="' + this.props.id + '" class="sa-filter-form  dropdown-menu">';
        html += '<form onsubmit="return false"></form>';
        if (this.props.submitText) {
            html += '<div class="submit-footer" style="display:none">' + this.props.submitText + '</div>';
        }
        html += '</div>';
        return html;
    }
}
