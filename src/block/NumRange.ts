import Block, { BlockInterface } from './Block';

interface NumRangeTitleProps {
    min: string
    max: string
}

export interface NumRangeInterface extends BlockInterface<string> {
    renderInput(): JQuery;
}

export interface NumRangeProps {
    name: string
    value?: string
    title: NumRangeTitleProps
    error_date: string,
    clearTitle?: string
}

export default class NumRange extends Block<string> implements NumRangeInterface {

    props: NumRangeProps;
    name: string;
    value: string;
    title: NumRangeTitleProps;
    error_date: string;
    input: JQuery;

    constructor(props: NumRangeProps) {
        super();

        this.name = props.name;
        this.value = props.value || '';
        this.title = {
            min: props.title.min,
            max: props.title.max
        };
        this.error_date = props.error_date;
        this._init();
    }

    _init() {
        let instance = this;
        instance.component = $(instance.template());

        let range = this.value;
        this.input = this.component.find('input[name="' + this.name + '"]');
        if (range.indexOf(',') > -1) {
            var min = range.substr(0, range.indexOf(',')),
                max = range.substr(range.indexOf(',') + 1);
            this.component.find('#num-' + this.name + '-min')
                .val(min);
            this.component.find('#num-' + this.name + '-max')
                .val(max);
            this.input.val(this.value);
        }

        $(instance.component)
            .on('keyup', 'input.text', function() {
                instance.handleChange(this);
            });
    }

    handleChange(self: HTMLElement) {
        let that = $(self),
            fieldCurrType = that.attr('id') === 'num-' + this.name + '-min' ? 'min' : 'max';

        let oldFullValue = this.value,
            oldMinValue = '',
            newMinValue = '',
            oldMaxValue = '',
            newMaxValue = '';
        console.log('oldFullValue', oldFullValue);
        if (this.validValue(oldFullValue)) {
            newMinValue = oldMinValue = oldFullValue.substr(0, oldFullValue.indexOf(','));
            newMaxValue = oldMaxValue = oldFullValue.substr(oldFullValue.indexOf(',') + 1);
        }

        if (fieldCurrType === 'min') {
            newMinValue = String(that.val());
        } else {
            newMaxValue = String(that.val());
        }

        /*if (newMinValue && newMaxValue && newMinValue > newMaxValue && this.error_date) {
            setTimeout(function () {
                that.val(fieldCurrType === 'min' ? oldMinValue : oldMaxValue);
            }, 0);
            alert(this.error_date);
        } else {*/
        this.setValue(newMinValue + (newMinValue || newMaxValue ? ',' : '') + newMaxValue);
        this.emit('change');
        //}
    }

    validValue(value: string | null): boolean {
        return value.indexOf(',') > -1 || value === '';
    }

    setValue(value: string | null): void {
        this.value = value || '';
        if (value === null) {
            this.component.find('input.text')
                .val(null);
        }
        this.input.prop('disabled', value === null);
        if (this.validValue(this.value)) {
            this.input.val(this.value);
        }
    }

    setEmptyValue(): void {
        this.input.prop('disabled', false);
        this.input.val('null');
    }

    getValue(): string | null {
        return this.value;
    }

    getValueLabel(): string | null {
        let value = this.value;
        if (this.validValue(value)) {
            let min = value.substr(0, value.indexOf(','));
            let max = value.substr(value.indexOf(',') + 1);
            if (min == '' && max == '') {
                value = null;
            } else if (min == '') {
                value = '< ' + max;
            } else if (max == '') {
                value = '> ' + min;
            } else {
                value = min + ' - ' + max;
            }
        }
        return value;
    }

    getValueTitle(): string | null {
        return null;
    }

    render(): JQuery {
        return this.component;
    }

    renderInput(): JQuery {
        return this.input;
    }

    private template(): string {
        let html = '';
        html += '<div class="form-body"><div class="field-group aui-field-workratio">';
        html += '<input name="' + this.name + '" type="hidden" disabled>';

        html += '<div class="' + this.name + '-min"><label for="num-' + this.name + '-min">' + (this.title.min ? this.title.min : 'Min') + '</label>';
        html += '<input type="number" class="text" id="num-' + this.name + '-min">';
        html += '</div>';

        html += '<div class="' + this.name + '-max"><label for="num-' + this.name + '-max">' + (this.title.max ? this.title.max : 'Max') + '</label>';
        html += '<input type="number" class="text" id="num-' + this.name + '-max">';
        html += '</div>';

        html += '</div></div>';
        return html;
    }
}
