import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  list = [];

  constructor() {}

  async fetchVegetable(page, pageSize) {
    const result = await fetch('http://dev-api.jt-gmall.com/mall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // graphql 的查询风格
      body: JSON.stringify({
        query: `{ vegetableList (page: ${page}, pageSize: ${pageSize}) { page, pageSize, total, items { _id, name, poster, price } } }`,
      }),
    }).then((res) => res.json());
    const { vegetableList } = result.data;
    this.list = vegetableList.items;
  }

  ngOnInit(): void {
    // this.fetchVegetable(1, 999);
  }
}
