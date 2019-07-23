import Trigger from '../helper/Trigger';

export default class Block extends Trigger {

    validValue(value: any): boolean {
        return false;
    }

    setValue(value: any): void {
    }

    setEmptyValue(): void {
    }

    getValue(): any {
        return null;
    }

    getValueLabel(): any {
        return null;
    }

    getValueTitle(): any {
        return null;
    }

    render(): any {
        return null;
    }
}
