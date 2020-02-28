<template>
  <div>
    <!--上面的卡片-->
    <el-card class="box-card">
      <!-- inline可以让表单域变为行内的表单域 true表示为行内表单域  默认为false -->
      <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
        <el-form-item label="学科编号" prop="rid">
          <el-input class="short" v-model="formInline.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input class="normal" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="user">
          <el-input class="short" v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="normal" v-model="formInline.status" placeholder="活动区域">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSeach">搜索</el-button>
          <el-button @click="clearSeach">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addSubject">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--下面的卡片-->
    <el-card class="box-card">
      <!--表格-->
      <el-table :data="tableData" style="width: 100%">
        <!-- 设置type =index 即可显示从1开始的索引号-->
        <el-table-column type="index" label="序号" width="50px"></el-table-column>
        <el-table-column prop="rid" label="学科编号"></el-table-column>
        <el-table-column prop="name" label="学科名称"></el-table-column>
        <el-table-column prop="short_name" label="简称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期">
          <template slot-scope="scope">
            <!--使用过滤器更改日期格式-->
            {{scope.row.create_time | filterTime}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <!--这里不能用三元表达式  要给字体加颜色
                如果想在一行里加按钮 最好用到自定义列  因为可以获取到这一行的数据
                scope.$index 拿到这一行的索引
                scope.row  拿到这一行的数据
            -->
            <!-- <button @click="dosome(scope.$index,scope.row)">点我啊</button> -->
            <span v-if="scope.row.status==1">启用</span>
            <span v-else style="color:red">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editor(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="changStatu(scope.row.id)"
            >{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="delBtn(scope.row)">删除</el-button>
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
        :page-sizes="[5,10, 15, 20, 25]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--新增学科-->
    <subjectAdd ref="add"></subjectAdd>
    <!--编辑学科-->
    <subjectExid ref="editor"></subjectExid>
  </div>
</template>

<script>
import { subjectList, changeStatus, delSubject } from "@/api/subject.js";
// 导入新增学科组件
import subjectAdd from "./components/subjectAdd";
// 导入编辑学科组件
import subjectExid from "./components/subjectExid";

export default {
  components: {
    subjectAdd,
    subjectExid
  },
  data() {
    return {
      // 上面表单绑定的属性
      formInline: {
        rid: "",
        name: "",
        user: "",
        status: ""
      },
      // 当前表格的数据源
      tableData: [],
      // 分页的当前页
      page: 1,
      // 页容量
      size: 5,
      // 数据总量
      total: 0,
      // 记录第一次点击的内容
      isFIrst: ""
    };
  },
  created() {
    // 页面已加载就获取学科列表
    subjectList().then(() => {
      // 调用获取学科列表函数
      this.getList();
    });
  },

  methods: {
    // 删除按钮点击事件
    delBtn(val) {
      delSubject({ id: val.id }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");

          // 判断删除的是不是当前页的最后一条数据
          if(this.tableData.length ==1){
            this.page--  // 页数减减 要刷新上一页
          }

          // 判断删除的是不是总数据的最后一条数据
          if(this.total==0){
            this.page=1// 如果删除最后一条数据 系统会自动的页数-- 需要将也是页数设为1
          }

          this.getList(); // 调用获取学科列表函数用来刷新
        }
      });
    },

    // 编辑按钮点击事件
    editor(items) {
      this.$refs.editor.dialogFormVisible = true; // 让对话框显示
      // 不能用底下的代码  有个bug  对象间地址传递互相影响
      // this.$refs.editor.form=items
      // 解决办法 拷贝一个对象
      // this.$refs.editor.form={...items}
      // 又有一个新要求 要求第一次点击的时候编辑的内容在没保存的情况下再点进去还存在
      if (items != this.isFIrst) {
        // 如果和第一次点击的内容不相同就
        this.$refs.editor.form = { ...items }; // 将拷贝 items的对象赋值给编辑对话框
        this.isFIrst = items; // 将items赋值给isFirst  用来判断接下来的点击的行是不是同一行
      }
    },

    // 新增学科
    addSubject() {
      this.$refs.add.dialogFormVisible = true;
    },

    // 点击清除事件
    clearSeach() {
      // 调用表单重置方法
      // 小细节  要给表单内容添加 prop  要不重置方法不执行
      this.$refs.formInline.resetFields();
      // 根据新的表单内容重新调用请求
      this.page = 1; // 要从第一页开始查看所有
      this.getList();
    },

    // 点击搜索事件
    doSeach() {
      // 直接调用搜索学科列表函数
      this.getList();
    },

    // 页码改变事件
    handleCurrentChange(val) {
      // 将需要查的页码数添加给 this.page
      this.page = val;
      // 重新调用获取列表函数刷新
      this.getList();
    },
    // 页容量改变事件
    handleSizeChange(val) {
      // 将需要查的页容量添加给 this.size
      this.size = val;
      // 重新查找第一页
      this.page = 1;
      // 重新调用获取列表函数刷新
      this.getList();
    },

    // 学科状态点击事件
    changStatu(id) {
      changeStatus({ id: id }).then(() => {
        // 刷新页面就可以了  对表格数据重新请求
        // 调用获取学科列表函数
        this.getList();
      });
    },

    // 封装的获取学科列表的函数
    getList() {
      // 查取的页数 和 页容量 动态添加进去  方便页码页容量点击事件取值
      subjectList({
        page: this.page,
        limit: this.size,
        // 下面的参数  赋值就是筛选出来赋值的那一行   不赋值就是搜索所有的
        name: this.formInline.name,
        rid: this.formInline.rid,
        username: this.formInline.username,
        status: this.formInline.status
      }).then(res => {
        // console.log(res);
        this.tableData = res.data.data.items;
        // 将总数居量添加给this.total
        this.total = res.data.data.pagination.total;
      });
    }
  }
};
</script>

<style>
.box-card {
  margin-bottom: 19px;
}

.el-form-item__content .short {
  width: 100px;
}

.el-form-item__content .normal {
  width: 149px;
}
</style>