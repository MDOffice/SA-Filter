import List, { ListInterface, ListItemInterface, ListProps } from './List';

export interface SingleSelectInterface extends ListInterface<string> {
}

export interface SingleSelectProps extends ListProps<string> {
}

export default class SingleSelectBlock extends List<string> implements SingleSelectInterface {

    props: SingleSelectProps;
    resetOption: JQuery;

    constructor(props: SingleSelectProps) {
        super();

        this.props = props;
        this.props.value = props.value || '';
        this.state = {
            hide: props.hide
        };
        this._init();
    }

    handleChange(self: HTMLElement) {
        let $a = $(self);
        let value = $a.attr('data-value');
        let no_found = true;
        //var selected = $a.hasClass('aui-dropdown2-checked');

        $.each(this.elements, function(index, element) {
            if (element.value === value) {
                no_found = false;
            }
        });
        if (no_found) {
            const newElementTitle = $a.attr('title');
            const newElementLabel = $a.find('label')
                .html();
            this.elements.push({
                value: value,
                title: newElementTitle,
                label: newElementLabel,
                active: true
            });
            this.props.originOptions
                .parent()
                .append(`<option value="${value}" title="${newElementTitle}">${newElementLabel}</option>`);
        }


        this.setValue(value);
        this.emit('change');
    }

    validValue(value: string | null): boolean {
        return (
            this.container
                .find('.select-list-item')
                .filter('[data-value="' + value + '"]').length > 0 ||
            value === ''
        );
    }

    setValue(value: string | null): void {
        let instance = this;
        if (this.resetOption) {
            this.resetOption.remove();
            this.resetOption = null;
        }
        this.props.value = value || '';
        this.container
            .find('.select-list-item')
            .filter('.active')
            .removeClass('active');

        $.each(this.elements, function(index, element) {
            element.active = element.value === instance.props.value;
        });

        if (value !== null) {
            let toUpdate = this.container
                .find('.select-list-item')
                .filter('[data-value="' + value + '"]');
            if (toUpdate.length) {
                toUpdate.addClass('active');
            }
        } else {
            //if value is null
            this.refresh();
        }

        if (this.validValue(this.props.value)) {
            //this.options.attr('selected', false);
            //this.options.filter('[value="' + this.props.value + '"]').attr('selected', true);
            this.props.originSelect.val(this.props.value);
        }
        this.props.originSelect.get(0).dispatchEvent(new Event('change'));
    }

    setEmptyValue(): void {
        this.setValue(null);
        if (!this.resetOption) {
            this.resetOption = this.props.originSelect
                .after($(`<input type="hidden" name="${this.props.name}" value="null">`));
        }
    }

    refresh(customItems?: ListItemInterface[]): void {
        let instance = this,
            $list = $(this.templateList());

        if (customItems) {
            $.each(customItems, function(index, element) {
                $list.append(instance.templateListItem(element));
            });
        } else {
            let need_clear = false;
            $.each(this.elements, function(index, element) {
                if (element.active) {
                    need_clear = true;
                }
                $list.append(instance.templateListItem(element));
            });

            if (need_clear && instance.props.clearTitle != '') {
                $list.prepend(this.templateClearButton());
            }
        }

        instance.container.empty();
        if ($list.length > 0) {
            instance.container.append($list);
        }

        this.container.find('.more-criteria-footer')
            .remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append(`<div class="more-criteria-footer">...${this.props.exclude} <span class="hidden-no">${this.state.hide}</span> ${this.props.hidden}</div>`);
        }

    }

    private templateListItem(props: ListItemInterface): string {
        return (`<li class="select-list-item${(props.active ? ' active' : '')}" title="${(props.title || '')}" data-value="${props.value}"><label class="item-label">${props.label}</label></li>`);
    }


}
