import Block from './Block';

export default class DateRange extends Block {

    constructor(props) {
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
        instance.component = $(instance._template());

        let range = this.value;
        this.input = this.component.find('input[name="' + this.name + '"]');
        if (range.indexOf(',') > -1) {
            let min = range.substr(0, range.indexOf(','));
            let max = range.substr(range.indexOf(',') + 1);
            this.component.find('#date-' + this.name + '-min')
                .val(min);
            this.component.find('#date-' + this.name + '-max')
                .val(max);
            this.input.val(this.value);
        }

        instance.component.find('.date-picker')
            .datepicker({
                format: 'dd.mm.yyyy',
                weekStart: 1,
                autoclose: true,
                language: 'ua'
                //language: str_lang
            })
            .on('changeDate', function () {
                instance.handleChange(this);
            });

        /*instance.component.on('change', '.date-picker', function () {
            instance.handleChange(this);
        });*/
    }

    handleChange(self) {
        let that = $(self);
        let fieldCurrType = that.attr('id') === 'date-' + this.name + '-min' ? 'min' : 'max';

        let oldFullValue = this.value;
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
            newMinValue = that.val();
        } else {
            newMaxValue = that.val();
        }
        if (newMinValue) {
            newMinText = newMinValue.substr(6, 2) + newMinValue.substr(3, 2) + newMinValue.substr(0, 2);
        }
        if (newMaxValue) {
            newMaxText = newMaxValue.substr(6, 2) + newMaxValue.substr(3, 2) + newMaxValue.substr(0, 2);
        }

        if (newMinValue && newMaxValue && newMinText > newMaxText && this.error_date) {
            setTimeout(function () {
                that.val(fieldCurrType === 'min' ? oldMinValue : oldMaxValue);
            }, 0);
            alert(this.error_date);
        } else {
            this.setValue(newMinValue + (newMinValue || newMaxValue ? ',' : '') + newMaxValue);
            this.emit('change');
        }
    }

    validValue(value) {
        return value.indexOf(',') > -1 || value === '';
    }

    setValue(value) {
        this.value = value || '';
        if (value === null) {
            this.component.find('.date-picker')
                .val(null);
        }
        this.input.prop('disabled', value === null);
        if (this.validValue(this.value)) {
            this.input.val(this.value);
        }
    }

    setEmptyValue() {
        this.input.prop('disabled', false);
        this.input.val('null');
    }

    getValue() {
        return this.value;
    }

    getValueLabel() {
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

    getValueTitle() {
        return null;
    }

    render() {
        return this.component;
    }

    renderInput() {
        return this.input;
    }

    _template() {
        let html = '';
        html += '<div class="form-body"><div class="field-group aui-field-workratio">';
        html += '<input name="' + this.name + '" type="hidden" disabled>';

        html += '<div class="' + this.name + '-min"><label for="date-' + this.name + '-min">' + (this.title.min ? this.title.min : 'Min') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.name + '-min">';
        html += '</div>';

        html += '<div class="' + this.name + '-max"><label for="date-' + this.name + '-max">' + (this.title.max ? this.title.max : 'Max') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.name + '-max">';
        html += '</div>';

        html += '</div></div>';
        return html;
    }
}
