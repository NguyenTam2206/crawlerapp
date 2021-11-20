import {
  deleteEmtyStringValue,
  handleResponse,
  catchError
} from "@/api/helper.js";

export default axios => ({
  async checkUrl({ payload, onSuccess, onError }) {
    return await axios({
      url: `${process.env.baseAPI}/checkUrl`,
      method: "GET",
      params: deleteEmtyStringValue(payload)
    })
      .then(res => {
        handleResponse(res, onSuccess, onError);
        return res.data;
      })
      .catch(e => {
        catchError(e, onError);
      });
  },
  async getNewArticles({ onSuccess, onError }) {
    return await axios({
      url: `${process.env.baseAPI}/fetchNewArticles`,
      method: "GET"
    })
      .then(res => {
        handleResponse(res, onSuccess, onError);
        return res.data;
      })
      .catch(e => {
        catchError(e, onError);
      });
  }
});
