import {AriaAttributes} from 'rax-types';
import { A11y } from '@eva/plugin-a11y';

declare global {
  namespace EVA {
    interface EvaProps {
      a11yDebug?: boolean;
      a11yActivate?: boolean | (() => Promise<boolean>);
    }

    interface EvaRefObject {
      A11y?: A11y
    }

    interface ListeningProps extends AriaAttributes {
      role?: string;
    }
  }
}
