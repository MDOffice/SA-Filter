import SingleSelectBlock, { SingleSelectInterface } from '../block/SingleSelect';
import { SAFilterOptions } from '../options/index';
import ListComponent from './List';

export default class SingleSelectComponent extends ListComponent<string> {

    blockSingleSelect: SingleSelectInterface;

    constructor(component: HTMLElement, opts: SAFilterOptions) {
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
            containerId: this.containerId + '-suggestion',
            search: {
                visible: !!this.props.searchPlaceholder,
                id: this.containerId + '-search',
                placeholder: this.props.searchPlaceholder
                    ? this.props.searchPlaceholder + '...'
                    : null,
                noMatchText: this.props.nomatch,
                url: this.props.url,
                urlCache: this.props.urlCache == '1'
            },
            clearTitle: this.props.clearTitle,
            clearAlways: this.props.clearAlways,
            hide: this.props.hide,
            exclude: this.props.exclude,
            hidden: this.props.hidden
        });
        this.dropdown.addBlock(this.blockSingleSelect);
    }

    private additionAssignEvent() {
        this.component.get(0).addEventListener('shown.bs.dropdown', () => {
            //instance.props.hide = instance.component.find('select').attr('data-hide') || '0';//TODO ?
            this.blockSingleSelect.refresh();
        });
    }
}
