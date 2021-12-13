import {GameObject, Game, Component, System} from '@eva/eva.js';
import {RendererSystem} from '@eva/plugin-renderer';
import {Render, RenderSystem} from '@eva/plugin-renderer-render';
import {Text, TextSystem} from '@eva/plugin-renderer-text';
import {Event, EventSystem} from '@eva/plugin-renderer-event';

function debugLog(debug, level, ...message) {
  if (debug) {
    console[level](...message);
  }
}

function useEvaDriver(filter, level = 'debug') {
  return (target, methodName, descriptor) => {
    const oldValue = descriptor.value;

    descriptor.value = function (...args) {
      let returnValue;
      let driverName;
      if (filter(...args)) {
        driverName = 'Eva Driver';
        returnValue = oldValue.apply(this, args);
      } else {
        driverName = 'Rax Driver';
        returnValue = this._driver[methodName](...args);
      }

      debugLog(
        this._debug,
        level,
        `[${driverName}]`,
        methodName,
        '(',
        args,
        ')',
        '=>',
        returnValue,
      );

      return returnValue;
    };
  };
}

const EvaPropName = '__$eva$__';
const EvaRootAttrName = 'eva-root';
const EvaHudAttrName = 'eva-hud';
const EvaBgAttrName = 'eva-bg';
const EvaCanvasAttrName = 'eva-canvas';
const EvaElementTags = ['eva', 'scene', 'gameobject', 'hud', 'background'];
const TextStyleKeys = [
  'align',
  'breakWords',
  'dropShadow',
  'dropShadowAlpha',
  'dropShadowAngle',
  'dropShadowBlur',
  'dropShadowColor',
  'dropShadowDistance',
  'fill',
  'fillGradientType',
  'fillGradientStops',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'lineJoin',
  'miterLimit',
  'padding',
  'stroke',
  'strokeThickness',
  'textBaseline',
  'trim',
  'whiteSpace',
  'wordWrap',
  'wordWrapWidth',
  'leading',
];
const TransformKeys = [
  'position',
  'x',
  'y',
  'size',
  'width',
  'height',
  'anchor',
  'anchorX',
  'anchorY',
  'origin',
  'originX',
  'originY',
  'scale',
  'scaleX',
  'scaleY',
  'rotation',
  'rotationX',
  'rotationY',
];
const TransformKeyRegExp = /^(anchor|origin|scale|rotation)([A-Z]+)$/;
const EventKeys = [/^on[A-Z]/];
const EventMap = {
  click: 'tap',
};
const CantRemoveComponents = ['Transform', 'Event', 'Render'];

const ListeningProps: any[] = [
  ['alpha', 'zIndex', 'visible', 'sortableChildren'],
  Render, // Render Component & It's filter
];

const ListeningPropsCached: Record<string, typeof Component> = {};

function findComponent(key): typeof Component {
  if (ListeningPropsCached[key]) {
    return ListeningPropsCached[key];
  }

  for (let i = 0; i < ListeningProps.length; i += 2) {
    const filter = ListeningProps[i];
    const ComponentClass = ListeningProps[i + 1];
    if (
      (filter instanceof Array && filter.indexOf(key) > -1) ||
      (filter instanceof RegExp && filter.test(key)) ||
      (filter instanceof Function && filter(key))
    ) {
      ListeningPropsCached[key] = ComponentClass;
      return ComponentClass;
    }
  }

  return undefined;
}

function processListeningProps(gameObject: GameObject, restProps) {
  const map: Record<
    string,
    {ComponentClass: typeof Component; InitParams: Record<string, any>}
  > = {};

  for (const key in restProps) {
    const ComponentClass = findComponent(key);
    if (ComponentClass) {
      const options = map[ComponentClass.componentName] || {
        ComponentClass,
        InitParams: {},
      };

      options.InitParams[key] = restProps[key];
      map[ComponentClass.componentName] = options;
    }
  }

  for (const componentName in map) {
    const options = map[componentName];
    const component = gameObject.getComponent(options.ComponentClass);
    if (!component) {
      gameObject.addComponent(new options.ComponentClass(options.InitParams));
    } else {
      for (const key in options.InitParams) {
        component[key] = options.InitParams[key];
      }
    }
  }
}

function yeep() {
  return true;
}

function noop() {
  return false;
}

function isGameObject(node) {
  return node instanceof GameObject;
}

function getTransformKey(key) {
  if (key === 'x' || key === 'y') {
    return ['position', key];
  } else if (key === 'width' || key === 'height') {
    return ['size', key];
  } else {
    const matches = key.match(TransformKeyRegExp);
    if (matches) {
      return [matches[1], matches[2].toLowerCase()];
    } else {
      return [key];
    }
  }
}

