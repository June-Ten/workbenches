
<template>
  <el-drawer size="600px" class="drawer JNPF-common-drawer" :visible.sync="visible" @close="cancel"
    v-if="properties" append-to-body :wrapperClosable="false">
    <!-- 标题 -->
    <header slot="title" class="header">{{properties.title}}</header>

    <!-- 发起节点配置 -->
    <StartNode ref="startNodeRef" :formConf="startForm" :integrateType="integrateType"
      :formFieldsOptions="formFieldsOptions" :getFormFieldList="getFormFieldList"
      v-if="value && isStartNode()" />
    <!-- 新增数据节点配置 -->
    <AddDataNode ref="addNodeRef" :formConf="addDataForm" :integrateType="integrateType"
      :usedFormItems="usedFormItems" :formFieldsOptions="formFieldsOptions"
      :flowOptions='flowOptions' :getFormFieldList="getFormFieldList"
      v-if="value && isAddDataNode()" :key="key" />
    <!-- 更新数据节点配置 -->
    <UpdateDataNode ref="updateNodeRef" :formConf="updateDataForm" :integrateType="integrateType"
      :flowOptions='flowOptions' :usedFormItems="usedFormItems"
      :formFieldsOptions="formFieldsOptions" :key="key" :getFormFieldList="getFormFieldList"
      v-if="value && isUpdateDataNode()" />
    <!-- 删除数据节点配置-->
    <DeleteDataNode ref="deleteNodeRef" :formConf="deleteDataForm" :integrateType="integrateType"
      :usedFormItems="usedFormItems" :formFieldsOptions="formFieldsOptions" :key="key"
      :getFormFieldList="getFormFieldList" v-if="value && isDeleteDataNode()" />
    <!-- 数据接口节点配置 -->
    <DataInterfaceNode ref="dataNodeRef" :formConf="dataInterfaceForm"
      :formFieldsOptions="formFieldsOptions" v-if="value && isDataInterfaceNode()" />
    <!-- 消息通知节点节点配置-->
    <MessageNode ref="messageNodeRef" :formConf="messageForm" :formFieldsOptions="formFieldsOptions"
      v-if="value && isMessageNode()" />
    <!-- 获取数据节点节点配置 -->
    <GetDataNode ref="getDataNodeRef" :formConf="getDataForm" :usedFormItems="usedFormItems"
      :formFieldsOptions="formFieldsOptions" :getFormFieldList="getFormFieldList"
      v-if="value && isGetDataNode()" />
    <div class="actions">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { getFormInfo } from '@/api/workFlow/FormDesign'
