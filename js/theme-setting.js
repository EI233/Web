// author by removef
// https://removeif.github.io/

Storage.prototype.setExpire = (key, value, expire) => {
    const obj = {
        data: value,
        time: Date.now(),
        expire: expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getExpire = key => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
};

Date.prototype.Format = function(fmt) { // author: meizz
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
};

function getDateDiff(dateTimeStamp) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const halfamonth = day * 15;
    const month = day * 30;
    const now = new Date().getTime();
    const diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    const monthC = diffValue / month;
    const weekC = diffValue / (7 * day);
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    if (monthC >= 1) {
        result = ' ' + parseInt(monthC) + '月前';
    } else if (weekC >= 1) {
        result = ' ' + parseInt(weekC) + '周前';
    } else if (dayC >= 1) {
        result = ' ' + parseInt(dayC) + '天前';
    } else if (hourC >= 1) {
        result = ' ' + parseInt(hourC) + '小时前';
    } else if (minC >= 1) {
        result = ' ' + parseInt(minC) + '分钟前';
    } else {
        result = ' 刚刚';
    }
    return result;
}

const expireTime1H = 1000 * 60 * 60; // 1小时过期
function isNightRange(beginTime, endTime) {
    const nowDate = new Date();
    const nowTime = nowDate.getHours() + ':' + nowDate.getMinutes();
    const strb = beginTime.split(':');
    if (strb.length != 2) {
        return false;
    }

    const stre = endTime.split(':');
    if (stre.length != 2) {
        return false;
    }

    const strn = nowTime.split(':');
    if (stre.length != 2) {
        return false;
    }

    const b = new Date();
    const e = new Date();
    const n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);
    n.setHours(strn[0]);
    n.setMinutes(strn[1]);

    console.log(n.getTime());
    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
    }
    console.log('now Date is：' + n.getHours() + ':' + n.getMinutes() + '，is not Night！');
    return false;

}

const btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window);

function isNightFun() {
    var isNightTemp = localStorage.getExpire('night');

    // 第一次进来判断是白天还是晚上
    if (isNightTemp == null || isNightTemp == undefined) {
        if (isNightRange('19:00', '23:59') || isNightRange('00:00', '07:00')) {
            isNightTemp = 'true';
        } else {
            isNightTemp = 'false';
        }
        localStorage.setExpire('night', isNightTemp, expireTime1H);
    }
    return isNightTemp;
}

var isNight = isNightFun();
// 参考自 https://www.imaegoo.com/
var nightNav;
var nightIcon;

function applyNight(value) {
    if (value == 'true') {
        document.body.className += ' night';
        if (nightIcon) {
            nightIcon.className = nightIcon.className.replace(/ fa-moon/g, '') + ' fa-lightbulb';
        }
    } else {
        document.body.className = document.body.className.replace(/ night/g, '');
        if (nightIcon) {
            nightIcon.className = nightIcon.className.replace(/ fa-lightbulb/g, '') + ' fa-moon';
        }
    }
}

function findNightIcon() {
    nightNav = document.getElementById('night-nav');
    nightIcon = document.getElementById('night-icon');
    if (!nightNav || !nightIcon) {
        setTimeout(findNightIcon, 100);
    } else {
        nightNav.addEventListener('click', switchNight);
        if (isNight) {
            nightIcon.className = nightIcon.className.replace(/ fa-moon/g, '') + ' fa-lightbulb';
        } else {
            nightIcon.className = nightIcon.className.replace(/ fa-lightbulb/g, '') + ' fa-moon';
        }
    }
}

function switchNight() {

    if (isNight == 'false') {
        isNight = 'true';
    } else {
        isNight = 'false';
    }

    applyNight(isNight);
    localStorage.setExpire('night', isNight, expireTime1H);
    if (typeof loadUtterances == 'function') {
        loadUtterances();
    }
}

findNightIcon();
applyNight(isNight);
