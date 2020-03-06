<template>
  <el-select v-model="business" @change="selChange" placeholder="请选择企业">
    <el-option value=""  v-if="isSearch">所有企业</el-option>
    <el-option
      :label="item.intro"
      v-for="(item, index) in bussnessList"
      :key="index"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
// 获取企业列表
import { bussnessList } from "@/api/bussiness.js";
export default {
    props:{
        value:{
            default:''
        },
        isSearch:{
          default:true,
          type:Boolean
        }
    },
  data() {
    return {
      business: this.value,
      bussnessList: [],
      
    };
  },
  methods:{
      selChange(){
          this.$emit('input',this.business)
      }
  },
  watch: {
    value(val){
      this.business=val
    }
  },
  created() {
    // 获取企业列表
    bussnessList().then(res => {
      this.bussnessList = res.data.data.items;
    });
  }
};
</script>

<style>
</style>