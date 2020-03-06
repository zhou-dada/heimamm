<template>
  <div>
    <!--上面的卡片-->
    <el-card class="box-card">
      <!-- inline可以让表单域变为行内的表单域 true表示为行内表单域  默认为false -->
      <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名称" prop="username">
          <el-input class="short" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input class="normal" v-model="formInline.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select class="normal" v-model="formInline.role_id" placeholder="请选择状态">
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSeach">搜索</el-button>
          <el-button @click="doClear">清除</el-button>
          <el-button type="primary" @click="addUser" icon="el-icon-plus">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--下面的卡片-->
    <el-card class="box-card">
      <!--表格-->
      <el-table :data="tableData" border style="width: 100%">
        <!-- 设置type =index 即可显示从1开始的索引号-->
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!--这里不能用三元表达式  要给字体加颜色
                如果想在一行里加按钮 最好用到自定义列  因为可以获取到这一行的数据
                scope.$index 拿到这一行的索引
                scope.row  拿到这一行的数据
            -->
            <!-- <button @click="dosome(scope.$index,scope.row)">点我啊</button> -->
            <span v-if="scope.row.status==1" >启用</span>
            <span v-else style="color:red">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="role_id" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="['超级管理员','管理员'].includes($store.state.role)" @click="shoEdit(scope.row)">编辑</el-button>
            <el-button
            v-if="['超级管理员','管理员'].includes($store.state.role)"
              @click="changeStatus(scope.row.id)"
              type="text"
            >{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button @click="delUser(scope.row.id)" v-if="['超级管理员','管理员','老师'].includes($store.state.role)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器-->
      <!--
        current-page:  设置当前是第几夜
        page-sizes:  设置可以选择的页容量(每页显示多少条)
        page-size:  这是显示当前页容量是多少
        layout: 设置分页的布局效果,一般不会改这个
        total:  设置数据总条数 (数据的总量)
        ******  没有必要再自己设置页数  饿了么UI会自动根据数据的条数和选择的页容量去
                计算出共有多少页
        size-shange  页容量的改变事件
        current-change   当前页发生改变的事件

        background 加上就会有灰色的背景色
      -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[3,5,10, 15, 20, 25]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <userDialog ref="dialog"></userDialog>
  </div>
</template>

<script>
import { userList, userStatus,userDel } from "@/api/user.js";
// 导入对话框
import userDialog from "./components/userDialog";
export default {
  components: {
    userDialog
  },
  data() {
    return {
      // 表单绑定的属性
      formInline: {},
      // 表格当前页数据源
      tableData: [],
      // 总数据
      total: 5,
      // 当前页
      page: 1,
      // 页容量
      limit: 3,
      // 判断是不是第一次点击的按钮
      isFirst: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {

    // 删除按钮点击事件
    delUser(id){
      userDel({id}).then(res=>{
        if(res.data.code==200){
          this.$message.success('删除成功')
          
          // 判断删除的是否是当前页最后一个
          if(this.tableData.length==1){
            this.pagination--
          }
          // 判断删除的是否为数据源最后一个
          if(this.total==0){
            this.page=1
          }
          this.getList()
        }else{
          this.$message.error(res.data.message)
        }
      })
    },

    // 编辑按钮点击事件
    shoEdit(items) {
      this.$refs.dialog.dialogFormVisible = true;
      this.$refs.dialog.isAdd=false
    // 用来判断是否为当前点击的按钮是上一次点击的按钮
      if (this.isFirst != items) {
        this.$refs.dialog.form = { ...items };
        this.isFirst=items
      }
    },

    // 新增按钮点击事件
    addUser() {
      this.$refs.dialog.dialogFormVisible = true;
    },

    // 清除按钮点击事件
    doClear() {
      this.$refs.formInline.resetFields();
      this.page = 1;
      this.getList();
    },

    // 搜索按钮点击事件
    doSeach() {
      this.getList();
    },

    // 用户状态切换
    changeStatus(id) {
      userStatus({ id }).then(res => {
        if (res.data.code == 200) {
          this.getList();
        }
      });
    },

    // 页容量改变事件
    handleSizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList();
    },
    // 页码改变事件
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },

    // 封装获取列表函数
    getList() {
      userList({
        page: this.page,
        limit: this.limit,
        ...this.formInline
      }).then(res => {
        if (res.data.code == 200) {
          (this.tableData = res.data.data.items),
            (this.total = res.data.data.pagination.total);
        }
      });
    }
  }
};
</script>

<style>
</style>