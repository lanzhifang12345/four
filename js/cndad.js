!(function(){
	var anchorId = Math.random().toString(36).slice(2);
	//创建锚点标签
	document.write('<div></div>');
	document.write('<a style="display:none!important" id="cnd_ad_'+anchorId+'"></a>');

	//获取广告信息
	!(function(){
		//原生ajax
		var ajax = function(obj){
            obj=obj||{};
            obj.type=(obj.type||'GET').toUpperCase();
            obj.dataType=obj.dataType||'json';
            var params=formatParams(obj.data);//参数格式化

            //step1:兼容性创建对象
            if(window.XMLHttpRequest){
                var xhr=new XMLHttpRequest();
            }
            else{
                var xhr=new ActiveXObject('Microsoft.XMLHTTP');
            }
            //step4: 接收
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if(xhr.status>=200 && xhr.status<300){
                        obj.success&&obj.success(xhr.responseText,xhr.responseXML);
                    }
                    else{
                        obj.error&&obj.error(xhr.status);
                    }
                }
            }
            //step2 step3:连接 和 发送
            if(obj.type=='GET'){
                xhr.open('GET',obj.url,true);
                xhr.send(null);
            }
            else if(obj.type=='POST'){
                xhr.open('POST',obj.url,true);
                //设置请求头，以表单形式提交数据
                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                xhr.send(params);
            }
            //辅助函数，格式化参数
            function formatParams(data){
                var arr=[];
                for(var name in data){
                    arr.push(encodeURICompontent(name)+"="+encodeURICompontent(data[name]));
                }
                //设置随机数，防止缓存
                arr.push("t="+Math.random());
                return arr.join("&");
            }
		}
		var fn = {
			//存储广告数据
			d:[],
			html:'',
			//获取广告的数据
			getAdData: function(){
				ajax({
					url:'http://www.cndesign.com/ClientData/Promote?mustHTML=false&posID='+codd_id,
					type:'GET',
					success: function(res){
						if(res == '[]'){
							fn.hideAd();
							return ;
						}
						fn.d = JSON.parse(res);
						fn.checkAdType();
					},
					error: function(res){
						console.log(res);
					}
				})
			},
			//判断广告类型
			checkAdType: function(){
				if(fn.d[0].type==1){
					fn.createImgAd();
					return;
				}
				if(fn.d[0].type==3){
					fn.createFlashAd();
					return;
				}
				if(fn.d[0].type==2){
					fn.createCodeAd();
					return;
				}
			},
			//广告位上没有广告时隐藏广告位
			hideAd: function(){
				var div = document.getElementById('cnd_ad_'+anchorId).parentNode;
				div.setAttribute('class','cndAd_hide');
				div.innerHTML = '';
			},
			//创建img类型广告的容器
			createImgAd: function(){
				var div = document.getElementById('cnd_ad_'+anchorId).parentNode;
				var dd = fn.d[0];
				var htmlCode = '<a title="'+dd.title+'" href="'+dd.url+'" target="_blank" onclick="_hmt.push([\'_trackEvent\', \'promo\', \'click\', \''+dd.title+'\'])" rel="nofollow">'+
									'<img alt="'+dd.title+'" src="'+dd.displayContent+'" width="'+dd.width+'" height="'+dd.height+'" />'+
								'</a>';
				// div.getElementsByTagName('div')[0].innerHTML = fn.d[0].displayContent;
				div.getElementsByTagName('div')[0].innerHTML = htmlCode;
			},
			//创建flash类型广告的容器
			createFlashAd: function(){
				var div = document.getElementById('cnd_ad_'+anchorId).parentNode;
				var dd = fn.d[0];
				var htmlCode = '<object id="dz" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="'+dd.width+'" height="'+dd.height+'" onclick="_hmt.push([\'_trackEvent\', \'promo\', \'click\', \''+dd.title+'\'])">'+
									'<param name="movie" value="'+dd.displayContent+'" />'+
									'<param name="quality" value="high" />'+
									'<param name="allowScriptAccess" value="always" />'+
									'<embed src="'+dd.displayContent+'" allowscriptaccess="always" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="'+dd.width+'" height="'+dd.height+'"></embed>'+
								'</object>';
				// div.getElementsByTagName('div')[0].innerHTML = fn.d[0].displayContent;
				div.getElementsByTagName('div')[0].innerHTML = htmlCode;
			},
			//创建代码类型广告的容器
			createCodeAd: function(){
				function stripscript(str) {
				    return str.replace(/<.*?script[^>]*?>.*?(<\/.*?script.*?>)*/ig, '');  
				}
				var div = document.getElementById('cnd_ad_'+anchorId).parentNode;
				var cont = decodeURI(fn.d[0].displayContent);
				var recont = stripscript(cont);
				var s = document.createElement('script');
				s.setAttribute('type','text/javascript');
				s.innerHTML = recont;
				div.getElementsByTagName('div')[0].appendChild(s);
			}
		}
		fn.getAdData();
	})()
})()