<template>
  <div class="editor">
    <div id="div1" class="toolbar" ref="toolbar"></div>
    <div id="div2" class="content" ref="content" v-html="value">

    </div>
  </div>
</template>

<script>
// 导入富文本组件
import wangEditor from "wangeditor";
export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  mounted() {
    // 两个参数也可以传入 elem 对象，class 选择器
    var editor = new wangEditor(this.$refs.toolbar, this.$refs.content);
    // 监听富文本值改变事件
    /* function声明的函数 里面的this默认是window
    所以我们这里不用function 他会改变this的指向 
    用箭头函数
*/
    editor.customConfig.onchange = html => {
      //把值传递给父组件
      this.$emit("input", html);
    };
    editor.create();
  }
};
</script>

<style lang="less">
.editor {
  margin-top: 55px;
  padding-left: 309px;

  .toolbar {
    border: 1px solid #ccc;
    width: 836px;
  }

  .content {
    border: 1px solid #ccc;
    height: 50;
    width: 836px;
  }
}
</style>