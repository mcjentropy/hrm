var userPaySlip_table;
$(function(){

	userPaySlip_table = $('#userPaySlip_table_id');
	var select_userPaySlip_startDay = $("#select_userPaySlip_startDay");
	var select_userPaySlip_endDay = $("#select_userPaySlip_endDay");
	userPaySlip_table.bootstrapTable({
		url : "/getUserPaySlipPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '员工工资条统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '员工工资条统计报表',
            excelstyles: ['background-color', 'color', 'font-size', 'font-weight'],
        },
		// 分页相关
		sidePagination : 'server',
		pagination : true, // 是否显示分页（*）
		pageNumber : 1, // 初始化加载第一页，默认第一页,并记录
		pageSize : 10, // 默认显示几条数据 
		pageList : [ 10, 50, 100 ], // 用于设置当前页面可以显示的数据条数
		queryParams : function(params) {
			var nparams = {
				'startDay' : select_userPaySlip_startDay.val(),
				'endDay' : select_userPaySlip_endDay.val(),
				'search' : params.search,
				'pageNumber' : (params.offset/params.limit)+1,
				'pageSize' : params.limit
			};
			return nparams;
		},
		showRefresh : true, // 是否显示刷新按钮
		uniqueId : 'id',
		columns : [ {
			checkbox : true,
			visible : true
		// 是否显示复选框 
		}, {
			field : 'printDay',
			title : '打印日期',
			width : "10%"
		}, {
			field : 'startDay',
			title : '开始日期',
			width : "10%"
		}, {
			field : 'endDay',
			title : '结束日期',
			width : "10%"
		}, {
			field : 'workDays',
			title : '工作天数',
			width : "10%"
		}, {
			field : 'lateOrLeaveTimes',
			title : '迟到早退天数',
			width : "10%"
		}, {
			field : 'absentTimes',
			title : '缺席天数',
			width : "10%"
		}, {
			field : 'realCash',
			title : '实发工资',
			width : "10%"
		}, {
			field : 'cash',
			title : '月薪',
			width : "10%"
		}, {
			field : 'bonusCash',
			title : '奖金',
			width : "5%"
		}, {
			field : 'user.nickname',
			title : '姓名',
			width : "5%"
		}, {
			field : 'user.username',
			title : '员工名',
			width : "10%"
		}]
	});
	select_userPaySlip_startDay.on('select2:select',function(){
		userPaySlip_table.bootstrapTable('refresh',{pageNumber:1});
	});
	select_userPaySlip_endDay.on('select2:select',function(){
		userPaySlip_table.bootstrapTable('refresh',{pageNumber:1});
	});

});
