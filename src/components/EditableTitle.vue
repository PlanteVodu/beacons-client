<template>
  <div class="editable-title">
    <input
      v-if="isInputVisible"
      :class="itemType + '-title-input'"
      ref="input"
      :value="title"
      @input="$emit('input', $event.target.value)"
      @blur="updateTitle"
      @keyup.enter="updateTitle"
      @keyup.escape="cancel"
    >
    <div
      v-else
      :class="itemType + '-title'"
      @click="showInput"
    >
      {{ title || '(Untitled)' }}
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'title',
  },
  props: {
    title: { type: String, required: false },
    itemId: { type: Number, required: true },
    itemType: { type: String, required: true },
  },
  data() {
    return {
      oldTitle: null,
      isInputVisible: false,
    };
  },
  created() {
    this.oldTitle = this.title;
  },
  methods: {
    showInput() {
      this.isInputVisible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    updateTitle() {
      // const parameters = {
      //  id: this.itemId,
      //  title: this.title,
      //  type: this.itemType
      // };

      // $.get('/rename', parameters, (data, status) => {
      this.isInputVisible = false;
      //  this.oldTitle = this.title;
      // });
    },
    cancel() {
      this.$emit('input', this.oldTitle);
      this.isInputVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">

.editable-title {
  display: inline-block;

  input {
    text-align: center;
  }
}

</style>
