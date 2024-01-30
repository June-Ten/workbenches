<template>
  <el-input v-bind="$attrs" v-on="$listeners" v-model="innerValue" @change="onChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #prepend v-if="addonBefore">
      {{addonBefore}}
    </template>
    <template #append v-if="addonAfter">
      {{addonAfter}}
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'JnpfInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    addonBefore: {
      type: String,
      default: ''
    },
    addonAfter: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      innerValue: ''
    };
  },
  watch: {
    value: {
      handler(val) {
        this.setValue(val);
      },
      immediate: true
    },
  },
  methods: {
    setValue(value) {
      this.innerValue = value;
    },
    onChange(value) {
      this.$emit('input', value);
    }
  }
};
</script>