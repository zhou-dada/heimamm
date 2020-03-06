<template>
  <el-container class="container">
    <el-header>
      <div class="left">
        <i @click="isCollapse=!isCollapse" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
        <img src="./images/logo.png" alt />
        <span>黑马面面</span>
      </div>
      <div class="right">
        <img class="userIcon" :src="$store.state.avatar" alt />
        <span class="text">{{$store.state.username}},你好</span>
        <el-button type="primary" @click="logout" size="mini">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <!-- auto  自动宽度  内容多宽盒子多宽 
        default-active: 设置默认选中的菜单-->
        <el-menu
          router
          default-active="/index/chart"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <!--v-for和v-if不能写在同一个标签上），在菜单上包了一个template，v-for template就行了-->
          <template v-for="(item, index) in childrenRouter">
            <el-menu-item
              :index="'/index/'+item.path"
              :key="index"
              @click="iconClick"
              v-if="item.meta.roles.includes($store.state.role)"
            >
              <i :class="item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>
          </template>
          
        </el-menu>
      </el-aside>

      <el-main>
        <!--子路由出口-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { exitLogin } from "@/api/index.js";
import { removeToken, getToken } from "@/utilis/token.js";
// 导入路由子组件
import childrenRouter from "@/router/childrenRouter";
export default {
  data() {
    return {
      // 事件路由子组件
      childrenRouter,
      username: "",
      avatar: "",
      isCollapse: false // 是否折叠菜单
    };
  },
  beforeCreate() {
    // 查看token是否为空  判断有没有登录
    if (getToken() == null) {
      // 在没有登录的情况下 token为null
      this.$message.error("请先登录");
      this.$router.push("/login");
    }
  },
  // created() {

  //   get_user().then(res => {
  //     // window.console.log(res);
  //     this.username = res.data.data.username;
  //     this.avatar = process.env.VUE_APP_URL + "/" + res.data.data.avatar;
  //     //因为res.data.data.avatar  获取的头像地址不完整  需要加上基地址  并且要用 '/' 连接起来
  //   });
  // },

  methods: {
    // 退出登录点击事件
    logout() {
      this.$confirm("您将退出本系统, 是否继续?", "是否退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          exitLogin().then(res => {
            window.console.log(res);
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              // 跳转页面
              this.$router.push("/login");
              // 清楚本地token
              removeToken();

              // 清空vuex
              this.$store.commit("changeAvatar", "");
              this.$store.commit("changeUsername", "");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 列表伸缩展开点击事件
    iconClick() {
      this.isCollapse = false;
    }
  }
};
</script>

<style lang="less">
.container {
  height: 100%;

  .el-header {
    height: 60px;
    display: flex;
    justify-content: space-between;

    .left {
      height: 100%;
      display: flex;
      align-items: center;

      i {
        margin-right: 22px;
        font-size: 34px;
      }

      img {
        height: 28px;
        width: 33px;
        margin-right: 11px;
      }

      span {
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(73, 161, 255, 1);
      }
    }

    .right {
      height: 100%;
      display: flex;
      align-items: center;

      .userIcon {
        width: 43px;
        height: 43px;
        margin-right: 9px;
      }

      .text {
        font-size: 14px;
        color: rgba(99, 99, 99, 1);
        margin-right: 38px;
        font-family: Microsoft YaHei;
        font-weight: bold;
      }
    }
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-main {
    background-color: #0094ff;
  }
}
</style>