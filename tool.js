import qs from "qs";

export const isString = (input) => typeof input === "string";

const rejectInjectInstance = () => {
  throw new Error("please inject axios instance");
};

export const checkInstance = (instance) => {
  if (!instance) {
    rejectInjectInstance();
  }
};

export const genKey = (config) => {
  const { method, url, params, data } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join("&");
};

export const genCancelToken = (config) => {
  if (config.cancelToken) {
    return config.cancelToken;
  }
  return new axios.CancelToken((cancel) => {
  });
}