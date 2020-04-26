var user_table;
$(function(){
	var add_user_role = $("#add_user_role");
	var up_user_role = $("#up_user_role");
	var select_user_role = $("#select_user_role");
	
	var add_user_organization = $("#add_user_organization");
	var up_user_organization = $("#up_user_organization");
	var select_user_organization = $("#select_user_organization");
	
	var add_user_organizationRole = $("#add_user_organizationRole");
	var up_user_organizationRole = $("#up_user_organizationRole");
	$.ajax({
		type : 'POST',
		url : '/getAllRole',
		async : false,
		success : function(data) {
			$.each(data, function(i, item) {
				add_user_role.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
				up_user_role.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
				select_user_role.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
			});
		}
	});
	add_user_role.select2();
	up_user_role.select2();
	select_user_role.select2();
	
	$.ajax({
		type : 'POST',
		url : '/getAllOrganization',
		async : false,
		success : function(data) {
			$.each(data, function(i, item) {
				add_user_organization.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
				up_user_organization.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
				select_user_organization.append($('<option value="' + item.id + '">'
						+ item.name + '</option>'));
			});
		}
	});
	add_user_organization.select2();
	up_user_organization.select2();
	select_user_organization.select2();
	
	add_user_organization.on('select2:select',function(){
		$.ajax({
			type : 'POST',
			url : '/getAllOrganizationRoleByOrganization',
			data:{
				"organizationId" : add_user_organization.val()
			},
			async: false,
			success : function(data) {
				add_user_organizationRole.empty();
				$.each(data, function(i, organizationRole) {
					add_user_organizationRole.append($('<option value="' + organizationRole.id + '">'
							+ organizationRole.name + '</option>'));
				});
				add_user_organizationRole.select2();
			}
		});
	});
	up_user_organization.on('select2:select',function(){
		$.ajax({
			type : 'POST',
			url : '/getAllOrganizationRoleByOrganization',
			data:{
				"organizationId" : up_user_organization.val()
			},
			async: false,
			success : function(data) {
				up_user_organizationRole.empty();
				$.each(data, function(i, organizationRole) {
					up_user_organizationRole.append($('<option value="' + organizationRole.id + '">'
							+ organizationRole.name + '</option>'));
				});
				up_user_organizationRole.select2();
			}
		});
	});
	add_user_organization.trigger('select2:select');
	up_user_organization.trigger('select2:select');
	
	user_table = $('#user_table_id');
	user_table.bootstrapTable({
		url : "/getUserPage",
		striped : true, // 是否显示行间隔色

		search : true,
		//导出
		showExport : true,
        exportOptions:{
            fileName: '员工统计报表',  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            tableName: '员工统计报表',
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
				'organizationId' : $('#select_user_organization').val(),
				'role_id' : $('#select_user_role').val(),
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
		} , {
			field : 'role.name',
			title : '角色',
			width : "20%"
		} , {
			field : 'organization.name',
			title : '所属机构',
			width : "10%"
		} , {
			field : 'organizationRole.name',
			title : '部门',
			width : "10%"
		}]
	});

	select_user_role.on('select2:select',function(){
		user_table.bootstrapTable('refresh',{pageNumber:1});
	});
	select_user_organization.on('select2:select',function(){
		user_table.bootstrapTable('refresh',{pageNumber:1});
	});
	//--------
	$('#up_user_status').select2();
	$('#up_user_workStatus').select2();
	var add_user_btn = $("#add_user_btn_id");
	add_user_btn.click(function() {
		$('#add_user_role').val(select_user_role.val()).select2();
		$('#add_user_organization').val(select_user_organization.val()).select2();
		$('#add_user_organization').trigger('select2:select');
		$('#add_user_Modal').modal("show");
	});
	var up_user_btn = $("#up_user_btn_id");
	up_user_btn.click(function() {
		var selectRows = user_table.bootstrapTable("getSelections");
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
		$('#up_user_password').val('');
		$('#up_user_id').val(selectRows[0].id);
		$('#up_user_username').val(selectRows[0].username);
		$('#up_user_nickname').val(selectRows[0].nickname);
		$('#up_user_role').val(selectRows[0].role.id).select2();
		$('#up_user_organization').val(selectRows[0].organization.id).select2();
		$('#up_user_organization').trigger('select2:select');
		if(selectRows[0].organizationRole!=null){
			$('#up_user_organizationRole').val(selectRows[0].organizationRole.id).select2();
		}
		$('#up_user_status').val(selectRows[0].status).select2();
		$('#up_user_workStatus').val(selectRows[0].workStatus).select2();
		$('#up_user_Modal').modal("show");
	});
	var add_user_submit_btn = $("#add_user_submit_btn_id");
	add_user_submit_btn.click(function() {
		$('#add_user_Modal').modal("hide");
		var formArray = getFormDataArray($("#add_user_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/addUser',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					user_table.bootstrapTable("refresh");
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
	var up_user_submit_btn = $("#up_user_submit_btn_id");
	up_user_submit_btn.click(function() {
		$('#up_user_Modal').modal("hide");
		var formArray = getFormDataArray($("#up_user_form_id"));

		var formData = eval('({' + formArray.join(',') + '})');
		$.ajax({
			type : 'POST',
			url : '/upUser',
			data : formData,
			success : function(data) {
				var type;
				if (data.status == 0) {
					user_table.bootstrapTable("refresh");
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
	var del_user_btn = $("#del_user_btn_id");
	del_user_btn.click(function() {
		var selectRows = user_table.bootstrapTable("getSelections");
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
				url : '/delUser',
				data : {
					"ids" : ids.join(",")
				},
				success : function(data) {
					var type;
					if (data.status == 0) {
						user_table.bootstrapTable("refresh");
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
