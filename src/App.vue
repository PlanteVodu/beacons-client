<template>
  <div id="app">
    <div class="scroll-border scroll-border-left"></div>
    <div class="scroll-border scroll-border-right"></div>
    <the-grid :gridItems="beacons" />
  </div>
</template>

<script>
import axios from 'axios';
import TheGrid from './components/TheGrid.vue';

export default {
  name: 'app',
  components: {
    TheGrid,
  },
  data() {
    return {
      beacons: [],
      nbColumns: 0,
      nbRows: 0,
    };
  },
  methods: {
    getBeacons() {
      const path = 'http://localhost:5000/beacons';
      axios.get(path)
        .then((res) => {
          console.log('res.data:', res.data);
          this.beacons = res.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getItemId(column, row) {
      return `#slide-${column}-row-${row}`;
    },
  },
  created() {
    this.getBeacons();
  },
  mounted() {
    window.scrollTo(0, 0);
  },
};
</script>

<style lang="scss">

* {
  box-sizing: border-box;
}

body {
  background-color: #222;
  font-family: 'Tahoma';
  font-size: 1.1em;
  // scroll-behavior: smooth;
  overflow: hidden;
  margin: 0;
}

#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
  text-decoration: none;
}

/******************
 * SCROLL BORDERS *
 ******************/

.scroll-border {
  position: absolute;
  top: 0;
  width: 50px;
  height: 100%;
  z-index: 5;
  box-sizing: border-box;
  cursor: e-resize;
}

.scroll-border-left {
  left: 0;
}

.scroll-border-left:hover {
  background-image: linear-gradient(to right, #d2f1fd1a, #0000);
}

.scroll-border-right {
  right: 0;
}

.scroll-border-right:hover {
  background-image: linear-gradient(to left, #d2f1fd1a, #0000);
}

</style>
