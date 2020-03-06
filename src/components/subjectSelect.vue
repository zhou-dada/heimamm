<template>
  <el-select v-model="subject" @change="selChange" placeholder="请选择学科">
    <el-option v-if="isSearch" value="">所有学科</el-option>
    <el-option :label="item.name" v-for="(item, index) in subjectList" :key="index" :value="item.id"></el-option>
  </el-select>
</template>

<script>
// 获取学科列表
import { subjectList } from "@/api/subject.js";
export default {
  name:'subjectSelect',
  props:{
    value:{
      default:''
    },
    isSearch:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      subject: this.value,
      // 学科列表
      subjectList: []
    };
  },
  methods:{
    // 下拉框值发生改变
    selChange(){
      console.log(this.subject);
      this.$emit('input',this.subject)
    }
  },
  watch:{
    value(val){
      this.subject=val
    }
  },
  created() {
    // 获取学科列表
    subjectList({
      status:1
    }).then(res => {
      this.subjectList = res.data.data.items;
    });
  }
};
</script>

<style>
</style>