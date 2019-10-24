import Component, { ComponentProps } from './Component';
import SingleSelectBlock, { SingleSelectInterface } from '../block/SingleSelect';
import { SAFilterOptions } from '../options/index';

interface SingleSelectProps extends ComponentProps {
    name: string
    value: string
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

export default class SingleSelectComponent extends Component {

    elements: JQuery;
    props: SingleSelectProps;
    blockSingleSelect: SingleSelectInterface;

    constructor(component: Element, opts: SAFilterOptions) {
        super(component, opts);

        this.setOptions();
        this.createBlocks();
        this._assignEvents();
    }

    setOptions() {
        this.elements = this.component.find('select').find('option');
        this.props = Object.assign(this.props, {
            name: this.component.find('select').attr('name'),
            value: this.component.find('select').val(),
            hide: this.component.find('select').attr('data-hide') || '0',
            search_str: this.component.attr('data-search'),
            nomatch: this.component.attr('data-nomatch'),
            url: this.component.attr('data-url'),
            urlCache: this.component.attr('data-urlCache'),
            exclude: this.component.attr('data-exclude'),
            hidden: this.component.attr('data-hidden')
        });
    }

    createBlocks() {
        this.blockSingleSelect = new SingleSelectBlock({
            name: this.props.name,
            value: this.props.value,
            has_search: !!this.props.search_str,
            clearTitle: this.props.clear_text,
            initOptions: this.elements,
            searchTitle: this.props.search_str
                ? this.props.search_str + '...'
                : null,
            search_id: this.container_id + '-search',
            search_container: this.container_id + '-suggestion',
            searchUrl: this.props.url,
            searchUrlCache: this.props.urlCache,
            nomatchText: this.props.nomatch,
            hide: this.props.hide,
            exclude: this.props.exclude,
            hidden: this.props.hidden
        });
        this.addComponent(this.blockSingleSelect);
    }

    _assignEvents() {
        this.component.get(0).addEventListener('shown.bs.dropdown', () => {
            //instance.props.hide = instance.component.find('select').attr('data-hide') || '0';//TODO ?
            this.blockSingleSelect.refresh();
        });
    }
}
