var organizationAttendanceRecord_table;
$(function(){
	organizationAttendanceRecord_table = $('#organizationAttendanceRecord_table_id');
	var select_organizationAttendanceRecord_startDay = $("#select_organizationAttendanceRecord_startDay");
	var select_organizationAttendanceRecord_endDay = $("#select_organizationAttendanceRecord_endDay");
	organizationAttendanceRecord_table.bootstrapTable({
		url : "/getOrganizationAttendanceRecordPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '机构考勤统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '机构考勤统计报表',
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
				'startDay' : select_organizationAttendanceRecord_startDay.val(),
				'endDay' : select_organizationAttendanceRecord_endDay.val(),
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
			field : 'checkTime',
			title : '考勤时间',
			width : "30%"
		}, {
			field : 'user.username',
			title : '考勤人员',
			width : "30%"
		}, {
			field : 'user.nickname',
			title : '名称',
			width : "40%"
		}]
	});
	
	select_organizationAttendanceRecord_startDay.on('select2:select',function(){
		organizationAttendanceRecord_table.bootstrapTable('refresh',{pageNumber:1});
	});
	select_organizationAttendanceRecord_endDay.on('select2:select',function(){
		organizationAttendanceRecord_table.bootstrapTable('refresh',{pageNumber:1});
	});
	
	var add_organizationAttendanceRecord_btn = $("#add_organizationAttendanceRecord_btn_id");
	add_organizationAttendanceRecord_btn.click(function() {
		$('#add_organizationAttendanceRecord_Modal').modal("show");
	});
	
	var add_organizationAttendanceRecord_submit_btn = $("#add_organizationAttendanceRecord_submit_btn_id");
	add_organizationAttendanceRecord_submit_btn.click(function() {
		$('#add_organizationAttendanceRecord_Modal').modal("hide");
		var formArray = getFormDataArray($("#add_organizationAttendanceRecord_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/addOrganizationAttendanceRecord',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					organizationAttendanceRecord_table.bootstrapTable("refresh");
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
