import Block from './Block';

const iconSearch = 'icon-search4';
const iconClear = 'icon-cancel-circle2';

class List extends Block {

    _init() {
        let instance = this;
        instance.component = $(instance._template());
        instance.container = instance.component.find('.sa-filter-list-scroll');
        instance.elements = [];

        $.each(instance.initOptions, function () {
            let that = $(this);
            instance.elements.push({
                value: that.attr('value'),
                title: that.attr('title'),
                label: that.html(),
                active: that.prop('selected')
            });
        });
        instance.refresh();

        $(instance.container)
            .on(
                'click',
                '.select-list-item, .check-list-item',
                function (e) {
                    e.preventDefault();
                    instance.handleChange(this);
                }
            );

        /*$(instance.container).on('click', '.select-list-item input, .check-list-item input', function (e) {
            e.stopPropagation();
            $(this).prop('checked', !this.checked);
            instance.handleChange($(this).closest('.select-list-item, .check-list-item')[0]);
        });*/

        $(instance.component)
            .on('click', '.clear-all', function (e) {
                e.preventDefault();
                e.stopPropagation();
                instance.handleClear();
            });

        $(instance.component)
            .on('click', '.clear-field', function () {
                instance.handleSearchClear(this);
            });

        $(instance.component)
            .on(
                'keyup',
                '#' + instance.props.search_id,
                function () {
                    instance.handleSearchChange(this);
                }
            );
    }

    handleChange(self) {
    }

    handleClear() {
        this.setEmptyValue();
        this.emit('change');
        this.refresh();
    }

    handleSearchClear(self) {
        $(self)
            .prev()
            .val('');
        $(self)
            .addClass(iconSearch)
            .removeClass('clear-field ' + iconClear);
        this.state.hide = this.props.hide || '0';
        this.refresh();
    }

    handleSearchChange(self) {
        let instance = this;
        let that = $(self),
            findText = that.val()
                .toLowerCase();
        if (findText.length < 0) {
            that.next()
                .addClass(iconSearch)
                .removeClass('clear-field ' + iconClear);
            instance.state.hide = this.props.hide || '0';
            instance.refresh();
        } else {
            that.next()
                .removeClass(iconSearch)
                .addClass('clear-field ' + iconClear);
            let items = [],
                is_active;
            if (instance.props.searchUrl) {
                let data = { q: findText };
                if (
                    instance.props.searchUrlCache &&
                    instance.props.searchUrlCache == '1'
                ) {
                    data.cache = Math.random();
                }
                $.ajax({
                    url: instance.props.searchUrl,
                    dataType: 'json',
                    data: data,
                    async: false,
                    success: function (d) {
                        $.each(d.items, function (index, element) {
                            is_active =
                                instance.elements.filter(function (t) {
                                    return t.value === element.id && t.active;
                                }).length === 1;
                            items.push({
                                value: element.value,
                                label: element.label,
                                active: is_active
                            });
                        });
                        instance.state.hide = d.hide || '0';
                    }
                });
            } else {
                $.each(instance.elements, function (index, element) {
                    if (
                        element.label.toLowerCase()
                            .indexOf(findText) > -1 ||
                        element.value.toLowerCase()
                            .indexOf(findText) > -1
                    ) {
                        items.push(element);
                    }
                });
                instance.state.hide = 0;
            }

            instance.container.empty();
            if (items.length === 0) {
                instance.container.find('.more-criteria-footer')
                    .remove();
                instance.container.html(
                    '<li class="no-suggestions">' +
                    instance.props.nomatchText +
                    '</li>'
                );
            } else {
                instance.refresh(items);
            }
        }
    }

    getValue() {
        return this.value;
    }

    getValueLabel() {
        return $(this.elements)
            .map(function () {
                if (this.active) {
                    return this.label ? this.label : this.value;
                }
            })
            .get()
            .join(', ');
    }

    getValueTitle() {
        return $(this.elements)
            .map(function () {
                if (this.active) {
                    return this.title ? this.title : this.label;
                }
            })
            .get()
            .join('\n');
    }

    refresh(customItems) {
    }

    render() {
        return this.component;
    }

    _template() {
        let html = '';
        html += this.has_search ? this._templateSearch() : '';
        html +=
            '<div class="sa-filter-list" tabindex="-1"><div id="' +
            this.props.search_container +
            '" class="sa-filter-list-scroll" tabindex="-1"></div></div>';
        return html;
    }

    _templateList(is_selected) {
        return (
            '<ul class="aui-list-section' +
            (is_selected ? ' selected-group' : '') +
            '"></ul>'
        );
    }

    _templateListClear() {
        if (this.clearTitle) {
            return (
                '<li class="sa-filter-group-actions"><a href="#" class="clear-all">' +
                this.clearTitle +
                '</a></li>'
            );
        }
    }

    _templateSearch() {
        return (
            '<div class="sa-filter-search">' +
            '<input autocomplete="off" aria-autocomplete="list" placeholder="' +
            this.props.searchTitle +
            '" class="form-control" id="' +
            this.props.search_id +
            '" aria-controls="' +
            this.props.search_container +
            '">' +
            '<span class="icon-default ' +
            iconSearch +
            ' noloading"></span>' +
            '</div>'
        );
    }
}

export default List;
