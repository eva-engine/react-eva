import {createElement, memo, render, useCallback, useState} from 'react';

import {Eva, ResourceType} from '@eva/react-eva';
import Image from '@eva/react-eva-image';

const preloadResources = [
  {
    name: 'logo',
    type: ResourceType.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB1c16edmR26e4jSZFEXXbwuXXa-357-72.png'
      }
    }
  }
];

const LoadState = memo(({state = 0}) => {
  if (state === 0) {
    return (
      <gameobject fill="#fff" fontSize={38}>
        Loading...
      </gameobject>
    )
  } else if (state === 1) {
    // 在预加载的情况下，只要给Image提供resource的name即可。
    return (
      <Image
        resource="logo"
        width={714}
        height={144}
      />
    )
  } else if (state === 2) {
    return (
      <gameobject fill="#f00" fontSize={38}>
        Error!!!
      </gameobject>
    )
  }
})

function App() {
  const [loadState, setLoadState] = useState(null);

  const onStart = useCallback((e) => setLoadState(0), []);
  const onLoaded = useCallback((e) => setLoadState(1), []);
  const onError = useCallback((e) => setLoadState(2), []);

  return (
    <Eva
      width='100%'
      height='100%'
      preloadResources={preloadResources}
      onPreloadStart={onStart}
      onPreloadLoaded={onLoaded}
      onPreloadError={onError}
    >
      <scene>
        <LoadState state={loadState} />
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
