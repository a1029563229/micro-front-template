<template>
  <section>
    <a-card title="Vue 微应用列表页">
      <!-- <a-table rowKey="_id" :dataSource="data" :pagination="pageInfo">
        <a-table-column title="菜名" dataIndex="name" />
        <a-table-column title="价格" dataIndex="price" :customRender="(text) => `￥ ${text}`" />
      </a-table> -->
      <h2 class="old-title">曾经充满数据的一个列表（因服务器到期，此处数据已丢失）</h2>
    </a-card>
  </section>
</template>

<script>
import fetch from "isomorphic-fetch";

export default {
  name: "List",

  data() {
    return {
      data: [],
      pageInfo: {
        onChange: page => this.fetchVegetable(page, 10)
      },
    }
  },
  
  methods: {
    async fetchVegetable (page, pageSize) {
      const result = await fetch("http://dev-api.jt-gmall.com/mall", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // graphql 的查询风格
        body: JSON.stringify({ query: `{ vegetableList (page: ${page}, pageSize: ${pageSize}) { page, pageSize, total, items { _id, name, poster, price } } }` })
      }).then(res => res.json());
      const { vegetableList } = result.data;
      this.data = vegetableList.items;
      this.pageInfo = {
        current: vegetableList.page,
        pageSize: vegetableList.pageSize,
        total: vegetableList.total,
        onChange: page => this.fetchVegetable(page, 10)
      };
    }
  },

  created() {
    // this.fetchVegetable(1, 10);
  }
}
</script>

<style lang="less" scoped>
.old-title {
  font-size: 26px;
  color: #fb4487;
}
</style>
