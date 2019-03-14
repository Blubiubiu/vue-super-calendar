import vueCalendar from './calendar.vue' // 导入组件

const calendar = {
    install(Vue, options) {
        Vue.component(vueCalendar.name, vueCalendar)
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(calendar);
}
export default calendar
