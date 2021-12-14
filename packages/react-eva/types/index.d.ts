import {
  RefObject,
  HTMLAttributes,
  ReactNode,
  ReactText,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import {RESOURCE_TYPE, GameObject, Game, Component, System, Transform} from '@eva/eva.js';
import {Render} from '@eva/plugin-renderer-render';
import {Text} from '@eva/plugin-renderer-text';
import {Event} from '@eva/plugin-renderer-event';

type Vector = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type Pos = {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

type EVARect = Vector & Size & Pos;

interface ClassType<T> extends Function { new (...args: any[]): T; }

type ParamType<T extends Component> = Parameters<T['init']>[0];

export type ResourceIdentify = string;

export type ResourceItem<T> = {
  type: T;
  url: string;
};

export interface ResourceSchema extends EVA.ResourceSchema {
  [name: string]: any
}

type ResourceKey = keyof ResourceSchema;

interface ResourceData<T extends ResourceKey> {
  name?: string;
  type: T;
  src: ResourceSchema[T];
  preload?: boolean;
}

interface EvaInstance {
  rootElement: HTMLDivElement;
  canvasElement: HTMLCanvasElement;
  backgroundElement: HTMLDivElement;
  hudElement: HTMLDivElement;
  gameInstance: Game;
  scene: GameObject[];
  systems: System[];
  listeningProps: any[];
  currentScene: GameObject;
  currentSceneSize: Size;
  fromDOMRect(rect: DOMRect): EVARect;
  toDOMRect(rect: EVARect): DOMRect;
}

type PreloadCallback = (e: {progress: number}) => void;

type PreloadResourceList = ResourceData<any>[];
interface PreloadResourceMap {
  [name: string]: ResourceData<ResourceKey> | ResourceIdentify
}

interface PreloadParams {
  preloadResources?: PreloadResourceList | PreloadResourceMap;
  preloadTimeout?: number;
  onPreloadStart?: (cb: PreloadCallback) => void;
  onPreloadProgress?: (cb: PreloadCallback) => void;
  onPreloadLoaded?: (cb: PreloadCallback) => void;
  onPreloadComplete?: (e: PreloadCallback) => void;
  onPreloadError?: (e: PreloadCallback) => void;
}

interface Preload {
  resources: {
    [name: string]: ResourceIdentify;
  }

  onStart(fn: PreloadCallback): Preload;
  onProgress(fn: PreloadCallback): Preload;
  onLoaded(fn: PreloadCallback): Preload;
  onComplete(fn: PreloadCallback): Preload;
  onStart(fn: PreloadCallback): Preload;
  onError(fn: PreloadCallback): Preload;
}

interface TransformParams {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  anchorX?: number;
  anchorY?: number;
  originX?: number;
  originY?: number;
  scaleX?: number;
  scaleY?: number;
  rotationX?: number;
  rotationY?: number;
}

type TextParams = Parameters<Text['init']>[0];
type TextStyleParams = TextParams['style'];

interface RenderParams {
  visible?: boolean;
  alpha?: number;
  zIndex?: number;
  sortableChildren?: boolean;
}

interface EventParams {
  onClick?: () => void;
  onTap?: () => void;
  onTouchstart?: () => void;
  onTouchmove?: () => void;
  onTouchend?: () => void;
}

interface EvaRef extends HTMLDivElement {
  gameInstance: Game;
}

interface EvaProps extends EVA.EvaProps {
  width?: number | string;
  height?: number | string;
  systems?: System[];
  listeningProps?: any[];
  frameRate?: number;
  autoStart?: boolean;
  perventScroll?: boolean;
  transparent?: boolean;
  HiRes?: boolean;
  LowRes?: boolean;
}

type EvaChildren = scene | hud | bg | JSX.Element;

interface eva extends HTMLAttributes<HTMLDivElement>, EvaProps {
  ref?: RefObject<EvaRef>;
  children?: EvaChildren | EvaChildren[];
  [name: string]: any;
}

interface SceneProps {
  design?: number;
}

type SceneChildren = gameobject | JSX.Element;

interface scene extends SceneProps {
  ref?: RefObject<GameObject>;
  children?: SceneChildren | SceneChildren[];
}

type HudChildren = ReactNode;

interface hud extends HTMLAttributes<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement>;
  children?: HudChildren | HudChildren[];
}

type BgChildren = ReactNode;

interface bg extends HTMLAttributes<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement>;
  children?: BgChildren | BgChildren[];
}

export interface GameObjectProps extends TransformParams, TextStyleParams, RenderParams, EventParams, EVA.ListeningProps {
  name?: string;
  components?: Component[];
}

type GameObjectChildren = gameobject | ReactText | JSX.Element;

interface gameobject extends GameObjectProps {
  ref?: RefObject<GameObject>;
  children?: GameObjectChildren | GameObjectChildren[];
  [name: string]: any;
}

/** common */
export {RESOURCE_TYPE as ResourceType};
export function addSystem(system: System | ((props?: any) => System)): void;
export function addListeningProps<T extends Component>(filter: string[] | RegExp | ((key: string) => boolean), componentClass: ClassType<T>): void;

export interface EVAComponentProps extends TransformParams, TextStyleParams, RenderParams, EventParams, EVA.ListeningProps {
  name?: string;
  components?: Component[];
  children?: gameobject | gameobject[] | ReactText | ReactText[] | JSX.Element | JSX.Element[];
  [name: string]: any;
}
export declare class EvaRefObject implements EVA.EvaRefObject {
  constructor(ref: RefObject<GameObject>);
  gameobject: GameObject;
  Transform: Transform;
  Event?: Event;
  Text?: Text;
  Render?: Render;
  [name: string]: Component | GameObject | ((...params: any[]) => any);
}

/** hooks */
export function useEva(): EvaInstance;
export function usePreload(): Preload;
export function useResource<T extends ResourceKey>(data: ResourceData<T>): ResourceIdentify;
export function useComponent<T extends Component>(componentClass: ClassType<T>, params?: ParamType<T>): T;
export function useComponents(...components: Component[]): Component[];

/** components */
interface EvaComponentProps extends EvaProps, PreloadParams {
  ref?: RefObject<EvaInstance>;
  children?: EvaChildren | EvaChildren[];
  [name: string]: any;
}

export function Eva(props: EvaComponentProps): JSX.Element;

declare global {
  namespace EVA {
    interface ResourceSchema {}
    interface EvaRefObject {}
    interface EvaProps {}
    interface ListeningProps {}
  }

  namespace JSX {
    interface IntrinsicElements {
      eva: eva;
      scene: scene;
      gameobject: gameobject;
      hud: hud;
      background: bg;
    }
  }
}
