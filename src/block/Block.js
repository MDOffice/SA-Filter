import Trigger from '../helper/Trigger';

export default class Block extends Trigger {

    validValue(value) {
        return false;
    }

    setValue(value) {
    }

    setEmptyValue() {
    }

    getValue() {
        return null;
    }

    getValueLabel() {
        return null;
    }

    getValueTitle() {
        return null;
    }

    render() {
        return null;
    }
}
