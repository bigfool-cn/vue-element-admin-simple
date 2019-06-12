import loadmore from './loadmore'

const install = function(Vue) {
  Vue.directive('el-select-loadmore', loadmore)
}

if (window.Vue) {
  window['el-select-loadmore'] = loadmore
  Vue.use(install); // eslint-disable-line
}

loadmore.install = install
export default loadmore
