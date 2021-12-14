import {useContext} from 'react';
import {preloadContext} from '../misc/context';

export default function usePreload() {
  return useContext(preloadContext);
}
