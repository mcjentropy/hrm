var organizationRole_tree;
var organizationRole_tree_setting = {
		   check:{
			   enable:true,
			   chkboxType:{"Y":"s","N":"s"},
			   autoCheckTrigger:true
		   },
		   data:{
			   simpleData:{
				   enable:true
			   }
		   }
}
var organizationRole_tree_init = function(){
	if(organizationRole_tree != null)
		organizationRole_tree.destroy();
	    $.ajax({
	    	  type: 'POST',
	    	  url: '/getAllOrganizationRoleByOrganization',
	    	  data:{
	    		  "organizationId" : $('#select_organizationRole_organization').val()
	    	  },
	    	  async: false,
	    	  success: function(data){
	    		  organizationRole_tree = $.fn.zTree.init($("#organizationRole_tree_id"),organizationRole_tree_setting,data);
	    		  organizationRole_tree.expandAll(true);
	    	  }
	    });
}
$(function(){ 
	var select_organizationRole_organization = $("#select_organizationRole_organization");
	$.ajax({
		type : 'POST',
		url : '/getAllOrganization',
		async : false,
		success : function(data) {
			select_organizationRole_organization.empty();
			$.each(data, function(i, organization) {
				select_organizationRole_organization.append($('<option value="' + organization.id + '">'
						+ organization.name + '</option>'));
			});
			select_organizationRole_organization.select2();
		}
	});
	organizationRole_tree_init();
	select_organizationRole_organization.on('select2:select',function(){
		organizationRole_tree_init();
	});
    var add_organizationRole_btn = $('#add_organizationRole_btn_id');
    add_organizationRole_btn.click(function(){
    	$('#add_organizationRole_Modal').modal("show");
    });
    
    var up_organizationRole_btn = $('#up_organizationRole_btn_id');
    up_organizationRole_btn.click(function(){
    	var checkedNodes = organizationRole_tree.getCheckedNodes();//勾选框
		if(checkedNodes.length != 1){
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_WARNING,
				title: "提示",
				buttons: [ {
		                label: "关闭",
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            }],
				message: "请选择一个角色"
			});
			return;
		}
		var node = checkedNodes[0];
    	$("#up_organizationRole_name").val(node.name);
    	$("#up_organizationRole_Modal").modal("show");
    });
    
    var del_organizationRole_btn = $("#del_organizationRole_btn_id");
    
    del_organizationRole_btn.click(function(){
    	var checkedNodes = organizationRole_tree.getCheckedNodes();//勾选框
		if(checkedNodes.length == 0){
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_WARNING,
				title: "提示",
				buttons: [ {
		                label: "关闭",
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            }],
				message: "至少选择一个部门"
			});
			return;
		}
		else{
			var ids = [];
			$.each(checkedNodes,function(i,field){
				ids.push(field.id);
			});

			$.ajax({
		    	  type: 'POST',
		    	  url: '/delOrganizationRole',
		    	  data: {
		    		  "ids":ids.join(",")
		    		  },
		    	  success: function(data){
		    		  var type;
		    		  if(data.status == 0){
		    			  organizationRole_tree_init();
		    			  type = BootstrapDialog.TYPE_SUCCESS;
		    		  }
		    		  else if(data == 1){
		    			  type = BootstrapDialog.TYPE_WARNING;
		    		  }
		    		  else{
		    			  type = BootstrapDialog.TYPE_DANGER;
		    		  }
		    		  BootstrapDialog.show({
		  				type: type,
		  				title: "执行结果",
						buttons: [ {
			                label: '关闭',
			                action: function(dialogItself){
			                    dialogItself.close();
			                }
			            }],
		  				message: data.msg
		  			});
		    	  }
		    	});
		}
    });
    
	
	var add_organizationRole_submit_btn = $("#add_organizationRole_submit_btn_id");
	add_organizationRole_submit_btn.click(function(){

		
		var formArray = getFormDataArray($("#add_organizationRole_form_id"));
		formArray.push('"organizationId":'+ $('#select_organizationRole_organization').val());
		
		var formData = eval('({'+formArray.join(',')+'})');

		$.ajax({
	    	  type: 'POST',
	    	  url: '/addOrganizationRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#add_organizationRole_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  organizationRole_tree_init();
	    			  type = BootstrapDialog.TYPE_SUCCESS;
	    		  }
	    		  else if(data == 1){
	    			  type = BootstrapDialog.TYPE_WARNING;
	    		  }
	    		  else{
	    			  type = BootstrapDialog.TYPE_DANGER;
	    		  }
	    		  BootstrapDialog.show({
	  				type: type,
	  				title: "执行结果",
					buttons: [ {
		                label: '关闭',
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            }],
	  				message: data.msg
	  			});
	    	  }
	    	});
	    	
	});
	
	var up_organizationRole_submit_btn = $("#up_organizationRole_submit_btn_id");
	up_organizationRole_submit_btn.click(function(){
		var checkedNodes = organizationRole_tree.getCheckedNodes();//勾选框
		var node = checkedNodes[0];
		var formArray = getFormDataArray($("#up_organizationRole_form_id"));
		var id = node.id;
		formArray.push('"id":'+id);
		var formData = eval('({'+formArray.join(',')+'})');
		$.ajax({
	    	  type: 'POST',
	    	  url: '/upOrganizationRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#up_organizationRole_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  organizationRole_tree_init();
	    			  type = BootstrapDialog.TYPE_SUCCESS;
	    		  }
	    		  else if(data == 1){
	    			  type = BootstrapDialog.TYPE_WARNING;
	    		  }
	    		  else{
	    			  type = BootstrapDialog.TYPE_DANGER;
	    		  }
	    		  BootstrapDialog.show({
	  				type: type,
	  				title: "执行结果",
					buttons: [ {
		                label: '关闭',
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            }],
	  				message: data.msg
	  			});
	    	  }
	    	});
	});
});
