import {
  createElement,
  useState,
  useRef,
  useCallback,
} from 'react';
import {usePreload} from '@eva/rax-eva';
import '@eva/rax-eva-a11y';
import Image from '@eva/rax-eva-image';
import Sprite from '@eva/rax-eva-sprite';
import SpriteAnimation from '@eva/rax-eva-sprite-animation';
import DragonBone, {DragonBoneRefObject} from '@eva/rax-eva-dragonbone';
import HarvestGold, {HarvestGoldRef} from './HarvestGold';
import DancingCat from './DancingCat';

export default function GameScene({addGold}) {
  const preload = usePreload();
  const harvestRef = useRef<HarvestGoldRef>(null);
  const dragonboneRef = useRef<DragonBoneRefObject>(null);

  const [collectConfig, setCollectConfig] = useState({
    src: preload.resources.collect,
    text: '领金币',
    canBeHarvest: true,
  });

  const collect = useCallback(() => {
    if (collectConfig.canBeHarvest) {
      setCollectConfig({
        src: preload.resources.collectDisable,
        text: '明天7点成熟领金币',
        canBeHarvest: false,
      });

      dragonboneRef.current
        .once('complete', () => dragonboneRef.current.play('idle_1'))
        .play('harvest', 1);

      harvestRef.current.onfinish(() =>
        addGold(Math.round(Math.random() * 6) + 4),
      );
      harvestRef.current.play();
    }
  }, []);

  return (
    <scene design={750}>
      <Image
        resource={preload.resources.land}
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        width={333}
        height={87}
      />
      <DancingCat />
      <DragonBone
        ref={dragonboneRef}
        resource={preload.resources.plant}
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        armatureName="Armature_plant_eggplant"
        animationName="idle_6"
        autoPlay={true}
        role="text"
        aria-label={collectConfig.canBeHarvest ? '植物已成熟' : '植物未成熟'}
      />
      <HarvestGold ref={harvestRef}></HarvestGold>
      <Image
        onClick={collect}
        resource={collectConfig.src}
        x={0}
        y={100}
        anchorX={0.5}
        anchorY={0.5}
        originX={0.5}
        originY={0.5}
        width={238}
        height={90}
        role="button"
        aria-label={collectConfig.text}
      >
        <gameobject
          x={0}
          y={-8}
          anchorX={0.5}
          anchorY={0.5}
          originX={0.5}
          originY={0.5}
          fill="#fff"
          fontSize={24}
        >
          {collectConfig.text}
        </gameobject>
      </Image>
      <SpriteAnimation
        resource={preload.resources.cart}
        x={-40}
        y={300}
        speed={100}
        autoPlay={true}
        width={84}
        height={85}
        anchorX={1}
        anchorY={0}
        originX={1}
        originY={0}
      />
      <Sprite
        x={-40}
        y={400}
        resource={preload.resources.icons}
        spriteName="symbol_1"
        width={86}
        height={80}
        anchorX={1}
        anchorY={0}
        originX={1}
        originY={0}
        role="button"
        aria-label="领金币"
      ></Sprite>
      <Sprite
        x={-40}
        y={500}
        resource={preload.resources.icons}
        spriteName="symbol_2"
        width={86}
        height={80}
        anchorX={1}
        anchorY={0}
        originX={1}
        originY={0}
        role="button"
        aria-label="换种子"
      ></Sprite>
    </scene>
  );
}
