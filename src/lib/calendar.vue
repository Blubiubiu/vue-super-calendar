<template>
  <div style="position: relative;">
    <div :class="status? 'calendar-wrapper calendar-wrapper-active' : 'calendar-wrapper'">
      <div id="calendar-content">
        <div id="calendar-title">
          <div class="calendar-prev" @click="prev"></div>
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
          <div class="calendar-next" @click="next"></div>
        </div>
        <div id="calendar-week">
          <ul>
            <li v-for="(item,index) in weekList" :key="index">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
        <ul>
          <li
            v-for="(item,index) in dateList"
            :key="index"
            :class="[item.checked? 'calendar-radio-checked': 'calendar-radio', item.belong?'calendar-day-enable': 'calendar-day-disabled', item.checkboxChecked? 'calendar-checkbox-checked': '', item.checkboxSelected? 'calendar-day-checkboxSelected': '']"
          >
            <div class="calendar-day" @click="changeSelectedDay(item)">
              {{item.day}}
              <p v-if="type === 'checkbox' && item.checkboxChecked">{{item.checkboxTxt}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="gray-wrapper" v-show="status" @click="status=false"></div>
  </div>
</template>

<script>
import Calendar from "./calendar.js";

/**
 * @desc 日历组件
 * @param {string} [selectedDay] - 选中日期，默认为当天
 * @param {string} [selectedLastDay] - 复选时后一个日期
 * @param {string} [currentDate] - 日历当前年月
 * @param {array} [weekList] - 星期列表
 * @param {array} [dateList] - 日期列表
 * @param {array} [monthList] - 月份列表
 * @param {array} [yearList] - 年份列表
 * @param {number} [liHeight] - 默认高度
 * @param {string} [translateMonthY] - 月份移动值
 * @param {array} [translateYearY] - 年份移动值数组
 */

/**
 * @desc 日历组件-props
 *
 * options - 日历可控项
 * @param {string} [type] - radio: 单选  checkbox: 复选  picker: 滚动
 * @param {string} [startDay] - 设置选定日期(仅针对radio和picker有效) eg："2019-3-3"
 * @param {array} [checkboxTxt] - 复选文本(建议不超过两个字) default: ["入住", "离店"]
 * @param {boolean} [checkboxBefore] - 复选(是否允许选择当前日期之前的日期, 同时也会禁用往当前日期前翻页的功能) default: false
 */

export default {
  name: "vue-super-calendar",
  props: {
    type: {
      type: String,
      default: "radio"
    },
    startDay: {
      type: String,
      default: ""
    },
    checkboxTxt: {
      type: Array,
      default: () => {
        return ["入住", "离店"];
      }
    },
    checkboxBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      calendar: null,
      selectedDay:
        this.type !== "checkbox"
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
      translateMonthY: -new Date().getMonth() * 25 + "px",
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
      status: false
    };
  },
  methods: {
    /* eslint-disable */
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
      if (this.type === "checkbox") {
        if (!this.checkboxBefore) {
          //不可选择当前日期之前的日期
          if (
            type === "getPrev" &&
            new Date(+tmp[0] + "/" + tmp[1]) <
              new Date(this.today.replace(/\-/g, "/"))
          ) {
            alert("不可选当前日期之前的月份");
          } else {
            const newDate = this.calendar[type](+tmp[0], +tmp[1]);
            this.currentDate = `${newDate.y}-${newDate.m}`;
            this.calendar.setDate(newDate.y, newDate.m, true);
            let list = this.calendar.getDayList();
            this.dateList = JSON.parse(JSON.stringify(list));
            this.dateList.map(item => {
              item.checkboxChecked =
                (this.selectedDay && item.date === this.selectedDay) ||
                (this.selectedLastDay && item.date === this.selectedLastDay)
                  ? true
                  : false;
              if (this.selectedDay && item.date === this.selectedDay) {
                item.checkboxTxt = this.checkboxTxt[0];
              }
              if (this.selectedLastDay && item.date === this.selectedLastDay) {
                item.checkboxTxt = this.checkboxTxt[1];
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
                item.checkboxSelected = true;
              } else {
                item.checkboxSelected = false;
              }
            });
          }
        } else {
          //可选择所有日期
          const newDate = this.calendar[type](+tmp[0], +tmp[1]);
          this.currentDate = `${newDate.y}-${newDate.m}`;
          this.calendar.setDate(newDate.y, newDate.m);
          let list = this.calendar.getDayList();
          this.dateList = JSON.parse(JSON.stringify(list));
          this.dateList.map(item => {
            item.checkboxChecked =
              (this.selectedDay && item.date === this.selectedDay) ||
              (this.selectedLastDay && item.date === this.selectedLastDay)
                ? true
                : false;
            if (this.selectedDay && item.date === this.selectedDay) {
              item.checkboxTxt = this.checkboxTxt[0];
            }
            if (this.selectedLastDay && item.date === this.selectedLastDay) {
              item.checkboxTxt = this.checkboxTxt[1];
            }
            if (
              this.selectedLastDay &&
              this.selectedDay &&
              new Date(item.date.replace(/\-/g, "/")) <=
                new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
              new Date(item.date.replace(/\-/g, "/")) >=
                new Date(this.selectedDay.replace(/\-/g, "/"))
            ) {
              item.checkboxSelected = true;
            } else {
              item.checkboxSelected = false;
            }
          });
        }
      } else {
        const newDate = this.calendar[type](+tmp[0], +tmp[1]);
        this.currentDate = `${newDate.y}-${newDate.m}`;
        this.calendar.setDate(newDate.y, newDate.m);
        let list = this.calendar.getDayList();
        this.dateList = JSON.parse(JSON.stringify(list));
        this.dateList.map(item => {
          item.checked = item.date === this.selectedDay ? true : false;
        });
      }

      //年份、月份切换
      this.translateYM();
    },
    changeSelectedDay(i) {
      const tmp = i.date.match(/\d+/gi);
      if (this.type === "checkbox" && i.belong) {
        //当不允许选择当天之前日期时
        if (!this.selectedDay || this.selectedLastDay) {
          //当未选择或选择完毕两项时
          this.selectedDay = i.date;
          i.checkboxTxt = this.checkboxTxt[0];
          this.selectedLastDay = "";
          this.dateList.map(item => {
            item.checkboxSelected = false;
          });
          i.checkboxSelected = true;
        } else if (
          new Date(i.date.replace(/\-/g, "/")) <
          new Date(this.selectedDay.replace(/\-/g, "/"))
        ) {
          //当选择的日期在之前
          this.selectedDay = i.date;
          i.checkboxTxt = this.checkboxTxt[0];
          this.dateList.map(item => {
            item.checkboxSelected = false;
          });
          i.checkboxSelected = true;
        } else if (this.selectedDay !== i.date) {
          this.selectedLastDay = i.date;
          i.checkboxTxt = this.checkboxTxt[1];
          this.dateList.map(item => {
            if (
              this.selectedLastDay &&
              this.selectedDay &&
              new Date(item.date.replace(/\-/g, "/")) <=
                new Date(this.selectedLastDay.replace(/\-/g, "/")) &&
              new Date(item.date.replace(/\-/g, "/")) >=
                new Date(this.selectedDay.replace(/\-/g, "/"))
            ) {
              item.checkboxSelected = true;
            } else {
              item.checkboxSelected = false;
            }
          });
        }

        if (this.selectedDay && this.selectedLastDay) {
          this.$emit("on-multi-click", this.selectedDay, this.selectedLastDay);
          this.status = false;
        }

        this.dateList.map(item => {
          item.checkboxChecked =
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
        // alert("选择了" + i.date);
        this.$emit("on-single-click", i.date);
      }
      this.$forceUpdate();
    },
    //多选情况初始化
    checkboxInit() {
      if (this.checkboxBefore) {
        //允许选择当天之前日期
      } else {
        //不允许选择当天之前日期并隐去非可选日期
        this.dateList.map(item => {
          item.checkboxBefore =
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
      let list = this.calendar.getDayList();
      this.dateList = JSON.parse(JSON.stringify(list));
      this.dateList.map(item => {
        item.checked = item.date === this.selectedDay ? true : false;
        item.checkboxTxt = "";
      });
    }
  },
  mounted() {
    /* eslint-disable */
    this.calendar = new Calendar();
    this.getToday();
    switch (this.type) {
      case "checkbox":
        this.checkboxBefore
          ? this.calendar.setDate(
              new Date().getFullYear(),
              new Date().getMonth() + 1
            )
          : this.calendar.setDate(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              true
            );
        this.getList();
        this.checkboxInit();
        break;
      default:
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
            throw new Error("请输入规定字符串---2019/3/3");
          } else {
            this.calendar.setDate(+tmp[0], +tmp[1]);
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
          this.calendar.setDate();
          this.getList();
        }
    }
  }
};
</script>

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
  max-width: 600px;
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
#calendar-title {
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
#calendar-week > ul > li {
  color: #999;
}
#calendar-week > ul,
#calendar-content > ul {
  display: flex;
  flex-wrap: wrap;
}
#calendar-week > ul > li,
#calendar-content > ul > li {
  flex: 0 0 14.2857%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  list-style: none;
}
#calendar-content > ul > li {
  margin-top: 4px;
}
.calendar-radio-checked {
  display: flex;
  justify-content: center;
  align-items: center;
}
.calendar-radio-checked .calendar-day,
.calendar-checkbox-checked .calendar-day {
  flex-flow: column;
  color: #fff;
  background: #00c293;
  box-shadow: 0px 2px 6px 0px rgba(49, 219, 178, 1);
  border-radius: 4px;
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
  color: #e3e3e3;
  background: #fff;
}
.calendar-day-checkboxSelected {
  color: #000;
  background: #b9fff5;
}
</style>