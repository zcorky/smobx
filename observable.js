import dependenceManager from './dependenceManager';

let idCounter = 0;

export default class Observable {
  id = 0;
  value = null;

  constructor(value) {
    this.id = `observable-${++idCounter}`;

    if (Array.isArray(value)) {
      this._proxyArray(value);
    } else {
      this.value = value;
    }
  }

  get() {
    dependenceManager.collect(this.id);
    return this.value;
  }

  set(v) {
    if (Array.isArray(v)) {
      this._proxyArray(v);
    } else {
      this.value = v;
    }

    dependenceManager.trigger(this.id);
  }

  trigger() {
    dependenceManager.trigger(this.id);
  }

  _proxyArray(v) {
    this.value = new Proxy(v, {
      set: (target, key, value) => {
        target[key] = value;

        if (key !== 'length') {
          this.trigger();
        }

        return true;
      },
    });
  }
};