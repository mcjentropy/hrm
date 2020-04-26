var organizationOrganizationRole_tree;
var organizationItemAndItemProductionLineAndItemProcess_tree;
var organizationOrganizationRole_tree_setting = {
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
var organizationOrganizationRole_tree_init = function(){
	if(organizationOrganizationRole_tree != null)
		organizationOrganizationRole_tree.destroy();
	    $.ajax({
	    	  type: 'POST',
	    	  url: '/getAllOrganizationOrganizationRole',
	    	  async: false,
	    	  success: function(data){
	    		  organizationOrganizationRole_tree = $.fn.zTree.init($("#organizationOrganizationRole_tree_id"),organizationOrganizationRole_tree_setting,data);
	    		  organizationOrganizationRole_tree.expandAll(true);
	    	  }
	    });
}
$(function(){ 
	
	organizationOrganizationRole_tree_init();
    
    var add_organizationOrganizationRole_btn = $('#add_organizationOrganizationRole_btn_id');
    add_organizationOrganizationRole_btn.click(function(){
    	$('#add_organizationOrganizationRole_Modal').modal("show");
    });
    
    var up_organizationOrganizationRole_btn = $('#up_organizationOrganizationRole_btn_id');
    up_organizationOrganizationRole_btn.click(function(){
    	var checkedNodes = organizationOrganizationRole_tree.getCheckedNodes();//勾选框
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
				message: "请选择一个部门"
			});
			return;
		}
		var node = checkedNodes[0];
    	$("#up_organizationOrganizationRole_name").val(node.name);
    	$("#up_organizationOrganizationRole_Modal").modal("show");
    });
    
    var del_organizationOrganizationRole_btn = $("#del_organizationOrganizationRole_btn_id");
    
    del_organizationOrganizationRole_btn.click(function(){
    	var checkedNodes = organizationOrganizationRole_tree.getCheckedNodes();//勾选框
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
				message: "至少选择一个角色"
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
		    	  url: '/delOrganizationOrganizationRole',
		    	  data: {
		    		  "ids":ids.join(",")
		    		  },
		    	  success: function(data){
		    		  var type;
		    		  if(data.status == 0){
		    			  organizationOrganizationRole_tree_init();
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
    
	
	var add_organizationOrganizationRole_submit_btn = $("#add_organizationOrganizationRole_submit_btn_id");
	add_organizationOrganizationRole_submit_btn.click(function(){

		
		var formArray = getFormDataArray($("#add_organizationOrganizationRole_form_id"));
		
		var formData = eval('({'+formArray.join(',')+'})');

		$.ajax({
	    	  type: 'POST',
	    	  url: '/addOrganizationOrganizationRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#add_organizationOrganizationRole_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  organizationOrganizationRole_tree_init();
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
	
	var up_organizationOrganizationRole_submit_btn = $("#up_organizationOrganizationRole_submit_btn_id");
	up_organizationOrganizationRole_submit_btn.click(function(){
		var checkedNodes = organizationOrganizationRole_tree.getCheckedNodes();//勾选框
		var node = checkedNodes[0];
		var formArray = getFormDataArray($("#up_organizationOrganizationRole_form_id"));
		var id = node.id;
		formArray.push('"id":'+id);
		var formData = eval('({'+formArray.join(',')+'})');
		$.ajax({
	    	  type: 'POST',
	    	  url: '/upOrganizationOrganizationRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#up_organizationOrganizationRole_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  organizationOrganizationRole_tree_init();
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
