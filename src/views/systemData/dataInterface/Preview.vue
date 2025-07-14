<template>
  <div class="JNPF-preview-main">
    <div class="JNPF-common-page-header">
      <!-- <el-page-header  :content="'接口预览 - ' + title" /> -->

    </div>
    <el-form ref="dataForm" class="main" label-position="top" v-loading="formLoading">
      <el-form-item label="Request URL">
        <el-input v-model="url">
          <template slot="prepend">GET</template>
          <template slot="append">
            <el-button type="primary" @click="test" :loading="testLoading">测试接口</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Request Param" v-if="inputList.length > 0">
        <el-row v-for="(item, index) in inputList" :key="index" :gutter="20" class="mt-10">
          <el-col :span="6">
            <el-input v-model="item.field" placeholder="key" clearable readonly />
          </el-col>
          <el-col :span="18">
            <el-input v-model="item.defaultValue" placeholder="value" clearable />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Response Body" class="value-item">
        <el-input v-model="responseData" type="textarea" :autosize="{ minRows: 20 }" />
      </el-form-item>
    </el-form>
    <div class="options" style="display: flex;justify-content: flex-end;">
      <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
    </div>
  </div>
</template>

<script>
import { getDIFP } from "@/api/portal";

export default {
  data() {
    return {
      title: '',
      formLoading: false,
      testLoading: false,
      responseData: '',
      url: '',
      options: {
        readOnly: true,
        language: 'json'
      },
      inputList: [],
      tenantId: ''
    }
  },
  methods: {
    test() {
      this.testLoading = true
      let query = {
        paramList: this.inputList,
        // tenantId: this.tenantId,
        origin: 'preview'
      }
      getDIFP(this.id, query).then(res => {
        // alert(2)
        this.testLoading = false
        let data = res
        this.responseData = JSON.stringify(data, null, 4)
      }).catch(() => {
        this.testLoading = false
      })
    },
    goBack() {
      this.$emit('close')
    },
    init(id, tenantId, fullName) {
      this.id = id || ''
      this.tenantId = tenantId || ''
      this.title = fullName || ''
      this.formLoading = true
      this.responseData = ''
      this.$nextTick(() => {
        const prefix = 'https://test.jinzhiyuns.com';
        this.url = `${prefix}/Restful/JinQue.BMDynamicTable.Entities.Sys_Portal_Data_Interface/GetInfoToSQL.json?id=${id}`
        getDIFP(this.id).then(res => {
          this.inputList = res.data
          this.formLoading = false
        }).catch(() => {
          this.formLoading = false
        })
      })
    },
  }
}
</script>