import {createElement, render, useCallback} from 'react';

import {
  Eva,
  addSystem,
  addListeningProps
} from '@eva/rax-eva';
import {A11y, A11yActivate, A11ySystem} from '@eva/plugin-a11y';

addSystem(({
  a11yDebug,
  a11yActivate,
}) => {
  const initParams = {};

  if (typeof a11yDebug === 'boolean') {
    initParams.debug = a11yDebug;
  }
  if (typeof a11yActivate === 'boolean') {
    initParams.activate = a11yActivate === true ? A11yActivate.ENABLE : A11yActivate.DISABLE;
  }

  return new A11ySystem(initParams);
});
addListeningProps(/^aria-/, A11y);
addListeningProps(['role'], A11y);

function App() {
  const clickHandler = useCallback(() => {
    window.open('https://yuque.com/eva/rax-eva');
  }, []);

  return (
    <Eva width='100%' height='100%' a11yDebug a11yActivate>
      <scene>
        <gameobject
          fill="#fff"
          width={100}
          height={100}
          fontSize={38}
          onClick={clickHandler}
          aria-label="Hello Rax Eva"
          role="button"
        >
        Hello Rax Eva
        </gameobject>
      </scene>
    </Eva>
  );
}

render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
