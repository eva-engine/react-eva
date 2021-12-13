import {createElement, render, useRef, useEffect} from 'react';

import {Eva, EvaRefObject} from '@eva/rax-eva';

function App() {
  const ref = useRef(null);

  useEffect(() => {
    let intervalId;
    if (ref.current) {
      const helloRef = new EvaRefObject(ref);

      intervalId = setInterval(() => {
        if (helloRef.Text.style.fill === '#ff9000') {
          helloRef.Text.style.fill = '#ffffff';
        } else {
          helloRef.Text.style.fill = '#ff9000'
        }
      }, 1000);
    }

    return () => {
      if (typeof intervalId !== 'undefined') {
        clearInterval(intervalId);
      }
    }
  }, []);

  return (
    <Eva width="100%" height="100%">
      <scene>
        <gameobject
          ref={ref}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          fill="#ff9000"
          fontSize={40}
        >
          Hello Rax EVA
        </gameobject>
      </scene>
    </Eva>
  );
}


render(<App />, document.getElementById('root'), {
  driver: new DriverEva(DriverUniversal)
});
