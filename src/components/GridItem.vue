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
const MIN_WHEEL_DELTA_X = isChrome ? 20 : 1;
const MIN_WHEEL_DELTA_Y = isChrome ? 40 : 2;

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
      wheelDelta: {
        deltaX: 0,
        deltaY: 0,
      },
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
    reinitializeWheelDelta() {
      console.log('Reinitialize wheelDelta');
      this.wheelDelta = {
        deltaX: 0,
        deltaY: 0,
        n: 0,
      };
    },
    onWheel(event) {
      if (!this.$root.scrollAllowed) {
        event.preventDefault(); // Prevent scrolling using touchpad
        return false;
      }

      // const wheelDeltaExists = this.wheelDelta != null;
      let callback = null;

      // Prevent wheel events for the next 100 ms
      if (this.wheelDelta.deltaX === 0 && this.wheelDelta.deltaY === 0) {
        callback = setTimeout(() => this.reinitializeWheelDelta(), 100);
      }

      this.wheelDelta.deltaX += event.deltaX;
      this.wheelDelta.deltaY += event.deltaY;
      this.wheelDelta.n += 1;

      // if (wheelDeltaExists) return false;

      console.log(this.wheelDelta.deltaX, this.wheelDelta.deltaY);

      if (this.wheelDelta.n > 3 || (Math.abs(this.wheelDelta.deltaX) < MIN_WHEEL_DELTA_X
          && Math.abs(this.wheelDelta.deltaY) < MIN_WHEEL_DELTA_Y)) {
        clearTimeout(callback);
        this.reinitializeWheelDelta();
        return false;
      }

      console.groupCollapsed('GridItem: onWheel()', this.$root.scrollAllowed, event.deltaX, event.deltaY);
      console.log(event);
      const allowScrolling = this.moveRowByY(this.wheelDelta)
                             || this.moveColumnByX(this.wheelDelta);
      clearTimeout(callback);
      this.reinitializeWheelDelta();
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

      if (isTop && event.deltaY < -MIN_WHEEL_DELTA_Y) {
        this.ensureMoveRow('up');
      }
      if (isDown && event.deltaY > MIN_WHEEL_DELTA_Y) {
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

      if (event.deltaX < -MIN_WHEEL_DELTA_X) {
        this.$emit('moveColumn', 'left');
      }
      if (event.deltaX > MIN_WHEEL_DELTA_X) {
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
