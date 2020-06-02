import Block, { BlockInterface } from './Block';

const iconSearch = 'icon-search4';
const iconClear = 'icon-cancel-circle2';


export interface ListItemInterface {
    value: string
    label: string
    title?: string
    active: boolean
    disabled: boolean
}

export interface ListInterface<T> extends BlockInterface<T> {
    refresh(items?: ListItemInterface[]): void;
}

interface ListSearchProps {
    visible: boolean
    id: string
    placeholder: string
    noMatchText: string
    url: string
    urlCache: boolean
}

export interface ListProps<T> {
    name?: string
    value: T
    originSelect: JQuery
    originOptions: JQuery
    containerId: string
    search?: ListSearchProps
    clearTitle?: string | null
    clearAlways?: boolean
    hide?: string | number
    exclude?: string
    hidden?: string
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
        this.component = $(instance.template());
        this.container = instance.component.find('.sa-filter-list-scroll');
        this.elements = [];

        $.each(this.props.originOptions, function() {
            let that = $(this);
            instance.elements.push({
                value: that.attr('value'),
                title: that.attr('title'),
                label: that.html(),
                active: that.prop('selected'),
                disabled: that.prop('disabled')
            });
        });
        this.refresh();

        $(instance.container)
            .on(
                'click',
                '.select-list-item:not(.disabled), .check-list-item:not(.disabled)',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    instance.handleChange(this);

                    if (instance.props.clearAlways) {
                        instance.refresh();
                    }
                }
            );

        $(instance.container)
            .on(
                'change',
                '.check-list-item:not(.disabled) input',
                function(e) {
                    const isChecked = $(this).is(':checked');
                    $(this).prop('checked', !isChecked);
                    instance.handleChange($(this).closest('.check-list-item').get(0));

                    if (instance.props.clearAlways) {
                        instance.refresh();
                    }
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

        if (this.props.search) {
            $(instance.component)
                .on(
                    'keyup',
                    '#' + instance.props.search.id,
                    function() {
                        instance.handleSearchChange(this);
                    }
                );
        }
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
            if (instance.props.search.url) {
                let data: { q: string, cache?: number } = { q: findText };
                if (instance.props.search.urlCache) {
                    data.cache = Math.random();
                }
                $.ajax({
                    url: instance.props.search.url,
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
                                active: is_active,
                                disabled: false
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
                    instance.props.search.noMatchText +
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

    private template() {
        let html = '';
        if (this.props.search && this.props.search.visible) {
            html += this.templateSearch();
        }

        html +=
            '<div class="sa-filter-list" tabindex="-1"><div id="' +
            this.props.containerId +
            '" class="sa-filter-list-scroll" tabindex="-1"></div></div>';
        return html;
    }

    private templateSearch(): string {
        return (
            '<div class="sa-filter-search">' +
            '<input autocomplete="off" aria-autocomplete="list" placeholder="' +
            this.props.search.placeholder +
            '" class="form-control" id="' +
            this.props.search.id +
            '" aria-controls="' +
            this.props.containerId +
            '">' +
            '<span class="icon-default ' +
            iconSearch +
            ' noloading"></span>' +
            '</div>'
        );
    }

    protected templateList(is_selected: boolean = false): string {
        return `<ul class="${(is_selected ? ' selected-group' : '')}" />`;
    }

    protected templateClearButton(): string {
        if (this.props.clearTitle) {
            return (
                '<li class="sa-filter-group-actions"><a href="#" class="clear-all">' +
                this.props.clearTitle +
                '</a></li>'
            );
        }
    }
}

export default List;
