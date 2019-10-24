export interface TriggerInterface {
    on(action: string | object, callback?: () => void): this;

    emit(action: string): boolean;
}

export default class Trigger implements TriggerInterface {
    triggers: any[string];

    constructor() {
        this.triggers = {};
    }

    _setTrigger(action: string, callback: () => void) {
        if (!this.triggers.hasOwnProperty(action)) {
            this.triggers[action] = [];
        }
        this.triggers[action].push(callback);
    }

    on(action: string | object, callback?: () => void): this {
        if (typeof action === 'object') {
            $.each(action, (t: string, c: () => void) => {
                this._setTrigger(t, c);
            });
        } else {
            this._setTrigger(action, callback);
        }
        return this;
    }

    emit(action: string): boolean {
        //console.log('Trigger.trigger("' + action + '")');
        let success = false;
        let callbackList = this.triggers[action];
        if (callbackList) {
            for (let callback in callbackList) {
                if (callbackList.hasOwnProperty(callback)) {
                    callbackList[callback]();
                    success = true;
                }
            }
        }
        return success;
    }
}
