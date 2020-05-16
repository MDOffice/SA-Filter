import SingleSelectBlock, { SingleSelectInterface } from '../block/SingleSelect';
import { SAFilterOptions } from '../options/index';
import ListComponent from './List';

export default class SingleSelectComponent extends ListComponent<string> {

    blockSingleSelect: SingleSelectInterface;

    constructor(component: Element, opts: SAFilterOptions) {
        super(component, opts);

        this.createBlocks();
        this.additionAssignEvent();
    }

    createBlocks() {
        this.blockSingleSelect = new SingleSelectBlock({
            name: this.props.name,
            value: this.props.value,
            originSelect: this.originSelect,
            originOptions: this.originOptions,
            has_search: !!this.props.search_str,
            clearTitle: this.props.clear_text,
            searchTitle: this.props.search_str
                ? this.props.search_str + '...'
                : null,
            search_id: this.containerId + '-search',
            search_container: this.containerId + '-suggestion',
            searchUrl: this.props.url,
            searchUrlCache: this.props.urlCache,
            nomatchText: this.props.nomatch,
            hide: this.props.hide,
            exclude: this.props.exclude,
            hidden: this.props.hidden
        });
        this.addComponent(this.blockSingleSelect);
    }

    private additionAssignEvent() {
        this.component.get(0).addEventListener('shown.bs.dropdown', () => {
            //instance.props.hide = instance.component.find('select').attr('data-hide') || '0';//TODO ?
            this.blockSingleSelect.refresh();
        });
    }
}
