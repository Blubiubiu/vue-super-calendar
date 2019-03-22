<template>
  <div id="app">
    <h2>翻页模式</h2>
    <h4>单选</h4>
    <div class="demo" @click="calendershow('calenderPageSingle1')">默认</div>
    <div class="demo" @click="calendershow('calenderPageSingle2')">跳向指定日期 e.g. "2019-3-27"</div>
    <div class="demo" @click="calendershow('calenderPageSingle3')">周六日颜色</div>
    <div class="demo" @click="calendershow('calenderPageSingle4')">假日 e.g. ["3-27"]</div>
    <h4>多选</h4>
    <div class="demo" @click="calendershow('calenderPageMulti1')">默认</div>
    <div class="demo" @click="calendershow('calenderPageMulti2')">文本 e.g. ["开始", "结束"]</div>
    <div class="demo" @click="calendershow('calenderPageMulti3')">允许选择当前日期之前</div>
    <div class="demo" @click="calendershow('calenderPageMulti4')">周六日颜色</div>
    <div class="demo" @click="calendershow('calenderPageMulti5')">假日 e.g. ["3-27"]</div>

    <vueCalendar
      ref="calenderPageSingle1"
      :type="optionsPageSingle1.type"
      :mode="optionsPageSingle1.mode"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageSingle2"
      :type="optionsPageSingle2.type"
      :mode="optionsPageSingle2.mode"
      :startDay="optionsPageSingle2.startDay"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageSingle3"
      :type="optionsPageSingle3.type"
      :mode="optionsPageSingle3.mode"
      :holiday="optionsPageSingle3.holiday"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageSingle4"
      :type="optionsPageSingle4.type"
      :mode="optionsPageSingle4.mode"
      :festival="optionsPageSingle4.festival"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageMulti1"
      :type="optionsPageMulti1.type"
      :mode="optionsPageMulti1.mode"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageMulti2"
      :type="optionsPageMulti2.type"
      :mode="optionsPageMulti2.mode"
      :multiTxt="optionsPageMulti2.multiTxt"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageMulti3"
      :type="optionsPageMulti3.type"
      :mode="optionsPageMulti3.mode"
      :multiBefore="optionsPageMulti3.multiBefore"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageMulti4"
      :type="optionsPageMulti4.type"
      :mode="optionsPageMulti4.mode"
      :holiday="optionsPageMulti4.holiday"
    ></vueCalendar>
    <vueCalendar
      ref="calenderPageMulti5"
      :type="optionsPageMulti5.type"
      :mode="optionsPageMulti5.mode"
      :festival="optionsPageMulti5.festival"
    ></vueCalendar>
    <br>
    <h2>滑动模式</h2>
    <h4>单选</h4>
    <div class="demo" @click="calendershow('calenderScrollSingle1')">默认</div>
    <div class="demo" @click="calendershow('calenderScrollSingle2')">跳向指定日期 e.g. "2019-3-27"</div>
    <div class="demo" @click="calendershow('calenderScrollSingle3')">周六日颜色</div>
    <div class="demo" @click="calendershow('calenderScrollSingle4')">假日 e.g. ["3-27"]</div>
    <div class="demo" @click="calendershow('calenderScrollSingle5')">分别设置可以选择前后N年</div>
    <div class="demo" @click="calendershow('calenderScrollSingle6')">禁止选择当前日期之前</div>
    <h4>多选</h4>
    <div class="demo" @click="calendershow('calenderScrollMulti1')">默认</div>
    <div class="demo" @click="calendershow('calenderScrollMulti2')">文本 e.g. ["开始", "结束"]</div>
    <div class="demo" @click="calendershow('calenderScrollMulti3')">分别设置可以选择前后N年</div>
    <div class="demo" @click="calendershow('calenderScrollMulti4')">禁止选择当前日期之前</div>
    <div class="demo" @click="calendershow('calenderScrollMulti5')">周六日颜色</div>
    <div class="demo" @click="calendershow('calenderScrollMulti6')">假日 e.g. ["3-27"]</div>
    <br>

    <vueCalendar
      ref="calenderScrollSingle1"
      :type="optionsScrollSingle1.type"
      :mode="optionsScrollSingle1.mode"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollSingle2"
      :type="optionsScrollSingle2.type"
      :mode="optionsScrollSingle2.mode"
      :startDay="optionsScrollSingle2.startDay"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollSingle3"
      :type="optionsScrollSingle3.type"
      :mode="optionsScrollSingle3.mode"
      :holiday="optionsScrollSingle3.holiday"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollSingle4"
      :type="optionsScrollSingle4.type"
      :mode="optionsScrollSingle4.mode"
      :festival="optionsScrollSingle4.festival"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollSingle5"
      :type="optionsScrollSingle5.type"
      :mode="optionsScrollSingle5.mode"
      :yearBegin="optionsScrollSingle5.yearBegin"
      :yearEnd="optionsScrollSingle5.yearEnd"
      :singleBefore="optionsScrollSingle5.singleBefore"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollSingle6"
      :type="optionsScrollSingle6.type"
      :mode="optionsScrollSingle6.mode"
      :singleBefore="optionsScrollSingle6.singleBefore"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti1"
      :type="optionsScrollMulti1.type"
      :mode="optionsScrollMulti1.mode"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti2"
      :type="optionsScrollMulti2.type"
      :mode="optionsScrollMulti2.mode"
      :multiTxt="optionsScrollMulti2.multiTxt"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti3"
      :type="optionsScrollMulti3.type"
      :mode="optionsScrollMulti3.mode"
      :yearBegin="optionsScrollMulti3.yearBegin"
      :yearEnd="optionsScrollMulti3.yearEnd"
      :multiBefore="optionsScrollMulti3.multiBefore"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti4"
      :type="optionsScrollMulti4.type"
      :mode="optionsScrollMulti4.mode"
      :multiBefore="optionsScrollMulti4.multiBefore"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti5"
      :type="optionsScrollMulti5.type"
      :mode="optionsScrollMulti5.mode"
      :holiday="optionsScrollMulti5.holiday"
    ></vueCalendar>
    <vueCalendar
      ref="calenderScrollMulti6"
      :type="optionsScrollMulti6.type"
      :mode="optionsScrollMulti6.mode"
      :festival="optionsScrollMulti6.festival"
    ></vueCalendar>
  </div>
