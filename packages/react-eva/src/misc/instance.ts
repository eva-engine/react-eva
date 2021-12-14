export class EvaInstance {
  rootElement = null;
  canvasElement = null;
  backgroundElement = null;
  hudElement = null;
  gameInstance = null;
  systems = [];
  listeningProps = [];

  get scene() {
    return [...this.gameInstance.scene.transform.children].map(child => child.gameObject);
  }

  get currentScene() {
    return this.scene[0];
  }

  get currentSceneSize() {
    if (this.currentScene) {
      return Object.freeze({...this.currentScene.transform.size});
    } else {
      return {width: 0, height: 0};
    }
  }

  fromDOMRect(rect) {
    if (this.currentScene) {
      const {x, y} = this.currentScene.transform.scale;
      const newRect = {};
      for (const key of ['x', 'width', 'left', 'right']) {
        if (rect[key] !== undefined) {
          newRect[key] = rect[key] / x;
        }
      }
      for (const key of ['y', 'height', 'top', 'bottom']) {
        if (rect[key] !== undefined) {
          newRect[key] = rect[key] / y;
        }      }
      return Object.freeze(newRect);
    } else {
      return Object.freeze({...rect});
    }
  }

  toDOMRect(rect) {
    if (this.currentScene) {
      const {x, y} = this.currentScene.transform.scale;
      const newRect = {};
      for (const key of ['x', 'width', 'left', 'right']) {
        if (rect[key] !== undefined) {
          newRect[key] = rect[key] * x;
        }
      }
      for (const key of ['y', 'height', 'top', 'bottom']) {
        if (rect[key] !== undefined) {
          newRect[key] = rect[key] * y;
        }
      }
      return Object.freeze(newRect);
    } else {
      return Object.freeze({...rect});
    }
  }
}

export default new EvaInstance();
