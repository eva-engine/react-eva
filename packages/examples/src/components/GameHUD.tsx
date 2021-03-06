import {createElement, useRef, useCallback} from 'react';
import ReactDOM from 'react-dom';

const Portal = ({children}) => {
  return ReactDOM.createPortal(children, document.body);
};

export default function GameHUD({show}) {
  const toastRef = useRef<HTMLDivElement>(null);

  const clicked = useCallback(() => {
    if (toastRef.current.style.display !== 'flex') {
      toastRef.current.style.display = 'flex';
    } else {
      toastRef.current.style.display = 'none';
    }
    show();
  }, []);

  return (
    <hud className="hud">
      <div className="btn" onClick={clicked} role="button" aria-label="赚金币">
        <img
          aria-hidden
          src="//gw.alicdn.com/tfs/TB1m6mfx4D1gK0jSZFyXXciOVXa-114-132.png?getAvatar"
          className="water-drop-static-icon"
        />
      </div>
      <Portal>
        <div className="toast" ref={toastRef}>
          <span>分析模式</span>
        </div>
      </Portal>
    </hud>
  );
}
