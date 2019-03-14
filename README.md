# vue-super-calendar

<a href="https://www.npmjs.org/package/vue-super-calendar">
  <img src="https://img.shields.io/npm/v/vue-super-calendar.svg">
</a>

![image](https://github.com/Blubiubiu/vue-super-calendar/blob/master/gif/calendar.gif)


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


## options

### props
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| type | String | radio | radio: 单选  checkbox: 复选  |
| startDay | String | "" | 设置选定日期(仅针对radio有效) eg："2019-3-3" |
| checkboxTxt | Array | ["入住", "离店"] | 复选文本(建议不超过两个字) |
| checkboxBefore | Boolean | false | 复选(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页的功能) |

### functions
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| on-single-click | Function | val | 返回单选选中日期  |
| on-multi-click | Function | startVal, endVal | 返回多选日期 |

