import { throwErr, isPlainObject, ordinalSuffixOf } from '../helper/utils';

export interface SAFilterOptions {
    btn_class: string
    title: string
    title_always: boolean
    ALL: string
    clear_text: string
    submit: string
    submit_text: string
    initDatepicker: (datePickerElement: JQuery, onChangeCallback: () => void) => void
}

export type SAFilterParams = (string|Partial<SAFilterOptions>)[];

const defaultOpts: SAFilterOptions = {
    btn_class: null,
    title: null,
    title_always: false,
    ALL: null,
    clear_text: null,
    submit: null,
    submit_text: null,
    initDatepicker: null
};

let userDefaults: SAFilterOptions = Object.assign({}, defaultOpts);

export const setDefaults = (opts: object): void => {
    userDefaults = Object.assign({}, defaultOpts, opts);
};

const indexToOrdinal = (index: number): string => ordinalSuffixOf(index + 1);

const invalidParam = (param: any, index: number): void => {
    throwErr(`${indexToOrdinal(index)} argument ('${param}') is invalid`);
};

const expectOptionsOrNothingAfter = (index: number, allParams: SAFilterParams): void => {
    let nextIndex = (index + 1);
    let nextParam = allParams[nextIndex];

    if (!isPlainObject(nextParam) && nextParam !== undefined) {
        throwErr(`Expected ${indexToOrdinal(nextIndex)} argument ('${nextParam}') to be a plain object`);
    }
};

const expectNothingAfter = (index: number, allParams: SAFilterParams): void => {
    let nextIndex = (index + 1);
    let nextParam = allParams[nextIndex];

    if (nextParam !== undefined) {
        throwErr(`Unexpected ${indexToOrdinal(nextIndex)} argument (${nextParam})`);
    }
};

const paramToOption = (opts: any, param: any, index: number, allParams: SAFilterParams): object => {

    const paramType = (typeof param);
    const isString = (paramType === 'string');
    const isDOMNode = (param instanceof Element);

    if (isString) {
        if (index === 0) {
            // Example: swal("Hi there!");
            return {
                text: param
            };
        } else if (index === 1) {
            // Example: swal("Wait!", "Are you sure you want to do this?");
            // (The text is now the second argument)
            return {
                text: param,
                title: allParams[0]
            };
        } else if (index === 2) {
            // Example: swal("Wait!", "Are you sure?", "warning");
            expectOptionsOrNothingAfter(index, allParams);

            return {
                icon: param
            };
        } else {
            invalidParam(param, index);
        }
    } else if (isDOMNode && index === 0) {
        // Example: swal(<DOMNode />);
        expectOptionsOrNothingAfter(index, allParams);

        return {
            content: param
        };
    } else if (isPlainObject(param)) {
        expectNothingAfter(index, allParams);

        return param;
    } else {
        invalidParam(param, index);
    }

};

export const getOpts = (...params: SAFilterParams): SAFilterOptions => {
    let opts = <any>{};

    params.forEach((param, index) => {
        let changes = paramToOption(opts, param, index, params);
        Object.assign(opts, changes);
    });

    // Since Object.assign doesn't deep clone,
    // we need to do this:
    /*let buttonListOpts = pickButtonParam(opts);
    opts.buttons = getButtonListOpts(buttonListOpts);
    delete opts.button;

    opts.content = getContentOpts(opts.content);*/

    const finalOptions: SAFilterOptions = Object.assign({}, defaultOpts, userDefaults, opts);

    // Check if the users uses any deprecated options:
    /*Object.keys(finalOptions)
        .forEach(optionName => {
            if (DEPRECATED_OPTS[optionName]) {
                logDeprecation(optionName);
            }
        });*/

    return finalOptions;
};
