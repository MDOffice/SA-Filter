import Component, { ComponentProps } from './Component';
import MultiSelectBlock, { MultiSelectInterface } from '../block/MultiSelect';
import { SAFilterOptions } from '../options/index';

interface MultiSelectProps extends ComponentProps {
    name: string
    value: string[]
    title_min: string
    title_max: string
    clear_text: string
    search_str: string
    url: string
    urlCache: string
    nomatch: string
    hide: string
    exclude: string
    hidden: string
}

export default class MultiSelectComponent extends Component {

    originSelect: JQuery;
    originOptions: JQuery;
    props: MultiSelectProps;
    blockMultiSelect: MultiSelectInterface;

    constructor(component: Element, opts: SAFilterOptions) {
        super(component, opts);

        this.setOptions();
        this.createBlocks();
        this._assignEvents();
    }

    setOptions() {
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

    createBlocks() {
        this.blockMultiSelect = new MultiSelectBlock({
            name: this.props.name,
            value: this.props.value,
            originSelect: this.originSelect,
            originOptions: this.originOptions,
            has_search: true,
            clearTitle: this.props.clear_text,
            searchTitle: this.props.search_str + '...',
            search_id: this.container_id + '-search',
            search_container: this.container_id + '-suggestion',
            searchUrl: this.props.url,
            searchUrlCache: this.props.urlCache,
            nomatchText: this.props.nomatch,
            hide: this.props.hide,
            exclude: this.props.exclude,
            hidden: this.props.hidden
        });
        this.addComponent(this.blockMultiSelect);
    }

    _assignEvents() {
        let instance = this;
        $(instance.component)
            .on('shown.bs.dropdown', function() {
                //instance.props.hide = instance.container.find('select').attr('data-hide') || '0';//TODO ?
                instance.blockMultiSelect.refresh();
            });
    }

}
