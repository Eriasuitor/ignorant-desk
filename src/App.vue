<template>
  <div id="app">
    123
    <router-view/>
    <notification/>
  </div>
</template>

<script>
import Notification from "./components/Notification.vue";

export default {
  name: "app",
  components: {
    Notification
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
