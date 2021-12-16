import ReactReconciler from 'react-reconciler';
import {GameObject, Game, Component, System} from '@eva/eva.js';
import {RendererSystem} from '@eva/plugin-renderer';
import {Render, RenderSystem} from '@eva/plugin-renderer-render';
import {Text, TextSystem} from '@eva/plugin-renderer-text';
import {Event, EventSystem} from '@eva/plugin-renderer-event';

let _driver,
  _debug,
  _options,
  _root: HTMLDivElement,
  _canvas: HTMLCanvasElement,
  _hud: HTMLDivElement,
  _background: HTMLDivElement,
  _game: Game,
  _textMap = {},
  _counter = {
    eva: 0,
    scene: 0,
    gameobject: 0,
    empty: 0,
    textMap: 0,
  },
  _firstRender = true;

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
        driverName = 'React Driver';
        returnValue = _driver[methodName](...args);
      }

      debugLog(
        _debug,
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

function isSceneNode(node, parentNode) {
  return (
    isGameObject(node) && parentNode?.gameInstance instanceof Game
    // (node._r?.type === 'scene' ||
    //  ||
    //   (node.parent != null && node.parent === node.scene))
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
function isEventName(propName) {
  return (
    propName.startsWith('on') && window.hasOwnProperty(propName.toLowerCase())
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
function setStyle(domElement, styles) {
  Object.keys(styles).forEach(name => {
    const rawValue = styles[name];
    const isEmpty =
      rawValue === null || typeof rawValue === 'boolean' || rawValue === '';

    // Unset the style to its default values using an empty string
    if (isEmpty) domElement.style[name] = '';
    else {
      const value = typeof rawValue === 'number' ? `${rawValue}px` : rawValue;

      domElement.style[name] = value;
    }
  });
}
function addEventListener(node, eventName, eventHandler) {
  eventName = EventMap[eventName] || eventName;

  let eventComponent = node.getComponent(Event);
  if (!eventComponent) {
    eventComponent = node.addComponent(new Event());
  }

  return eventComponent.on(eventName, eventHandler);
}

const NO_CONTEXT = {};

function appendChild(parent, node) {
  // if (node instanceof TextNode) return;
  if (isGameObjectTree(node, parent)) {
    parent.addChild(node);
  } else if (isSceneNode(node, parent)) {
    _game.scene.addChild(node);
  } else {
    parent.appendChild(node);
  }
}

function removeChild(parent, node) {
  if (isGameObject(node) || isSceneNode(node, parent)) {
    // gameobject
    // parent.removeChild(node);
    node.destroy();
  } else if (isBgNode(node)) {
    parent.removeChild(node);
  } else if (isHudNode(node)) {
    parent.removeChild(node);
  } else if (isEvaNode(node)) {
    parent.removeChild(node);
    _destroyGame();
  } else {
    parent.removeChild(node);
  }
}

function insertBefore(parent, node, before) {
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
  } else if (isSceneNode(node, parent)) {
    parent.scene.addChild(node);
  }
  // else if (isBgNode(node)) {
  //   this._driver.insertBefore(node, this._canvas);
  // } else if (isHudNode(node)) {
  //   this._driver.insertBefore(node, this._canvas);
  // } else {
  //   this._driver.insertBefore(node, before, parent);
  // }
}

// get diff between 2 objects
function shallowDiff(oldObj, newObj) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName],
  );

  return changedProps;
}

function _updateTextComponent(textComponent) {
  const textId = textComponent._textId;
  textComponent.text = _textMap[textId].join('');
}
/** attr */
function _setTransform(gameObject, propKey, propValue) {
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

function _setTextStyle(gameObject, propKey, propValue) {
  const textComponent = gameObject.getComponent(Text);
  if (textComponent) {
    textComponent.style[propKey] = propValue;
  }
}

function _findChangedComponents(node, propValue) {
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

function _setComponent(gameObject: GameObject, component, isRemove = false) {
  const has = gameObject.getComponent(component.name);
  if (!has && !isRemove) {
    gameObject.addComponent(component);
  } else if (has && isRemove) {
    gameObject.removeComponent(component.name);
  }
}
function setAttribute(node, propKey, propValue) {
  if (propKey === 'name') {
    node.name = propValue;
  } else if (propKey === 'components') {
    const changedComponents = _findChangedComponents(node, propValue);
    for (const [component, isRemove] of changedComponents) {
      _setComponent(node, component, isRemove);
    }
  } else if (TransformKeys.indexOf(propKey) > -1) {
    _setTransform(node, propKey, propValue);
  } else if (TextStyleKeys.indexOf(propKey) > -1) {
    _setTextStyle(node, propKey, propValue);
  } else {
    processListeningProps(node, {[propKey]: propValue});
  }
}
function _destroyGame() {
  try {
    _game.pause();
    (_game as any).destroy?.();
  } catch (e) {}
}
function _createGame(
  options = {
    width: 100,
    height: 100,
  },
) {
  _options = {...options};

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
    component,
    ...props
  } = _options;

  if (_options.resolution === undefined && HiRes === true) {
    _options.resolution = 2;
  } else if (_options.resolution === undefined && LowRes === true) {
    _options.resolution = 1;
  }
  _root = document.createElement('div', {
    ...props,
    [EvaRootAttrName]: 'true',
    component,
  });
  _root.setAttribute(EvaRootAttrName, 'true');
  _canvas = document.createElement('canvas', {
    ...props,
    [EvaCanvasAttrName]: 'true',
    _parent: _root,
  });
  _canvas.setAttribute(EvaCanvasAttrName, 'true');
  setStyle(_root, {
    width,
    height,
    position: 'relative',
    ...style,
  });

  setStyle(_canvas, {
    position: 'absolute',
    left: '0',
    top: '0',
    zIndex: '1',
  });
  _root.appendChild(_canvas);

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

  _game = new Game({
    frameRate,
    autoStart: true,
    systems: [
      new RendererSystem({
        canvas: _canvas,
        width: Number(canvasWidth),
        height: Number(canvasHeight),
        transparent,
        preventScroll,
        renderType,
        backgroundColor,
        resolution: _options.resolution / 2,
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

  _game.scene.transform.size.width = Number(canvasWidth);
  _game.scene.transform.size.height = Number(canvasHeight);

  Object.defineProperty(_root, 'gameInstance', {
    value: _game,
    writable: false,
    enumerable: false,
    configurable: true,
  });

  ListeningProps.push(...listeningProps);
  Object.defineProperty(_root, 'listeningProps', {
    value: ListeningProps,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  setEvaElement(_root);
  console.log(_root);
  return _root;
}
function _createHUD({style, ...props}) {
  _hud = document.createElement('div', {
    ...props,
  });

  _hud.setAttribute(EvaHudAttrName, 'true');

  setStyle(_hud, {
    width: _options.width,
    height: _options.height,
    position: 'absolute',
    left: '0',
    top: '0',
    pointerEvents: 'none',
    zIndex: '2',
    ...style,
  });
  setEvaElement(_hud);

  return _hud;
}

function _createBackground({style, ...props}) {
  _background = document.createElement('div', {
    ...props,
  });

  _background.setAttribute(EvaBgAttrName, 'true');

  setStyle(_background, {
    width: _options.width,
    height: _options.height,
    position: 'absolute',
    left: '0',
    top: '0',
    pointerEvents: 'none',
    zIndex: '0',
    ...style,
  });
  setEvaElement(_background);

  return _background;
}
const HostConfig = {
  getRootHostContext(rootContainerInstance) {
    return NO_CONTEXT;
  },

  getChildHostContext(parentHostContext, type, rootContainerInstance) {
    return NO_CONTEXT;
  },

  getChildHostContextForEventComponent(parentHostContext) {
    return parentHostContext;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    // noop
    return null;
  },

  resetAfterCommit() {
    // noop
  },

  createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle,
  ) => {
    if (type == 'eva') {
      return _root;
    } else if (type === 'hud') {
      return _createHUD(props);
    } else if (type === 'background') {
      return _createBackground(props);
    }

    if (EvaElementTags.indexOf(type) > -1) {
      const {
        name = `${type}${_counter[type]++}`,
        components = [],
        children = '',
        ...restProps
      } = props;

      const transform = getTransformProps(restProps);
      const gameObject = new GameObject(name, transform);

      const events = getEventProps(restProps);
      for (const name in events) {
        addEventListener(gameObject, name.slice(2).toLowerCase(), events[name]);
      }

      if (type === 'scene') {
        const design = restProps.design || 750;
        const realSize = _game.scene.transform.size;
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
          if (
            children &&
            (typeof children === 'string' || typeof children === 'number')
          ) {
            let textComponent = gameObject.getComponent(Text) as any;
            if (!textComponent) {
              const style = getTextStyleProps({...restProps});
              textComponent = gameObject.addComponent(
                new Text({
                  text: props.children,
                  style,
                }),
              );
            }
          }
        }
      }
      processListeningProps(gameObject, restProps);

      return gameObject;
    } else {
      //normal react element
      const domElement = document.createElement(type, props);
      Object.keys(props).forEach(propName => {
        const propValue = props[propName];

        if (propName === 'style') {
          setStyle(domElement, propValue);
        } else if (propName === 'children') {
          if (typeof propValue === 'string' || typeof propValue === 'number') {
            domElement.textContent = propValue;
          }
        } else if (propName === 'className') {
          domElement.setAttribute('class', propValue);
        } else if (isEventName(propName)) {
          const eventName = propName.toLowerCase().replace('on', '');
          domElement.addEventListener(eventName, propValue);
        } else {
          domElement.setAttribute(propName, propValue);
        }
      });
      return domElement;
    }
  },

  hideInstance(instance) {
    instance.visible = false;
  },

  unhideInstance(instance, props) {
    const visible =
      props !== undefined && props !== null && props.hasOwnProperty('visible')
        ? props.visible
        : true;
    instance.visible = visible;
  },

  finalizeInitialChildren(wordElement, type, props) {
    return false;
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext,
  ) {
    if (instance instanceof Game) {
      return true;
    } else if (instance instanceof GameObject) {
      return true;
    } else {
      return shallowDiff(oldProps, newProps);
    }
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    // noop
    if (instance instanceof Game) {
    } else if (instance instanceof GameObject) {
      for (let prop in newProps) {
        const value = newProps[prop];
        const lastValue = oldProps != null ? oldProps[prop] : undefined;

        if (
          !newProps.hasOwnProperty(prop) ||
          value === lastValue ||
          (value == null && lastValue == null)
        ) {
          continue;
        }
        if (prop === 'children') continue;

        if (value != null) {
          if (prop === 'style') {
            setStyle(instance, value);
          } else if (isEventName(prop)) {
            addEventListener(instance, prop.slice(2).toLowerCase(), value);
          } else {
            setAttribute(instance, prop, value);
          }
        }
      }
      if (instance instanceof TextNode) {
        const {textComponent, index} = instance;
        const textId = (textComponent as any)._textId;
        _textMap[textId][index] = newProps.children;
        _updateTextComponent(textComponent);
      } else {
        // updateText(node, newProps.children );
      }
    } else {
      updatePayload.forEach(propName => {
        // children changes is done by the other methods like `commitTextUpdate`
        if (propName === 'children') {
          const propValue = newProps[propName];
          if (typeof propValue === 'string' || typeof propValue === 'number') {
            instance.textContent = propValue;
          }
          return;
        }

        if (propName === 'style') {
          // Return a diff between the new and the old styles
          const styleDiffs = shallowDiff(oldProps.style, newProps.style);
          const finalStyles = styleDiffs.reduce((acc, styleName) => {
            // Style marked to be unset
            if (!newProps.style[styleName]) acc[styleName] = '';
            else acc[styleName] = newProps.style[styleName];

            return acc;
          }, {});

          setStyle(instance, finalStyles);
        } else if (
          newProps[propName] ||
          typeof newProps[propName] === 'number'
        ) {
          if (isEventName(propName)) {
            const eventName = propName.toLowerCase().replace('on', '');
            instance.removeEventListener(eventName, oldProps[propName]);
            instance.addEventListener(eventName, newProps[propName]);
          } else {
            instance.setAttribute(propName, newProps[propName]);
          }
        } else {
          if (isEventName(propName)) {
            const eventName = propName.toLowerCase().replace('on', '');
            instance.removeEventListener(eventName, oldProps[propName]);
          } else {
            instance.removeAttribute(propName);
          }
        }
      });
    }
  },
  shouldDeprioritizeSubtree(type, props) {
    // noop
  },
  shouldSetTextContent(type, props) {
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  },
  createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
    return document.createTextNode(text);
  },

  unhideTextInstance(textInstance, text) {
    // noop
  },

  mountEventComponent() {
    // noop
  },

  updateEventComponent() {
    // noop
  },

  handleEventTarget() {
    // noop
  },

  scheduleTimeout: setTimeout,

  cancelTimeout: clearTimeout,

  noTimeout: -1,

  warnsIfNotActing: false,

  now: Date.now,

  isPrimaryRenderer: false,

  supportsMutation: true,

  supportsPersistence: false,

  supportsHydration: false,

  /**
   * -------------------------------------------
   * Mutation
   * -------------------------------------------
   */

  appendInitialChild: appendChild,

  appendChild,

  appendChildToContainer: (parent, child) => {
    parent.appendChild(child);
  },

  removeChild: removeChild,

  removeChildFromContainer: removeChild,

  insertBefore,

  insertInContainerBefore(...args) {
    // noop
    return false;
  },

  commitMount(instance, updatePayload, type, oldProps, newProps) {
    // noop
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
  },

  resetTextContent(evaElement) {
    // noop
  },

  clearContainer(container) {
    // TODO implement this
    // container.removeAllChildrenRecursive();
  },

  beforeActiveInstanceBlur(internalInstanceHandle) {
    // noop
  },

  afterActiveInstanceBlur() {
    // noop
  },

  preparePortalMount(portalInstance) {
    // noop
  },
};
function createRenderer() {
  const reconciler = ReactReconciler(HostConfig);
  return {reconciler, createInstance: _createGame};
}

export default createRenderer;
