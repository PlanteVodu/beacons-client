<template>
  <div id="content" class="grid-container">
    <grid-item
      v-for="gridItem in gridItems"
      :key="'grid-item-' + gridItem.id"
      :item="gridItem"
      ref="gridItems"
      @moveRow="moveRow($event)"
      @moveColumn="moveColumn($event)"
    ></grid-item>
  </div>
</template>

<script>
import GridItem from './GridItem.vue';

const WHEEL_TIMEOUT_DURATION = 600;

export default {
  name: 'TheGrid',
  components: {
    GridItem,
  },
  props: {
    gridItems: { type: Array, required: true },
  },
  data() {
    return {
      currentColumn: 1,
      currentRows: [],
    };
  },
  beforeUpdate() {
    if (this.currentRows.length === 0) {
      console.groupCollapsed('TheGrid: beforeUpdate()');
      this.initializeCurrentRows();
      console.groupEnd();
    }
  },
  mounted() {
    this.$root.scrollAllowed = true;
  },
  methods: {
    getGridItemId(column, row) {
      return `slide-${column}-row-${row}`;
    },
    initializeCurrentRows() {
      console.log('Initializing currentRows');
      this.currentRows = Array(this.gridItems[this.gridItems.length - 1].slidePosition).fill(1);
      console.log('this.currentRows:', this.currentRows);
    },
    moveColumn(direction) {
      if (!this.$root.scrollAllowed) return false;

      console.groupCollapsed('TheGrid: moveColumn:', direction);
      console.log('this.$children[0].key:', this.$children[0].key);
      console.log('this:', this);

      const destinationColumn = this.currentColumn + (direction === 'left' ? -1 : 1);
      const destinationRow = this.currentRows[destinationColumn - 1];
      const destinationId = this.getGridItemId(destinationColumn, destinationRow);
      console.log("destination's coordinates:", destinationRow, destinationColumn);

      const destination = document.getElementById(destinationId);
      console.log('destination:', destination);

      if (destination != null) {
        this.$root.scrollAllowed = false;

        console.log('Scrolling!');
        destination.scrollIntoView({ behavior: 'smooth' });
        this.currentColumn = destinationColumn;

        setTimeout(() => {
          console.log('TheGrid: Reactivate wheel');
          this.$root.scrollAllowed = true;
        }, WHEEL_TIMEOUT_DURATION);
      }

      console.groupEnd();

      return false;
    },
    moveRow(direction) {
      console.log('moveRow:', direction);

      const currentRow = this.currentRows[this.currentColumn - 1];
      const destinationRow = currentRow + (direction === 'up' ? -1 : 1);
      const destinationId = this.getGridItemId(this.currentColumn, destinationRow);
      const destination = document.getElementById(destinationId);

      if (destination != null) {
        this.$root.scrollAllowed = false;
        destination.scrollIntoView({ behavior: 'smooth' });
        this.currentRows[this.currentColumn - 1] = destinationRow;
        setTimeout(() => {
          console.log('TheGrid: Reactivate wheel');
          this.$root.scrollAllowed = true;
        }, WHEEL_TIMEOUT_DURATION);
      }
    },
  },
};
</script>

<style scoped lang="scss">

.grid-container {
  display: grid;
  height: 100%;
  color: #fff;
}

</style>
