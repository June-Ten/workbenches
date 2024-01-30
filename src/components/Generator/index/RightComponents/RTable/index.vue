<template>
  <el-row>
    <el-divider>功能配置</el-divider>
    <el-form-item label="显示标题">
      <el-switch v-model="activeData.__config__.showTitle" />
    </el-form-item>
    <el-form-item label="删除按钮">
      <el-switch v-model="activeData.showDeleteBtn" />
    </el-form-item>
    <el-form-item label="添加按钮">
      <el-switch v-model="activeData.showAddBtn" @change="addBtnChange" />
    </el-form-item>
    <template v-if="activeData.showAddBtn">
      <el-form-item v-if="activeData.actionText !== undefined" label="动作文字">
        <el-input v-model="activeData.actionText" placeholder="请输入动作文字" />
      </el-form-item>
      <el-form-item label="动作设置" v-if="activeData.showAddBtn">
        <el-switch v-model="activeData.addType" :active-value="1" :inactive-value="0"
          @change="setAction" />
      </el-form-item>
      <el-form-item label="动作表单" v-if="activeData.addType==1">
        <el-button style="width: 100%;" @click="editConf()">配置表单</el-button>
      </el-form-item>
    </template>
    <el-form-item label="合计设置">
      <el-switch v-model="activeData.showSummary" />
    </el-form-item>
    <el-form-item label="合计字段" v-if="activeData.showSummary">
      <el-select v-model="activeData.summaryField" multiple placeholder="请选择合计字段">
        <template v-for="(item,i) in activeData.__config__.children">
          <el-option :key="i" :label="item.__config__.label" :value="item.__vModel__"
            v-if="['input','inputNumber','calculate'].includes(item.__config__.jnpfKey) && item.__vModel__" />
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="复杂表头" v-show="showType==='pc'">
      <el-button style="width: 100%;"
        @click="addComplexHeader">{{activeData.__config__.complexHeaderList.length?'编辑复杂表头':'复杂表头配置'}}</el-button>
    </el-form-item>
    <Form v-if="formVisible" ref="Form" @submit="updateConf" />
    <ComplexHeader v-if="complexHeaderVisible" ref="ComplexHeader" @closeForm='closeForm' />
  </el-row>
</template>
<script>
import Form from './AddTableForm'
import ComplexHeader from '@/components/Generator/components/ComplexHeader'
const defaultAddTableConf = {
  popupTitle: '选择数据',
  popupType: 'dialog',
  popupWidth: '800px',
  interfaceId: '',
  interfaceName: '',
  templateJson: [],
  hasPage: true,
  pageSize: 20,
  columnOptions: [],
  relationOptions: [],
}
export default {
  props: ['activeData', 'showType'],
  components: { Form, ComplexHeader },
  data() {
    return {
      formVisible: false,
      thousandsOptions: [],
      complexHeaderVisible: false
    }
  },
  methods: {
    editConf() {
      if (!this.activeData.addTableConf) {
        this.activeData.addTableConf = JSON.parse(JSON.stringify(defaultAddTableConf))
      }
      let addTableConf = JSON.parse(JSON.stringify(this.activeData.addTableConf))
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(addTableConf, this.activeData.__config__.children)
      })
    },
    addBtnChange(e) {
      if (!e) {
        this.activeData.addType = e ? 1 : 0
        this.activeData.addTableConf = JSON.parse(JSON.stringify(defaultAddTableConf))
      }
    },
    setAction(e) {
      if (!e) this.activeData.addTableConf = JSON.parse(JSON.stringify(defaultAddTableConf))
    },
    closeForm(val) {
      if (val) this.activeData.__config__.complexHeaderList = val
      this.complexHeaderVisible = false
    },
    addComplexHeader() {
      this.complexHeaderVisible = true
      let list = this.activeData.__config__.children.filter(o => o.__vModel__)
      this.$nextTick(() => {
        this.$refs.ComplexHeader.init(this.activeData.__config__.complexHeaderList, list)
      })
    },
    updateConf(data) {
      this.activeData.addTableConf = data
    }
  }
}
</script>