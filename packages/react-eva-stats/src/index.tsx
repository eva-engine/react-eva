import {addSystem} from '@eva/react-eva';
import {StatsSystem} from '@eva/plugin-stats';

addSystem(({statShow, statStyle}) => {
  const initParams = {
    show: false,
    style: {
      // 这里到数值全部都是宽度到百分比 vw 单位
      x: 0,
      y: 0,
      width: 20,
      height: 12,
    },
  };
  if (typeof statShow === 'boolean') {
    initParams.show = statShow;
  }
  if (typeof statStyle === 'object') {
    initParams.style = statStyle;
  }

  return new StatsSystem(initParams);
});
