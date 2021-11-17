export const deleteFalsyValue = function(obj) {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v ? ((a[k] = v), a) : a),
    {}
  );
};
export const deleteEmtyStringValue = function(obj) {
  Object.keys(obj).forEach(key => obj[key] === "" && delete obj[key]);
  return obj;
};

export const handleResponse = function(res, onSuccess, onError) {
  if (res.status >= 200 && res.status <= 299) {
    onSuccess(res.data);
  } else {
    onError(res);
  }
};
export const catchError = function(e, onError) {
  if (e.response) {
    if (e.response.status < 200 || e.response.status > 299) {
      onError(e.response.data);
    }
  }
};
