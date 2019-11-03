<template>
  <div
    :class="'grid-item ' + item.css"
    :id="'slide-' + item.slidePosition + '-row-' + item.position"
    :style="itemStyle"
    :row-id="item.id"
    @wheel="onWheel"
  >
    <div class="banner"></div>
    <draggable
      class="content column-container"
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

// Detect Chrome : https://stackoverflow.com/a/9851769
const isChrome = navigator.userAgent.indexOf('Chrome') !== -1;

// Adapt the minimal wheel delta as it changes drastically depending on the browser
const MIN_WHEEL_DELTA = isChrome ? 10 : 1;

export default {
  name: 'GridItem',
  components: {
    draggable,
    column,
  },
  props: {
    item: { type: Object, required: true },
  },
  data() {
    return {
      moveRowEnsurer: null,
      wheelThrottle: null,
    };
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
    onWheel(event) {
      if (this.wheelThrottle != null) return false;
      // Prevent wheel events for the next 100 ms
      this.wheelThrottle = setTimeout(() => { this.wheelThrottle = null; }, 100);

      if (!this.$root.scrollActivated) {
        event.preventDefault(); // Prevent scrolling using touchpad
        return false;
      }

      console.groupCollapsed('GridItem: onWheel()', this.$root.scrollActivated, event);
      const allowScrolling = this.moveRowByY(event) || this.moveColumnByX(event);
      console.groupEnd();

      if (!allowScrolling) {
        event.preventDefault(); // Prevent scrolling using touchpad
        return false;
      }

      return true;
    },
    moveRowByY(event) {
      if (event.deltaY === 0) return false;

      const el = this.$el;
      const isTop = el.scrollTop === 0;
      const isDown = Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) <= 1;

      console.log('GridItem: moveRowByY');
      console.log('event.deltaY:', event.deltaY);
      console.log('isTop:', isTop);
      console.log('isDown:', isDown);

      if (isTop && event.deltaY < -MIN_WHEEL_DELTA) {
        this.ensureMoveRow('up');
      }
      if (isDown && event.deltaY > MIN_WHEEL_DELTA) {
        this.ensureMoveRow('down');
      }

      return true;
    },
    ensureMoveRow(direction) {
      console.group('GridItem: ensureMoveRow', direction);
      console.log('this.moveRowEnsurer:', this.moveRowEnsurer);
      if (this.moveRowEnsurer != null) {
        if (this.moveRowEnsurer.direction === direction) {
          this.$emit('moveRow', direction);
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
      if (event.deltaX === 0) return false;

      console.log('GridItem: moveColumnByX');
      console.log('event.deltaX:', event.deltaX);

      if (event.deltaX < -MIN_WHEEL_DELTA) {
        this.$emit('moveColumn', 'left');
      }
      if (event.deltaX > MIN_WHEEL_DELTA) {
        this.$emit('moveColumn', 'right');
      }

      return true;
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
