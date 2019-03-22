# vue-super-calendar

<a href="https://www.npmjs.org/package/vue-super-calendar">
  <img src="https://img.shields.io/npm/v/vue-super-calendar.svg">
</a>
<a href="https://www.npmjs.org/package/vue-super-calendar">
  <img src="https://img.shields.io/npm/dt/vue-super-calendar.svg">
</a>


## Install
```shell
npm install vue-super-calendar --save
```

## How To Use

``` javascript
//main.js
import Vue from 'vue'
import vueCalendar from 'vue-super-calendar'

Vue.use(vueCalendar)
```

## Some sample pictures

#### 单选-翻页模式

![image](https://github.com/Blubiubiu/vue-super-calendar/blob/master/gif/singlePage2.png)

### 多选-翻页模式

![image](https://github.com/Blubiubiu/vue-super-calendar/blob/master/gif/multiPage2.png)

### 单选-滑动模式

![image](https://github.com/Blubiubiu/vue-super-calendar/blob/master/gif/singleScroll4.png)

### 多选-滑动模式

![image](https://github.com/Blubiubiu/vue-super-calendar/blob/master/gif/multiScroll4.png)

## options

### props
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| type | String | single | single: 单选  multi: 复选  |
| startDay | String | "" | 设置选定日期(仅针对type = single有效) e.g."2019/3/3" |
| multiTxt | Array | ["入住", "离店"] | 复选文本(建议不超过两个字) |
| multiBefore | Boolean | false | 多选(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页&滑动的功能) |
| singleBefore | Boolean | false | 单选(仅针对mode = scroll有效)(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页&滑动的功能) |
| holiday | Boolean | false | 开启假日高亮颜色模式 |
| festival | Array | [] | 特殊节日数组 e.g. ["2019/3/3"] |
| yearBegin | Number | 1 | 加载当前年份前N年(仅针对mode = scroll有效)
| yearEnd | Number | 1 | 加载当前年份后N年(仅针对mode = scroll有效)

### functions
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| show | Function | this.$refs.xxx.show() | 打开日历 |
| hide | Function | this.$refs.xxx.hide() | 关闭日历 |
| on-single-click | Function | val | 返回单选选中日期  |
| on-multi-click | Function | startVal, endVal | 返回多选日期 |
| on-warning | Function |  | 禁止选择当前日期时翻到首页 |

## babel problem

``` shell
npm install @babel/preset-env --save-dev

presets: ['@babel/preset-env']
```




