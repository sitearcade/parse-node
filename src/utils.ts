// import

import * as R from 'ramda';

// export

export const promiseObjAll = <T, U, V extends string>(
  fn: (val: T, key: V) => Promise<U>,
) =>
  async (obj: Record<V, T>): Promise<Record<V, U>> => {
    const keys = Object.keys(obj) as V[];

    return Promise.all(keys.map(async (k) => fn(obj[k], k)))
      .then(R.zipObj(keys));
  };
