var organizationUser_table;
$(function(){
	var add_organizationUser_organizationRole = $('#add_organizationUser_organizationRole');
	var up_organizationUser_organizationRole = $('#up_organizationUser_organizationRole');
	$.ajax({
		type : 'POST',
		url : '/getAllOrganizationOrganizationRole',
		async: false,
		success : function(data) {
			add_organizationUser_organizationRole.empty();
			up_organizationUser_organizationRole.empty();
			$.each(data, function(i, organizationRole) {
				add_organizationUser_organizationRole.append($('<option value="' + organizationRole.id + '">'
						+ organizationRole.name + '</option>'));
				up_organizationUser_organizationRole.append($('<option value="' + organizationRole.id + '">'
						+ organizationRole.name + '</option>'));		
			});
			add_organizationUser_organizationRole.select2();
			up_organizationUser_organizationRole.select2();
		}
	});
	
	organizationUser_table = $('#organizationUser_table_id');
	organizationUser_table.bootstrapTable({
		url : "/getOrganizationUserPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '机构人员统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '机构人员统计报表',
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
			title : '员工编号',
			width : "10%"
		}, {
			field : 'nickname',
			title : '员工昵称',
			width : "10%"
		}, {
			field : 'username',
			title : '员工名',
			width : "20%"
		}, {
			field : 'statusName',
			title : '状态',
			width : "10%"
		}, {
			field : 'workStatusName',
			title : '工作状态',
			width : "10%"
		}, {
			field : 'organization.name',
			title : '所属机构',
			width : "10%"
		}, {
			field : 'role.name',
			title : '角色',
			width : "20%"
		}, {
			field : 'organizationRole',
			title : '部门',
			width : "10%",
			formatter:function(value,row, index){
				if(value == null)
					return "未分配";
	    		return value.name;
	    	}
		}]
	});

	var add_organizationUser_btn = $("#add_organizationUser_btn_id");
	add_organizationUser_btn.click(function() {
		$('#add_organizationUser_Modal').modal("show");
	});
	var up_organizationUser_btn = $("#up_organizationUser_btn_id");
	up_organizationUser_btn.click(function() {
		var selectRows = organizationUser_table.bootstrapTable("getSelections");
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
		$('#up_organizationUser_password').val('');
		$('#up_organizationUser_id').val(selectRows[0].id);
		$('#up_organizationUser_username').val(selectRows[0].username);
		$('#up_organizationUser_nickname').val(selectRows[0].nickname);
		$('#up_organizationUser_status').val(selectRows[0].status).select2();
		$('#up_organizationUser_workStatus').val(selectRows[0].workStatus).select2();
		$('#up_organizationUser_organizationRole').val(selectRows[0].organizationRole.id).select2();
		$('#up_organizationUser_Modal').modal("show");
	});
	var add_organizationUser_submit_btn = $("#add_organizationUser_submit_btn_id");
	add_organizationUser_submit_btn.click(function() {
		$('#add_organizationUser_Modal').modal("hide");
		var formArray = getFormDataArray($("#add_organizationUser_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/addOrganizationUser',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					organizationUser_table.bootstrapTable("refresh");
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
	var up_organizationUser_submit_btn = $("#up_organizationUser_submit_btn_id");
	up_organizationUser_submit_btn.click(function() {
		$('#up_organizationUser_Modal').modal("hide");
		var formArray = getFormDataArray($("#up_organizationUser_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/upOrganizationUser',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					organizationUser_table.bootstrapTable("refresh");
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
	var del_organizationUser_btn = $("#del_organizationUser_btn_id");
	del_organizationUser_btn.click(function() {
		var selectRows = organizationUser_table.bootstrapTable("getSelections");
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
				url : '/delOrganizationUser',
				data : {
					"ids" : ids.join(",")
				},
				success : function(data) {
					var type;
					if (data.status == 0) {
						organizationUser_table.bootstrapTable("refresh");
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
