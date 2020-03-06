<template>
  <div class="question-wrap">
    <!--上面的卡片-->
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :inline="true"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学科" prop="subject">
          <!--导入学科模块-->
          <subjectSelect v-model="ruleForm.subject"></subjectSelect>
        </el-form-item>

        <el-form-item label="阶段" prop="step">
          <el-select v-model="ruleForm.step" placeholder="请选择阶段">
            <el-option label="初级" value="1"></el-option>
            <el-option label="中级" value="2"></el-option>
            <el-option label="高级" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业" prop="enterprise">
          <!--导入企业模块-->
          <businessSelect v-model="ruleForm.enterprise"></businessSelect>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择活题型">
            <el-option label="单选" value="1"></el-option>
            <el-option label="多选" value="2"></el-option>
            <el-option label="简答" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="ruleForm.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作者" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择状态">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="create_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="ruleForm.create_date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="标题" prop="title" class="title-item">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="addQuestion" icon="el-icon-plus">新增试题</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--下面的卡片-->
    <el-card class="box-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="title" label="题目">
          <template slot-scope="scope">
            <p v-html="scope.row.title"></p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="学科-阶段">
          <template slot-scope="scope">{{scope.row | filterQuestion}}</template>
        </el-table-column>
        <el-table-column prop="type" label="题型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">单选</span>
            <span v-else-if="scope.row.type==2">多选</span>
            <span v-else>简答</span>
          </template>
        </el-table-column>
        <el-table-column prop="enterprise_name" label="企业"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">启用</span>
            <span v-else style="color:red">禁止</span>
          </template>
        </el-table-column>
        <el-table-column prop="reads" label="访问量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="questionEdit(scope.row)">编辑</el-button>
            <el-button
              type="text"
              @click="statusChange(scope.row)"
            >{{scope.row.status==1?'禁止':'启用'}}</el-button>
            <el-button type="text" @click="delQuestion(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页插件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
        background
      ></el-pagination>
    </el-card>
    <!--导入新增题库对话框-->
    <questionAdd ref="add"></questionAdd>
    <!--导入新增题库对话框-->
    <questionEdit ref="edit"></questionEdit>
  </div>
</template>

<script >
// 获取问题列表
import {
  questionList,
  questionStatus,
  questionRemove
} from "@/api/question.js";
// 导入新增题库对话框
import questionAdd from "./components/questionAdd";
import questionEdit from "./components/questionEdit";
export default {
  name:'question',
  components: {
    questionAdd,
    questionEdit
  },
  data() {
    return {
      // 表单绑定的属性
      ruleForm: {
        create_date: ""
      },
      // 时间选择器
      value1: "",
      // 问题表格绑定的数据
      tableData: [],
      // 当前页码
      page: 1,
      // 页容量
      size: 5,
      // 数据总量
      total: 10
    };
  },
  filters: {
    filterQuestion(val) {
      let step = 0;
      if (val.step == 1) {
        step = "初级";
      }
      if (val.step == 2) {
        step = "中级";
      }
      if(val.step == 3) {
        step = "高级";
      }
      return val.subject_name + "~" + step;
    }
  },
  methods: {

    // 编辑按钮点击事件
    questionEdit(items){
        console.log(items);
        this.$refs.edit.dialogFormVisible = true;
        this.$refs.edit.form = {...items};
        this.$refs.edit.form.city = this.$refs.edit.form.city.split(',') // 城市由字符串切换为数组
        this.$refs.edit.form.multiple_select_answer = this.$refs.edit.form.multiple_select_answer.split(',') // 城市由字符串切换为数组
    },
    // 删除按钮点击事件
    delQuestion(item) {
      questionRemove({ id: item.id }).then(res => {
        if (res.data.code == 200) {
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 状态码切换点击事件
    statusChange(item) {
      questionStatus({ id: item.id }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 搜索按钮点击事件
    searchBtn() {
      this.getList();
    },
    // 清除按钮点击使劲按
    clear() {
      this.$refs.ruleForm.resetFields();
      this.getList();
    },
    // 新增按钮点击事件
    addQuestion() {
      this.$refs.add.dialogFormVisible = true;
    },
    // 页容量变化
    handleSizeChange(val) {
      this.size=val
      this.page=1
      this.getList()
    },
    // 页码变化
    handleCurrentChange(val) {
      this.page=val
      this.getList()
    },
    // 数据刷新
    getList() {
      questionList({
        page: this.page,
        limit: this.size,
        ...this.ruleForm
      }).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.data.pagination.total;
          this.tableData = res.data.data.items;
        }
      });
    }
  },
  created() {
    // 获取问题列表
    this.getList();
  }
};
</script>

<style lang="less">
.question-wrap {
  /* 找到除了最后一个el-form-item下面的所有 el-form-item__content
    el-form-item代表的是每一项（代表除了最后一项以外的其他项里所有内容为宽150）
 */
  .el-form--inline {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 150px;
    }
    .el-form-item.title-item .el-form-item__content {
      width: 388px;
    }

    .el-form-item .el-form-item__content .el-date-editor {
      width: 150px;
    }

    .el-form-item__label {
      padding-right: 31px;
      padding-left: 30px;
    }
  }

  .el-card__body {
    padding-left: 0;
  }

  .pagination {
    text-align: center;
    margin-top: 31px;
  }
}
</style>



