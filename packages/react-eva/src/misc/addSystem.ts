import instance from './instance';

export default function addSystem(system) {
  instance.systems.push(system);
  if (instance.gameInstance) {
    if (typeof system === 'function') {
      instance.gameInstance.addSystem(system());
    } else {
      instance.gameInstance.addSystem(system);
    }
  }
}
