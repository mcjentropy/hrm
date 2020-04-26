var role_tree;
var role_tree_setting = {
		   check:{
			   enable:true,
			   chkboxType:{"Y":"s","N":"s"},
			   autoCheckTrigger:true
		   },
		   data:{
			   simpleData:{
				   enable:true
			   }
		   },
		   callback:{
			   onCheck:function(){
				   if(permission_tree == null)
					   return;
					var role_checkedNodes = role_tree.getCheckedNodes();
					var role_ids = [];
					$.each(role_checkedNodes,function(i,field){
						role_ids.push(field.id);
					});
					$.ajax({
				    	  type: 'POST',
				    	  url: '/getPermissionsByRoles',
				    	  async:false,
				    	  data: {
				    		  "role_ids":role_ids.join(",")
				    		  },
				    	  success: function(data){
				    		  permission_tree.checkAllNodes(false);
				    		  $.each(data,function(i,item){
				    			  var perm_node = permission_tree.getNodeByParam("id",item.id,null);
				    			  perm_node.checked = true;
				    			  permission_tree.updateNode(perm_node,true);
				    		  });
				    	  }
				    });
				}

		   }
};
var role_tree_init = function(){
	if(role_tree != null)
		role_tree.destroy();
	    $.ajax({
	    	  type: 'POST',
	    	  url: '/getAllRole',
	    	  async: false,
	    	  success: function(data){
	    		  role_tree = $.fn.zTree.init($("#role_tree_id"),role_tree_setting,data);
	    		  role_tree.expandAll(true);
	    	  }
	    });
}
$(function(){ 
	
	role_tree_init();
    
    var add_role_btn = $('#add_role_btn_id');
    add_role_btn.click(function(){
    	$('#add_role_Modal').modal("show");
    });
    
    var up_role_btn = $('#up_role_btn_id');
    up_role_btn.click(function(){
    	var checkedNodes = role_tree.getCheckedNodes();//勾选框
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
    	$("#up_role_role").val(node.role);
    	$("#up_role_name").val(node.name);
    	$("#up_role_Modal").modal("show");
    });
    
    var del_role_btn = $("#del_role_btn_id");
    
    del_role_btn.click(function(){
    	var checkedNodes = role_tree.getCheckedNodes();//勾选框
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
		    	  url: '/delRole',
		    	  data: {
		    		  "ids":ids.join(",")
		    		  },
		    	  success: function(data){
		    		  var type;
		    		  if(data.status == 0){
		    			  role_tree_init();
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
    
	
	var add_role_submit_btn = $("#add_role_submit_btn_id");
	add_role_submit_btn.click(function(){

		
		var formArray = getFormDataArray($("#add_role_form_id"));
		
		var formData = eval('({'+formArray.join(',')+'})');

		$.ajax({
	    	  type: 'POST',
	    	  url: '/addRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#add_role_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  role_tree_init();
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
	
	var up_role_submit_btn = $("#up_role_submit_btn_id");
	up_role_submit_btn.click(function(){
		var checkedNodes = role_tree.getCheckedNodes();//勾选框
		var node = checkedNodes[0];
		var formArray = getFormDataArray($("#up_role_form_id"));
		var id = node.id;
		formArray.push('"id":'+id);
		var formData = eval('({'+formArray.join(',')+'})');
		$.ajax({
	    	  type: 'POST',
	    	  url: '/upRole',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#up_role_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  role_tree_init();
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
