import {AriaAttributes} from 'react';
import { Stats } from '@eva/plugin-stats';

declare global {
  namespace EVA {
    interface EvaProps {
      statShow?: boolean;
      statStyle?: object;
    }

    interface EvaRefObject {
      Stats?: Stats
    }

    interface ListeningProps extends AriaAttributes {
      role?: string;
    }
  }
}
