import {useMemo} from 'react';
import {resource} from '@eva/eva.js';

let resourceCount = 0;
const resourceNameMap = {};

export default function useResource({name, type, src, preload}) {
  const urls = Object.keys(src).sort().map(key => {
    if (typeof src[key] === 'string') {
      return src[key];
    } else {
      return src[key].url || src[key].src;
    }
  });

  return useMemo(() => {
    const mapKey = urls.join('|');
    const resourceCacheName = resourceNameMap[mapKey];
    let resourceName;

    if ( resourceCacheName !== undefined &&
        (name === undefined || name === resourceCacheName)) {
      resourceName = resourceCacheName;
    } else {
      resourceName = name || `resource_${type}_${++resourceCount}`;
      resourceNameMap[mapKey] = resourceName;

      resource.addResource([
        {
          name: resourceName,
          type,
          src,
          preload: preload ?? true,
        },
      ]);
    }

    return resourceName;
  }, urls);
}
