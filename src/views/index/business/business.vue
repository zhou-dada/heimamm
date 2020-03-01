<template>
  <div>
    <!--上面卡片-->
    <el-card class="box-card">
      <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业编号" prop="eid">
          <el-input class="short" v-model="formInline.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input class="normal" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input class="short" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="normal" v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSeach">搜索</el-button>
          <el-button @click="doClear">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="doAdd">新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--下面卡片-->
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="180px"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="intro" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期">
          <template slot-scope="scope">{{scope.row.create_time | filterTime}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!--这里使用自定义列  不能用三元表达式  这里要给字体添加样式-->
            <span v-if="scope.row.status==1">启用</span>
            <span v-else style="color:red">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="doEdito(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="changeStatus(scope.row.id)"
            >{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="delBtn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5,10, 15, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
    <!--新增对话框-->
    <businessDialog ref="businessDialog"></businessDialog>
    <!--编辑对话框-->
    <!-- <editobussiness ref="edito"></editobussiness> -->
  </div>
</template>

<script>
import { bussnessList, changeStatus, delBussiness } from "@/api/bussiness.js";

// 导入子组件
import businessDialog from "./components/businessDialog";
// import editobussiness from "./components/editobussiness";

export default {
  components: {
    businessDialog
    // editobussiness
  },
  data() {
    return {
      formInline: {
        name: "",
        eid: "",
        username: "",
        status: ""
      },
      // 表格当前页面数据源
      tableData: [],
      // 数据源总数据量
      total: 10,
      // 当前页码
      page: 1,
      // 页容量
      size: 5,
      // 记录第一次点击的值
      isFirst: ""
    };
  },
  methods: {
    // 删除按钮点击事件
    delBtn(items) {
      delBussiness({ id: items.id }).then(res => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          // 判断删除的是不是当前页的最后一条数据
          if (this.tableData.length == 1) {
            this.page--; // 页数减减 要刷新上一页
          }

          // 判断删除的是不是总数据的最后一条数据
          if (this.total == 0) {
            this.page = 1; // 如果删除最后一条数据 系统会自动的页数-- 需要将也是页数设为1
          }
          //重新加载企业列表
          this.getList();
        }
      });
    },

    // 编辑按钮点击事件
    doEdito(items) {
      this.$refs.businessDialog.dialogFormVisible = true;

      this.$refs.businessDialog.isAdd = false;

      // 不能用底下的代码  有个bug  对象间地址传递互相影响
      // this.$refs.editor.form=items
      // 解决办法 拷贝一个对象
      // this.$refs.editor.form={...items}
      // 又有一个新要求 要求第一次点击的时候编辑的内容在没保存的情况下再点进去还存在
      if (this.isFirst != items) {
        this.$refs.businessDialog.form = { ...items }; // 将拷贝 items的对象赋值给编辑对话框
        this.isFirst = items; // 将items赋值给isFirst  用来判断接下来的点击的行是不是同一行
      }
    },

    // 新增按钮点击事件
    doAdd() {
      this.$refs.businessDialog.dialogFormVisible = true;
      this.$refs.businessDialog.isAdd = true; // 切换为新建页面
      this.$refs.businessDialog.form = {}; // 清空表单数据
    },

    // 搜索按钮点击事件
    doSeach() {
      // 直接企业列表接口函数
      this.getList();
    },

    // 清除按钮点击事件
    doClear() {
      this.$refs.formInline.resetFields();
      // 也要重新加载企业列表
      this.getList();
    },

    // 状态切换点击事件
    changeStatus(id) {
      changeStatus({ id: id }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          // 其实为200就已经自动切换状态了  刷新表格就行
          this.getList();
        }
      });
    },

    // 页容量变化的时候触发
    handleSizeChange(val) {
      this.size = val;
      this.page = 1; // 当页容量变化时  默认加载第一页
      this.getList(); // 也要重新加载企业列表
    },
    // 页码变化的时候触发
    handleCurrentChange(val) {
      this.page = val; // 将点击时页码赋值给 page
      this.getList(); // 也要重新加载企业列表
    },

    // 封装企业列表接口
    getList() {
      bussnessList({
        page: this.page,
        limit: this.size,
        name: this.formInline.name,
        status: this.formInline.status,
        eid: this.formInline.eid,
        username: this.formInline.username
      }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    }
  },

  // 页面一加载就调用企业列表接口
  created() {
    this.getList();
  }
};
</script>

<style>
</style>