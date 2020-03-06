<template>
  <el-dialog
  destroy-on-close 
    class="addDialog"
    title="新增题库"
    fullscreen
    :visible.sync="dialogFormVisible"
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="学科"  prop="subject">
        <subjectSelect :isSearch='false' v-model="form.subject"></subjectSelect>
      </el-form-item>

      <el-form-item label="阶段" prop="step">
        <el-select v-model="form.step">
          <el-option label="初级" :value="1"></el-option>
          <el-option label="中级" :value="2"></el-option>
          <el-option label="高级" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="企业" prop="enterprise">
        <businessSelect :isSearch='false' v-model="form.enterprise"></businessSelect>
      </el-form-item>

      <el-form-item label="城市" prop="city">
        <ChinaArear v-model="form.city"></ChinaArear>
        <!-- <el-cascader v-model="form.city" :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader> -->
      </el-form-item>

      <el-form-item label="题型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">单选</el-radio>
          <el-radio :label="2">多选</el-radio>
          <el-radio :label="3">简答</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="难度" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <el-radio :label="1">简单</el-radio>
          <el-radio :label="2">一般</el-radio>
          <el-radio :label="3">困难</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--分割线-->
      <el-divider class="line"></el-divider>

      <!--富文本-->
      <el-form-item label="试题标题" prop="answer_analyze">
        <myEditor v-model="form.title"></myEditor>
      </el-form-item>

      <el-form-item v-if="form.type==1" prop="single_select_answer" label="单选">
        <el-radio-group v-model="form.single_select_answer">
          <!--选项组件-->
          <options
            v-for="(item, index) in form.select_options"
            :key="index"
            :label="item.label"
            :image.sync="item.image"
            :text.sync="item.text"
          ></options>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-else-if="form.type==2" prop="multiple_select_answer" label="多选">
        <div>
          <el-checkbox-group v-model="form.multiple_select_answer">
            <!--选择组件-->
            <options
              v-for="(item, index) in form.select_options"
              :key="index"
              :label="item.label"
              :image.sync="item.image"
              :text.sync="item.text"
              :isRadio="false"
            ></options>
          </el-checkbox-group>
        </div>
      </el-form-item>

      <el-form-item v-else label="简答" prop="short_answer">
        <el-input type="textarea" :rows="2" v-model="form.short_answer"></el-input>
      </el-form-item>

      <!--分割线-->
      <el-divider class="line"></el-divider>

      <!--视频组件-->
      <el-form-item label="解析视频" prop="video">
        <videoUpload :video.sync="form.video"></videoUpload>
      </el-form-item>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>

      <!--分割线-->
      <el-divider class="line"></el-divider>

      <!--富文本-->
      <el-form-item label="答案解析" prop="answer_analyze">
        <myEditor v-model="form.answer_analyze"></myEditor>
      </el-form-item>

      <!--分割线-->
      <el-divider class="line"></el-divider>

      <el-form-item label="试题备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="btn">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editor">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
// 导入城市级联组件
import ChinaArear from "./ChinaArear.vue";
// 导入富文本组件
import myEditor from "./myEditor.vue";
// 导入选项组件
import options from "./options";
// 导入视频组件
import videoUpload from "./videoUpload";
// 导入创建接口
import {questionEdit} from "@/api/question";
export default {
    name:'questionEdit',
  components: {
    ChinaArear,
    myEditor,
    options,
    videoUpload
  },
  data() {
    return {
      // 对话框是否显示或隐藏
      dialogFormVisible: false,
      // 表单绑定的属性
      form: {
        // 存视频地址的
        video: "",
        // 存题型的
        type: 1,
        // 多选绑定答案，记得给数组
        multiple_select_answer: [],
        // 单选绑定答案
        single_select_answer: "",
        // 简答绑定答案
        short_answer: "",
        // 跟选项绑定的数组
        select_options: [
          
        ]
      },
      rules: {
        title: { required: true, message: "标题不能为空", trigger: "blur" },
        subject: { required: true, message: "学科不能为空", trigger: "change" },
        step: { required: true, message: "阶段不能为空", trigger: "change" },
        enterprise: {
          required: true,
          message: "企业不能为空",
          trigger: "change"
        },
        city: { required: true, message: "城市不能为空", trigger: "change" },
        type: { required: true, message: "题型不能为空", trigger: "change" },
        difficulty: {
          required: true,
          message: "难度不能为空",
          trigger: "change"
        },
        single_select_answer: {
          required: true,
          message: "单选答案不能为空",
          trigger: "change"
        },
        multiple_select_answer: {
          required: true,
          message: "多选答案不能为空",
          trigger: "change"
        },
        short_answer: {
          required: true,
          message: "简答题的答案不能为空",
          trigger: "blur"
        },
        answer_analyze: {
          required: true,
          message: "答案解析不能为空",
          trigger: "blur"
        },
        remark: { required: true, message: "试题备注不能为空", trigger: "blur" }
      }
    };
  },
 
  methods: {
      editor(){
          this.$refs.form.validate(v=>{
              if(v){
                  questionEdit(this.form).then(res=>{
                      if(res.data.code==200){
                          this.dialogFormVisible=false
                          this.$parent.getList()
                          this.$refs.form.resetFields()
                          this.$message.success('修改成功')
                      }else{
                          this.$message.error(res.data.message)
                      }
                  })
              }
          })
      }
  },
};
</script>

<style lang='less'>
.addDialog {
  .avatar-uploader {
    text-align: left;
    .el-upload__tip {
      margin-left: 415px;
    }
  }

  .btn {
    text-align: center;
  }

  .el-radio-group{
    margin-top: 12px;
  }

  .el-textarea {
    display: block;
    width: 800px;
    height: 52px;
    margin-top: 30px;
    margin-left: 338px;
    margin-bottom: 30px;
  }

  video {
    margin-left: 415px;
    margin-top: 20px;
    width: 400px;
    height: 300px;
  }

  .el-select {
    width: 364px;
  }

  .el-form-item__label {
    margin-right: 41px;
    margin-left: 308px;
  }

  .line {
    width: 832px;
    margin-left: 298px;
  }

  .el-radio-group {
    display: block;
    margin-left: 358px;
  }
  .el-checkbox-group {
    margin-left: 358px;

    .el-checkbox {
      margin-right: 29px;
    }
  }
}
</style>