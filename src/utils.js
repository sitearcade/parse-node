// import

import * as R from 'ramda';

// export

export const promiseObjAll = (fn) => (obj) =>
  Object.keys(obj) |> Promise.all(#.map((k) => fn(obj[k], k))).then(R.zipObj(#));
