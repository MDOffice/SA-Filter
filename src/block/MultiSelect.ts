import List, { ListInterface, ListItemInterface, ListProps } from './List';

export interface MultiSelectInterface extends ListInterface<string[]> {
}

export interface MultiSelectProps extends ListProps<string[]> {
    ignoreSelectedList?: boolean
}

export default class MultiSelect extends List<string[]> implements MultiSelectInterface {

    props: MultiSelectProps;
    resetOption: JQuery;

    constructor(props: MultiSelectProps) {
        super();

        this.props = props;
        this.props.value = props.value || [];
        this.state = {
            hide: props.hide
        };
        this._init();
    }

    handleChange(self: HTMLElement) {
        const $a = $(self);
        const input = $a.find('input');
        const value = input.val() as string;
        const selected = !input.is(':checked');

        let notInList = true;
        $.each(this.elements, function(index, element) {
            if (element.value === value) {
                notInList = false;
            }
        });
        if (notInList) {
            let title = $a.attr('title') || '';
            let label = $a.find('label')
                .text();
            this.elements.push({
                value: value,
                title: title,
                label: label,
                active: true,
                disabled: false
            });
            this.props.originSelect.append(`<option value="${value}" title="${title}" selected>${label}</option>`);
        }

        const oldValue = this.getValue();
        if (oldValue.length === 1 && oldValue.indexOf(value) > -1 && !selected) {
            this.setEmptyValue();
        } else {
            this.setValue(value, selected);
        }
        this.emit('change');
    }

    validValue(value: string[] | string | null): boolean {
        return value instanceof Array || this.container.find('.check-list-item')
                .find('input[value="' + value + '"]').length > 0
            || value === '';
    }

    setValue(value: string | null, selected?: boolean): void {
        const idx_value = this.props.value.indexOf(value);
        if (this.resetOption) {
            this.resetOption.remove();
            this.resetOption = null;
        }

        if (value && idx_value < 0 && selected) {
            this.props.value.push(value);
        } else if (value && idx_value > -1 && !selected) {
            this.props.value.splice(idx_value, 1);
        } else if (value === null) {
            this.props.value = [];
        }

        $.each(this.elements, (index, element) => {
            if (value === null) {
                element.active = false;
            } else if (element.value === value) {
                element.active = selected;
            }
        });

        let toUpdate: JQuery;
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

        if (this.validValue(value)) {
            this.props.originOptions.filter('[value="' + value + '"]')
                .prop('selected', selected);
        }
        this.props.originSelect.get(0).dispatchEvent(new Event('change'));
    }

    setEmptyValue(): void {
        this.props.originSelect.val('');
        /*this.props.originOptions.filter('[selected]')
            .prop('selected', false);*/
        this.setValue(null);
        if (!this.resetOption) {
            this.resetOption = $('<input type="hidden" name="' + this.props.name + '" value="null">');
            this.props.originSelect.after(this.resetOption);
        }
    }

    refresh(customItems?: ListItemInterface[]): void {
        //console.log('MultiSelectBlock.refresh');
        const block_items = $(this.templateList());
        const block_selected = $(this.templateList(true));
        let block_clearButton;

        if (customItems) {
            $.each(customItems, (index, element) => {
                if (element.active && !this.props.ignoreSelectedList) {
                    block_selected.append(this.templateListItem(element));
                } else {
                    block_items.append(this.templateListItem(element));
                }
            });
        } else {
            let buttonClearNeed = false;
            $.each(this.elements, (index, element) => {
                if (element.active) {
                    buttonClearNeed = true;
                }
                if (element.active && !this.props.ignoreSelectedList) {
                    block_selected.append(this.templateListItem(element));
                } else {
                    block_items.append(this.templateListItem(element));
                }
            });

            if (buttonClearNeed && this.props.clearTitle != '') {
                block_clearButton = $(this.templateClearButton());
            }
        }

        this.container.empty();
        if (block_clearButton) {
            this.container.append(block_clearButton);
        }
        if (block_selected.length > 0) {
            this.container.append(block_selected);
        }
        if (block_items.length > 0) {
            this.container.append(block_items);
        }

        this.container.find('.more-criteria-footer')
            .remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append(`<div class="more-criteria-footer">...${this.props.exclude} <span class="hidden-no">${this.state.hide}</span> ${this.props.hidden}</div>`);
        }
    }

    private templateListItem(props: ListItemInterface): string {
        let html = '';
        if (props.label && props.value) {
            html = '<li class="check-list-item' + (props.disabled ? ' disabled' : '') + '"><label class="item-label" title="' + (props.title || '') + '"><input type="checkbox" tabindex="-1" value="' + props.value + '" ' + (props.active ? 'checked' : '') + (props.disabled ? ' disabled' : '') + '>' + props.label + '</label></li>';
        } else {
            html = '<li class="sa-filter-item-divider"></li>';
        }
        return html;
    }

}
