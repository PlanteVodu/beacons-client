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

const WHEEL_TIMEOUT_DURATION = 800;

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
    getCurrentGridItemId() {
      const currentRow = this.currentRows[this.currentColumn - 1];
      return this.getGridItemId(this.currentColumn, currentRow);
    },
    initializeCurrentRows() {
      console.log('Initializing currentRows');
      this.currentRows = Array(this.gridItems[this.gridItems.length - 1].slidePosition).fill(1);
      console.log('this.currentRows:', this.currentRows);
    },

    scrollTo(destinationId, onDone) {
      console.log('scrollTo:', destinationId);
      if (this.cancelScroll) console.log('this.cancelScroll:', this.cancelScroll);

      const destination = document.getElementById(destinationId);

      if (this.cancelScroll != null) {
        if (destination === this.destination) {
          console.log('same destination!');
          return;
        }
        console.log('cancelScroll()');
        this.cancelScroll();
      }

      this.destination = destination;

      const duration = WHEEL_TIMEOUT_DURATION;

      const options = {
        easing: 'ease-in-out',
        force: true,
        // cancelable: false,
        onStart: () => {
          console.log('start scrolling');
        },
        onDone: () => {
          console.log('scrolling done');
          this.cancelScroll = null;
          onDone();
        },
        onCancel: (ev) => {
          // console.log('onCancel!');
          // console.log('ev:', ev);
          // console.log('el:', el);
          if (ev.type === 'DOMMouseScroll' || ev.type === 'wheel') return false;
          if (ev.type === 'mousedown') {
            // If we go to the tip, don't cancel
            if (ev.explicitOriginalTarget.classList.contains('scroll-border-left')
              && this.currentColumn === 1) return false;
            if (ev.explicitOriginalTarget.classList.contains('scroll-border-right')
              && this.currentColumn === 5) return false;
          }
          console.log('scrolling cancelled');
          this.scrollAllowed = true;
          this.cancelScroll = null;
          // this.destination = null;
          return true;
        },
        x: true,
        y: true,
      };

      // this.cancelScroll = VueScrollTo.scrollTo(destinationId, duration, options);

      // or alternatively inside your components you can use
      // this.cancelScroll =
      this.cancelScroll = this.$scrollTo(`#${destinationId}`, duration, options);

      // to cancel scrolling you can call the returned function
      // cancelScroll();
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
      console.group('TheGrid: moveColumn:', direction);

      const currentRow = this.currentRows[this.currentColumn - 1];
      const destinationColumn = this.currentColumn + (direction === 'left' ? -1 : 1);
      const destinationRow = this.currentRows[destinationColumn - 1];

      const destinationId = this.getGridItemId(destinationColumn, destinationRow);
      console.log("destination's coordinates:", destinationRow, destinationColumn);
      const destination = document.getElementById(destinationId);
      console.log('destination:', destination);

      if (destination != null) {
        this.$root.scrollAllowed = false;

        if (currentRow !== 1) {
          console.log('Not on first row. Switching with first row item.');
          this.switchItemsRows(this.currentColumn, 1, currentRow);
        }

        console.log('Scrolling!');
        const onDone = () => {
          console.log('TheGrid: Reactivate wheel');
          const newCurrentRow = this.currentRows[this.currentColumn - 1];
          if (newCurrentRow !== 1) {
            console.log('Switching back with first row item.');
            // Note that values inside 'this' have changed when the callback is called
            this.switchBackItemsRows(this.currentColumn, 1, newCurrentRow);
          }
          this.$root.scrollAllowed = true;
        };

        this.currentColumn = destinationColumn;
        this.scrollTo(destinationId, onDone);
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
        const onDone = () => {
          console.log('TheGrid: Reactivate wheel');
          this.$root.scrollAllowed = true;
        };
        this.currentRows[this.currentColumn - 1] = destinationRow;
        this.scrollTo(destinationId, onDone);
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
      console.log('switchBackItemsRows:', column, row1, row2);
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
