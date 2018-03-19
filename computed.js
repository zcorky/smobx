import dependenceManager from './dependenceManager';

let idCounter = 0;

export default class Computed {
  value = null;
  getter = null;
  target = null;
  id = 0;
  isAutoReCompute = false;

  constructor(target, getter) {
    this.id = `compute-${++idCounter}`;
    this.target = target;
    this.getter = getter;
  }

  get() {
    this._bindAutoCompute();
    dependenceManager.collect(this.id);
    return this.value;
  }

  _bindAutoCompute() {
    if (!this.isAutoReCompute) {
      this.isAutoReCompute = true;
      dependenceManager.beginCollect(this._reCompute, this);
      this._reCompute();
      dependenceManager.endCollect();
    }
  }

  _reCompute() {
    this.value = this.getter.call(this.target);
    dependenceManager.trigger(this.id);
  }
} 