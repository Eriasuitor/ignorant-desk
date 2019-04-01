<template>
  <div class="windows">
    <div class="launchPad">
      <el-button-group class="launchItem">
        <el-button size="small" type="primary" icon="el-icon-arrow-left">上一页</el-button>
        <el-button size="small" type="primary">下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
      <el-button-group class="launchItem">
        <el-button size="small" type="primary" icon="el-icon-edit"></el-button>
        <el-button size="small" type="primary" icon="el-icon-share"></el-button>
        <el-button size="small" type="primary" icon="el-icon-delete"></el-button>
      </el-button-group>
    </div>
    <transition name="editor">
      <window v-show="show" >
        <Editor v-on:stick_change="changeStick" />
      </window>
    </transition>
    <div class="window" v-drag>
      <div class="curved_box">
        <textarea class="stickText" v-model="stackContent"/>
      </div>
    </div>
    <!-- <div class="window" @mousedown="move">
        <div class="curved_box"></div>
      </div> -->
  </div>
</template>

<script>
  import IM from "./IM";
  import Window from "./Window";
  import HelloWorld from "./HelloWorld";
  import Editor from "./Editor";
  export default {
    name: "Windows",
    props: {
      msg: String
    },
    components: {
      IM,
      Window,
      HelloWorld,
      Editor
    },
    data() {
      return {
        stackContent: '',
        value1: "1",
        show: true,
        showIm: false
      };
    },
    mounted() {},
    methods: {
      changeStick(value){
        this.stackContent = value
      },
      newMessage(type, message) {
        this.$message({
          showClose: true,
          message,
          center: true,
          type,
        });
      },
      move(e) {
        let odiv = e.target; //获取目标元素
  
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        document.onmousemove = e => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          let top = e.clientY - disY;
  
          //绑定元素位置到positionX和positionY上面
          odiv.positionX = top;
          this.positionY = left;
  
          //移动当前元素
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    directives: {
      drag: {
        bind: function(el) {
          let target = el;
          target.ontouchstart = target.onmousedown = e => {
            let disX = (e.clientX || e.touches[0].clientX) - target.offsetLeft;
            let disY = (e.clientY || e.touches[0].clientY) - target.offsetTop;
            document.ontouchmove = document.onmousemove = e => {
              let left = (e.clientX || e.touches[0].clientX) - disX;
              let top = (e.clientY || e.touches[0].clientY) - disY;
  
              left + target.offsetWidth < 15 ?
                (left = 15 - target.offsetWidth) :
                undefined;
              top + target.offsetHeight < 15 ?
                (top = 15 - target.offsetHeight) :
                undefined;
  
              // target.positionX = top;
              // target.positionY = left;
              target.style.left = left + "px";
              target.style.top = top + "px";
            };
            document.ontouchend = document.onmouseup = () => {
              document.onmousemove = null;
              document.onmouseup = null;
              document.ontouchmove = null;
              document.ontouchend = null;
            };
          };
        }
      },
      resize: {
        bind: function(el) {
          let target = el;
          target.ontouchstart = target.onmousedown = e => {
            let disX = (e.clientX || e.touches[0].clientX) - target.offsetLeft;
            let disY = (e.clientY || e.touches[0].clientY) - target.offsetTop;
            document.ontouchmove = document.onmousemove = e => {
              let left = (e.clientX || e.touches[0].clientX) - disX;
              let top = (e.clientY || e.touches[0].clientY) - disY;
  
              left + target.offsetWidth < 15 ?
                (left = 15 - target.offsetWidth) :
                undefined;
              top + target.offsetHeight < 15 ?
                (top = 15 - target.offsetHeight) :
                undefined;
  
              // target.positionX = top;
              // target.positionY = left;
              target.style.left = left + "px";
              target.style.top = top + "px";
            };
            document.ontouchend = document.onmouseup = () => {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          };
        }
      }
    },
    created() {
      /**document.onkeypress = e => {
        if (e.key === "q") {
          this.show = !this.show;
        }
        if (e.key === "s") {
          this.showIm = !this.showIm;
        }
      } */
    }
  };
</script>

<style scoped>
  .launchPad {
    width: 100%;
    background-color: rgba(235, 92, 92, 0.185);
    position: fixed;
    left: 0;
    top: 0;
    text-align: left;
  }
  
  .launchItem {
    margin: 0.5em 0.2em;
  }
  
  .window {
    position: fixed;
  }
  
  .curved_box {
    display: inline-block;
    *display: inline;
    width: 200px;
    height: 248px;
    margin: 20px;
    background-color: #fff;
    border: 1px solid #eee;
    -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 60px rgba(0, 0, 0, 0.06) inset;
    -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;
    position: relative;
    *zoom: 1;
    /* border-bottom-left-radius: 20px 500px;
    border-bottom-right-radius: 500px 30px;
    border-top-right-radius: 5px 100px; */
  }
  
  .curved_box:before {
    -webkit-transform: skew(-15deg) rotate(-6deg);
    -moz-transform: skew(-15deg) rotate(-6deg);
    transform: skew(-15deg) rotate(-6deg);
    left: 15px;
  }
  
  .curved_box:after {
    -webkit-transform: skew(15deg) rotate(6deg);
    -moz-transform: skew(15deg) rotate(6deg);
    transform: skew(15deg) rotate(6deg);
    right: 15px;
  }
  
  .curved_box:before,
  .curved_box:after {
    width: 70%;
    height: 55%;
    content: " ";
    -webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    position: absolute;
    bottom: 10px;
    z-index: -1;
    /* border-bottom-left-radius: 20px 500px;
    border-bottom-right-radius: 500px 30px;
    border-top-right-radius: 5px 100px; */
  }
  
  .stickText {
    padding-top: 2em;
    height: 90%;
    width: 90%;
    resize: none;
    border: 0;
    background-color: rgb(255, 255, 255, 0);
  }
  
  .stickText:focus {
    outline: none;
  }
  
  .editor-enter-active {
    animation: editor-in 0.3s;
  }
  
  .editor-leave-active {
    animation: editor-in 0.3s reverse;
  }
  
  @keyframes editor-in {
    0% {
      transform: translateY(-150%);
    }
    65% {
      transform: translateY(15%);
    }
    100% {
      transform: translateY(0%);
    }
  }
  
  .im-enter-active,
  .im-leave-active {
    transition: left 0.4s;
  }
  
  .im-enter,
  .im-leave-to
  /* .fade-leave-active below version 2.1.8 */
  
  {
    left: -100%;
  }
</style>
