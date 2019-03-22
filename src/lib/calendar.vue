<template>
  <div style="position: relative; z-index: 9;">
    <div :class="status? 'calendar-wrapper calendar-wrapper-active' : 'calendar-wrapper'">
      <div id="calendar-content" @touchmove.prevent>
        <div :class="this.mode === 'page'? 'calendar-title': 'calendar-scroll-title'">
          <div v-if="this.mode === 'page'" class="calendar-prev" @click="prev"></div>
          <div class="calendar-title-date">
            <div class="calendar-title-date-year">
              <ul
                v-for="(item,index) in translateYearY"
                :key="index"
                :style="{'transform': 'translateY(' + translateYearY[index] + ')'}"
              >
                <li v-for="(v,i) in yearList" :key="i">
                  <span>{{v}}</span>
                </li>
              </ul>
            </div>
            <div>&nbsp;-&nbsp;</div>
            <div class="calendar-title-date-month">
              <ul :style="{'transform': 'translate3d(0, ' + translateMonthY + ', 0)'}">
                <li v-for="(item,index) in monthList" :key="index">
                  <span>{{item}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div v-if="this.mode === 'page'" class="calendar-next" @click="next"></div>
        </div>
        <div :class="this.mode === 'page'? 'calendar-week': 'calendar-scroll-week'">
          <ul :class="this.holiday? 'calendar-week-holiday': ''">
            <li v-for="(item,index) in weekList" :key="index">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
        <div class="calendar-day-wrapper" v-if="mode === 'page'">
          <ul>
            <li
              v-for="(item,index) in dateList"
              :key="index"
              :class="[item.checked? 'calendar-single-checked': 'calendar-single', item.belong?'calendar-day-enable': 'calendar-day-disabled', item.multiChecked? 'calendar-multi-checked': '', item.multiSelected? 'calendar-day-multiSelected': '', item.color? 'calendar-holiday': '']"
            >
              <div class="calendar-day" @click="changeSelectedDay(item)">
                {{item.day}}
                <p v-if="type === 'multi' && item.multiChecked">{{item.multiTxt}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="calendar-scroll-day-wrapper"
          v-else
          ref="calendarScroll"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
          :style="{transform: 'translate3d(0, ' + translateDayY + ', 0)', transitionDuration: translateDuration + 'ms'}"
        >
          <ul
            v-for="(v, i) in dateListByYear"
            :key="i"
            :data-date="v[15].date"
            class="calendar-day-ul"
          >
            <li
              v-for="(item,index) in v"
              :key="index"
              :class="[item.checked? 'calendar-single-checked': 'calendar-single', item.belong?'calendar-day-enable': 'calendar-day-disabled', item.multiChecked? 'calendar-multi-checked': '', item.multiSelected? 'calendar-day-multiSelected': '', item.color? 'calendar-holiday': '', item.hide?'calendar-hide': '']"
            >
              <div class="calendar-day" @click.stop="changeSelectedDay(item, i)">
                {{item.day}}
                <p v-if="type === 'multi' && item.multiChecked">{{item.multiTxt}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="gray-wrapper" v-show="status" @click="status=false" @touchmove.prevent></div>
  </div>
</template>

<script>
import Calendar from "./calendar.js";

/**
 * @desc 日历组件
 * @param {string} [selectedDay] - 选中日期，默认为当天
 * @param {string} [selectedLastDay] - 多选时后一个日期
 * @param {string} [currentDate] - 日历当前年月
 * @param {array} [weekList] - 星期列表
 * @param {array} [dateList] - 日期列表
 * @param {array} [monthList] - 月份列表
 * @param {array} [yearList] - 年份列表
 * @param {number} [liHeight] - 默认高度
 * @param {number} [startY] - 滑动起始位置
 * @param {number} [deltaY] - 滑动距离
 * @param {string} [translateDayY] - dom滑动距离
 * @param {string} [translateMonthY] - 月份移动值
 * @param {array} [translateYearY] - 年份移动值数组
 */

/**
 * @desc 日历组件-props
 *
 * options - 日历可控项
 *
 * @method page 当模式为翻页模式时参数
 *
 *
 *
 * @method scroll 当模式为滑动模式时私有参数
 *
 * @param {number} [yearBegin] - 加载当前年份前N年 default: 1
 * @param {number} [yearEnd] - 加载当前年份后N年 default: 1
 *
 * @method common 不区分模式，所有通用
 *
 * @param {string} [type] - single: 单选  multi: 多选 
 * @param {string} [mode] - page: 翻页模式 scroll: 滑动模式
 * @param {string} [startDay] - 设置选定日期(仅针对single) e.g."2019-3-3"
 * @param {array} [multiTxt] - 多选文本(建议不超过两个字) default: ["入住", "离店"]
 * @param {boolean} [multiBefore] - 多选(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页的功能) default: false
 * @param {boolean} [singleBefore] - 单选(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页的功能) default: false
 * @param {boolean} [holiday] - 是否使用周六周日颜色区别 default: false
 * @param {array} [festival] - 特殊节日数组 default: [] e.g. "3-3"
 */

export default {
  name: "vueCalendar",
  props: {
    type: {
      type: String,
      default: "single"
    },
    mode: {
      type: String,
      default: "page"
    },
    startDay: {
      type: String,
      default: ""
    },
    multiTxt: {
      type: Array,
      default: () => {
        return ["入住", "离店"];
      }
    },
    multiBefore: {
      type: Boolean,
      default: false
    },
    singleBefore: {
      type: Boolean,
      default: false
    },
    holiday: {
      type: Boolean,
      default: false
    },
    festival: {
      type: Array,
      default: () => {
        return [];
      }
    },
    yearBegin: {
      type: Number,
      default: 1
    },
    yearEnd: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      calendar: null,
      selectedDay:
        this.type !== "multi"
          ? new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate()
          : null,
      selectedLastDay: "",
      currentDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1),
      weekList: ["日", "一", "二", "三", "四", "五", "六"],
      dateList: [],
      dateListByYear: [],
      monthList: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
      ],
      yearList: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      liHeight: 25,
      //滑动
      startY: 0,
      deltaY: 0,
      translateDayY: 0,
      translateMonthY: -new Date().getMonth() * 25 + "px",
      translateDuration: 0,
      translateYearY: [
        -new Date()
          .getFullYear()
          .toString()
          .split("")[0] *
          25 +
          "px",
        -new Date()
          .getFullYear()
          .toString()
          .split("")[1] *
          25 +
          "px",
        -new Date()
          .getFullYear()
          .toString()
          .split("")[2] *
          25 +
          "px",
        -new Date()
          .getFullYear()
          .toString()
          .split("")[3] *
          25 +
          "px"
      ],
      today: "",
      status: false,
      ulList: null,
      winHeight: window.innerHeight
    };
  },
  methods: {
    /* eslint-disable */
    touchStart(e) {
      this.translateDuration = 0;
      this.startY = e.touches[0].pageY - this.deltaY;
      let _hei = 0;
      for (let i = 0; i < this.ulList.length; i++) {
        _hei += this.ulList[i].clientHeight;
      }
    },
    touchMove(e) {
      let showDom = null;
      for (let i = 0; i < this.ulList.length; i++) {
        if (
          this.ulList[i].getBoundingClientRect().top <=
          this.winHeight - this.ulList[i].offsetHeight / 2
        ) {
          showDom = this.ulList[i];
        }
      }
      if (
        this.deltaY >= 100 ||
        this.ulList[this.ulList.length - 1].getBoundingClientRect().top < 400
      ) {
        this.translateDuration = 500;
        return false;
      }
      let _tmp = showDom.getAttribute("data-date").match(/\d+/gi);
      this.deltaY = e.touches[0].pageY - this.startY;
      this.translateDayY = this.deltaY + "px";
      this.currentDate = `${+_tmp[0]}-${+_tmp[1]}`;
      this.translateYM();
    },
    touchEnd(e) {
      if (this.deltaY >= 10) {
        this.deltaY = 0;
        this.translateDayY = 0;
      }
      if (
        this.ulList[this.ulList.length - 1].getBoundingClientRect().top < 500
      ) {
        this.$nextTick(() => {
          this.deltaY = -6390;
          this.translateDayY = -6390 + "px";
        });
      }
    },
    show() {
      this.status = true;
    },
    hide() {
      this.status = false;
    },
    //获取当天年月日
    getToday() {
      this.today =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
    },
    //年月份切换
    translateYM() {
      const _tmp = this.currentDate.match(/\d+/gi);

      _tmp[0].split("").map((item, index) => {
        this.translateYearY[index] = -+item * this.liHeight + "px";
      });

      this.monthList.map(item => {
        if (_tmp[1] == parseInt(item)) {
          this.translateMonthY = -(+_tmp[1] - 1) * this.liHeight + "px";
        }
      });
    },
    //上一月
    prev() {
      this.changeMonth("getPrev");
    },
    //下一月
    next() {
      this.changeMonth("getNext");
    },
    //更换月份
    changeMonth(type) {
      const tmp = this.currentDate.match(/\d+/gi);
      if (this.type === "multi") {
        if (!this.multiBefore) {
          //不可选择当前日期之前的日期
          if (
            type === "getPrev" &&
            new Date(+tmp[0] + "/" + tmp[1]) <
              new Date(this.today.replace(/\-/g, "/"))
          ) {
            this.$emit("on-warning")
          } else {
            const newDate = this.calendar[type](+tmp[0], +tmp[1]);
            this.currentDate = `${newDate.y}-${newDate.m}`;
            this.calendar.setDate(newDate.y, newDate.m, true);
            let list = this.calendar.getDayList(this.holiday, this.festival);
            this.dateList = JSON.parse(JSON.stringify(list));
            this.dateList.map(item => {
              item.multiChecked =
                (this.selectedDay && item.date === this.selectedDay) ||
                (this.selectedLastDay && item.date === this.selectedLastDay)
                  ? true
                  : false;
              if (this.selectedDay && item.date === this.selectedDay) {
                item.multiTxt = this.multiTxt[0];
              }
              if (this.selectedLastDay && item.date === this.selectedLastDay) {
                item.multiTxt = this.multiTxt[1];
              }
              item.belong =
                new Date(item.date.replace(/\-/g, "/")) <
                new Date(this.today.replace(/\-/g, "/"))
                  ? false
                  : true;
              if (
                this.selectedLastDay &&
                this.selectedDay &&
                new Date(item.date.replace(/\-/g, "/")) <=
                  new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
                new Date(item.date.replace(/\-/g, "/")) >=
                  new Date(this.selectedDay.replace(/\-/g, "/"))
              ) {
                item.multiSelected = true;
              } else {
                item.multiSelected = false;
              }
            });
          }
        } else {
          //可选择所有日期
          const newDate = this.calendar[type](+tmp[0], +tmp[1]);
          this.currentDate = `${newDate.y}-${newDate.m}`;
          this.calendar.setDate(newDate.y, newDate.m);
          let list = this.calendar.getDayList(this.holiday, this.festival);
          this.dateList = JSON.parse(JSON.stringify(list));
          this.dateList.map(item => {
            item.multiChecked =
              (this.selectedDay && item.date === this.selectedDay) ||
              (this.selectedLastDay && item.date === this.selectedLastDay)
                ? true
                : false;
            if (this.selectedDay && item.date === this.selectedDay) {
              item.multiTxt = this.multiTxt[0];
            }
            if (this.selectedLastDay && item.date === this.selectedLastDay) {
              item.multiTxt = this.multiTxt[1];
            }
            if (
              this.selectedLastDay &&
              this.selectedDay &&
              new Date(item.date.replace(/\-/g, "/")) <=
                new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
              new Date(item.date.replace(/\-/g, "/")) >=
                new Date(this.selectedDay.replace(/\-/g, "/"))
            ) {
              item.multiSelected = true;
            } else {
              item.multiSelected = false;
            }
          });
        }
      } else {
        const newDate = this.calendar[type](+tmp[0], +tmp[1]);
        this.currentDate = `${newDate.y}-${newDate.m}`;
        this.calendar.setDate(newDate.y, newDate.m);
        let list = this.calendar.getDayList(this.holiday, this.festival);
        this.dateList = JSON.parse(JSON.stringify(list));
        this.dateList.map(item => {
          item.checked = item.date === this.selectedDay ? true : false;
        });
      }

      //年份、月份切换
      this.translateYM();
    },
    changeSelectedDay(i, monthIdx) {
      const tmp = i.date.match(/\d+/gi);
      if (this.mode === "page") {
        //翻页模式
        if (this.type === "multi" && i.belong) {
          //当不允许选择当天之前日期时
          if (!this.selectedDay || this.selectedLastDay) {
            //当未选择或选择完毕两项时
            this.selectedDay = i.date;
            i.multiTxt = this.multiTxt[0];
            this.selectedLastDay = "";
            this.dateList.map(item => {
              item.multiSelected = false;
            });
            i.multiSelected = true;
          } else if (
            new Date(i.date.replace(/\-/g, "/")) <
            new Date(this.selectedDay.replace(/\-/g, "/"))
          ) {
            //当选择的日期在之前
            this.selectedDay = i.date;
            i.multiTxt = this.multiTxt[0];
            this.dateList.map(item => {
              item.multiSelected = false;
            });
            i.multiSelected = true;
          } else if (this.selectedDay !== i.date) {
            this.selectedLastDay = i.date;
            i.multiTxt = this.multiTxt[1];
            this.dateList.map(item => {
              if (
                this.selectedLastDay &&
                this.selectedDay &&
                new Date(item.date.replace(/\-/g, "/")) <=
                  new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
                new Date(item.date.replace(/\-/g, "/")) >=
                  new Date(this.selectedDay.replace(/\-/g, "/"))
              ) {
                item.multiSelected = true;
              } else {
                item.multiSelected = false;
              }
            });
          }

          if (this.selectedDay && this.selectedLastDay) {
            this.$emit(
              "on-multi-click",
              this.selectedDay,
              this.selectedLastDay
            );
            this.status = false;
          }

          this.dateList.map(item => {
            item.multiChecked =
              (this.selectedDay && item.date === this.selectedDay) ||
              (this.selectedLastDay && item.date === this.selectedLastDay)
                ? true
                : false;
          });
        } else if (this.type === "picker") {
        } else {
          //单选
          if (i.belong) {
            this.selectedDay = i.date;
            this.dateList.map(item => {
              item.checked = item.date === this.selectedDay ? true : false;
            });
          }
          this.$emit("on-single-click", i.date);
        }
      } else {
        if (this.type === "multi" && i.belong) {
          //当不允许选择当天之前日期时
          if (!this.selectedDay || this.selectedLastDay) {
            //当未选择或选择完毕两项时
            this.selectedDay = i.date;
            i.multiTxt = this.multiTxt[0];
            this.selectedLastDay = "";
            this.dateListByYear.map((item, index) => {
              item.map(item1 => {
                item1.multiSelected = false;
              });
            });
            i.multiSelected = true;
          } else if (
            new Date(i.date.replace(/\-/g, "/")) <
            new Date(this.selectedDay.replace(/\-/g, "/"))
          ) {
            //当选择的日期在之前
            this.selectedDay = i.date;
            i.multiTxt = this.multiTxt[0];
            this.dateListByYear.map(item => {
              item.map(item1 => {
                item1.multiSelected = false;
              });
            });
            i.multiSelected = true;
          } else if (this.selectedDay !== i.date) {
            this.selectedLastDay = i.date;
            i.multiTxt = this.multiTxt[1];
            this.dateListByYear.map(item => {
              item.map(item1 => {
                if (
                  this.selectedLastDay &&
                  this.selectedDay &&
                  new Date(item1.date.replace(/\-/g, "/")) <=
                    new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
                  new Date(item1.date.replace(/\-/g, "/")) >=
                    new Date(this.selectedDay.replace(/\-/g, "/"))
                ) {
                  item1.multiSelected = true;
                } else {
                  item1.multiSelected = false;
                }
              });
            });
          }

          if (this.selectedDay && this.selectedLastDay) {
            this.$emit(
              "on-multi-click",
              this.selectedDay,
              this.selectedLastDay
            );
            this.status = false;
          }

          this.dateListByYear.map(item => {
            item.map(item1 => {
              item1.multiChecked =
                (this.selectedDay && item1.date === this.selectedDay) ||
                (this.selectedLastDay && item1.date === this.selectedLastDay)
                  ? true
                  : false;
            });
          });
        } else if (this.type === "picker") {
        } else {
          //单选
          if (i.belong) {
            this.selectedDay = i.date;
            this.dateListByYear[monthIdx].map(item => {
              item.checked = item.date === this.selectedDay ? true : false;
            });
          }
          this.$emit("on-single-click", i.date);
        }
      }
      this.$forceUpdate();
    },
    //多选情况初始化
    multiInit() {
      if (this.multiBefore) {
        //允许选择当天之前日期
      } else {
        //不允许选择当天之前日期并隐去非可选日期
        this.dateList.map(item => {
          item.multiBefore =
            new Date(item.date.replace(/\-/g, "/")) <
            new Date(this.today.replace(/\-/g, "/"))
              ? false
              : true;
          item.belong =
            new Date(item.date.replace(/\-/g, "/")) <
            new Date(this.today.replace(/\-/g, "/"))
              ? false
              : true;
        });
      }
    },
    //获取日期列表
    getList() {
      let list = this.calendar.getDayList(this.holiday, this.festival);
      this.dateList = JSON.parse(JSON.stringify(list));
      this.dateList.map(item => {
        item.checked = item.date === this.selectedDay ? true : false;
        item.multiTxt = "";
      });
    }
  },
  mounted() {
    /* eslint-disable */
    //禁止选择非设定模式

    if (!(this.mode === "page" || this.mode === "scroll")) {
      throw new Error("请选择正确的模式");
      return false;
    }
    this.calendar = new Calendar();
    this.getToday();

    if (this.type === "multi") {
      let _status = this.mode === "page" ? false : true;
      if (_status) {
        //滑动模式

        this.dateListByYear = this.calendar.getDayListByYear(
          this.yearBegin,
          this.yearEnd,
          this.holiday,
          this.festival,
          !this.multiBefore
        );

        //初始化时滑动距离
        this.$nextTick(() => {
          this.ulList = this.$refs.calendarScroll.childNodes;
          if (!this.multiBefore) {
            this.translateDayY = 0;
            this.deltaY = 0;
            this.dateListByYear[0].map(item => {
              item.belong =
                new Date(item.date.replace(/\-/g, "/")) <
                new Date(this.today.replace(/\-/g, "/"))
                  ? false
                  : true;
            });
          } else {
            this.translateDayY =
              -this.ulList[this.yearBegin * 12 + new Date().getMonth()].offsetTop + "px";
            this.deltaY = -this.ulList[this.yearBegin * 12 + new Date().getMonth()].offsetTop;
          }
        });
      } else {
        this.multiBefore
          ? this.calendar.setDate()
          : this.calendar.setDate(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              true
            );
        this.getList();
        this.multiInit();
      }
    } else {
      //单选
      let _status = this.mode === "page" ? false : true;
      if (_status) {
        this.dateListByYear = this.calendar.getDayListByYear(
          this.yearBegin,
          this.yearEnd,
          this.holiday,
          this.festival,
          !this.singleBefore
        );
        //滑动模式
        if (this.startDay) {
          const tmp = this.startDay.match(/\d+/gi);
          if (
            tmp.length !== 3 ||
            tmp[0].length !== 4 ||
            tmp[1].length > 2 ||
            tmp[1].length < 0 ||
            tmp[2].length > 2 ||
            tmp[2].length < 0
          ) {
            //当输入的选定时间不符合规则时抛出异常
            throw new Error("请输入规定字符串---e.g. 2019/3/3");
          } else {
            this.currentDate = `${tmp[0]}-${tmp[1]}`;
            this.changeSelectedDay(
              {
                date: this.startDay,
                belong: true
              },
              this.singleBefore ? this.yearBegin * 12 + +tmp[1] - 1: +tmp[1] - new Date().getMonth() - 1
            );
            //初始化时滑动距离
            this.$nextTick(() => {
              this.ulList = this.$refs.calendarScroll.childNodes;
              if (!this.singleBefore) {
                this.translateDayY = 0;
                this.deltaY = 0;
                this.dateListByYear[0].map(item => {
                  item.belong =
                    new Date(item.date.replace(/\-/g, "/")) <
                    new Date(this.today.replace(/\-/g, "/"))
                      ? false
                      : true;
                });
              } else {
                this.translateDayY =
                  -this.ulList[this.yearBegin * 12 + +tmp[1] - 1].offsetTop +
                  "px";

                this.deltaY = -this.ulList[this.yearBegin * 12 + +tmp[1] - 1]
                  .offsetTop;
              }
            });
            //年份、月份切换
            this.translateYM();
          }
        } else {
          //初始化时滑动距离
          this.$nextTick(() => {
            this.ulList = this.$refs.calendarScroll.childNodes;
            if (!this.singleBefore) {
              this.translateDayY = 0;
              this.deltaY = 0;
              this.dateListByYear[0].map(item => {
                item.belong =
                  new Date(item.date.replace(/\-/g, "/")) <
                  new Date(this.today.replace(/\-/g, "/"))
                    ? false
                    : true;
              });
              this.changeSelectedDay(
                {
                  date: this.today,
                  belong: true
                },
                0
              );
            } else {
              this.translateDayY =
                -this.ulList[this.yearBegin * 12 + new Date().getMonth()]
                  .offsetTop + "px";

              this.deltaY = -this.ulList[
                this.yearBegin * 12 + new Date().getMonth()
              ].offsetTop;
            }
          });
        }
      } else {
        if (this.startDay) {
          const tmp = this.startDay.match(/\d+/gi);
          if (
            tmp.length !== 3 ||
            tmp[0].length !== 4 ||
            tmp[1].length > 2 ||
            tmp[1].length < 0 ||
            tmp[2].length > 2 ||
            tmp[2].length < 0
          ) {
            //当输入的选定时间不符合规则时抛出异常
            throw new Error("请输入规定字符串---e.g. 2019/3/3");
          } else {
            this.calendar.setDate(+tmp[0], +tmp[1], _status);
            this.getList();
            this.currentDate = `${tmp[0]}-${tmp[1]}`;
            this.changeSelectedDay({
              date: this.startDay,
              belong: true
            });
            //年份、月份切换
            this.translateYM();
          }
        } else {
          this.calendar.setDate("", "", _status);
          this.getList();
        }
      }
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
div {
  font-family: Arial, "Times New Roman", "Microsoft YaHei", SimHei;
}
.gray-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}
.calendar-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -430px;
  width: 100%;
  height: 430px;
  z-index: 99;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s;
  transform: translateY(0);
}
.calendar-wrapper-active {
  transform: translateY(-430px);
}
#calendar-content {
  background: #fff;
}
.calendar-title,
.calendar-scroll-title {
  position: relative;
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 22px;
  font-weight: 500;
  height: 50px;
  color: #000;
  background: #fff;
  box-shadow: 0px 2px 6px 0px #dde4eb;
}
.calendar-scroll-title {
  box-shadow: none;
}
.calendar-title-date {
  display: flex;
}
.calendar-title-date-year,
.calendar-title-date-month {
  height: 25px;
  line-height: 25px;
  overflow: hidden;
}
.calendar-title-date-year {
  display: flex;
}

