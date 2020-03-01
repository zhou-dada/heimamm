<template>
  <el-dialog title='编辑用户' :visible.sync="dialogFormVisible" center width="600px">
    <el-form :model="form" ref="formlist" :rules="rules" :label-width="formLabelWidth">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select class="normal" @change="form.role_id=form.role" v-model="form.role" placeholder="请选择状态">
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
         <el-select class="normal" v-model="form.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="remark">
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
import {userAdd,userEditor} from '@/api/user'
export default {
    name:'userDialog',
  data() {
    return {
      dialogFormVisible: false,
      form: { },
      rules: {
        eusername: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],

        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],

        phone: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          {
            pattern: /0?(13|14|15|18|17)[0-9]{9}/,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],

        role: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },
      formLabelWidth: "80px",
      isAdd: true // 用来判断是新建对话框还是编辑对话框
    };
  },
  methods: {
    // 确认按钮点击事件
    sureBtn() {
      this.$refs.formlist.validate(valid => {
        if (valid) {
          if(this.isAdd){
              // 新增对话框
              userAdd(this.form).then(res=>{
                  if(res.data.code==200){
                      this.$message.success('新增成功')
                      this.dialogFormVisible=false,
                      this.$parent.getList()
                      this.cancel()
                  }else{
                      this.$message.error(res.data.message)
                  }
              })
          }else{
              // 编辑对话框
              userEditor(this.form).then(res=>{
                  if(res.data.code==200){
                      this.$message.success('修改成功')
                      this.dialogFormVisible=false,
                      this.$parent.getList()
                      this.cancel()
                  }else{
                      this.$message.error(res.data.message)
                  }
              })
          }
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