<template>
  <el-cascader
  v-model="city"
  :options="options" 
  :props="{ expandTrigger: 'hover',value:'label'}"
   @change="handleChange"></el-cascader>
</template>

<script>
import { regionDataPlus } from "element-china-area-data";
export default {
    props:{
        value:{
            default:''
        }
    },
    data() {
        return {
            city:this.value,
            options:regionDataPlus
        }
    },
    methods: {
        handleChange(val){
            this.$emit('input',val)
        }
    },
};
</script>

<style>
</style>