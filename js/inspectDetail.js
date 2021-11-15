var IsQualify = 1,KeyId;
$(function(){
	var Ctext = sessionStorage.getItem("Ctext");
	$(".top_wrapper p").html("经营主体："+Ctext)
	KeyId = GetQueryString("KeyId");
	GetQuickRecordLatelyList();
})
function GetQuickRecordLatelyList(){
	$.ajax({
		url:contextUrl+"/AppWebService.asmx/GetLawQuickRecordLatelyList",
		timeout : 30000,
		data: {	
			KeyId: KeyId,
			IsQualify:IsQualify
		},
		type: "GET",
		cache:false,
        contentType: 'application/x-www-form-urlencoded',
		success: function(data) {
			var datas = JSON.parse(data);
			if (datas.data != ''&&datas.data != null) {
				var str='';
				$.each(datas.data, function(index, item) {
					if(IsQualify == 0){//不合格
						str += '<li class="active">';
					}else if(IsQualify == 1){
						str += '<li>';
					}
					str += '<p>档口名称：<span>'+item.Ctext+'</span></p>';
					str += '<p>样品名称：<span>'+item.Name+'</span></p>';
					str += '<p>检测项目：<span>'+item.TestItemName+'</span></p>';
					str += '<p>检测日期：<span>'+item.DetectDate+'</span></p>';
					str += '<p>检测结果：<span class="con">'+item.TestResult+'</span></p>';
					str += '</li>';
				})
			}else{
				var str = '<li class="noData"><img src="img/noData.png" alt="" /><p>暂无数据</p></li>';
			}
			$(".content_wrapper ul").html(str);
		},
	});
}
$(".titleChange span").click(function(){
	var index = $(this).index();
	if((IsQualify == 1&&index == 0)||(IsQualify == 0&&index == 1)){
		return false
	}
	if(index == 0){
		$(".qua").addClass("active");
		$(".noQua").removeClass("noQaActive");
		$(".content_wrapper li").removeClass("active");
		IsQualify = 1;
	}else if(index == 1){
		$(".qua").removeClass("active");
		$(".noQua").addClass("noQaActive");
		$(".content_wrapper li").addClass("active");
		IsQualify = 0;
	}
	GetQuickRecordLatelyList();
})