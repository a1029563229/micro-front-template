<template>
  <a-card title="Vue 公共状态页">
    <a-button type="primary" @click="dec"> - </a-button>
    <span style="margin: 20px;font-size: 24px; color: red;">count: {{count}}</span>
    <a-button type="primary" @click="add"> + </a-button>
  </a-card>
</template>
<script>

import { dispatch, subscribe, getState } from '../../../../store/plugin';

export default {
  name: "Status",

  data() {
    return {
      count: getState().count,
      unSubscribe: null
    }
  },

  methods: {
    add() {
      dispatch({ type: "INCREMENT" });
    },

    dec() {
      dispatch({ type: "DECREMENT" });
    }
  },

  created() {
    this.unSubscribe = subscribe(() => {
      this.count = getState().count;
    });
  },

  destroyed() {
    this.unSubscribe && this.unSubscribe();
  }
}
</script>