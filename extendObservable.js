import Observable from './observable';

function createObservableProperty(target, property) {
  const observable = new Observable(target[property]);

  Object.defineProperty(target, property, {
    get() {
      return observable.get();
    },
    set(value) {
      return observable.set(value);
    },
  });

  // 递归
  if (typeof target[property] === 'object') {
    for (const key in target[property]) {
      if (target[property].hasOwnProperty(key)) {
        createObservableProperty(target[property], key);
      }
    }
  }
}

function extendObservable(target, object) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      target[key] = object[key];
      createObservableProperty(target, key);
    }
  }
}

function createObservable(target) {
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      createObservableProperty(target, key);
    }
  }
}

export default extendObservable;

export {
  extendObservable,
  createObservable,
};