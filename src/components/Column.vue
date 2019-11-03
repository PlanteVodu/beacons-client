<template>
  <div class="column" :column-id="column.id">
    <div class="column-header">
      <editable-title
        v-model="column.title"
        :itemId="column.id"
        :itemType="'column'"
      ></editable-title>
    </div>
    <draggable
      :list="column.boxes"
      group="boxes"
      @change="onBoxDropped"
    >
      <box
        v-for="box in column.boxes"
        :key="'box-' + box.id"
        :box="box"
      ></box>
    </draggable>
    <!-- <div
      class="add-box"
      @click="addBox"
      title="Add a new box"
    >+</div> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import box from './Box.vue';
import editableTitle from './EditableTitle.vue';

export default {
  name: 'Column',
  components: {
    draggable,
    box,
    editableTitle,
  },
  props: {
    column: { type: Object, required: true },
  },
  methods: {
    onBoxDropped() {},
    addBox() {},
  },
};
</script>

<style scoped lang="scss">

$primaryColor: #ccc;
$secondaryColor: rgb(223, 166, 18);

.column {
  width: 400px;
}

.column-header {
  color: $secondaryColor;
  position: relative;
  text-align: center;
  margin-bottom: 15px;
  cursor: move;
}

</style>
