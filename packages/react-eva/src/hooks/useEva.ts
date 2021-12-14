import {useContext} from 'react';
import {instanceContext} from '../misc/context';

export default function useEva() {
  return useContext(instanceContext);
}
