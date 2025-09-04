let _token = null;

export const setToken = (t) => { _token = t; };
export const getToken = () => _token;
export const clearToken = () => { _token = null; };