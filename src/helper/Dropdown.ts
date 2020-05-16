//import {EventEmitter} from 'events';
import Trigger, { TriggerInterface } from './Trigger';
import { clone, arraysEqual } from './utils';
import { BlockInterface } from '../block/Block';
import { instanceOf } from 'prop-types';

export interface DropdownProps {
    id: string
    submitText: string
}

export interface DropdownInterface extends TriggerInterface {
    addComponent(block: any): void;

    resetToInitValue(): void;

    getInitValue(): string | null | string[];

    getValue(): string | null | string[];

    getValueLabel(): string | null;

    getValueTitle(): string | null;

    render(): JQuery;
}

type valuesType = string[] | string | null;

interface IBlock {
    [index: string]: any;
}

export default class Dropdown extends Trigger implements DropdownInterface {

    props: DropdownProps;
    blocks: IBlock;
    component: JQuery;
    container: JQuery;
    initValue: valuesType;
    value: valuesType;
    valueLabel: string;
    valueTitle: string;

    constructor(props: DropdownProps) {
        super();

        this.props = {
            id: props.id,
            submitText: props.submitText
        };

        this.blocks = [];
        this.init();
    }

    private init() {
        let instance = this;
        instance.component = $(instance.templateContainer());
        instance.container = instance.component.find('form');

        instance.initValue = '';
        instance.component.on('click', '.submit-footer', function() {
            instance.emit('submit');
        });
    }

    addComponent(block: BlockInterface<valuesType>): void {
        const id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this.setInitValue(block);

        this.blocks.push(id);
        this.blocks[id] = block;
        //this._setComponentValue(id);
        block.on('change', () => {
            this.setComponentValue(id);
        });
        this.container.append(block.render());
    }

    private setInitValue(block: BlockInterface<valuesType>) {
        let value: valuesType = clone(block.getValue());
        if (value) {
            if ((value instanceof Array && value !== [])
                || (typeof value === 'string' && value !== '')) {
                this.initValue = value;
                if (block.validValue(value)) {
                    this.value = value;
                    this.valueLabel = block.getValueLabel();
                    this.valueTitle = block.getValueTitle();

                    this.emit('change');
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
        this.valueLabel = block.getValueLabel();
        this.valueTitle = block.getValueTitle();

        this.showSubmit(!arraysEqual(this.getInitValue(), value));//some error with many blocks
        this.emit('change');
    }

    resetToInitValue(): void {
        for (let i = 0, len = this.blocks.length; i < len; i++) {
            let block_id = this.blocks[i],
                block = this.blocks[block_id];
            if (block.validValue(this.initValue)) {
                block.setValue(this.initValue);
                this.setComponentValue(block_id);
            }
        }
    }

    getInitValue(): valuesType {
        return this.initValue;
    }

    getValue(): valuesType {
        return this.value;
    }

    getValueLabel(): string | null {
        return this.valueLabel;
    }

    getValueTitle(): string | null {
        return this.valueTitle;
    }

    render(): JQuery {
        return this.component;
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
        this.component.find('.submit-footer')
            .toggle(visible);
    }

    private templateContainer(): string {
        let html = '';
        html += '<div id="' + this.props.id + '" class="sa-filter-form  dropdown-menu">';
        html += '<form onsubmit="return false" />';
        html += this.templateSubmit();
        html += '</div>';
        return html;
    }

    private templateSubmit(): string {
        let html = '';
        if (this.props.submitText) {
            html = '<div class="submit-footer" style="display: none">' + this.props.submitText + '</div>';
        }
        return html;
    }
}
