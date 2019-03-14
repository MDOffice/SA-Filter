import List from './List';

export default class SingleSelect extends List {

    constructor(props) {
        super();

        this.name = props.name;
        this.value = props.value || '';
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
        this.initOptions = props.options;
        this._init();
    }

    handleChange(self) {
        let $a = $(self);
        let value = $a.attr('data-value');
        let no_found = true;
        //var selected = $a.hasClass('aui-dropdown2-checked');

        $.each(this.elements, function (index, element) {
            if (element.value === value) {
                no_found = false;
            }
        });
        if (no_found) {
            this.elements.push({
                'value': value,
                'title': $a.attr('title'),
                'label': $a.find('label')
                    .html(),
                'active': true
            });
            this.initOptions.parent()
                .append('<option value="' + value + '" title="' + $a.attr('title') + '">' + $a.find('label')
                    .html() + '</option>');
        }

        this.setValue(value);
        this.trigger('change');
    }

    validValue(value) {
        return this.container.find('.select-list-item')
                .filter('[data-value="' + value + '"]').length > 0
            || value === '';
    }

    setValue(value) {
        let instance = this;
        if (this.resetOption) {
            this.resetOption.remove();
        }
        this.value = value || '';
        this.container.find('.select-list-item')
            .filter('.active')
            .removeClass('active');

        $.each(this.elements, function (index, element) {
            element.active = element.value === instance.value;
        });

        if (value !== null) {
            let toUpdate = this.container.find('.select-list-item')
                .filter('[data-value="' + value + '"]');
            if (toUpdate.length) {
                toUpdate.addClass('active');
            }
        } else {//if value is null
            this.refresh();
        }

        if (this.validValue(this.value)) {
            //this.options.attr('selected', false);
            //this.options.filter('[value="' + this.value + '"]').attr('selected', true);
            this.initOptions.parent()
                .val(this.value);
        }
    }

    setEmptyValue() {
        this.setValue(null);
        if (!this.resetOption) {
            this.resetOption = this.initOptions.parent()
                .after($('<input type="hidden" name="' + this.name + '" value="null">'));
        }
    }

    refresh(customItems) {
        let instance = this,
            $list = $(this._templateList());

        if (customItems) {
            $.each(customItems, function (index, element) {
                $list.append(instance._templateListItem(element));
            });
        } else {
            let need_clear = false;
            $.each(this.elements, function (index, element) {
                if (element.active) {
                    need_clear = true;
                }
                $list.append(instance._templateListItem(element));
            });

            if (need_clear && instance.props.clear) {
                $list.prepend(this._templateListClear());
            }
        }

        instance.container.empty();
        instance.container.append($list);

        this.container.find('.more-criteria-footer')
            .remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append('<div class="more-criteria-footer">...' + this.props.exclude + ' <span class="hidden-no">' + this.state.hide + '</span> ' + this.props.hidden + '</div>');
        }
    }

    _templateListItem(props) {
        return '<li class="select-list-item' + (props.active ? ' active' : '') + '" title="' + (props.title ? props.title : '') + '" data-value="' + props.value + '"><label class="item-label">' + props.label + '</label></li>';
    }

}
