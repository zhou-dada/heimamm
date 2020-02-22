<template>
  <el-dialog
    center
    width="603px"
    :show-close="false"
    title="用户注册"
    :visible.sync="dialogFormVisible"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm"  :label-width="formLabelWidth">
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
      <el-form-item label="图形码">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.imgCode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <img class="imgCode" @click="getNewCode" :src="imgCodeUrl" alt />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.rCode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button class="btnCode" :disabled='sec!=0' @click="getUserCode">
              <!-- :disabled='sec'  当sec!=0时才可以重新点击按钮-->
              {{sec==0?"获取验证码":"还剩"+sec+"秒"}}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 对话框是否显示
      dialogFormVisible: false,
      // 图形码地址
      imgCodeUrl: process.env.VUE_APP_URL + "/captcha?type=sendsms",
      // 倒计时秒数
      sec: 0,
      form: {
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
          {min:5,max:14,message:'长度在5-14之间',trigger:'change'}
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
         window.console.log(this.$refs.ruleForm);
         this.newForm()
    },
    // 验证码的点击事件
    getUserCode() {
      this.sec=60
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
      axios({
        url:process.env.VUE_APP_URL+'/sendsms',
        method:'post',
        data: { code:this.form.imgCode,
                phone:this.form.phone
        },
         // 允许携带cookie
        withCredentials:true
      }).then(res=>{
        //成功回调
        window.console.log(res)
        if(res.data.code ==200){
          alert('获取验证码成功'+res.data.data.captcha)
        }else{
          alert(res.data.message)
        }
      });
    },

    // 表单刷新
    newForm(){
      this.$refs.ruleForm.resetFields()
    }

  },
  mounted() {
    this.$nextTick(()=>{
      window.console.log(this.$refs.ruleForm);
    })
  },
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
</style>