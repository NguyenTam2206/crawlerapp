import { handleResponse, catchError } from "@/api/helper.js";

export default axios => ({
  async getCategoryList({ onSuccess, onError }) {
    return await axios({
      url: `${process.env.baseAPI}/getCategories`,
      method: "GET"
    })
      .then(res => {
        handleResponse(res, onSuccess, onError);
      })
      .catch(e => {
        catchError(e, onError);
      });
  }
});
