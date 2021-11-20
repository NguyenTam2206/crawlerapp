<template>
  <div class="mt-1" :class="$device.isMobile ? '' : 'd-flex'">
    <div>
      <img class="article-img" :src="article.featuredMedia" alt />
    </div>
    <div class="font-weight-bold" :class="$device.isMobile ? '' : 'ml-2'">{{article.title}}</div>
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