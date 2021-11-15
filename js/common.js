var contextUrl = "https://www.ychuantech.cn:14106";
function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return unescape(r[2]);
   	return null;
}
function todayTime(){
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	if( month < 10) month = '0' + month;
	//获取当前日
	var day = myDate.getDate();
	if( day < 10) day = '0' + day;
	var dates = year + '-' + month + "-" + day;
	return dates;
}