//import {EventEmitter} from 'events';
import Trigger from './Trigger';
import {clone, arraysEqual} from './utils';

export default class Dropdown extends Trigger {

    constructor(props) {
        super();

        this.props = {
            id: props.id,
            submitText: props.submitText
        };

        this.blocks = [];
        this._init();
    }

    _init() {
        let instance = this;
        instance.component = $(instance._templateContainer());
        instance.container = instance.component.find('form');

        instance.initValue = '';
        instance.component.on('click', '.submit-footer', function () {
            instance.emit('submit');
        });
    }

    addComponent(block) {
        let instance = this;
        let block_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this._setInitValue(block);

        this.blocks.push(block_id);
        this.blocks[block_id] = block;
        //this._setComponentValue(block_id);
        block.on('change', function () {
            instance._setComponentValue(block_id);
        });
        this.container.append(block.render());
    }

    _setInitValue(block) {
        let value = clone(block.getValue());
        if (value) {
            if ((value instanceof Array && value !== [])
                || (typeof(value) === 'string' && value !== '')) {
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

    _setComponentValue(block_id) {
        let block = this.blocks[block_id],
            value = block.getValue() || '';
        if (value !== '') {
            for (let i = 0, len = this.blocks.length; i < len; i++) {
                let key = this.blocks[i];
                if (key !== block_id) {
                    this.blocks[key].setValue(null);
                }
            }
        } else {//value is null maybe in dateRange, numRange
            //set init and get Label if not null
            block.setEmptyValue();
        }
        console.log('_setComponentValue', value);

        this.value = value;
        this.valueLabel = block.getValueLabel();
        this.valueTitle = block.getValueTitle();

        this._showSubmit(!arraysEqual(this.getInitValue(), value));//some error with many blocks
        this.emit('change');
    }

    resetToInitValue() {
        for (let i = 0, len = this.blocks.length; i < len; i++) {
            let block_id = this.blocks[i],
                block = this.blocks[block_id];
            if (block.validValue(this.initValue)) {
                block.setValue(this.initValue);
                this._setComponentValue(block_id);
            }
        }
    }

    getInitValue() {
        return this.initValue;
    }

    getValue() {
        return this.value;
    }

    getValueLabel() {
        return this.valueLabel;
    }

    getValueTitle() {
        return this.valueTitle;
    }

    render() {
        return this.component;
    }

    _showSubmit(visible) {
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

    _templateContainer() {
        let html = '';
        html += '<div id="' + this.props.id + '" class="sa-filter-form  dropdown-menu">';
        html += '<form onsubmit="return false"></form>';
        html += this._templateSubmit();
        html += '</div>';
        return html;
    }

    _templateSubmit() {
        let html = '';
        if (this.props.submitText) {
            html = '<div class="submit-footer" style="display: none">' + this.props.submitText + '</div>';
        }
        return html;
    }
}
