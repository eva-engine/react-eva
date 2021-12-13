import { RefObject } from 'rax-types';
import { EVAComponentProps, EvaRefObject, ResourceIdentify } from '@eva/rax-eva';
import {Mask as MaskComponent, MASK_TYPE} from '@eva/plugin-renderer-mask';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Mask?: MaskComponent
    }
  }
}

export {MASK_TYPE as MaskType};

interface MaskStyleSchema {
  Circle: {
    x: number;
    y: number;
    radius: number;
  }
  Ellipse: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  Rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  RoundedRect: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
  }
  Polygon: {
    paths: any[];
  }
  Img: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  Sprite: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
}

type MaskParams<T extends keyof MaskStyleSchema> = {type: T, style: MaskStyleSchema[T]};
type MaskParamsWithImg = MaskParams<'Img'> & {resource: ResourceIdentify};
type MaskParamsWithSprite = MaskParams<'Sprite'> & {resource: ResourceIdentify, spriteName: string};

export function useMask(params: MaskParams<'Circle'>): MaskComponent;
export function useMask(params: MaskParams<'Ellipse'>): MaskComponent;
export function useMask(params: MaskParams<'Rect'>): MaskComponent;
export function useMask(params: MaskParams<'RoundedRect'>): MaskComponent;
export function useMask(params: MaskParams<'Polygon'>): MaskComponent;
export function useMask(params: MaskParamsWithImg): MaskComponent;
export function useMask(params: MaskParamsWithSprite): MaskComponent;

export interface MaskRefObject extends EvaRefObject {}

interface MaskBaseProps extends EVAComponentProps {
  ref?: RefObject<MaskRefObject>;
}

type MaskProps<T extends keyof MaskStyleSchema> = {type: T} & MaskStyleSchema[T];
type MaskPropsWithImg = MaskProps<'Img'> & {resource: ResourceIdentify};
type MaskPropsWithSprite = MaskProps<'Sprite'> & {resource: ResourceIdentify, spriteName: string};

export default function Mask(props: MaskBaseProps & MaskProps<'Circle'>): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskProps<'Ellipse'>): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskProps<'Rect'>): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskProps<'RoundedRect'>): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskProps<'Polygon'>): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskPropsWithImg): JSX.Element;
export default function Mask(props: MaskBaseProps & MaskPropsWithSprite): JSX.Element;