function getTransformProps(props) {
  const result = {};
  for (const key of TransformKeys) {
    if (
      typeof key === 'string' &&
      props.hasOwnProperty(key) &&
      typeof props[key] !== 'undefined'
    ) {
      const value = props[key];
      const [mainKey, subKey] = getTransformKey(key);
      if (subKey === undefined) {
        result[mainKey] = value;
      } else {
        if (result[mainKey] === undefined) {
          result[mainKey] = {};
        }
        result[mainKey][subKey.toLowerCase()] = value;
      }
    }
  }

  return result;
}

function getTextStyleProps(props) {
  const result = {};
  for (const key of TextStyleKeys) {
    if (
      typeof key === 'string' &&
      props.hasOwnProperty(key) &&
      typeof props[key] !== 'undefined'
    ) {
      result[key] = props[key];
    }
  }

  return result;
}

function getEventProps(props) {
  const result = {};
  for (const key of EventKeys) {
    for (const propKey in props) {
      if (key.test(propKey)) {
        result[propKey] = props[propKey];
      }
    }
  }

  return result;
}

function setEvaElement(el) {
  if (
    !(
      el instanceof GameObject ||
      el instanceof TextNode ||
      el instanceof EmptyNode
    )
  ) {
    Object.defineProperty(el, EvaPropName, {
      writable: false,
      configurable: true,
      enumerable: false,
      value: true,
    });
  }
}

function isEvaElement(el) {
  if (
    el instanceof GameObject ||
    el instanceof TextNode ||
    el instanceof EmptyNode
  ) {
    return true;
  } else {
    return el[EvaPropName] === true;
  }
}

function setEvaHud(el) {
  if (el instanceof Element) {
    el.setAttribute(EvaHudAttrName, 'true');
  }
}

function isEvaHud(el) {
  if (el instanceof Element) {
    return el.getAttribute(EvaHudAttrName) === 'true';
  }
  return false;
}

function isGameObjectTree(node, parent) {
  return isGameObject(node) && isGameObject(parent);
}

function isSceneNode(node) {
  return (
    isGameObject(node) &&
    (node._r?.type === 'scene' ||
      (node.parent != null && node.parent === node.scene))
  );
}

function isBgNode(node) {
  return (
    node instanceof HTMLElement && node.getAttribute(EvaBgAttrName) === 'true'
  );
}

function isHudNode(node) {
  return (
    node instanceof HTMLElement && node.getAttribute(EvaHudAttrName) === 'true'
  );
}

function isEvaNode(node) {
  return (
    node instanceof HTMLElement && node.getAttribute(EvaRootAttrName) === 'true'
  );
}

class EmptyNode extends GameObject {
  constructor(name) {
    super(name, {});
  }
}
class TextNode {
  index: number;
  name: string;
  textComponent: Text;

  constructor(name, textComponent, index) {
    this.index = index;
    this.name = name;
    this.textComponent = textComponent;
  }
}

export default class Driver {
  _driver;
  _debug;
  _options;
  _root: HTMLDivElement;
  _canvas: HTMLCanvasElement;
  _hud: HTMLDivElement;
  _background: HTMLDivElement;
  _game: Game;
  _textMap = {};
  _counter = {
    eva: 0,
    scene: 0,
    gameobject: 0,
    empty: 0,
    textMap: 0,
  };
  _firstRender = true;

  constructor(driver, debug = false) {
    this._driver = driver;
    this._debug = debug;
  }

  /** creation */
  @useEvaDriver(noop)
  createBody() {}

  @useEvaDriver(node => isEvaElement(node?._parent))
  createEmpty(emptyComponent) {
    if (isGameObject(emptyComponent?._parent)) {
      const node = new EmptyNode(`empty${this._counter.empty}`);
      this._counter.empty += 1;
      return node;
    } else {
      return this._driver.createEmpty(emptyComponent);
    }
  }

