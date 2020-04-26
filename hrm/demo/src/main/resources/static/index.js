var FontAwesome;
var Glyphicons;
/**
 * 根据父标签id，创建input标签 
 * 父标签至少拥有一个input子标签
 * @param id	父标签id
 * @returns
 */
function createInput(id){
	var inputSDiv = $('#'+id);
	var newInput = inputSDiv.children("input:last-child").clone();
	newInput.val('');
	inputSDiv.append(newInput);
}
/**
 * 如果父标签具备2个以上的input子标签,删除最后一个input子标签
 * @param id 父标签id
 * @returns
 */
function deleteLastInput(id){
	var inputSDiv = $('#'+id);
	if(inputSDiv.children("input").length==1)
		return;
	inputSDiv.children("input:last-child").remove();
}
function createInputAndSetValue(id,values){
	var len = values.length;
	if(len<1)
		return;
	var inputSDiv = $('#'+id);
	if(inputSDiv.children("input").length>len){
		while(inputSDiv.children("input").length!=len){
			inputSDiv.children("input:last-child").remove();
		}
	}
	else{
		while(inputSDiv.children("input").length!=len){
			createInput(id);
		}
	}
	for(var i=0;i<len;i++){
		inputSDiv.children("input")[i].value=values[i];
	}
}
//获取form表单数据的json数组
function getFormDataArray(formDom){
	var form_data = formDom.serializeArray();

	var fieldNamesArray = [];
	for(var index = 0;index < form_data.length;index++){
		var field = form_data[index];
		var fieldName = '"'+field.name+'"';
		var fieldValue = '"'+decodeURIComponent(field.value,true)+'"';
		var find = false;
		for(var i=0;i<fieldNamesArray.length;i++){
			if(fieldNamesArray[i].fieldname == fieldName){
				find = true;
				var value = fieldNamesArray[i].fieldvalue;
				if(value.startsWith('[')&&value.endsWith(']')){
					fieldNamesArray[i].fieldvalue = value.substring(0,value.length-1)+','+fieldValue+']';
				}
				else{
					fieldNamesArray[i].fieldvalue = '['+value+','+fieldValue+']';
				}
				break;
			}
		}
		if(find){
			continue;
		}
		else{
			fieldNamesArray.push({
				"fieldname":fieldName,
				"fieldvalue":fieldValue
			});
		}
	}
	var m = [];
	for(var j=0;j<fieldNamesArray.length;j++){
		m.push(fieldNamesArray[j].fieldname+':'+fieldNamesArray[j].fieldvalue);
	}
	return m;
}
$(function(){
	$.ajax({
  	  type: 'POST',
  	  url: '/getFontAweSome',
  	  success: function(data){
  		FontAwesome = data;
  	  }
  	});
	$.ajax({
	  	  type: 'POST',
	  	  url: '/getGlyphicons',
	  	  success: function(data){
	  		Glyphicons = data;
	  	  }
	  	});

    $.ajax({
    	  type: 'POST',
    	  url: '/getPermission',
    	  success: function(data){
    		  var menu = $(".sidebar-menu");
    		  createTree(data,menu);
    	  }
    	});
    $('#userHeadImgUploadBtn').click(function(){
    	$('#upload_user_image_Modal').modal("show");
    });
    var upload_user_image_submit_btn = $("#upload_user_image_submit_btn_id");
	upload_user_image_submit_btn.click(function(){
		$('#upload_user_image_Modal').modal("hide");
		$('#waiting_Modal').modal("show");
		$('#upload_user_image_form_id').ajaxSubmit(function(data){
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
			  $('#waiting_Modal').modal("hide");
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
			});
		});
	
	$('#userInfoEditBtn').click(function(){
    	$('#edit_user_info_Modal').modal("show");
    });
    var edit_user_info_submit_btn = $("#edit_user_info_submit_btn_id");
    edit_user_info_submit_btn.click(function(){
    	var edit_nickname = $("#edit_user_nickname").val();
    	if(edit_nickname == null || edit_nickname == ''){
    		BootstrapDialog.show({
				type: BootstrapDialog.TYPE_WARNING,
				title: "修改失败",
			buttons: [ {
                label: '关闭',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }],
				message: '昵称不可为空!'
			});
		 return;
    	}
    	var edit_pwd = $("#edit_user_password").val();
    	var check_pwd = $("#check_user_password").val();
    	if(edit_pwd!=check_pwd){
    		 BootstrapDialog.show({
					type: BootstrapDialog.TYPE_WARNING,
					title: "密码错误",
				buttons: [ {
	                label: '关闭',
	                action: function(dialogItself){
	                    dialogItself.close();
	                }
	            }],
					message: '两次输入的密码不一致'
				});
    		 return;
    	}
		$('#edit_user_info_form_id').ajaxSubmit(function(data){
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
			  $('#edit_user_info_Modal').modal("hide");
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
			});
		});
});

