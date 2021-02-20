/**
 * @description promise 链生成器
 * @export
 * @template T
 * @param {*} config
 * @param {*} service
 * @param {*} interceptors
 * @return {*}  {T}
 */
export default function makePromiseChain<T>(
  config: any,
  service: any,
  interceptors: any
): T {
  const chain: any[] = [service, undefined];

  interceptors.request.forEach((interceptor: any) => {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  interceptors.response.forEach((interceptor: any) => {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // console.log(chain.map(item => item && item.toString()))

  let promise: any = Promise.resolve(config);

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
}
