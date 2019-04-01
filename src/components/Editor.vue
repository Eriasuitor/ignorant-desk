<template>
<div class="editor">
      <div class="loginPad" v-show="showLoginPad">
        <el-form label-position="right" label-width="80px" style="width: 30em">
          <el-form-item label="账户">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密钥">
            <el-input type="password" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item>
    <el-button type="primary" @click="loginQQ()">Login</el-button>
  </el-form-item>
        </el-form>
      </div>
    <el-form label-position="right" label-width="80px" style="width: 30em">
          <el-form-item label="发件人">
            <el-input v-model="sender" placeholder="e.g. Lory Jiang<948471414@qq.com>"></el-input>
          </el-form-item>
          <el-form-item label="收件人">
            <el-input v-model="receiver"></el-input>
          </el-form-item>
          <el-form-item label="抄送">
            <el-input v-model="cc"></el-input>
          </el-form-item>
          <el-form-item label="密送">
            <el-input v-model="bcc"></el-input>
          </el-form-item>
          <el-form-item label="主题">
            <el-input v-model="subject"></el-input>
          </el-form-item>
          
          <el-upload
  class="upload-demo"
  drag
  :on-change="handleChange"
  :auto-upload="false"
  action=""
  >
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此区域，或<em>点击此区域</em>上传</div>
</el-upload>
  可用字段：  {{dataArray.length === 0? '无可用字段选择器': Object.keys(dataArray[0])}}
          <el-form-item>
    <el-button type="primary" @click="send()">发送</el-button>
    <el-button  @click="preview()">预览</el-button>
  </el-form-item>
        </el-form>
     <quill-editor 
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      class="editorContent">
    </quill-editor>
    </div>
</template> 
<script>
export default {
  data() {
    return {
      dataArray: [],
      subject: '${desc}的专属邮件',
      sender: 'Lory Jiang<948471414@qq.com>',
      receiver: '${id}',
      cc: '',
      bcc: '',
      content: '${id}${desc}',
      t: '123123123123123',
      editorOption: {},
      user: {
        username: '948471414',
        password: 'wyrxdbhgqrcjbdah'
      },
      showLoginPad: true
    };
  },
  methods: {
    formatMail(data, html){
      Object.keys(data).forEach(key => {
        let reg =  new RegExp('\\$\\{' + key + '\\}', 'g')
        html = html.replace(reg, data[key])
      })
      return html
    },
    preview(){
      let preData = this.dataArray.length === 0? {}: this.dataArray[0]
      this.$notify({
        title: "邮件预览",
        dangerouslyUseHTMLString: true,
        message: `<h4>发件人：${this.formatMail(preData, this.sender)}</h4>
        <h4>收件人：${this.formatMail(preData, this.receiver)}</h4>
        <h4>抄送：${this.formatMail(preData, this.cc)}</h4>
        <h4>密送：${this.formatMail(preData, this.bcc)}</h4>
        <h4>密送：${this.formatMail(preData, this.subject)}</h4>
        —————————————————</br>
        ${this.formatMail(preData, this.content)}`,
        position: "bottom-left",
        duration: 0
      });
      console.log()
    },
    async send(){
      if(this.dataArray.length === 0) {
        return this.$notify({
        title: "为发现发送字段替换名单，请上传后重试",
        position: "top-right",
        duration: 3000
      });
      }
      let success = 0, total = this.dataArray.length, failed = 0
      for(let i = 0; i< this.dataArray.length; i++){
        let preData = this.dataArray[i]
        let result = await this.landingShip.post('http://localhost:11081/mail', undefined, {
          user : this.user.username,
           pass : this.user.password,
           subject: this.formatMail(preData, this.subject),
           from : this.formatMail(preData, this.sender),
           to : this.formatMail(preData, this.receiver),
           html : this.formatMail(preData, this.content),
           cc: this.formatMail(preData, this.cc),
           bcc: this.formatMail(preData, this.bcc),
        })
        if(result.status === 200){
          success++
          this.$notify({
        title: "发送成功",
        position: "top-right",
        duration: 1000,
        message: `待发送：${total - success - failed}，成功：${success}，失败：${failed}`
      });
        }
        else{
          failed++
          this.$notify({
        title: "发送失败",
        position: "top-right",
        duration: 1000,
        message: `待发送：${total - success - failed}，成功：${success}，失败：${failed}`
      });
        }
      }
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange(a, b) {
      //内容改变事件
    },
    handleChange(file, fileList) {
      let s = new FileReader(file)
        console.log(file)
      
      console.log(s.readAsText(file.raw))
      s.onload =  () => {

let data = s.result.split('\n').map(_ => _.replace(/\r/g, '').split(','))
let fieldName = data.shift()
 this.dataArray = data.map(_ => fieldName.reduce((a, b, index) => Object.assign(a, {[b]:_[index]}), {}))
      if(!this.dataArray  || this.dataArray .length <= 2){
        return this.$notify({
        title: "文字替换名单格式错误，请交由Lory检查后重试",
        position: "top-right",
        duration: 3000
      });
      this.dataArray = []
      }
　　　　　　}
      },
    async loginQQ(){
      let loginResult = await this.landingShip.post('http://localhost:11081/login', undefined, {user: this.user.username,pass: this.user.password})
      if(loginResult.status === 200) {
        this.showLoginPad = false
       const h = this.$createElement;

      this.$notify({
        title: "登录成功  ",
        dangerouslyUseHTMLString: true,
        message: "",
        position: "top-right",
        duration: 2000
      });
      }
      else {
        this.$notify({
        title: "登录失败，请确保您的输入符合预期  ",
        dangerouslyUseHTMLString: true,
        message: loginResult.data,
        position: "top-right",
        duration: 2000
      });
      }
    }
  }
};
</script>
<style scoped>
.editor {
  padding-top: 2em;
  height: calc(100% - 3em);
}
.editorContent{
}
.loginPad {
  padding-top: 3em;
  z-index: 100;
  background-color:white;
  position: absolute;
  height: calc(100% - 3em);
  width: 100%
}
</style>
