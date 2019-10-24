//import {EventEmitter} from 'events';
import Trigger, { TriggerInterface } from '../helper/Trigger';

export interface BlockInterface<T> extends TriggerInterface {
    validValue(value: string | null | string[]): boolean;

    setValue(value: string | null | string[]): void;

    setEmptyValue(): void;

    getValue(): T;

    getValueLabel(): string | null;

    getValueTitle(): string | null;

    render(): JQuery;
}

export default class Block<T> extends Trigger implements BlockInterface<T> {

    component: JQuery;

    validValue(value: string | null): boolean {
        return false;
    }

    setValue(value: string | null): void {
    }

    setEmptyValue(): void {
    }

    getValue(): T {
        return null;
    }

    getValueLabel(): string | null {
        return null;
    }

    getValueTitle(): string | null {
        return null;
    }

    render(): JQuery {
        return this.component;
    }
}
