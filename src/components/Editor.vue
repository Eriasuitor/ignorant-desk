<template>
     <quill-editor 
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      class="editor">
    </quill-editor>
</template> 
<script>
export default {
  data() {
    return {
      content: null,
      editorOption: {}
    };
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    }
  }
};
</script>
<style scoped>
.editor {
  height: calc(100% - 6em);
}
</style>
