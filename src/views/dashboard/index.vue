<template>
  <div class="dashboard-container">
    <github-corner class="github-corner" />
    <div style="text-align: center;margin-top: 50px;">
      <el-tag><a href="https://www.bigfool.cn" target="_blank" title="博客">mLogs</a></el-tag>
      &nbsp;&nbsp;&nbsp;
      <el-tag type="success"><a href="https://github.com/bigfool-cn" target="_blank" title="全球基佬交友网站">Github</a></el-tag>
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
export default {
  name: 'Dashboard',
  components: { GithubCorner }
}
</script>
<style scoped>
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
</style>
