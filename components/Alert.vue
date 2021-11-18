<template>
  <v-alert
    transition="scroll-x-reverse-transition"
    class="custom-alert"
    v-if="alert.message"
    :type="alert.type"
  >{{ alert.message }}</v-alert>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["alert"])
  }
};
</script>

<style>
.custom-alert {
  position: absolute !important;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  top: 20px;
  z-index: 999;
}
</style>