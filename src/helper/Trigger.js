class Trigger {
    constructor() {
        this.triggers = {};
    }

    _setTrigger(action, callback) {
        if (!this.triggers.hasOwnProperty(action)) {
            this.triggers[action] = [];
        }
        this.triggers[action].push(callback);
    }

    on(action, callback) {
        if (typeof action === "object") {
            let instance = this;
            $.each(action, function(t, c) {
                instance._setTrigger(t, c);
            });
        } else {
            this._setTrigger(action, callback);
        }
    }

    trigger(action) {
        //console.log('Trigger.trigger("' + action + '")');
        let callbackList = this.triggers[action];
        if (callbackList) {
            for (let callback in callbackList) {
                if (callbackList.hasOwnProperty(callback)) {
                    callbackList[callback]();
                }
            }
        }
    }
}

export default Trigger;