  _createGame(
    options = {
      width: 100,
      height: 100,
    },
    component,
    ...params
  ) {
    this._options = {...options};

    const {
      frameRate = 60,
      preventScroll = false,
      transparent = true,
      renderType = 0,
      backgroundColor = 0x000000,
      HiRes = true,
      LowRes,
      width,
      height,
      style = {},
      systems = [],
      listeningProps = [],
      ...props
    } = this._options;

    if (this._options.resolution === undefined && HiRes === true) {
      this._options.resolution = 2;
    } else if (this._options.resolution === undefined && LowRes === true) {
      this._options.resolution = 1;
    }
    console.log(this._driver);
    this._root = this._driver.createElement(
      'div',
      {
        ...props,
        [EvaRootAttrName]: 'true',
      },
      component,
      ...params,
    );

    this._driver.setStyle(this._root, {
      width,
      height,
      position: 'relative',
      ...style,
    });

    this._canvas = this._driver.createElement(
      'canvas',
      {
        [EvaCanvasAttrName]: 'true',
      },
      {
        _parent: this._root,
      },
    );

    this._driver.setStyle(this._canvas, {
      position: 'absolute',
      left: '0',
      top: '0',
      width,
      height,
      zIndex: '1',
    });

    this._driver.appendChild(this._canvas, this._root);

    const systemCached = {};

    let canvasWidth = width + '';
    let canvasHeight = height + '';

    if (canvasWidth.match(/[\d\.]+%/)) {
      canvasWidth = (750 * parseFloat(canvasWidth)) / 100 + '';
    }

    if (canvasHeight.match(/[\d\.]+%/)) {
      canvasHeight =
        ((window.innerHeight / window.innerWidth) *
          750 *
          parseFloat(canvasHeight)) /
          100 +
        '';
    }

    this._game = new Game({
      frameRate,
      autoStart: true,
      systems: [
        new RendererSystem({
          canvas: this._canvas,
          width: Number(canvasWidth),
          height: Number(canvasHeight),
          transparent,
          preventScroll,
          renderType,
          backgroundColor,
          resolution: this._options.resolution / 2,
        }),
        new RenderSystem(),
        new TextSystem(),
        new EventSystem(),
        ...systems
          .map(system => {
            if (system instanceof System) {
              return system;
            } else if (typeof system === 'function') {
              return system(props);
            }
          })
          .filter(system => {
            const systemName = system.constructor.systemName;
            if (!systemName || systemCached[systemName] !== true) {
              systemName && (systemCached[systemName] = true);
              return true;
            }
            return false;
          }),
      ],
    });

    this._game.scene.transform.size.width = Number(canvasWidth);
    this._game.scene.transform.size.height = Number(canvasHeight);

    Object.defineProperty(this._root, 'gameInstance', {
      value: this._game,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    ListeningProps.push(...listeningProps);
    Object.defineProperty(this._root, 'listeningProps', {
      value: ListeningProps,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    setEvaElement(this._root);

    return this._root;
  }

  _destroyGame() {
    try {
      this._game.pause();
      (this._game as any).destroy?.();
    } catch (e) {}
  }

  _createHUD({style, ...props}, component, ...params) {
    this._hud = this._driver.createElement(
      'div',
      {
        ...props,
        [EvaHudAttrName]: 'true',
      },
      component,
      ...params,
    );

    this._driver.setStyle(this._hud, {
      width: this._options.width,
      height: this._options.height,
      position: 'absolute',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      zIndex: '2',
      ...style,
    });

    setEvaElement(this._hud);

    return this._hud;
  }

  _createBackground({style, ...props}, component, ...params) {
    this._background = this._driver.createElement(
      'div',
      {
        ...props,
        [EvaBgAttrName]: 'true',
      },
      component,
      ...params,
    );

    this._driver.setStyle(this._background, {
      width: this._options.width,
      height: this._options.height,
      position: 'absolute',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      zIndex: '0',
      ...style,
    });

    setEvaElement(this._background);

    return this._background;
  }

  @useEvaDriver(yeep)
  createElement(type, props, component, ...params) {
    debugger;
    if (type === 'eva') {
      return this._createGame(props, component, ...params);
    } else if (type === 'hud') {
      return this._createHUD(props, component, ...params);
    } else if (type === 'background') {
      return this._createBackground(props, component, ...params);
    } else if (EvaElementTags.indexOf(type) > -1) {
      const {
        name = `${type}${this._counter[type]++}`,
        components = [],
        children = '',
        ...restProps
      } = props;

      const transform = getTransformProps(restProps);
      const gameObject = new GameObject(name, transform);

      const events = getEventProps(restProps);
      for (const name in events) {
        this.addEventListener(
          gameObject,
          name.slice(2).toLowerCase(),
          events[name],
        );
      }

      if (type === 'scene') {
        const design = restProps.design || 750;
        const realSize = this._game.scene.transform.size;
        const scale = realSize.width / design;
        const designSize = {
          width: design,
          height: realSize.height / scale,
        };
        gameObject.transform.size.width = designSize.width;
        gameObject.transform.size.height = designSize.height;
        gameObject.transform.scale.x = scale;
        gameObject.transform.scale.y = scale;
      } else if (type === 'gameobject') {
        if (components) {
          for (const component of components) {
            gameObject.addComponent(component);
          }
        }
      }

      processListeningProps(gameObject, restProps);

      return gameObject;
    } else {
      const node = this._driver.createElement(
        type,
        props,
        component,
        ...params,
      );

      if (isEvaHud(component?._parent)) {
        setEvaHud(node);
        this._driver.setStyle(node, {
          pointerEvents: 'all',
        });
      }

      return node;
    }
  }

  _updateTextComponent(textComponent) {
    const textId = textComponent._textId;
    textComponent.text = this._textMap[textId].join('');
  }

  @useEvaDriver((text, raxComponent) => isGameObject(raxComponent?._parent))
  createText(text, raxComponent) {
    const gameObject: GameObject = raxComponent._parent;
    let textComponent = gameObject.getComponent(Text) as any;

    if (!textComponent) {
      const style = getTextStyleProps(raxComponent._parent._r.props);
      textComponent = gameObject.addComponent(
        new Text({
          text: '',
          style,
        }),
      );
    }

    if (textComponent._textId === undefined) {
      textComponent._textId = this._counter.textMap;
      this._counter.textMap += 1;
    }

    const textId = (textComponent as any)._textId;

    if (this._textMap[textId] === undefined) {
      this._textMap[textId] = [];
    }

    this._textMap[textId].push(text);

    this._updateTextComponent(textComponent);

    const node = new TextNode(
      `text${textComponent._textId}`,
      textComponent,
      this._textMap[textId].length - 1,
    );

    setEvaElement(node);

    return node;
  }

  @useEvaDriver(isEvaElement)
  updateText(node, text) {
    if (node instanceof TextNode) {
      const {textComponent, index} = node;
      const textId = (textComponent as any)._textId;
      this._textMap[textId][index] = text;
      this._updateTextComponent(textComponent);
    } else {
      this._driver.updateText(node, text);
    }
  }

  /** mutation */
  @useEvaDriver(isEvaElement)
  appendChild(node, parent, ...params) {
    if (node instanceof TextNode) return;

    if (isGameObjectTree(node, parent)) {
      parent.addChild(node);
    } else if (isSceneNode(node)) {
      this._game.scene.addChild(node);
    } else {
      this._driver.appendChild(node, parent, ...params);
    }
  }

  @useEvaDriver(isEvaElement)
  removeChild(node, parent) {
    if (node instanceof TextNode) return;

    if (isGameObject(node) || isSceneNode(node)) {
      // gameobject
      // parent.removeChild(node);
      node.destroy();
    } else if (isBgNode(node)) {
      this._driver.removeChild(node, this._root);
    } else if (isHudNode(node)) {
      this._driver.removeChild(node, this._root);
    } else if (isEvaNode(node)) {
      this._driver.removeChild(this._root, this._root.parentNode);
      this._destroyGame();
    } else {
      this._driver.removeChild(node, parent);
    }
  }

  @useEvaDriver((newChild, oldChild) => isEvaElement(oldChild))
  replaceChild(newChild, oldChild, parent) {
    this.insertBefore(newChild, oldChild, parent);
    this.removeChild(oldChild, parent);
  }

  @useEvaDriver((node, after) => isEvaElement(after))
  insertAfter(node, after, parent) {
    parent = parent || after.parent || after.parentNode;

    if (isGameObjectTree(node, parent)) {
      const index = parent.transform.children.indexOf(after.transform);

      if (index > -1) {
        parent.addChild(node);

        const transform = parent.transform.children.pop();
        parent.transform.children.splice(index + 1, -1, transform);
      }
    } else if (isSceneNode(node)) {
      this._game.scene.addChild(node);
    } else if (isBgNode(node)) {
      this._driver.insertAfter(node, this._canvas);
    } else if (isHudNode(node)) {
      this._driver.insertAfter(node, this._canvas);
    } else {
      this._driver.insertAfter(node, after, parent);
    }
  }

  @useEvaDriver((node, before) => isEvaElement(before))
  insertBefore(node, before, parent) {
    parent = parent || before.parent || before.parentNode;

    if (isGameObjectTree(node, parent)) {
      const index = parent.transform.children.indexOf(before.transform);

      if (index > -1) {
        parent.addChild(node);

        const transform = parent.transform.children.pop();
        if (index === 0) {
          parent.transform.children.unshift(transform);
        } else {
          parent.transform.children.splice(index, -1, transform);
        }
      }
    } else if (isSceneNode(node)) {
      this._game.scene.addChild(node);
    } else if (isBgNode(node)) {
      this._driver.insertBefore(node, this._canvas);
    } else if (isHudNode(node)) {
      this._driver.insertBefore(node, this._canvas);
    } else {
      this._driver.insertBefore(node, before, parent);
    }
  }

  @useEvaDriver(isGameObject)
  removeChildren(node) {
    const children = [...node.transform.children];

    for (const child of children) {
      child.gameObject.destroy();
      // node.removeChild(child.gameObject);
    }
  }

  /** event */
  @useEvaDriver(isGameObject)
  addEventListener(node, eventName, eventHandler) {
    eventName = EventMap[eventName] || eventName;

    let eventComponent = node.getComponent(Event);
    if (!eventComponent) {
      eventComponent = node.addComponent(new Event());
    }

    return eventComponent.on(eventName, eventHandler);
  }

  @useEvaDriver(isGameObject)
  removeEventListener(node, eventName, eventHandler) {
    eventName = EventMap[eventName] || eventName;

    let eventComponent = node.getComponent(Event);
    if (eventComponent) {
      return eventComponent.off(eventName, eventHandler);
    }
  }

  /** attr */
  _setTransform(gameObject, propKey, propValue) {
    const [mainKey, subKey] = getTransformKey(propKey);

    if (subKey === undefined) {
      gameObject.transform[mainKey] = propValue;
    } else {
      if (gameObject.transform[mainKey] === undefined) {
        gameObject.transform[mainKey] = {};
      }
      gameObject.transform[mainKey][subKey] = propValue;
    }
  }

  _setTextStyle(gameObject, propKey, propValue) {
    const textComponent = gameObject.getComponent(Text);
    if (textComponent) {
      textComponent.style[propKey] = propValue;
    }
  }

  _findChangedComponents(node, propValue) {
    const newTypes = propValue.map(item => item);
    const changedComponents = [];

    node.components.forEach(component => {
      const index = newTypes.indexOf(component);
      if (index > -1) {
        newTypes[index] = false;
      } else if (CantRemoveComponents.indexOf(component.name) < 0) {
        changedComponents.push([component, true]);
      }
    });

    newTypes.forEach((item, index) => {
      if (item !== false) {
        changedComponents.push([propValue[index], false]);
      }
    });

    return changedComponents;
  }

  _setComponent(gameObject: GameObject, component, isRemove = false) {
    const has = gameObject.getComponent(component.name);
    if (!has && !isRemove) {
      gameObject.addComponent(component);
    } else if (has && isRemove) {
      gameObject.removeComponent(component.name);
    }
  }

  _setRenderParams(gameObject: GameObject, propKey, propValue) {
    const render = gameObject.getComponent(Render);
    render[propKey] = propValue;
  }

  @useEvaDriver(isGameObject)
  setAttribute(node, propKey, propValue) {
    if (propKey === 'name') {
      node.name = propValue;
    } else if (propKey === 'components') {
      const changedComponents = this._findChangedComponents(node, propValue);
      for (const [component, isRemove] of changedComponents) {
        this._setComponent(node, component, isRemove);
      }
    } else if (TransformKeys.indexOf(propKey) > -1) {
      this._setTransform(node, propKey, propValue);
    } else if (TextStyleKeys.indexOf(propKey) > -1) {
      this._setTextStyle(node, propKey, propValue);
    } else {
      processListeningProps(node, {[propKey]: propValue});
    }
  }

  @useEvaDriver(isGameObject)
  removeAttribute(node, propKey, propValue) {
    if (propKey === 'components') {
      for (const item of propValue) {
        this._setComponent(node, item, true);
      }
    } else if (TransformKeys.indexOf(propKey) > -1) {
      this._setTransform(node, propKey, undefined);
    } else if (TextStyleKeys.indexOf(propKey) > -1) {
      this._setTextStyle(node, propKey, undefined);
    } else {
      processListeningProps(node, {[propKey]: undefined});
    }
  }

  /** style */
  @useEvaDriver(noop)
  setStyle(node, style) {}

  /** render */
  @useEvaDriver(yeep)
  beforeRender(...args) {
    if (this._game && this._game.playing && this._firstRender) {
      this._game.pause();
    }
    return this._driver.beforeRender(...args);
  }

  @useEvaDriver(yeep)
  afterRender(...args) {
    if (this._game && !this._game.playing && this._firstRender) {
      this._firstRender = false;
      this._game.start();
    }
    return this._driver.afterRender(...args);
  }
}
