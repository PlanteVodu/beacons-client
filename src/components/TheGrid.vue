<template>
  <div id="content" class="grid-container">
    <grid-item
      v-for="gridItem in gridItems"
      :key="'grid-item-' + gridItem.id"
      :item="gridItem"
    ></grid-item>
  </div>
</template>

<script>
import GridItem from './GridItem.vue';

export default {
  name: 'TheGrid',
  components: {
    GridItem,
  },
  props: {
    gridItems: { type: Array, required: true },
  },
};
</script>

<style scoped lang="scss">

.grid-container {
  display: grid;
  height: 100%;
  overflow: auto;
  scrollbar-width: none;
  scroll-behavior: smooth;
  color: #fff;
}

</style>