import { NodeUtils } from "../FlowCard/util"
import nodeConfig from "../FlowCard/config"
import StartNode from './StartNode'
import AddDataNode from './AddDataNode'
import UpdateDataNode from './UpdateDataNode'
import DeleteDataNode from './DeleteDataNode'
import DataInterfaceNode from './DataInterfaceNode'
import MessageNode from './MessageNode'
import GetDataNode from './GetDataNode'
import { getConfigData } from '@/api/onlineDev/visualDev'
import { getFlowList } from '@/api/workFlow/FlowEngine'
export default {
  props: [/*当前节点数据*/"value", /*整个节点数据*/"processData", "flowType", 'formInfo'],
  components: { StartNode, AddDataNode, UpdateDataNode, DeleteDataNode, DataInterfaceNode, MessageNode, GetDataNode },
  data() {
    return {
      properties: {}, // 当前节点数据
      activeKey: '1',
      startForm: JSON.parse(JSON.stringify(nodeConfig.defaultStartForm)),
      addDataForm: {},
      updateDataForm: {},
      deleteDataForm: {},
      dataInterfaceForm: {},
      integrateType: this.formInfo.type || 1,
      messageForm: {},
      getDataForm: {},
      visible: false,  // 控制面板显隐
      formFieldList: [],
      flowOptions: [],
      key: '',
      key2: ''
    };
  },
  computed: {
    // 未使用的条件个数
    notUseConNum() {
      // 发起人是默认就有得  所以需要加 1
      return this.pconditions.length - this.showingPCons.length + 1;
    },
    formFieldsOptions() {
      if (this.integrateType == 1) return this.processData.properties.formFieldList || [];
      return this.processData.childNode.properties.formFieldList || [];
    },
    usedFormItems() {
      return this.formFieldsOptions.filter(o => o.id.indexOf('-') < 0)
    },
    funcOptions() {
      let options = [
        ...systemFieldOptions,
        ...this.formFieldsOptions
      ]
      return options
    },
    funcRequiredOptions() {
      return this.formFieldsOptions.filter(o => o.__config__ && o.__config__.required)
    },
    rejectStepOptions() {
      let options = []
      const list = [{
        nodeId: '2',
        properties: { title: '自选审批节点' }
      }]
      options = [...defaultStep, ...list, ...this.realNodeList]
      if (this.approverForm.rejectType == 2) {
        options = options.filter(o => o.nodeId != 1)
      }
      return options
    }
  },
  methods: {
    initCommonNodeData(key) {
      let properties = JSON.parse(JSON.stringify(this.value.properties))
      Object.assign(this[key + 'Form'], properties);
      this.$nextTick(() => {
        if ((key === 'addData' || key === 'updateData') && this[key + 'Form'].enableFlow && this[key + 'Form'].formId) {
          this.getFlowOptions(this[key + 'Form'].formId);
        }
        if (this.integrateType == 2 && ['addData', 'updateData', 'deleteData'].includes(key) && !this[key + 'Form'].ruleList.length) {
          const emptyChildItem = { field: '', symbol: '==', fieldValueType: 1, fieldValue: undefined, jnpfKey: '', fieldValueJnpfKey: '', cellKey: +new Date() };
          const emptyItem = { logic: 'and', groups: [emptyChildItem] };
          this[key + 'Form'].ruleList.push(JSON.parse(JSON.stringify(emptyItem)));
          this.key = +new Date()
        }
      });
    },
    // 字段设置验证
    transferExist(form) {
      const list = this[form + 'Form'].transferList;
      let isOk = true;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.required) {
          if (!e.sourceValue) {
            this.$message.warning(`${e.targetFieldLabel}的值不能为空`);
            isOk = false;
            break;
          }
        } else {
          if (!e.targetField) {
            this.$message.warning(`目标表单字段不能为空`);
            isOk = false;
            break;
          }
        }
      }
      return isOk;
    },
    conditionExist(form) {
      const list = this[form + 'Form'].ruleList;
      let isOk = true;
      outer: for (let i = 0; i < list.length; i++) {
        const e = list[i];
        let label = '';
        if (this.integrateType == 1) {
          if (form === 'updateData') label = '更新条件';
          if (form === 'deleteData') label = '删除条件';
        }
        if (this.integrateType == 2) {
          label = '目标表单';
        }
        for (let j = 0; j < e.groups.length; j++) {
          const child = e.groups[j];
          if (!child.field) {
            this.$message.warning(`条件字段不能为空`);
            isOk = false;
            break outer;
          }
          if (!child.symbol) {
            this.$message.warning('条件符号不能为空');
            isOk = false;
            break;
          }
          if (
            !['null', 'notNull'].includes(child.symbol) && !['switch'].includes(child.jnpfKey) &&
            (!child.fieldValue || this.jnpf.isEmpty(child.fieldValue)) &&
            (!['inputNumber', 'calculate', 'rate'].includes(child.jnpfKey) || (['inputNumber', 'calculate', 'rate'].includes(child.jnpfKey) && child.fieldValue !== 0))
          ) {
            this.$message.warning('数据值不能为空');
            isOk = false;
            break;
          }
        }
      }
      return isOk;
    },
    getFormFieldList(id, form) {
      this.flowOptions = []
      getConfigData(id).then(res => {
        const { formData, enableFlow, flowId } = res.data;
        let formJson = {},
          fieldList = [];
        if (formData) formJson = JSON.parse(formData);
        fieldList = formJson.fields || [];
        let list = this.transformFieldList(fieldList);
        this[form + 'Form'].formFieldList = list.map(o => ({ ...o, label: o.fullName ? o.id + '(' + o.fullName + ')' : o.id }));
        if (enableFlow == 1) this.getFlowOptions(flowId);
        if (form === 'addData') this.updateTransferList(form);
        this.key = +new Date()
      });
    },
    // 获取流程列表
    getFlowOptions(id) {
      getFlowList(id, '1').then(res => {
        this.flowOptions = res.data
      })
    },
    transformFormJson(list) {
      const fieldList = list.map(o => ({
        __config__: {
          label: o.filedName,
          jnpfKey: o.jnpfKey || '',
          required: o.required || false,
        },
        __vModel__: o.filedId,
        multiple: o.multiple || false,
      }));
      return fieldList;
    },
    transformFieldList(formFieldList) {
      let list = [];
      const loop = (data, parent) => {
        if (!data) return;
        if (data.__vModel__ && data.__config__.jnpfKey !== 'table') {
          const isTableChild = parent && parent.__config__ && parent.__config__.jnpfKey === 'table';
          list.push({
            id: isTableChild ? parent.__vModel__ + '-' + data.__vModel__ : data.__vModel__,
            fullName: isTableChild ? parent.__config__.label + '-' + data.__config__.label : data.__config__.label,
            ...data,
          });
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent));
        if (data.__config__ && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data);
        }
      };
      loop(formFieldList);
      return list;
    },
    updateTransferList(form) {
      const formFieldList = this[form + 'Form'].formFieldList;
      let list = [];
      for (let i = 0; i < formFieldList.length; i++) {
        if (formFieldList[i].__config__.required) {
          list.push({ targetField: formFieldList[i].id, targetFieldLabel: formFieldList[i].fullName, sourceType: 1, sourceValue: '', required: true });
        }
      }
      this[form + 'Form'].transferList = list;
      this.key = +new Date()
    },
    // 判断是否是发起节点
    isStartNode() {
      return this.value ? NodeUtils.isStartNode(this.value) : false;
    },
    // 判断是否是新增数据节点
    isAddDataNode() {
      return this.value ? NodeUtils.isAddDataNode(this.value) : false;
    },
    // 判断是否是更新数据节点
    isUpdateDataNode() {
      return this.value ? NodeUtils.isUpdateDataNode(this.value) : false;
    },
    // 判断是否是删除数据节点
    isDeleteDataNode() {
      return this.value ? NodeUtils.isDeleteDataNode(this.value) : false;
    },
    // 判断是否是数据接口节点
    isDataInterfaceNode() {
      return this.value ? NodeUtils.isDataInterfaceNode(this.value) : false;
    },
    // 判断是否是消息通知节点
    isMessageNode() {
      return this.value ? NodeUtils.isMessageNode(this.value) : false;
    },
    // 判断是否是消息通知节点
    isGetDataNode() {
      return this.value ? NodeUtils.isGetDataNode(this.value) : false;
    },
    // 发起人节点确认保存
    startNodeConfirm() {
      let formConf = this.$refs.startNodeRef.getFormConf();
      if (!formConf) return
      this.startForm = formConf
      if (this.integrateType == 1) {
        Object.assign(this.properties, this.startForm);
        const eventName = this.startForm.triggerEvent == 1 ? '新增数据' : this.startForm.triggerEvent == 2 ? '修改数据' : '删除数据';
        const content = `当[${this.startForm.formName}]表单[${eventName}]成功时`;
        this.$emit('confirm', this.properties, content);
      } else {
        Object.assign(this.properties, this.startForm);
        this.$emit('confirm', this.properties, this.startForm.cron);
      }
      this.cancel();
    },
    // 新增数据节点确认保存
    addDataNodeConfirm() {
      let item = this.$refs.addNodeRef.getItem();
      this.addDataForm.transferList = item.transferList
      this.addDataForm.ruleList = item.ruleList
      if (this.integrateType == 2) this.addDataForm.addRule = item.addRule
      if (!this.addDataForm.formId) return this.$message.error('请选择目标表单');
      if (!this.transferExist('addData')) return;
      if (this.integrateType == 2 && !this.conditionExist('addData')) return;
      Object.assign(this.properties, this.addDataForm);
      const content = `在[${this.addDataForm.formName}]表单中新增数据`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 更新数据节点确认保存
    updateDataNodeConfirm() {
      let item = this.$refs.updateNodeRef.getTransferList();
      this.updateDataForm.transferList = item.transferList
      this.updateDataForm.ruleList = item.ruleList
      this.updateDataForm.unFoundRule = item.unFoundRule
      this.updateDataForm.ruleMatchLogic = item.ruleMatchLogic
      if (!this.updateDataForm.formId) return this.$message.error('请选择目标表单');
      if (!this.transferExist('updateData')) return;
      if (!this.conditionExist('updateData')) return;
      Object.assign(this.properties, this.updateDataForm);
      const content = `在[${this.updateDataForm.formName}]表单中更新数据`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 删除数据节点确认保存
    deleteDataNodeConfirm() {
      if (!this.deleteDataForm.formId) return this.$message.error('请选择目标表单');
      let ruleList = this.$refs.deleteNodeRef.getRuleList();
      this.deleteDataForm.ruleList = ruleList
      if (!this.conditionExist('deleteData')) return;
      Object.assign(this.properties, this.deleteDataForm);
      const content = `执行[${this.deleteDataForm.formName}]表单中[删除数据]`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 数据接口节点确认保存
    dataInterfaceNodeConfirm() {
      if (!this.dataInterfaceForm.formId) return this.$message.error('请选择执行数据接口');
      Object.assign(this.properties, this.dataInterfaceForm);
      const content = `执行[${this.dataInterfaceForm.formName}]数据接口`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 消息通知节点确认保存
    messageNodeConfirm() {
      this.messageForm = this.$refs.messageNodeRef.getDataForm();
      if (!this.messageForm.msgUserIds || !this.messageForm.msgUserIds.length) return this.$message.error('请选择接收人');
      if (!this.messageForm.msgId) return this.$message.error('请选择发送配置');
      Object.assign(this.properties, this.messageForm);
      const content = `执行[${this.messageForm.msgName}]的消息发送`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 获取数据节点确认保存
    getDataNodeConfirm() {
      let item = this.$refs.getDataNodeRef.getItem();
      if (!item) return
      this.getDataForm = item
      const msg = this.getDataForm.formType == 3 ? '请选择数据接口' : '请选择表单';
      if (!this.getDataForm.formId) return this.$message.error(msg);
      Object.assign(this.properties, this.getDataForm);
      const content = `从[${this.getDataForm.formName}]中获取数据`;
      this.$emit('confirm', this.properties, content);
      this.cancel();
    },
    // 关闭抽屉
    cancel() {
      setTimeout(() => {
        this.$emit("cancel");
        this.visible = false;
      }, 0)
    },
    handleOk() {
      this.isStartNode() && this.startNodeConfirm();
      this.isAddDataNode() && this.addDataNodeConfirm();
      this.isUpdateDataNode() && this.updateDataNodeConfirm();
      this.isDeleteDataNode() && this.deleteDataNodeConfirm();
      this.isDataInterfaceNode() && this.dataInterfaceNodeConfirm();
      this.isMessageNode() && this.messageNodeConfirm();
      this.isGetDataNode() && this.getDataNodeConfirm();
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.addDataForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm)) // 重置数据为默认状态
        this.startForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        this.updateDataForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        this.deleteDataForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        this.dataInterfaceForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        this.messageForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        this.getDataForm = JSON.parse(JSON.stringify(nodeConfig.defaultStartForm))
        return
      }
      this.isStartNode() && this.initCommonNodeData('start')
      this.isAddDataNode() && this.initCommonNodeData('addData')
      this.isUpdateDataNode() && this.initCommonNodeData('updateData')
      this.isDeleteDataNode() && this.initCommonNodeData('deleteData')
      this.isDataInterfaceNode() && this.initCommonNodeData('dataInterface')
      this.isMessageNode() && this.initCommonNodeData('message')
      this.isGetDataNode() && this.initCommonNodeData('getData');
    },
    value(newVal) {
      if (newVal && newVal.properties) {
        this.visible = true;
        this.properties = JSON.parse(JSON.stringify(newVal.properties));
        if (this.properties) {
          NodeUtils.isConditionNode(newVal) && this.getPriorityLength();
        }
      }
    }
  },
};
</script>
<style lang="scss">
.condition-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }
}
</style>
<style lang="scss" scoped>
.hand ::v-deep input {
  cursor: pointer;
}
.tips p {
  line-height: 24px;
}
.drawer {
  ::v-deep .el-drawer__body {
    padding-bottom: 62px;
    overflow: hidden;
  }
  .el-select {
    width: 100%;
    &.timeout-select {
      width: 80px;
    }
  }

  ::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  ::v-deep .el-tabs__item:focus {
    box-shadow: none !important;
  }

  ::v-deep .el-tabs__header {
    margin-bottom: 0;
  }
}
.mr-10 {
  margin-right: 10px;
}

