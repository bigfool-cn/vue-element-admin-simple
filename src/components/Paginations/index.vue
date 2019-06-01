<template>
  <div class="pagination">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :hide-on-single-page="isHide"
      :page-sizes="[20, 50, 80, 100]"
      :page-size="pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    isHide: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 15
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style scoped>
.pagination{
    float: right;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>
