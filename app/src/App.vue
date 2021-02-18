<template lang="pug">
  el-upload.wrap(drag multiple action="/api/files/upload")
    i.el-icon-upload
    .el-upload__text
      span 将文件拖到此处，或
      em 点击上传
    .upload__tip
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      accept: ''
    }
  },
  components: {}
}
</script>

<style>
.wrap {
  display: flex;
  justify-content: center;
  margin-top: 200px;
}
</style>
