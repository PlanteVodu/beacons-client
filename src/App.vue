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
      beaconsLastModification: 0,
      nbColumns: 0,
      nbRows: 0,
    };
  },
  methods: {
    getBeacons() {
      const path = 'http://localhost:5001/beacons';
      axios.get(path, { params: { transform: true } })
        .then((res) => { this.beacons = res.data; })
        .catch(error => console.error(error));
    },
    refreshBeacons() {
      axios.get('http://localhost:5001/beacons/lastmodification')
        .then((res) => {
          if (res.data > this.beaconsLastModification) {
            console.log('Refreshing beacons');
            this.getBeacons();
            this.beaconsLastModification = res.data;
          }
        })
        .catch(error => console.error(error));
    },
    getItemId(column, row) {
      return `#slide-${column}-row-${row}`;
    },
  },
  created() {
    this.refreshBeacons();
  },
  mounted() {
    window.scrollTo(0, 0);
    document.addEventListener('focus', this.refreshBeacons);
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

</style>
