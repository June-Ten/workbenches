<template>
  <el-collapse-item title="图表副标题设置" name="3">
    <el-form-item label="副标题名称" class="zztC">
      <el-input v-model="activeData.option.titleSubtext" placeholder="请输入副标题名称" />
    </el-form-item>
    <el-form-item label="字体大小" class="zztC">
      <el-input-number v-model="activeData.option.titleSubtextStyleFontSize"
        controls-position="right" :min="12" :max="25" />
    </el-form-item>
    <el-form-item label="字体加粗" class="zztC">
      <el-switch v-model="activeData.option.titleSubtextStyleFontWeight" />
    </el-form-item>
    <el-form-item label="字体颜色" style="height:32px" class="zztC">
      <el-color-picker v-model="activeData.option.titleSubtextStyleColor" />
    </el-form-item>
  </el-collapse-item>
</template>
<script>
export default {
  props: ['activeData', 'showType'],
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>
<style lang="css">
.zztC {
  .el-form-item__label {
    color: #000 !important;
  }
}
</style>