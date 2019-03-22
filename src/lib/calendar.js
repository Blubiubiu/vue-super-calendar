class Calendar {

    /* eslint-disable */
    constructor() {
        this.cache = {};
        this.dayList = [];
        this.dayListByYear = [];
        this.maxLen = 42;
    }

    getDay(y, m) {
        let mday = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) //判断是否是闰月 
            mday[1] = 29;
        return mday[m - 1];
    }
    getWeek(y, m, d) {
        return parseInt(new Date(`${y}-${m}-${d}`).getDay())
    }
    getName(y, m, d) {
        return y + "-" + m + "-" + d;
    }
    /**
     * @desc 上一个月
     */
    getPrev(y, m) {
        if (m - 1 == 0) {
            return {
                y: y - 1,
                m: 12,
                d: this.getDay(y - 1, 12)
            };
        } else {
            return {
                y: y,
                m: m - 1,
                d: this.getDay(y, m - 1)
            };
        }
    }
    /**
     * @desc 下一个月
     */
    getNext(y, m) {
        if (m + 1 > 12) {
            return {
                y: y + 1,
                m: 1,
                d: this.getDay(y + 1, 1)
            };
        } else {
            return {
                y: y,
                m: m + 1,
                d: this.getDay(y, m + 1)
            };
        };
    }
    setDay(date, day, belong, hide) {
        if (date) {
            const tmp = date.match(/\d+/gi);
            this.dayList.push({
                date: date,
                day: day,
                week: this.getWeek(+tmp[0], +tmp[1], +tmp[2]),
                color: false,
                belong: !belong,
            })
        } else {
            if (hide !== "hide") {
                this.dayList.push({
                    date: "",
                    day: "",
                    week: "",
                    color: false,
                    belong: false,
                })
            } else {
                this.dayList.push({
                    date: "",
                    day: "",
                    week: "",
                    color: false,
                    belong: false,
                    hide: hide
                })
            }
        }
    }
    clear() {
        this.dayList = [];
    }
    /**
     * 
     * @param {number|string} [year] - 年份 
     * @param {number|string} [month] - 月份 
     * @param {boolean} [bool] - 是否清除非本月数据
     */
    setDate(year, month, bool) {
        year = year || new Date().getFullYear();
        month = month || new Date().getMonth() + 1;
        let cache_name = year + "-" + month;
        if (this.cache[cache_name]) {
            this.dayList = this.cache[cache_name];
            return this;
        }
        this.clear();
        let name = null,
            index = 0,
            dayTotal = this.getDay(year, month),
            weekFirst = this.getWeek(year, month, 1)
        //上月的数据
        let prev = this.getPrev(year, month),
            prevDate = prev.d - weekFirst + 1;

        for (let i = 0; i < weekFirst; i++) {
            if (!bool) {
                name = this.getName(prev.y, prev.m, prevDate);
                this.setDay(name, prevDate, 1);
            } else {
                this.setDay("", prevDate, 1);
            }
            prevDate++;
            index++;
        }
        //本月数据
        for (let i = 1; i <= dayTotal; i++) {
            name = this.getName(year, month, i);
            this.setDay(name, i);
            index++;
        }
        //下月数据
        let next = this.getNext(year, month),
            day = 1;
        while (index < this.maxLen) {
            if (!bool) {
                name = this.getName(next.y, next.m, day);
                this.setDay(name, day, 1);
            } else {
                this.setDay("", day, 1, "hide");
            }
            index++;
            day++;
        };
        //缓存
        this.cache[cache_name] = JSON.parse(JSON.stringify(this.dayList));
        return this;
    }
    /**
     * @desc 获取整年列表
     * @param {number} [yearBegin] - 取年份开始
     * @param {number} [yearBegin] - 取年份结束
     * @param {boolean} [bool] - 是否清除非本月数据 
     * @param {array} [arr] - 节假日数组 
     * @param {boolean} [clearBefore] - 是否禁止渲染当前月之前的数据 default: false
     */
    getDayListByYear(yearBegin, yearEnd, bool, arr, clearBefore) {
        let _arrBegin = [],
            _arrEnd = [],
            _arrBeginDayList = [],
            _arrEndDayList = [];

        if (yearBegin && yearBegin >= 0 && !clearBefore) {
            for (let i = 1; i <= yearBegin; i++) {
                _arrBegin.push(new Date().getFullYear() - i);
            }
            _arrBegin = _arrBegin.reverse();
        }

        if (yearEnd && yearEnd >= 0) {
            for (let i = 1; i <= yearEnd; i++) {
                _arrEnd.push(new Date().getFullYear() + i);
            }
        }

        if (clearBefore) {
            for (let i = new Date().getMonth(); i < 12; i++) {
                this.setDate(new Date().getFullYear(), i + 1, true)
                this.dayListByYear.push(this.getDayList(bool, arr))
            }
        } else {
            for (let i = 0; i < 12; i++) {
                this.setDate(new Date().getFullYear(), i + 1, true)
                this.dayListByYear.push(this.getDayList(bool, arr))
            }
        }


        if (_arrBegin.length) {
            _arrBegin.map(item => {
                for (let i = 0; i < 12; i++) {
                    this.setDate(item, i + 1, true)
                    _arrBeginDayList.push(this.getDayList(bool, arr))
                }
            })
            this.dayListByYear = [..._arrBeginDayList, ...this.dayListByYear]
        }

        if (_arrEnd.length) {
            _arrEnd.map(item => {
                for (let i = 0; i < 12; i++) {
                    this.setDate(item, i + 1, true)
                    _arrEndDayList.push(this.getDayList(bool, arr))
                }
            })
            this.dayListByYear = [...this.dayListByYear, ..._arrEndDayList]
        }
        return this.dayListByYear;
    }
    getDayList(bool, arr) {
        let list = JSON.parse(JSON.stringify(this.dayList));
        //需要周末上色
        if (bool) {
            list.map(item => {
                if (item.week == 6 || item.week == 0) {
                    item.color = true;
                    console.log(1, item)
                }
            })
        }
        if (arr) {
            arr.map(item => {
                list.map(v => {
                    if (v.date) {
                        let _v = v.date.match(/\d+/gi);
                        if (item == `${_v[1]}-${_v[2]}`) {
                            v.color = true;
                        }
                    }
                })
            })
        }
        return list;
    }
}

export default Calendar;