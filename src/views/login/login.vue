<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="title-box">
        <img class="logo" src="./images/title-logo.png" alt />
        <span class="left-title">黑马面面</span>
        <span class="line"></span>
        <span class="right-title">用户登录</span>
      </div>

      <el-form class="demo-ruleForm" :rules="rules" :model="form" label-width="43px" ref="ruleForm">
        <el-form-item prop="user">
          <el-input
            class="border"
            placeholder="请输入手机号"
            v-model="form.user"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="border"
            placeholder="请输入密码"
            v-model="form.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row>
            <el-col :span="17">
              <el-input
                class="border"
                placeholder="请输入验证码"
                v-model="form.code"
                prefix-icon="el-icon-key"
              ></el-input>
            </el-col>
            <el-col :span="7">
              <img class="codeimg" src="./images/code.png" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="agree">
          <div class="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            我已阅读并同意
            <el-link type="primary" class="agreeson" :underline="false">用户协议</el-link>
            <span>和</span>
            <el-link type="primary" class="agreeson" :underline="false">隐私条款</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="btnwidth" @click="loginBtn" type="primary">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="btnwidth" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </div>

    <img src="./images/login_banner_ele.png" alt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        agree: false,
        user: "",
        password: "",
        code: ""
      },
      rules: {
        user: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        agree: [
          // 多选框没有失去焦点，只有值改变事件
          // 因为checkbox其实他不可能值为空，除非你强行赋值为空
          // 所以我们不能拿值是否为空来做验证了
          // { required:true, message:'必须勾选同意用户协议',trigger:"change"},

          // 只有值为true才满足条件，否则代表不匹配
          // { required: true, message: "必须勾选同意用户协议", trigger: "blur" },
          { pattern:/true/,message:'必须勾选同意用户协议',trigger:'change'}
          ]
      }
    };
  },
  methods: {
    loginBtn() {
      // 找到表单对象，调用validate方法
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.login-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );

  .login-box {
    width: 478px;
    height: 550px;
    background-color: #fff;
    padding-right: 41px;
    box-sizing: border-box;

    .title-box {
      display: flex;
      margin-top: 50px;
      margin-left: 48px;
      align-items: center;
      margin-bottom: 30px;

      .logo {
        margin-right: 16px;
        height: 17px;
        width: 22px;
      }

      .left-title {
        margin-right: 14px;
        font-size: 24px;
      }

      .line {
        width: 1px;
        height: 28px;
        background: rgba(199, 199, 199, 1);
        margin-right: 12px;
      }

      .right-title {
        font-size: 22px;
      }
    }
  }

  .codeimg {
    width: 100%;
    height: 42px;
    vertical-align: bottom;
  }

  .agree {
    display: flex;
  }

  .btnwidth {
    width: 100%;
  }
}
</style>