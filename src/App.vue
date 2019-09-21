<template>
  <div id="app">
    <the-grid :gridItems="gridItems" />
  </div>
</template>

<script>
import TheGrid from './components/TheGrid.vue';

export default {
  name: 'app',
  components: {
    TheGrid,
  },
  data() {
    return {
      gridItems: [
        {
          id: 1,
          title: 'Slide 1 Row 1',
          row: 1,
          column: 1,
          columns: [
            {
              id: 1,
              title: 'Column 1',
              boxes: [
                {
                  id: 1,
                  title: 'Box 1',
                  bookmarks: [
                    {
                      id: 1,
                      title: 'Style guide',
                      url: 'https://vuejs.org/v2/style-guide/',
                      icon: 'https://vuejs.org/images/icons/favicon-16x16.png',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss">

* {
  box-sizing: border-box;
}

#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
  text-decoration: none;
}

body {
  background-color: #222;
  font-family: 'Tahoma';
  font-size: 1.1em;
}

</style>
