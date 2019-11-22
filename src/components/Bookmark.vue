<template>
  <a
    class="bookmark"
    :href="bookmark.url"
    :bookmark-id="bookmark.id"
    target="_blank"
  >
    <img :src="bookmark.icon">
    <div class="title"> {{ bookmark.name }} </div>
  </a>
</template>

<script>
export default {
  name: 'Bookmark',
  props: {
    bookmark: { type: Object, required: true },
  },
};
</script>

<style scoped lang="scss">

$primaryColor: #aaa;
$secondaryColor: rgb(223, 166, 18);
$transitionDuration: .7s;

.bookmark {
  display: flex;
  font-size: 0.813em;
  color: $primaryColor;
  padding: 5px 8px 5px 10px;
  overflow: hidden;
  vertical-align: middle;
  transition: color $transitionDuration;

  img {
    width: 16px;
    height: 16px;
    margin-right: 12px;
  }

  .title {
    position: relative;
    line-height: 1em;
  }

  .title:before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    opacity: .8;
    background-color: $primaryColor;
    transform-origin: bottom right;
    transform: scaleX(0);
    transition: transform $transitionDuration ease,
                background-color $transitionDuration ease;
  }
}

.bookmark:hover {
  color: $secondaryColor;

  .title::before {
    transform-origin: bottom left;
    transform: scaleX(1);
    background-color: $secondaryColor;
  }
}

</style>
