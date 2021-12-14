import {useImageResource} from '@eva/react-eva-image';
import {useSpriteResource} from '@eva/react-eva-sprite';
import {useSpriteAnimationResource} from '@eva/react-eva-sprite-animation';
import {useDragonBoneResource} from '@eva/react-eva-dragonbone';
import {useSpineResource} from '@eva/react-eva-spine';

export default function usePreloadResources() {
  return {
    land: useImageResource({
      image: 'https://gw.alicdn.com/mt/TB1Og8yyaL7gK0jSZFBXXXZZpXa-333-87.png',
    }),

    collect: useImageResource({
      image: 'https://gw.alicdn.com/mt/TB1YwtCylv0gK0jSZKbXXbK2FXa-238-90.png',
    }),

    collectDisable: useImageResource({
      image: 'https://gw.alicdn.com/mt/TB1GltSy4D1gK0jSZFsXXbldVXa-238-90.png',
    }),

    plant: useDragonBoneResource({
      image: 'https://gw.alicdn.com/mt/TB1CHhDykP2gK0jSZPxXXacQpXa-1621-1025.png',
      ske: 'https://gw.alicdn.com/mt/TB1MxVByoz1gK0jSZLeXXb9kVXa.json',
      tex: 'https://gw.alicdn.com/mt/TB1i34Iybj1gK0jSZFuXXcrHpXa.json',
    }),

    gold: useImageResource({
      image: '//gw.alicdn.com/tfs/TB1lrD3fLb2gK0jSZK9XXaEgFXa-60-60.png',
    }),

    icons: useSpriteResource({
      image: 'https://gw.alicdn.com/tfs/TB13IOEDEY1gK0jSZFMXXaWcVXa-172-80.png',
      json: './public/json/05238b83ea4285cc94005ee25dad2634.json',
    }),

    cart: useSpriteAnimationResource({
      image: 'https://gw.alicdn.com/tfs/TB1KKXsvUY1gK0jSZFCXXcwqXXa-168-85.png',
      json: './public/json/hdassets1581651137863.json',
    }),

    cat: useSpineResource({
      image: 'https://gw.alicdn.com/tfs/TB18mfY1FY7gK0jSZKzXXaikpXa-805-804.png',
      ske: './public/json/08a16034db954b2dc2c7f7cff38d5b4c.json',
      atlas: './public/json/41799e38f99969d2d6f39c4fa75f8861.atlas'
    })
  };
}
