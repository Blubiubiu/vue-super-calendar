import vueCalendar from './calendar.vue' // 导入组件

vueCalendar.install = function (Vue) {
    Vue.component(vueCalendar.name, vueCalendar)
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vueCalendar);
}
export default vueCalendar