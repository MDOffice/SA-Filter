import Component, { ComponentProps } from './Component';
import { SAFilterOptions } from '../options/index';

export interface ListProps<V> extends ComponentProps {
    name: string
    value: V
    clearTitle: string
    clearAlways: boolean
    ignoreSelectedList?: boolean
    searchPlaceholder: string
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

    constructor(component: HTMLElement, opts: SAFilterOptions) {
        super(component, opts);

        this.readOptions();
    }

    readOptions() {
        this.originSelect = this.component.find('select');
        this.originOptions = this.originSelect.find('option');

        this.props = Object.assign(this.props, {
            name: this.originSelect.attr('name'),
            value: this.originSelect.val(),
            clearAlways: this.component.attr('data-clear-always') == '1',
            ignoreSelectedList: this.component.attr('data-selected-ignore') == '1',
            hide: this.originSelect.attr('data-hide') || '0',
            searchPlaceholder: this.component.attr('data-search'),
            nomatch: this.component.attr('data-nomatch'),
            url: this.component.attr('data-url'),
            urlCache: this.component.attr('data-urlCache'),
            exclude: this.component.attr('data-exclude'),
            hidden: this.component.attr('data-hidden')
        });
    }
}
