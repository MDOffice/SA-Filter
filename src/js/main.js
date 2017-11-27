(function ($) {
    var CCI = CCI || {};
    CCI.Templates = CCI.Templates || {};

    CCI.Templates.filterRangeContent = function (opt_data) {
        var html = '<div id="' + opt_data.dropdown_id + '" class="sa-filter-form  dropdown-menu"><form onsubmit="return false">';
        html += '<div class="form-body"><div class="field-group aui-field-workratio">';
        html += '<input name="' + opt_data.name + '" type="hidden" value="">';

        html += '<div class="' + opt_data.name + '-min"><label for="searcher-' + opt_data.name + '-min">' + (opt_data.title_min ? opt_data.title_min : 'Min') + '</label>';
        html += '<input class="text" id="searcher-' + opt_data.name + '-min" type="number" min="' + opt_data.min + '" max="' + opt_data.max + '">';
        html += '</div>';

        html += '<div class="' + opt_data.name + '-max"><label for="searcher-' + opt_data.name + '-max">' + (opt_data.title_max ? opt_data.title_max : 'Max') + '</label>';
        html += '<input class="text" id="searcher-' + opt_data.name + '-max" type="number" min="' + opt_data.min + '" max="' + opt_data.max + '">';
        html += '</div>';

        html += '</div></div></form></div>';

        return html;
    };

    //=============================================================================
    var Button = function (props) {
        this.options = props;//id, is_subtle, title, label, labelAlways, labelAll
        this.init();
        this.refresh();
    };
    Button.prototype = {
        init: function () {
            var instance = this;
            instance.container = $(instance.templateContainer({
                'id': instance.options.id,
                'is_subtle': instance.options.btn_subtle,
                'class': instance.options.class || 'btn-default'
            }));
        },
        refresh: function () {
            var instance = this;
            instance.container.html(instance.templateContent({
                'title': instance.options.title,
                'label': instance.options.label,
                'labelAlways': instance.options.labelAlways,
                'labelAll': instance.options.labelAll,
                'labelValue': instance.options.labelValue
            }));
        },
        setValue: function (labelValue, title) {
            this.options.labelValue = labelValue;
            this.options.title = title;
            this.refresh();
        },
        render: function () {
            return this.container;
        },
        templateContainer: function (data) {
            return '<button type="button" data-toggle="dropdown" aria-controls="' + data.id + '" class="btn btn-xs ' + data.class + (data.is_subtle ? ' aui-button-subtle' : '') + '" />';
        },
        templateContent: function (data) {
            var html = '',
                title = '',
                has_value = data.labelValue && data.labelValue !== '';
            if (data.title && data.title !== '') {
                title = ' title="' + data.title + '"';
            }
            html += '<div class="criteria-wrap"' + title + '>';
            if (!has_value || data.labelAlways) {
                html += '<span class="fieldLabel">' + data.label + ':</span> ';
            }
            html += has_value ? data.labelValue : data.labelAll;
            html += ' <span class="caret"></span>';
            html += '</div>';
            return html;
        }
    };

    var Trigger = function () {
    };
    Trigger.prototype = {
        _initTrigger: function () {
            if (!this.triggers)
                this.triggers = {};
        },
        _setTrigger: function (type, callback) {
            if (!this.triggers[type]) {
                this.triggers[type] = [];
            }
            this.triggers[type].push(callback);
        },
        on: function (type, callback) {
            var instance = this;
            instance._initTrigger();

            if (typeof type === 'object') {
                $.each(type, function (t, c) {
                    instance._setTrigger(t, c);
                });
            } else {
                instance._setTrigger(type, callback);
            }
        },

        trigger: function (type) {
            //console.log('Trigger.trigger("' + type + '")');
            this._initTrigger();

            var trigger = this.triggers[type];
            if (trigger) {
                for (var i in trigger) {
                    if (trigger.hasOwnProperty(i))
                        trigger[i]();
                }
            }
        }
    };
    var Util = {};
    Util.clone = function (obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = Util.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = Util.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    Util.arraysEqual = function (a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    var DropdownController = function (props) {
        this.props = {
            id: props.id,
            submitText: props.submitText
        };

        this.blocks = [];
        this._init();
    };
    DropdownController.prototype = Object.create(Trigger.prototype);
    DropdownController.prototype.constructor = DropdownController;
    DropdownController.prototype._init = function () {
        var instance = this;
        instance.component = $(instance._templateContainer());
        instance.container = instance.component.find('form');

        instance.initValue = '';
        instance.component.on('click', '.submit-footer', function (e) {
            instance.trigger('submit');
        });
    };
    DropdownController.prototype._setInitValue = function (block) {
        var value = Util.clone(block.getValue());
        if (value) {
            if ((value instanceof Array && value !== [])
                || (typeof(value) === 'string' && value !== '')) {
                this.initValue = value;
                if (block.validValue(value)) {
                    this.value = value;
                    this.valueLabel = block.getValueLabel();
                    this.valueTitle = block.getValueTitle();
                    this.trigger('change');
                }
            }
        }
    };
    DropdownController.prototype.addComponent = function (block) {
        var instance = this,
            block_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this._setInitValue(block);

        this.blocks.push(block_id);
        this.blocks[block_id] = block;
        //this._setComponentValue(block_id);
        block.on('change', function () {
            instance._setComponentValue(block_id);
        });
        this.container.append(block.render());
    };
    DropdownController.prototype._setComponentValue = function (block_id) {
        var block = this.blocks[block_id],
            value = block.getValue() || '';
        if (value !== '') {
            for (var i = 0, len = this.blocks.length; i < len; i++) {
                var key = this.blocks[i];
                if (key !== block_id) {
                    this.blocks[key].setValue(null);
                }
            }
        } else {//value is null maybe in dateRange, numRange
            //set init and get Label if not null
            block.setEmptyValue();
        }
        console.log('_setComponentValue', value);

        this.value = value;
        this.valueLabel = block.getValueLabel();
        this.valueTitle = block.getValueTitle();

        this._showSubmit(!Util.arraysEqual(this.getInitValue(), value));//some error with many blocks
        this.trigger('change');
    };
    DropdownController.prototype.resetToInitValue = function () {
        for (var i = 0, len = this.blocks.length; i < len; i++) {
            var block_id = this.blocks[i],
                block = this.blocks[block_id];
            if (block.validValue(this.initValue)) {
                block.setValue(this.initValue);
                this._setComponentValue(block_id);
            }
        }
    };
    DropdownController.prototype.getInitValue = function () {
        return this.initValue;
    };
    DropdownController.prototype.getValue = function () {
        return this.value;
    };
    DropdownController.prototype.getValueLabel = function () {
        return this.valueLabel;
    };
    DropdownController.prototype.getValueTitle = function () {
        return this.valueTitle;
    };
    DropdownController.prototype.render = function () {
        return this.component;
    };
    DropdownController.prototype._showSubmit = function (visible) {
        /*var show = false;
        for (var i in this.submits) {
            if (this.submits[i].hasOwnProperty(i))
                if (this.submits[i] === true) {
                    show = true;
                    break;
                }
        }*/
        this.component.find('.submit-footer').toggle(visible);
    };
    DropdownController.prototype._templateContainer = function () {
        var html = '';
        html += '<div id="' + this.props.id + '" class="sa-filter-form  dropdown-menu">';
        html += '<form onsubmit="return false"></form>';
        html += this._templateSubmit();
        html += '</div>';
        return html;
    };
    DropdownController.prototype._templateSubmit = function () {
        var html = '';
        if (this.props.submitText)
            html = '<div class="submit-footer" style="display: none">' + this.props.submitText + '</div>';
        return html;
    };

    var Block = function () {
    };
    Block.prototype = Object.create(Trigger.prototype);
    Block.prototype.constructor = Block;
    Block.prototype.validValue = function (value) {
        return false;
    };
    Block.prototype.setValue = function (value) {
    };
    Block.prototype.setEmptyValue = function () {
    };
    Block.prototype.getValue = function () {
        return null;
    };
    Block.prototype.getValueLabel = function () {
        return null;
    };
    Block.prototype.getValueTitle = function () {
        return null;
    };
    Block.prototype.render = function () {
        return null;
    };

    var DateRangeBlock = function (props) {
        this.name = props.name;
        this.value = props.value || '';
        this.title = {
            min: props.title.min,
            max: props.title.max
        };
        this.error_date = props.error_date;
        this._init();
    };
    DateRangeBlock.prototype = Object.create(Block.prototype);
    DateRangeBlock.prototype.constructor = DateRangeBlock;
    DateRangeBlock.prototype._init = function () {
        var instance = this;
        instance.component = $(instance._template());

        var range = this.value;
        this.input = this.component.find('input[name="' + this.name + '"]');
        if (range.indexOf(',') > -1) {
            var min = range.substr(0, range.indexOf(',')),
                max = range.substr(range.indexOf(',') + 1);
            this.component.find('#date-' + this.name + '-min').val(min);
            this.component.find('#date-' + this.name + '-max').val(max);
            this.input.val(this.value);
        }

        $(instance.component).find('.date-picker').datepicker({
            format: "dd.mm.yyyy",
            weekStart: 1,
            autoclose: true,
            language: str_lang
        });

        $(instance.component).on('change', '.date-picker', function () {
            instance.handleChange(this);
        });
    };
    DateRangeBlock.prototype.handleChange = function (self) {
        var that = $(self),
            fieldCurrType = that.attr('id') === 'date-' + this.name + '-min' ? 'min' : 'max';

        var oldFullValue = this.value,
            oldMinValue = '',
            newMinValue = '',
            oldMaxValue = '',
            newMaxValue = '',
            newMinText = '',
            newMaxText = '';
        console.log('oldFullValue', oldFullValue);
        if (this.validValue(oldFullValue)) {
            newMinValue = oldMinValue = oldFullValue.substr(0, oldFullValue.indexOf(','));
            newMaxValue = oldMaxValue = oldFullValue.substr(oldFullValue.indexOf(',') + 1);
        }

        if (fieldCurrType === 'min') {
            newMinValue = that.val();
        } else {
            newMaxValue = that.val();
        }
        if (newMinValue)
            newMinText = newMinValue.substr(6, 2) + newMinValue.substr(3, 2) + newMinValue.substr(0, 2);
        if (newMaxValue)
            newMaxText = newMaxValue.substr(6, 2) + newMaxValue.substr(3, 2) + newMaxValue.substr(0, 2);

        if (newMinValue && newMaxValue && newMinText > newMaxText && this.error_date) {
            setTimeout(function () {
                that.val(fieldCurrType === 'min' ? oldMinValue : oldMaxValue);
            }, 0);
            alert(this.error_date);
        } else {
            this.setValue(newMinValue + (newMinValue || newMaxValue ? ',' : '') + newMaxValue);
            this.trigger('change');
        }
    };
    DateRangeBlock.prototype.validValue = function (value) {
        return value.indexOf(',') > -1 || value === '';
    };
    DateRangeBlock.prototype.setValue = function (value) {
        this.value = value || '';
        if (value === null) {
            this.component.find('.date-picker').val(null);
        }
        this.input.prop('disabled', value === null);
        if (this.validValue(this.value)) {
            this.input.val(this.value);
        }
    };
    DateRangeBlock.prototype.setEmptyValue = function () {
        this.input.prop('disabled', false);
        this.input.val('null');
    };
    DateRangeBlock.prototype.getValue = function () {
        return this.value;
    };
    DateRangeBlock.prototype.getValueLabel = function () {
        var value = this.value;
        if (this.validValue(value)) {
            var min = value.substr(0, value.indexOf(','));
            var max = value.substr(value.indexOf(',') + 1);
            if (min == '' && max == '') {
                value = null;
            } else if (min == '') {
                value = '< ' + max
            } else if (max == '') {
                value = '> ' + min
            } else {
                value = min + ' - ' + max
            }
        }
        return value;
    };
    DateRangeBlock.prototype.getValueTitle = function () {
        return null;
    };
    DateRangeBlock.prototype.render = function () {
        return this.component;
    };
    DateRangeBlock.prototype.renderInput = function () {
        return this.input;
    };
    DateRangeBlock.prototype._template = function () {
        var html = '';
        html += '<div class="form-body"><div class="field-group aui-field-workratio">';
        html += '<input name="' + this.name + '" type="hidden" disabled>';

        html += '<div class="' + this.name + '-min"><label for="date-' + this.name + '-min">' + (this.title.min ? this.title.min : 'Min') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.name + '-min">';
        html += '</div>';

        html += '<div class="' + this.name + '-max"><label for="date-' + this.name + '-max">' + (this.title.max ? this.title.max : 'Max') + '</label>';
        html += '<input class="text date-picker" id="date-' + this.name + '-max">';
        html += '</div>';

        html += '</div></div>';
        return html;
    };

    var ListBlock = function () {
    };
    ListBlock.prototype = Object.create(Block.prototype);
    ListBlock.prototype.constructor = ListBlock;
    //ListBlock.prototype.icon_search = 'glyphicon glyphicon-search';
    //ListBlock.prototype.icon_clear = 'glyphicon glyphicon-remove-sign';
    ListBlock.prototype.icon_search = 'icon-search4';
    ListBlock.prototype.icon_clear = 'icon-cancel-circle2';
    ListBlock.prototype._init = function () {
        var instance = this;
        instance.component = $(instance._template());
        instance.container = instance.component.find('.sa-filter-list-scroll');
        instance.elements = [];

        $.each(instance.initOptions, function () {
            var that = $(this);
            instance.elements.push({
                'value': that.attr('value'),
                'title': that.attr('title'),
                'label': that.html(),
                'active': that.prop('selected')
            });
        });
        instance.refresh();

        $(instance.container).on('click', '.select-list-item, .check-list-item', function (e) {
            e.preventDefault();
            instance.handleChange(this);
        });

        $(instance.component).on('click', '.clear-all', function (e) {
            e.preventDefault();
            e.stopPropagation();
            instance.handleClear();
        });

        $(instance.component).on('click', '.clear-field', function () {
            instance.handleSearchClear(this);
        });

        $(instance.component).on('keyup', '#' + instance.props.search_id, function () {
            instance.handleSearchChange(this);
        });
    };
    ListBlock.prototype.handleChange = function (self) {
    };
    ListBlock.prototype.handleClear = function () {
        this.setEmptyValue();
        this.trigger('change');
        this.refresh();
    };
    ListBlock.prototype.handleSearchClear = function (self) {
        $(self).prev().val('');
        $(self).addClass(ListBlock.prototype.icon_search).removeClass('clear-field ' + ListBlock.prototype.icon_clear);
        this.state.hide = this.props.hide || '0';
        this.refresh();
    };
    ListBlock.prototype.handleSearchChange = function (self) {
        var instance = this;
        var that = $(self),
            findText = that.val().toLowerCase();
        if (findText.length < 0) {
            that.next().addClass(ListBlock.prototype.icon_search).removeClass('clear-field ' + ListBlock.prototype.icon_clear);
            instance.state.hide = this.props.hide || '0';
            instance.refresh();
        } else {
            that.next().removeClass(ListBlock.prototype.icon_search).addClass('clear-field ' + ListBlock.prototype.icon_clear);
            var items = [], is_active;
            if (instance.props.searchUrl) {
                $.ajax({
                    url: instance.props.searchUrl,
                    dataType: 'json',
                    data: {
                        q: findText
                    },
                    async: false,
                    success: function (d) {
                        $.each(d.items, function (index, element) {
                            is_active = instance.elements.filter(function (t) {
                                return t.value === element.id && t.active
                            }).length === 1;
                            items.push({
                                'value': element.value,
                                'label': element.label,
                                'active': is_active
                            });
                        });
                        instance.state.hide = d.hide || '0';
                    }
                });
            } else {
                $.each(instance.elements, function (index, element) {
                    if (element.label.toLowerCase().indexOf(findText) > -1
                        || element.value.toLowerCase().indexOf(findText) > -1) {
                        items.push(element);
                    }
                });
                instance.state.hide = 0;
            }

            instance.container.empty();
            if (items.length === 0) {
                instance.container.find('.more-criteria-footer').remove();
                instance.container.html('<li class="no-suggestions">' + instance.props.nomatchText + '</li>');
            } else {
                instance.refresh(items);
            }
        }
    };
    ListBlock.prototype.getValue = function () {
        return this.value;
    };
    ListBlock.prototype.getValueLabel = function () {
        return $(this.elements).map(function () {
            if (this.active) return this.label ? this.label : this.value
        }).get().join(', ');
    };
    ListBlock.prototype.getValueTitle = function () {
        return $(this.elements).map(function () {
            if (this.active) return this.title ? this.title : this.label
        }).get().join('\n');
    };
    ListBlock.prototype.refresh = function (customItems) {

    };
    ListBlock.prototype.render = function () {
        return this.component;
    };
    ListBlock.prototype._template = function () {
        var html = '';
        html += (this.has_search ? this._templateSearch() : '');
        html += '<div class="sa-filter-list" tabindex="-1"><div id="' + this.props.search_container + '" class="sa-filter-list-scroll" tabindex="-1"></div></div>';
        return html;
    };
    ListBlock.prototype._templateList = function (is_selected) {
        return '<ul class="aui-list-section' + (is_selected ? ' selected-group' : '') + '"></ul>';
    };
    ListBlock.prototype._templateListClear = function () {
        if (this.clearTitle)
            return '<li class="sa-filter-group-actions"><a href="#" class="clear-all">' + this.clearTitle + '</a></li>';
    };
    ListBlock.prototype._templateSearch = function () {
        return '<div class="sa-filter-search">' +
            '<input autocomplete="off" aria-autocomplete="list" placeholder="' + this.props.searchTitle + '" class="form-control" id="' + this.props.search_id + '" aria-controls="' + this.props.search_container + '">' +
            '<span class="icon-default ' + ListBlock.prototype.icon_search + ' noloading"></span>' +
            '</div>';
    };

    var SingleSelectBlock = function (props) {
        this.name = props.name;
        this.value = props.value || '';
        this.has_search = props.has_search;
        this.props = {
            searchTitle: props.searchTitle,
            search_id: props.search_id || 'search',
            search_container: props.search_container,
            searchUrl: props.searchUrl,
            nomatchText: props.nomatchText,
            exclude: props.exclude,
            hidden: props.hidden,
            hide: props.hide,
            clear: props.clear == null ? true : props.clear
        };
        this.state = {
            hide: props.hide
        };

        this.clearTitle = props.clearTitle;
        this.initOptions = props.options;
        this._init();
    };
    SingleSelectBlock.prototype = Object.create(ListBlock.prototype);
    SingleSelectBlock.prototype.constructor = SingleSelectBlock;
    SingleSelectBlock.prototype.handleChange = function (self) {
        var $a = $(self);
        var value = $a.attr('data-value'),
            no_found = true;
        //var selected = $a.hasClass('aui-dropdown2-checked');

        $.each(this.elements, function (index, element) {
            if (element.value === value) {
                no_found = false;
            }
        });
        if (no_found) {
            this.elements.push({
                'value': value,
                'title': $a.attr('title'),
                'label': $a.find('label').html(),
                'active': true
            });
            this.initOptions.parent().append('<option value="' + value + '" title="' + $a.attr('title') + '">' + $a.find('label').html() + '</option>');
        }

        this.setValue(value);
        this.trigger('change');
    };
    SingleSelectBlock.prototype.validValue = function (value) {
        return this.container.find('.select-list-item').filter('[data-value="' + value + '"]').length > 0
            || value === '';
    };
    SingleSelectBlock.prototype.setValue = function (value) {
        var instance = this;
        if (this.resetOption)
            this.resetOption.remove();
        this.value = value || '';
        this.container.find('.select-list-item').filter('.active').removeClass('active');

        $.each(this.elements, function (index, element) {
            element.active = element.value === instance.value;
        });

        if (value !== null) {
            var toUpdate = this.container.find('.select-list-item').filter('[data-value="' + value + '"]');
            if (toUpdate.length)
                toUpdate.addClass('active');
        } else {//if value is null
            this.refresh();
        }

        if (this.validValue(this.value)) {
            //this.options.attr('selected', false);
            //this.options.filter('[value="' + this.value + '"]').attr('selected', true);
            this.initOptions.parent().val(this.value);
        }
    };
    SingleSelectBlock.prototype.setEmptyValue = function () {
        this.setValue(null);
        if (!this.resetOption)
            this.resetOption = this.initOptions.parent().after($('<input type="hidden" name="' + this.name + '" value="null">'));
    };
    SingleSelectBlock.prototype.refresh = function (customItems) {
        var instance = this,
            $list = $(this._templateList());

        if (customItems) {
            $.each(customItems, function (index, element) {
                $list.append(instance._templateListItem(element));
            });
        } else {
            var need_clear = false;
            $.each(this.elements, function (index, element) {
                if (element.active) {
                    need_clear = true;
                }
                $list.append(instance._templateListItem(element));
            });

            if (need_clear && instance.props.clear) {
                $list.prepend(this._templateListClear());
            }
        }

        instance.container.empty();
        instance.container.append($list);

        this.container.find('.more-criteria-footer').remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append('<div class="more-criteria-footer">...' + this.props.exclude + ' <span class="hidden-no">' + this.state.hide + '</span> ' + this.props.hidden + '</div>');
        }
    };
    SingleSelectBlock.prototype._templateListItem = function (props) {
        return '<li class="select-list-item' + (props.active ? ' active' : '') + '" title="' + (props.title ? props.title : '') + '" data-value="' + props.value + '"><label class="item-label">' + props.label + '</label></li>';
    };

    var MultiSelectBlock = function (props) {
        this.name = props.name;
        this.value = props.value || [];
        this.has_search = props.has_search;
        this.props = {
            searchTitle: props.searchTitle,
            search_id: props.search_id || 'search',
            search_container: props.search_container,
            searchUrl: props.searchUrl,
            nomatchText: props.nomatchText,
            exclude: props.exclude,
            hidden: props.hidden,
            hide: props.hide,
            clear: props.clear == null ? true : props.clear
        };
        this.state = {
            hide: props.hide
        };

        this.clearTitle = props.clearTitle;
        this.select = props.select;
        this.initOptions = props.options;
        this._init();
    };
    MultiSelectBlock.prototype = Object.create(ListBlock.prototype);
    MultiSelectBlock.prototype.constructor = MultiSelectBlock;
    MultiSelectBlock.prototype.handleChange = function (self) {
        var $a = $(self);
        var value = $a.find('input').val(),
            no_found = true,
            selected = !$a.find('input').is(':checked');

        $.each(this.elements, function (index, element) {
            if (element.value === value) {
                no_found = false;
            }
        });
        if (no_found) {
            var title = $a.attr('title') || '', label = $a.find('label').text();
            this.elements.push({
                'value': value,
                'title': title,
                'label': label,
                'active': true
            });
            console.log(this.select);
            this.select.append('<option value="' + value + '" title="' + title + '" selected>' + label + '</option>');
        }

        var old_value = this.getValue();
        if (old_value.length === 1 && old_value.indexOf(value) > -1 && !selected) {
            this.setEmptyValue();
        } else {
            this.setValue(value, selected);
        }
        this.trigger('change');
    };
    MultiSelectBlock.prototype.validValue = function (value) {
        /*console.log('MultiSelectBlock.validValue', value);
        console.log('found', this.container.find('.check-list-item').find('input[value="' + value + '"]').length);
        if (value instanceof Array) {

        } else {

        }*/
        //this.container.find('.check-list-item').find('input[value="' + value + '"]').length > 0
        return value instanceof Array || this.container.find('.check-list-item').find('input[value="' + value + '"]').length > 0
            || value === '' || value === [];
    };
    MultiSelectBlock.prototype.setValue = function (value, selected) {
        var instance = this,
            idx_value = this.value.indexOf(value);
        if (this.resetOption)
            this.resetOption.remove();

        if (value && idx_value < 0 && selected) {
            this.value.push(value);
        } else if (value && idx_value > -1 && !selected) {
            this.value.splice(idx_value, 1);
        } else if (value === null) {
            this.value = [];
        }

        $.each(this.elements, function (index, element) {
            if (value === null) {
                element.active = false;
            } else {
                if (element.value === value)
                    element.active = selected;
            }

        });

        var toUpdate;
        if (value !== null) {
            toUpdate = this.container.find('.check-list-item').find('input[value="' + value + '"]');
            if (toUpdate.length)
                toUpdate.prop('checked', selected);
        } else {//if value is null
            //this.refresh();
            toUpdate = this.container.find('.check-list-item').find('input:checked');
            if (toUpdate.length)
                toUpdate.prop('checked', false);
        }

        console.log('MultiSelectBlock.setValue', value, selected);
        if (this.validValue(value)) {
            //console.log('MultiSelectBlock.setValue', 'VALID value');
            //this.options.attr('selected', false);
            this.initOptions.filter('[value="' + value + '"]').attr('selected', selected);
            //this.select.val(this.value);
        }
    };
    MultiSelectBlock.prototype.setEmptyValue = function () {
        console.log('MultiSelectBlock.setEmptyValue');
        this.setValue(null);
        this.initOptions.filter('[selected]').attr('selected', false);
        if (!this.resetOption)
            this.resetOption = this.select.after($('<input type="hidden" name="' + this.name + '" value="null">'));
    };
    MultiSelectBlock.prototype.refresh = function (customItems) {
        //console.log('MultiSelectBlock.refresh');
        var instance = this,
            $list = $(this._templateList()),
            $list_selected = $(this._templateList(true)),
            $list_clear;

        if (customItems) {
            $.each(customItems, function (index, element) {
                if (element.active) {
                    $list_selected.append(instance._templateListItem(element));
                } else {
                    $list.append(instance._templateListItem(element));
                }
            });
        } else {
            var need_clear = false;
            $.each(this.elements, function (index, element) {
                if (element.active) {
                    need_clear = true;
                    $list_selected.append(instance._templateListItem(element));
                } else {
                    $list.append(instance._templateListItem(element));
                }
            });

            if (need_clear && instance.props.clear) {
                $list_clear = $(this._templateListClear());
            }
        }

        instance.container.empty();
        if ($list_clear) {
            instance.container.append($list_clear);
        }
        if ($list_selected.length > 0) {
            instance.container.append($list_selected);
        }
        instance.container.append($list);

        this.container.find('.more-criteria-footer').remove();
        if (this.state.hide && this.state.hide !== '0') {
            this.container.append('<div class="more-criteria-footer">...' + this.props.exclude + ' <span class="hidden-no">' + this.state.hide + '</span> ' + this.props.hidden + '</div>');
        }
    };
    MultiSelectBlock.prototype._templateListItem = function (props) {
        return '<li class="check-list-item"><label class="item-label" title="' + props.title + '"><input type="checkbox" tabindex="-1" value="' + props.value + '" ' + (props.active ? 'checked' : '') + '>' + props.label + '</label></li>';
    };

    //=============================================================================
    CCI.QueryableDropdownSelect = function (component) {
        this._setOptions(component);
        this.container_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        /*this.options.elements.bind("updateOptions", function() {
            instance._setOptions(options)
        }).bind("selectOption", function(e, descriptor) {
            instance.selectItem(descriptor)
        }).bind("removeOption", function(e, descriptor) {
            instance.unselectItem(descriptor)
        }).bind("clear", function() {
            instance.clear()
        });*/
        this._createButton();
        this._createDropdownController();
        this._assignEvents();
        this.render();
    };
    CCI.QueryableDropdownSelect.prototype = {
        _setOptions: function (component) {
            var instance = this;

            instance.container = $(component);
            instance.elements = instance.container.find('select').find('option');
            this.props = {
                name: instance.container.find('select').attr('name'),
                value: instance.container.find('select').val(),
                hide: instance.container.find('select').attr('data-hide') || '0',
                clear_text: instance.container.attr('data-clear'),
                search_str: instance.container.attr('data-search'),
                title: instance.container.attr('data-title'),
                title_always: instance.container.attr('data-title-always'),
                btn_class: instance.container.attr('data-btn-class'),
                nomatch: instance.container.attr('data-nomatch'),
                ALL: instance.container.attr('data-ALL'),
                url: instance.container.attr('data-url'),
                exclude: instance.container.attr('data-exclude'),
                hidden: instance.container.attr('data-hidden'),
                btn_subtle: instance.container.hasClass('subtle'),
                submit: instance.container.attr('data-submit'),
                submit_text: instance.container.attr('data-submit-text')
            };
        },
        _createButton: function () {
            var instance = this;
            this.button = new Button({
                'id': instance.container_id + '-dropdown',
                'is_subtle': instance.props.btn_subtle,
                'class': instance.props.btn_class,
                'label': instance.props.title,
                'labelAlways': instance.props.title_always,
                'labelAll': instance.props.ALL
            });
        },
        _createDropdownController: function () {
            var instance = this;

            this.dropdown = new DropdownController({
                'id': this.container_id + '-dropdown',
                'submitText': this.props.submit_text
            });
            this.dropdown.on({
                    'change': function () {
                        instance.button.setValue(instance.dropdown.getValueLabel(), instance.dropdown.getValueTitle());
                    },
                    'submit': function () {
                        eval(instance.props.submit);
                        $(instance.container).dropdown('toggle');
                    }
                }
            );
            this.blockSingleSelect = new SingleSelectBlock({
                'name': this.props.name,
                'value': this.props.value,
                'has_search': !!this.props.search_str,
                'clearTitle': this.props.clear_text,
                'options': this.elements,
                'searchTitle': this.props.search_str ? (this.props.search_str + '...') : false,
                'search_id': this.container_id + '-search',
                'search_container': this.container_id + '-suggestion',
                'searchUrl': this.props.url,
                'nomatchText': this.props.nomatch,
                'hide': this.props.hide,
                'exclude': this.props.exclude,
                'hidden': this.props.hidden
            });
            this.dropdown.addComponent(this.blockSingleSelect);
        },
        _assignEvents: function () {
            var instance = this;
            $(instance.container).on('shown.bs.dropdown', function () {
                //instance.props.hide = instance.container.find('select').attr('data-hide') || '0';//TODO ?
                instance.blockSingleSelect.refresh();
            });
            $(instance.container).on('hidden.bs.dropdown', function () {
                if (instance.dropdown.getInitValue() !== instance.dropdown.getValue()) {
                    instance.dropdown.resetToInitValue();
                }
            });
        },
        render: function () {
            this.container.append(this.button.render());
            this.container.append(this.dropdown.render());
        }
    };

    $('.sa-filter-select').each(function () {
        new CCI.QueryableDropdownSelect(this);
    });
    //=============================================================================
    CCI.QueryableDropdownMultiSelect = function (component) {
        this._setOptions(component);
        this.container_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this._createButton();
        this._createDropdownController();
        this._assignEvents();
        this.render();
    };
    CCI.QueryableDropdownMultiSelect.prototype = {
        _setOptions: function (component) {
            var instance = this;

            instance.container = $(component);
            instance.select = instance.container.find('select');
            instance.elements = instance.container.find('select').find('option');
            this.props = {
                name: instance.container.find('select').attr('name'),
                value: instance.container.find('select').val(),
                hide: instance.container.find('select').attr('data-hide') || '0',
                clear_text: instance.container.attr('data-clear'),
                search_str: instance.container.attr('data-search'),
                title: instance.container.attr('data-title'),
                title_always: instance.container.attr('data-title-always'),
                btn_class: instance.container.attr('data-btn-class'),
                nomatch: instance.container.attr('data-nomatch'),
                ALL: instance.container.attr('data-ALL'),
                url: instance.container.attr('data-url'),
                exclude: instance.container.attr('data-exclude'),
                hidden: instance.container.attr('data-hidden'),
                btn_subtle: instance.container.hasClass('subtle'),
                submit: instance.container.attr('data-submit'),
                submit_text: instance.container.attr('data-submit-text')
            };
        },
        _createButton: function () {
            var instance = this;

            this.button = new Button({
                'id': instance.container_id + '-dropdown',
                'is_subtle': instance.props.btn_subtle,
                'class': instance.props.btn_class,
                'label': instance.props.title,
                'labelAlways': instance.props.title_always,
                'labelAll': instance.props.ALL
            });
        },
        _createDropdownController: function () {
            var instance = this;

            this.dropdown = new DropdownController({
                'id': this.container_id + '-dropdown',
                'submitText': this.props.submit_text
            });
            this.dropdown.on({
                    'change': function () {
                        instance.button.setValue(instance.dropdown.getValueLabel(), instance.dropdown.getValueTitle());
                    },
                    'submit': function () {
                        eval(instance.props.submit);
                        $(instance.container).dropdown('toggle');
                    }
                }
            );
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
                'nomatchText': this.props.nomatch,
                'hide': this.props.hide,
                'exclude': this.props.exclude,
                'hidden': this.props.hidden
            });
            this.dropdown.addComponent(this.blockMultiSelect);
        },
        _assignEvents: function () {
            var instance = this;
            $(instance.container).on('shown.bs.dropdown', function () {
                //instance.props.hide = instance.container.find('select').attr('data-hide') || '0';//TODO ?
                instance.blockMultiSelect.refresh();
            });
            $(instance.container).on('hidden.bs.dropdown', function () {
                console.log('hidden.bs.dropdown');
                if (instance.dropdown.getInitValue() !== instance.dropdown.getValue()) {
                    instance.dropdown.resetToInitValue();
                }
            });
        },
        render: function () {
            this.container.append(this.button.render());
            this.container.append(this.dropdown.render());
        }
    };

    $('.sa-filter-multiselect').each(function () {
        new CCI.QueryableDropdownMultiSelect(this);
    });
    //=============================================================================
    CCI.QueryableDropdownNumRange = function (options) {
        this._setOptions(options);
        this.container_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this._createButton();
        this._createDropdownController();
        this._assignEvents();
        this.render();
    }
    CCI.QueryableDropdownNumRange.prototype = {
        _setOptions: function (opt) {
            this.options = opt
        },
        _createButton: function () {
            var instance = this;

            this.button = new Button({
                'id': instance.container_id + '-dropdown',
                'is_subtle': instance.props.btn_subtle,
                'label': instance.props.title,
                'labelAlways': instance.props.title_always,
                'labelAll': instance.props.ALL
            });
        },
        _updateButton: function (viewHTML) {
            var instance = this;
            var range = this.options.value;
            var min = range.substr(0, range.indexOf(','));
            var max = range.substr(range.indexOf(',') + 1);
            if (min == '' && max == '') {
                viewHTML = null;
            } else if (min == '') {
                viewHTML = instance.options.title + ': ' + '< ' + max + instance.options.type
            } else if (max == '') {
                viewHTML = instance.options.title + ': ' + '> ' + min + instance.options.type
            } else {
                viewHTML = instance.options.title + ': ' + min + instance.options.type + ' - ' + max + instance.options.type
            }
            /*,
                        title = instance.options.elements.filter('[selected]').map(function() {
                            return this.innerHTML
                        }).get().join(', ')*/
            this.button.setValue(viewHTML);
            this.dropdown.find('input[name="' + this.options.name + '"]').val(instance.options.value);
        },
        _createDropdownController: function () {
            var opts = {
                dropdown_id: this.container_id + '-dropdown',
                name: this.options.name,
                min: this.options.min,
                max: this.options.max,
                title_min: this.options.title_min,
                title_max: this.options.title_max
            };
            this.dropdown = $(CCI.Templates.filterRangeContent(opts));
        },
        _updateVal: function () {
            var range = this.options.value;
            var min = range.substr(0, range.indexOf(',')) || '';
            var max = range.substr(range.indexOf(',') + 1) || '';
            this.dropdown.find('#searcher-' + this.options.name + '-min').val(min);
            this.dropdown.find('#searcher-' + this.options.name + '-max').val(max);
            this.dropdown.find('input[name="' + this.options.name + '"]').val(this.options.value);
        },
        _assignEvents: function () {
            var instance = this;
            $(this.dropdown).on('keyup', 'input', function () {
                var range = instance.options.value;
                var min = range.substr(0, range.indexOf(','));
                var max = range.substr(range.indexOf(',') + 1);

                var that = $(this);
                if (that.attr('id') == 'searcher-' + instance.options.name + '-min') {
                    min = that.val();
                } else {
                    max = that.val();
                }
                instance.options.value = min + ',' + max;
                instance._updateButton();
            });
            $(instance.options.container).on('show.bs.dropdown', function () {
                instance._updateVal();
            });
        },
        render: function () {
            this.options.container.append(this.button.render());
            this.options.container.append(this.dropdown);
            this._updateButton();
        }
    };

    $('.sa-filter-num').each(function () {
        var instance = $(this);
        var options = {
            container: instance,
            clear_text: instance.attr('data-clear'),
            title: instance.attr('data-title'),
            title_always: instance.attr('data-title-always'),
            ALL: instance.attr('data-ALL'),
            min: instance.attr('data-min'),
            max: instance.attr('data-max'),
            type: instance.attr('data-type') || '',
            name: instance.attr('data-name'),
            value: instance.attr('data-value'),
            title_min: instance.attr('data-title-min'),
            title_max: instance.attr('data-title-max'),
            btn_subtle: instance.hasClass('subtle')
        };
        new CCI.QueryableDropdownNumRange(options);
    });
    //=============================================================================
    //if has submit_text need send "null" to clear for submit
    CCI.QueryableDropdownDateRange = function (component) {
        this._setOptions(component);
        this.container_id = '_' + Math.round(Math.random() % 10 * Math.pow(10, 10));

        this._createButton();
        this._createDropdownController();
        this._createBlocks();
        this._render();
        this._assignEvent();
    };
    CCI.QueryableDropdownDateRange.prototype = {
        _setOptions: function (component) {
            var instance = this;

            instance.component = $(component);
            instance.elements = instance.component.find('select').find('option');
            instance.props = {
                clear_text: instance.component.attr('data-clear'),
                title: instance.component.attr('data-title'),
                ALL: instance.component.attr('data-ALL'),
                name: instance.component.attr('data-name'),
                value: instance.component.attr('data-value'),
                btn_class: instance.component.attr('data-btn-class'),
                title_min: instance.component.attr('data-min'),
                title_max: instance.component.attr('data-max'),
                btn_subtle: instance.component.hasClass('subtle'),
                submit: instance.component.attr('data-submit'),
                submit_text: instance.component.attr('data-submit-text')
            };
        },
        _createButton: function () {
            var instance = this;
            this.button = new Button({
                'id': instance.container_id + '-dropdown',
                'is_subtle': instance.props.btn_subtle,
                'class': instance.props.btn_class,
                'label': instance.props.title,
                'labelAlways': false,
                'labelAll': instance.props.ALL
            });
        },
        _createDropdownController: function () {
            var instance = this;
            this.dropdown = new DropdownController({
                'id': this.container_id + '-dropdown',
                'submitText': this.props.submit_text
            });
            this.dropdown.on({
                    'change': function () {
                        instance.button.setValue(instance.dropdown.getValueLabel(), instance.dropdown.getValueTitle());
                    },
                    'submit': function () {
                        $(instance.container).dropdown('toggle');
                        eval(instance.props.submit);
                    }
                }
            );
        },
        _createBlocks: function () {
            this.blockDateRange = new DateRangeBlock({
                'name': this.props.name,
                'value': this.props.value,
                'title': {'min': this.props.title_min, 'max': this.props.title_max},
                'error_date': "Дата початку не може бути більше закінчення"
            });
            this.dropdown.addComponent(this.blockDateRange);
            this.blockSingleSelect = new SingleSelectBlock({
                'name': this.props.name,
                'value': this.props.value,
                'has_search': false,
                'clearTitle': this.props.clear_text,
                'options': this.elements
            });
            this.dropdown.addComponent(this.blockSingleSelect);
        },
        _assignEvent: function () {
            var instance = this;
            instance.component.on('shown.bs.dropdown', function () {
                instance.blockSingleSelect.refresh();
            });
            instance.component.on('hidden.bs.dropdown', function () {
                if (instance.dropdown.getInitValue() !== instance.dropdown.getValue()) {
                    instance.dropdown.resetToInitValue();
                }
            });
        },
        _render: function () {
            this.component.append(this.button.render());
            this.component.append(this.dropdown.render());
            this.component.append(this.blockDateRange.renderInput());
        }
    };

    $('.sa-filter-date').each(function () {
        new CCI.QueryableDropdownDateRange(this);
    });
    //============================================================================
    /*(function() {
        var search_dropdown = $('.filter-container').find(".dropdown");
        search_dropdown.on({
            "show.bs.dropdown": function() {
                search_dropdown.hide()
            }
        });
    })();*/

}(jQuery));
