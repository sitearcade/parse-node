// import

import * as R from 'ramda';

// export

export const promiseObjAll = (fn) => (obj) => {
  const keys = Object.keys(obj);

  return Promise.all(keys.map((k) => fn(obj[k], k))).then(R.zipObj(keys));
};
