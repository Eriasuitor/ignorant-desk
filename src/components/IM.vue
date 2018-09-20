<template>
  <transition name="slide">
    <div class="slideBorad" id="slideBorad" v-if="show">
      asdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsdasdsafdsfdsafsdfsd
      <div class="el-notification__closeBtn el-icon-arrow-left" @click="show = !show"></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "IM",
  data() {
    return {
      value3: false,
      show: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      }
    };
  },
  methods: {
    open12() {
      this.$notify({
        title: "HTML 片段",
        dangerouslyUseHTMLString: true,
        message: "<strong>这是 <i>HTML</i> 片段</strong>",
        position: "bottom-left",
        duration: 0
      });
    }
  },
  mounted() {},
  computed: {},
  created() {
    document.onkeydown = e => {
      if (e.key === "s") {
        this.show = !this.show;
      }
    };
  }
};
</script>
<style scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.slideBorad {
  position: fixed;
  background-color: blue;
  height: 100%;
  top: 0;
  bottom: 0;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 14px 26px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  box-sizing: border-box;
  left: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: left 0.4s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  left: -100%;
}
</style>