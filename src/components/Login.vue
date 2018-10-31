<template>
  <transition name="slide">
   
  <div class="LoginPage">
    <div class="loginPad">
      <span class="login">Sign in</span>
      <el-input
      class="input"
        placeholder="账户"
        v-model="input22">
        <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
      </el-input>
      <el-input
      class="input"
        placeholder="密码"
        type="password"
        v-model="input23">
        <i
        class="el-icon-arrow-right el-input__icon"
        slot="suffix"
        @click="handleIconClick"> 
      </i>
      </el-input>
  </div>
</div>
  </transition>
</template>
<script>
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm2: {
        pass: "",
        checkPass: "",
        age: ""
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        age: [{ validator: checkAge, trigger: "blur" }]
      }
    };
  },
  methods: {
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
    }
  }
};
</script>
<style scoped>
.LoginPage {
  background-image: url("https://www.wallpaperup.com/uploads/wallpapers/2013/12/02/182291/76c5aef80966af99c675d0cfe5ffd13c-1000.jpg");
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-size: 100% 100%;
  z-index: 100;
}
.loginPad {
  background-color: rgba(245, 245, 245, 0.712);
  border-radius: 8px;
  margin: 2em;
  padding: 2em;
  width: 30em;
}
.loginPad span {
  font-size: 3em;
}
.loginPad .input {
  margin: 0.5em 0;
}
.loginPad .input i:hover {
  background-color:moccasin;
  cursor: pointer;
}
</style>