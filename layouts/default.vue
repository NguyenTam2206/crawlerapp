<template>
  <v-app>
    <div class="app-bar">
      <v-container>
        <div class="app-name">Crawler App</div>
      </v-container>
    </div>
    <v-container>
      <Alert />
      <nuxt />
    </v-container>
  </v-app>
</template>

<script>
import Alert from "@/components/Alert";
export default {
  components: {
    Alert
  }
};
</script>
<style scoped>
.app-bar {
  background: var(--primary);
}
.app-name {
  font-size: 25px;
}
</style>
