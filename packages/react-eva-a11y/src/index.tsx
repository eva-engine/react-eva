import {
  addSystem,
  addListeningProps
} from '@eva/react-eva';
import {A11y, A11yActivate, A11ySystem} from '@eva/plugin-a11y';

addSystem(({
  a11yDebug,
  a11yActivate,
}) => {
  const initParams = {
    debug: false,
    activate: A11yActivate.DISABLE,
    checkA11yOpen: undefined
  };
  if (typeof a11yDebug === 'boolean') {
    initParams.debug = a11yDebug;
  }
  if (typeof a11yActivate === 'boolean') {
    initParams.activate = a11yActivate === true ? A11yActivate.ENABLE : A11yActivate.DISABLE;
  }
  if (typeof a11yActivate === 'function') {
    initParams.activate = A11yActivate.CHECK;
    initParams.checkA11yOpen = a11yActivate;
  }

  return new A11ySystem(initParams);
});
addListeningProps(/^aria-/, A11y);
addListeningProps(['role'], A11y);
