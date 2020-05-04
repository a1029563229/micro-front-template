<template>
  <section class="communication-container">
    Communication
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Communication extends Vue {}
</script>

<style lang="less" scoped>
.communication-container {
  padding: 30px;
}
</style>
