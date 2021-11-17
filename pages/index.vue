<template>
  <div class="wraper">
    <v-select
      v-model="cateIds"
      item-text="name"
      item-value="id"
      :items="items"
      attach
      chips
      multiple
      deletable-chips
      label="Chọn danh mục"
    ></v-select>
    <v-text-field v-model="url" label="Đường dẫn bài viết"></v-text-field>
    <div class="submit-wrap">
      <v-btn :loading="loadingSubmit" color="#ffc0cb" @click="onSubmit">Submit</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateIds: [],
      url: "",
      items: [],
      loadingSubmit: false
    };
  },
  created() {
    this.fetchCategoryList();
  },
  methods: {
    fetchCategoryList() {
      this.$api.Crawler_Category.getCategoryList({
        onSuccess: res => {
          let temp = res.data;
          this.items = temp.map(e => {
            return {
              ...e,
              name: `${e.name} (${e.count})`
            };
          });
        },
        onError: err => {
          console.log(err);
        }
      });
    },
    onSubmit() {
      if (!this.cateIds.length || !this.url) {
        this.$alert("error", "Please fill required inputs");
      }
      if (this.cateIds.length && this.url) {
        this.loadingSubmit = true;
        this.$api.Crawler_Post.createPost({
          payload: {
            url: this.url,
            dest_categories: this.cateIds
          },
          onSuccess: res => {
            console.log(res);
            this.$alert("success", "Create Successed");
            this.loadingSubmit = false;
            this.fetchCategoryList();
          },
          onError: err => {
            this.$alert("error", "Create Failed");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.wraper {
  margin-top: 30px;
  background: #fff4f6;
  padding: 30px;
}
.app-bar {
  background: pink;
}
.app-name {
  font-size: 25px;
}
.submit-wrap {
  text-align: right;
}
</style>
