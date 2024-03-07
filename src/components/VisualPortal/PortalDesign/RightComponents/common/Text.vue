<template>
  <div>
    <el-form-item label="文本大小" class="textC">
      <el-input-number v-model="activeData.option.textFontSize" controls-position="right" :min="12"
        :max="25" />
    </el-form-item>
    <el-form-item label="文本加粗" class="textC">
      <el-switch v-model="activeData.option.textFontWeight" />
    </el-form-item>
    <el-form-item label="文本斜体" v-if="activeData.jnpfKey=='text'" class="textC">
      <el-switch v-model="activeData.option.textFontStyle" />
    </el-form-item>
    <el-form-item label="文本颜色" style="height:32px" class="textC">
      <el-color-picker v-model="activeData.option.textFontColor" />
    </el-form-item>
    <el-form-item label="文本位置" class="textC">
      <el-radio-group v-model="activeData.option.textLeft" size="small">
        <el-radio-button :label="item.value" v-for="(item,index) in alignList" :key="index">
          {{item.label}}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="文本下划线" v-if="activeData.jnpfKey=='text'" class="textC">
      <el-radio-group v-model="activeData.option.textUnderLine" size="small">
        <el-radio-button :label="item.value" v-for="(item,index) in underLineList" :key="index">
          {{item.label}}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="背景色" style="height:32px" class="textC">
      <el-color-picker v-model="activeData.option.textBgColor" />
    </el-form-item>
  </div>
</template>
<script>
import {
  alignList,
  underLineList,
} from '../../components/config'
export default {
  props: ['activeData'],
  data() {
    return {
      alignList,
      underLineList
    }
  },

  methods: {

  }
}
</script>
<style lang="css">
.textC {
  .el-form-item__label {
    color: #000 !important;
  }
}
</style>