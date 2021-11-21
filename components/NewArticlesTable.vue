<template>
  <div>
    <div v-if="!loading">
      <div class="wraper" v-if="articleList.length">
        <div class="title">New Articles</div>
        <v-simple-table style="background : var(--secondary)">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Article</th>
                <th class="text-left">Link</th>
                <th class="text-left">Copy</th>
                <th class="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,i) in articleList" :key="i">
                <td class="table-td-40">
                  <Article :article="item" />
                </td>
                <td class="table-td-30">
                  <div>
                    <a :href="item.link" target="_blank" class="blue--text">{{item.link}}</a>
                    <!-- <v-icon small @click="onCopy(item.link)">mdi-content-copy</v-icon> -->
                  </div>
                </td>
                <td class="table-td-10">
                  <v-icon small @click="onCopy(item.link)">mdi-content-copy</v-icon>
                </td>
                <td class="table-td-20">{{ item.isCrawled ? 'Đã Crawl' : 'Chưa Crawl' }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div class="wraper" v-if="!articleList.length">
        <div class="title">New Articles</div>
        <div>Không có bài viết mới</div>
      </div>
    </div>
    <div v-if="loading" class="d-flex justify-center mt-8">
      <div class="d-flex align-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="ml-2">New Articles Loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
import Article from "@/components/Article";
export default {
  components: {
    Article
  },
  data() {
    return {
      articleList: [],
      loading: true
    };
  },
  created() {
    this.fetchNewArticles();
  },
  methods: {
    async fetchNewArticles() {
      await this.$api.Crawler_Utils.getNewArticles({
        onSuccess: res => {},
        onError: err => {}
      }).then(async res => {
        let articleList = res.data;
        await this.checkIsCrawled(articleList);
        let articleListCrawled = articleList.filter(e => e.isCrawled);
        let articleListNotCrawled = articleList.filter(e => !e.isCrawled);

        this.articleList = [...articleListNotCrawled, ...articleListCrawled];
        this.loading = false;
      });
    },
    async checkIsCrawled(articleList) {
      for (let i = 0; i < articleList.length; i++) {
        await this.$api.Crawler_Utils.checkUrl({
          payload: {
            check_url: articleList[i].link
          },
          onSuccess: async res => {},
          onError: err => {}
        })
          .then(res => {
            // Url đã đc crawl trc đây
            if (res.data) {
              articleList[i].isCrawled = true;
              // this.handleAlreadyDownloadItem(temp[i]);
            }
            return res;
          })
          .then(async res => {
            // Chưa từng crawl
            if (!res.data) {
              articleList[i].isCrawled = false;
            }
          });
      }
    },
    onCopy(link) {
      navigator.clipboard.writeText(link);
      this.$alert("success", "Đã copy link");
    }
  }
};
</script>

<style scoped>
.wraper {
  margin-top: 30px;
  background: var(--secondary);
  padding: 30px;
}
.table-td-40 {
  min-width: 40%;
  max-width: 40%;
  width: 40%;
}
.table-td-10 {
  min-width: 10%;
  max-width: 10%;
  width: 10%;
}
.table-td-30 {
  min-width: 30%;
  max-width: 30%;
  width: 30%;
}
.table-td-20 {
  min-width: 20%;
  max-width: 20%;
  width: 20%;
}
</style>