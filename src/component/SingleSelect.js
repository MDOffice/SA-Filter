import Component from "./Component";
import SingleSelectBlock from "../block/SingleSelect";

export default class SingleSelectComponent extends Component {
    constructor(component) {
        super(component);

        /*this.options.elements.bind("updateOptions", function() {
            instance._setOptions(options)
        }).bind("selectOption", function(e, descriptor) {
            instance.selectItem(descriptor)
        }).bind("removeOption", function(e, descriptor) {
            instance.unselectItem(descriptor)
        }).bind("clear", function() {
            instance.clear()
        });*/
        this.setOptions();
        this.createBlocks();
        this._assignEvents();
    }

    setOptions() {
        this.elements = this.component.find("select").find("option");
        this.props = Object.assign(this.props, {
            name: this.component.find("select").attr("name"),
            value: this.component.find("select").val(),
            hide: this.component.find("select").attr("data-hide") || "0",
            search_str: this.component.attr("data-search"),
            nomatch: this.component.attr("data-nomatch"),
            url: this.component.attr("data-url"),
            urlCache: this.component.attr("data-urlCache"),
            exclude: this.component.attr("data-exclude"),
            hidden: this.component.attr("data-hidden")
        });
    }

    createBlocks() {
        this.blockSingleSelect = new SingleSelectBlock({
            name: this.props.name,
            value: this.props.value,
            has_search: !!this.props.search_str,
            clearTitle: this.props.clear_text,
            options: this.elements,
            searchTitle: this.props.search_str
                ? this.props.search_str + "..."
                : false,
            search_id: this.container_id + "-search",
            search_container: this.container_id + "-suggestion",
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
        let instance = this;
        $(instance.component).on("shown.bs.dropdown", function() {
            //instance.props.hide = instance.component.find('select').attr('data-hide') || '0';//TODO ?
            instance.blockSingleSelect.refresh();
        });
    }
}
