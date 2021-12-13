import * as DriverEva from '@eva/driver-eva';
import * as RaxEva from '@eva/rax-eva';
import * as RaxEvaLottie from '@eva/rax-eva-lottie';
import * as RaxEvaDragonBone from '@eva/rax-eva-dragonbone';
import * as RaxEvaGraphics from '@eva/rax-eva-graphics';
import * as RaxEvaImage from '@eva/rax-eva-image';
import * as RaxEvaSpine from '@eva/rax-eva-spine';
import * as RaxEvaSprite from '@eva/rax-eva-sprite';
import * as RaxEvaSpriteAnimation from '@eva/rax-eva-sprite-animation';
import * as RaxEvaTilingSprite from '@eva/rax-eva-tiling-sprite';
import * as RaxEvaTransition from '@eva/rax-eva-transition';
import * as RaxEvaMask from '@eva/rax-eva-mask';
import * as RaxEvaA11Y from '@eva/rax-eva-a11y';

Object.assign(window, {
  '@eva/driver-eva': {...DriverEva},
  '@eva/rax-eva': {...RaxEva},
  '@eva/rax-eva-lottie': {...RaxEvaLottie},
  '@eva/rax-eva-dragonbone': {...RaxEvaDragonBone},
  '@eva/rax-eva-graphics': {...RaxEvaGraphics},
  '@eva/rax-eva-image': {...RaxEvaImage},
  '@eva/rax-eva-spine': {...RaxEvaSpine},
  '@eva/rax-eva-sprite': {...RaxEvaSprite},
  '@eva/rax-eva-sprite-animation': {...RaxEvaSpriteAnimation},
  '@eva/rax-eva-tiling-sprite': {...RaxEvaTilingSprite},
  '@eva/rax-eva-transition': {...RaxEvaTransition},
  '@eva/rax-eva-mask': {...RaxEvaMask},
  '@eva/rax-eva-a11y': {...RaxEvaA11Y},
});