function openPane(name){
	if(!(name.endsWith("_html"))){
		return;
	}
	var section_id = name+'_section_id';
	var wrapper = $(".content-wrapper");
	if($('#'+section_id).length>0){
		$('#'+section_id).prependTo(wrapper);
		return;
	}	
    $.ajax({
  	  type: 'POST',
  	  url: name,
  	  data: {},
  	  async:false,
  	  success: function(data){
  		  if(data.status == 2){
			BootstrapDialog.show({
				type : BootstrapDialog.TYPE_DANGER,
				title : "提示",
				buttons : [ {
					label : '关闭',
					action : function(dialogItself) {
						dialogItself.close();
					}
				} ],
				message : data.msg
			});
			return;
  		  }
  		  var section = $('<section id="'+section_id+'" class="content"></section>');
  		  var box = $(data);
  		  section.append(box);
  		  wrapper.prepend(section);
  		  
  		  var boxHeader = box.children('.box-header');
			if (boxHeader.length > 0) {
				var boxTools = boxHeader.children('.box-tools');
				if (boxTools.length > 0) {
					var collapseTrigger = boxTools
							.children('[data-widget="collapse"]');
					if (collapseTrigger.length > 0) {
						collapseTrigger.attr('id', section_id
								+ '_collapseBtn');
					}
					var removeTrigger = boxTools
							.children('[data-widget="remove"]');
					if (removeTrigger.length > 0) {
						removeTrigger.attr('id', section_id
								+ '_removeBtn');
					}
					box.boxWidget({
						animationSpeed : 500,
						collapseTrigger : '#' + section_id
								+ '_collapseBtn',
						removeTrigger : '#' + section_id + '_removeBtn'
					});
					box.on('removed.boxwidget', function() {
						section.remove();
					});
				}

			}
		}
  	});
}

function createTree(data,root){
	var comparator = function(obja,objb){
		if(obja.id>objb.id)
			return 1;
		else if(obja.id<objb.id)
			return -1;
		else
			return 0;
	}
	data.sort(comparator);
	var tree = [];
	for(var i=0;i<data.length;i++){
		var node = data[i];
		var parent_index = 0;
		var parent_flag = false;
		while(parent_index<tree.length){
			if(tree[parent_index].id === node.pid){
				parent_flag = true;
				break;
			}
			parent_index++;
		}
		if(node.parent){
			  var newParentDiv = $('<li class="treeview"><a href="#" onclick=\"openPane(\''+node.permission+'\')\"><i class="'+node.icon+'"></i> <span>'+node.name+'</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>');
			  var treeDiv = $('<ul class="treeview-menu"></ul>');
			  if(parent_flag)
				  tree[parent_index].ele.append(newParentDiv);
			  else
				  root.append(newParentDiv);
			  newParentDiv.append(treeDiv);
			  node.ele = treeDiv;
			  tree.push(node);
		}
	   else{	
		  var newParentDiv = $('<li><a href="#" onclick=\"openPane(\''+node.permission+'\')\"><i class="'+node.icon+'"></i> <span>'+node.name+'</span></a></li>');
		  node.ele = newParentDiv;
		  if(parent_flag)
			  tree[parent_index].ele.append(newParentDiv);		  
		  else
			  root.append(newParentDiv);
		  tree.push(node);
	   }
	}
}