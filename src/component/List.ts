import Component, { ComponentProps } from './Component';
import { MultiSelectInterface } from '../block/MultiSelect';
import { SAFilterOptions } from '../options/index';

export interface ListProps<V> extends ComponentProps {
    name: string
    value: V
    clear_text: string
    search_str: string
    url: string
    urlCache: string
    nomatch: string
    hide: string
    exclude: string
    hidden: string
}

export default class ListComponent<V> extends Component {

    originSelect: JQuery;
    originOptions: JQuery;
    props: ListProps<V>;

    constructor(component: Element, opts: SAFilterOptions) {
        super(component, opts);

        this.readOptions();
    }

    readOptions() {
        const selectElement = this.component.find('select');

        this.originSelect = selectElement;
        this.originOptions = selectElement.find('option');
        this.props = Object.assign(this.props, {
            name: selectElement.attr('name'),
            value: selectElement.val(),
            hide: selectElement.attr('data-hide') || '0',
            search_str: this.component.attr('data-search'),
            nomatch: this.component.attr('data-nomatch'),
            url: this.component.attr('data-url'),
            urlCache: this.component.attr('data-urlCache'),
            exclude: this.component.attr('data-exclude'),
            hidden: this.component.attr('data-hidden')
        });
    }
}
