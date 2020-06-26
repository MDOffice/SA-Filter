import MultiSelectBlock, { MultiSelectInterface } from '../block/MultiSelect';
import { SAFilterOptions } from '../options/index';
import ListComponent from './List';

export default class MultiSelectComponent extends ListComponent<string[]> {

    blockMultiSelect: MultiSelectInterface;

    constructor(component: HTMLElement, opts: SAFilterOptions) {
        super(component, opts);

        this.createBlocks();
        this.additionAssignEvent();
    }

    createBlocks() {
        this.blockMultiSelect = new MultiSelectBlock({
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
            ignoreSelectedList: this.props.ignoreSelectedList,
            hide: this.props.hide,
            exclude: this.props.exclude,
            hidden: this.props.hidden
        });
        this.dropdown.addBlock(this.blockMultiSelect);
    }

    private additionAssignEvent() {
        this.component.get(0).addEventListener('shown.bs.dropdown', () => {
            //instance.props.hide = instance.component.find('select').attr('data-hide') || '0';//TODO ?
            this.blockMultiSelect.refresh();
        });
    }
}

class MultiSelectComponent2 extends HTMLSelectElement {

    constructor() {
        super();
    }

    attributeChangedCallback(attrName, oldValue, newValue) {

    }

    connectedCallback() {
        const mountPoint = document.createElement('div');
        //button
        //dropdown
        this.appendChild(mountPoint);
    }

    static get observedAttributes() {
        return ['data-url', 'data-cache'];
    }
}
