import {
  deleteEmtyStringValue,
  handleResponse,
  catchError
} from "@/api/helper.js";

export default axios => ({
  async createPost({ payload, onSuccess, onError }) {
    return await axios({
      url: `${process.env.baseAPI}/crawlContent`,
      method: "POST",
      params: deleteEmtyStringValue(payload)
    })
      .then(res => {
        handleResponse(res, onSuccess, onError);
      })
      .catch(e => {
        catchError(e, onError);
      });
  }
});
