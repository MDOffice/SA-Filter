import Block, { BlockInterface } from './Block';
import { SAFilterOptions } from '../options/index';

export interface DateInterface extends BlockInterface<string> {
    renderInput(): JQuery;
}

export interface DateRangeProps {
    name: string
    value?: string
    title: {
        min: string
        max: string
    }
    error_date: string,
    clearTitle: string
    initDatepicker: (datePickerElement: JQuery, onChangeCallback: () => void) => void
}

export default class DateRange extends Block<string> implements DateInterface {

    props: DateRangeProps;
    input: JQuery;
    datepicker: JQuery;

    constructor(props: DateRangeProps, opts: SAFilterOptions) {
        super();

        this.props = props;
        this.component = $(this._template());
        this._init(opts);
    }

    _init(opts: SAFilterOptions) {
        let instance = this;

        let range = this.props.value || '';
        this.input = this.component.find('input[name="' + this.props.name + '"]');
        if (range.indexOf(',') > -1) {
            let min = range.substr(0, range.indexOf(','));
            let max = range.substr(range.indexOf(',') + 1);
            this.component.find('#date-' + this.props.name + '-min')
                .val(min);
            this.component.find('#date-' + this.props.name + '-max')
                .val(max);
            this.input.val(this.props.value || '');

            this.component.prepend(this._templateClear());
        }

        this.datepicker = this.component.find('.date-picker');

        if (opts.initDatepicker) {
            opts.initDatepicker(this.datepicker, (that) => {
                this.handleChange(that);
            });
        }
        /*this.datepicker.datepicker({
            format: 'dd.mm.yyyy',
            weekStart: 1,
            autoclose: true,
            language: 'ua'
        }).on('changeDate', function() {
            instance.handleChange();
        });*/

        this.component
            .on('click', '.clear-all', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleClear();
            });

        this.component.on('change', '.date-picker', function() {
            instance.handleChange(this);
        });
    }

    handleChange(that: HTMLElement) {
        console.log('handleChange');
        let input = $(that);
        let fieldCurrType = input.attr('id') === 'date-' + this.props.name + '-min' ? 'min' : 'max';

        let oldFullValue = this.props.value || '';
        let oldMinValue = '';
        let newMinValue = '';
        let oldMaxValue = '';
        let newMaxValue = '';
        let newMinText = '';
        let newMaxText = '';
        console.log('oldFullValue', oldFullValue);
        if (this.validValue(oldFullValue)) {
            newMinValue = oldMinValue = oldFullValue.substr(0, oldFullValue.indexOf(','));
            newMaxValue = oldMaxValue = oldFullValue.substr(oldFullValue.indexOf(',') + 1);
        }

        if (fieldCurrType === 'min') {
            newMinValue = String(input.val());
        } else {
            newMaxValue = String(input.val());
        }
        if (newMinValue) {
            newMinText = newMinValue.substr(6, 2) + newMinValue.substr(3, 2) + newMinValue.substr(0, 2);
        }
        if (newMaxValue) {
            newMaxText = newMaxValue.substr(6, 2) + newMaxValue.substr(3, 2) + newMaxValue.substr(0, 2);
        }

        if (newMinValue && newMaxValue && newMinText > newMaxText && this.props.error_date) {
            setTimeout(function() {
                input.val(fieldCurrType === 'min' ? oldMinValue : oldMaxValue);
            }, 0);
            alert(this.props.error_date);
        } else {
            this.setValue(newMinValue + (newMinValue || newMaxValue ? ',' : '') + newMaxValue);
            this.emit('change');
        }
    }

    handleClear(): void {
        this.setValue(null);
        this.setEmptyValue();
        this.emit('change');
    }

    validValue(value: string | null): boolean {
        return value.indexOf(',') > -1 || value === '';
    }

    setValue(value: string | null): void {
        console.log('setValue');
        this.props.value = value || '';
        if (value === null) {
            this.component.find('.date-picker')
                .val(null);
        }
        this.input.prop('disabled', value === null);
        if (this.validValue(this.props.value)) {
            this.input.val(this.props.value);
        }
    }

    setEmptyValue(): void {
        this.input.prop('disabled', false);
        this.input.val('null');
    }

    getValue(): string | null {
        return this.props.value;
    }

    getValueLabel(): string | null {
        let value = this.props.value;
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

    _templateClear(): string {
        if (this.props.clearTitle) {
            return (
                `<li class="sa-filter-group-actions"><a href="#" class="clear-all">${this.props.clearTitle}</a></li>`
            );
        }
    }

    _template(): string {
        let html = '';
        html += '<div class="form-body"><div class="field-group aui-field-workratio">';
        html += '<input name="' + this.props.name + '" type="hidden" disabled>';

        html += '<div class="' + this.props.name + '-min"><label for="date-' + this.props.name + '-min">' + (this.props.title.min ? this.props.title.min : 'Min') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.props.name + '-min">';
        html += '</div>';

        html += '<div class="' + this.props.name + '-max"><label for="date-' + this.props.name + '-max">' + (this.props.title.max ? this.props.title.max : 'Max') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.props.name + '-max">';
        html += '</div>';

        html += '</div></div>';
        return html;
    }
}
