var organization_table;
$(function(){
	organization_table = $('#organization_table_id');
	organization_table.bootstrapTable({
		url : "/getOrganizationPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '机构统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '机构统计报表',
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
			field : 'id',
			title : '机构编号',
			width : "20%"
		}, {
			field : 'name',
			title : '机构名称',
			width : "80%"
		}]
	});

	var add_organization_btn = $("#add_organization_btn_id");
	add_organization_btn.click(function() {
		$('#add_organization_Modal').modal("show");
	});
	var up_organization_btn = $("#up_organization_btn_id");
	up_organization_btn.click(function() {
		var selectRows = organization_table.bootstrapTable("getSelections");
		if (selectRows.length != 1) {
			BootstrapDialog.show({
				type : BootstrapDialog.TYPE_WARNING,
				title : "错误",
				buttons : [ {
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				} ],
				message : '请选择一行记录'
			});
			return;
		}
		$('#up_organization_id').val(selectRows[0].id);
		$('#up_organization_name').val(selectRows[0].name);

		$('#up_organization_Modal').modal("show");
	});
	var add_organization_submit_btn = $("#add_organization_submit_btn_id");
	add_organization_submit_btn.click(function() {
		$('#add_organization_Modal').modal("hide");
		var formArray = getFormDataArray($("#add_organization_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/addOrganization',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					organization_table.bootstrapTable("refresh");
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
	var up_organization_submit_btn = $("#up_organization_submit_btn_id");
	up_organization_submit_btn.click(function() {
		$('#up_organization_Modal').modal("hide");
		var formArray = getFormDataArray($("#up_organization_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/upOrganization',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					organization_table.bootstrapTable("refresh");
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
	var del_organization_btn = $("#del_organization_btn_id");
	del_organization_btn.click(function() {
		var selectRows = organization_table.bootstrapTable("getSelections");
		if (selectRows.length == 0) {
			BootstrapDialog.show({
				type : BootstrapDialog.TYPE_WARNING,
				title : "错误",
				buttons : [ {
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				} ],
				message : '至少选择一行记录'
			});
			return;
		} else {
			var ids = [];
			$.each(selectRows, function(i, row) {
				ids.push(row.id);
			});

			$.ajax({
				type : 'POST',
				url : '/delOrganization',
				data : {
					"ids" : ids.join(",")
				},
				success : function(data) {
					var type;
					if (data.status == 0) {
						organization_table.bootstrapTable("refresh");
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
		}
	});

});
