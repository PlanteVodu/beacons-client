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
import axios from 'axios';

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
      const type = (this.itemType === 'box') ? 'boxes' : `${this.itemType}s`;

      const url = `http://localhost:5001/${type}/${this.itemId}`;
      const data = {
        name: this.title,
      };

      console.log('url:', url);
      console.log('data:', data);

      axios.patch(url, data)
        .then((res) => {
          console.log(res.data);
          this.$emit('rename', res.data.name);
          this.oldTitle = this.title;
        })
        .catch(error => console.error(error));

      this.isInputVisible = false;
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
