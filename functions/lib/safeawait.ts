/* Native Error types https://mzl.la/2Veh3TR */
const nativeExceptions = [
  EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError
].filter((except) => typeof except === 'function');

/* Throw native errors. ref: https://bit.ly/2VsoCGE */
function throwNative(error: Error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error;
  }
}

/**
 * Helper for a cleaner async try, catch, finally
 * Accepts a promise and an optional finally callback function
 * Returns [error, data]
 * @param promise
 * @param finally
 * @returns [error, data]
 */
 export const safeAwait = (promise: Promise<any>, finallyFunc?: () => void): Promise<any> => {
  return promise.then(data => {
    if (data instanceof Error) {
      throwNative(data);
      return [ data ];
    }
    return [ undefined, data ];
  }).catch(error => {
    throwNative(error);
    return [ error ];
  }).finally(() => {
    if (finallyFunc && typeof finallyFunc === 'function') {
      finallyFunc();
    }
  });
};