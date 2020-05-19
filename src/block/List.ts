import Block, { BlockInterface } from './Block';

const iconSearch = 'icon-search4';
const iconClear = 'icon-cancel-circle2';


export interface ListItemInterface {
    value: string
    label: string
    title?: string
    active: boolean
}

export interface ListInterface<T> extends BlockInterface<T> {
    refresh(items?: ListItemInterface[]): void;
}

export interface ListProps<T> {
    name?: string
    value: T
    has_search?: boolean
    search_id?: string
    hide?: string | number
    searchUrl?: string
    searchUrlCache?: string
    nomatchText?: string
    search_container?: string
    searchTitle?: string
    clearTitle?: string | null
    originSelect: JQuery
    originOptions: JQuery
}

export interface ListState {
    hide: string | number
}

class List<T> extends Block<T> implements ListInterface<T> {

    props: ListProps<T>;
    state: ListState;
    container: JQuery;
    elements: ListItemInterface[];

    _init() {
        let instance = this;
        this.component = $(instance._template());
        this.container = instance.component.find('.sa-filter-list-scroll');
        this.elements = [];

        $.each(this.props.originOptions, function() {
            let that = $(this);
            instance.elements.push({
                value: that.attr('value'),
                title: that.attr('title'),
                label: that.html(),
                active: that.prop('selected')
            });
        });
        this.refresh();

        $(instance.container)
            .on(
                'click',
                '.select-list-item, .check-list-item',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    instance.handleChange(this);
                }
            );

        $(instance.container)
            .on(
                'change',
                '.check-list-item input',
                function(e) {
                    const isChecked = $(this).is(':checked');
                    $(this).prop('checked', !isChecked);
                    instance.handleChange($(this).closest('.check-list-item').get(0));
                }
            );
        $(instance.container)
            .on(
                'click',
                '.check-list-item input',
                function(e) {
                    e.stopPropagation();
                }
            );

        /*$(instance.container).on('click', '.select-list-item input, .check-list-item input', function (e) {
            e.stopPropagation();
            $(this).prop('checked', !this.checked);
            instance.handleChange($(this).closest('.select-list-item, .check-list-item')[0]);
        });*/

        $(instance.component)
            .on('click', '.clear-all', function(e) {
                e.preventDefault();
                e.stopPropagation();
                instance.handleClear();
            });

        $(instance.component)
            .on('click', '.clear-field', function() {
                instance.handleSearchClear(this);
            });

        $(instance.component)
            .on(
                'keyup',
                '#' + instance.props.search_id,
                function() {
                    instance.handleSearchChange(this);
                }
            );
    }

    handleChange(self: HTMLElement) {
    }

    handleClear() {
        this.setEmptyValue();
        this.emit('change');
        this.refresh();
    }

    handleSearchClear(self: HTMLElement) {
        $(self)
            .prev()
            .val('');
        $(self)
            .addClass(iconSearch)
            .removeClass('clear-field ' + iconClear);
        this.state.hide = this.props.hide || '0';
        this.refresh();
    }

    handleSearchChange(self: HTMLElement) {
        let instance = this;
        let that = $(self),
            findText = String(that.val()).toLowerCase();
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
            let items: ListItemInterface[] = [],
                is_active;
            if (instance.props.searchUrl) {
                let data: { q: string, cache?: number } = { q: findText };
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
                    success: function(d) {
                        $.each(d.items, function(index, element) {
                            is_active =
                                instance.elements.filter(function(t) {
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
                $.each(instance.elements, function(index, element) {
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

    getValue(): T {
        return this.props.value;
    }

    getValueLabel() {
        return this.elements
            .filter(currentValue => currentValue.active)
            .map((currentValue) => {
                return currentValue.label ? currentValue.label : currentValue.value;
            })
            .join(', ');
    }

    getValueTitle() {
        return this.elements
            .filter(currentValue => currentValue.active)
            .map((currentValue) => {
                return currentValue.title ? currentValue.title : currentValue.label;
            })
            .join('\n');
    }

    refresh(items?: ListItemInterface[]): void {
    }

    render() {
        return this.component;
    }

    _template() {
        let html = '';
        html += this.props.has_search ? this._templateSearch() : '';
        html +=
            '<div class="sa-filter-list" tabindex="-1"><div id="' +
            this.props.search_container +
            '" class="sa-filter-list-scroll" tabindex="-1"></div></div>';
        return html;
    }

    _templateList(is_selected: boolean = false): string {
        return (
            '<ul class="aui-list-section' +
            (is_selected ? ' selected-group' : '') +
            '"></ul>'
        );
    }

    _templateClearButton(): string {
        if (this.props.clearTitle) {
            return (
                '<li class="sa-filter-group-actions"><a href="#" class="clear-all">' +
                this.props.clearTitle +
                '</a></li>'
            );
        }
    }

    _templateSearch(): string {
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
