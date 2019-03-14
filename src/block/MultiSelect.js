import List from './List';

export default class MultiSelect extends List {

    constructor(props) {
        super();

        this.name = props.name;
        this.value = props.value || [];
        this.has_search = props.has_search;
        this.props = {
            searchTitle: props.searchTitle,
            search_id: props.search_id || 'search',
            search_container: props.search_container,
            searchUrl: props.searchUrl,
            searchUrlCache: props.searchUrlCache,
            nomatchText: props.nomatchText,
            exclude: props.exclude,
            hidden: props.hidden,
            hide: props.hide,
            clear: props.clear == null ? true : props.clear
        };
        this.state = {
            hide: props.hide
        };

        this.clearTitle = props.clearTitle;
        this.select = props.select;
        this.initOptions = props.options;
        this._init();
    }

    handleChange(self) {
        let $a = $(self);
        let value = $a.find('input')
                .val(),
            no_found = true,
            selected = !$a.find('input')
                .is(':checked');

        $.each(this.elements, function (index, element) {
            if (element.value === value) {
                no_found = false;
            }
        });
        if (no_found) {
            let title = $a.attr('title') || '',
                label = $a.find('label')
                    .text();
            this.elements.push({
                'value': value,
                'title': title,
                'label': label,
                'active': true
            });
            console.log(this.select);
            this.select.append('<option value="' + value + '" title="' + title + '" selected>' + label + '</option>');
        }

        let old_value = this.getValue();
        if (old_value.length === 1 && old_value.indexOf(value) > -1 && !selected) {
            this.setEmptyValue();
        } else {
            this.setValue(value, selected);
        }
        this.trigger('change');
    }

    validValue(value) {
        /*console.log('MultiSelectBlock.validValue', value);
        console.log('found', this.container.find('.check-list-item').find('input[value="' + value + '"]').length);
        if (value instanceof Array) {

        } else {

        }*/
        //this.container.find('.check-list-item').find('input[value="' + value + '"]').length > 0
        return value instanceof Array || this.container.find('.check-list-item')
                .find('input[value="' + value + '"]').length > 0
            || value === '' || value === [];
    }

    setValue(value, selected) {
        let idx_value = this.value.indexOf(value);
        if (this.resetOption) {
            this.resetOption.remove();
        }

        if (value && idx_value < 0 && selected) {
            this.value.push(value);
        } else if (value && idx_value > -1 && !selected) {
            this.value.splice(idx_value, 1);
        } else if (value === null) {
            this.value = [];
        }

        $.each(this.elements, function (index, element) {
            if (value === null) {
                element.active = false;
            } else {
                if (element.value === value) {
                    element.active = selected;
                }
            }

        });

        let toUpdate;
        if (value !== null) {
            toUpdate = this.container.find('.check-list-item')
                .find('input[value="' + value + '"]');
            if (toUpdate.length) {
                toUpdate.prop('checked', selected);
            }
        } else {//if value is null
            //this.refresh();
            toUpdate = this.container.find('.check-list-item')
                .find('input:checked');
            if (toUpdate.length) {
                toUpdate.prop('checked', false);
            }
        }

        console.log('MultiSelectBlock.setValue', value, selected);
        if (this.validValue(value)) {
            //console.log('MultiSelectBlock.setValue', 'VALID value');
            //this.options.attr('selected', false);
            this.initOptions.filter('[value="' + value + '"]')
                .attr('selected', selected);
            //this.select.val(this.value);
        }
    }

    setEmptyValue() {
        console.log('MultiSelectBlock.setEmptyValue');
        this.setValue(null);
        this.initOptions.filter('[selected]')
            .attr('selected', false);
        if (!this.resetOption) {
            this.resetOption = this.select.after($('<input type="hidden" name="' + this.name + '" value="null">'));
        }
    }

    refresh(customItems) {
        //console.log('MultiSelectBlock.refresh');
        let instance = this,
            $list = $(this._templateList()),
            $list_selected = $(this._templateList(true)),
            $list_clear;

        if (customItems) {
            $.each(customItems, function (index, element) {
                if (element.active) {
                    $list_selected.append(instance._templateListItem(element));
                } else {
                    $list.append(instance._templateListItem(element));
                }
            });
        } else {
            let need_clear = false;
            $.each(this.elements, function (index, element) {
                if (element.active) {
                    need_clear = true;
                    $list_selected.append(instance._templateListItem(element));
                } else {
                    $list.append(instance._templateListItem(element));
                }
            });

            if (need_clear && instance.props.clear) {
                $list_clear = $(this._templateListClear());
            }
        }

        instance.container.empty();
        if ($list_clear) {
            instance.container.append($list_clear);
        }
        if ($list_selected.length > 0) {
            instance.container.append($list_selected);
        }
        instance.container.append($list);

        this.container.find('.more-criteria-footer')
            .remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append('<div class="more-criteria-footer">...' + this.props.exclude + ' <span class="hidden-no">' + this.state.hide + '</span> ' + this.props.hidden + '</div>');
        }
    }

    _templateListItem(props) {
        return '<li class="check-list-item"><label class="item-label" title="' + props.title + '"><input type="checkbox" tabindex="-1" value="' + props.value + '" ' + (props.active ? 'checked' : '') + '>' + props.label + '</label></li>';
    }

}
