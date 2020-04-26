var paySlip_table;
$(function(){
	var select_paySlip_organization = $("#select_paySlip_organization");
	var select_paySlip_startDay = $("#select_paySlip_startDay");
	var select_paySlip_endDay = $("#select_paySlip_endDay");
	$.ajax({
		type : 'POST',
		url : '/getAllOrganization',
		async : false,
		success : function(data) {
			select_paySlip_organization.empty();
			$.each(data, function(i, organization) {
				select_paySlip_organization.append($('<option value="' + organization.id + '">'
						+ organization.name + '</option>'));
			});
			select_paySlip_organization.select2();
		}
	});
	paySlip_table = $('#paySlip_table_id');
	paySlip_table.bootstrapTable({
		url : "/getPaySlipPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '工资条统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '工资条统计报表',
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
				'startDay' : select_paySlip_startDay.val(),
				'endDay' : select_paySlip_endDay.val(),
				'organizationId' : select_paySlip_organization.val(),
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
			title : '真实工资',
			width : "10%"
		}, {
			field : 'cash',
			title : '月薪',
			width : "10%"
		}, {
			field : 'bonusCash',
			title : '奖金',
			width : "10%"
		}, {
			field : 'user.username',
			title : '员工名',
			width : "10%"
		}]
	});
	select_paySlip_organization.on('select2:select',function(){
		paySlip_table.bootstrapTable('refresh',{pageNumber:1});
	});
	select_paySlip_startDay.on('select2:select',function(){
		paySlip_table.bootstrapTable('refresh',{pageNumber:1});
	});
	select_paySlip_endDay.on('select2:select',function(){
		paySlip_table.bootstrapTable('refresh',{pageNumber:1});
	});
	var add_paySlip_btn = $("#add_paySlip_btn_id");
	add_paySlip_btn.click(function() {
		$('#add_paySlip_Modal').modal("show");
	});
	
	var add_paySlip_submit_btn = $("#add_paySlip_submit_btn_id");
	add_paySlip_submit_btn.click(function() {
		$('#add_paySlip_Modal').modal("hide");
		var formArray = getFormDataArray($("#add_paySlip_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/addPaySlip',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					paySlip_table.bootstrapTable("refresh");
					type = BootstrapDialog.TYPE_SUCCESS;
				} else if (data == 1) {
					type = BootstrapDialog.TYPE_WARNING;
				} else {
					type = BootstrapDialog.TYPE_DANGER;
				}
				BootstrapDialog.show({
					type : type,
					title : "执行结果",
					buttons : [ {
						label : '关闭',
						action : function(dialogItself) {
							dialogItself.close();
						}
					} ],
					message : data.msg
				});
			}
		});
	});

});
