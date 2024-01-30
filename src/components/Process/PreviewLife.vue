<script>
import FlowCardL from "./FlowCard/PreviewL.vue";
import {getProjectLifeMockData} from "./FlowCard/projectLife.js"

export default {
  name: 'ProcessLife',
  props: ['tabName', 'conf'],
  data() {
    let data = {}
    // if (typeof this.conf === 'object' && this.conf !== null && JSON.stringify(this.conf) !== '{}') {
    //   data = Object.assign(NodeUtils.createNode('start'), this.conf)
    // } else {
      data = getProjectLifeMockData()
    // }

    return {
      data, // 流程图数据
      scaleVal: 95, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      updateId: 0, // key值 用于模拟$forceUpdate
      activeData: null, // 被激活的流程卡片数据，用于属性面板编辑
      isProcessCmp: true,
      verifyMode: false
    };
  },
  methods: {
  },
  render: function (h) {
    return (
      <div class="flow-container flow-container-preview">
        <div class="tips">
          <div class="tips-item"><span class="icon success">●</span>已完成</div>
          <div class="tips-item"><span class="icon current">●</span>进行中</div>
          <div class="tips-item"><span class="icon">●</span>无</div>
        </div>
        <FlowCardL
          verifyMode={this.verifyMode}
          key={this.updateId}
          data={this.data}
          onEmits={this.eventReceiver}
          style={{ transform: `scale(${this.scaleVal / 100})` }}
        />
      </div>
    );
  }
};
</script>

<style scoped lang="scss">
$bg-color: #fff;

.flow-container {
  display: inline-block;
  background: $bg-color;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
  &.flow-container-preview {
    height: calc(100% - 10px);
    ::v-deep .branch-wrap {
      .branch-box {
        background: $bg-color;

        > .col-box {
          &:first-of-type {
            &::before,
            &::after {
              background: $bg-color !important;
            }
          }
          &:last-of-type {
            &::before,
            &::after {
              background: $bg-color;
            }
          }
        }
      }
    }
    ::v-deep .node-wrap-box.approver::before {
      background: #fff;
    }
    //::v-deep.node-wrap-box.outsource::before {
    //  background: #fff;
    //}
    ::v-deep .flow-path-card {
      &:hover {
        .title-text {
          border-bottom: none;
        }
      }
      &.condition:hover,
      &.timer:hover {
        box-shadow: 0 0 0 2px #b6b6b6, 0 0 5px 4px rgb(0 0 0 / 20%);
      }
      &.start-node,
      &.approver,
      &.outsource,
      &.trial,
      &.change,
      &.linggu,
      &.finishP,
      &.subFlow {
        &:hover {
          box-shadow: 0 0 0 2px #b6b6b6, 0 0 5px 4px rgb(0 0 0 / 20%);
        }
        .header {
          background-color: #b6b6b6;
        }
      }
      &.state-past {
        .header {
          background-color: #67c23a;
        }
        &:hover {
          box-shadow: 0 0 0 2px #67c23a, 0 0 5px 4px rgb(103 194 58 / 20%);
        }
      }
      &.state-curr {
        .header {
          background-color: #1890ff;
        }
        &:hover {
          box-shadow: 0 0 0 2px #1890ff, 0 0 5px 4px rgb(24 144 255 / 20%);
        }
      }
    }
  }
}

.scale-slider {
  right: 10px;
  z-index: 199;
  position: fixed;

  .btn {
    display: inline-block;
    padding: 4px;
    border: 1px solid #cacaca;
    border-radius: 3px;
    background: #fff;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.tips {
  left: 20px;
  top: 0px;
  z-index: 199;
  text-align: left;
  .tips-item {
    line-height: 20px;
    font-size: 16px;
    display: inline-block;
    margin-right: 15px;
    .icon {
      font-size: 20px;
      margin-right: 5px;
      color: #b6b6b6;
      &.success {
        color: #67c23a;
      }
      &.current {
        color: #1890ff;
      }
    }
  }
}
</style>
