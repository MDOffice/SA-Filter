import {EventEmitter} from 'events';

export default class Block extends EventEmitter {

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
