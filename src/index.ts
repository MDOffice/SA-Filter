import './index.css';

import 'jquery';
//import 'bootstrap';

import { SAFilterOptions, getOpts } from './options/index';
export { setDefaults, getOpts } from './options/index';

import SingleSelectComponent from './component/SingleSelect';
import MultiSelectComponent from './component/MultiSelect';
import NumRangeComponent from './component/NumRange';
import DateRangeComponent from './component/DateRange';

document.addEventListener('DOMContentLoaded', () => {

    const opts: SAFilterOptions = getOpts();

    let elementsSelect = document.getElementsByClassName('sa-filter-select');
    for (let i = 0; i < elementsSelect.length; i++) {
        new SingleSelectComponent(elementsSelect[i], opts);
    }

    let elementsMultiSelect = document.getElementsByClassName('sa-filter-multiselect');
    for (let i = 0; i < elementsMultiSelect.length; i++) {
        new MultiSelectComponent(elementsMultiSelect[i], opts);
    }

    let elementsNum = document.getElementsByClassName('sa-filter-num');
    for (let i = 0; i < elementsNum.length; i++) {
        new NumRangeComponent(elementsNum[i], opts);
    }

    let elementsDate = document.getElementsByClassName('sa-filter-date');
    for (let i = 0; i < elementsDate.length; i++) {
        new DateRangeComponent(elementsDate[i], opts);
    }
});
