var permission_tree;
var permission_tree_setting = {
		   check:{
			   enable:true,
			   chkboxType:{"Y":"s","N":"s"},
			   autoCheckTrigger:true
		   },
		   data:{
			   simpleData:{
				   pIdKey:"pid",
				   enable:true
			   }
		   },
		   callback:{
			   onCheck:null
		   }
};
var permission_tree_init = function(){
	if(permission_tree != null)
		permission_tree.destroy();
	    $.ajax({
	    	  type: 'POST',
	    	  url: '/getAllPermission',
	    	  async: false,
	    	  success: function(data){
	    		  permission_tree = $.fn.zTree.init($("#permission_tree_id"),permission_tree_setting,data);
	    		  permission_tree.expandAll(true);
	    	  }
	    });
}
$(function(){ 

    var add_perm_icon = $("#add_perm_icon");
    var up_perm_icon = $("#up_perm_icon");
	//index.js---FontAwesome
	var icons = [];
	$.each(FontAwesome,function(i,item){
		var icon = '<i class="'+item.className+'"></i>';
		icons.push(icon);
	});

	add_perm_icon.select2({
		data:icons,
		escapeMarkup:function(m){
			return m;
		}
	});	
	up_perm_icon.select2({
		data:icons,
		escapeMarkup:function(m){
			return m;
		}
	});	

	permission_tree_init();
    
    var add_perm_btn = $('#add_permission_btn_id');
    add_perm_btn.click(function(){
		var checkedNodes = permission_tree.getCheckedNodes();//勾选框
		if(checkedNodes.length>1){
			$('#add_permission_Modal').modal("hide");
			BootstrapDialog.show({
				type: BootstrapDialog.TYPE_WARNING,
				title: "添加失败",
				buttons: [ {
		                label: '关闭',
		                action: function(dialogItself){
		                    dialogItself.close();
		                }
		            }],
				message: "父权限数量至多为一"
			});
			return;
		}
    	$('#add_permission_Modal').modal("show");
    });
    
    var up_perm_btn = $('#up_permission_btn_id');
    up_perm_btn.click(function(){
    	var checkedNodes = permission_tree.getCheckedNodes();//勾选框
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
				message: "请选择一个权限"
			});
			return;
		}
		var node = checkedNodes[0];
    	$("#up_perm_permission").val(node.permission);
    	$("#up_perm_name").val(node.name);
    	$("#up_permission_Modal").modal("show");
    });
    
    var del_perm_btn = $("#del_permission_btn_id");
    
    del_perm_btn.click(function(){
    	var checkedNodes = permission_tree.getCheckedNodes();//勾选框
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
				message: "至少选择一个权限"
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
		    	  url: '/delPermission',
		    	  data: {
		    		  "ids":ids.join(",")
		    		  },
		    	  success: function(data){
		    		  var type;
		    		  if(data.status == 0){
		    			  permission_tree_init();
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
    

	//$(data).attr('class')
	
	var add_permission_submit_btn = $("#add_permission_submit_btn_id");
	add_permission_submit_btn.click(function(){

		var checkedNodes = permission_tree.getCheckedNodes();//勾选框
		
		var formArray = getFormDataArray($("#add_perm_form_id"));
		var icon = $($('#add_perm_icon').val()).attr("class");
		
		formArray.push('"icon":"'+icon+'"');
		
		if(checkedNodes.length==1){
			formArray.push('"pid":'+checkedNodes[0].id);
		}
		var formData = eval('({'+formArray.join(',')+'})');

		$.ajax({
	    	  type: 'POST',
	    	  url: '/addPermission',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#add_permission_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  permission_tree_init();
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
	
	var up_permission_submit_btn = $("#up_permission_submit_btn_id");
	up_permission_submit_btn.click(function(){
		var checkedNodes = permission_tree.getCheckedNodes();//勾选框
		var node = checkedNodes[0];
		var formArray = getFormDataArray($("#up_perm_form_id"));
		var icon = $($('#up_perm_icon').val()).attr("class");
		formArray.push('"icon":"'+icon+'"');
		var id = node.id;
		formArray.push('"id":'+id);
		var pid = node.pid;
		formArray.push('"pid":'+pid);
		var parent = node.parent;
		formArray.push('"parent":'+parent);
		var formData = eval('({'+formArray.join(',')+'})');
		$.ajax({
	    	  type: 'POST',
	    	  url: '/upPermission',
	    	  data: formData,
	    	  success: function(data){
	    		  $('#up_permission_Modal').modal("hide");
	    		  var type;
	    		  if(data.status == 0){
	    			  permission_tree_init();
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
