<template>
  <div>
    <el-button plain @click="open12">
      使用 HTML 片段
    </el-button>
  </div>
</template>
<script>
export default {
  name: "IM",
  data() {
    return {
      value3: false,
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
  }
};
</script>
<style>
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
.IM {
  background-color: black;
  border: 2px solid;
  border-radius: 25px;
  -moz-border-radius: 25px; /* Old Firefox */
}
</style>