</template>

<script>
// import vueCalendar from 'vue-super-calendar'
export default {
  name: "app",
  data() {
    return {
      //翻页单选
      //可以省略，此处作为演示所以展示出来
      optionsPageSingle1: {
        type: "single",
        mode: "page"
      },
      optionsPageSingle2: {
        type: "single",
        mode: "page",
        startDay: "2019-3-27"
      },
      optionsPageSingle3: {
        type: "single",
        mode: "page",
        holiday: true
      },
      optionsPageSingle4: {
        type: "single",
        mode: "page",
        festival: ["3-27"]
      },
      //翻页多选
      optionsPageMulti1: {
        type: "multi",
        mode: "page"
      },
      optionsPageMulti2: {
        type: "multi",
        mode: "page",
        multiTxt: ["开始", "结束"]
      },
      optionsPageMulti3: {
        type: "multi",
        mode: "page",
        multiBefore: true
      },
      optionsPageMulti4: {
        type: "multi",
        mode: "page",
        holiday: true
      },
      optionsPageMulti5: {
        type: "multi",
        mode: "page",
        festival: ["3-27"]
      },
      //滑动单选
      optionsScrollSingle1: {
        type: "single",
        mode: "scroll"
      },
      optionsScrollSingle2: {
        type: "single",
        mode: "scroll",
        startDay: "2019-3-27"
      },
      optionsScrollSingle3: {
        type: "single",
        mode: "scroll",
        holiday: true
      },
      optionsScrollSingle4: {
        type: "single",
        mode: "scroll",
        festival: ["3-27"]
      },
      optionsScrollSingle5: {
        type: "single",
        mode: "scroll",
        yearBegin: 3,
        yearEnd: 3,
        singleBefore: true
      },
      optionsScrollSingle6: {
        type: "single",
        mode: "scroll",
        singleBefore: false
      },
      //滑动多选
      optionsScrollMulti1: {
        type: "multi",
        mode: "scroll"
      },
      optionsScrollMulti2: {
        type: "multi",
        mode: "scroll",
        multiTxt: ["开始", "结束"]
      },
      optionsScrollMulti3: {
        type: "multi",
        mode: "scroll",
        yearBegin: 3,
        yearEnd: 3,
        multiBefore: true
      },
      optionsScrollMulti4: {
        type: "multi",
        mode: "scroll",
        multiBefore: false
      },
      optionsScrollMulti5: {
        type: "multi",
        mode: "scroll",
        holiday: true
      },
      optionsScrollMulti6: {
        type: "multi",
        mode: "scroll",
        festival: ["3-27"]
      },
    };
  },
  methods: {
    calendershow(ref) {
      this.$refs[ref].show();
    }
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


