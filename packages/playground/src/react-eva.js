import * as FiberEva from '@eva/fiber-eva';
import * as ReactEva from '@eva/react-eva';
import * as ReactEvaLottie from '@eva/react-eva-lottie';
import * as ReactEvaDragonBone from '@eva/react-eva-dragonbone';
import * as ReactEvaGraphics from '@eva/react-eva-graphics';
import * as ReactEvaImage from '@eva/react-eva-image';
import * as ReactEvaSpine from '@eva/react-eva-spine';
import * as ReactEvaSprite from '@eva/react-eva-sprite';
import * as ReactEvaSpriteAnimation from '@eva/react-eva-sprite-animation';
import * as ReactEvaTilingSprite from '@eva/react-eva-tiling-sprite';
import * as ReactEvaTransition from '@eva/react-eva-transition';
import * as ReactEvaMask from '@eva/react-eva-mask';
import * as ReactEvaA11Y from '@eva/react-eva-a11y';

Object.assign(window, {
  '@eva/fiber-eva': {...FiberEva},
  '@eva/react-eva': {...ReactEva},
  '@eva/react-eva-lottie': {...ReactEvaLottie},
  '@eva/react-eva-dragonbone': {...ReactEvaDragonBone},
  '@eva/react-eva-graphics': {...ReactEvaGraphics},
  '@eva/react-eva-image': {...ReactEvaImage},
  '@eva/react-eva-spine': {...ReactEvaSpine},
  '@eva/react-eva-sprite': {...ReactEvaSprite},
  '@eva/react-eva-sprite-animation': {...ReactEvaSpriteAnimation},
  '@eva/react-eva-tiling-sprite': {...ReactEvaTilingSprite},
  '@eva/react-eva-transition': {...ReactEvaTransition},
  '@eva/react-eva-mask': {...ReactEvaMask},
  '@eva/react-eva-a11y': {...ReactEvaA11Y},
});
