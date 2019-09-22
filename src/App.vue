<template>
  <div id="app">
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
  },
  created() {
    this.getBeacons();
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
