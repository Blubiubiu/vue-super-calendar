<template>
  <div id="app">
    <div class="demo">
      <div @click="radioClick">单选</div>
    </div>
    <div class="demo" @click="dayClick">跳往指定日期-eg:2018-2-2</div>
    <div class="demo" @click="checkboxClick">多选</div>
    <calender ref="calenderRadio" :type="optionsRadio.type" @on-single-click="singleClick"></calender>
    <calender ref="calenderDay" :type="optionsDay.type" :startDay="optionsDay.startDay"></calender>
    <calender ref="calenderCheckBox" :type="optionsCheckBox.type" @on-multi-click="multiClick"></calender>
  </div>
</template>

<script>
import Calender from "./lib/calendar.vue";
export default {
  name: "app",
  data() {
    return {
      optionsRadio: {
        type: "radio"
      },
      optionsDay: {
        type: "radio",
        startDay: "2019-2-2"
      },
      optionsCheckBox: {
        type: "checkbox"
      }
    };
  },
  methods: {
    radioClick() {
      this.$refs.calenderRadio.show();
    },
    dayClick() {
      this.$refs.calenderDay.show();
    },
    checkboxClick() {
      this.$refs.calenderCheckBox.show();
    },
    singleClick(val) {
        alert("选择了" + val)
    },
    multiClick(startVal, endVal) {
        alert("选择了" + startVal + "到" + endVal)
    }
  },
  components: {
    Calender
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.demo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 40px;
  margin: 20px auto 0;
  font-size: 14px;
  border: 1px solid #00c293;
  overflow: hidden;
}
</style>


