<template>
  <div class="box" ref="boX" :box-id="box.id">
    <div class="box-header" @click.self="toggle">
      <editable-title
        v-model="box.title"
        :itemId="box.id"
        :itemType="'box'"
      ></editable-title>
      <div
        class="remove-button"
        title="Remove this box"
        @click="onRemoveBox"
      >&times;</div>
    </div>
      <!-- :style="{maxHeight: bookmarksMaxHeight}" -->
    <draggable
      class="box-bookmarks"
      ref="boxBookmarks"
      :list="box.bookmarks"
      group="bookmark"
      @change="onBookmarkDropped"
    >
      <bookmark
        v-for="bookmark in box.bookmarks"
        :key="'bookmark-' + bookmark.id"
        :bookmark="bookmark"
      ></bookmark>
    </draggable>
    <div class="new-bookmark-section">
      <div
        v-if="!newBookmarkInputDisplayed"
        class="new-bookmark-icon"
        title="Add a new bookmark"
        @click="displayNewBookmark"
      >
        +
      </div>
      <input
        v-if="newBookmarkInputDisplayed"
        ref="newBookmarkInput"
        class="new-bookmark-input"
        name="title"
        placeholder="Titre"
        @keyup.enter="submitNewBookmark"
      >
      <div
        v-if="newBookmarkInputDisplayed"
        class="close"
        aria-hidden="true"
        @click="hideNewBookmark"
      >
        &times;
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import bookmark from './Bookmark.vue';
import editableTitle from './EditableTitle.vue';

