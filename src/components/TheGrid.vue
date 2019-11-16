<template>
  <div id="content" class="grid-container">
    <div
      class="scroll-border scroll-border-left"
      @wheel="onBorderWheel"
      @click="moveColumn('left')"
    ></div>
    <div
      class="scroll-border scroll-border-right"
      @wheel="onBorderWheel"
      @click="moveColumn('right')"
    ></div>
    <grid-item
      v-for="gridItem in gridItems"
      :key="'grid-item-' + gridItem.id"
      :item="gridItem"
      ref="gridItems"
      @moveRow="moveRow($event)"
      @moveColumn="moveColumn($event)"
      @moveColumnByX="moveColumnByX($event)"
      @moveRowByY="moveRowByY($event)"
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

    moveRowByY(event) {
      if (event.deltaY === 0) return false;

      const el = event.explicitOriginalTarget;
      const isTop = el.scrollTop === 0;
      const isDown = Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) <= 1;

      console.log('GridItem: moveRowByY');
      console.log('event.deltaY:', event.deltaY);
      console.log('isTop:', isTop);
      console.log('isDown:', isDown);

      if (isTop && event.deltaY < 0) {
        this.ensureMoveRow('up');
      }
      if (isDown && event.deltaY > 0) {
        this.ensureMoveRow('down');
      }

      return true;
    },
    ensureMoveRow(direction) {
      console.group('GridItem: ensureMoveRow', direction);
      console.log('this.moveRowEnsurer:', this.moveRowEnsurer);
      if (this.moveRowEnsurer != null) {
        if (this.moveRowEnsurer.direction === direction) {
          this.moveRow(direction);
        }
        this.moveRowEnsurer = null;
      } else {
        this.moveRowEnsurer = {
          direction,
          callback: setTimeout(() => {
            this.moveRowEnsurer = null;
          }, 200),
        };
      }
      console.groupEnd();
    },
    moveColumnByX(event) {
      console.group('TheGrid: moveColumnByX()', event);
      if (event.deltaX === 0) return false;

      // console.log('GridItem: moveColumnByX');
      console.log('event.deltaX:', event.deltaX);

      if (event.deltaX < 0) {
        this.moveColumn('left');
      }
      if (event.deltaX > 0) {
        this.moveColumn('right');
      }

      console.groupEnd();

      return true;
    },

    moveColumn(direction) {
      console.groupCollapsed('TheGrid: moveColumn:', direction);
      console.log('this.GridItems:', this.GridItems);
      console.log('this.gridItems.key:', this.gridItems.key);
      console.log('this:', this);

      const currentRow = this.currentRows[this.currentColumn - 1];
      const destinationColumn = this.currentColumn + (direction === 'left' ? -1 : 1);
      const destinationRow = this.currentRows[destinationColumn - 1];
      const destinationId = this.getGridItemId(destinationColumn, destinationRow);
      console.log("destination's coordinates:", destinationRow, destinationColumn);

      const destination = document.getElementById(destinationId);
      console.log('destination:', destination);

      if (destination != null) {
        this.$root.scrollAllowed = false;

        if (currentRow !== destinationRow) {
          console.log('Different rows. Switching & silent moving');
          this.switchItemsRows(this.currentColumn, currentRow, destinationRow);
          this.silentMoveRow(currentRow);
        }

        console.log('Scrolling!');
        destination.scrollIntoView({ behavior: 'smooth' });
        this.currentColumn = destinationColumn;

        setTimeout(() => {
          if (currentRow !== destinationRow) {
            this.switchBackItemsRows(this.current);
          }
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
    silentMoveRow(row) {
      console.log('silentMoveRow:', row);
      const destinationId = this.getGridItemId(this.currentColumn, row);
      const destination = document.getElementById(destinationId);
      if (destination == null) return;
      destination.scrollIntoView();
    },
    switchItemsRows(column, row1, row2) {
      console.log('switchItemsRows:', column, row1, row2);
      const item1 = this.getGridItemId(column, row1);
      const item2 = this.getGridItemId(column, row2);

      const el1 = document.getElementById(item1);
      const el2 = document.getElementById(item2);

      if (el1 != null) {
        el1.style.gridArea = `${row2} / ${column} / auto / auto`;
      }
      if (el2 != null) {
        el2.style.gridArea = `${row1} / ${column} / auto / auto`;
      }
    },
    switchBackItemsRows(column, row1, row2) {
      const item1 = this.getGridItemId(column, row1);
      const item2 = this.getGridItemId(column, row2);

      const el1 = document.getElementById(item1);
      const el2 = document.getElementById(item2);

      if (el1 != null) {
        el1.style.gridArea = `${row1} / ${column} / auto / auto`;
      }
      if (el2 != null) {
        el2.style.gridArea = `${row2} / ${column} / auto / auto`;
      }
    },

    onBorderWheel(event) {
      if (!this.$root.scrollAllowed) {
        event.preventDefault(); // Prevent scrolling using touchpad
        return false;
      }
      if (!this.moveColumnByY(event) || !this.moveColumnByX(event)) return false;

      return true;
    },
    moveColumnByY(event) {
      console.log('TheGrid: moveColumnByY');
      if (event.deltaY < 0) return this.moveColumn('left');
      if (event.deltaY > 0) return this.moveColumn('right');
      return true;
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

/******************
 * SCROLL BORDERS *
 ******************/

.scroll-border {
  position: fixed;
  top: 0;
  width: 50px;
  height: 100%;
  z-index: 5;
  box-sizing: border-box;
  cursor: e-resize;
}

.scroll-border-left {
  left: 0;
}

.scroll-border-left:hover {
  background-image: linear-gradient(to right, #d2f1fd1a, #0000);
}

.scroll-border-right {
  right: 0;
}

.scroll-border-right:hover {
  background-image: linear-gradient(to left, #d2f1fd1a, #0000);
}

</style>
