import Observable from './observable';
import Computed from './computed';
import autorun from './autorun';
import { createObservable } from './extendObservable';


function observable(target, name, descriptor) {
  const v = descriptor.initializer.call(this);
  
  // const v = descriptor.value;
  // console.log('fff: ', target, name, descriptor.initializer);

  if (typeof v === 'object') {
    createObservable(v);
  }

  const observable = new Observable(v);
  
  return {
    enumberable: true,
    configurable: true,
    get() {
      return observable.get();
    },
    set(v) {
      if (typeof v === 'object') {
        createObservable(v);
      }

      return observable.set(v);
    },
  };
}

function computed(target, name, descriptor) {
  const getter = descriptor.get;
  const cpv = new Computed(target, getter);

  return {
    enumberable: true,
    configurable: true,
    get() {
      cpv.target = this;
      return cpv.get();
    }
  };
}

const ReactMixin = {
  componentWillMount() {
    autorun(() => {
      this.render();
      this.forceUpdate();
    });
  },
};

function observer(target) {
  const targetCWM = target.prototype.componentWillMount;

  target.prototype.componentWillMount = function () {
    targetCWM && targetCWM.call(this);
    ReactMixin.componentWillMount.call(this);
  };
}

export {
  observable,
  computed,
  observer,
};