export default {
  name: 'Box',
  components: {
    draggable,
    bookmark,
    editableTitle,
  },
  props: {
    box: Object,
  },
  data() {
    return {
      newBookmarkInputDisplayed: false,
      newBookmark: {},
    };
  },
  computed: {
    bookmarksMaxHeight() {
      console.log('computed!');
      return `${26 * this.box.bookmarks.length}px`;
      // // if (!Object.prototype.hasOwnProperty.call(this.$refs, 'boX')) return 0;
      // return this.$refs.boX.$el.classList.contains('box-reduced') ? 0
      //   : ;
    },
  },
  watch: {
    boxReduced(isBoxReduced) {
      console.log('watch "boxReduced": ', isBoxReduced);
      this.$refs.boxBookmarks.$el.style.maxHeight = isBoxReduced ? 0
        : this.bookmarksMaxHeight();
    },
  },
  mounted() {
    this.boxReduced = false;
    // console.log(this.$refs.boxBookmarks.$el.style);
    // this.$refs.boxBookmarks.$el.style.maxHeight = this.bookmarksMaxHeight;
  },
  // beforeUpdate() {
  //   this.$refs.boxBookmarks.$el.style.maxHeight = this.bookmarksMaxHeight;
  // },
  methods: {
    toggle(event) {
      if (event.detail > 1) return;
      this.boxReduced = !this.boxReduced;
      this.$el.classList.toggle('box-reduced');
    },
    onRemoveBox() {
      // eslint-disable-next-line
      if (window.confirm('Remove this box ?')) {
        const box = {
          objType: 'box',
          objId: this.box.id,
        };

        axios
          .delete('http://localhost:5000/rmobj', { params: box })
          .then(() => {
            console.log('Success: Box has been removed from data base!');
            this.$emit('removeBox', this.box);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    displayNewBookmark() {
      this.newBookmarkInputDisplayed = true;
      this.$nextTick(() => {
        this.$refs.newBookmarkInput.focus();
      });
    },
    hideNewBookmark() {
      this.newBookmarkInputDisplayed = false;
      this.newBookmark = {};
    },
    submitNewBookmark(event) {
      const et = event.target;

      this.newBookmark[et.name] = et.value.replace('"', '\\"');

      if (et.name === 'title') {
        et.name = 'url';
        et.placeholder = 'URL';
        et.value = '';
      } else if (et.name === 'url') {
        this.addBookmark();
      }
    },
    addBookmark() {
      console.log('Adding bookmark:', this.newBookmark);
      console.log('this.box:', this.box);

      // let parameters = this.newBookmark;
      // parameters.boxId = this.box.id;

      // $.get("/addbm", parameters, (data, status) => {
      //   const newBookmark = JSON.parse(data);
      //   console.log("newBookmark:", newBookmark);
      //   console.log("this.box:", this.box);
      //   this.box.bookmarks.push(newBookmark);
      //   this.$refs.newBookmarkInput.value = '';
      //   this.hideNewBookmark();
      // });
    },
    onBookmarkDropped(event) {
      console.log(event);
      if (Object.prototype.hasOwnProperty.call(event, 'moved')) {
        console.log('Move!!');
        console.log('event.moved.newIndex:', event.moved.newIndex);

        // const parameters = {
        //   bookmarkId: event.moved.element.id,
        //   newOrder: event.moved.newIndex,
        // };

        // $.get('/movebm', parameters, () => {
        //   console.log('Moved!!');
        // });
      } else if (Object.prototype.hasOwnProperty.call(event, 'added')) {
        console.log('Add in', this.box.id);
        console.log('event.added.element.id:', event.added.element.id);

        // const parameters = {
        //   bookmark_id: event.added.element.id,
        //   box_id: this.box.id,
        //   order: event.added.newIndex,
        // };

        // $.get('/movebmbox', parameters, () => {
        //   console.log('Added!!');
        // });
      }
    },
  },
};
</script>

<style scoped lang="scss">

$primaryColor: #ccc;
$secondaryColor: rgb(223, 166, 18);
$transitionDuration: .7s;
$borderRadius: 3px;

/* GENERAL BOX */

.box {
  background-color: #363636;
  vertical-align: middle;
  margin-bottom: 54px;
  border-radius: $borderRadius;
  transition: margin-bottom $transitionDuration .2s,
              background-color $transitionDuration;

  &:not(.box-reduced):hover {
    margin-bottom: 27px;
  }

  .box-bookmarks {
    overflow: hidden;
    // max-height: 100px;
    transition: max-height $transitionDuration;
  }
}

.box-reduced {
  margin-bottom: 27px;
  transition: margin-bottom 0;
  background-color: #999;

  .box-bookmarks {
    // max-height: 0;
    transition: max-height $transitionDuration;
  }
}

/* BOX HEADER */

.box-header {
  font-family: 'Tahoma';
  font-size: 0.9em;
  padding: 4px 8px;
  margin: 0 0 3px 0;
  overflow: hidden;
  position: relative;
  vertical-align: bottom;
  text-align: center;
  color: $primaryColor;
  transition: color $transitionDuration ease;
  cursor: pointer;
  position: relative;

  &:hover {
    color: #fff !important;
  }
}

.box-title {
  display: inline-block;
  cursor: text;
  transition: color $transitionDuration;

  // &:hover {
  //   color: #fff;
  // }
}

/* NEW BOOKMARK ICON */

:not(.box-reduced).box:hover .new-bookmark-icon {
  height: 27px;
}

/* NEW BOOKMARK SECTION */

.new-bookmark-section {
  display: flex;
  width: 100%;
  height: 0;
  align-items: center;
  text-align: center;
  color: #555;
  font-weight: bold;
  overflow: hidden;
  // border-top: 1px solid #222;
  border-bottom-right-radius: $borderRadius;
  border-bottom-left-radius: $borderRadius;
  transition: height $transitionDuration .2s,
              background-color $transitionDuration;
  // background-color: #fff4;
}

.box:hover .new-bookmark-section {
  height: 27px;
}

.new-bookmark-icon {
  text-align: center;
  color: #aaa;
  font-weight: bold;
  overflow: hidden;
  width: 100%;
  background-color: #0000;
  border-bottom-left-radius: $borderRadius;
  border-bottom-right-radius: $borderRadius;
  transition: background-color $transitionDuration,
              height $transitionDuration .3s;
  cursor: pointer;

  &:hover {
    background-color: #6666;
    transition: background-color $transitionDuration;
  }
}

.new-bookmark-input {
  flex: 10;
  height: 100%;
  border-width: 0;
  padding-left: .7em;
  padding-right: .5em;
  color: #222;
  border-right: 1px solid #222;
  transition: box-shadow .5s;

  &:hover, &:focus {
    box-shadow: 0 0 4px 1px #0004 inset;
  }
}

.new-bookmark-section .close {
  flex: 1;
  height: 100%;
  font-size: 1.1em;
  font-weight: 700;
  color: hsla(0, 70%, 45%, 1);
  transition: background-color $transitionDuration,
              color $transitionDuration;
  cursor: pointer;

  &:hover {
    color: hsla(0, 90%, 40%, 1);
    background-color: hsla(0, 70%, 45%, .4);
  }
}

</style>
