import {RefObject} from 'rax-types';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/rax-eva';
import {TilingSprite as TilingSpriteComponent} from '@eva/plugin-renderer-tiling-sprite';

declare global {
  namespace EVA {
    interface EvaRefObject {
      TilingSprite?: TilingSpriteComponent
    }

    interface ResourceSchema {
      IMAGE: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
      };
    }
  }
}

export interface TilingSpriteRefObject extends EvaRefObject {}

interface TilingSpriteParams {
  resource: ResourceIdentify;
  tileScaleX?: number;
  tileScaleY?: number;
  tilePositionX?: number;
  tilePositionY?: number;
}

interface TilingSpriteProps extends EVAComponentProps, TilingSpriteParams {
  ref?: RefObject<TilingSpriteRefObject>;
  src?: ResourceSchema['IMAGE'] | string;
}

export function useTilingSpriteResource(src: ResourceSchema['IMAGE']): ResourceIdentify;
export function useTilingSprite(params: TilingSpriteParams): TilingSpriteComponent;
export default function TilingSprite(props: TilingSpriteProps): JSX.Element;
