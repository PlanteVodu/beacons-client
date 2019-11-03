<template>
  <div
    :class="'grid-item ' + item.css"
    :id="'slide-' + item.slidePosition + '-row-' + item.position"
    :style="itemStyle"
    :row-id="item.id"
  >
    <div class="banner"></div>
    <draggable
      class="content"
      :list="item.columns"
      handle=".column-header"
      group="columns"
    >
      <column
        v-for="(column, index) in item.columns"
        :key="'column-' + column.id"
        :column="column"
        :position="index"
        :nbColumns="item.columns.length"
      ></column>
      <!-- <div
        class="add-column"
        slot="footer"
        title="Add a new column"
        @click="addColumn"
      >+</div> -->
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import column from './Column.vue';

export default {
  name: 'GridItem',
  components: {
    draggable,
    column,
  },
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    itemStyle() {
      return `grid-row: ${this.item.position}; grid-column: ${this.item.slidePosition}`;
    },
  },
  methods: {
    addColumn() {
      // let parameters = {
      // rowId: this.item.id
      // };

      // $.get('addcolumn', parameters, (data, status) => {
      //   const column = JSON.parse(data);
      //   this.item.columns.push(column);
      // });
    },
  },
};
</script>

<style scoped lang="scss">

.grid-item {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: #fffb #fff3;
  scrollbar-width: thin;
}

.column-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: top;
  align-content: flex-start;
}

</style>
