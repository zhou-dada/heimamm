<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="avatarUoload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传avi/mp4文件，且不超过2mb</div>
    </el-upload>
    <!-- 预览视频 -->
    <video :src="videoUrl" controls></video>
  </div>
</template>

<script>
export default {
  props:['video'],
  data() {
    return {
      // 上传视频地址
      avatarUoload: process.env.VUE_APP_URL + "/question/upload",
      // 视频地址
      videoUrl: ""
    };
  },
  methods: {
    // 上传成功的钩子
    handleAvatarSuccess(res, file) {
      this.videoUrl = URL.createObjectURL(file.raw);
      this.$emit('update:video',res.data.url)
    },

    // 上传之前触发
    beforeAvatarUpload(file) {
      const isJPG = file.type === "video/mp4" ;
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error("上传视频只能是 视频 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传视频大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style>
</style>