<template>
  <transition name="slide">
    <div class="slideBorad" id="slideBorad" v-show="show">
      <div class="loginPad" v-if="showLoginPad">
        <LP v-on:login="login" />
      </div>
      <img :src="user.avatar" class="avatar select" />
      <span class="nickname">{{user.nickName}}<span class="status">{{user.status}}</span></span>
      <span class="signature">{{user.signature}}</span>
      <div class="el-notification__closeBtn el-icon-arrow-left"><span class="el-icon-more" @click="more($event)"></span> </div>
      <div class="more" v-if="showMore">
        <div class="logout" @click="logout">登出</div>
      </div>
      <el-row>
        <el-popover placement="bottom" trigger="click" class="wcLogin">
          <div class="desc">使用微信扫描二维码以登录您的账户</div>
          <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1540983444&di=b7d2f2d1ec628109aab407ad2470f059&src=http://y3.ifengimg.com/news_spider/dci_2013/09/b85234c4801f8b2d7771353867a7a0f8.jpg" class="qr"
          />
          <span slot="reference" class="iconfont icon-weixin" title="Offline"></span>
        </el-popover>
      </el-row>
      <el-row>
        <el-autocomplete class="searchFriend" size="mini" prefix-icon="el-icon-search" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
      </el-row>
      <transition-group name="chat-pad" tag="div">
        <div class="friend select chat-pad-item" v-for="friend in friendList" :key="friend.userId" @click="friendClick(friend)">
          <img :src="friend.avatar" class="friendAvatar" />
          <span class="nickname">{{friend.nickName}}<span class="status">{{friend.status}}</span><span class="status">{{friend.type}}</span></span>
          <div class="msgOverview">{{friend.msgRecord.length != 0? friend.msgRecord[friend.msgRecord.length - 1].content: null}}<span></span></div>
        </div>
      </transition-group>
      <div class="chatPadArea">
        <transition-group name="chat-pad" tag="div">
          <div class="chatPad chat-pad-item" v-for="chatpad in chatPadList" :key="chatpad.userId">
            <div class="header"><img :src="chatpad.avatar" class="friendAvatar" /><span class="nickName">{{chatpad.nickName}}<span class="status">{{chatpad.status}}</span><span class="status">{{chatpad.type}}</span></span><span class="el-icon-close close" @click="closeCp(chatpad)"></span></div>
            <transition-group name="chat-pad" tag="div" class="content chat-pad-item" :id="'cpc' + chatpad.userId">
              <div v-for="msgRecord in chatpad.msgRecord" :key="msgRecord.msgId" :class="[msgRecord.to === user.userId? 'msgIn': 'msgOut', 'msgLine', 'chat-pad-item']">
                <span class="msg">{{msgRecord.content}}<img :src="msgRecord.to === user.userId? chatpad.avatar: user.avatar" class="msgAvatar"/></span>
              </div>
            </transition-group>
            <div class="inputPad">
              <textarea value="" rows="2" v-model="chatpad.input"></textarea>
              <el-button plain size="mini" @click="sendMsg(chatpad)" class="send">发送</el-button>
            </div>
          </div>
        </transition-group>
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
        showMore: false,
        token: null,
        showLoginPad: false,
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
      querySearch(queryString, cb) {
        let result
        this.landingShip
          .get(this.landingMat + ":8090/user?q=" + queryString, {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            if (resp.status === 200) {
              result = resp.data
              result.forEach(_ => {
                _.value = _.userId
              })
              result = queryString ? result.filter(this.createFilter(queryString)) : result;
              // 调用 callback 返回建议列表的数据
              cb(result);
            } else
              this.$emit("new-message", "error", resp);
          })
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [{
          "value": "三全鲜食（北新泾店）",
          "address": "长宁区新渔路144号"
        }];
      },
      handleSelect(item) {
        item.msgRecord = []
        this.friendList.push(item)
        this.chatPadList.push(item)
      },
      addFriend() {},
      login(userId, password) {
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
              this.showLoginPad = false;
            } else {
              this.$emit("new-message", "error", res);
            }
          });
      },
      logout() {
        this.showMore = false;
        this.showLoginPad = true;
        this.user = {};
        this.friendList = null;
        this.chatPadList = null;
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
        if (!chatPad.input) return
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
        chatPad.input = null;
      },
      friendClick(friend) {
        let index = this.chatPadList.indexOf(friend);
        if (index === -1) this.chatPadList.push(friend);
      },
      getMsgRecord(friend) {
        this.landingShip
          .get(`${this.landingMat}:8090/user/friend/${friend.userId}/message`, {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            if (resp.status === 200) {
              friend.msgRecord = resp.data.concat(friend.msgRecord)
              this.$forceUpdate()
              this.$el.querySelectorAll(".chatPad .content").forEach(_ => _.scrollTop = _.scrollHeight)
            } else {
              this.$emit("new-message", "error", resp);
            }
          });
      },
      getFriendList() {
        this.landingShip
          .get(this.landingMat + ":8090/user/friend", {
            Authorization: "bearer " + this.token
          })
          .then(resp => {
            this.friendList = resp.data;
            this.friendList.forEach(_ => {
              _.msgRecord = []
              _.isFriend = true
            });
            this.friendList.forEach(_ => this.getMsgRecord(_));
            this.chatPadList = this.friendList.slice(0, 5);
          });
      },
      handleSocketMsg(content) {
        let socketContent = JSON.parse(content.data);
        let data = JSON.parse(socketContent.content);
        let friend = null;
        if (data.from === this.user.userId)
          friend = this.friendList.find(_ => _.userId === data.to);
        else friend = this.friendList.find(_ => _.userId === data.from);
        if (!friend) {
          this.getuserInfo(data.to, resp => {
            friend = resp.data;
            friend.msgRecord = []
            friend.msgRecord.push(data)
            friend.isFriend = false
            this.friendList.splice(0, 0, friend)
          });
          return;
        }
        friend.msgRecord.push(data);
        let index = this.friendList.indexOf(friend)
        this.friendList.splice(index, 1)
        this.friendList.splice(0, 0, friend)
        this.$forceUpdate()
        this.$nextTick(() => {
          let el = this.$el.querySelector(`#cpc${friend.userId}`)
          if (el)
            el.scrollTop = el.scrollHeight
        })
        // this.$emit("new-message", undefined);
      }
    },
    mounted() {
      this.login('Lory.Y.Jiang', '123')
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
    width: 30em;
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
  .chat-pad-enter,
  .chat-pad-leave-to
  /* .chat-pad-leave-active for below version 2.1.8 */
  {
    opacity: 0;
    transform: translateX(30px);
  }
  .chat-pad-leave-active {
    position: absolute;
  }
  .chat-pad-item {
    transition: all 0.5s;
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
  .desc {
    text-align: center
  }
  .qr {
    height: 20em;
    width: 20em;
  }
  .iconfont.icon-weixin {
    font-size: 2em;
  }
  .iconfont.icon-weixin:hover {
    cursor: pointer;
  }
  .more {
    position: absolute;
    left: 100%;
    top: 0.5em;
    width: 7em;
    z-index: 1000;
    background-color: seashell;
    font-size: 1.3em;
    text-align: center;
  }
  .more .logout {
    padding: 0.3em 0;
    border-bottom: 1px solid #ebeef5;
  }
  .logout:hover {
    background-color: whitesmoke;
    cursor: pointer;
  }
  .searchFriend {
    display: block;
    margin-bottom: 0.5em;
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
    vertical-align: middle;
    max-width: 20em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .friend .friendAvatar {
    margin-top: 0.5em;
    width: 3em;
    height: 3em;
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
    width: 22em;
    height: 35em;
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
    height: 25em;
    overflow: auto;
    overflow-x: hidden;
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