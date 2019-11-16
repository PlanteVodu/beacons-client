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
        @removeColumn="removeColumn"
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
    removeColumn(columnToRemove) {
      const index = this.item.columns.indexOf(columnToRemove);
      if (index > -1) {
        this.item.columns.splice(index, 1);
      }
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
        console.log('Clear timeout & reinitialize');
        clearTimeout(callback);
        this.reinitializeWheelDelta();
        return false;
      }

      console.group('GridItem: onWheel()', this.$root.scrollAllowed, event.deltaX, event.deltaY);
      console.log(event);

      if (event.deltaX !== 0) {
        this.$emit('moveColumnByX', event);
      } else {
        this.$emit('moveRowByY', event);
      }

      clearTimeout(callback);
      this.reinitializeWheelDelta();
      console.groupEnd();

      return true;
    },
  },
};
</script>

<style scoped lang="scss">

@import '~@/assets/css/themes/cuisine.css';
@import '~@/assets/css/themes/dev.css';
@import '~@/assets/css/themes/general.css';
@import '~@/assets/css/themes/jardin.css';
@import '~@/assets/css/themes/unreachable-gates.css';

.grid-item {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 2rem 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: #fffb #fff3;
  scrollbar-width: thin;
}

.column-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: top;
  align-content: flex-start;
  gap: 5rem;
}

</style>
