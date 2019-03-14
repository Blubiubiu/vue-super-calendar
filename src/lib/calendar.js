class Calendar {
    
    /* eslint-disable */
    constructor() {
        this.cache = {};
        this.dayList = [];
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
    setDay(date, day, belong) {
        if (date) {
            const tmp = date.match(/\d+/gi);
            this.dayList.push({
                date: date,
                day: day,
                week: this.getWeek(+tmp[0], +tmp[1], +tmp[2]),
                belong: !belong,
            })
        } else {
            this.dayList.push({
                date: "",
                day: "",
                week: "",
                belong: false,
            })
        }
    }
    clear() {
        this.dayList = [];
    }
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
                this.setDay("", day, 1);
            }
            index++;
            day++;
        };
        //缓存
        this.cache[cache_name] = JSON.parse(JSON.stringify(this.dayList));
        return this;
    }
    getDayList(bool) {
        let list = JSON.parse(JSON.stringify(this.dayList));
        if (bool) {
            let len = 7,
                count = 0;
            for (let i = list.length - 1; len >= 1; i--, len--) {
                if (list[i]['belong']) {
                    count++;
                }
            }
            if (count == 7) {
                len = 7;
                while (len) {
                    list.pop();
                    len--;
                }
            }
        }
        return list;
    }
}

export default Calendar;