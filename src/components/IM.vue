<template>
  <transition name="slide">
    <div class="slideBorad" id="slideBorad" v-if="show">
      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="avatar select" />
      <span class="nickname">Eriasuitor</span>
      <div class="status">I'm happy today.</div>
      <div class="el-notification__closeBtn el-icon-arrow-left" @click="show = !show"></div>
      <div class="friend select" @click="friendClick">
        <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="friendAvatar" />
        <span class="nickname">Eriasuitor</span><span class="status"></span>
        <div class="msgOverview">你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！你好啊！</div>
      </div>
      <div class="friend select" v-for="friend in friendList" :key="friend.userId">
        <img :src="friend.avatar" class="friendAvatar" />
        <span class="nickname">{{friend.nickName}}<span class="status">{{friend.status}}</span></span>
        <div class="msgOverview"></div>
      </div>
      <div class="chatPadArea">
        <div class="chatPad" v-for="chatpad in chatPadList" :key="chatpad.userId">
          <div class="header">{{chatpad.nickName}}<span class="status">{{chatpad.status}}</span></div>
          <div class="content">
          </div>
          <div class="inputPad">
            <textarea value="" rows="2" v-model="chatpad.input"></textarea>
            <el-button plain size="mini" @click="sendMsg(chatpad)" class="send">发送</el-button>
          </div>
        </div>
  
        <div class="chatPad">
          <div class="header">段卓君</div>
          <div class="content">
            <div class="msgIn">
              <span class="msg">你好啊！你好啊！你好啊你好啊！你好啊！
                                      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="msgInAvatar"/>
                                    </span>
            </div>
            <div class="msgIn">
              <span class="msg">你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！
                                      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="msgInAvatar"/>
                                    </span>
            </div>
            <div class="msgOut">
              <span class="msg">你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！你好啊！你好啊！你好啊你好啊！你好啊！
                                    <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="msgOutAvatar"/>
                                  </span>
            </div>
          </div>
          <div class="inputPad">
            <textarea value="" rows="4">你好你是谁？</textarea>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "IM",
    props: ["show"],
    data() {
      return {
        value3: false,
        token: null,
        friendList: [],
        ws: null,
        chatPadList: [],
        styles: {
          height: "calc(100% - 55px)",
          overflow: "auto",
          paddingBottom: "53px",
          position: "static"
        }
      };
    },
    methods: {
      sendMsg(chatPad) {
        this.ws.send(JSON.stringify({
          type: 'msg',
          content: JSON.stringify({
            to: chatPad.userId,
            type: 1,
            content: chatPad.input
          })
        }))
      },
      friendClick() {
  
      },
      getFriendList() {
        console.log('bearer ' + this.token)
        this.landingShip.get(this.landingMat + ":8090//user/friend", {
          Authorization: 'bearer ' + this.token
        }).then(resp => {
          this.friendList = resp.data
          console.log(this.friendList[0].userId + "123")
          this.chatPadList = this.friendList.slice(0, 5)
        })
      },
      handleSocketMsg(data) {
        this.$emit("new-message", undefined, data)
      }
    },
    mounted() {
      this.landingShip.post(this.landingMat + ":8090/authentication", {
        Authorization: 'Basic aWduby1jaGF0Onh4eHgteHh4eA==',
        "Content-Type": 'application/x-www-form-urlencoded'
      }, require('qs').stringify({
        username: 'lory.y.jiang',
        password: '123'
      })).then(res => {
        if (res.status === 200) {
          this.token = res.data.access_token
          this.getFriendList()
  
          this.ws = new WebSocket("ws://0.0.0.0:8090/ws?access_token=" + this.token)
          this.ws.onopen = () => {
            this.$emit("new-message", "success", "IC连接成功")
          }
          this.ws.onmessage = this.handleSocketMsg
          this.ws.onclose = () => {
            this.$emit("new-message", "warning", "IC失联")
          }
        }
      })
    },
    computed: {},
    created() {}
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
    z-index: 1000;
    position: fixed;
    background-color: blue;
    height: 100%;
    top: 0;
    bottom: 0;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 1em 2em;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    box-sizing: border-box;
    left: 0;
    text-align: left;
  }
  
  .slide-enter-active,
  .slide-leave-active {
    transition: left 0.3s;
  }
  
  .slide-enter,
  .slide-leave-to
  /* .fade-leave-active below version 2.1.8 */
  
  {
    left: -100%;
  }
  
  .avatar {
    width: 4em;
    height: 4em;
    border-radius: 8px;
    margin-right: 1em;
  }
  
  .nickname {
    position: absolute;
    font-size: 1.5em;
  }
  
  .status {
    font-size: 0.7em;
    margin-left: 0.5em;
  }
  
  .msgOverview {
    display: inline-block;
    max-width: 20em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .friendAvatar {
    width: 4em;
    height: 4em;
    border-radius: 8px;
    margin-right: 1em;
  }
  
  .friend {
    padding: 0.5em;
    position: relative;
  }
  
  .friend:hover {
    background-color: whitesmoke;
    cursor: pointer;
  }
  
  .select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .chatPadArea {
    position: absolute;
    top: 0;
    left: 100%;
    width: 120em;
  }
  
  .chatPad {
    display: inline-block;
    width: 30em;
    height: 30em;
    background-color: rgba(255, 255, 255, 0.877);
    border: 1px solid #ebeef5;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    font-size: 1.1em;
  }
  
  .chatPad .header {
    text-align: center;
    height: 2em;
    line-height: 2em;
    width: 100%;
    background-color: rgba(0, 128, 0, 0.397);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    top: 0;
    left: 0;
    right: 0;
  }
  
  .chatPad .content {
    height: 20em;
    overflow: auto;
  }
  
  .msgIn {
    margin: 1em;
  }
  
  .msgInAvatar {
    position: absolute;
    left: -3em;
    top: 0;
    width: 2.6em;
    height: 2.6em;
    border-radius: 8px;
  }
  
  .msgIn .msg {
    position: relative;
    display: inline-block;
    padding: 0.6em;
    margin: 0 3em;
    background-color: rgba(0, 128, 0, 0.397);
    border-radius: 8px;
  }
  
  .msgOut {
    margin: 1em;
  }
  
  .msgOutAvatar {
    position: absolute;
    right: -3em;
    top: 0;
    width: 2.6em;
    height: 2.6em;
    border-radius: 8px;
  }
  
  .msgOut .msg {
    position: relative;
    display: inline-block;
    padding: 0.6em;
    margin: 0 3em;
    background-color: rgba(0, 128, 0, 0.397);
    border-radius: 8px;
  }
  
  .chatPad .inputPad {
    position: relative;
    margin: 1em;
    border-top: 2px solid rgba(128, 128, 128, 0.644);
    padding: 0.6em;
  }
  
  .chatPad .inputPad textarea {
    border: none;
    width: 100%;
    overflow: auto;
    word-break: break-all;
    resize: none;
  }
  
  .chatPad .inputPad .send {
    position: absolute;
    right: 0;
    bottom: -1.5em;
  }
  
  .chatPad .inputPad textarea:focus {
    outline: none;
  }
</style>