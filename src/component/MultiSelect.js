import Component from './Component';
import MultiSelectBlock from '../block/MultiSelect';

export default class MultiSelectComponent extends Component {

    constructor(component) {
        super(component);
        this.setOptions();

        this.createBlocks();
        this.assignEvents();
    }

    setOptions() {
        this.select = this.component.find('select');
        this.elements = this.component.find('select')
            .find('option');
        this.props = Object.assign(this.props, {
            name: this.component.find('select')
                .attr('name'),
            value: this.component.find('select')
                .val(),
            hide: this.component.find('select')
                .attr('data-hide') || '0',
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
            'name': this.props.name,
            'value': this.props.value,
            'has_search': true,
            'clearTitle': this.props.clear_text,
            'select': this.select,
            'options': this.elements,
            'searchTitle': this.props.search_str + '...',
            'search_id': this.container_id + '-search',
            'search_container': this.container_id + '-suggestion',
            'searchUrl': this.props.url,
            'searchUrlCache': this.props.urlCache,
            'nomatchText': this.props.nomatch,
            'hide': this.props.hide,
            'exclude': this.props.exclude,
            'hidden': this.props.hidden
        });
        this.addComponent(this.blockMultiSelect);
    }

    assignEvents() {
        let instance = this;
        $(instance.component)
            .on('shown.bs.dropdown', function () {
                //instance.props.hide = instance.container.find('select').attr('data-hide') || '0';//TODO ?
                instance.blockMultiSelect.refresh();
            });
    }

}
