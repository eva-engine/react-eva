import instance from './instance';

export default function addListeningProps(filter, componentClass) {
  instance.listeningProps.push(filter, componentClass);
}
