<template>
  <div class="loginPad">
    <span class="login">Sign in</span>
    <el-input class="input" placeholder="账户" v-model="userId">
      <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
    </el-input>
    <el-input class="input" placeholder="密码" type="password" v-model="password">
      <i class="el-icon-arrow-right el-input__icon" slot="suffix" @click="handleLogin()"></i>
    </el-input>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId: null,
        password: null
      }
    },
    methods: {
      handleLogin() {
        this.$emit('login', this.userId, this.password)
      }
    }
  }
</script>

<style scoped>
  .loginPad {
    background-color: rgba(245, 245, 245, 0.712);
    border-radius: 8px;
    margin: 2em;
    padding: 2em;
    width: 30em;
    height: 20em;
  }
  .loginPad span {
    font-size: 3em;
  }
  .loginPad .input {
    margin: 0.5em 0;
  }
  .loginPad .input i:hover {
    background-color: moccasin;
    cursor: pointer;
  }
</style>