<template>
  <div class="column" :column-id="column.id">
    <div class="column-header">
      <editable-title
        v-model="column.name"
        :itemId="column.id"
        :itemType="'column'"
        @removeBox="removeBox"
      ></editable-title>
      <div
        class="remove-button"
        title="Remove this column"
        @click="onRemoveColumn"
      >&times;
      </div>
    </div>
    <draggable
      :list="column.content"
      group="boxes"
      @change="onBoxDropped"
    >
      <box
        v-for="box in column.content"
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
          .delete('http://localhost:5001/rmobj', { params: column })
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
$secondaryColor: #ddd;
$transitionDuration: 0.7s;

.column {
  width: 27rem;
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

</style>

<style lang="scss">

$transitionDuration: 0.7s;

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.3rem;
  color: hsla(0, 70%, 45%, 1);
  text-shadow: 0px 0px 3px black;
  font-weight: bold;
  cursor: pointer;
  margin-right: -20px;
  transition: margin-right $transitionDuration, color $transitionDuration;

  .column-header:hover &,
  .box-header:hover & {
    margin-right: 10px;
  }

  &:hover {
    color:hsla(0, 100%, 55%, 1);
  }
}

</style>
