import { isString, checkInstance, genKey, genCancelToken } from './tool'

const map = new Map();

export default class Cancel {
  constructor(instance) {
    try {
      instance.interceptors.request.use(
        (config) => {
          // 检查是否存在重复请求，若存在则取消已发的请求
          this.remove(config);
          // 把当前请求信息添加到请求map中
          this.add(config);
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
  
      instance.interceptors.response.use(
        (response) => {
          console.log("response", response);
          this.remove(response);
          return response;
        },
        (error) => {
          this.remove(error);
          return Promise.reject(error);
        }
      );
    } catch (error) {
      checkInstance(instance);
    }
  }

  add(config) {
    const cancelToken = genCancelToken(config)
    const key = genKey(config);
    config.CancelToken = cancelToken
    map.set(key, cancelToken)
  }
  remove(config) {
    let requestKey = isString(config) ? config : genKey(config);
    if (map.has(requestKey)) {
      const cancelToken = map.get(requestKey);
      cancelToken(requestKey);
      map.delete(requestKey);
    }
  }
  clear() {
    const iterator = map.entries();
    for (const [key, cancel] of iterator) {
      cancel(key);
    }
    map.clear();
  }
}
