<template>
  <section class="home-container">Home</section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>

<style lang="less" scoped>
.home-container {
  padding: 30px;
}
</style>
