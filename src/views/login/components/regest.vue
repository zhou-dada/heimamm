<template>
  <el-dialog
    center
    width="603px"
    :show-close="false"
    title="用户注册"
    :visible.sync="dialogFormVisible"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="头像" prop="userIcon">
        <el-upload
          v-model="form.userIcon"
          name="image"
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="图形码" prop="imgCode">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.imgCode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <img class="imgCode" @click="getNewCode" :src="imgCodeUrl" alt />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="rcode">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.rcode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button class="btnCode" :disabled="sec!=0" @click="getUserCode">
              <!-- :disabled='sec'  当sec!=0时才可以重新点击按钮-->
              {{sec==0?"获取验证码":"还剩"+sec+"秒"}}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureBtn">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import axios from 'axios'
import { sendSMS, register } from "@/api/regest";
export default {
  data() {
    return {
      // 要上传图片的接口地址
      uploadUrl: process.env.VUE_APP_URL + "/uploads",
      // 上传后的图片临时路径
      imageUrl: "",

      // 对话框是否显示
      dialogFormVisible: false,
      // 图形码地址
      imgCodeUrl: process.env.VUE_APP_URL + "/captcha?type=sendsms",
      // 倒计时秒数
      sec: 0,
      form: {
        userIcon: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        imgCode: "",
        rcode: ""
      },
      rules: {
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /0?(13|14|15|18|17)[0-9]{9}/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 14, message: "长度在5-14之间", trigger: "change" }
        ],
        userIcon: [
          { required: true, message: "用户头像不能为空", trigger: "change" }
        ],
        imgCode: [
          { required: true, message: "图片验证不能为空", trigger: "blur" },
          { len: 4, message: "图片验证码是4位", trigger: "blur" }
        ],
        rcode: [
          { required: true, message: "手机验证码不能为空", trigger: "blur" },
          { len: 4, message: "手机验证码是4位", trigger: "blur" }
        ]
      },
      formLabelWidth: "65px"
    };
  },
  methods: {
    // 图片的点击事件
    getNewCode() {
      // 浏览器缓存机制  专门用来解决请求缓存的两套方案
      // 1. 随机数（用的少一点）
      // this.picCodeUrl = process.env.VUE_APP_URL +  "/captcha?type=sendsms&sb=" + Math.random()
      // 2.时间戳
      this.imgCodeUrl =
        process.env.VUE_APP_URL + "/captcha?type=sendsms$_t=" + Date.now();
    },
    // 验证码的点击事件
    getUserCode() {
      // 判断手机号是否出现错误
      // 如果错误就弹出提示框  return阻止后面的代码运行
      if (!/0?(13|14|15|18|17)[0-9]{9}/.test(this.form.phone)) {
        return this.$message.error("手机号格式不正确");
      }
      // 判断验证码长度是否为4位数
      if (!/4/.test(this.form.imgCode.length)) {
        return this.$message.error("图形吗不正确");
      }

      this.sec = 60;
      // 每隔一秒触发一次定时器
      // 这里要用箭头函数 这里this指的是上一级的this   function种this指的是window
      let timerId = setInterval(() => {
        this.sec--;
        if (this.sec == 0) {
          clearInterval(timerId);
        }
      }, 1000);

      //发请求获取手机验证码
      // axios如果发跨域请求，默认不会携带cookie
      // axios({
      //   url:process.env.VUE_APP_URL+'/sendsms',
      //   method:'post',
      //   data: { code:this.form.imgCode,
      //           phone:this.form.phone
      //   },
      //    // 允许携带cookie
      //   withCredentials:true
      // }).then(res=>{
      //   //成功回调
      //   window.console.log(res)
      //   if(res.data.code ==200){
      //     // alert('获取验证码成功'+res.data.data.captcha)
      //     this.$message.success('发送验证码成功')
      //   }else{
      //     // alert(res.data.message)
      //     this.$message.error('图形码错误')
      //   }
      // });
      sendSMS({
        code: this.form.imgCode,
        phone: this.form.phone
      }).then(res => {
        if (res.data.code == 200) {
          this.$message.success("发送验证码成功");
        } else {
          this.$message.error("图形码错误");
        }
      });
    },

    // 上传成功调用的钩子
    // res就是响应报文
    // file就是文件信息
    handleAvatarSuccess(res, file) {
      // 把图片转成了临时路径,给了imageUrl
      // 所以此时img标签有值，但是avatar有值吗？没有值
      this.imageUrl = URL.createObjectURL(file.raw);

      // 上传成功还要给avatar赋值,手动来赋值才让他有值的，没有事件重新校验
      this.form.userIcon = res.data.file_path;
      // 这个时候我们就要想办法，单独对这一个属性做一次校验
      this.$refs.ruleForm.validateField("userIcon");
    },

    // 上传之前调用的钩子
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png" || "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像的文件只能是 图片 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 表单刷新
    newForm() {
      // 表单重置
      this.$refs.ruleForm.resetFields();
      // 而img不是表单元素  所以只要img绑定的url还在  就会一直显示
      this.imageUrl=''
    },
    // 注册确认点击事件
    sureBtn() {
      //要找到表单对象（就先要给表单加ref属性）
      this.$refs.ruleForm.validate(v => {
        if (v) {
          register({
            username: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            avatar: this.form.userIcon,
            password: this.form.password,
            rcode: this.form.rcodeA
          }).then(res => {
            window.console.log(res);
            if (res.data.code == 200) {
              this.$message.success("恭喜你,注册成功");
              // 重置表单  调用页面刷新
              this.newForm()
               //注册成功，关闭对话框
              this.dialogFormVisible = false
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.el-dialog__header {
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );

  .el-dialog__title {
    color: #fff;
    font-size: 18px;
  }
}

.imgCode {
  width: 100%;
  height: 41px;
  vertical-align: middle;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader {
  text-align: center;
}
</style>