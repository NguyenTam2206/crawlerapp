<template>
  <div>
    <div class="wraper">
      <!-- <v-select
        v-model="cateIds"
        item-text="name"
        item-value="id"
        :items="items"
        attach
        chips
        multiple
        deletable-chips
        label="Chọn danh mục"
      ></v-select>-->
      <div>Chọn danh mục:</div>
      <v-row class="mb-4">
        <v-col cols="12" md="6" class="my-0 py-0" v-for="(item,i) in items" :key="i">
          <v-checkbox
            :label="item.name"
            :value="item.id"
            v-model="cateIds"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-combobox
        v-model="urls"
        :items="[]"
        hide-selected
        label="Nhập đường dẫn bài viết"
        multiple
        small-chips
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                Nhập đường dẫn và nhấn
                <kbd>enter</kbd> để thêm đường dẫn
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
      <div class="submit-wrap">
        <v-btn :loading="loadingSubmit" color="primary" class="black--text" @click="onSubmit">Crawl</v-btn>
      </div>
    </div>
    <div class="table wraper" v-if="table.length">
      <div class="close-btn" @click="table = []">X</div>
      <v-simple-table style="background : var(--secondary)">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Url</th>
              <th class="text-left">Status</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,i) in table" :key="i">
              <td>{{ item.url }}</td>
              <td class="item-status" :style="`color : ${item.status.color}`">{{ item.status.text }}</td>
              <td v-if="item.status.value !== 'success'">
                <v-btn
                  color="primary"
                  @click="onAction(item)"
                >{{item.status.value === 'failed' ? 'Try Again' : 'Force Crawl'}}</v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <NewArticlesTable :key="keyCompNewArticlesTable" @onImportLinkToInput="onImportLinkToInput" />
  </div>
</template>

<script>
import NewArticlesTable from "@/components/NewArticlesTable";
export default {
  components: {
    NewArticlesTable
  },
  data() {
    return {
      cateIds: [],
      urls: [],
      items: [],
      loadingSubmit: false,
      table: [],
      keyCompNewArticlesTable: 1
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
    async onSubmit() {
      if (!this.cateIds.length || !this.urls.length) {
        this.$alert("error", "Please fill required inputs");
      }
      if (this.cateIds.length && this.urls.length) {
        this.loadingSubmit = true;
        let temp = JSON.parse(JSON.stringify(this.urls));
        temp = temp.map(t => {
          return {
            url: t,
            status: {
              text: "",
              value: "",
              color: ""
            }
          };
        });
        await this.handleSubmit(temp);
        console.log("4");
        this.table = temp;
        console.log("table", this.table);
        this.fetchCategoryList();
        this.keyCompNewArticlesTable++;
        this.urls = [];
        this.loadingSubmit = false;
      }
    },
    async handleSubmit(temp) {
      for (let i = 0; i < temp.length; i++) {
        await this.$api.Crawler_Utils.checkUrl({
          payload: {
            check_url: temp[i].url
          },
          onSuccess: async res => {},
          onError: err => {
            this.handleFailItem(temp[i]);
          }
        })
          .then(res => {
            console.log("1");
            // Url đã đc crawl trc đây
            if (res.data) {
              this.handleAlreadyDownloadItem(temp[i]);
            }
            return res;
          })
          .then(async res => {
            console.log("2");
            // Chưa từng crawl
            if (!res.data) {
              let resCreatePost = await this.createPost(
                "group",
                temp[i].url,
                temp[i]
              );
              return resCreatePost;
            }
          })
          .then(resCreatePost => {
            //Crawl thành công
            console.log("3");
            if (resCreatePost) {
              this.handleSuccessItem(temp[i]);
            }
          });
      }
    },
    handleFailItem(item) {
      item.status.text = "Crawl Thất Bại";
      item.status.value = "failed";
      item.status.color = "red";
    },
    handleAlreadyDownloadItem(item) {
      item.status.text = "Đã Được Crawl";
      item.status.value = "crawled before";
      item.status.color = "orange";
    },
    handleSuccessItem(item) {
      item.status.text = "Crawl Thành Công";
      item.status.value = "success";
      item.status.color = "green";
    },
    onAction(item) {
      if (item.status.value === "failed") {
        this.createPost("single", item.url);
      }
      if (item.status.value === "crawled before") {
        this.createPost("single", item.url);
      }
    },
    createPost(from, url, item) {
      return this.$api.Crawler_Post.createPost({
        payload: {
          url,
          dest_categories: this.cateIds.join(",")
        },
        onSuccess: res => {
          if (from === "single") {
            this.$alert("success", "Thành công");
          }
        },
        onError: err => {
          if (item) {
            this.handleFailItem(item);
          }
          if (from === "single") {
            this.$alert("error", "Thất bại");
          }
        }
      });
    },
    onImportLinkToInput(link) {
      this.urls.push(link);
    }
  },
  watch: {
    cateIds: {
      deep: true,
      handler(val) {
        console.log(val);
      }
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
.app-bar {
  background: var(--primary);
}
.app-name {
  font-size: 25px;
}
.submit-wrap {
  text-align: right;
}
.table {
  position: relative;
}
.close-btn {
  position: absolute;
  z-index: 1;
  right: 0px;
  top: 0px;
  background: pink;
  padding: 5px 10px;
  cursor: pointer;
}
.item-status {
  min-width: 150px;
}
</style>
