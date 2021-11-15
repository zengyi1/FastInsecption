var DeptId,UserId,pieChart,IsQualify = 1;
$(function(){
	//document.getElementById('id').scrollIntoView()
	//document.getElementsByClassName("content_wrapper")[0].scrollIntoView();
	var url = location.search;
	if(url.indexOf("?") != -1) { 
		var str = url.substr(1); 
		getDecoding(str);	
	}	
})
function getDecoding(str){
	$.ajax({
		url:contextUrl+"/AppWebService.asmx/GetDencodeToH5",
		timeout : 30000,
		data: {	
			urlParm: str
		},
		type: "GET",
		cache:false,
        contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			var datas = JSON.parse(data);
			if (datas.msg == 'true') {
				DeptId = datas.data.code.split('&')[0].split('=')[1];
				UserId = datas.data.code.split('&')[1].split('=')[1];
				GetQuickRecordTopInfo();
				GetQuickRecordInfoList();
			}else{
				alert('暂无数据，请重新加载！');
			}
		}
	});
}
//快检首页上方展示数字统计
function GetQuickRecordTopInfo(){
	$.ajax({
		url:contextUrl+"/AppWebService.asmx/GetLawQuickRecordTopInfo",
		timeout : 30000,
		data: {	
			UserId: UserId,
			DeptId:DeptId,
			ShowSort:1
		},
		type: "GET",
		cache:false,
        contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			var datas = JSON.parse(data);
			$(".checkDate span").html(todayTime());
			if (datas.msg == 'true') {
				$(".unqualifiedCount").html(datas.data[0].unqualifiedCount);
				$(".qualifiedCount").html(datas.data[0].qualifiedCount);
				$(".AllCount").html(datas.data[0].AllCount);
				var Prev = Number(datas.data[0].Prev);
				$(".percent").html(Prev+"%")
				if(Prev >= 90){
					var colorList = ["#13E5A3","#0BDEB8","#01D7CF"]
					GetQuickRecordChart(Prev,colorList);//图表
					$('.grade').html('优').css('color','#00E6C3');
				}else if((Prev < 90)&&(Prev >= 80)){
					var colorList = ["#FFBE00","#FFBE00","#FFBE00"]
					GetQuickRecordChart(Prev,colorList);//图表
					$('.grade').html('良').css('color','#FFBE00');
				}else if(Prev< 80){
					var colorList = ["#FC6177","#FC6177","#FC6177"]
					GetQuickRecordChart(Prev,colorList);//图表
					if(Prev == 0){
						$('.grade').html('良').css('color','#FFBE00');
						$(".percent").css("background","#00E6C3");
					}else{
						$('.grade').html('差').css('color','#FC6177');
						$(".percent").css("background","#FC6177");
					}
				}
			}
		},
	});
}
//查看今日快检结果详情
function GetQuickRecordInfoList(){
	$.ajax({
		url:contextUrl+"/AppWebService.asmx/GetLawQuickRecordInfoList",
		timeout : 30000,
		data: {	
			UserId: UserId,
			DeptId:DeptId,
			IsQualify:IsQualify,
			ShowSort:1
		},
		type: "GET",
		cache:false,
        contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			var datas = JSON.parse(data);
			if ((datas.data != '')&&(datas.data != null)) {
				$(".busList").show();
				$(".noData").hide();
				if(IsQualify == 0){//不合格
					var str = '<ul class="noPass">';
				}else if(IsQualify == 1){//合格
					var str = '<ul class="HasPass">';
				}
				$.each(datas.data, function(index, item) {
					str += '<li><p class="title_Re">';
					str += '<span>'+item.Ctext+'</span>';
					str += '</p>';
					str += '<div class="da_Re">';
					str += '<p>';
					str += '<span>样品名称</span>';
					str += '<span>检查项目</span>';
					str += '<span>结果</span>';
					str += '<span>商家</span>';
					str += '<span>处理结果</span>';
					str += '</p>';
					$.each(item.ProductList, function(idx, val) {
						str += '<p class="result">';
						str += '<span>'+val.Name+'</span>';
						str += '<span>'+val.TestItemName+'</span>';
						str += '<span>'+val.TestResult+'</span>';
						str += '<span>'+val.Ctext+'</span>';
						str += '<span>'+val.Treatment+'</span>';
						str += '</p>';
					})
					str += '</div></li>';
				})
				str += '</ul>';
				$(".busList").html(str);
			}else{
				$(".busList").hide();
				$(".noData").show();
			}
		},
	});
}
//查看快检汇总
function GetAllQuickRecordInfoList(){
	$.ajax({
		url:contextUrl+"/AppWebService.asmx/GetLawAllQuickRecordInfoList",
		timeout : 30000,
		data: {	
			UserId: UserId,
			DeptId:DeptId,
			ShowSort:1
		},
		type: "GET",
		cache:false,
        contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			var datas = JSON.parse(data);
			//console.log(datas);
			if ((datas.data != '')&&(datas.data != null)) {
				$(".busList").show();
				$(".noData").hide();
				var str='<ul class="allRecord">';
				$.each(datas.data, function(index, item) {
					str += '<li onclick="goDetail(\''+item.KeyId+'\',\''+item.Ctext+'\')"><p class="title_Re">';
					str += '<span>'+item.Ctext+'</span>';
					str += '<span class="fr">查看近三日记录<img src="img/goIcon.png" alt="" /></span>';
					str += '</p>';
					str += '<div class="da_Re">';
					str += '<p>';
					str += '<span>日期</span>';
					str += '<span>当天</span>';
					str += '<span>近7天</span>';
					str += '<span>近30天</span>';
					str += '<span>近90天</span>';
					str += '</p>';
					str += '<p class="result">';
					str += '<span>不合格</span>';
					str += '<span>'+item.CountList[0].unqualifiedCount+'</span>';
					str += '<span>'+item.CountList[1].unqualifiedCount+'</span>';
					str += '<span>'+item.CountList[2].unqualifiedCount+'</span>';
					str += '<span>'+item.CountList[3].unqualifiedCount+'</span>';
					str += '</p>';
					str += '</div></li>';
				})
				str += '</ul>';
				$(".busList").html(str);
			}else{
				$(".busList").hide();
				$(".noData").show();
			}
		},
	});
}
//跳转详情页
function goDetail(keyId,Ctext){
	sessionStorage.setItem("Ctext",Ctext);
	window.location.href = "inspectDetail.html?KeyId="+keyId;
}
function GetQuickRecordChart(Prev,colorList){
	var getvalue = [Prev]
	pieChart = echarts.init(document.getElementById('ScoreChart'));
	option = {
	  	angleAxis: {
	    	max: 100,
	    	clockwise: true, // 逆时针
	    	// 隐藏刻度线
	    	show: false
	  	},
	  	radiusAxis: {
	        type: 'category',
	        show: true,
	        axisLabel: {
	            show: false,
	        },
	        axisLine: {
	            show: false,
	
	        },
	        axisTick: {
	            show: false
	        },
	  	},
		polar: {
		    center: ['50%', '50%'],
		    radius: '190%' //图形大小
		},
	  	series: [{
		    type: 'bar',
		    data: getvalue,
			showBackground: true,
			backgroundStyle: {
				color: '#eee',
			},
		    coordinateSystem: 'polar',
		    roundCap: true,
		    barWidth: 7,
		    itemStyle: {
		        normal: {
			        opacity: 1,
			        color: "#25BFFF",
			        shadowBlur: 5,
			        shadowColor: '#eee',
			        color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
		            	offset: 0,
		            	color: colorList[0]
		          	}, {
		            	offset: 0.5,
		            	color: colorList[1]
		          	},{
		            	offset: 1,
		            	color: colorList[2]
		          	}]),
		    	}
	    	},
		}]
	};
    pieChart.setOption(option);
}
//tab切换
$(".list_title span").click(function(){
	var index = $(this).index();
	if((IsQualify == 0&&index == 0)||(IsQualify == 1&&index == 1)){
		return false
	}
	$(".list_title span").removeClass("active");
	if(index == 0){
		$(".title1").addClass("active");
		IsQualify = 0;
		GetQuickRecordInfoList();
	}else{
		if(index == 1){
			IsQualify = 1;
			GetQuickRecordInfoList();
		}else if(index == 2){
			IsQualify = 2;
			GetAllQuickRecordInfoList()
		}
		$(this).addClass("active");
	}
	$(".busList ul").hide();
	$(".busList ul").eq(index).show();
})