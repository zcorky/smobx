
let newTarget = null;
let newObserver = null;
const observerStack = [];
const targetStack = [];
let isCollecting = false;

const dependenceManager = {
  _store: {},

  collect(id) {
    if (newObserver) {
      this._addObserver(id);
    }
    return false;
  },

  trigger(id) {
    const dependence = this._store[id];
    if (dependence && dependence.watchers) {
      dependence.watchers.forEach((subsriber) => {
        subsriber.call(dependence.target || this);
      });
    }
  },

  beginCollect(observer, target) {
    isCollecting = true;
    observerStack.push(observer);
    targetStack.push(target);

    newObserver = observerStack.length > 0 ? observerStack[observerStack.length - 1] : null;
    newTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
  },

  endCollect() {
    isCollecting = false;
    observerStack.pop();
    targetStack.pop();

    newObserver = observerStack.length > 0 ? observerStack[observerStack.length - 1] : null;
    newTarget = targetStack.length > 0 ? targetStack[targetStack.length - 1] : null;
  },

  _addObserver(id) {
    this._store[id] = this._store[id] || {};
    this._store[id].target = newTarget;
    this._store[id].watchers = this._store[id].watchers || [];
    this._store[id].watchers.push(newObserver);
  },
};

export default dependenceManager;