.header {
  line-height: 28px;
}

.printWrap {
  padding: 10px 0;
  text-align: center;
  ::v-deep .el-divider--horizontal {
    margin-top: 10px;
  }
}
.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px 20px 20px;
  width: 100%;
  box-sizing: border-box;
  text-align: right;
}

.radio-item {
  line-height: 30px;
  width: calc(25% - 30px);
}

.priority-select {
  width: 118px;
  position: absolute;
  right: 26px;
}

.form-auth-table {
  height: 100%;
  font-size: 14px;
  ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
  .auth-table-header {
    background: #fafafa;
    line-height: 40px;
  }
  .row {
    display: flex;
    align-items: center;
    line-height: 32px;
    padding: 8px 12px;
    border-bottom: 1px solid #efefef;
    &:hover {
      background: #f5f7fa;
    }
    .label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .required {
        color: #f2725e;
      }
    }
    .radio-group {
      flex: 2;
      display: flex;
      justify-content: space-between;
    }
  }
}

.approver-pane {
  height: 100%;
  overflow: hidden;
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
    .el-tab-pane {
      height: 100%;
      .config-scrollbar {
        height: 100%;
        .el-row {
          font-size: 14px;
          color: #606266;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
  .per-cell {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-checkbox {
      margin-right: 40px;
    }
    &:last-child {
      margin-bottom: unset;
    }
  }
}
.option-box-tip {
  font-size: 14px;
  color: #a5a5a5;
}
.option-box {
  font-size: 14px;
  padding-left: 1rem;
}

.condition-pane {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
}
.condition-list {
  font-size: 14px;
  line-height: 36px;
  &.condition-list-header {
    ::v-deep .el-col {
      text-align: left;
    }
  }
  ::v-deep .el-col {
    text-align: center;
    padding: 0 4px;
    &.label,
    &.fieldValue {
      display: flex;
      align-items: center;
    }
    .el-input,
    .el-input-number,
    .el-select {
      width: 100%;
    }
    .el-icon-delete {
      cursor: pointer;
      &:hover {
        color: #f2725e;
      }
    }
    .edit-script-btn {
      flex: 1;
      height: 32px;
    }
  }
  .condition-select {
    &.el-select {
      &.condition-type-select {
        width: 80px;
        flex-shrink: 0;
      }
      ::v-deep .el-input__inner {
        padding: 0 26px 0 10px;
      }
    }
  }
}
.rule-dialog {
  ::v-deep .el-dialog__body {
    padding: 0 0 10px !important;
    min-height: 364px;
  }
  .node-tabs {
    ::v-deep .el-tabs__nav-wrap {
      padding: 0 20px;
    }
    ::v-deep .el-tabs__content {
      .el-tab-pane {
        min-height: 300px !important;
        max-height: 500px !important;
        padding: 0 10px 10px;
        overflow: auto;
      }
    }
  }
  .option-box-tip {
    margin-bottom: 20px;
  }
  .rule-cell {
    line-height: 32px;
    &.mid {
      color: #1890ff;
      text-align: center;
    }
  }
}
.parameter-box {
  height: 30px;
  line-height: 30px;
  margin-bottom: 8px;
}
.variable-box {
  margin-bottom: 8px;
}
.form-item-label {
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
}
.form-sub-title {
  font-size: 14px;
  color: #606266;
  line-height: 32px;
}
.form-item-content {
  padding: 0 10px;
  &.form-item-content-first {
    margin: -12px 0 18px;
  }
}
.el-form-item {
  margin-bottom: 12px !important;
}
.has-free-approver {
  width: 92px;
}
.form-item-approver {
  margin-left: 5px;
}
.assignee-form {
  display: flex;
  .form-field-type {
    width: 120px;
    ::v-deep .el-input--small {
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 5px 0px 0px 5px;
      }
    }
  }
  .form-field {
    ::v-deep .el-input--small {
      .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 0px 5px 5px 0px;
        border-left: 0px solid #dcdfe6;
      }
    }
  }
}
.fieldValue {
  ::v-deep .el-input__inner,
  .el-date-editor.el-input {
    width: 100%;
  }
}
.wrap {
  padding: 0 4px;
}

.title {
  font-size: 15px;
  color: black;
  font-weight: 400;
}
.el-select {
  width: 100%;
}
.el-cascader {
  width: 100%;
}
.el-input-number {
  width: 100%;
}
.el-icon-delete {
  line-height: 32px;
}
.numRange {
  max-width: inherit;
}
::v-deep .JNPF-selectTree {
  width: 100%;
}

::v-deep .popupSelect-container {
  width: 100%;
}
.condition-list-header {
  ::v-deep .el-col {
    padding: 0 4px;
  }
}
</style>
