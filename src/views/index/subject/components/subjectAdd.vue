<template>
  <el-dialog title="新增学科" :visible.sync="dialogFormVisible" center width="600px">
    <el-form ref="formLabel" :model="form" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="学科编号" prop="rid">
        <el-input v-model="form.rid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" prop="short_name">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" prop="intro">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" prop="remark">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="btnSure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSubject } from "@/api/subject.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        rid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      formLabelWidth: "90px",
      rules: {
        rid: [{ required: "true", message: "编号不能为空", trigger: "blur" }],
        name: [
          { required: "true", message: "学科名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    btnSure() {
      this.$refs.formLabel.validate(valid => {
        if (valid) {
          addSubject({
            rid: this.form.rid,
            name: this.form.name,
            short_name: this.form.short_name,
            intro: this.form.intro,
            remark: this.form.remark
          }).then(res => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message.success("新建成功");
              this.dialogFormVisible = false; // 新建成功后退出新建装口
              this.$parent.getList()  // 调用父页面里面的获取列表来刷新
              this.$refs.formLabel.resetFields();// 表单重置
            }else{
              this.$message.error(res.data.message)
            }
          });
        } else {
          this.$message.error("有项目没有填");
          return false;
        }
      });
    }
  }
};
</script>

<style>
</style>