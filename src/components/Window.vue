<template>
  <transition name="slide">
    <div class="window" id="window" v-show="show"> 
      <div class="header" id="header">Union Mail</div>
      <div v-for="border in borderList" :key="border[0]" :class="['resize', border[0]]" :id=" border[0]"/>
      <div class="content"><slot/></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "IM",
  data() {
    return {
      value3: false,
      show: true,
      borderList: [
        ["T", false, true, false, true],
        ["B", false, true, false, false],
        ["L", true, false, true, false],
        ["R", true, false, false, false],
        ["LT", true, true, true, true],
        ["LB", true, true, true, false],
        ["RT", true, true, false, true],
        ["RB", true, true, false, false]
      ]
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
    },
    listenDrag(target, trigger) {
      trigger.ontouchstart = trigger.onmousedown = e => {
        let disX = (e.clientX || e.touches[0].clientX) - target.offsetLeft;
        let disY = (e.clientY || e.touches[0].clientY) - target.offsetTop;
        document.ontouchmove = document.onmousemove = e => {
          let left = (e.clientX || e.touches[0].clientX) - disX;
          let top = (e.clientY || e.touches[0].clientY) - disY;

          left + target.offsetWidth < 15
            ? (left = 15 - target.offsetWidth)
            : undefined;
          top + target.offsetHeight < 15
            ? (top = 15 - target.offsetHeight)
            : undefined;
          target.style.left = left + "px";
          target.style.top = top + "px";
        };
        document.ontouchend = document.onmouseup = () => {
          document.onmousemove = document.onmouseup = document.ontouchmove = document.ontouchend = null;
        };
      };
    },
    listenResize(
      target,
      trigger,
      modifyWidth,
      modifyHeight,
      modifyLeft,
      modifyTop
    ) {
      trigger.ontouchstart = trigger.onmousedown = e => {
        e.cancelBubble = true;
        let targetWidth = target.offsetWidth;
        let targetHeight = target.offsetHeight;
        let targetLeft = target.offsetLeft;
        let targetTop = target.offsetTop;

        let mouseStartX = e.clientX || e.touches[0].clientX;
        let mouseStartY = e.clientY || e.touches[0].clientY;
        document.ontouchmove = document.onmousemove = e => {
          let right = (e.clientX || e.touches[0].clientX) - mouseStartX;
          let down = (e.clientY || e.touches[0].clientY) - mouseStartY;
          modifyLeft &&
            (right = -right) &&
            (target.style.left = targetLeft - right + "px");
          modifyTop &&
            (down = -down) &&
            (target.style.top = targetTop - down + "px");
          modifyWidth && (target.style.width = targetWidth + right + "px");
          modifyHeight && (target.style.height = targetHeight + down + "px");
        };
        document.ontouchend = document.onmouseup = () => {
          document.onmousemove = document.onmouseup = document.ontouchmove = document.ontouchend = null;
        };
      };
    }
  },
  mounted() {
    let window = document.getElementById("window");
    [
      ["T", false, true, false, true],
      ["B", false, true, false, false],
      ["L", true, false, true, false],
      ["R", true, false, false, false],
      ["LT", true, true, true, true],
      ["LB", true, true, true, false],
      ["RT", true, true, false, true],
      ["RB", true, true, false, false]
    ]
      .map(b => {
        b[0] = document.getElementById(b[0]);
        b.splice(0, 0, window);
        return b;
      })
      .map(b => this.listenResize(...b));
    this.listenDrag(window, document.getElementById("header"));
  },
  computed: {},
   created() {
    // document.onkeypress = e => {
    //   if (e.key === "q") {
    //     this.show = !this.show;
    //   }
    // };
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
.window {
  z-index: 100;
  position: fixed;
  background-color: blue;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  /* box-sizing: border-box; */
  text-align: left;
}
.window .header {
  padding-top: 0.3em;
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
  height: 2em;
  width: 100%;
  background-color: whitesmoke;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  top: 0;
  left: 0;
  right: 0;
}
.content {
  width: 100%;
  height: calc(100% - 2em);
  overflow:auto;
}
.window .resize {
  position: absolute;
  background-color: papayawhip;
  opacity: 0;
  z-index: 100;
}
.window .resize:hover {
  opacity: 100;
}
.window .resize.T {
  width: 100%;
  top: -0.5em;
  left: 0;
  height: 1em;
  cursor: n-resize;
}
.window .resize.B {
  height: 1em;
  bottom: -0.5em;
  left: 0;
  width: 100%;
  cursor: s-resize;
}
.window .resize.L {
  width: 1em;
  top: 0;
  bottom: 0;
  left: -0.5em;
  height: 100%;
  cursor: w-resize;
}
.window .resize.R {
  width: 1em;
  top: 0;
  bottom: 0;
  right: -0.5em;
  height: 100%;
  cursor: e-resize;
}
.window .resize.LT {
  height: 1em;
  top: -0.5em;
  left: -0.5em;
  width: 1em;
  cursor: nw-resize;
}
.window .resize.LB {
  height: 1em;
  bottom: -0.5em;
  left: -0.5em;
  width: 1em;
  cursor: sw-resize;
}
.window .resize.RT {
  height: 1em;
  top: -0.5em;
  right: -0.5em;
  width: 1em;
  cursor: ne-resize;
}
.window .resize.RB {
  height: 1em;
  bottom: -0.5em;
  right: -0.5em;
  width: 1em;
  cursor: se-resize;
}
/* .window::before {
  content: " ";
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  border-top: 10px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 5;
} */
.slide-enter-active{
  animation: slide-in .3s ;
}
.slide-leave-active {
  animation: slide-in .3s reverse ;
}

@keyframes slide-in {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>