.calendar-title-date ul {
  height: 25px;
  transition: all 0.5s;
}
.calendar-title-date ul > li {
  list-style: none;
}
.calendar-prev {
  width: 10px;
  height: 10px;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(45deg);
}
.calendar-next {
  width: 10px;
  height: 10px;
  border-top: 2px solid #000;
  border-right: 2px solid #000;
  transform: rotate(45deg);
}
.calendar-day-wrapper,
.calendar-scroll-day-wrapper {
  height: 330px;
}
.calendar-week,
.calendar-scroll-week {
  position: relative;
  z-index: 9;
  background: #fff;
}
.calendar-week > ul,
.calendar-scroll-week > ul,
.calendar-day-wrapper > ul,
.calendar-scroll-day-wrapper > ul {
  display: flex;
  flex-wrap: wrap;
}
.calendar-week > ul > li,
.calendar-scroll-week > ul > li {
  color: #999;
}

.calendar-week > ul > li,
.calendar-scroll-week > ul > li,
.calendar-day-wrapper > ul > li,
.calendar-scroll-day-wrapper > ul > li {
  flex: 0 0 14.2857%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  list-style: none;
}
.calendar-week-holiday li:first-child,
.calendar-week-holiday li:last-child {
  color: #ff9600;
}
.calendar-scroll-week {
  position: relative;
  z-index: 9;
}
.calendar-scroll-week > ul {
  border-top: 1px solid #dde4ed;
  box-shadow: 0px 2px 6px 0px #dde4eb;
}
.calendar-day-wrapper > ul {
  height: 330px;
}
.calendar-scroll-day-wrapper > ul {
  border-bottom: 1px solid #dde4ed;
}
.calendar-day-wrapper > ul > li,
.calendar-scroll-day-wrapper > ul > li {
  margin-top: 4px;
}
.calendar-single-checked {
  display: flex;
  justify-content: center;
  align-items: center;
}
.calendar-single-checked .calendar-day,
.calendar-multi-checked .calendar-day {
  flex-flow: column;
  color: #fff;
  background: #00c293;
  box-shadow: 0px 2px 6px 0px rgba(49, 219, 178, 1);
  border-radius: 4px;
}
.calendar-day-disabled .calendar-day {
  color: #e3e3e3;
  background: #fff;
  box-shadow: none;
  border-radius: none;
}
.calendar-day-disabled .calendar-day p {
  display: none;
}
.calendar-day {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.calendar-day > p {
  text-align: center;
  font-size: 12px;
}
.calendar-day-enable {
  color: #000;
}
.calendar-day-disabled {
  color: #e3e3e3 !important;
  background: #fff !important;
}
.calendar-day-multiSelected {
  color: #000;
  background: #b9fff5;
}
.calendar-holiday {
  color: #ff9600;
}
.calendar-hide {
  display: none !important;
}
</style>