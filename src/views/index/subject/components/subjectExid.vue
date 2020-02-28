<template>
  <el-dialog title="编辑页面" :visible.sync="dialogFormVisible" center width="600px">
    <el-form ref="formLabel" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="学科编号" prop="rid">
        <el-input v-model="form.rid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简介">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简称">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科备注">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureBtn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editorSubject } from "@/api/subject.js";
export default {
  data() {
    return {
      dialogFormVisible: false, // 页面是否显示或隐藏
      form: {}, // 表单绑定的属性
      rules: {},
      formLabelWidth: "90px"
    };
  },
  methods: {
    // 确定点击事件
    sureBtn() {
      // 调用编辑学科接口
      editorSubject(this.form).then(res=>{
          if(res.data.code==200){
              this.$message.success('修改成功')
              this.dialogFormVisible=false // 页面隐藏
              this.parens.getList() // 调用福窗口的获取列表函数来刷新
          }
          
      })
    }
  }
};
</script>

<style>
</style>