/**
 * UMD(Universal Module Definition - 범용 모듈 정의) 패턴 
 * @param factory
 * @since 2020.02.19
 * @author 진주영
 */

;(function (factory) {	
	"use strict";
	
	factory(jQuery);
}(function ($, undefined) {	
	"use strict";
	/* 기본 설정 */
	
	$.osl = {
		name: "LUNA™OPS 2.0"	
		,deferred: $.Deferred() 
		,version: "2.0"		
		,cVersion: "1.06"	
		,langCd: "ko"		
		,selPrjGrpId: ''
		,selPrjId: ''
		,selAuthGrpId: ''
		,isReady: false		
		/**
		 *  function 명 	: $.osl.ready
		 *  function 설명	: 코어 init 실행이 모두 완료된 경우 callback 실행
		 *  @param callback: 코어 init 실행 이후 callback 함수
		 **/
		,ready: function(callback){
			
			if(typeof callback != "function"){
				return false;
			}
			
			
			
			if($(".modal-body").length > 0){
				$.osl.deferred.then(function(){
					
					$(".modal-body:eq(0)").find(".kt-select2").select2({width: '100%'});
					
					callback();
					
					
					$.osl.langConvert(".modal-body");
					
					$.osl.isReady = true;
				});
			}
			
			
			else if(this.isReady){
				callback();
			}else{
				
				
				$.osl.deferred.then(function(){
					callback();
					
					
					$.osl.langConvert("#kt_content");
					$.osl.isReady = true;
				});
			}
		}
		/**
		 *  function 명 	: $.osl.init
		 *  function 설명	: 즐겨찾기, 메뉴, 프로젝트 및 권한 그룹 및 솔루션 초기 세팅
		 **/
		,init: function(){
			
			$.validator.addMethod("regex", function(value, element, regexpr) {
				
				var rtnVal = regexpr.test(value);
				
				
				if($.osl.isNull(value) && $.osl.isNull($(element).attr("required"))){
					rtnVal = true;
				}
				
			    return rtnVal;
			});
			
			
			OSLCoreLangSetting.init();
			
			
			$.validator.addMethod("email", function(value, element) {
			    if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
			        return true;
			    } else {
			        return false;
			    }
			}, "이메일 형식이 아닙니다.");
			/* taostr options */
			toastr.options = {
					  "closeButton": true,
					  "debug": false,
					  "newestOnTop": false,
					  "progressBar": true,
					  "positionClass": "toast-top-right",
					  "preventDuplicates": false,
					  "onclick": null,
					  "showDuration": "0",
					  "hideDuration": "300",
					  "timeOut": "3000",
					  "extendedTimeOut": "1000",
					  "showEasing": "swing",
					  "hideEasing": "linear",
					  "showMethod": "fadeIn",
					  "hideMethod": "fadeOut"
					};
			var headerExist = $("#kt_header");
			var contentExist = $("#kt_content");
			
			
			$(document).keydown(function(event) {
				
				if ( event.keyCode == 113 || event.which == 113 ) {
					var modalList = $(".modal");
					$.each(modalList, function(idx, map){
						var dragObj = $(map).data("draggabilly");
						
						if(!$.osl.isNull(dragObj)){
							
							dragObj.setPosition(0,0);
						}
					});
				}
			});
			
			
			if(!$.osl.isNull(headerExist) && headerExist.length > 0){
				
				$.osl.initHeaderClear();
				
				$.osl.initHeader(function(){
					var headerFnBar = new KTToggle('kt_header_pc_topbar_toggler', {
			            target: 'body',
			            targetState: 'kt-header__topbar--pc-on',
			            togglerState: 'kt-header-pc__toolbar-topbar-toggler--active'
			        });

					
					if($.osl.user.usrOptData.hasOwnProperty("OPT00002") && !$.osl.isNull($.osl.user.usrOptData["OPT00002"].value)){
	    				if($.osl.user.usrOptData["OPT00002"].value == "02"){
	    					headerFnBar.toggleOn();
	    					KTLayout.getAsideToggler().toggleOn();
	    				}
	    			}
					
    				
        			KTApp.initTooltips();
        			
        			
        			$.osl.deferred.resolve();
				});
			}else{
				
				$.osl.deferred.resolve();
			}
			
			
			if(!$.osl.isNull(contentExist) && contentExist.length > 0){
				
				var portletList = contentExist.find(".kt-portlet");
				$.each(portletList, function(idx, map){
					var elemId = $(map).attr("id");
					
					if(!$.osl.isNull(portletList)){
						
					}
				});
			}
			
			return $.osl.deferred.promise();
		}
		/**
		 *  function 명 	: $.osl.file
		 *  function 설명	: 파일 기본 객체
		 **/
		,file:{
			/**
			 *  function 명 	: $.osl.file.uploadSet
			 *  function 설명	: 해당 targetId element에 파일 업로드를 세팅한다.
			 *  @param targetId: 파일 업로드 영역 대상 Id (# 제외)
			 *  @param config: 
			 **/
			uploadSet: function(targetId, config){
				var rtnObject = null;
				
				var defaultConfig = {
					/* 고정 옵션 - 변경 없음 */
					proudlyDisplayPoweredByUppy: false,
					inline: true,
					browserBackButtonClose: true,
					debug: false,
					logger: {
						debug: function(args){},
						warn: function(args){},
						error: function(args){}
					},
					
					/* 동적 옵션 */
					target: "#"+targetId,
					width:'100%',
					height:370,
					note: '',
					replaceTargetContent: true,
					showProgressDetails: true,
					disableStatusBar:true,
					hideCancelButton: true,
					/* 파일 다운로드, 읽기 전용 기능 */
					fileDownload: false,
					fileReadonly: false,
					/* core config */
					autoProceed: false,
					maxFileSize: 100,	
					maxNumberOfFiles: 10,
					minNumberOfFiles: 0,
					allowedFileTypes: null,	
					locale:Uppy.locales.ko_KR,
					meta: {},
					onBeforeUpload: $.noop,
					onBeforeFileAdded: $.noop,
				};
				
				
				config = $.extend(true, defaultConfig, config);
				
				var targetObj = $("#"+targetId);
				if(targetObj.length > 0){
					rtnObject = Uppy.Core({
						targetId: targetId,
						autoProceed: config.autoProceed,
						restrictions: {
							maxFileSize: ((1024*1024)*parseInt(config.maxFileSize)),
							maxNumberOfFiles: config.maxNumberOfFiles,
							minNumberOfFiles: config.minNumberOfFiles,
							allowedFileTypes: config.allowedFileTypes
						},
						locale:config.locale,
						meta: config.meta,
						onBeforeUpload: function(files){
							return config.onBeforeUpload(files);
						},
						onBeforeFileAdded: function(currentFile, files){
							
							if(currentFile.source != "database" && config.fileReadonly){
								$.osl.toastr($.osl.lang("file.error.fileReadonly"),{type:"warning"});
								return false;
							}
							return config.onBeforeFileAdded(currentFile, files);
						},
						debug: config.debug,
						logger: config.logger,
						fileDownload: config.fileDownload
					});
					
					rtnObject.use(Uppy.Dashboard, config);
					rtnObject.use(Uppy.XHRUpload, { endpoint: config.url,formData: true });
				}
				
				return rtnObject;
			},
			
			/**
			 * function 명 	: $.osl.file.makeAtchfileId
			 * function 설명	: atchFileId를 생성하고 해당 data를 반환한다.
			 * 
			 * @param	callback: atchFileId 생성 후 처리 함수
			 */
			makeAtchfileId: function(callback){
				
				var ajaxObj = new $.osl.ajaxRequestAction(
						{"url":"/com/fms/insertAtchFileIdInfo.do", "loadingShow": false, "async": false});

				
				
				ajaxObj.setFnSuccess(function(data){
					callback(data);
				});
				
				
				ajaxObj.send();
			},
			
			/**
			 * function 명 	: $.osl.file.fileListSetting
			 * function 설명	: 조회된 파일목록 Json Data를 파일 업로드 객체에 세팅한다.
			 * 
			 * @param	paramFileList: 파일 목록 Json Data
			 * @param	paramFileUploadObj: 파일 업로드 객체
			 */
			fileListSetting: function(paramFileList, paramFileUploadObj){
				
			    function dataUrlToBlob( uri ) {
					var str, arr, i, matches, type;
			        uri = uri.split( ',' );
			        matches = /data:([^;]+)/.exec( uri[ 0 ] );
			        if ( matches ) {
			            type = matches[ 1 ];
			        }
			        str = atob( uri[ 1 ] );
			        arr = new Uint8Array( str.length );
			        for ( i = 0; i < arr.length ; i++ ) {
			            arr[ i ] = str.charCodeAt( i );
			        }
			        return new Blob( [ arr ], { type: type } );
			    }
			    
				if(paramFileList.length > 0){
					var atchFileId = null;
					
		    		$.each(paramFileList,function(idx, map){
		    			atchFileId = map.atchFileId;
		    			if(!$.osl.isNull(map.fileType) && map.fileType.indexOf("image") != -1){
		    				try{
				    			/* 해당 파일 url -> blob 구하기 (image만)*/
				    			var fileImage = new Image();
				    			fileImage.src = "/cmm/fms/getImage.do?fileSn="+map.fileSn+"&atchFileId="+map.atchFileId;
				    			
				    			
				    			
				    			fileImage.onload = function () {
				    				
				    				var canvas = document.createElement("canvas"),
					    	        ctx = canvas.getContext( "2d" );
				    			
									canvas.width = fileImage.width;
					    	        canvas.height = fileImage.height;
					    	        ctx.drawImage( fileImage, 0, 0, fileImage.width, fileImage.height );
						    	    
					    	        
									var fileData = dataUrlToBlob(canvas.toDataURL(map.type));
									
									
									var fileId = paramFileUploadObj.addFile({
					    			    name: map.orignlFileNm,
					    			    type: map.fileType,
					    			    source: 'database',
					    			    meta: {
					    			    	atchFileId: map.atchFileId,
					    			    	fileSn: map.fileSn
					    			    },
					    				data: fileData,
				    				});
									
									
									if(paramFileUploadObj.opts.fileDownload){
										
										fileAddListener(paramFileUploadObj, fileId);
									}
								}
		    				}catch(error){
		    					
		    				}
		    			}else{
		    				
		    				var fileId = paramFileUploadObj.addFile({
			    			    name: map.orignlFileNm,
			    			    type: map.fileType,
			    			    source: 'database',
			    			    meta: {
			    			    	atchFileId: map.atchFileId,
			    			    	fileSn: map.fileSn
			    			    },
			    				data: {
			    					blob: new Blob(),
			    					size: parseInt(map.fileMg)
			    				}
		    				});
		    				
							if(paramFileUploadObj.opts.fileDownload){
			    				
			    				fileAddListener(paramFileUploadObj, fileId);
							}
		    			}
		    		});
		    		
		    		
		    		function fileAddListener(paramFileUploadObj, paramFileId){
		    			
						$("#"+paramFileUploadObj.opts.targetId).off("click mouseenter", "#"+$.escapeSelector("uppy_"+paramFileId));
						$("#"+paramFileUploadObj.opts.targetId).on({
								"click": function(){
									
									var source = paramFileUploadObj.getFile(paramFileId).source;
									var atchFileId = paramFileUploadObj.getFile(paramFileId).meta.atchFileId;
									var fileSn = paramFileUploadObj.getFile(paramFileId).meta.fileSn;
									
		    						
		    						if(source == "remove"){
		    							$.osl.toastr($.osl.lang("file.error.downloadWait"));
		    						}
		    						else{
		    							$.osl.file.fileDownload(atchFileId, fileSn);
		    						}
								},
								/* 마우스 hover이벤트 걸기 (파일 생성 후 DOM생성이 비동기로 되어있어서 파일 객체에 직접 이벤트 바인딩 */
								"mouseenter": function(){
									$("#"+paramFileUploadObj.opts.targetId+" .osl-uppy-DashboardItem-action--download").remove();
									$("#"+$.escapeSelector("uppy_"+paramFileId)).append('<div class="osl-uppy-DashboardItem-action--download"><i class="fas fa-arrow-circle-down"></i></div>');
									/*
									$("#"+paramFileUploadObj.opts.targetId+" .osl-uppy-DashboardItem-action--download").removeClass("osl-uppy-DashboardItem-action--download");
									$("#"+$.escapeSelector("uppy_"+paramFileId)).addClass("osl-uppy-DashboardItem-action--download");
									*/
								},
								"mouseleave": function(){
									$("#"+$.escapeSelector("uppy_"+paramFileId)+" .osl-uppy-DashboardItem-action--download").remove();
								}},
								"#"+$.escapeSelector("uppy_"+paramFileId)
						);
		    		}
		    	}
			},
			/**
			 *  function 명 	: $.osl.file.fileDownload
			 *  function 설명	: 파일 다운로드 함수
			 *  @param paramAtchFileId: 파일 ID
			 *  @param paramFileSn: 파일 Sn
			 **/
			fileDownload: function(paramAtchFileId, paramFileSn){
				if(!$.osl.isNull(paramAtchFileId) && !$.osl.isNull(paramFileSn)){
					var url = '/com/fms/FileDown.do?downAtchFileId='+paramAtchFileId+'&downFileSn='+paramFileSn;
					var fileLink = document.createElement("a");
					fileLink.href = url;
					fileLink.target = "_self";
					document.fileDownFrame.downForm.append(fileLink);
					fileLink.click();
					fileLink.remove();
				}else{
					$.osl.alert("다운로드에 필요한 정보가 부족합니다.");
				}
			}
		}
		/**
		 *  function 명 	: $.osl.tree
		 *  function 설명	: 트리 기본 객체
		 **/
		,tree: {
			/* 노드 제어 함수 실행 시 로딩바가 출력되는 기준 개수 */
			loadingNodeCnt:500,
			/**
			 *  function 명 	: $.osl.tree.setting
			 *  function 설명	: 요소에 트리 객체 세팅
			 *  @param targetId: 요소 id (#id)
			 *  @param config: 트리 설정 값
			 **/
			setting: function(targetId, config){
				
				var treeObj = null;
				
				var targetObj = $("#"+targetId);
				if(targetObj.length > 0){
					/**
					 * 자식 노드 전체 펼치기/접기
					 * @param jstreeTarget: jstree 대상 (선언 객체)
					 * @param childrenList: 자식 노드 목록
					 * @param openClose: 접힘&펼침 (true - 펼침, false - 접힘)
					 */
					var nodeChildHandler = function(jstreeTarget, childrenList, openClose){
						if($.osl.isNull(childrenList) || childrenList.length == 0){
							return true;
						}
						
						
						$.each(childrenList, function(idx, map){
							
							var childrenNodeInfo = jstreeTarget.jstree().get_node(map);
							
							
							if($.osl.isNull(childrenNodeInfo)){
								return true;
							}else{
								
								if(childrenNodeInfo.children.length > 0){
									
									var flagNodeStr = "close_node";
									
									if(openClose){
										flagNodeStr = "open_node";
									}
									jstreeTarget.jstree(flagNodeStr, childrenNodeInfo.id);
									
									
									nodeChildHandler(jstreeTarget, childrenNodeInfo.children, openClose);
								}else{
									
									return true
								}
							}
						});
					};
					
					
					var actionFunction = {
						allNodeOpen: function(obj){
							if($.osl.isNull(treeObj)){
            					$.osl.toastr($.osl.lang("tree.error.handler"));
            					return false;
            				}
							
							var nodeSize = Object.keys(treeObj.jstree()._model.data).length;
							if(nodeSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(true,{target: targetId ,message: "data loading..."});
            				}
            				treeObj.jstree("open_all");

            				if(nodeSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(false,{target: targetId});
            				}
						},
						allNodeClose: function(obj){
							if($.osl.isNull(treeObj)){
            					$.osl.toastr($.osl.lang("tree.error.handler"));
            					return false;
            				}
							
							var nodeSize = Object.keys(treeObj.jstree()._model.data).length;
							if(nodeSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(true,{target: targetId ,message: "data loading..."});
            				}
							
            				treeObj.jstree("close_all");

            				if(nodeSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(false,{target: targetId});
            				}
						},
						selNodeOpen: function(obj){
							if($.osl.isNull(treeObj)){
            					$.osl.toastr($.osl.lang("tree.error.handler"));
            					return false;
            				}
            				var nodeInfo = treeObj.jstree().get_node(obj.reference);
            				treeObj.jstree("open_node",nodeInfo.id);
            				
            				
            				var childSize = nodeInfo.children_d.length;
            				if(childSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(true,{target: "#"+treeObj[0].id,message: "data loading..."});
            				}
            				
            				
            				nodeChildHandler(treeObj, nodeInfo.children, true);
            				
            				if(childSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(false,{target: "#"+treeObj[0].id});
            				}
						},
						selNodeClose: function(obj){
							if($.osl.isNull(treeObj)){
            					$.osl.toastr($.osl.lang("tree.error.handler"));
            					return false;
            				}
            				var nodeInfo = treeObj.jstree().get_node(obj.reference);
            				treeObj.jstree("close_node",nodeInfo.id);
            				
            				
            				var childSize = nodeInfo.children_d.length;
            				
            				if(childSize > parseInt($.osl.tree.loadingNodeCnt)){
            					$.osl.showLoadingBar(true,{target: "#"+treeObj[0].id,message: "data loading..."});
            				}
            				
            				
            				nodeChildHandler(treeObj, nodeInfo.children, false);
            				
            				if(childSize > parseInt($.osl.tree.loadingNodeCnt)){ 
            					$.osl.showLoadingBar(false,{target: "#"+treeObj[0].id});
            				}
						}
					};
					
					
					var defaultConfig = {
							'data':{
								url:"",
								param:"",
								key:"",
								/* 부모 key 값 */
								pKey:"",
								/* 출력 text key */
								labelKey: ""
							},
				            'plugins': ["contextmenu", "types", "search"],
				            'core': {
				                "themes" : {
				                	/* 노드 내용 영역 넘어가는 경우 줄임 */
				                    "ellipsis": true,
				                    "stripes": false
				                },    
				                'data': []
				            },
				            "types" : {
				                "default" : { "icon" : "fa fa-folder kt-font-warning" },
				                "file" : {"icon" : " flaticon2-file  kt-font-warning"}
				            },
				            "search":{
								
								"case_insensitive": false,
								
								"show_only_matches": false,
								
								
								"show_only_matches_children": false,
							},
				            "contextmenu": {
				            	"display": ["allNodeOpen","allNodeClose","selNodeOpen","selNodeClose"],
				            	"items": {
				            		"allNodeOpen" : {
				            			"separator_before": true,
				            			"separator_after": false,
				            			"label": $.osl.lang("tree.label.contextmenu.allNodeOpen"),
				            			"title": $.osl.lang("tree.label.contextmenu.allNodeOpen"),
				            			"action": function (obj){
				            				actionFunction["allNodeOpen"](obj);
				            			}
				            		},
				            		"allNodeClose" : {
				            			"separator_before": false,
				            			"separator_after": true,
				            			"label": $.osl.lang("tree.label.contextmenu.allNodeClose"),
				            			"title": $.osl.lang("tree.label.contextmenu.allNodeClose"),
				            			"action": function (obj){
				            				actionFunction["allNodeClose"](obj);
				            			}
				            		},
				            		"selNodeOpen" : {
				            			"separator_before": true,
				            			"separator_after": false,
				            			"label": $.osl.lang("tree.label.contextmenu.selNodeOpen"),
				            			"title": $.osl.lang("tree.label.contextmenu.selNodeOpen"),
				            			"action": function (obj){
				            				actionFunction["selNodeOpen"](obj);
				            			}
				            		},
				            		"selNodeClose" : {
				            			"separator_before": false,
				            			"separator_after": true,
				            			"label": $.osl.lang("tree.label.contextmenu.selNodeClose"),
				            			"title": $.osl.lang("tree.label.contextmenu.selNodeClose"),
				            			"action": function (obj){
				            				actionFunction["selNodeClose"](obj);
				            			}
				            		}
				            	}
				            },
				            "callback":{
				            	/* tree 로딩 후 호출 */
				            	"init": $.noop,
				            	/* tree node 선택(클릭) 시 호출 */
								"onclick": $.noop
							}
				        };
					
					
					if(config.hasOwnProperty("contextmenu")){
						
						if(config.contextmenu.hasOwnProperty("items")){
							config.contextmenu.items = undefined;
						}
						
						if(config.contextmenu.hasOwnProperty("display")){
							defaultConfig.contextmenu.display = config.contextmenu.display;
						}
					}
					config = $.extend(true, defaultConfig, config);
					
					
					$.each(config.contextmenu.items, function(key, value){
						if((config.contextmenu.display).indexOf(key) == -1){
							config.contextmenu.items[key] = undefined;
						}
					});
					
					
					var actionBtnList = $(".osl-tree-action[data-tree-id="+targetId.replace("#","")+"]");
					if(actionBtnList.length > 0){
						$.each(actionBtnList, function(idx, map){
							
							var action = $(map).data("tree-action");
							
							
							if(!actionFunction.hasOwnProperty(action)){
								$(map).remove();
							}else{
								
								$(map).click(function(){
									actionFunction[action]();
								});
							}
						});
					}
					
					
					/* data 셋팅 */
					var url = config.data.url;
					var paramData = config.data.param;
					
					
					var ajaxObj = new $.osl.ajaxRequestAction(
							{"url": url, "async": false}
							,paramData);
					
					
					ajaxObj.setFnSuccess(function(data){
						if(data.errorYn == "Y"){
							$.osl.alert(data.message,{type: 'error'});
						}else{
							var treeDataList = data.list;
							
							
							if($.osl.isNull(treeDataList)){
								$.each(data,function(idx, map){
									if(typeof map == "object"){
										try{
											if(map.length > 0){
												treeDataList = map;
												return false;
											}
										}catch(e){
											return true;
										}
									}
								});
							}
							
							
							if(treeDataList.length > 0){
								var rtnTreeData = [];
								var tmpMap = {};
								
								var key = config.data.key;
								var pKey = config.data.pKey;
								var labelKey = config.data.labelKey;
								
								/* jsonArray => key:{jsonData} 변환*/
								$.each(treeDataList, function(idx, map){
									map["text"] = map[labelKey];
									tmpMap[map[key]] = map;
								});
								
								/* 위에서 세팅된 목록 값으로 계층 데이터 구현하기 */
								$.each(treeDataList, function(idx, map){
									
									if(tmpMap[map[pKey]] && map[key] != map[pKey]){
										
										if (!tmpMap[map[pKey]]["children"]){
											tmpMap[map[pKey]]["children"] = [];
										}
										
										
										tmpMap[map[pKey]]["children"].push(map);
									}else{
										
										rtnTreeData.push(map);
									}
								});
								
								config.core.data = rtnTreeData;
							}
							
							/* context 셋팅*/
							treeObj = targetObj.jstree(config);
							
							
							treeObj.bind('select_node.jstree', function(event, data){
								var selNode = data.instance.get_node(data.selected);
					            var id = selNode.id;
					            treeObj.jstree().selNode = {id: id, data:data};
					            
					            
					            config.callback.onclick(treeObj, selNode);
					        }).bind('deselect_node.jstree', function(event, data){
					        	treeObj.jstree().selNode = null;
					        }).bind('search.jstree', function(nodes, str, res){
					        	
					        	if(str.nodes.length == 0){
					        		
					        		treeObj.jstree(true).hide_all();
					        		
					        		
					        		$(str.instance.element).after('<div class="osl-tree-empty kt-align-center" data-tree-id="'+targetId+'">"'+str.str+'" 검색 결과가 없습니다.</div>');
					        	}
					        	
					        }).bind('loaded.jstree', function(event, data) {
					        	
					            config.callback.init(treeObj, data);
					        });
							
							
							var searchTarget = $('.osl-tree-search[data-tree-id="'+targetId+'"]');
							
							
							if(searchTarget.length > 0){
								/* 검색  input 세팅 */
								
								searchTarget.empty();
								
								
								var btnStyle = searchTarget.data("search-style");
								
								var btnStyleStr = "btn-brand";
								
								if(!$.osl.isNull(btnStyle)){
									btnStyleStr = "btn-"+btnStyle;
								}
								
								
								var searchTargetHtml = 
									'<div class="input-group">'
										+'<div class="kt-input-icon kt-input-icon--left osl-border-radius-none--right">'
											+'<input type="text" class="form-control" placeholder="'+$.osl.lang("tree.search.placeholder")+'" id="treeSearch_'+targetId+'" name="treeSearch" data-tree-id="'+targetId+'">'
											+'<span class="kt-input-icon__icon kt-input-icon__icon--left">'
												+'<span><i class="la la-search"></i></span>'
											+'</span>'
										+'</div>'
										+'<div class="input-group-append">'
											+'<button class="btn '+btnStyleStr+' osl-tree-search__button" type="button" data-tree-id="'+targetId+'">'
												+'<span class=""><span>'+$.osl.lang("tree.search.title")+'</span></span>'
											'</button>'
										+'</div>'
									+'</div>';
								
								searchTarget.html(searchTargetHtml);
								
								
								var fnTreeSearch = function(searchValue){
									treeObj.jstree(true).show_all();
									
									
									if($(".osl-tree-empty[data-tree-id="+targetId+"]").length > 0){
										$(".osl-tree-empty[data-tree-id="+targetId+"]").remove();
									}
									
									treeObj.jstree("search", searchValue);
								};
								
								
								$(".osl-tree-search[data-tree-id="+targetId+"] input#treeSearch_"+targetId+"[data-tree-id="+targetId+"]").off('keypress');
								$(".osl-tree-search__button[data-tree-id="+targetId+"]").off('click');
								$(".osl-tree-search[data-tree-id="+targetId+"] input#treeSearch_"+targetId+"[data-tree-id="+targetId+"]").on('keypress', function(e) {
									if (e.which === 13){
										
										var thisObj = $(this).siblings("span.kt-input-icon__icon").children("span");
										
										thisObj.children("i").removeClass("la la-search");
										
										
										thisObj.addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand");
										
										
										fnTreeSearch($(this).val());
										
										setTimeout(function(){
											thisObj.removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand");
											
											
											thisObj.children("i").addClass("la la-search");
										},300);
									}
								});
								
								$(".osl-tree-search__button[data-tree-id="+targetId+"]").click(function(){

									var thisObj = $(this).children("span");
									
									
									thisObj.children("span").hide();
									thisObj.addClass("spinner-border spinner-border-sm");

									fnTreeSearch($("#treeSearch_"+targetId).val());
									
									setTimeout(function(){
										thisObj.removeClass("spinner-border spinner-border-sm");
										thisObj.children("span").show();
									},300);
								});
							}
						}
					});
					
					
					ajaxObj.send();
				}
				return treeObj;
			}
		}
		,langData: {}
		/**
		 *  function 명 	: $.osl.lang
		 *  function 설명	: 언어 코드
		 *  @param langId: 언어 값 가져오려는 계층 코드 (예: file.error.downloadWait)
		 **/
		,lang: function(langId){
			
			var langData = this.langData;
			
			
			var rtnLangStr = null;
			
			
			if($.osl.isNull(langId)){
				return "";
			}
			
			
			var langTreeData = langId.split("\.");
			
			try{
				
				var prevTreeData = langData[$.osl.langCd];
				$.each(langTreeData, function(idx, map){
					
					if(!prevTreeData.hasOwnProperty(map)){
						return false;
					}
					
					
					if(langTreeData.length == (idx+1)){
						rtnLangStr = prevTreeData[map];
						return false;
					}else{
						prevTreeData = prevTreeData[map];
					}
				});
			}catch(e){
			}
			
			
			if($.osl.isNull(rtnLangStr)){
				return "";
			}
			
			
			if(arguments.length > 1){
				var mainArgu = arguments;
				rtnLangStr = rtnLangStr.replace(/\${(\d+)}/g, function(match, idx){
				    return typeof mainArgu[idx] != 'undefined' ? mainArgu[idx] : match;
				});
			}
			
			return rtnLangStr;
		}
		/**
		 *  function 명 	: $.osl.langConvert
		 *  function 설명	: 대상 영역에 span 태그 문자열을 언어 코드에 맞게 변경한다.
		 *  @param targetElem: 대상 영역 (대상 영역 하위의 span만 적용)  
		 **/
		,langConvert: function(targetElem){
			
			if($.osl.langCd == "ko"){
				return true;
			}
			
			var spanList = $(targetElem).find("span[data-lang-cd]");
			if(!$.osl.isNull(spanList) && spanList.length > 0){
				$.each(spanList, function(idx, map){
					
					var langCd = $(map).data("lang-cd");
					var langStr = $.osl.lang(langCd);
					if($.osl.isNull(langStr)){
						return true;
					}
					$(map).text(langStr);
				});
			}
			
			
			var tagTitleList = $("[data-title-lang-cd]");
			if(!$.osl.isNull(tagTitleList) && tagTitleList.length > 0){
				$.each(tagTitleList, function(idx, map){
					
					var langCd = $(map).data("title-lang-cd");
					var langStr = $.osl.lang(langCd);
					if($.osl.isNull(langStr)){
						return true;
					}
					$(map).attr("title",langStr);
					$(map).attr("data-original-title",langStr);
				});
			}
		}
		/**
		 *  function 명 	: $.osl.btnAuthVal
		 *  function 설명	: 공통 버튼 권한 전역 변수
		 **/
		,btnAuthVal: {
			btnAuthSelectYn:	"N"
			,btnAuthInsertYn:	"N"
			,btnAuthUpdateYn:	"N"
			,btnAuthDeleteYn:	"N"
			,btnAuthExcelYn:	"N"
			,btnAuthPrintYn:	"N"
		}
		/**
		 *  function 명 	: $.osl.prjMenuList
		 *  function 설명	: 메뉴 계층 데이터
		 **/
		,prjMenuList:{}
		/**
		 *  function 명 	: $.osl.prjGrpAuthList
		 *  function 설명	: 프로젝트 그룹, 프로젝트, 권한그룹 데이터
		 **/
		,prjGrpAuthList:{}
		/**
		 *  function 명 	: $.osl.prjGrpAuthSelSetting
		 *  function 설명	: 프로젝트 그룹, 프로젝트, 권한그룹 데이터를 select에 세팅
		 *  @param depth: 출력 깊이
		 *  		1: 프로젝트 그룹
		 *  		2: 프로젝트 그룹(optGroup) > 프로젝트
		 *  		3: 프로젝트(optGroup) > 권한 그룹
		 *  @param paramSelFlag (Boolean): 현재 선택된 프로젝트 그룹, 프로젝트, 권한그룹 초기 선택지정 유무  (기본 - false)
		 **/
		,prjGrpAuthSelSetting: function(depth, paramSelFlag){
			var rtnValue = '';
			
			var selFlag = false;
			if(!$.osl.isNull(paramSelFlag)){
				selFlag = paramSelFlag;
			}
			
			if(!$.osl.isNull($.osl.prjGrpAuthList)){
				$.each($.osl.prjGrpAuthList, function(idx1, map1){
					
					if(depth == 1){
						var selected = '';
						
						if(selFlag){
							if($.osl.selPrjGrpId == map1.prjGrpInfo.prjId){
								selected = "selected";
							}
						}
						rtnValue += '<option value="'+map1.prjGrpInfo.prjId+'" '+selected+'>'+$.osl.escapeHtml(map1.prjGrpNm)+'</option>';
						return true;
					}
					
					
					if(Object.keys(map1.prjList).length == 0){
						return true;
					}
					
					
					if(depth == 2){
						rtnValue += '<optgroup label="'+$.osl.escapeHtml(map1.prjGrpNm)+'" data-prj-grp-id="'+map1.prjGrpInfo.prjId+'">';
					}
					
					
					$.each(map1.prjList, function(idx2, map2){
						
						if(depth == 2){
							var selected = '';
							
							if(selFlag){
								if($.osl.selPrjId == map2.prjId){
									selected = "selected";
								}
							}
							rtnValue += '<option value="'+map2.prjId+'" data-prj-grp-id="'+map1.prjGrpInfo.prjId+'" '+selected+'>'+$.osl.escapeHtml(map2.prjNm)+'</option>';
							return true;
						}
						
						if(Object.keys(map2.authGrpList).length == 0){
							return true;
						}
						
						
						if(depth == 3){
							rtnValue += '<optgroup label="'+$.osl.escapeHtml(map2.prjNm)+'" data-prj-grp-id="'+map1.prjGrpInfo.prjId+'" data-prj-id="'+map2.prjId+'">';
						}
						
						
						$.each(map2.authGrpList, function(idx3, map3){
							var selected = '';
							
							if(selFlag){
								if($.osl.selAuthGrpId == map3.authGrpId){
									selected = "selected";
								}
							}
							rtnValue += '<option value="'+map3.authGrpId+'" data-prj-grp-id="'+map1.prjGrpInfo.prjId+'" data-prj-id="'+map2.prjId+'" '+selected+'>'+$.osl.escapeHtml(map3.authGrpNm)+'</option>';
						});
						
						if(depth == 3){
							rtnValue += '</optgroup>';
						}
					});
					
					
					if(depth == 2){
						rtnValue += '</optgroup>';
					}
				});
				
				return rtnValue;
			}
		}
		/**
		 *  function 명 	: $.osl.initHeaderClear
		 *  function 설명	: 헤더 데이터 세팅에 필요한 영역 초기화
		 **/
		,initHeaderClear: function(){
			
			$("#globalsTopMenuUl > li.osl-menu-1depth").remove();
			
			
			$("#osl_aside_prjAuth_List").empty();
			
			
			$("ul[id^=fvrListType]").empty();
			
			
			$("#submenu-prjGrp-sel_opt, #submenu-prj-sel_opt, #submenu-authGrp-sel_opt").empty();
			
			
			$("select[id^=usrOpt_]").empty();
		}
		/**
		 *  function 명 	: $.osl.initHeader
		 *  function 설명	: 즐겨찾기, 메뉴, 프로젝트 및 권한그룹 등 top 데이터 세팅
		 *  @param callBackFn : Header init 완료 후 실행 함수
		 **/
		,initHeader: function(callBackFn){
			/* 즐겨찾기 데이터 조회 */
			
			var ajaxObj = new $.osl.ajaxRequestAction(
					{"url":"/cmm/cmm9000/cmm9000/selectCmm9000InitHeaderData.do", "loadingShow": false});
			
			
			ajaxObj.setFnSuccess(function(data){
				
	        	if( data.errorYn == "N" ){
	        		
	        		if(!$.osl.isNull(data.btnAuthMap)){
	        			$.extend($.osl.btnAuthVal, data.btnAuthMap);
	        			
	        			
	        			var authAccessYn = data.btnAuthMap.authAccessYn;
	        			
	        			
	        		}

	        		
	        		if(!$.osl.isNull(data.usrInfo)){
	        			$.osl.user.userInfo = data.usrInfo;
	        		}
	        		
	        		
        			if($("form#userSettingForm select").length > 0){
        				
            			var commonCodeArr = [];
            			
            			
            			$.each($("form#userSettingForm select"),function(idx, map){
            				var targetId = $(map).attr("id");
            				var targetMstCd = $(map).data("mst-cd");
            				
            				
            				commonCodeArr.push({mstCd: targetMstCd ,useYn: "Y",targetObj: "#"+targetId, comboType:"OS"});
            			});
            			
		        		
		        		if(!$.osl.isNull(data.usrOptList)){
		        			var usrOptData = {};
		        			
		        			$.each(data.usrOptList, function(idx, map){
		        				var optSelect = $("#usrOpt_"+map.usrOptMstCd);
		        				
		        				if(optSelect.length > 0){
		        					
		        					optSelect.attr("data-osl-value",map.usrOptCd);
		        				}
		        				
		        				usrOptData[map.usrOptMstCd] = {"value": map.usrOptCd, "name": map.mstCdNm, "desc": map.mstCdDesc, "valueNm": map.subCdNm};
		        			});
		        			
		        			
		        			$.osl.user.usrOptData = usrOptData;
		        		}
		        		
	        			$.osl.getMulticommonCodeDataForm(commonCodeArr , true);
		        	}
        			
        			if(!$.osl.isNull(data.langList)){
        				var opt4 = $.osl.user.usrOptData["OPT00004"];
        					
        				
        				var usrLangCd = null;
        				if(!$.osl.isNull(opt4)){
        					usrLangCd = opt4.value;
        				}
        				
        				var langListStr = '';
        				$.each(data.langList, function(idx, map){
        					var activeStr = '';
        					if($.osl.isNull(usrLangCd) && idx == 0 || !$.osl.isNull(usrLangCd) && map.subCd == usrLangCd){
        						activeStr = 'active';
        						$("#usrCurrentLangCd img").attr("src","/media/flags/"+map.subCdRef2);
        						$.osl.langCd = map.subCdNm; 
        					}
        					
        					langListStr +=
        						'<li class="kt-nav__item '+activeStr+'">'
		        					+'<a href="#" class="kt-nav__link" value="'+map.subCd+'" id="usrLangCd_'+map.subCdNm+'" data-mst-cd="OPT00004" data-sub-cd="'+map.subCdNm+'" data-sub-cd-ref1="'+$.osl.escapeHtml(map.subCdRef1)+'" data-sub-cd-ref2="'+map.subCdRef2+'" onclick="$.osl.user.usrOptLangChg(this);">'
		        						+'<span class="kt-nav__link-icon"><img src="/media/flags/'+map.subCdRef2+'" alt="" /></span>'
		        						+'<span class="kt-nav__link-text">'+$.osl.escapeHtml(map.subCdRef1)+'</span>'
		        					+'</a>'
		        				+'</li>';
        				});
        				$("#usrLangCdList").html(langListStr);
        			}
        			
	        		
	        		if(!$.osl.isNull(data.menuList)){
	        			
	        			var topMenuType = "01";
	        			if($.osl.user.usrOptData.hasOwnProperty("OPT00001") && !$.osl.isNull($.osl.user.usrOptData["OPT00001"].value)){
	        				topMenuType = $.osl.user.usrOptData["OPT00001"].value;
	        			}
	        			
	        			
	        			var menuConfig = {
	        				"01":{
	        					"submenu-type": "kt-menu__submenu--fixed",
	        					"submenu-frame-cnt":4
	        				},
	        				"02":{
	        					"submenu-type": "kt-menu__submenu--classic"
	        				}
	        			};
	        			var menuList = {};
	        			
	        			
	        			$.each(data.menuList,function(idx, map){
	        				
	        				if(map.accessYn != "Y"){
	        					return true;
	        				}
	        				
	        				if(map.lvl == "1"){
	        					
	        					if(menuList.hasOwnProperty(map.menuId)){
	        						menuList[map.menuId]["menuNm"] = map.menuNm;
	        						menuList[map.menuId]["menuInfo"] = map;
	        					}else{
	        						menuList[map.menuId] = {"menuNm":map.menuNm, "menuInfo":map, "childMenuList":{}};
	        					}
	        				}
	        				else if(map.lvl == "2"){
	        					
	        					if(!menuList.hasOwnProperty(map.upperMenuId)){
	        						menuList[map.upperMenuId] = {};
	        						menuList[map.upperMenuId]["childMenuList"] = {};
	        					}
	        					
	        					if(menuList[map.upperMenuId]["childMenuList"].hasOwnProperty(map.menuId)){
	        						menuList[map.upperMenuId]["childMenuList"][map.menuId]["menuNm"] = map.menuNm;
	        						menuList[map.upperMenuId]["childMenuList"][map.menuId]["menuInfo"] = map;
	        					}else{
	        						
	        						menuList[map.upperMenuId]["childMenuList"][map.menuId] = {"menuNm":map.menuNm, "menuInfo":map, "childMenuList":{}};
	        					}
	        				}
	        				else if(map.lvl == "3"){
	        					
	        					menuList[map.twoUpperMenuId]["childMenuList"][map.upperMenuId]["childMenuList"][map.menuId] = map;
	        				}else{
	        					return true;
	        				}
	        			});
	        			
	        			var idx = 0;
	        			
	        			$.each(menuList, function(key, map){
	        				
	        				var menuInfoStr = 
	        					'<li class="kt-menu__item kt-menu__item--submenu kt-menu__item--rel osl-menu-1depth" data-ktmenu-submenu-toggle="click" aria-haspopup="true">'	
									+'<a href="javascript:void(0);" class="kt-menu__link kt-menu__toggle" data-toggle="kt-tooltip" data-skin="brand" title="'+$.osl.escapeHtml(map.menuNm)+'">'
										+'<span class="kt-menu__link-text">'+$.osl.escapeHtml(map.menuNm)+'</span>'
										+'<i class="kt-menu__hor-arrow la la-angle-down"></i>'
										+'<i class="kt-menu__ver-arrow la la-angle-right"></i>'
									+'</a>';
	        				
	        				
	        				var depthTwoCnt = 0;
	        				if(!$.osl.isNull(map.childMenuList)){
	        					depthTwoCnt = Object.keys(map.childMenuList).length;
	        				}
	        				
	        				
	        				if(depthTwoCnt == 0){
	        					return true;
	        				}
	        				
	        				
	        				
	        				var submenudir = "kt-menu__submenu--left";
	        				if(idx == 3){
	        					submenudir = "kt-menu__submenu--center";
	        				}
	        				else if(idx > 3){
	        					submenudir = "kt-menu__submenu--right";
	        				}
	        				idx++;
	        				
	        				var addStyleStr = "";
	        				
	        				if(topMenuType == "01"){
	        					var depth2Cnt = Object.keys(map.childMenuList).length;
	        					if(depth2Cnt > menuConfig[topMenuType]["submenu-frame-cnt"]){
	        						depth2Cnt = menuConfig[topMenuType]["submenu-frame-cnt"];
	        					}
	        					
	        				}
	        				menuInfoStr += '<div class="kt-menu__submenu '+menuConfig[topMenuType]["submenu-type"]+' '+submenudir+'" '+addStyleStr+'>';
	        				
	        				
	        				if(topMenuType == "02"){
	        					menuInfoStr += '<ul class="kt-menu__subnav">';
	        					
	        					
	        					$.each(map.childMenuList, function(key2, map2){
	        						
	        						var menuIcon = map2["menuInfo"]["menuIcon"];
	        						if($.osl.isNull(menuIcon)){
	        							menuIcon = "";
	        						}
	        						
	        						menuInfoStr += 
	        							'<li class="kt-menu__item  kt-menu__item--submenu" data-ktmenu-submenu-toggle="hover" aria-haspopup="true">'
											+'<a href="javascript:;" class="kt-menu__link kt-menu__toggle">'
												+'<i class="kt-menu__link-icon '+menuIcon+'"></i>'
												+'<span class="kt-menu__link-text">'+$.osl.escapeHtml(map2.menuNm)+'</span>'
												+'<i class="kt-menu__hor-arrow la la-angle-right"></i>'
												+'<i class="kt-menu__ver-arrow la la-angle-right"></i>'
											+'</a>'
											+'<div class="kt-menu__submenu kt-menu__submenu--classic kt-menu__submenu--right">'
												+'<ul class="kt-menu__subnav">';
	        						
	        						
	        						if(map2.hasOwnProperty("childMenuList")){
	        							$.each(map2.childMenuList, function(key3, map3){
											menuInfoStr +=
												'<li class="kt-menu__item " aria-haspopup="true">'
													+'<a href="javascript:$.osl.goMenu(\''+$.osl.escapeHtml(map3.menuUrl)+'\', \''+map3.menuId+'\', \''+$.osl.escapeHtml(map3.menuNm)+'\', \''+$.osl.escapeHtml(map3.menuTypeCd)+'\' );" class="osl-favorites__item kt-menu__link ">'
														+'<i class="kt-menu__link-icon flaticon-star" data-fvr-data1="'+map3.menuId+'" data-fvr-data2="'+$.osl.escapeHtml(map3.menuUrl)+'" data-fvr-data3="'+$.osl.escapeHtml(map3.menuTypeCd)+'" data-fvr-data4="'+$.osl.escapeHtml(map.menuNm)+'" data-fvr-data5="'+$.osl.escapeHtml(map2.menuNm)+'" data-fvr-data6="" data-fvr-type="01" onclick="$.osl.favoritesEdit(event,this)"></i>'
														+'<span class="kt-menu__link-text">'+$.osl.escapeHtml(map3.menuNm)+'</span>'
													+'</a>'
												+'</li>';
	        							});
	        						}
	        						
	        						menuInfoStr +=
	        									'</ul>'
	        								+'</div>'
	        							+'</li>';
	        					});
	        					menuInfoStr += '</ul>'
	        				}else {	
	        					menuInfoStr += 
	        						'<div class="kt-menu__subnav">'
	        							+'<ul class="kt-menu__content">';
	        					
	        					
	        					var submenuFrameData = {};
	        					var loopCnt = 0;
	        					
	        					
	        					$.each(map.childMenuList, function(key2, map2){
	        						var submenuFrameCalc = (loopCnt % menuConfig[topMenuType]["submenu-frame-cnt"]);
	        						
	        						
	        						if(!submenuFrameData.hasOwnProperty(submenuFrameCalc)){
	        							submenuFrameData[submenuFrameCalc] = [];
	        						}
	        						
	        						
	        						var menuIcon = map2["menuInfo"]["menuIcon"];
	        						if($.osl.isNull(menuIcon)){
	        							menuIcon = "";
	        						}
	        						
	        						
	        						var menu2DepthInfo = 
	        							'<h3 class="kt-menu__heading kt-menu__toggle">'
											+'<i class="kt-font-dark kt-menu__link-icon '+menuIcon+'"></i>'
											+'<span class="kt-menu__link-text">'+$.osl.escapeHtml(map2.menuNm)+'</span>'
											+'<i class="kt-menu__ver-arrow la la-angle-right"></i>'
										+'</h3>';
	        						
	        						
	        						if(map2.hasOwnProperty("childMenuList")){
	        							menu2DepthInfo += '<ul class="kt-menu__inner">';
	        							$.each(map2.childMenuList, function(key3, map3){
	        								menu2DepthInfo += 
	        									'<li class="kt-menu__item " aria-haspopup="true">'
													+'<a href="javascript:$.osl.goMenu(\''+$.osl.escapeHtml(map3.menuUrl)+'\', \''+map3.menuId+'\', \''+$.osl.escapeHtml(map3.menuNm)+'\', \''+$.osl.escapeHtml(map3.menuTypeCd)+'\' )" class="osl-favorites__item kt-menu__link ">'
														+'<i class="kt-menu__link-icon flaticon-star" data-fvr-data1="'+map3.menuId+'" data-fvr-data2="'+$.osl.escapeHtml(map3.menuUrl)+'" data-fvr-data3="'+$.osl.escapeHtml(map3.menuTypeCd)+'" data-fvr-data4="'+$.osl.escapeHtml(map.menuNm)+'" data-fvr-data5="'+$.osl.escapeHtml(map2.menuNm)+'" data-fvr-type="01" onclick="$.osl.favoritesEdit(event,this)"></i>'
														+'<span class="kt-menu__link-text">'+$.osl.escapeHtml(map3.menuNm)+'</span>'
													+'</a>'
												+'</li>';
	        							});
	        							menu2DepthInfo += '</ul>';
	        						}
	        						
	        						
	        						submenuFrameData[submenuFrameCalc].push(menu2DepthInfo);
	        						
	        						loopCnt++;
	        					});
	        					
	        					
	        					$.each(submenuFrameData,function(subIdx, subMap){
	        						menuInfoStr += '<li class="kt-menu__item kt-scroll osl-top__menu--height" data-scroll="true">';
	        						menuInfoStr += subMap.join('');
	        						menuInfoStr += '</li>';
	        					});
	        				}
	        				
	        				
	        				menuInfoStr +=
	        						'</div>'
	        					+'</li>';
	        				$("#globalsTopMenuUl").append(menuInfoStr);
	        			});
	        			$.osl.prjMenuList = menuList;
	        		}
	        		
	        		
	        		if(!$.osl.isNull(data.prjList)){
	        			
	        			var selPrjGrpId = $("#submenu-prjGrp-sel").data("target-id");
	        			var selPrjId = $("#submenu-prj-sel").data("target-id");
	        			var selAuthGrpId = $("#submenu-authGrp-sel").data("target-id");
	        			
	        			
	        			$.osl.selPrjGrpId = selPrjGrpId;
	        			$.osl.selPrjId = selPrjId;
	        			$.osl.selAuthGrpId = selAuthGrpId;
	        			
	        			var prjOrdList = {};
	        			
	        			
	        			$.each(data.prjList, function(idx, map){
	        				
	        				if(map.prjGrpCd == "01"){
	        					prjOrdList[map.prjId] = {"prjGrpNm":map.prjNm, "prjGrpInfo":map, "prjList":{}};
	        				}else{
	        					
	        					prjOrdList[map.prjGrpId]["prjList"][map.prjId] = map;
	        				}
	        				
	        				
	        				if(selPrjGrpId == map.prjId){
	        					$("#submenu-prjGrp-sel").html('<i class="kt-menu__link-icon fa fa-project-diagram"></i>'+$.osl.escapeHtml(map.prjNm));
	        				}
	        				
	        				if(selPrjId == map.prjId){
	        					$("#submenu-prj-sel").html('<i class="kt-menu__link-icon flaticon2-box-1"></i>'+$.osl.escapeHtml(map.prjNm));
	        				}
	        			});

	        			
	        			
	        			$.each(prjOrdList, function(idx, map){
	        				if(Object.keys(map.prjList).length == 0){
	        					return true;
	        				}
	        				
	        				
	        				var prjGrpInfo = map.prjGrpInfo;
	        				
	        				
	        				var tooltipStr = '';
	        				
	        				
	        				if(!$.osl.isNull(prjGrpInfo.prjDesc)){
	        					tooltipStr = ' data-toggle="kt-tooltip" data-skin="brand" title="'+$.osl.escapeHtml(prjGrpInfo.prjDesc).trim()+'"';
	        				}
	        				
	        				var itemActive = '';
	        				
	        				if(selPrjGrpId == idx){
	        					itemActive = "active";
	        				}
	        				
	        				
	        				$("#submenu-prjGrp-sel_opt").append(
	        						'<li class="kt-nav__item '+itemActive+'" data-toggle="kt-tooltip" data-skin="brand" data-html="true" title="['+$.osl.escapeHtml(map.prjGrpNm)+']</br>'+$.osl.escapeHtml(prjGrpInfo.prjDesc)+'">'
										+'<a href="javascript:$.osl.goPrjGrp(\''+idx+'\')" class="kt-nav__link">'
											+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge fa fa-project-diagram kt-margin-r-10"></span>'
											+'<span class="kt-nav__link-text">'+$.osl.escapeHtml(map.prjGrpNm)+'</span>'
										+'</a>'
									+'</li>'
	        				);
	        				
	        				
	        				
	        				var appendStr = 
	        					'<li class="osl-favorites__item kt-menu__section kt-menu__section--first"'+tooltipStr+'>'
	        					+'	<i class="kt-menu__link-icon flaticon-star" data-fvr-data1="'+prjGrpInfo.prjId+'" data-fvr-data2="'+$.osl.escapeHtml(prjGrpInfo.prjNm)+'" data-fvr-data3="'+$.osl.escapeHtml(prjGrpInfo.prjDesc)+'" data-fvr-type="02" onclick="$.osl.favoritesEdit(event,this)"></i>'
			    						+'<span class="kt-menu__section-text kt-font-lg kt-label-font-color-4 font-weight-bold" onclick="$.osl.goPrjGrp(\''+idx+'\');">'
			    							+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge fa fa-project-diagram kt-margin-r-10"></span>'
			    							+$.osl.escapeHtml(map.prjGrpNm)
			    						+'</span>'
		    					+'	<i class="kt-menu__section-icon flaticon-more-v2"></i>'
		    					+'</li>';
	        				
	        				
        					$.each(map.prjList,function(idx2, map2){

		        				
		        				var tooltipStr = '';
		        				
		        				
		        				if(!$.osl.isNull(map2.prjDesc)){
		        					tooltipStr = ' data-toggle="kt-tooltip" data-skin="brand" title="'+$.osl.escapeHtml(map2.prjDesc).trim()+'"';
		        				}

		        				var itemActive = '';
		        				
		        				if(selPrjId == map2.prjId){
		        					itemActive = "active";
		        				}
		        				
		        				
		        				if(selPrjGrpId == map2.prjGrpId){
		        					$("#submenu-prj-sel_opt").append(
			        						'<li class="kt-nav__item '+itemActive+'" data-toggle="kt-tooltip" data-skin="brand" data-html="true" title="['+$.osl.escapeHtml(map2.prjNm)+']</br>'+$.osl.escapeHtml(map2.prjDesc)+'">'
												+'<a href="javascript:$.osl.goPrj(\''+map2.prjGrpId+'\',\''+map2.prjId+'\');" class="kt-nav__link">'
													+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge flaticon2-box-1 kt-margin-r-10"></span>'
													+'<span class="kt-nav__link-text">'+$.osl.escapeHtml(map2.prjNm)+'</span>'
												+'</a>'
											+'</li>'
			        				);
		        				}
		        				
        						appendStr += 
        							'<li class="kt-menu__item  kt-menu__item--submenu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover">'
			        				+'	<a href="javascript:void(0);" class="osl-favorites__item kt-menu__link kt-menu__toggle" '+tooltipStr+'>'
			        				+'		<i class="kt-menu__link-icon flaticon-star" data-fvr-data1="'+map2.prjGrpId+'" data-fvr-data2="'+map2.prjId+'" data-fvr-data3="'+$.osl.escapeHtml(prjGrpInfo.prjNm)+'" data-fvr-data4="'+$.osl.escapeHtml(map2.prjNm)+'" data-fvr-data5="'+$.osl.escapeHtml(map2.prjDesc)+'" data-fvr-type="03" onclick="$.osl.favoritesEdit(event,this)"></i>'
			        						+'<span class="kt-menu__link-text kt-font-md kt-font-bolder">'
			        						+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge flaticon2-box-1 kt-margin-r-10"></span>'
			        							+$.osl.escapeHtml(map2.prjNm)
			        						+'</span>'
			        				+'		<i class="kt-menu__ver-arrow la la-angle-right"></i>'
			        				+'	</a>'
			        				+'	<div class="kt-menu__submenu "><span class="kt-menu__arrow"></span>'
			        				+'		<ul class="kt-menu__subnav osl-submenu-list__authGrp" data-prj-id="'+map2.prjId+'">'
			        				+'		</ul>'
			        				+'	</div>'
			        				+'</li>'; 
        					});
	        				
        					
        					appendStr += '<div class="kt-separator kt-separator--space-sm kt-separator--border-solid"></div>';
        					
	        				$("#osl_aside_prjAuth_List").append(appendStr);
	        			});
	        			
	        			
	        			if(!$.osl.isNull(data.authList)){
	        				$.each(data.authList, function(idx, map){
	        					
		        				if(selPrjGrpId == map.prjGrpId && selPrjId == map.prjId && selAuthGrpId == map.authGrpId){
		        					$("#submenu-authGrp-sel").html('<i class="kt-menu__link-icon fa fa-user-tie"></i>'+$.osl.escapeHtml(map.authGrpNm));
		        				}
		        				
	        					if(!prjOrdList[map.prjGrpId]["prjList"][map.prjId].hasOwnProperty("authGrpList")){
	        						prjOrdList[map.prjGrpId]["prjList"][map.prjId]["authGrpList"] = {};
	        					}
	        					
	        					prjOrdList[map.prjGrpId]["prjList"][map.prjId]["authGrpList"][map.authGrpId] = map;

		        				
		        				var tooltipStr = '';
		        				
		        				
		        				if(!$.osl.isNull(map.authGrpDesc)){
		        					tooltipStr = ' data-toggle="kt-tooltip" data-skin="brand" title="'+$.osl.escapeHtml(map.authGrpDesc).trim()+'"';
		        				}
		        				

		        				var itemActive = '';
		        				
		        				if(selAuthGrpId == map.authGrpId){
		        					itemActive = "active";
		        				}
		        				
		        				
		        				if(selPrjGrpId == map.prjGrpId && selPrjId == map.prjId){
		        					$("#submenu-authGrp-sel_opt").append(
			        						'<li class="kt-nav__item '+itemActive+'" data-toggle="kt-tooltip" data-skin="brand" data-html="true" title="['+$.osl.escapeHtml(map.authGrpNm)+']</br>'+$.osl.escapeHtml(map.authGrpDesc)+'">'
												+'<a href="javascript:$.osl.goAuthGrp(\''+map.prjGrpId+'\',\''+map.prjId+'\',\''+map.authGrpId+'\');" class="kt-nav__link">'
													+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge fa fa-user-tie kt-margin-r-10"></span>'
													+'<span class="kt-nav__link-text">'+$.osl.escapeHtml(map.authGrpNm)+'</span>'
												+'</a>'
											+'</li>'
			        				);
		        				}
		        				
	        					$(".osl-submenu-list__authGrp[data-prj-id="+map.prjId+"]").append(
	        							'<li class="kt-menu__item " aria-haspopup="true">'
		        						+'	<a href="javascript:$.osl.goAuthGrp(\''+map.prjGrpId+'\',\''+map.prjId+'\',\''+map.authGrpId+'\');" class="osl-favorites__item kt-menu__link ">'
		        						+'		<i class="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i>'
		        						+'		<i class="kt-menu__link-icon flaticon-star" data-fvr-data1="'+map.prjGrpId+'" data-fvr-data2="'+map.prjId+'" data-fvr-data3="'+map.authGrpId+'" data-fvr-data4="'+$.osl.escapeHtml(prjOrdList[map.prjGrpId].prjGrpNm)+'" data-fvr-data5="'+$.osl.escapeHtml(prjOrdList[map.prjGrpId]["prjList"][map.prjId].prjNm)+'" data-fvr-data6="'+$.osl.escapeHtml(map.authGrpNm)+'" data-fvr-type="04" onclick="$.osl.favoritesEdit(event,this)"></i>'
		        								+'<span class="kt-menu__link-text kt-font-md">'
		        									+'<span class="badge badge-dark badge-pill kt-font-sm kt-font-bolder osl-aside__badge fa fa-user-tie kt-margin-r-10"></span>'
		        									+$.osl.escapeHtml(map.authGrpNm)
		        								+'</span>'
		        						+'	</a>'
		        						+'</li>');
	        				});
	        			}
	        		}
	        		
	        		
	        		if(!$.osl.isNull(data.fvrList)){
	        			$.each(data.fvrList, function(idx, map){
	        				
	        				var fvrType = map.fvrType;
	        				
	        				
	        				var fvrTargetElem;
	        				var fvrTargetEvt;
	            			var fvrTitleStr = "";
	            			
	        				
	        				if(fvrType == "01"){
	        					fvrTargetElem = $(".osl-favorites__item i[data-fvr-data1="+$.osl.escapeHtml(map.fvrSubData1)+"][data-fvr-type="+fvrType+"]");
	        					fvrTargetEvt = '$.osl.goMenu(\''+$.osl.escapeHtml(map.fvrSubData2)+'\', \''+$.osl.escapeHtml(map.fvrSubData1)+'\', \''+$.osl.escapeHtml(map.fvrNm)+'\', \''+$.osl.escapeHtml(map.fvrSubData3)+'\' )';
	        					fvrTitleStr = 
	        						'<div class="kt-align-left">'
	        							+'<i class="fa fa-layer-group"></i>&nbsp;'
	        							+$.osl.lang("common.menu.top")+' : '
		        						+$.osl.escapeHtml(map.fvrSubData4)+'</br>'
		        						+'<i class="fa fa-layer-group"></i>&nbsp;'
		        						+$.osl.lang("common.menu.upper")+'　 : '
		        						+$.osl.escapeHtml(map.fvrSubData5)+'</br>'
		        						+'<i class="fa fa-layer-group"></i>&nbsp;'
		        						+$.osl.lang("common.menu.name")+' : '
		        						+$.osl.escapeHtml(map.fvrNm)
	        						'/<div>';
	        				}
	        				else if(fvrType == "02"){
	        					fvrTargetElem = $(".osl-favorites__item i[data-fvr-data1="+$.osl.escapeHtml(map.fvrSubData1)+"][data-fvr-type="+fvrType+"]");
	        					fvrTargetEvt = '$.osl.goPrjGrp(\''+map.fvrSubData1+'\')';
	        					fvrTitleStr = '';
	        					fvrTitleStr = 
	        						'<div class="kt-align-left">'
		        						+$.osl.escapeHtml(map.fvrNm)
	        						'/<div>';
	        				}
	        				else if(fvrType == "03"){
	        					fvrTargetElem = $(".osl-favorites__item i[data-fvr-data1="+$.osl.escapeHtml(map.fvrSubData1)+"][data-fvr-data2="+$.osl.escapeHtml(map.fvrSubData2)+"][data-fvr-type="+fvrType+"]");
	        					fvrTargetEvt = '$.osl.goPrj(\''+map.fvrSubData1+'\',\''+map.fvrSubData2+'\')';
	        					fvrTitleStr = 
	        						'<div class="kt-align-left">'
	        							+'<i class="fa fa-layer-group"></i>&nbsp;'
	        							+$.osl.lang("common.name.prjGrp")+': '
		        						+$.osl.escapeHtml(map.fvrSubData3)+'</br>'
		        						+'<i class="fa fa-layer-group"></i>&nbsp;'
		        						+$.osl.lang("common.name.prj")+': '
		        						+$.osl.escapeHtml(map.fvrNm)+'</br>'
	        						'/<div>';
	        				}
	        				else if(fvrType == "04"){
	        					fvrTargetElem = $(".osl-favorites__item i[data-fvr-data1="+$.osl.escapeHtml(map.fvrSubData1)+"][data-fvr-data2="+$.osl.escapeHtml(map.fvrSubData2)+"][data-fvr-data3="+$.osl.escapeHtml(map.fvrSubData3)+"][data-fvr-type="+fvrType+"]");
	        					fvrTargetEvt = '$.osl.goAuthGrp(\''+map.fvrSubData1+'\',\''+map.fvrSubData2+'\',\''+map.fvrSubData3+'\')';
	        					fvrTitleStr = 
	        						'<div class="kt-align-left">'
	        							+'<i class="fa fa-layer-group"></i>&nbsp;'
	        							+$.osl.lang("common.name.prjGrp")+': '
		        						+$.osl.escapeHtml(map.fvrSubData4)+'</br>'
		        						+'<i class="fa fa-layer-group"></i>&nbsp;'
		        						+$.osl.lang("common.name.prj")+': '
		        						+$.osl.escapeHtml(map.fvrSubData5)+'</br>'
		        						+'<i class="fa fa-layer-group"></i>&nbsp;'
		        						+$.osl.lang("common.name.authGrp")+': '
		        						+$.osl.escapeHtml(map.fvrNm)
	        						'/<div>';
	        				}
	        				
	        				
	        				if(!$.osl.isNull(fvrTargetElem) && fvrTargetElem.length > 0){
		        				var fvrElem =
		        					'<li class="kt-menu__item " aria-haspopup="true" data-toggle="kt-tooltip" data-html="true" data-placement="top" data-skin="brand" title="'+$.osl.escapeHtml(fvrTitleStr)+'">'
									+'			<a href="javascript:'+fvrTargetEvt+';" class="kt-menu__link fvrHoverInfo">'
									+'		<i class="kt-menu__link-icon flaticon-star osl-favorites--active" data-fvr-id="'+map.fvrId+'" data-fvr-data1="'+$.osl.escapeHtml(map.fvrSubData1)+'"data-fvr-data2="'+$.osl.escapeHtml(map.fvrSubData2)+'"data-fvr-data3="'+$.osl.escapeHtml(map.fvrSubData3)+'" data-fvr-data4="'+$.osl.escapeHtml(map.fvrSubData4)+'" data-fvr-data5="'+$.osl.escapeHtml(map.fvrSubData5)+'" data-fvr-data6="'+$.osl.escapeHtml(map.fvrSubData6)+'" data-fvr-type="'+map.fvrType+'" onclick="$.osl.favoritesEdit(event,this)"></i>'
									+'		<span class="kt-menu__link-text">'+$.osl.escapeHtml(map.fvrNm)+'</span>'
									+'	</a>'
									+'</li>';
		        				
		        				
		        				$("#fvrListType"+map.fvrType).append(fvrElem);
		        				
	        					fvrTargetElem.attr("data-fvr-id",map.fvrId);
	        					fvrTargetElem.addClass("osl-favorites--active");
	        				}
	        				
	        			});
	        		}
        			
	        		$.osl.prjGrpAuthList = prjOrdList;
	        		$.osl.showLoadingBar(false,{target: "#kt_header"});
	        	}else{
	        		$.osl.toastr(data.message);
	        	}
	        	
	        	if(typeof callBackFn == "function"){
					
	        		callBackFn();
	        	}
			});
			
			
			ajaxObj.send();
		}
		/**
		 *  function 명 	: $.osl.datatable
		 *  function 설명	: datatable 생성자
		 **/
		,datatable:{
			/**
			 *  function 명 	: $.osl.datatable.list
			 *  function 설명	: 페이지에 생성된 datatable 목록
			 **/
			list:{},
			/**
			 *  function 명 	: $.osl.datatable.setting
			 *  function 설명	: targetId div에 datatable를 생성한다.
			 *  @param targetId: datatable 생성 타겟 요소 ID (# 제외) 
			 *  @param config: datatable 설정 값
			 **/
			setting: function(targetId, config){
				
				if($.osl.isNull(targetId)){
					return true;
				}
				
				
				var datatables = {};
				
				
				var btnEvt = {
					
					list: function(){
						
						if($("[data-datatable-id="+targetId+"][data-datatable-action]").length > 0){
							$.each($("[data-datatable-id="+targetId+"][data-datatable-action]"), function(idx, map){
								var btnDatatableId = $(map).data("datatable-id");
								var btnAction = $(map).data("datatable-action");
								
								
								if(btnEvt.action.hasOwnProperty(btnAction)){
									btnEvt.action[btnAction](this, btnDatatableId, "list");
								}else{
									
									if(targetConfig.actionFn.hasOwnProperty(btnAction)){
										$(this).off("click");
										$(this).click(function(event){
											
											event.cancelable = true;
											event.stopPropagation();
											event.preventDefault();
											event.returnValue = false;
											
											var rowData = [];
											
											
											var selRecords = datatables.targetDt.getSelectedRecords();
											
											$.each(selRecords, function(idx, map){
												var rowIdx = $(map).data("row");
												rowData.push(datatables.targetDt.dataSet[rowIdx]);
											});
											
											targetConfig.actionFn[btnAction](rowData, btnDatatableId, "list", rowData.length, this);
										});
									}
								}
							});
						}
					},
					
					info: function(row){
						if($(row).find("[data-datatable-id="+targetId+"][data-datatable-action]").length > 0){
							var btnRowNum = $(row).data("row");
							
							$.each($(row).find("[data-datatable-id="+targetId+"][data-datatable-action]"), function(idx, map){
								var btnDatatableId = $(map).data("datatable-id");
								var btnAction = $(map).data("datatable-action");

								
								if(btnEvt.action.hasOwnProperty(btnAction)){
									btnEvt.action[btnAction](this, btnDatatableId, "info", btnRowNum, row);
								}else{
									
									if(targetConfig.actionFn.hasOwnProperty(btnAction)){
										$(this).off("click");
										$(this).click(function(event){
											
											event.cancelable = true;
											event.stopPropagation();
											event.preventDefault();
											event.returnValue = false;
											
											var rowData = datatables.targetDt.dataSet[btnRowNum];
											
											targetConfig.actionFn[btnAction](rowData, btnDatatableId, "info", btnRowNum, this);
										});
									}
								}
							});
							
							
							KTApp.initTooltips();
						}
					},
					/**
					 * 해당되는 버튼 동작 함수 - 사전 데이터 가공 작업
					 * select -> 해당 datatable 페이지 1로 복귀하고 데이터 재 조회
					 * insert -> config에 선언된 insert 함수 호출 (페이지 제어) 
					 * update,delete -> config에 선언된 insert 함수 호출 (페이지 제어)
					 * 				-> 선택된 데이터 Json 파라미터 값으로 전달
					 */
					action: {
						"select": function(elem, datatableId) {
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								datatables.targetDt.setDataSourceParam("pagination.page",1);
								datatables.targetDt.reload();
							});
						},
						"insert": function(elem, datatableId, type, rowNum) {
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								
								
								datatables.config.actionFn["insert"](datatableId, type, rowNum,elem);
							});
						},
						"update": function(elem, datatableId, type, rowNum) {
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								var rowData;
								
								if(type == "list"){
									
									var selRecords = datatables.targetDt.getSelectedRecords();
									
									
									if(selRecords.length == 0){
										$.osl.alert($.osl.lang("datatable.action.update.nonSelect"));
										return true;
									}
									
									else if(selRecords.length > 1){
										$.osl.alert($.osl.lang("datatable.action.update.manySelect",selRecords.length));
										return true;
									}
									else{
										var rowIdx = datatables.targetDt.getSelectedRecords().data("row");
										rowData = datatables.targetDt.dataSet[rowIdx];
									}
								}
								
								else if(type == "info"){
									rowData = datatables.targetDt.dataSet[rowNum];
								}
								
								
								datatables.config.actionFn["update"](rowData, datatableId, type, rowNum,elem);
								
							});
						},
						"delete": function(elem, datatableId, type, rowNum) {
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								
								var rowData = [];
								
								if(type == "list"){
									
									var selRecords = datatables.targetDt.getSelectedRecords();
									
									
									if(selRecords.length == 0){
										$.osl.alert($.osl.lang("datatable.action.delete.nonSelect"));
										return true;
									}
									else{
										$.each(selRecords, function(idx, map){
											var rowIdx = $(map).data("row");
											rowData.push(datatables.targetDt.dataSet[rowIdx]);
										});
									}
								}
								
								else if(type == "info"){
									rowData.push(datatables.targetDt.dataSet[rowNum]);
								}
								
								$.osl.confirm($.osl.lang("datatable.action.delete.confirm",rowData.length),null, function(result){
									if (result.value) {
										
										datatables.config.actionFn["delete"](rowData, datatableId, type, rowNum, elem);
									}
								});
								
							});
						},
						"click": function(elem, datatableId, type, rowNum, row){
							
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								var rowData = datatables.targetDt.dataSet[rowNum];
								
								
								datatables.config.actionFn["click"](rowData, datatableId, type, rowNum, elem);
							});
							
							
							$(row).off("click");
							$(row).click(function(event){
								
								if($(event.target.parentElement).hasClass("kt-checkbox") || $(event.target.parentElement).hasClass("kt-datatable__toggle-detail")){
									return true;
								}
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								
								$(".kt_datatable[id="+datatableId+"] tr.kt-datatable__row.osl-datatable__row--selected").removeClass("osl-datatable__row--selected");
								$(".kt_datatable[id="+datatableId+"] tr.kt-datatable__row[data-row="+$(row).data("row")+"]").addClass("osl-datatable__row--selected");
								
								var rowData = datatables.targetDt.dataSet[rowNum];
								
								
								datatables.config.actionFn["click"](rowData, datatableId, type, rowNum, elem);
							});
						},
						"dblClick": function(elem, datatableId, type, rowNum, row){
							$(elem).off("click");
							$(elem).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								var rowData = datatables.targetDt.dataSet[rowNum];
								
								
								datatables.config.actionFn["dblClick"](rowData, datatableId, type, rowNum, elem );
							});

							
							$(row).off("dblclick");
							$(row).on('dblclick', function (event) {
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								var rowData = datatables.targetDt.dataSet[rowNum];
								
								
								datatables.config.actionFn["dblClick"](rowData, datatableId, type, rowNum, elem );
							});
						}
					}
				};
				
				/**
				 * 검색 영역 세팅
				 * @desc 페이지 내에서 datatable config - columns 세팅 시 사용 값
				 * search: true (검색 기능 사용 유무)
				 * searchType:"select" (검색 종류 [select, date, daterange, text])
				 * searchCd: "REQ00008" (검색 종류가 select인 경우 사용되는 공통 코드 마스터 코드 값)
				 * searchField:"reqProTypeCd" (DB 조회 시 실제 검색 되는 컬럼 명)
				 */
				var searchEvt = {
					init: function(elemId, searchColumns){
						
						var searchTarget = $(".osl-datatable-search[data-datatable-id="+elemId+"]");
						searchTarget.empty();
						
						if(searchTarget.length > 0){
							
							var btnStyle = searchTarget.data("search-style");
							
							var btnStyleStr = "btn-brand";
							
							if(!$.osl.isNull(btnStyle)){
								btnStyleStr = "btn-"+btnStyle;
							}
							
							
							var searchTargetHtml = 
								'<div class="form-group">'
									+'<div class="input-group">'
										+'<div class="input-group-prepend">'
											+'<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" tabindex="0">'+$.osl.lang("datatable.search.allTitle")+'</button>'
											+'<div class="dropdown-menu osl-datatable-search__dropdown" data-datatable-id="'+elemId+'">'
												+'<a class="dropdown-item active" href="javascript:void(0);" data-field-id="-1" data-opt-type="all">'+$.osl.lang("datatable.search.allTitle")+'</a>'
											+'</div>'
										+'</div>'
										+'<select class="form-control kt-select2 osl-datatable-search__select" id="searchSelect_'+elemId+'" name="searchSelect" aria-hidden="true" data-datatable-id='+elemId+'>'
										+'</select>'
										+'<div class="kt-input-icon kt-input-icon--right osl-border-radius-none osl-datatable-search__input" data-datatable-id="'+elemId+'">'
											+'<input type="text" class="form-control" aria-label="'+$.osl.lang("datatable.search.placeholder")+'" disabled="disabled" name="searchData_'+elemId+'" id="searchData_'+elemId+'" data-datatable-id="'+elemId+'">'
											+'<span class="kt-input-icon__icon kt-input-icon__icon--right">'
												+'<span><i class="la"></i></span>'
											+'</span>'
											+'<input type="hidden" name="searchStartDt" id="searchStartDt_'+elemId+'" data-datatable-id="'+elemId+'">'
											+'<input type="hidden" name="searchEndDt" id="searchEndDt_'+elemId+'" data-datatable-id="'+elemId+'">'
										+'</div>'
										+'<div class="input-group-append">'
											+'<button class="btn '+btnStyleStr+' osl-datatable-search__button" type="button" data-datatable-id="'+elemId+'">'
												+'<i class="fa fa-search"></i><span class=""><span>'+$.osl.lang("datatable.search.title")+'</span></span>'
											+'</button>'
										+'</div>'
									+'</div>'
								+'</div>';
							
							
							searchTarget.html(searchTargetHtml);
							
							
							var selectOptList = [];
							
							
							$.each(searchColumns, function(idx, map){
								var field = map.field;
								
								
								if(map.hasOwnProperty("searchField")){
									field = map.searchField;
								}
								
								
								if(map.hasOwnProperty("searchType")){
									if(map.searchType == "select"){
										
										if(!map.hasOwnProperty("searchCd")){
											return true;
										}
										$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").append('<a class="dropdown-item" href="javascript:void(0);" data-field-id="'+field+'" data-opt-type="select" data-opt-mst-cd="'+map.searchCd+'">'+$.osl.escapeHtml(map.title)+'</a>');
									}
									else if(map.searchType == "date"){
										$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").append('<a class="dropdown-item" href="javascript:void(0);" data-field-id="'+field+'" data-opt-type="date">'+$.osl.escapeHtml(map.title)+'</a>');
									}
									else if(map.searchType == "daterange"){
										$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").append('<a class="dropdown-item" href="javascript:void(0);" data-field-id="'+field+'" data-opt-type="daterange">'+$.osl.escapeHtml(map.title)+'</a>');
									}
									else{ 
										$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").append('<a class="dropdown-item" href="javascript:void(0);" data-field-id="'+field+'" data-opt-type="text">'+$.osl.escapeHtml(map.title)+'</a>');
									}
								}else{ 
									$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").append('<a class="dropdown-item" href="javascript:void(0);" data-field-id="'+field+'" data-opt-type="text">'+$.osl.escapeHtml(map.title)+'</a>');
								}
							});

							
							$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"] > .dropdown-item").click(function(){
								$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"] > .dropdown-item.active").removeClass("active");
								$(this).addClass("active");
								$(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"]").siblings("button").text($(this).text());
								var searchFieldId = $(this).data("field-id");
								var searchType = $(this).data("opt-type");
								var searchCd = $(this).data("opt-mst-cd");
								
								searchEvt.inputHandle(elemId, searchFieldId, searchType, searchCd);
							});
						}
						$(".osl-datatable-search__select[data-datatable-id="+elemId+"]").hide();
						$(".osl-datatable-search__input[data-datatable-id="+elemId+"]").show();
					},
					/* 실제 동작 코드 */
					action: {
						"select":function(){
							
							var selectBtn = $("button[data-datatable-id="+targetId+"][data-datatable-action=select]");
							if(selectBtn.length > 0){
								selectBtn[0].click();
							}else{
								
								datatables.targetDt.setDataSourceParam("pagination.page",1);
								datatables.targetDt.reload();
							}
						},
						"select-input":function(targetObj){
							
							$(targetObj).addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand");
							
							
							searchEvt.action.select();
							
							setTimeout(function(){
								$(targetObj).removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand");
							},300);
						},
						"select-button":function(targetObj){
							
							$(targetObj).children("span").hide();
							$(targetObj).addClass("spinner-border spinner-border-sm");
							
							
							searchEvt.action.select();
							
							setTimeout(function(){
								$(targetObj).removeClass("spinner-border spinner-border-sm");
								$(targetObj).children("span").show();
							},300);
						},
						"select-block":function(targetId){
							$.osl.showLoadingBar(true,{target: targetId,message: ""});
							
							searchEvt.action.select();
							
							setTimeout(function(){
								$.osl.showLoadingBar(false,{target: targetId});
							},300);
						},
						/**
						 * 검색 드롭다운 메뉴 변경 시 타입에 따라 input, select 세팅
						 * @param type: [input, select]
						 * @param disabled: 입력 상자 disabled 유무 (select 해당 없음)
						 * @param readonly: 입력 상자 readonly 유무 (select 해당 없음)
						 */
						"layout-clean": function(elemId, type, disabled, readonly, laIcon){
							
							if(type == "select"){
			        			$(".osl-datatable-search__select[data-datatable-id="+elemId+"]~span").removeClass("osl-datatable-search--hide");
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"]").addClass("osl-datatable-search--hide");
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchData_"+elemId+"").attr("disabled",false);
								return true;
							}else{ 
								
								$(".osl-datatable-search__select[data-datatable-id="+elemId+"]~span").addClass("osl-datatable-search--hide");
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"]").removeClass("osl-datatable-search--hide");
								
								
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > span i.la").removeClass("la-calendar");
								if(!$.osl.isNull(laIcon)){
									$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > span i.la").addClass(laIcon);
								}
								
							}
							$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchData_"+elemId+"").attr("disabled",disabled);
							$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchData_"+elemId+"").attr("readonly",readonly);
						}
					},
					
					inputHandle: function(elemId, searchFieldId, searchType, searchCd){
						
						var searchDataTarget = $(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchData_"+elemId+"[data-datatable-id="+elemId+"]");
						
						searchDataTarget.val('');
						
						$.osl.date.datepicker(searchDataTarget,"destroy");
						
						$.osl.date.daterangepicker(searchDataTarget,"destroy");
						
						$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchStartDt_"+elemId+"[data-datatable-id="+elemId+"]").val('');
						$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchEndDt_"+elemId+"[data-datatable-id="+elemId+"]").val('');
						
						searchDataTarget.off('keypress');
						
						if(searchType == "select"){
							
							var commonCodeArr = [
								{mstCd: searchCd, useYn: "Y",targetObj: "#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]", comboType:"N"}
							];

			        		
		        			$.osl.getMulticommonCodeDataForm(commonCodeArr , true);
		        			
		        			
		        			searchEvt.action["layout-clean"](elemId,searchType);
							
							
							$("#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]").select2({width: '100%'});
							
							
							searchEvt.action["select-block"]("#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]+span");
							
							$("#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]").off("select2:select");
							$("#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]").on("select2:select", function(e) {
								searchEvt.action["select-block"]("#searchSelect_"+elemId+"[data-datatable-id="+elemId+"]+span");
							});
						}
						
						else if(searchType == "all"){
							
							searchEvt.action["layout-clean"](elemId,searchType,true,false);
							
							
							searchEvt.action["select-input"]($(".osl-datatable-search__input[data-datatable-id="+elemId+"] > span i.la"));
						}
						else if(searchType == "date"){
							
							searchEvt.action["layout-clean"](elemId,searchType,false,true,"la-calendar");
							
							
							$.osl.date.datepicker(searchDataTarget, {}, function(defaultConfig, selected){
								var minDate = new Date(selected.date).format("yyyy-MM-dd 00:00:00");
								var maxDate = new Date(selected.date).format("yyyy-MM-dd 23:59:59");
								
								
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchStartDt_"+elemId+"[data-datatable-id="+elemId+"]").val(minDate);
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchEndDt_"+elemId+"[data-datatable-id="+elemId+"]").val(maxDate);
								
								
								searchEvt.action["select-input"]($(".osl-datatable-search__input[data-datatable-id="+elemId+"] > span i.la"));
							});
							
						}
						else if(searchType == "daterange"){
							
							searchEvt.action["layout-clean"](elemId,searchType,false,true,"la-calendar");
							
							
							$.osl.date.daterangepicker(searchDataTarget, {}, function(defaultConfig, start, end, label){
								
								var minDate = new Date(start).format("yyyy-MM-dd 00:00:00");
								var maxDate = new Date(end).format("yyyy-MM-dd 23:59:59");
								
								
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchStartDt_"+elemId+"[data-datatable-id="+elemId+"]").val(minDate);
								$(".osl-datatable-search__input[data-datatable-id="+elemId+"] > input#searchEndDt_"+elemId+"[data-datatable-id="+elemId+"]").val(maxDate);
								
								
								searchEvt.action["select-input"]($(".osl-datatable-search__input[data-datatable-id="+elemId+"] > span i.la"));
							});
							
						}
						else{
							
							searchEvt.action["layout-clean"](elemId,searchType,false,false);
							
							
							var fieldId = $(".osl-datatable-search__dropdown[data-datatable-id="+elemId+"] > .dropdown-item.active").data("field-id");
							var fieldData = datatableInfo.getColumnByField(fieldId);
							
							if(!$.osl.isNull(fieldData)){
								
								if(fieldData.hasOwnProperty("searchKeyCode") && fieldData.hasOwnProperty("searchKeyEvt")){
									var keyCode = fieldData["searchKeyCode"];
									var keyEvt = fieldData["searchKeyEvt"];
									
									
									if(!$.osl.isNull(keyCode) && keyCode != 13 && typeof keyEvt == "function"){
										
										searchDataTarget.on('keypress', function(e) {
											if (e.which == keyCode){
												keyEvt();
											}
										});
									}
								}
							}	
							
							
							searchDataTarget.on('keypress', function(e) {
								if (e.which === 13){
									var thisObj = $(this);
									var thisObjIcon = thisObj.siblings("span").find("i.la");
									
									
									searchEvt.action["select-input"](thisObjIcon);
								}
							});
						}
					}
				}
				
				var ktDatatableTarget = $("#"+targetId);
				if(ktDatatableTarget.length > 0){
					/* datatable 기본 설정 값 */
					var datatableConfig = {
						data: {
							type: 'remote',
							pageSize: 10,
							serverPaging: true,
							serverFiltering: false,
							serverSorting: true,
							saveState: {webstorage: false}
						},
						layout: {
							scroll: false,
							footer: false,
						},
						translate:{
							records:{
								processing: $.osl.lang("datatable.translate.records.processing"),
								noRecords: $.osl.lang("datatable.translate.records.noRecords")
							},
							toolbar:{
								pagination:{
									items:{
										default: {
											  first: $.osl.lang("datatable.translate.toolbar.pagination.items.first"),
											  prev: $.osl.lang("datatable.translate.toolbar.pagination.items.prev"),
											  next: $.osl.lang("datatable.translate.toolbar.pagination.items.next"),
											  last: $.osl.lang("datatable.translate.toolbar.pagination.items.last"),
											  more: $.osl.lang("datatable.translate.toolbar.pagination.items.more"),
											  input: $.osl.lang("datatable.translate.toolbar.pagination.items.input"),
											  select: $.osl.lang("datatable.translate.toolbar.pagination.items.select")
										},
										info: $.osl.lang("datatable.translate.toolbar.pagination.items.info")
									}
								}
							}
						},
						rows:{
							afterTemplate: function(row, data, index){
								btnEvt["info"](row);
							}
						},
						sortable: true,
						pagination: true,
						search: false,
						columns: [],
						searchColumns: [],
						actionBtn:{
							"autoHide": false,
							"title": "Actions",
							"width": false,
							"lastPush": true,
							"update": true,
							"delete": true,
							"click": false,
							"dblClick": false
						},
						actionFn:{
							"insert":$.noop,
							"update":$.noop,
							"delete":$.noop,
							"click":$.noop,
							"dblClick":$.noop
						},
						actionTooltip:{
							"update": null,
							"delete": null,
							"click": null,
							"dblClick": null
						},
						toolbar:{
							items:{
								pagination:{
									pages:{
										desktop: {
											layout: 'default',
											pagesNumber: 10
										},
										tablet:{
											layout: 'default',
											pagesNumber: 6
										},
										mobile:{
											layout: 'default',
											pagesNumber: 3
										}
									}
								}
							}
						},
						theme: {
							actionBtn:{
								"update": "",
								"delete": "",
								"click": "",
								"dblClick": ""
							},
							actionBtnIcon:{
								"update": "la la-edit",
								"delete": "la la-trash",
								"click": "la la-check-square",
								"dblClick": "la la-external-link"
							}
						},
						callback:{
							/* datatable 호출 완료 후 */
							initComplete: $.noop,
							/* datatable 내부 ajax 호출 성공 시 */
							ajaxDone: $.noop,
							/* datatable reload */
							reloaded: $.noop,
							/* datatable sort*/
							sort: $.noop,
							/* datatable page size change*/
							perpage: $.noop,
							/* datatable page number change*/
							gotoPage: $.noop
						}
					};
					
					/* datatable 세팅 */
					
					var targetConfig = $.extend(true, {}, datatableConfig);
						
					
					targetConfig = $.extend(true, targetConfig, config, config);

					
					var actionWidth = 0;
					
					
					if(targetConfig.hasOwnProperty("actionBtn")){
						var actionBtnStr = '';
						var actionBtnFlag = false;
						/*
						
						if(targetConfig.actionFn.hasOwnProperty(btnAction)){
							$(this).off("click");
							$(this).click(function(event){
								
								event.cancelable = true;
								event.stopPropagation();
								event.preventDefault();
								event.returnValue = false;
								
								targetConfig.actionFn[btnAction](btnDatatableId);
							});
						}
						*/
						
						var ignoreActionBtn = ["autoHide", "title", "width", "lastPush"];
						
						$.each(targetConfig.actionBtn, function(actionBtnNm, actionData){
							
							if(actionData === true && ignoreActionBtn.indexOf(actionBtnNm) == -1){
								
								actionBtnFlag = true;
								actionWidth += 40;
								
								
								var actionClass = "";
								if(!$.osl.isNull(targetConfig.theme.actionBtn[actionBtnNm])){
									actionClass = "btn-"+$.osl.escapeHtml(targetConfig.theme.actionBtn[actionBtnNm]);
								}
								
								
								var actionTooltip = "";
								if(!$.osl.isNull(targetConfig.actionTooltip[actionBtnNm])){
									actionTooltip = ' data-toggle="kt-tooltip" title="'+targetConfig.actionTooltip[actionBtnNm]+'" data-placement="top"';
								}
								
								actionBtnStr += '<a href="javascript:void(0);" class="btn btn-clean btn-icon '+actionClass+'" data-datatable-id="'+targetId+'" data-datatable-action="'+actionBtnNm+'"'+actionTooltip+'><i class="'+targetConfig.theme.actionBtnIcon[actionBtnNm]+'"></i></a>';
							}
						});
					}
					
					if(actionBtnFlag){
						
						var actionBtnTitle = targetConfig.actionBtn.title;
						
						if(typeof actionBtnTitle != "string"){
							actionBtnTitle = "Actions";
						}
						
						
						var actionBtnWidth = targetConfig.actionBtn.width;
						if(actionBtnWidth != null && actionBtnWidth === false){
							actionBtnWidth = actionWidth;
						}
						
						var addJson = {
								field: 'actions',
			                    width: actionBtnWidth,
			                    title: actionBtnTitle,
			                    sortable: false,
			                    textAlign: 'center',
			                    overflow: 'visible',
			                    autoHide: targetConfig.actionBtn.autoHide,
			                    template: function (row) {
			                    	return actionBtnStr;
			                    }
							};
						
						
						if(targetConfig.actionBtn["lastPush"]){
							targetConfig.columns.push(addJson);
						}
						
						else{
							targetConfig.columns.unshift(addJson);
						}
					}
					
					
					var searchColumns = [];
					
					var searchAddList = [];
					
					
					$.each(targetConfig.columns, function(idx, map){
						
						if(!map.hasOwnProperty("template")){
							var fieldId = map.field;
							
							map.template = function(row){
								return $.osl.escapeHtml(row[fieldId]);
							}
						}
						
						
						var fieldLangTitle = $.osl.lang("datatable."+targetId+"."+map.field);
						if(!$.osl.isNull(fieldLangTitle)){
							map.title = fieldLangTitle;
						}
						
						
						if(map.hasOwnProperty("search")){
							if(map.search){
								searchColumns.push(map);
								searchAddList.push(map.field);
							}
						}
					});
					
					
					if(targetConfig.searchColumns.length > 0){
						$.each(targetConfig.searchColumns, function(idx, map){
							
							if(searchAddList.indexOf(map.field) == -1){
								
								if(map.hasOwnProperty("searchOrd")){
									var searchOrd = map.searchOrd;
									
									if(searchOrd < 0 && searchOrd >= searchColumns.length){
										searchColumns.push(map);
									}else{
										
										searchColumns.splice(searchOrd,0,map);
									}
									
								}else{
									searchColumns.push(map);
								}
							}
						});
					}
					
					
					if(targetConfig.data.type != 'local'){
						
						targetConfig = $.extend(true, targetConfig, {
							data:{
								source:{
									read:{
										params: {
											dtParamPrjGrpId: $.osl.selPrjGrpId,
											dtParamPrjId: $.osl.selPrjId,
											dtParamAuthGrpId: $.osl.selAuthGrpId,
											searchTargetId: function(){
												return $(".osl-datatable-search__dropdown[data-datatable-id="+targetId+"] > .dropdown-item.active").data("field-id");
											},
											searchTargetType: function(){
												return $(".osl-datatable-search__dropdown[data-datatable-id="+targetId+"] > .dropdown-item.active").data("opt-type");
											},
											searchTargetData: function(){
												var searchTargetType = $(".osl-datatable-search__dropdown[data-datatable-id="+targetId+"] > .dropdown-item.active").data("opt-type");
												var searchTargetData;
												if(searchTargetType == "select"){
													searchTargetData = $(".osl-datatable-search__select[data-datatable-id="+targetId+"]").val();
												}
												else if(searchTargetType == "all"){ 
													searchTargetData = null;
												}
												else{
													searchTargetData = $(".osl-datatable-search__input[data-datatable-id="+targetId+"] > input#searchData_"+targetId).val();
												}
												
												return searchTargetData;
											},
											searchStartDt: function(){
												return $(".osl-datatable-search__input[data-datatable-id="+targetId+"] > input#searchStartDt_"+targetId+"").val();
											},
											searchEndDt: function(){
												return $(".osl-datatable-search__input[data-datatable-id="+targetId+"] > input#searchEndDt_"+targetId+"").val();
											}
										}
									}
								}
							}
						});
					}

					
					if(searchColumns.length > 0){
						searchEvt.init(targetId, searchColumns);
						
						$(".osl-datatable-search__button[data-datatable-id="+targetId+"]").click(function(){
							var thisObj = $(this);
							var thisObjIcon = thisObj.children("span");
							
							
							searchEvt.action["select-button"](thisObjIcon);
						});
					}
				
					
					var datatableInfo = $(ktDatatableTarget).KTDatatable(targetConfig);
					
					
					$(ktDatatableTarget).on("kt-datatable--on-ajax-done",function(evt,list){
						targetConfig.callback.ajaxDone(evt.target, list, datatableInfo);
					});
					
					
					$(ktDatatableTarget).on("kt-datatable--on-init",function(evt,config){
						targetConfig.callback.initComplete(evt.target, config, datatableInfo);
					});
					
					
					$(ktDatatableTarget).on("kt-datatable--on-reloaded",function(evt,config){
						targetConfig.callback.reloaded(evt.target, config, datatableInfo);
					});
					
					$(ktDatatableTarget).on("kt-datatable--on-update-perpage",function(evt,args){
						targetConfig.callback.perpage(evt.target, args, datatableInfo);
					});
					$(ktDatatableTarget).on("kt-datatable--on-goto-page",function(evt,args){
						targetConfig.callback.gotoPage(evt.target, args, datatableInfo);
					});
					
					
					$(ktDatatableTarget).on("kt-datatable--on-sort",function(evt,data){
						
						if($.osl.isNull(datatableInfo.getColumnByField(data.field))){
							$.osl.alert($.osl.lang("datatable.sort.fieldNotMatch"));
						}else{
							/* 
							 * sort 해당 컬럼에 sortField 있는지 체크, 있다면 대체
							 * sort정보 데이터 테이블 파라미터에 대입 
							 * 페이지 재 조회
							 * */
							var field = data.field;
							var columnTarget = datatableInfo.getColumnByField(data.field);
							if(columnTarget.hasOwnProperty("sortField")){
								field = columnTarget.sortField;
							}
							datatableInfo.setDataSourceParam("sortFieldId",field);
							datatableInfo.setDataSourceParam("sortDirection",data.sort);
							
							datatableInfo.reload();
							
							targetConfig.callback.sort(evt.target, data, datatableInfo);
						}
					});
					
					$(ktDatatableTarget).on("kt-datatable--on-layout-updated",function(evt,config){
						
						$.each(targetConfig.columns, function(idx, map){
							
							if(map.hasOwnProperty("onclick")){
								var targetObj = $("#"+targetId+" td.kt-datatable__cell[data-field="+map.field+"]");
								
								
								targetObj.off("click");
								targetObj.click(function(event){
									
									event.cancelable = true;
									event.stopPropagation();
									event.preventDefault();
									event.returnValue = false;
									
									
									if(typeof map.onclick == "function"){
										var rowNum = $(this).parent("tr").data("row");
										var rowData = null;
										try{
											rowData = datatableInfo.getDataSet()[rowNum];
										}catch(e){
											
											console.log(e);
										}
										
										map.onclick(rowData, event);
									}
								});
							}
						});
					});
					
					
					btnEvt.list();
					datatables = {"config": targetConfig, "targetDt": datatableInfo};
					
					
					$.osl.datatable.list[targetId] = datatables;
				}
			}
		}
		,date: {
			/**
			 *  function 명 	: $.osl.date.init
			 *  function 설명	: datepicker, datetimepicker 언어 처리
			 **/
			init: function(){
				
				$.fn.datepicker.dates['ko'] = $.osl.lang("date.datepicker");
				
				moment.updateLocale('fr', $.osl.lang("date.moment"));
			}
			/**
			 *  function 명 	: $.osl.date.datepicker
			 *  function 설명	: 타겟 오브젝트에 datepicker 세팅
			 *  @param targetObj : datepicker 대상 오브젝트
			 *  @param config : datepicker 설정 값 (String == 'destroy'인 경우 해당 datepicker 제거)
			 *  		예) $.osl.date.datepicker($(".osl-datatable-search__input > input#searchData"),"destroy")
			 *  @param callback: 일자 선택시 반환 함수
			 **/
			,datepicker: function(targetObj, config, callback){
				
				if($.osl.isNull($(targetObj)) || $(targetObj).length == 0){
					return true;
				}
				
				if(typeof callback != "function"){
					callback = $.noop;
				}
				
				
				if(typeof config == "string" && config == "destroy"){
					$(targetObj).datepicker('destroy');
				}else{
					var defaultConfig = {
							rtl: KTUtil.isRTL(),
							format: "yyyy-mm-dd",
							todayHighlight: true,
							orientation: "bottom left",
							language: 'ko',
							maxViewMode: 2,
							autoclose: true,
							templates:{
								leftArrow: '<i class="la la-angle-left"></i>',
								rightArrow: '<i class="la la-angle-right"></i>'
							}
					};
					
					
					defaultConfig = $.extend(true, defaultConfig, config);
					
					
					$(targetObj).datepicker(defaultConfig).on('changeDate', function (selected) {
						callback(defaultConfig, selected);
					});
				}
			}
			/**
			 *  function 명 	: $.osl.date.daterangepicker
			 *  function 설명	: 타겟 오브젝트에 daterangepicker 세팅
			 *  @param targetObj : daterangepicker 대상 오브젝트
			 *  @param config : daterangepicker 설정 값 (String == 'destroy'인 경우 해당 daterangepicker 제거)
			 *  		예) $.osl.date.daterangepicker($(".osl-datatable-search__input > input#searchData"),"destroy")
			 *  @param callback: 일시 선택시 반환 함수
			 **/
			,daterangepicker: function(targetObj, config, callback){
				
				if($.osl.isNull($(targetObj)) || $(targetObj).length == 0){
					return true;
				}
				
				if(typeof callback != "function"){
					callback = $.noop;
				}
				
				
				if(typeof config == "string" && config == "destroy"){
					
					if(!$.osl.isNull($(targetObj).data('daterangepicker'))){
						$(targetObj).data('daterangepicker').remove();
					}
				}else{
					var minYear = moment().subtract(10, 'year').format('YYYY');
					var maxYear = moment().format('YYYY');
					
					var defaultConfig = {
				            buttonClasses: 'btn btn-sm',
				            applyClass: "btn-primary",
				            cancelClass: "btn-secondary",
							autoApply: true,
							showDropdowns: true,
							todayHighlight: false,
							minYear : parseInt(minYear),
							maxYear : parseInt(maxYear),
				        };
					
					
					defaultConfig = $.extend(true, defaultConfig, config);
					
					
					$(targetObj).daterangepicker(defaultConfig,
						function(start, end, label) {
							callback(defaultConfig, start, end, label);
						}
					);
				}
			}
		}
		
		/**
		 *  function 명 	: $.osl.user
		 *  function 설명	: 사용자 처리 기본 생성자 함수
		 **/
		,user: {
			/* 사용자 정보 */
			userInfo:{}
			/* 사용자 설정 값 데이터 */
			,usrOptData:{}
			/**
			 *  function 명 	: $.osl.user.logout
			 *  function 설명	: 로그아웃 처리
			 * @param cookieName 쿠키이름
			 */
			,logout: function(){
				$.osl.confirm($.osl.lang("common.logout.confirm"),{"confirmButtonText": $.osl.lang("common.logout.button")},function(result) {
			        if (result.value) {
			        	
			        	$.osl.user.deleteCookie("pwExpire");
						$(location).attr('href',"/cmm/cmm4000/cmm4000/selectCmm4000Logout.do");
			        }
			    });
			}
			/**
			 *  function 명 	: $.osl.user.deleteCookie
			 *  function 설명	: 비밀번호 만료일 alert이 로그인 시 한번만 나타나게 하기위해 생성한 쿠키를 삭제
			 * @param cookieName 쿠키이름
			 */
			,deleteCookie: function(cookieName){
				var expireDate = new Date();
				  
			  	
				expireDate.setDate( expireDate.getDate() - 1 );
				document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
			}
			/**
			 *  function 명 	: $.osl.user.pwChangeDay
			 *  function 설명	: 사용자 비밀번호 만료일 체크
			 * @param pwlimitDay 비밀번호 만료일
			 */
			,pwChangeDay: function(pwExpireDay){
				
				if( $.osl.user.isCookie("pwExpire") == false ){
				
					if( !$.osl.isNull(pwExpireDay) ){
						
						$.osl.alert($.osl.lang("common.alert.title"),$.osl.lang("common.user.pwChange", pwExpireDay),"warning", function(result){
							
							$.osl.user.setCookie("pwExpire", "expire"); 
						});
					}	
				}
			}
			/**
			 *  function 명 	: $.osl.user.isCookie
			 *  function 설명	:   쿠키의 유무 체크
			 * @param cookieName 쿠키이름
			 */
			,isCookie: function(cookieName) {
				cookieName = cookieName + '=';
				var cookieData = document.cookie;
				var cIdx = cookieData.indexOf(cookieName);
				var exist = false;	
				
				if(cIdx != -1 ){
					exist = true;	
				}
				return exist;
			}
			/**
			 *  function 명 	: $.osl.user.setCookie
			 *  function 설명	:  비밀번호 만료일 alert이 로그인 시 한번만 나타나게 하기위한 쿠키를 생성한다.
			 * @param cookieName 쿠키이름
			 * @param cookieValue 쿠키값
			 */
			,setCookie: function(cookieName, cookieValue) {   
				var cDate = new Date();
				cDate.setTime(cDate.getTime() + 1000*60*60*1); 
				document.cookie = cookieName + "=" + cookieValue + "; path=/; expires=" + cDate.toGMTString() + ";";
			}
			/**
			 *  function 명 	: $.osl.user.usrOptChg
			 *  function 설명	: 사용자 설정 값 변경 시 즉시 적용 함수
			 * @param 사용자 설정 값
			 */
			,usrOptChg: function(thisTarget){
				
				var usrOptCd = thisTarget.value;
				
				
				var usrOptMstCd = $(thisTarget).data("mst-cd");
				
				var paramData = {"usrOptCd": usrOptCd, "usrOptMstCd": usrOptMstCd};
				
				
				var ajaxObj = new $.osl.ajaxRequestAction(
						{"url":"/stm/stm3000/stm3001/saveStm3001UsrOptInfo.do", "loadingShow":true}
						,paramData);
				
				
				ajaxObj.setFnSuccess(function(data){
					
		        	if( data.errorYn == "N" ){
		        		
						$("#usrOpt_"+usrOptMstCd).data("osl-value",usrOptCd);
						
		        		
						$.osl.initHeaderClear();
		        		
						$.osl.initHeader();
		        		
		        	}
		        	
		        	$.osl.toastr(data.message);
		        	
				});
				
				
				ajaxObj.send();
			}
			/**
			 *  function 명 	: $.osl.user.usrOptLangChg
			 *  function 설명	: 사용자 언어 코드 설정
			 * @param 언어코드 Element 대상
			 */
			,usrOptLangChg: function(thisTarget){
				
				var usrOptCd = $(thisTarget).attr("value");
				
				
				var usrOptMstCd = $(thisTarget).data("mst-cd");
				var subCd = $(thisTarget).data("sub-cd");
				var subCdRef1 = $(thisTarget).data("sub-cd-ref1");
				var subCdRef2 = $(thisTarget).data("sub-cd-ref2");
				
				var paramData = {"usrOptCd": usrOptCd, "usrOptMstCd": usrOptMstCd};
				
				
				var ajaxObj = new $.osl.ajaxRequestAction(
						{"url":"/stm/stm3000/stm3001/saveStm3001UsrOptInfo.do", "loadingShow":true}
						,paramData);
				
				
				ajaxObj.setFnSuccess(function(data){
					
					if( data.errorYn == "N" ){
						
						location.reload();
						/*
						
						$("#usrCurrentLangCd > img").attr("src","/media/flags/"+subCdRef2);
						$(thisTarget).children(".kt-nav__link-text").text(subCdRef1);
						
						
						$.osl.langCd = subCd;
						
						
						$("#usrLangCdList .kt-nav__item.active").removeClass("active");
						$(thisTarget).parent(".kt-nav__item").addClass("active");
						
						
						$.osl.initHeaderClear();
						
						$.osl.initHeader();
						*/
					}
					
					$.osl.toastr(data.message);
					
				});
				
				
				ajaxObj.send();
			}
			/**
			 *  function 명 	: $.osl.user.usrImgSet
			 *  function 설명	: 사용자 프로필 이미지와 사용자명을 세팅해서 반환한다.
			 * @param paramUsrImgId 사용자 프로필 이미지 ID
			 * @param paramData 사용자 명 또는 Json Object
			 * 			json Object인경우
			 * 			html: 사용자 이미지 우측에 출력하려는 내용 (화면에서 변수 넘길 시 $.osl.escapeHtml 처리 필수)
			 * 			imgSize: 사용자 이미지 사이즈 (sm, md, lg, xl) - sm 기본
			 * 			class:{
			 * 				cardBtn: 최 상위 요소 class
			 * 				cardPic: 사용자 이미지 상위 요소 class
			 * 				usrImg: 사용자 이미지 class
			 * 				cardDetail: 사용자 이미지 우측 내용 상위 요소 class
			 * 				cardName: 우측 내용 class
			 * 			}
			 * 
			 * 예제)
			 * 	var paramData =	{
			 * 		html: row.usrNm,
			 * 		imgSize: md,
			 * 		class: {
			 * 			cardBtn: "",
			 * 			cardPic: "",
			 * 			usrImg: "",
			 * 			cardDetail: "",
			 * 			cardName: ""
			 * 		}
			 * 	}
			 */
			,usrImgSet: function(paramUsrImgId, paramData){
				var usrImgId = $.osl.user.usrImgUrlVal(paramUsrImgId);
				
				var cardContent = $.osl.escapeHtml(paramData);
				var imgSize = "kt-media--sm";
				
				
				var cardBtn = ""
					, cardPic = ""
					, usrImg = ""
					, cardDetail = ""
					, cardName = "";
				
				
				if(typeof paramData == "object"){
					cardContent = paramData["html"];
					imgSize = "kt-media--"+$.osl.escapeHtml(paramData["imgSize"]);
					
					if(paramData["imgSize"] == "md"){
						imgSize = "";
					}
					
					
					if(paramData.hasOwnProperty("class")){
						cardBtn = $.osl.escapeHtml(paramData["class"]["cardBtn"]);
						cardPic = $.osl.escapeHtml(paramData["class"]["cardPic"]);
						usrImg = $.osl.escapeHtml(paramData["class"]["usrImg"]);
						cardDetail = $.osl.escapeHtml(paramData["class"]["cardDetail"]);
						cardName = $.osl.escapeHtml(paramData["class"]["cardName"]);
					}
				}
				
				var returnStr = 
					'<div class="kt-user-card-v2 btn '+cardBtn+'">'
						+'<div class="kt-user-card-v2__pic kt-media '+imgSize+' kt-media--circle '+cardPic+'">'
							+'<img class=" '+usrImg+'" src="'+usrImgId+'" onerror="this.src=\'/media/users/default.jpg\'"/>'
						+'</div>'
						+'<div class="kt-user-card-v2__details '+cardDetail+'">'
							+'<span class="kt-user-card-v2__name '+cardName+'">'+cardContent+'</span>'
						+'</div>'
					+'</div>';
				
				return returnStr;
			}
			/**
			 *  function 명 	: $.osl.user.usrImgUrlVal
			 *  function 설명	: 사용자 프로필 이미지 Url 세팅
			 * @param paramUsrImgId 사용자 프로필 이미지 ID
			 */
			,usrImgUrlVal: function(paramUsrImgId){
				var usrImgId = '/cmm/fms/getImage.do?fileSn=0&atchFileId='+paramUsrImgId;
				if($.osl.isNull(paramUsrImgId)){
					usrImgId = '/media/users/default.jpg';
				}
				
				return usrImgId;
			}
			/**
			 *  function 명 	: $.osl.user.usrInfoPopup
			 *  function 설명	: 사용자 정보 팝업
			 * @param paramUsrId 사용자 ID
			 */
			,usrInfoPopup: function(paramUsrId){
				var data = {paramUsrId: paramUsrId};
				var options = {
						autoHeight: false,
						modalSize: "lg",
						modalTitle: "사용자 정보",
						keyboard: true,
						closeConfirm: false,
						class:{
							body:"osl-padding-none"
						}
						
					};
				$.osl.layerPopupOpen('/cmm/cmm8000/cmm8000/selectCmm8000View.do',data,options);
			}
			/**
			 *  function 명 	: $.osl.user.passwordValidate
			 *  function 설명	: 사용자가 입력한 비밀번호 유효성 체크
			 *  			  1. 비밀번호에 사용자 아이디 포함되었는지 체크
			 *  			  2. 비밀번호에 같은 문자가 3자 이상 연속해서 사용되었는지 체크
			 *  			  3. 비밀번호에 연속된 문자열(123, abc 등)이 3자 이상 포함되어있는지 체크
			 * @param inUsrId 입력한 사용자 ID
			 * @param inUsrPw 입력한 사용자 비밀번호
			 */
			,passwordValidate: function(inUsrId, inUsrPw){
				
				if($.osl.isNull(inUsrId)){
					$.osl.alert($.osl.lang("common.user.validate.usrId"), {type:"warning"});
					return true;
				}
				
				if($.osl.isNull(inUsrPw)){
					$.osl.alert($.osl.lang("common.user.validate.usrPw"), {type:"warning"});
					return true;
				}
				
				
				if(inUsrPw.indexOf(inUsrId) > -1) {
					$.osl.alert($.osl.lang("common.user.validate.usrPwIndexOfUsrId"), {type:"warning"});
					return true;
				}
				
				
				var repetRegx = /(\w)\1\1/;
				if(repetRegx.test(inUsrPw)) {
					$.osl.alert($.osl.lang("common.user.validate.usrPwContinue"), {type:"warning"});
					return true;
				}
				
				
				var continueMatchNum = 3;
				if(!$.osl.continueStrChk(inUsrPw, continueMatchNum)){
					$.osl.alert($.osl.lang("common.user.validate.usrPwContinueMatch",continueMatchNum), {type:"warning"});
					return true;
				}
				
				return false;
			}
			/**
			 *  function 명 	: $.usrMyPagePopUp
			 *  function 설명	: 사용자 개인정보 수정 팝업을 오픈한다.
			 * @param usrId : 로그인한 사용자 아이디
			 */
			,usrMyPagePopUp:function(usrId){
				
				
				if($.osl.isNull(usrId)){
					$.osl.alert($.osl.lang("common.user.myPage.error"), {type:"error"});
					return false;
				}
				
				var data = {"usrId":usrId};
				var options = {
						idKey: "prs3000",
						modalSize: 'xl',
						modalTitle: $.osl.lang("common.user.myPage.title"),
						closeConfirm: false
					};
				
				$.osl.layerPopupOpen('/usr/usr1000/usr1000/selectUsr1000View.do',data,options);
			}
		}
		/**
		 *  function 명 	: $.osl.goMenu
		 *  function 설명	: 상단 메뉴 클릭시 메뉴페이지 이동
		 * @param menuUrl 메뉴 URL
		 * @param menuId 메뉴 ID
		 * @param menuNm 메뉴명
		 * @param menuTypeCd 메뉴 이동 타입
		 */
		,goMenu: function(menuUrl, menuId, menuNm, menuTypeCd){
			if(menuTypeCd != null && menuTypeCd != "" && menuTypeCd == "03"){
				var popupWidth = window.screen.availWidth;
				var popupHeight = window.screen.availHeight;
				window.open(menuUrl,menuNm ,'width='+popupWidth+', height='+(popupHeight-100)+', menubar=no, status=no, toolbar=no, location=no, scrollbars =yes');
			}else{
				document.hideMoveForm.menuUrl.value = menuUrl;
				document.hideMoveForm.menuId.value = menuId;
				document.hideMoveForm.menuNm.value = menuNm;
				document.hideMoveForm.action= "/cmm/cmm9000/cmm9000/selectCmm9000MenuChgView.do";
				document.hideMoveForm.submit();
			}
		}
		/**
		 * function 명 	: $.osl.goPrjGrp
		 * function 설명	: 프로젝트 그룹 선택 시 페이지 이동
		 * @param prjGrpId 프로젝트 그룹 Id
		 */
		,goPrjGrp: function(prjGrpId){
			document.hideMoveForm.moveType.value = "01";
			document.hideMoveForm.prjGrpId.value = prjGrpId;
			document.hideMoveForm.action= "/cmm/cmm9000/cmm9000/selectCmm9000PageChgView.do";
			document.hideMoveForm.submit();
		}
		/**
		 * function 명 	: $.osl.goPrj
		 * function 설명	: 프로젝트 선택 시 페이지 이동
		 * @param prjGrpId 프로젝트 그룹 Id
		 * @param prjId 프로젝트 Id
		 */
		,goPrj: function(prjGrpId, prjId){
			document.hideMoveForm.moveType.value = "02";
			document.hideMoveForm.prjGrpId.value = prjGrpId;
			document.hideMoveForm.prjId.value = prjId;
			document.hideMoveForm.action= "/cmm/cmm9000/cmm9000/selectCmm9000PageChgView.do";
			document.hideMoveForm.submit();
		}
		/**
		 * function 명 	: $.osl.goAuthGrp
		 * function 설명	: 권한그룹 선택 시 페이지 이동
		 * @param prjGrpId 프로젝트 그룹 Id
		 * @param prjId 프로젝트 Id
		 * @param authGrpId 권한 그룹 Id
		 */
		,goAuthGrp: function(prjGrpId, prjId, authGrpId){
			document.hideMoveForm.moveType.value = "03";
			document.hideMoveForm.prjGrpId.value = prjGrpId;
			document.hideMoveForm.prjId.value = prjId;
			document.hideMoveForm.authGrpId.value = authGrpId;
			document.hideMoveForm.action= "/cmm/cmm9000/cmm9000/selectCmm9000PageChgView.do";
			document.hideMoveForm.submit();
		}
	};
	
	/* osl 추가 메소드 */
	/**
	 *  function 명 	: $.osl.ajaxRequestAction
	 *  function 설명	: AJAX 통신 공통 처리
	 * - ajax통신 옵션은 property에서 배열로 처리
	 * - 로딩 바 기본(통신 완료 퍼센트)
	 * - AJAX통신 중 Background처리가 있는 경우 무조건 async = true(동기) 처리  예) 메일 전송 AJAX
	 * property 옵션
	 * - url
	 * - dataType
	 * - contentType
	 * - async
	 * - cache
	 * - processData
	 * data는 setData로 따로 설정 가능
	 * 예제)
	 * 1. 객체 선언과 동시에 옵션 세팅
	 * var ajaxObj = new $.osl.ajaxRequestAction({
			"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
			,"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
			,"datatype":"json"
			,"async":false
			,"cache":true
			,"processData":true
			});
	 * 
	 * 2. 객체 선언과 이후 옵션 세팅
	 * 
	 * var ajaxObj = new $.osl.ajaxRequestAction({
			"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
			});
		ajaxObj.setProperty({
			"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
			,"datatype":"json"
			,"async":false
			,"cache":true
			,"processData":true
		});
	 * 
	 * 3. data 설정
	 * ajaxObj.setData({"prjId" : prjId, "reqId" : reqId, "reqCmnt" : reqCmnt});
	 * var ajaxObj = new $.osl.ajaxRequestAction({
			"url":"<c:url value='/req/req2000/req2000/insertReq2000ReqCommentInfoAjax.do'/>"
			,"contentType":"application/x-www-form-urlencoded; charset=UTF-8"
			,"datatype":"json"
			,"async":false
			,"cache":true
			,"processData":true}
			,{"prjId" : prjId, "reqId" : reqId, "reqCmnt" : reqCmnt});
	 * 3-1. 객체 선언과 동시에 data 설정
	 * 
	 * 4. AJAX 성공처리 함수 설정
	 * 
		ajaxObj.setFnSuccess(function(data){
	    	
	    	if(data.saveYN == 'N'){
	    		$.osl.toastr(data.message);
	    		return;
	    	}
	    	
	    	gfnSetData2CommentsArea(data.reqCommentList, "reqCmntListDiv", "BRD");
	    	
	    	$("#reqCmnt").val("");
	    	$.osl.toastr(data.message);
		});
	 * 
	 * 5. AJAX 에러처리 함수 설정
	 * ajaxObj.fnError(function(xhr, status, err){
	 	
	 	});
	 * 
	 * 6. AJAX 통신 준비, 통신 완료처리 4번과 동일
	 * 
	 * 7. AJAX 통신 시작
	 * ajaxObj.send();
	 * 
	 * 		- 그 외 커스텀 추가 시 내용 삽입 - 
	 * 2016-09-13			최초 작성			진주영
	 * 2016-09-19			수정				진주영
	 */
	$.osl.ajaxRequestAction = function(property,data){
		
		this.url = this.data = this.mimeType = "";
		
		
		this.dataType ="json";
		
		
		this.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
		
		
		this.async = true;
		
		
		this.cache = "true";
		
		
		this.processData = "true";
		
		
		this.loadingShow = true;
		
		
		
		this.fnSuccess = this.fnbeforeSend = this.fnComplete = this.fnError = $.noop;

		
		this.setData = function setData(data){
			this.data = data;
		}
		this.setFnSuccess = function setFnSuccess(fnContent){
			this.fnSuccess = fnContent;
		}
		this.setFnBeforeSend = function setFnbeforeSend(fnContent){
			this.fnbeforeSend = fnContent;
		}
		this.setFnComplete = function setFnComplete(fnContent){
			this.fnComplete = fnContent;
		}
		this.setFnError = function setFnError(fnContent){
			this.fnError = fnContent;
		}

		
		this.setProperty = function setProperty(prop){
			if(!$.osl.isNull(prop)){
				this.url = $.osl.isNull(prop['url'])?this.url:prop['url'];
				this.dataType = $.osl.isNull(prop['dataType'])?this.dataType:prop['dataType'];
				this.contentType = $.osl.isNull(prop['contentType'])?this.contentType:prop['contentType'];
				this.async = $.osl.isNull(prop['async'])?this.async:prop['async'];
				this.cache = $.osl.isNull(prop['cache'])?this.cache:prop['cache'];
				this.processData = $.osl.isNull(prop['processData'])?this.processData:prop['processData'];
				this.mimeType = $.osl.isNull(prop['mimeType'])?this.mimeType:prop['mimeType'];
				this.loadingShow = $.osl.isNull(prop['loadingShow'])?true:prop['loadingShow'];
			}
		}

		
		if(!$.osl.isNull(property)){
			eval(this.setProperty(property));
		}
		if(!$.osl.isNull(data)){
			eval(this.setData(data));
		}
		
		this.send = function send(){
			
			var obj = this;

			
			var tmp_loadingShow = this.loadingShow;
			
			try{
				
				$.ajax({
			        type: "POST",
			        url: this.url,
			        data: this.data,
			        contentType: this.contentType,
			        async: this.async,
			        cache: this.cache,
			        processData: this.processData,
			        mimeType: this.mimeType,
			        beforeSend: function(){
			        	if(tmp_loadingShow){
			        		
			        		$.osl.showLoadingBar(true);
			        	}
			    		
			    		obj.fnbeforeSend();
			        },
			        success: function(data, status, xhr) {
			        	xhr:window.XMLHttpRequest ? 
						function() { return new window.XMLHttpRequest(); } : 
						function() { 
						    try { return new window.ActiveXObject("Microsoft.XMLHTTP"); } 
						    catch(e) {} 
						}
			        	try{
			        		obj.fnSuccess(data, status, xhr);
			        	}catch(e){
			        		console.log(e);
			        		console.log("success error: "+e);
			        		return;
			        	}
			        },
			        error: function(xhr, status, err){
			        	
			        	if(xhr.status == '999'){
			        		$.osl.alert($.osl.lang("common.alert.title"),$.osl.lang("common.error.sessionInvalid"),"error",
			        				function(){
					        			document.location.href="/cmm/cmm4000/cmm4000/selectCmm4000View.do";
					        		}
			        		);
			        		
				    		 setTimeout(function(){
				    			 document.location.href="/cmm/cmm4000/cmm4000/selectCmm4000View.do"
				    		 },3000);
			        		return;
			        	}else if(xhr.status == '998'){
			        		$.osl.alert($.osl.lang("common.alert.title"),$.osl.lang("common.error.nonAuth"),"error");
			        		if(tmp_loadingShow){
			        			$.osl.showLoadingBar(false);
			        		}
			        		return;
			        	}else{
			        		
			        		obj.fnError(xhr, status, err);
			        		if(tmp_loadingShow){
			        			$.osl.showLoadingBar(false);
			        		}
			        		return;
			        	}
			        },
			        complete: function(){
			        	if(tmp_loadingShow){
			        		$.osl.showLoadingBar(false);
			        	}
			        	obj.fnComplete();
			        }
			    });
			}catch(exception){
				if(tmp_loadingShow){
					$.osl.showLoadingBar(false);
				}
				console.log(exception);
			}
		}
	};
	
	/**
	 *  function 명 	: $.osl.showLoadingBar
	 *  function 설명	: loading 바를 show/hide 한다.
	 * @param isShow: 로딩바호출 : true , 로딩바숨김 : false
	 * @param config{
	 * 			opacity			: 배경 투명도
	 * 			overlayColor	: 배경 색상
	 * 			type			: v2 (고정)
	 * 			state			: 로딩바 이미지 색상 [brand, metal, light, dark, accent, focus, primary, success, info, waning, danger]
	 * 			message			: 로딩 출력 문구
	 * 			target			: 로딩바 표현 대상 (기본값 = 'page')
	 */
	$.osl.showLoadingBar = function(isShow, paramConfig){
		var defaultConfig = {
				opacity: 0.05,
                overlayColor: '#000000',
                type: 'v2',
                state: 'success',
                message: 'Loading...'
            };
		
		var config = $.extend(defaultConfig, paramConfig);
		
		
		if(!$.osl.isNull(paramConfig) && paramConfig.hasOwnProperty("target") && paramConfig["target"] != "page"){
			
			var targetObj = $(paramConfig["target"]);
			
			
			if(targetObj.length == 0){
				if(isShow){
					KTApp.blockPage(config);
				}else{
					setTimeout(function(){
						KTApp.unblockPage();
					},300);
				}
			}else{
				if(isShow){
					KTApp.block(paramConfig["target"], config);
				}else{
					setTimeout(function(){
						KTApp.unblock(paramConfig["target"]);
					},300);
				}
			}
		}else{ 
			if(isShow){
				KTApp.blockPage(config);
			}else{
				setTimeout(function(){
					KTApp.unblockPage();
				},300);
			}
		}
	};
	
	/**
	 *  function 명 	: $.osl.isNull
	 *  function 설명	:  널 체크
	 * @param sValue
	 * @returns {Boolean}
	 */
	$.osl.isNull = function(sValue)
	{
		if( typeof sValue == "undefined") {
	        return true;
	    }
	    if( String(sValue).valueOf() == "undefined") {
	        return true;
	    }
	    if( sValue == null ){
	        return true;
	    }
	    if( ("x"+sValue == "xNaN") && ( new String(sValue.length).valueOf() == "undefined" ) ){
	        return true;
	    }
	    if( sValue.length == 0 ){
	        return true;
	    }
	    if( sValue == "NaN"){
	        return true;
	    }
	    return false;
	};
	
	/**
	 *  function 명 	: $.osl.escapeHtml
	 *  function 설명	: &<>'" 문자 치환
	 * @param sValue
	 * @returns {Replace String}
	 */
	$.osl.escapeHtml = function(sValue){
		
		if(typeof sValue == "number"){
			return sValue;
		}
		try{
			return sValue ? sValue.replace( /[&<>'"]/g,
				function (c, offset, str) {
					if (c === "&") {
						var substr = str.substring(offset, offset + 6);
						if (/&(amp|lt|gt|apos|quot);/.test(substr)) {
							return c;
						}
					}
					return "&" + {
						"&": "amp",
						"<": "lt",
						">": "gt",
						"'": "apos",
						'"': "quot"
					}[c] + ";";
				}
			) : "";
		}catch(error){
			return "";
		}
	};
	
	/**
	 *  function 명 	: $.osl.unEscapeHtml
	 *  function 설명	: (&amp;)|(&lt;)|(&gt;)|(&apos;)|(&quot;)문자 치환 => &<>'" 
	 * @param sValue
	 * @returns {Replace String}
	 */
	$.osl.unEscapeHtml = function(sValue){
		
		if(typeof sValue == "number"){
			return sValue;
		}
		try{
			return sValue ? sValue.replace( /(&amp;)|(&lt;)|(&gt;)|(&apos;)|(&quot;)]/g,
				function (c, offset, str) {
					return {
						"&amp;": "&",
						"&lt;": "<",
						"&gt;": ">",
						"&apos;": "\"",
						'&quot;': "\'"
					}[c];
				}
			) : "";
		}catch(error){
			return "";
		}
	};

	/**
	 *  function 명 	: $.osl.toastr
	 *  function 설명	: toast 창을 팝업 한다.
	 * @param msg: 내용
	 * @param agument - typeof string: 제목
	 * @param agument - typeof object: 
	 * 					{
	 * 						title: String					
	 *  					,type: ['error', 'warning', 'info', 'success'] (default - success)
	 * 					}
	 * 
	 * ex) 단순 내용, 타이틀 toast
	 * $.osl.toastr("message","title");
	 * 
	 * ex) 타입 지정 toast
	 * $.osl.toastr("message",{"title":"title", "type":"warning"});
	 */
	$.osl.toastr = function(msg, agument){
		
		var type = "success";
		
		var title = "";
		
		
		if(!$.osl.isNull(agument) && typeof agument == "string"){
			
			title = agument;
		}
		else if(!$.osl.isNull(agument) && typeof agument == "object"){
			
			
			if(agument.hasOwnProperty("title")){
				title = agument.title;
			}
		}
		
		
		if(typeof agument == "object" && agument.hasOwnProperty("type")){
			type = agument.type;
		}
		
		switch(type){
			case "info":
				toastr.info(msg, title);
			break;
			case "error":
				toastr.error(msg, title);
			break;
			case "warning":
				toastr.warning(msg, title);
			break;
			case "success":
				toastr.success(msg, title);
			break;
		}
	};
	
	/**
	 *  function 명 	: $.osl.alert
	 *  function 설명	: alert 창을 팝업 한다. (window.alert)
	 * @param title			alert 제목
	 * @param options		alert 옵션
	 * 			text		alert 내용
	 * 			type		경고창 type [error, warning, info, success, question]
	 * 			position	[top, bottom, center, top-right, top-left, bottom-right, bottom-left]
	 * 			showConfirmButton	경고 창 버튼 유무 (defatul-false)
	 * 			timer		자동 close 시간
	 * @param callbackFn	alert ok 버튼 클릭 시 발생하는 이벤트
	 */
	$.osl.alert = function(title, options, callbackFn){
		var defaultConfig = {
			title: title,
			type: 'info',
			position: 'center',
            showConfirmButton: true,
            timer: 0,
            confirmButtonText: $.osl.lang("common.alert.ok"),
            confirmButtonAriaLabel: $.osl.lang("common.alert.ok"),
            cancelButtonText:$.osl.lang("common.alert.cancel"),
            cancelButtonAriaLabel: $.osl.lang("common.alert.cancel")
		};
		
		
		options = $.extend(true, defaultConfig, options);
		
		swal.fire(options).then(function(result){
			if(typeof callbackFn == "function"){
				callbackFn(result);
			}
		});;
	};
	
	/**
	 *  function 명 	: $.osl.confirm
	 *  function 설명	: 버튼이 있는 alert 창을 팝업한다. (window.confirm)
	 * @param msg			alert 내용
	 * @param optoins		alert 옵션
	 * 						-title					팝업 제목
	 * 						-confirmButtonText		팝업 ok 버튼 문구
	 * 						-type					경고창 type ['error', 'warning', 'info', 'success', 'question'] (default - warning)
	 * @param callbackFn	
	 */
	$.osl.confirm = function(msg,options,callbackFn){
		
		if($.osl.isNull(msg)){
			msg = "";
		}
		
		
		var defaultValue = {
				"title": $.osl.lang("common.alert.title")
				,"confirmButtonText": $.osl.lang("common.alert.ok")
				,"cancelButtonText": $.osl.lang("common.alert.cancel")
				,"showCancelButton": true
				,"allowOutsideClick": false
				,"text": msg
				,"type": 'warning'
		}
		
		
		if(!$.osl.isNull(options)){
			$.extend(defaultValue, options, defaultValue);
		}

		
		if(options != null && options.hasOwnProperty("html")){
			if(options.html === true){
				defaultValue["html"] = msg;
			}
		}
		
		
		swal.fire(defaultValue).then(function(result) {
			if(typeof callbackFn == "function"){
				callbackFn(result);
			}
	    });
	};
	
	/**
	 *  function 명 	: $.osl.validate
	 *  function 설명	: 폼값 유효성 체크 validate rules, messages 자동 세팅
	 * @param formId	: 대상 form Id
	 * 속성에 유효성 조건 선언
	 * 
	 * @attribute
	 * 		required	: 필수(싱글 선언 또는 true,required)
	 * 		minlength	: 입력 글자 수 최소값
	 * 		maxlength	: 입력 글자 수 최대값
	 * 		regexstr	: 정규식 체크
	 * 		regexalert	: 정규식 조건에 맞지 않는 경우 포함하는 문구 "영문,숫자 필수 포함, $@$!%*#?&"
	 * 		equalTo		: 동일한 값 체크 #element_id 형식으로 입력 (ex. #in_usrPw)
	 * 
	 * ex)
	 *  <input type="text" class="form-control" id="in_usrId" name="in_usrId" placeholder="(20자 까지 입력 가능)" minlength="3" maxlength="20" regexstr="^[a-z0-9_-]{5,20}$" regexalert="영문, 숫자, _-" required>
	 *  
	 *  @return validate 객체 반환 ( 반환 이후 페이지에서 .valid() 사용
	 */
	$.osl.validate = function(formId){
		var formTarget = $("#"+formId);
		
		
		var formInElem = formTarget.find("input,select,textarea");

		
		var rules = {};
		
		
		var messages = $.osl.lang("fromValidate.messages");
		
		
		$.each(formInElem,function(idx, map){
			
			
			var targetId = map.id;
			
			
			var $elemInfo = $(map);
			
			
			var labelText = $elemInfo.siblings("label").text();
			
			
			if($.osl.isNull(labelText)){
				labelText = $elemInfo.attr("label");
				
				
				if($.osl.isNull(labelText)){
					labelText = targetId;
				}else{
					labelText = labelText.toString();
				}
			}
			
			
			if($elemInfo.attr("type") != "hidden"){
				
				if($.osl.isNull(rules[targetId])){
					rules[targetId] = {};
				}
				if($.osl.isNull(messages[targetId])){
					messages[targetId] = {};
				}
			}
			
			
			$.each(messages, function(messageId, messageStr){
				if(!$.osl.isNull($elemInfo.attr(messageId))){
					var ruleVal = $elemInfo.attr(messageId);
					if($.osl.isNull(ruleVal)){
						return true;
					}
					
					if(ruleVal == "required"){
						ruleVal = true;
					}
					
					if(messageId == "regexstr"){
						
						var regexstr = $elemInfo.attr("regexstr");
						var regexErrorStr = $elemInfo.attr("regexerrorstr");
						
						
						var ruleJson = {regex: new RegExp(regexstr)};
						$.extend(rules[targetId],ruleJson);
						
						
						if(!$.osl.isNull(regexErrorStr)){
							regexErrorStr = "&nbsp; ("+regexErrorStr+")";
						}else{
							regexErrorStr = "";
						}
						
						
						var regexalertStr = "입력 값이 형식에 맞지 않습니다."+regexErrorStr;
						var regexalert = $elemInfo.attr("regexalert");
						
						
						if(!$.osl.isNull(regexalert)){
							regexalertStr = regexalertStr + "("+regexalert+")";
						}
						
						
						var msgJson = {regex: function(paramRegex,paramElem){
							return regexalertStr;
						}};
						$.extend(messages[targetId],msgJson);
					}else{
						
						var ruleJson = {};
						ruleJson[messageId] = ruleVal;
						$.extend(rules[targetId],ruleJson);
						
						
						var msgJson = {};
						msgJson[messageId] = messageStr;
						$.extend(messages[targetId],msgJson);
					}
				}
			});
			/*
			
			if(!$.osl.isNull($elemInfo.attr("multipleValid"))){
				var targetValue = $elemInfo.val();
			}
			*/
		});
		
		var v = formTarget.validate({
			
			ignore: ":hidden:not(.summernote), .note-editable",
			rules : rules,
			messages : messages,
			invalidHandler: function (form, validator) {
	            var errors = validator.numberOfInvalids();
	            if (errors) {
	                
	                validator.errorList[0].element.focus();
	            }
	        },
	        submitHandler: function (frm){
                return false;
            },
		});
		
		return v;
	};
	
	/**
	 * Date Format Function
	 * @param f
	 * @param type = null or true
	 * 		UTC로 저장된 컬럼인 경우 null
	 * 		그 외 지역 시간으로 저장된 컬럼인 경우 true
	 * @returns
	 */
	
	Date.prototype.format = function(f,type) {
	    if (!this.valueOf()) return " ";
	    if($.osl.isNull(type)){type = true;}
	 
	    var weekName = $.osl.lang("date.datepicker.days");
	    var d = this;

	    
	    var gmtOffset = new Date().getTimezoneOffset();
	    
	    
	    
	    if(!$.osl.isNull(type) && type == 'UTC' && !$.osl.isNull(gmtOffset)){
		    
		    d.setMinutes(d.getMinutes()+(gmtOffset));
	    }
	    
	    else if($.osl.isNull(type) && type != true && !$.osl.isNull(gmtOffset)){
		    
		    d.setMinutes(d.getMinutes()-(gmtOffset));
	    }

	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|ms|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "ms": return d.getMilliseconds().zf(3);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};
	String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
	String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
	Number.prototype.zf = function(len){return this.toString().zf(len);};
	
	/**
	 * function 명 	: $.osl.showLoading 
	 * function 설명	: Ajax로 트랜잭션시 사용할 loading 바를 show/hide 한다.
	 * @param isShow: 로딩바호출 : true , 로딩바숨김 : false
	 * @param data{
	 * 			targetObj: 대상 $ : body (default)
	 * 	
	 */
	$.osl.showLoading = function(isShow,data){
		
		var $targetObj = $("body");
		var message = "";
		var background = "rgba(0, 0, 0, 0.21)";
		var custom = null;
		
		if(!$.osl.isNull(data)){
			
			if(data.hasOwnProperty("target") && !$.osl.isNull(data.target)){
				$targetObj = $(data.target);
			}
			
			
			if(data.hasOwnProperty("message") && !$.osl.isNull(data.message)){
				message = data.message;
			}	
			
			
			if(data.hasOwnProperty("background") && !$.osl.isNull(data.background)){
				background = data.background;
			}	
			
			
			if(data.hasOwnProperty("custom") && !$.osl.isNull(data.custom)){
				custom = data.custom;
			}	
		}
		
		if(!isShow && !$("body").hasClass("busy-load-active")){
			$(".busy-load-active").busyLoad("hide");
		}
		else if(isShow){
			$targetObj.busyLoad("show", {
				custom:custom,
				image: "/media/etc/loading.gif",
				text: message,
				textPosition:"bottom",
				maxSize:"100px",
				minSize:"60px",
				containerClass:"loading-fixed",
				background:background
			});
		}
		else{
			
			$targetObj.busyLoad("hide");
		}
	};
	
	/**
	 *  function 명 	: $.osl.byteCalc
	 *  function 설명	: byte 용량을 받아서 형 변환 후 리턴해주는 함수
	 * @param bytes
	 * @returns {String} 변환 값
	 */
	$.osl.byteCalc = function(bytes){
		if(bytes < 0){
			return 0+" bytes";
		}
	    var bytes = parseInt(bytes);
	    var s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
	    var e = Math.floor(Math.log(bytes)/Math.log(1024));
	   
	    if(e == "-Infinity") return "0 "+s[0]; 
	    else 
	    return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
	};
	
	/**
	 * 	function 명 	: $.osl.layerPopupOpen
	 *  function 설명	: 레이어 팝업을 호출한다.
	 * @param url		: 모달창 내용 ajax url
	 * @param data		: 모달창 ajax에 전달할 data
	 * @param opt		: 모달창 옵션
	 * @opt
	 * 			modalSize		: 모달 창 크기 [xl, lg, md, sm]
	 * 			backdrop		: 모달 창 영역 외에 클릭으로 모달 창 닫기 여부 [true - default(static), false]
	 * 			keyboard		: 키보드 ESC 버튼으로 모달 창 닫기 여부
	 * 			showLoading		: 모달 창 오픈시 로딩화면 여부
	 * 			closeConfirm	: 모달 창 닫기 클릭 했을때 닫을건지 경고창 여부
	 * 			idKeyDuple		: 같은 모달 창 중복 팝업 여부 (권장 하지 않음, 변수 중복 문제 등)
	 * 			idKey			: 모달 창을 오픈한 객체(같은 모달 중복 팝업 방지) 
	 * 			focus			: open modal auto focusing
	 * 			class			: header, body, footer에 추가 class 선언
	 */
	$.osl.layerPopupOpen = function(url, data, opt){
		
		return modal_popup(url, data, opt);
	};
	
	/**
	 * 	function 명 	: $.osl.layerPopupClose
	 *  function 설명	: 최상위 레이어 팝업을 닫는다.
	 */
	$.osl.layerPopupClose = function(){
		
		modalCloseFlag = true;
		$("button.close:eq(0)").click();
	};

	
	/**
	 * 	function 명 	: $.favoritesEdit
	 *  function 설명	: 즐겨찾기 아이콘 클릭 시 발생 이벤트
	 */
	$.osl.favoritesEdit = function(e, thisObj){
		
		e.preventDefault();
		
		e.stopPropagation();
		
		
		var fvrId = $(thisObj).data("fvr-id");
		var fvrType = $(thisObj).data("fvr-type");
		var fvrNm = $(thisObj).siblings("span").text();
		var fvrData1 = $(thisObj).data("fvr-data1");
		var fvrData2 = $(thisObj).data("fvr-data2");
		var fvrData3 = $(thisObj).data("fvr-data3");
		var fvrData4 = $(thisObj).data("fvr-data4");
		var fvrData5 = $(thisObj).data("fvr-data5");
		var fvrData6 = $(thisObj).data("fvr-data6");
		
		
		var activeFlag = $(thisObj).hasClass("osl-favorites--active");
		
		
		var fvrUseCd = "01";
		
		
		if(activeFlag){
			$(thisObj).removeClass("osl-favorites--active");
			fvrUseCd = "02";
		}else{
			$(thisObj).addClass("osl-favorites--active");
		}
		
		var paramData = {
				fvrId: fvrId
				,fvrType: fvrType
				,fvrUseCd: fvrUseCd
				,fvrData1: fvrData1
				,fvrData2: fvrData2
				,fvrData3: fvrData3
				,fvrData4: fvrData4
				,fvrData5: fvrData5
				,fvrData6: fvrData6
		};
		
		
		var ajaxObj = new $.osl.ajaxRequestAction(
				{"url":"/cmm/cmm9000/cmm9000/saveCmm9000FavoriteInfo.do", "loadingShow":true}
				,paramData);
		
		
		ajaxObj.setFnSuccess(function(data){
			
        	if( data.errorYn == "N" ){
        		var fvrId = data.fvrId;
        		
        		$(thisObj).attr("data-fvr-id",fvrId);
        		
        		
        		
        		if(activeFlag){
        			
        			$("ul[id=fvrListType"+fvrType+"] li.kt-menu__item i[data-fvr-id="+fvrId+"]").parent("a").parent("li").remove();
        			$(".osl-favorites--active[data-fvr-id="+fvrId+"]").removeClass("osl-favorites--active");
        		}else{
        			
        			var fvrTitleStr = "";
        			
        			
        			var fvrTargetEvt = '';
        			
        			
        			if(fvrType == "01"){
    					fvrTitleStr = 
    						'<div class="kt-align-left">'
    							+'<i class="fa fa-layer-group"></i>&nbsp;'
    							+$.osl.lang("common.menu.top")+' : '
        						+$.osl.escapeHtml(fvrData4)+'</br>'
        						+'<i class="fa fa-layer-group"></i>&nbsp;'
        						+$.osl.lang("common.menu.upper")+'　 : '
        						+$.osl.escapeHtml(fvrData5)+'</br>'
        						+'<i class="fa fa-layer-group"></i>&nbsp;'
        						+$.osl.lang("common.menu.name")+' : '
        						+$.osl.escapeHtml(fvrNm)
    						'/<div>';
    					fvrTargetEvt = '$.osl.goMenu(\''+$.osl.escapeHtml(fvrData2)+'\', \''+$.osl.escapeHtml(fvrData1)+'\', \''+$.osl.escapeHtml(fvrNm)+'\', \''+$.osl.escapeHtml(fvrData3)+'\' )';
    				}
    				else if(fvrType == "02"){
    					fvrTitleStr = 
    						'<div class="kt-align-left">'
        						+$.osl.escapeHtml(fvrNm)
    						'/<div>';
    					fvrTargetEvt = '$.osl.goPrjGrp(\''+fvrData1+'\')';
    				}
    				else if(fvrType == "03"){
    					fvrTitleStr = 
    						'<div class="kt-align-left">'
    							+'<i class="fa fa-layer-group"></i>&nbsp;'
    							+$.osl.lang("common.name.prjGrp")+': '
        						+$.osl.escapeHtml(fvrData3)+'</br>'
        						+'<i class="fa fa-layer-group"></i>&nbsp;'
        						+$.osl.lang("common.name.prj")+': '
        						+$.osl.escapeHtml(fvrNm)+'</br>'
    						'/<div>';
    					fvrTargetEvt = '$.osl.goPrj(\''+fvrData1+'\',\''+fvrData2+'\')';
    				}
    				else if(fvrType == "04"){
    					fvrTitleStr = 
    						'<div class="kt-align-left">'
    							+'<i class="fa fa-layer-group"></i>&nbsp;'
    							+$.osl.lang("common.name.prjGrp")+': '
        						+$.osl.escapeHtml(fvrData4)+'</br>'
        						+'<i class="fa fa-layer-group"></i>&nbsp;'
        						+$.osl.lang("common.name.prj")+': '
        						+$.osl.escapeHtml(fvrData5)+'</br>'
        						+'<i class="fa fa-layer-group"></i>&nbsp;'
        						+$.osl.lang("common.name.authGrp")+': '
        						+$.osl.escapeHtml(fvrNm)
    						'/<div>';
    					fvrTargetEvt = '$.osl.goAuthGrp(\''+fvrData1+'\',\''+fvrData2+'\',\''+fvrData3+'\')';
    				}
        			
        			var $fvrElem =
    					$('<li class="kt-menu__item " aria-haspopup="true" data-toggle="kt-tooltip" data-html="true" data-placement="top" data-skin="brand" title="'+$.osl.escapeHtml(fvrTitleStr)+'">'
    					+'	<a href="javascript:'+fvrTargetEvt+'" class="osl-favorites__item kt-menu__link fvrHoverInfo">'
    					+'		<i class="kt-menu__link-icon flaticon-star osl-favorites--active" data-fvr-id="'+fvrId+'" data-fvr-data1="'+$.osl.escapeHtml(fvrData1)+'"data-fvr-data2="'+$.osl.escapeHtml(fvrData2)+'"data-fvr-data3="'+$.osl.escapeHtml(fvrData3)+'" data-fvr-data4="'+$.osl.escapeHtml(fvrData4)+'" data-fvr-data5="'+$.osl.escapeHtml(fvrData5)+'" data-fvr-data6="'+$.osl.escapeHtml(fvrData6)+'" data-fvr-type="'+fvrType+'" onclick="$.osl.favoritesEdit(event,this)"></i>'
    					+'		<span class="kt-menu__link-text">'+$.osl.escapeHtml(fvrNm)+'</span>'
    					+'	</a>' 
    					+'</li>');
            		
    				$("#fvrListType"+fvrType).append($fvrElem);
    				
    				
        			KTApp.initTooltips();
        		}
        		
        	}else{
        		$.osl.toastr(data.message);
        	}
		});
		
		
		ajaxObj.send();
	};
	
	
	/**
	 * function명 	: $.osl.getMulticommonCodeDataForm [조회 조건 select Box 용]
	 * function설명	: 트랜잭션을 여러번 날리는게 아닌 단일 트랜잭션으로 콤보 코드를 가지고 오는 용도로 사용, 콤보용 공통 코드 및 공통코드명 가져올때 사용
	 * 				  공통코드 테이블을 참조하여 콤보데이터를 가지고 온다.
	 * 				  Ex>
	 * 					  1. json data 세팅
	 *	 						mstCd: 공통코드 마스터 코드
	 *	 						useYn: 사용구분 저장(Y: 사용중인 코드만, N: 비사용중인 코드만, 그 외: 전체)
	 *	 						comboType: 공통코드 가져와 적용할 콤보타입 객체 배열 ( S:선택, A:전체(코드값 A 세팅한 조회조건용), N:전체, E:공백추가, OS:select 객체에 OS="" 값 설정할경우 값 적용,그 외:없음 )
	 *	 						targetObj: 공통코드 적용할 select 객체 ID(*)
	 * 					  2. 대분류 코드를 세팅할 selectBox 객체를 배열로 대분류 코드 순서와 일치하게 세팅하여 보낸다.
	 * 					  3. 사용여부가 사용인지, 미사용인지 아니면 전체를 다 가지고 올지를 판단. (N: 사용하지 않는 것만, Y: 사용하는 것만, 그외: 전체)
	 *            		  4. 콤보타입을 전체, 선택, 일반 바로 선택 가능한 상태에 대한 조건을 순서대로 배열로 보낸다. ["S", "A", "E", "JSON",""] S: 선택, A: 전체, E:공백추가 OS:선택 값 selected , JSON:반환 데이터를 json으로 리턴 , 그 외: 없음  
	 *            			OS: 해당 select attr에 OS="01" 등과 같이 입력 -> option elements 생성 후 해당 value의 option을 selected한다.
	 *            			JSON: 반환 데이터를 기타 사용 할 수 있도록 JSON OBJECT로 제공 
	 *                    5. input box data-osl-value="" 지정 후 값 넣는 경우 해당 option selected
	 * @param commonCodeArr		:	공통코드 조회 필요 데이터
	 * var commonCodeArr = [
			{mstCd: "ADM00003",useYn: "Y",targetObj: "#in_usrPositionCd"},
			{mstCd: "ADM00004",useYn: "Y",targetObj: "#in_usrDutyCd"},
			{mstCd: "CMM00001",useYn: "Y",targetObj: "#in_asideShowCd"},
			{mstCd: "CMM00001",useYn: "Y",targetObj: "#in_useCd"}
		]
		$.osl.getMulticommonCodeDataForm(commonCodeArr , true);
	 * @param isAsyncMode	:	동기, 비동기 모드( true: 비동기식 모드, false: 동기식 모드 )
	 */
	
	$.osl.getMulticommonCodeDataForm = function(commonCodeArr , isAsyncMode){
		
		var ajaxObj = new $.osl.ajaxRequestAction(
				{"url":"/stm/stm4000/stm4000/selectStm4000MultiCommonCodeList.do"
					,"async":isAsyncMode,"loadingShow":false}
				,{commonCodeArr: JSON.stringify(commonCodeArr)});
		
		ajaxObj.setFnSuccess(function(data){
	    	if(data.ERROR_CODE == '-1'){
	    		$.osl.toastr(data.ERROR_MSG);
				return;
			}
	    	
	    	
	    	var commonCodeList = data.commonCodeList;
	    	
	    	
	    	$.each(commonCodeArr ,function(idx, map){
	    		
	    		var subList = commonCodeList[map.targetObj];
	    		
	    		
	    		var comboType = map.comboType;
	    		
	    		
	    		var $targetObject = $(map.targetObj);
	    		
	    		
	    		$targetObject.empty();
	    		
	    		
	    		if($targetObject == null || $.osl.isNull(subList)){
	    			return true;
	    		}
	    		
	    		if(comboType == 'A'){
					
	    			$targetObject.append("<option value='A'>"+$.osl.lang("common.name.all")+"</option>");
	    			
					
		    		$.each(subList, function(idx2, subMap){
		    			$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"'>" + subMap.subCdNm + "</option>");
		    		});
				}
	    		else if(comboType == 'N'){
	    			
	    			$targetObject.append("<option value=''>"+$.osl.lang("common.name.all")+"</option>");
	    			
	    			
		    		$.each(subList, function(idx2, subMap){
		    			$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"'>" + subMap.subCdNm + "</option>");
		    		});
				}
	    		else if(comboType == 'S'){
	    			
	    			$targetObject.append("<option value=''>"+$.osl.lang("common.name.select")+"</option>");
	    			
	    			
		    		$.each(subList, function(idx2, subMap){
		    			$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"'>" + subMap.subCdNm + "</option>");
		    		});
				}
	    		else if(comboType == 'E'){
	    			
	    			$targetObject.append("<option value=''></option>");
	    			
	    			
		    		$.each(subList, function(idx2, subMap){
		    			$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"'>" + subMap.subCdNm + "</option>");
		    		});
				}
				else{
					
					$.each(subList, function(idx2, subMap){
		    			$targetObject.append("<option value='" + subMap.subCd + "' data-sub-cd-ref1='"+subMap.subCdRef1+"' data-sub-cd-ref2='"+subMap.subCdRef2+"'>" + subMap.subCdNm + "</option>");
		    		});
				}
	    		
				var selVal = $targetObject.data("osl-value");
				
				
				if(!$.osl.isNull(selVal)){
					var $seledObj = $targetObject.children('option[value='+selVal+']');
					
					if($seledObj.length > 0){
						$seledObj.attr('selected','selected');
					}
				}
	    	});
		});
		
		
		ajaxObj.send();
	}
	
	/**
	 * function 명 	: $.osl.setDataFormElem
	 * function 설명	: json데이터로 온 객체(Json 형식 단건 list 아님)를 키와 FORM 안의 ID값을 찾아
	 * 				  자동으로 데이터를 세팅하는 메서드.
	 * 				  부모 obj 안에 포함되어 있는 폼엘레먼트들도 type을 체크하여 라디오 버튼을 제외하고는 밸류를 세팅한다.
	 * @param json 	: json info(단건)
	 * @param formId : Form ID
	 * @param matchKey (ArrayList) : 해당하는 Key값만 매치해서 값을 세팅한다.
	 * 
	 * 사용 예) $.osl.setDataFormElem($.osl.user.userInfo,"frReq1001", ["usrNm","email","telno","deptName","deptId"])
	 */
	$.osl.setDataFormElem = function(jsonObj, formId, matchKey){
		if(jsonObj != null && Object.keys(jsonObj).length > 0){
			var form = $("#"+formId);
			if(form.length > 0){
				try{
					$.each(jsonObj, function(key, val){
						
						var targetElem = form.find("#"+key);
						if(targetElem.length > 0){
							
							if(!$.osl.isNull(matchKey) && matchKey.length > 0){
								if(matchKey.indexOf(key) == -1){
									return true;
								}
							}
							
							
							var elemType = targetElem.attr("type");
							
							var elemTagNm = targetElem.prop('tagName').toLowerCase();
							
							 
					        if(elemTagNm == "textarea"){
					        	if(!$.osl.isNull(val)){
					        		targetElem.text(val.replace(/(<\/br>|<br>|<br\/>|<br \/>)/gi, '\r\n'));
					        	}
					        }
					        else{
								
						        if (typeof elemType == "undefined") {
						        	elemType = targetElem[0].type;
						        }
						        
						        
						        if(typeof elemType == "undefined"){
						        	targetElem.text(val);
						        	targetElem.val(val);
						        }
						        else{
						        	
							        switch(elemType) {
							            case undefined:
							            case "button":
							            case "reset":
							            case "submit":
							            	break;
							            case "select-one":
							            	if(!$.osl.isNull(val)){
							            		targetElem.val(val);
							            	}
							            	break;
							            case "radio":
							            case "checkbox":
							            	targetElem[0].checked = (val == 1);
							            	break;
							            case "img":
							            	targetElem.attr("src",$.osl.user.usrImgUrlVal(val));
							            	break;
							            default :
							                if(!$.osl.isNull(val)){
							                	targetElem.val(val);
							            	}
							            	break;
							        }
						        }
					        }
						}
					});
				}catch(error){
					
				}
			}
		}
	}
	
	/**
	 * function 명 	: $.osl.editorSetting
	 * function 설명	: targetId Elemenet에 summernote 생성
	 * 
	 * @param	targetId: summernote 사용 Object (#제외)
	 * @param	config: 해당 form에 주입된 validate
	 */
	$.osl.editorSetting = function(targetId, config){
		var targetObj = $("#"+targetId);
		
		var rtnEditObj = {};
		
		if(targetObj.length > 0){
			
			var container = targetObj.parents(".modal");
			if(container.length == 0){
				container = targetObj;
			}
			
			var defaultConfig = {
				container: container,
	    		lang: 'ko-KR',
	    		height: null,
				maxHeight: null,
				minHeight: 150,
				disabledEditor: false,
				disableResizeEditor: true,
				dialogsInBody: true,
				dialogsFade: true,
				airMode:false,
				disableDragAndDrop: true,
				codeviewFilter: true,
				toolbar: [
					['style', ['style']],
	                ['font', ['bold', 'underline', 'clear']],
	                ['color', ['color']],
	                ['para', ['ul', 'ol', 'paragraph']],
	                ['table', ['table']],
	                ['view', ['fullscreen', 'codeview', 'help']],
	                
	                ['insert', ['picture']],
	            ],
	            popover:{
	            	image: [
	            		    ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
	            		    ['float', ['floatLeft', 'floatRight', 'floatNone']],
	            		    ['remove', ['removeMedia']]
	            	],
	            	link: [
            		    ['link', ['linkDialogShow', 'unlink']]
            		],
            		table: [
            		    ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
            		    ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
            		],
	            },
				callbacks: {
					onChange: function(contents, $editable) {
						targetObj.val(targetObj.summernote('isEmpty') ? "" : contents);
						if(!$.osl.isNull(config) && config.hasOwnProperty("formValidate") &&  !$.osl.isNull(config.formValidate)){
							config.formValidate.element(targetObj);
						}
					}
				}
			};
			
			var targetConfig = $.extend(true, defaultConfig, config);
			
	    	
	    	var summernoteObj = targetObj.summernote(targetConfig);
	    	
	    	
	    	if(!$.osl.isNull(targetObj.val())){
	    		targetObj.summernote('code',targetObj.val());
	    	}

	    	
	    	targetObj.show();
	    	targetObj.css({visibility: "hidden", height: 0});
	    	
	    	
	    	if(targetConfig.disabledEditor){
	    		targetObj.summernote('disable');
	    	}
	    	
	    	rtnEditObj = {id: targetId, target: summernoteObj, element: targetObj[0], config: targetConfig};
		}
		
		return rtnEditObj;
	}
	
	/**
	 * function 명 	: $.osl.formDataToJsonArray
	 * function 설명	: 해당 폼에서 자동으로 폼값을 가져와 FormData()에 세팅 (객체 name값을 key값으로 사용, name없는 경우 id값으로 대체)
	 * @attr
	 * - input box -	title -> 항목 명
	 *					value -> 항목 값
	 *					id	  -> 항목 필드명
	 *					type  -> 항목 타입
	 *					modifyset	-> 01- 이력 저장 항목[기본값], 02- 이력 저장 안함
	 *					opttarget	-> 01 - 기본 컬럼, 02 - 추가 항목, 03 - 배포계획, 04 - 기본 항목
	 *					opttype		-> (-1) - 입력 값 그대로 전송, 01 - 기본값 , 02- 공통코드(cmmcode 속성 값 필요), 03- 사용자, 04- 배포계획
	 *					cmmcode		-> 공통코드
	 *					optFlowId		-> 작업흐름 Id
	 * @param formId	값을 가져올 폼 Id

	 */
	$.osl.formDataToJsonArray = function(formId){
		var fd = new FormData();
		
		var form = $("#"+formId);
		if(form.length > 0){
			try{
				var elements = form.find("input[name], select[name], textarea[name]");
				
				$.each(elements, function(index, element){
					var elemKey = element.name;
					
					
					if($.osl.isNull(elemKey)){
						elemKey = element.id;
						
						if($.osl.isNull(elemKey)){
							return true;
						}
					}
					
					
					var optFlowId = element.getAttribute("optflowid");
					
					
					var chgDetailOptTarget = element.getAttribute("opttarget");
					
					
					if($.osl.isNull(chgDetailOptTarget)){
						chgDetailOptTarget = "01";
					}
					
					
					var chgDetailOptType = element.getAttribute("opttype");
					
					
					if($.osl.isNull(chgDetailOptType)){
						chgDetailOptType = "01";
					}
					
					
					var chgDetailCommonCd = element.getAttribute("cmmcode");
					
					
					if($.osl.isNull(chgDetailCommonCd)){
						chgDetailCommonCd = "";
					}
					
					
					var modifySetCd = element.getAttribute("modifyset");
					
					
					if($.osl.isNull(modifySetCd)){
						modifySetCd = "01";
					}
					
					/* jsonData 세팅 */
					
					var eleTitle = element.title;
					
					
					if($.osl.isNull(eleTitle)){
						eleTitle = elemKey;
					}
					
					
					var eleValue = element.value.replace(/\n/gi,'</br>');
					
					
					if(element.type == "checkbox"){
						eleValue = (element.checked)?"01":"02";
					}
					
					
					var rtnVal = JSON.stringify({optNm:eleTitle,optVal:eleValue,chgDetailOptTarget:chgDetailOptTarget, chgDetailOptType:chgDetailOptType, chgDetailCommonCd:chgDetailCommonCd, modifySetCd:modifySetCd, optFlowId: optFlowId});
					
					
					if(chgDetailOptType != "05" && chgDetailOptType != "03" && element.type == "hidden" || chgDetailOptType == -1){
						rtnVal = eleValue;
					}
					
					fd.append(elemKey, rtnVal);
				});
				
			}catch(error){console.log(error)}
		}
		return fd;
	}
	
	/**
	 * function 명 	: $.osl.continueStrChk
	 * function 설명	: 입력된 문자열에 연속된 문자(123, abc 등)가 있는지 체크한다.
	 * 
	 * @param	str: 입력 문자열
	 * @param	limit: 연속된 문자열 자리수, 3입력시 123, abc등 3자리 연속된 문자열 체크
	 * @returns 연속된 문자열 체크 결과(boolean)
	 */
	$.osl.continueStrChk = function(str, limit){
		var char1, char2, char3, char4 = 0;

		for (var i = 0; i < str.length; i++) {
			var inputChar = str.charCodeAt(i);

			if (i > 0 && (char3 = char1 - inputChar) > -2 && char3 < 2 && (char4 = char3 == char2 ? char4 + 1 : 0) > limit - 3){
				return false;
			}	
			char2 = char3;
			char1 = inputChar;
		}
		return true;
	}
	
	/**
	 * function 명 	: $.osl.datetimeAgo
	 * function 설명	: 현재 시간 기준으로 입력된 시간이 얼마나 경과됬는지를 반환한다.
	 * 
	 * @param	paramDatetime: 입력 문자열
	 * @param	option: 반환 설정 값
	 * 
	 * 	returnTime: 반환 시간 기준 (입력된 기준 시간 값을 반환한다 m - 90분 전, s - 5100초 전)
	 * 			(y - 연도, M - 월, d - 일, h - 시간, m - 분, s - 초)
	 * 
	 * 	fullTime: 전체 시간 반환 기준 (입력된 기준 시간이 0보다 큰 경우 전체 시간 값을 반환한다 M이 1개월 이상인경우 "yyyy-MM-dd HH:mm:ss"로 반환)
	 * 			$.osl.datetimeAgo(timestamp, M) -> month : 1인 경우 "yyyy-MM-dd HH:mm:ss"로 반환
	 * 			(y - 연도, M - 월, d - 일, h - 시간, m - 분, s - 초)
	 * @returns 
	 */
	$.osl.datetimeAgo = function(paramDatetime, options){
		var today = new Date();
		var agoTime = new Date() - paramDatetime;
		
		var formatDate = new Date(paramDatetime).format("yyyy-MM-dd HH:mm:ss");
		
		if(!$.osl.isNull(agoTime) && agoTime > 0){
			agoTime = agoTime/1000;
			
			
			var min = 60;
			var hour = (60*min);
			var day = (24*day); 
			
			
			var secAgo = parseInt(agoTime);
			var minAgo = Math.floor((agoTime/60));
			var hourAgo = Math.floor((agoTime/(60*60)));
			var dayAgo = Math.floor((agoTime/(60*60*24)));
			
			
			var agoMonth = new Date(paramDatetime).getMonth();
			var todayMonth = today.getMonth();
			var monthAgo = new Date(new Date().setMonth(todayMonth-agoMonth)).getMonth();
			
			
			var yearAgo = Math.floor(dayAgo/365);
			
			
			var agoTimeStr = ["y","M","d","h","m","s"];
			var agoTimeArr = [yearAgo, monthAgo, dayAgo, hourAgo, minAgo, secAgo];

			
			var suffixAgo = $.osl.lang("date.agoTime.suffixAgo");
			var agoString;
			$.each(agoTimeArr, function(idx, map){
				
				if(!$.osl.isNull(options) && options.hasOwnProperty("fullTime")){
					if(agoTimeStr[idx] == options.fullTime && map > 0){
						agoString = formatDate;
						return false;
					}
				
				}else if(!$.osl.isNull(options) && options.hasOwnProperty("returnTime")){
					if(agoTimeStr[idx] == options.returnTime){
						agoString = $.osl.lang("date.agoTime."+agoTimeStr[idx],map)+" "+suffixAgo;
						return false;
					}
				}else{
					
					if(map > 0){
						agoString = $.osl.lang("date.agoTime."+agoTimeStr[idx],map)+" "+suffixAgo;
						return false;
					}
				}
			});
			
			return {
				sec: secAgo,
				min: minAgo,
				hour: hourAgo,
				day: dayAgo,
				month: monthAgo,
				year: yearAgo,
				formatDate: formatDate,
				agoString: agoString
			};
		}
		return formatDate;
	}
}));


$(document).ready(function() {
	$.osl.init().done(function(){
		$.osl.isReady = true;
	});
});



