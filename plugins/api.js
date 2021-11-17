import Crawler_Category from "@/api/Crawler/Category.js";
import Crawler_Post from "@/api/Crawler/Post.js";

export default (context, inject) => {
  const factories = {
    Crawler_Category: Crawler_Category(context.$axios),
    Crawler_Post: Crawler_Post(context.$axios)
  };
  inject("api", factories);
};
