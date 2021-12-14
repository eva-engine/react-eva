import {createElement, render} from 'react';

import {Eva} from '@eva/react-eva';
import Lottie from '@eva/react-eva-lottie';

function App() {
  return (
    <Eva width="100%" height="100%">
      <scene>
        <Lottie
          src="https://g.alicdn.com/eva-assets/99727b6306d948a725e3622b38122796/0.0.1/tmp/lottie/5196aa44e991279ce93771eb1c5ecf7e/data.json"
          autoPlay={true}
        />
      </scene>
    </Eva>
  );
}

ReactDOM.render(<App></App>, document.getElementById('root'));
