<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword" placeholder="请输入关键词查询" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle" addText="新建">
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list">
          <el-table-column prop="fullName" label="权限组名称" show-overflow-tooltip min-width="200" />
          <el-table-column prop="enCode" label="权限组编码" width="200" />
          <el-table-column prop="creatorTime" label="创建时间" :formatter="jnpf.tableDateFormat"
            width="120" />
          <el-table-column prop="sortCode" label="排序" width="70" align="center" />
          <el-table-column prop="enabledMark" label="状态" width="70" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.enabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.enabledMark==1?'启用':'禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">{{$t('common.moreBtn')}}<i
                        class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="setUserAuthorize(scope.row.id)">权限成员
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click.native="handleAuthorize(scope.row.id,scope.row.fullName)">权限授权
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copyAuthorize(scope.row.id)">复制权限
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <Form v-if="formVisible" ref="form" @close="closeForm" />
    <userTransfer v-if="userVisible" ref="transfer" :permissionGroupId="authorizeId" multiple
      @confirm="closeUser" />
    <AuthorizeForm v-if="authorizeFormVisible" ref="AuthorizeForm" @close="removeAuthorizeForm" />
  </div>
</template>

<script>
import { getAuthorizeList, Delete, CopyPermissions } from '@/api/permission/authorize'
import Form from './Form'
import userTransfer from './permissionGroup'
import AuthorizeForm from './AuthorizeForm'
export default {
  name: 'onlineDev-visualPortal',
  components: { Form, userTransfer, AuthorizeForm },
  data() {
    return {
      list: [],
      keyword: '',
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      total: 0,
      drawerVisible: false,
      listLoading: false,
      formVisible: false,
      selectedData: [],
      authorizeFormVisible: false,
      authorizeId: '',
      userVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    reset() {
      this.keyword = ''
      this.category = ''
      this.type = ''
      this.enabledLock = ''
      this.search()
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      let query = {
        ...this.listQuery,
        keyword: this.keyword,
      }
      getAuthorizeList(query).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    copyAuthorize(id) {
      this.$confirm('您确定要复制该功能权限, 是否继续?', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        CopyPermissions(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.initData()
            }
          });
        })
      }).catch(() => { });
    },
    addOrUpdateHandle(id) {
      this.dialogVisible = false
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.form.init(id)
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) this.initData()
    },
    closeUser(isRefresh) {
      this.userVisible = false
      if (isRefresh) this.initData()
    },
    setUserAuthorize(id) {
      this.authorizeId = id || ''
      this.userVisible = true
      this.$nextTick(() => {
        this.$refs.transfer.init()
      })
    },
    handleAuthorize(id, fullName) {
      this.authorizeFormVisible = true
      fullName = '权限授权-' + fullName
      this.$nextTick(() => {
        this.$refs.AuthorizeForm.init(id, fullName, 'Role')
      })
    },
    removeAuthorizeForm(isRefresh) {
      this.authorizeFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
  }
}
</script>