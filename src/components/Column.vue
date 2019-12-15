<template>
  <div class="column" :column-id="column.id">
    <div class="column-header">
      <editable-title
        v-model="column.name"
        :itemId="column.id"
        :itemType="'column'"
        @removeBox="removeBox"
        @rename="onRename"
      ></editable-title>
      <div class="container-actions">
        <div
          class="action add-button"
          title="Add a new box"
          @click="addBox(column.id)"
        >+
        </div>
        <div
          class="action remove-button"
          title="Remove this column"
          @click="onRemoveColumn"
        >&times;
        </div>
      </div>
    </div>
    <draggable
      :list="column.content"
      group="boxes"
      @update="onBoxMoved"
      @add="onBoxAdded"
    >
      <box
        v-for="box in column.content"
        :key="'box-' + box.id"
        :box="box"
        @removeBox="removeBox"
      ></box>
    </draggable>
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
    onRename(name) {
      this.column.name = name;
    },
    onBoxMoved(event) {
      const boxId = event.item.attributes['box-id'].value;
      const path = `http://localhost:5001/boxes/${boxId}`;
      const data = { position: event.newIndex };

      return axios.patch(path, data)
        .catch((error) => { console.error(error); return false; });
    },
    onBoxAdded(event) {
      const boxId = event.item.attributes['box-id'].value;
      const path = `http://localhost:5001/boxes/${boxId}`;
      const data = {
        position: event.newIndex,
        parent_id: this.column.id,
      };

      return axios.patch(path, data)
        .catch((error) => { console.error(error); return false; });
    },
    addBox(columnId) {
      const path = 'http://localhost:5001/boxes';
      console.log('columnId:', columnId);
      const params = {
        parent_id: columnId,
        position: this.column.content.length,
      };

      axios.post(path, params)
        .then((res) => { console.log(res.data); this.column.content.push(res.data); })
        .catch(error => console.error(error));
    },
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
      const index = this.column.content.indexOf(boxToRemove);
      if (index > -1) {
        this.column.content.splice(index, 1);
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
  margin-bottom: 1.8rem;
  cursor: move;
}

.column-title {
  cursor: pointer;
}

.add-box {
  opacity: 0;
  background-color: #45454580;
  text-align: center;
  font-weight: bold;
  line-height: 70px;
  color: #ccc;
  width: 100%;
  height: 75px;
  border-radius: 6px;
  transition: opacity .7s, background-color .7s;

  &:hover {
    cursor: pointer;
    background-color: #ffccfe36;
  }

  .column:hover & {
    opacity: 1;
  }
}

</style>

<style lang="scss">

$transitionDuration: 0.7s;

.container-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: flex-start;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.3rem;
  margin-right: -40px;
  transition: margin-right $transitionDuration;

  & .action {
    cursor: pointer;
    margin-left: 3px;
    transition: color $transitionDuration;
    color: #fff7;

    &:hover {
      color: #fffd;
    }
  }

  .column-header:hover &,
  .box-header:hover & {
    margin-right: 10px;
  }

  & > .add-button {
    text-shadow: 0px 0px 3px black;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .remove-button {
    text-shadow: 0px 0px 3px black;
    font-weight: bold;
  }
}

</style>
