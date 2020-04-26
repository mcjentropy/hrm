
$(function(){
    var up_role_perm__btn = $("#up_role_perm__btn_id");
    up_role_perm__btn.click(function(){
    	var role_checkedNodes = role_tree.getCheckedNodes();//勾选框
		if(role_checkedNodes.length == 0){
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
    	var perm_checkedNodes = permission_tree.getCheckedNodes();//勾选框
		var perm_ids = [];
		var role_ids = [];
		$.each(role_checkedNodes,function(i,field){
			role_ids.push(field.id);
		});
		$.each(perm_checkedNodes,function(i,field){
			perm_ids.push(field.id);
		});

		$.ajax({
	    	  type: 'POST',
	    	  url: '/role_permission_up',
	    	  data: {
	    		  "role_ids":role_ids.join(","),
	    		  "perm_ids":perm_ids.join(",")
	    		  },
	    	  success: function(data){
	    		  var type;
	    		  if(data.status == 0){
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
