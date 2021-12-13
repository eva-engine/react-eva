import {resource, LOAD_EVENT} from '@eva/eva.js';

export class Preload {
  resources = {};

  onStart(fn) {
    const handler = fn;
    resource.on(LOAD_EVENT.START, handler);
    return this;
  }

  onProgress(fn) {
    const handler = fn;
    resource.on(LOAD_EVENT.PROGRESS, handler);
    return this;
  }

  onLoaded(fn) {
    const handler = fn;
    resource.on(LOAD_EVENT.LOADED, handler);
    return this;
  }

  onComplete(fn) {
    const handler = fn;
    resource.on(LOAD_EVENT.COMPLETE, handler);
    return this;
  }

  onError(fn) {
    const handler = fn;
    resource.on(LOAD_EVENT.ERROR, handler);
    return this;
  }
}

export default new Preload();
