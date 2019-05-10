import './index.css';

import $ from 'jquery';
import 'bootstrap';

//import {getOpts} from './options/index';

//export {setDefaults} from './options/index';

import SingleSelectComponent from './component/SingleSelect';
import MultiSelectComponent from './component/MultiSelect';
import NumRangeComponent from './component/NumRange';
import DateRangeComponent from './component/DateRange';

document.addEventListener('DOMContentLoaded', () => {

    $('.sa-filter-select')
        .each(function () {
            new SingleSelectComponent(this);
        });

    $('.sa-filter-multiselect')
        .each(function () {
            new MultiSelectComponent(this);
        });

    $('.sa-filter-num')
        .each(function () {
            new NumRangeComponent(this);
        });

    $('.sa-filter-date')
        .each(function () {
            new DateRangeComponent(this);
        });
});
