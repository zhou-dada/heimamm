<template>
  <el-dialog title="收货地址" :visible.sync="dialogFormVisible" center width="600px">
    <el-form :model="form" ref="formlist" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model="form.eid" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="short_name">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="intro">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="canBtn">取 消</el-button>
      <el-button type="primary" @click="sureBtn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editoBussiness } from "@/api/bussiness.js";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        eid: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      rules: {
        eid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }]
      },
      formLabelWidth: "100px"
    };
  },
  methods: {
    // 确认按钮点击事件
    sureBtn() {
      this.$refs.formlist.validate(valid => {
        if (valid) {
          editoBussiness(this.form).then(res => {
            console.log(res);
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              this.cancel();
              this.$parent.getList(); // 重新加载企业列表
            }else{
              this.$message.error(res.data.message)
            }
          });
        }
      });
    },
    // 取消按钮点击事件
    canBtn() {
      this.cancel();
    },

    // 封装刷新函数
    cancel() {
      this.dialogFormVisible = false;
      this.$refs.formlist.resetFields();
    }
  }
};
</script>

<style>
</style>