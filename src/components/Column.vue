<template>
  <div class="column" :column-id="column.id">
    <div class="column-header">
      <editable-title
        v-model="column.title"
        :itemId="column.id"
        :itemType="'column'"
        @removeBox="removeBox"
      ></editable-title>
      <div
        class="remove-column-button"
        title="Remove this column"
        @click="onRemoveColumn"
      >&times;
      </div>
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
    >+</div>-->
  </div>
</template>

<script>
import axios from 'axios';
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
    onRemoveColumn() {
      // eslint-disable-next-line
      if (window.confirm('Remove this column ?')) {
        const column = {
          objType: 'column',
          objId: this.column.id,
        };

        axios
          .delete('http://localhost:5000/rmobj', { params: column })
          .then(() => {
            console.log('Success: Column has been removed from data base!');
            this.$emit('removeColumn', this.column);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    removeBox(boxToRemove) {
      const index = this.item.boxes.indexOf(boxToRemove);
      if (index > -1) {
        this.item.boxes.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped lang="scss">

$primaryColor: #ccc;
$secondaryColor: rgb(223, 166, 18);
$transitionDuration: 0.7s;

.column {
  width: 400px;
  overflow: hidden;
}

.column-header {
  color: $secondaryColor;
  position: relative;
  text-align: center;
  margin-bottom: 15px;
  cursor: move;
}

.column-title {
  cursor: pointer;
}

.remove-column-button {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.3rem;
  color: hsla(0, 70%, 45%, 1);
  text-shadow: 0px 0px 3px black;
  font-weight: bold;
  cursor: pointer;
  margin-right: -20px;
  transition: margin-right $transitionDuration;

  .column-header:hover & {
    margin-right: 10px;
  }
}

</style>
