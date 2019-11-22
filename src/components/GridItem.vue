<template>
  <div
    :class="'grid-item ' + item.css"
    :id="'slide-' + item.slidePosition + '-row-' + item.position"
    :style="itemStyle"
    :row-id="item.id"
    ref="gridItem"
    @wheel="onWheel"
  >
    <div class="banner"></div>
    <draggable
      class="content column-container"
      :list="item.content"
      handle=".column-header"
      group="columns"
    >
      <column
        v-for="(column, index) in item.content"
        :key="'column-' + column.id"
        :column="column"
        :position="index"
        :nbColumns="item.content.length"
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
import axios from 'axios';
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
  mounted() {
    const el = this.$refs.gridItem;
    this.isTop = el.scrollTop === 0;
    this.isBottom = Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) <= 1;
    this.movePreventedSince = {};
    this.preventMoveCallback = {};
  },
  methods: {
    addColumn() {
      const path = 'http://localhost:5001/columns';
      const params = {
        parent_id: this.item.slideId,
        position: this.item.content.length,
      };

      axios.post(path, params)
        .then((res) => { this.item.content.push(res.data); })
        .catch(error => console.error(error));
    },
    removeColumn(columnToRemove) {
      const index = this.item.content.indexOf(columnToRemove);
      if (index > -1) {
        this.item.content.splice(index, 1);
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

      let direction;
      if (event.deltaX !== 0) {
        direction = (event.deltaX > 0) ? 'right' : 'left';
      } else {
        direction = (event.deltaY > 0) ? 'down' : 'up';
      }

      console.group(`GridItem: onWheel >${direction}<`, event.deltaX, event.deltaY);
      // console.log(event);

      if (event.deltaX !== 0) {
        this.$emit('moveColumnByX', event);
      } else if (event.deltaY !== 0) {
        this.moveRowByY(event);
      }

      console.groupEnd();

      return true;
    },
    preventMove(direction) {
      clearTimeout(this.preventMoveCallback[direction]);

      const preventedDuration = this.movePreventedSince[direction]
        ? Date.now() - this.movePreventedSince[direction]
        : 0;

      console.group('preventMove:', direction, preventedDuration);

      if (preventedDuration === 0) {
        this.movePreventedSince[direction] = Date.now();
      } else if (preventedDuration > 800) {
        console.log('duration > 800 => allow move');
        this.movePreventedSince[direction] = 0;
        return false;
      }

      console.log('prevent scrolling', direction);
      this.preventMoveCallback[direction] = setTimeout(() => {
        console.log('preventMove: reset', direction);
        this.preventMoveCallback[direction] = null;
        this.movePreventedSince[direction] = 0;
      }, 300);
      console.groupEnd();
      return true;
    },
    moveRowByY(event) {
      if (event.deltaY === 0) return false;

      const el = this.$refs.gridItem;
      const isTop = el.scrollTop === 0;
      const isBottom = Math.abs((el.scrollHeight - el.scrollTop) - el.clientHeight) <= 1;

      if (this.isTop !== isTop || (this.preventMoveCallback.up && event.deltaY < 0)) {
        this.isTop = isTop;
        if (isTop && this.preventMove('up')) return true;
      }
      if (this.isBottom !== isBottom || (this.preventMoveCallback.down && event.deltaY > 0)) {
        this.isBottom = isBottom;
        if (isBottom && this.preventMove('down')) return true;
      }

      if (isTop && event.deltaY < 0) {
        this.$emit('moveRow', 'up');
      } else if (isBottom && event.deltaY > 0) {
        this.$emit('moveRow', 'down');
      }

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

.add-column {
  opacity: 0;
  background-color: #45454580;
  text-align: center;
  font-weight: bold;
  line-height: 70px;
  color: #ccc;
  width: 400px;
  height: 75px;
  border-radius: 6px;
  transition: opacity .7s, background-color .7s;
}

.column-container:hover .add-column {
  opacity: 1;
}

.add-column:hover {
  cursor: pointer;
  background-color: #ffccfe36;
}

</style>
