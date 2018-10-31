<template>
  <transition name="slide">
    <div class="slideBorad" id="slideBorad" v-show="show">
      <div class="loginPad" v-if="showLoginPad">
        <LP v-on:login="login"/>
      </div>
      <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=699359866,1092793192&fm=26&gp=0.jpg" class="avatar select" />
      <span class="nickname">{{user.nickName}}<span class="status">{{user.status}}</span></span>
      <span class="signature">{{user.signature}}</span>
      <div class="el-notification__closeBtn el-icon-arrow-left" @click="show = !show"><span class="el-icon-more" @click="more($event)"></span>
      </div>
      <div class="more" v-if="showMore">
        <div class="logout" @click="logout">登出</div>
      </div>
      <div class="friend select" v-for="friend in friendList" :key="friend.userId" @click="friendClick(friend)">
        <img :src="friend.avatar" class="friendAvatar" />
        <span class="nickname" v-text="friend.nickName"><span class="status">{{friend.status}}</span></span>
        <div class="msgOverview">{{friend.msgRecord.length != 0? friend.msgRecord[friend.msgRecord.length - 1].content: null}}<span></span></div>
      </div>
      <div class="chatPadArea">
        <div class="chatPad" v-for="chatpad in chatPadList" :key="chatpad.userId">
          <div class="header"><img :src="chatpad.avatar" class="friendAvatar" /><span class="nickName">{{chatpad.nickName}}<span class="status">{{chatpad.status}}</span></span><span class="el-icon-close close" @click="closeCp(chatpad)"></span></div>
          <div class="content">
            <div v-for="msgRecord in chatpad.msgRecord" :key="msgRecord.synId" :class="[msgRecord.to === user.userId? 'msgIn': 'msgOut', 'msgLine']">
              <span class="msg">{{msgRecord.content}}
                    <img :src="msgRecord.to === user.userId? chatpad.avatar: user.avatar" class="msgAvatar"/>
                  </span>
            </div>
          </div>
          <div class="inputPad">
            <textarea value="" rows="2" v-model="chatpad.input"></textarea>
            <el-button plain size="mini" @click="sendMsg(chatpad)" class="send">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import LP from "./LoginPad";
  export default {
    name: "IM",
    props: ["show"],
    components: {
      LP
    },
    data() {
      return {
        value3: false,
        showMore: true,
        token: null,
        showLoginPad: true,
        friendList: [],
        ws: null,
        user: {},
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
      login(userId, password){
        this.landingShip
        .post(
          this.landingMat + ":8090/authentication", {
            Authorization: "Basic aWduby1jaGF0Onh4eHgteHh4eA==",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          require("qs").stringify({
            username: userId,
            password: password
          })
        )
        .then(res => {
          if (res.status === 200) {
            this.token = res.data.access_token;
            this.getMe();
            this.getFriendList();
            this.showLoginPad = false
          }
          else{
            this.$emit("new-message", "error", res);
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      logout() {
        this.showLoginPad = true
        this.user = {}
        this.friendList = null
        this.chatPadList = null
      },
      more(event) {
        event.stopPropagation();
        this.showMore = !this.showMore;
      },
      closeCp(chatPad) {
        let index = this.chatPadList.indexOf(chatPad);
        if (index != -1) this.chatPadList.splice(index, 1);
      },
      initSocket() {
        this.ws = new WebSocket(
          "ws://localhost:8090/ws?access_token=" + this.token
        );
        this.ws.onopen = () => {
          this.$emit("new-message", "success", "IC连接成功");
        };
        this.ws.onmessage = this.handleSocketMsg;
        this.ws.onclose = () => {
          this.$emit("new-message", "warning", "IC失联");
        };
      },
      getMe() {
        this.landingShip
          .get(this.landingMat + ":8090/user/me", {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            this.user = resp.data;
            console.log(this.user.name);
            this.initSocket();
          });
      },
      getuserInfo(userId, callback) {
        this.landingShip
          .get(this.landingMat + ":8090/user/" + userId, {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            callback(resp);
          });
      },
      sendMsg(chatPad) {
        this.ws.send(
          JSON.stringify({
            type: "msg",
            content: JSON.stringify({
              to: chatPad.userId,
              type: 1,
              content: chatPad.input
            })
          })
        );
      },
      friendClick(friend) {
        let index = this.chatPadList.indexOf(friend);
        if (index === -1) this.chatPadList.push(friend);
      },
      getFriendList() {
        console.log("bearer " + this.token);
        this.landingShip
          .get(this.landingMat + ":8090/user/friend", {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            this.friendList = resp.data;
            this.friendList.forEach(_ => (_.msgRecord = []));
            console.log(this.friendList[0].userId);
            this.chatPadList = this.friendList.slice(0, 5);
          });
      },
      handleSocketMsg(content) {
        let socketContent = JSON.parse(content.data);
        let data = JSON.parse(socketContent.content);
        let friend = null;
        console.log(data.from);
        console.log(this.user.userId);
        console.log(data.from === this.user.userId);
        console.log(this.friendList.map(_ => _.userId));
        if (data.from === this.user.userId)
          friend = this.friendList.find(_ => _.userId === data.to);
        else friend = this.friendList.find(_ => _.userId === data.from);
        console.log(1);
        console.log(friend);
        if (!friend) {
          this.getuserInfo(data.to, resp => {
            console.log(4);
            friend = resp.data;
            console.log(resp);
            console.log(44);
            friend.msgRecord = [];
            friend.msgRecord.push(data);
            console.log(55);
            this.friendList.push(friend);
          });
          return;
        }
        console.log(66);
        friend.msgRecord.push(data);
        friend.nickName = "12312321";
        console.log(77);
        console.log(JSON.stringify(this.friendList));
        // this.$emit("new-message", undefined);
      }
    },
    mounted() {
      
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
    min-width: 25em;
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
  .loginPad {
    position: absolute;
    background-color: salmon;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 8px;
    z-index: 1001;
  }
  .el-icon-more {
    cursor: pointer;
    margin-left: 0.3em;
  }
  .more {
    position: absolute;
    left: 100%;
    top: 0.5em;
    width: 7em;
    z-index: 1000;
    background-color: seashell;
    font-size: 1.5em;
    text-align: center;
  }
  .more .logout {
    padding: 0.3em 0;
  }
  .logout:hover {
    background-color: whitesmoke;
    cursor: pointer;
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
  .signature {
    display: inline-block;
    max-width: 20em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.2em;
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
    border-bottom: 1px solid #ebeef5;
    vertical-align: middle;
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
    margin: 0.5em;
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
  .chatPad .header .friendAvatar {
    width: 1.5em;
    height: 1.5em;
    border-radius: 1em;
    margin-right: 1em;
    vertical-align: middle;
  }
  .chatPad .header .nickName {
    height: 1.5em;
    vertical-align: middle;
  }
  .chatPad .close {
    float: right;
    vertical-align: middle;
    line-height: 2em;
    margin-right: 0.5em;
  }
  .chatPad .close:hover {
    cursor: pointer;
  }
  .chatPad .content {
    height: 20em;
    overflow: auto;
  }
  .msgLine {
    margin: 0.3em;
  }
  .msgOut {
    text-align: right;
  }
  .msgIn .msgAvatar {
    left: -2.5em;
  }
  .msgAvatar {
    position: absolute;
    top: 0;
    width: 2.3em;
    height: 2.3em;
    border-radius: 8px;
  }
  .msgOut .msgAvatar {
    right: -2.5em;
  }
  .msgLine .msg {
    position: relative;
    display: inline-block;
    padding: 0.4em;
    margin: 0 2.5em;
    background-color: rgba(0, 128, 0, 0.397);
    border-radius: 8px;
    text-align: left;
  }
  .chatPad .inputPad {
    position: relative;
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
    position: relative;
    right: 0;
    bottom: 0;
    float: right;
  }
  .chatPad .inputPad textarea:focus {
    outline: none;
  }
</style>