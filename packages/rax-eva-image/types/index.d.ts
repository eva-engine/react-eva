import {RefObject} from 'rax-types';
import {
  EvaRefObject,
  ResourceIdentify,
  ResourceItem,
  ResourceSchema,
  EVAComponentProps
} from '@eva/rax-eva';
import {Img, ImgParams} from '@eva/plugin-renderer-img';

declare global {
  namespace EVA {
    interface EvaRefObject {
      Img?: Img;
    }
    interface ResourceSchema {
      IMAGE: {
        name?: string;
        image: string | ResourceItem<'png' | 'jpg' | 'jpeg' | 'webp' | 'svg'>;
      };
    }
  }
}

export interface ImgRefObject extends EvaRefObject {}

interface ImageProps extends EVAComponentProps, ImgParams {
  ref?: RefObject<ImgRefObject>;
  src?: ResourceSchema['IMAGE'] | string;
}

export function useImageResource(src: ResourceSchema['IMAGE']): ResourceIdentify;
export function useImage(params: ImgParams): Img;
export default function Image(props: ImageProps): JSX.Element;
