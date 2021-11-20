<template>
  <div class="mt-1 d-flex">
    <div>
      <img class="article-img" :src="article.featuredMedia" alt />
    </div>
    <div class="ml-2 font-weight-bold">{{article.title}}</div>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.article-img {
  max-width: 100px;
}
</style>