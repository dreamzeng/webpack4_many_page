export const bigMonth = '1,3,5,7,8,10,12'.split(',');

export const isLeapYear = (fullYear) => {
	return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
}

/**
 * change f into int, remove decimal. Just for code compression
 * @param f
 * @returns {number}
 */
export const toInt = f => parseInt(f);

/**
 * format Date / string / timestamp to Date instance.
 * @param input
 * @returns {*}
 */
export const toDate = input => {
	if (input instanceof Date) return input;
	if (!isNaN(input) || /^\d+$/.test(input)) return new Date(toInt(input));
	input = (input || '').trim().replace(/\.\d+/, '') // remove milliseconds
		.replace(/-/, '/').replace(/-/, '/')
		.replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
		.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
	return new Date(input);
};
/**
 * 数字补全不足补零
 * @param {整型 int} num 
 * @param {整型 int} length 
 */
export const  prefixInteger = (num, length)  => (Array(length).join('0') + num).slice(-length);

/**
 * 获取范围时间内，所有的星期六日期，或者所有的 每个月的最后一天
 * 比如： getDateAttr('2018-11-09','2018-11-30') => ['2018-11-10','2018-11-17','2018-11-24']
 * @param {开始时间} starttime 
 * @param {结束时间} endTime 
 * @param {过滤的类型，week ，month} type 
 */
export const getDateAttr = (starttime, endTime, type = 'week') => {
	let endtimettamp = toDate(endTime).getTime();
	let nowtime = toDate(starttime);
	let dateArr = [];

	if (type === 'week') {
		for (; endtimettamp >= nowtime.getTime();) {
			if (nowtime.getDay() === 6) {
				dateArr.push(`${nowtime.getFullYear()}-${prefixInteger(nowtime.getMonth() + 1,2)}-${prefixInteger(nowtime.getDate(),2)}`);
				nowtime.setDate(nowtime.getDate() + 7);
			} else {
				nowtime.setDate(nowtime.getDate() + 1);
			}
		}
		return dateArr;
	}
	if (type === 'month') {
		let flag = true;
		for (let m, d, strtime; flag;) {
			flag = false;
			m = nowtime.getMonth() + 1;
			if (m == 2) {
				d = isLeapYear(nowtime.getFullYear()) ? 29 : 28;
			} else {
				d = bigMonth.includes(m + '') ? 31 : 30;
			}
			strtime = `${nowtime.getFullYear()}-${prefixInteger(nowtime.getMonth() + 1,2)}-${d}`
			nowtime = toDate(strtime);
			if (endtimettamp >= nowtime.getTime()) {
				nowtime.setDate(nowtime.getDate() + 1); //移动到下一个月
				console.log(nowtime,nowtime.getMonth(),nowtime.getDate());
				dateArr.push(strtime);
				flag = true;
			}
		}
		return dateArr;
	}
};
/**
 * formatDate(new Date(),'yyyy-MM-dd');
 * @param {new Date()} date 
 * @param {'yyyy-MM-dd'} fmt 
 */
export const  formatDate = (date,fmt) => {
	date = toDate(date);
	const o = {   
		"M+" : date.getMonth()+1,                 //月份   
		"d+" : date.getDate(),                    //日   
		"h+" : date.getHours(),                   //小时   
		"m+" : date.getMinutes(),                 //分   
		"s+" : date.getSeconds(),                 //秒   
		"q+" : Math.floor((date.getMonth()+3)/3), //季度   
		"S"  : date.getMilliseconds()             //毫秒   
	};
	if(/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
	}  
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		}
	}
	return fmt;  
}

/**
 * 获取窗口高度
 */
export const getClientHeight = () => document.documentElement.clientHeight || document.body.clientHeight;
/**
 * xhr 异步请求
 * @param {*} param0 
 */
export const xhr = ({url = '', param = {}, type = 'get',dataType = 'json',cache = false} = {}) => {
	url = process.env.NODE_ENV === 'production' ? url : '/api/'+url.replace(/\.\//,'');
	return new Promise((resolve,reject)=>{
		$.ajax({url,type,dataType,cache,
			success: function(res){
				resolve({
					code: 0,
					data: res,
					param
				});
			},
			error:function(res){
				resolve({
					code: -1,
					data: res,
					param
				});
			}
		});
	})
};
/**
 * 生成唯一字符串
 */
export const uniqueStr = () =>{
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; 
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
														
	s[8] = s[13] = s[18] = s[23] = "-";
  
	var uuid = s.join("");
	return uuid;
  }
  
