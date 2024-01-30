<template>
  <el-dialog title="配置表单" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" v-loading="formLoading"
      label-width="70px" label-position="left">
      <el-form-item label="弹窗标题">
        <el-input v-model="dataForm.popupTitle" placeholder="请输入弹窗标题" />
      </el-form-item>
      <el-form-item label="弹窗类型">
        <el-select v-model="dataForm.popupType" placeholder="请选择弹窗类型">
          <el-option label="居中弹窗" value="dialog"></el-option>
          <el-option label="右侧弹窗" value="drawer"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="弹窗宽度">
        <el-select v-model="dataForm.popupWidth" placeholder="请选择弹窗宽度" filterable>
          <el-option v-for="item in popupWidthOptions" :label="item" :value="item" :key="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="远端数据" prop="interfaceName">
        <interface-dialog :value="dataForm.interfaceId" :title="dataForm.interfaceName"
          @change="onInterfaceChange" :hasPage='1' />
      </el-form-item>
      <el-form-item label="参数设置" style="margin-bottom: 0;"></el-form-item>
      <el-table :data="dataForm.templateJson" style="margin-bottom: 18px;">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="field" label="参数名称" width="200">
          <template slot-scope="scope">
            <span class="required-sign">{{scope.row.required?'*':''}}</span>
            {{scope.row.fieldName?scope.row.field+'('+scope.row.fieldName+')':scope.row.field}}
          </template>
        </el-table-column>
        <el-table-column prop="value" label="表单字段">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relationField" placeholder="请选择表单字段" clearable filterable
              @change="onRelationFieldChange($event,scope.row)">
              <el-option v-for="item in formFieldsOptions" :key="item.__vModel__"
                :label="item.__config__.label?item.__vModel__+'('+item.__config__.label+')':item.__vModel__"
                :value="item.__vModel__">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="设置列表字段" label-width="100px" style="margin-bottom: 0;"></el-form-item>
      <el-table :data="dataForm.columnOptions">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="field" label="列名">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" placeholder="请输入列名"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="字段">
          <template slot-scope="scope">
            <el-autocomplete class="inline-input" v-model="scope.row.value"
              :fetch-suggestions="querySearch" placeholder="请输入内容" style="width:100%"
              @select="handleSelect($event,scope.row)">
              <template slot-scope="{ item }">
                <div class="sale-order-popper-item">
                  <span>{{ item.defaultValue}}</span>
                </div>
              </template>
            </el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn"
              @click="handleDel(scope.$index,'columnOptions')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-actions" @click="addColumn" style="margin-bottom: 18px;">
        <el-button type="text" icon="el-icon-plus">新增</el-button>
      </div>
      <el-form-item label="设置关联字段" label-width="100px" style="margin-bottom: 0;"></el-form-item>
      <el-table :data="dataForm.relationOptions">
        <el-table-column type="index" width="50" label="序号" align="center" />
        <el-table-column prop="field" label="目标表单字段">
          <template slot-scope="scope">
            <el-select v-model="scope.row.field" placeholder="请选择表单字段" filterable>
              <el-option v-for="item in childList" :key="item.__vModel__"
                :label="item.__config__.label" :value="item.__vModel__">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="映射来源" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择映射来源"
              @change="onTypeChange(scope.row)">
              <el-option label="接口字段" :value="1" />
              <el-option label="固定值" :value="2" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="映射值/业务对象">
          <template slot-scope="scope">
            <el-autocomplete class="inline-input" v-model="scope.row.value" v-if="scope.row.type==1"
              :fetch-suggestions="querySearch" placeholder="请输入内容" style="width:100%"
              @select="handleSelect($event,scope.row)">
              <template slot-scope="{ item }">
                <div class="sale-order-popper-item">
                  <span>{{ item.defaultValue}}</span>
                </div>
              </template>
            </el-autocomplete>
            <el-input v-model="scope.row.value" placeholder="请输入固定值" v-else />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn"
              @click="handleDel(scope.$index,'relationOptions')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-actions" @click="addRelationOption" style="margin-bottom: 18px;">
        <el-button type="text" icon="el-icon-plus">新增</el-button>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDrawingList } from '@/components/Generator/utils/db'
import InterfaceDialog from '@/components/Process/PropPanel/InterfaceDialog'
import { getDataInterfaceInfo } from '@/api/systemData/dataInterface'
export default {
  components: { InterfaceDialog },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      childList: [],
      dataForm: {
        interfaceId: '',
        interfaceName: '',
        templateJson: [],
        hasPage: true,
        pageSize: 20,
        columnOptions: [],
        relationOptions: []
      },
      dataRule: {},
      popupWidthOptions: ['600px', '800px', '1000px', '40%', '50%', '60%', '70%', '80%'],
      fieldJsonList: []
    }
  },
  computed: {
    formFieldsOptions() {
      const noAllowList = ['table', 'uploadImg', 'uploadFile', 'modifyUser', 'modifyTime']
      let list = []
      const loop = (data, parent) => {
        if (!data) return
        if (data.__config__ && data.__config__.jnpfKey !== 'table' && data.__config__.children && Array.isArray(data.__config__.children)) {
          loop(data.__config__.children, data)
        }
        if (Array.isArray(data)) data.forEach(d => loop(d, parent))
        if (data.__vModel__ && !noAllowList.includes(data.__config__.jnpfKey)) list.push(data)
      }
      loop(getDrawingList())
      return list
    }
  },
  methods: {
    init(data, children) {
      this.dataForm = JSON.parse(JSON.stringify(data))
      this.childList = children.filter(o => o.__vModel__)
      this.visible = true
      if (this.dataForm.interfaceId) this.getDataInterfaceInfo()
    },
    onInterfaceChange(id, row) {
      if (!id) {
        this.dataForm.interfaceId = ''
        this.dataForm.interfaceName = ''
        this.dataForm.templateJson = []
        this.getDataInterfaceInfo()
        return
      }
      if (this.dataForm.interfaceId === id) return
      this.dataForm.interfaceId = id
      this.dataForm.interfaceName = row.fullName
      this.dataForm.templateJson = row.templateJson ? row.templateJson.map(o => ({
        ...o,
        relationField: ''
      })) : []
      this.getDataInterfaceInfo()
    },
    onRelationFieldChange(val, row) {
      if (!val) return row.jnpfKey = ''
      let list = this.formFieldsOptions.filter(o => o.__vModel__ === val)
      if (!list.length) return row.jnpfKey = ''
      let item = list[0]
      row.jnpfKey = item.__config__.jnpfKey
    },
    addColumn() {
      this.dataForm.columnOptions.push({
        value: '',
        label: ''
      })
    },
    addRelationOption() {
      this.dataForm.relationOptions.push({
        value: '',
        field: '',
        type: 1
      })
    },
    handleDel(index, key) {
      this.dataForm[key].splice(index, 1)
    },
    onTypeChange(row) {
      row.value = ''
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.dataForm)
          this.visible = false
        }
      })
    },
    getDataInterfaceInfo() {
      getDataInterfaceInfo(this.dataForm.interfaceId).then(res => {
        this.fieldJsonList = res.data && res.data.fieldJson && (JSON.parse(res.data.fieldJson) || []) || []
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.fieldJsonList || [];
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.defaultValue.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item, field) {
      field.value = item.defaultValue
    }
  }
}
</script>
