var home = {};
home.init = function () {
    var selectArray = [];
    home.email = function () {
        $('#mod_email').bind('click', function () {
            $('.state_send').hide().prev().show();
        });
        $('#re_e').bind('click', function () {
            $('<div class="lightbox" style="background-position:center center; width:100%; height:100%; position:absolute; top:0; left:0; z-index:999;"><div class="loading" style="width:24px; height:24px; background-position:center center;"></div></div>').appendTo('body').light().find('.loading').cm();
            $.post('/HomeAsync/Resend', { type: 0 }, function (data) {
                var d = $.parseJSON(data);
                if (d.Status === 0) {
                    $('.lightbox').remove();
                    $.showmsg('邮件已发送，请登陆邮箱认证！');
                }
                else {
                    $.showmsg(d.Msg);
                }
            })
        });
    }
    home.Collection = function () {
        var con = $('.dn_nav_con');
        var f = $('.f_p');
        con.find('.dn_main_ori').find('.edit').each(function (i, v) {
            $(v).find('.edit_pop').bind('click', function () {
                $(v).hasClass('edit_pop_sel') ? $(v).removeClass('edit_pop_sel') : $(v).addClass('edit_pop_sel');
            })
        });
        con.find('#m_c_marks').click(function () {
            var _t = $(this);
            _t.hide().next().show().find('.tool_cancel').bind('click', function () {
                $('.dn_main_ori').removeClass('op_edit').find('.edit').removeClass('edit_pop_sel');
                _t.show().next().hide();
            });
            $('.dn_main_ori').addClass('op_edit');
        });
        con.find('.op_col_mg').bind('click', function () {
            var temp = selectNum();
            if (temp.length > 0) {
                f.show().cm();
            }
            else {
                $.showmsg('请先选择');
            }
        });
        con.find('.op_col_del').bind('click', function () {
            var temp = selectNum();
            if (temp.length > 0) {
                $.post('/CollectionAsync/BatchRemove?' + temp + 't=' + Math.random() + '&tagType=' + tagType, function (data) {
                    var d = $.parseJSON(data);
                    if (d.Status === 0) {
                        $.each(selectArray, function (i, v) {
                            $(v).remove();
                        })
                    } else
                        $.showmsg(d.Msg);
                })
            }
            else {
                $.showmsg('请先选择');
            }
        });
        con.find('.op_col_all').bind('click', function () {
            $(this).hasClass('fav-sel-all') ? $(this).removeClass('fav-sel-all') : $(this).addClass('fav-sel-all');
            $(this).hasClass('fav-sel-all') ? $('.dn_main_ori .edit').addClass('edit_pop_sel') : $('.dn_main_ori .edit').removeClass('edit_pop_sel');
        })
        con.find('.cols-del').bind('click', function () {
            var t = $(this);
            if (confirm('删除本作品？')) {
                $.post('/CollectionAsync/Remove?worksID=' + t.parent().attr('data-id')+'&tagType='+tagType, function (data) {
                    var d = $.parseJSON(data);
                    if (d.Status === 0)
                        t.parent().remove();
                    else
                        $.showmsg(d.Msg);
                })
            }
        })
        f.find('#toggle_show').bind('click', function () {
            $(this).hide().next().show();
        })
        f.find('.c').bind('click', function () {
            f.hide();
        })
        f.find('#add_btn').bind('click', function () {
            var new_col = f.find('#col_txt').val();
            $.post('/HomeWorksAsync/CreateCollectionCate?cateName=' + new_col, function (data) {
                var d = $.parseJSON(data);
                if (d.Status === 0) {
                    f.find('#col_select').append('<option selected="selected" value="' + d.Data.tagID + '">' + new_col + '</option>');
                    $('#toggle_show').show().next().hide();
                } else
                    $.showmsg(d.Msg);
            })
        })
        f.find('.sub').bind('click', function () {
            $.post('/CollectionAsync/BatchChangeCategory?' + selectNum() + 'newCategory=' + $('#col_select').val() + '&tagType=' + tagType, function (data) {
                f.hide();
                var d = $.parseJSON(data);
                if (d.Status === 0)
                    $.showmsg('收藏成功');
                else
                    $.showmsg(d.Msg);
            });
        })
        editWorks();
    };
    home.setup = function () {
        $('#mod_tx').bind('click', function () {
            modTx({ tx: $(this).find('img').attr('src'), parent: 'body', parentNode: '<div class="lightBox"></div>', hide: 'yes' });
        });
    };
    home.setupTx = function () {
        modTx({ tx: $('.mod_tx').attr('action-data'), parent: '.mod_tx'});
    }
    function editWorks() {
        $('.dn_list li').hover(function () {
            $(this).find('.works_op').show().find('span').bind('click', function () {
                $(this).addClass('works_op_active').next('.works_op_list').show();
            }).next().find('#works_del').bind('click', function (event) {
                var _t = this;
                if ($('.f_p').length != 0) { return false; }
                var f_panel = $($.lightbox({ title: '删除提醒', content: '你确定要删除该作品，删除操作不可恢复', btn: '删除' })).appendTo('body');
                f_panel.find('.lightBox').light().next('.f_p').cm();

                f_panel.find('.sub').bind('click', function () {
                    location.href = _t.href
                });
                f_panel.find('.c').bind('click', function () { f_panel.detach(); });
                return false;
            }).next('#works_mod').bind('click', function () { });
        }, function () {
            $(this).find('.works_op').hide().find('.works_op_list').hide().prev().removeClass('works_op_active');
        });
    }
    function heredoc(fn){   // 处理字符传拼接
        return fn.toString().split('\n').slice(1, -1).join('\n');
    }
    function modTx(options) {
        var defin_str = heredoc(function(){/*
            <div id="upload" class="up-tx">
                <div id="loading_img" 
                    style="display:none;
                    width:120px;
                    height:40px;
                    border-radius:3px;
                    position:absolute;
                    top:204px;
                    left:136px;
                    z-index:2000;
                    background:#000 url(' +PicHub+ '/Content/images/loading.gif) no-repeat center center;">
                    </div>
                <div class="op_title">
                    <span>头像上传</span>
                    <div class="close c"></div>
                </div>
                <div class="tx_f_pan clear">
                    <div class="img_sel">
                        <div id="up_sec"></div>
                    <div>
                    <span>只支持JPG、PNG、GIF，4M以下图片，尺寸不小于130*130</span>
                </div>
            </div>
            <div class="img_sel tx_op">
                <img id="photo" src>
            </div>
            <div class="tx_pre">
                <div class="tx_img130">
                    <img src="
        */});
        var ops = $.extend({ hide: 'no', parentNode: '' }, options);
        //var tx_str = '<div class="modify">' + ops.parentNode + '<div id="upload" class="up-tx"><div id="loading_img" style="display:none;width:120px;height:40px;border-radius:3px;position:absolute;top:204px;left:136px;z-index:2000;background:#000 url(' +PicHub+ '/Content/images/loading.gif) no-repeat center center;"></div><div class="op_title"><span>头像上传</span><div class="close c"></div></div><div class="tx_f_pan clear"><div class="img_sel"><div id="up_sec"></div><div><span>只支持JPG、PNG、GIF，4M以下图片，尺寸不小于130*130</span></div></div><div class="img_sel tx_op"><img id="photo" src></div><div class="tx_pre"><div class="tx_img130"><img src="' + ops.tx + '" style="width:130px; heihgt:130px;"></div><div class="tx_img70"><img src="' + ops.tx + '" style="height:70px; width:70px;"></div><div class="tx_img40"><img src="' + ops.tx + '" style="width:40px; height:40px;"></div></div></div><div id="re_sel" class="mt15"></div><div class="op_f"><input type="button" class="btn u_f" value="提交"></div></div></div>';
        var tx_str = '<div class="modify">' + ops.parentNode + defin_str + ops.tx + '" style="width:130px; heihgt:130px;"></div><div class="tx_img70"><img src="' + ops.tx + '" style="height:70px; width:70px;"></div><div class="tx_img40"><img src="' + ops.tx + '" style="width:40px; height:40px;"></div></div></div><div id="re_sel" class="mt15"></div><div class="op_f"><input type="button" class="btn u_f" value="提交"></div></div></div>';
        var t = $(tx_str).appendTo(ops.parent);
        ops.parentNode && t.find('.lightBox').css({ height: $(document).height(), background: '#000' }).animate({ opacity: 0.7 }, 500).next('.up-tx').cm();
        var p = t.find('#photo');
        var s = t.find('.u_f');
        init();
        function init() {
            $.file_up({ 
                elem: 'up_sec', 
                btnText: '选择图片', 
                root: $('#upload'), 
                multiple: false,
                pro: function(){
                    $('#loading_img').show();
                }
            });
            $.file_up({ 
                elem: 're_sel', 
                btnText: '重新选择头像', 
                root: $('#upload'), 
                multiple: false,
                pro: function(){
                    $('#loading_img').show();
                }
            });
            s.unbind().bind('click', function () {
                if (p.attr('src').length != 0) {
                    s.addClass('loading');
                    $.ajax({
                        url: $.picUrl,
                        type: 'POST',
                        data: { x: p.data('x'), y: p.data('y'), w: p.data('w'), h: p.data('h'), path: p.data('path'), t: 0 },
                        success: function (data) {
                            if (ops.hide == 'yes') {
                                t.remove();
                            }
                            else {
                                t.addClass('uped').removeClass('edit_tx');
                            }
                            var Data = $.parseJSON(data);
                            if (Data.Status !== 0) {
                                $.showmsg(Data.Msg);
                                return false;
                            }
                            $('.cur_tx img').attr('src', Data.Data.LargeHead);
                            $.showmsg('修改头像成功！');
                        },
                        error: function () {
                            $.showmsg("服务器错误！");
                        }
                    });
                    s.removeClass('loading');
                } else {
                    $.showmsg("你还没有上传图片");
                }
            })
            t.find('.close').bind('click', function () {
                t.remove();
            })
        }
    }
    function editMarkName() {
        $('.tag_edit').each(function (i, v) {
            $(v).find('.tagname').bind('click', function () {
                $(v).addClass('tag_edit_show');
            }).next('.del').bind('click', function (e) {
                e.preventDefault();
                var c = confirm('确定删除该分类，将删除分类下的所有作品');
                if (c) {
                    window.location = $(this).attr('href');
                }
            }).siblings('.yes').bind('click', function () {
                var _t = $(this);
                var optype = _t.attr('action-type');
                $.post(optype == 'work' ? '/HomeWorksAsync/EditCustomizedCate' : '/HomeWorksAsync/EditCollectionCate', { cateID: $(v).attr('action-data'), newName: _t.prev().val() }, function (data) {
                    var d = $.parseJSON(data);
                    if (d.Status === 0) {
                        $(v).find('.tagname').text(_t.prev().val());
                        $(v).removeClass('tag_edit_show');
                    }
                    else {
                        $.showmsg(d.Msg);
                    }
                });
            });
        });
    }
    function selectNum() {
        var str = '';
        $('.edit').each(function (i, v) {
            if ($(v).hasClass('edit_pop_sel')) {
                str += 'worksID=' + $(v).attr('data-id')+'&';
                selectArray.push(v);
            }
        })
        return str;
    }
}

// 联系方式-高德地图选点功能
function mapSelectAddress(){
    var map = new AMap.Map('addressContainer',{
        resizeEnable: true,
        zoom: 16,
        center: [113.685316,34.818818]
    });
    var marker = new AMap.Marker({
        position: [113.685316,34.818818],
        map: map
    });
    marker.setMap(map);

    var geocoder = new AMap.Geocoder({radius: 1000});
    map.on('click', function(e){
        $('#xPoint').val(e.lnglat.lng);
        $('#yPoint').val(e.lnglat.lat);
        map.setCenter([e.lnglat.lng, e.lnglat.lat]);
        marker.setPosition([e.lnglat.lng, e.lnglat.lat]);
        geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function(status, result){
            $('#province').find('option:contains("'+result.regeocode.addressComponent.province+'")').attr('selected', true);

            // 更新city 的下拉菜单
            var sP = $('#province')[0];
            var sC = $('#city')[0];
            var loca4;
            for(var i = 0; i < city.length; i++){
                if(city[i]['provinceID'] == $('#province').val()){loca4 = city[i]['city']; break;}
            }
            sC.options.length = 0;
            for (var i = 0; i < loca4.length; i++) {
                sC.options[i] = new Option(loca4[i]['cityName'], loca4[i]['cityID']);
            }

            if(result.regeocode.addressComponent.city.length > 0){
                $('#city').find('option:contains("'+result.regeocode.addressComponent.city+'")').attr('selected', true);
            }else{
                $('#city').find('option:contains("'+result.regeocode.addressComponent.district+'")').attr('selected', true);
            }
            
            $('#address').val(result.regeocode.formattedAddress);
        })
    })

    // 为省市select加上联动事件
    $('#province').change(function(){
        map.setCity($(this).find('option:selected').text());
        $('#address').val('');
    });
    $('#city').change(function(){
        map.setCity($(this).find('option:selected').text());
        $('#address').val('');
    });

    // 联系方式页面的 省市联动
    var pID = $("#province").attr("data-value");
    var cID = $("#city").attr("data-value");
    var p = city;
    $('#province').on('change', function () { s(); });
    var s1 = $('select')[0];
    var s2 = $('select')[1];
    var loca2, loca3;
    function s() {
        loca2 = $(s1).val();   // provinceID
        for(var h = 0; h < p.length; h++){
            if(p[h]['provinceID'] == loca2){
                loca3 = p[h].city;
                break;
            }
        }
        s2.options.length = 0;
        for (j = 0; j < loca3.length; j++) {
            s2.options[j] = new Option(loca3[j]['cityName'], loca3[j]['cityID']);
        }
    }
    for (i = 0; i < p.length; i++) {
        if (i == pID || p[i]['provinceID'] == pID)
            s1.options[i] = new Option(p[i]['provinceName'], p[i]['provinceID'], false, true);
        else{
            s1.options[i] = new Option(p[i]['provinceName'], p[i]['provinceID'], false, false);
        }
    }
    for(var j = 0; j < p.length; j++){
        if(p[j]['provinceID'] == pID){
            loca3 = p[j].city;
            break;
        }
        else if(pID.length < 3){loca3 = p[+pID].city; break;}
    }
    for (l = 0; l < loca3.length; l++) {
        if (l == cID || loca3[l]['cityID'] == cID)
            s2.options[l] = new Option(loca3[l]['cityName'], loca3[l]['cityID'], false, true);
        else
            s2.options[l] = new Option(loca3[l]['cityName'], loca3[l]['cityID'], false, false);
    }
}

$(document).ready(function () {
    $('#pwdS').pwdS();
    $('#dn_navs a').showBind();
    
    $('.random').data('page', '2').bind('click', function () {
        $(this).hasClass('disabled') ? $.showmsg('没有更多用户了！') : $(this).random();
    });
    home.init();
    home.email();
    home.Collection();
    home.setup();
    $('.tag_edit').each(function (i, v) {
        $(v).find('.tagname').bind('click', function () {
            $(v).addClass('tag_edit_show');
        }).next('.del').bind('click', function (e) {
            e.preventDefault();
            var c = confirm('确定删除该分类，将删除分类下的所有作品');
            if (c) {
                window.location = $(this).attr('href');
            }
        }).siblings('.yes').bind('click', function () {
            var _t = $(this);
            var optype = _t.attr('action-type');
            $.post(optype == 'work' ? '/HomeWorksAsync/EditCustomizedCate' : '/HomeWorksAsync/EditCollectionCate', { cateID: $(v).attr('action-data'), newName: _t.prev().val() }, function (data) {
                var d = $.parseJSON(data);
                if (d.Status === 0) {
                    $(v).find('.tagname').text(_t.prev().val());
                    $(v).removeClass('tag_edit_show');
                }
                else {
                    $.showmsg(d.Msg);
                }
            })
        }).siblings('.cancle').bind('click',function(){
            var _t = $(this);
            _t.siblings('.edit_inp').val($(v).find('.tagname').html());
            $(v).removeClass('tag_edit_show');
        })
    });
    $('form').each(function () {
        var _f = $(this);
        var _old = _f.serializeArray();

        _f.find('#nickName').bind('blur', function () {
            if (_old[0].value == _f.serializeArray()[0].value) {
                return false;
            }
            else {
                $.post('/ValidateAsync/CheckNickName', { nickName: $.trim($(this).val()) }, function (data) {
                    if (data == true) {
                        $(this).parent().find('.Validform_checktip').html('用户名已存在');
                        return false;
                    }
                    else
                        return true;
                });
            }
        });
        if (_f.attr('id') == 'find_back') {
            _f.find('#get_vcode').getValid({
                url: '/FindPwd/Send'
            });
        }
        else {
            _f.find('#get_vcode').getValid();
        }
        try {
            _f.Validform({
                btnSubmit: '#btn_sub',
                tiptype: 3,
                showAllError: true,
                ajaxPost: true,
                datatype: {
                    's2-20': /^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{2,20}$/,
                    'account': function (gets, obj, cur, regexp) {
                        //var reg1 = regexp['e'], reg2 = regexp['m'];
                        //if (reg1.test(gets)) {
                        //    return true;
                        //}
                        //else if (reg2.test(gets)) {
                        //    return true;
                        //}
                        return true;
                    }
                },
                beforeSubmit: function (curform) {
                    if (_f.find('input[type=submit]').attr('action-check') == 'check_mod') {
                        var _now = _f.serializeArray();
                        return $.checkModify(_now, _old);
                    }
                    _f.find('.sub').addClass('loading');
                },
                callback: function (data) {
                    if (data.Status == 0) {
                        //_f.find('.sub').removeClass('loading');
                        if (_f.attr('done-type') === '1') {
                            if (_f.attr('id') == 'valid_email') {
                                $('.state_send').show().siblings().hide();
                            }
                            else {
                                location.href = location.href.split('#')[0];
                            }
                        } else if (_f.attr('done-type') == 3) {
                            $('#vcode').val($('.validCode').val());
                            _f.next().show()
                            _f.remove();
                        }
                    }
                    _f.find('.sub').removeClass('loading');
                    $.showmsg(data.Msg);
                }
            });
        }
        catch (e) {

        }
    });
    $('.mod_c').bind('click', function () {
        $('<div class="f_pan"><div class="f_con full"><div class="t_op"><span>更换封面</span><div class="close cancel">关闭</div></div><div class="up_panel full" style="top:41px;"><div id="up_btn"></div></div></div>').appendTo('body').find('.cancel').click(function () { $('.f_pan').detach(); });
        $.file_up({
            elem: 'up_btn',
            root: $('.f_pan'),
            multiple: false,
            type: 1,
            sub: function (id, filename) {
                $('#up_btn').after('<div class="img_op"><div class="img_title"><div class="tip">您可以对图片剪切，然后点击“确定封面照片”</div></div><div class="rect_panel"><img id="photo" src="'+ PicHub +'/Content/images/c_load.gif" style="margin:0 auto;"></div></div></div>').hide();
            },
            pro: function (id, filename, loaded, total) { },
            com: function (id, fileName, res) {
                var r = res;
                if (r.Status === 0) {
                    $('#up_btn').hide().parent().after('<div class="btn_pan p-a"><input type="button" class="btn u_f" value="确定封面照片"><input type="button" class="btn default_btn cancel" value="取消"></div>');
                    $('.cancel').click(function () { $('.f_pan').detach(); });
                    var o_img = $('#photo').attr('src', r.Data.path).data(r.Data);
                    //$('.f_pan').find('#photo').imgAreaSelect({ x1: 150, y1: 150, x2: 630, y2: 420, show: true, minWidth: 480, minHeight: 270, aspectRatio: '16:9', handles: true, parent: $('.rect_panel'), fadeSpeed: 200, onSelectChange: $.preview, onInit: $.preview }).data(r.Data);
                    var crop_img = $('.f_pan').find('#photo');

                    var w, h, s = 1;
                    if (o_img.data('width') >= 1000) {
                        w = 1000;
                        h = Math.floor(o_img.data('height') * 1000 / o_img.data('width'));
                        s = o_img.data('width');
                    }
                    else {
                        w = o_img.data('width');
                        h = o_img.data('height');
                    }
                    
                    crop_img.Jcrop({
                        allowSelect: true,
                        aspectRatio: 16/9,
                        onChange: $.preview,
                        onselect: $.preview,
                        boxWidth: 820,
                        boxHeight: 460,
                        minSize: 100
                    }, function(){
                        $.jcropApi = null;
                        $.jcropApi = this;
                        var w, h;
                        this.setImage(o_img.data('path'), function(){
                            w = $.jcropApi.getBounds()[0];
                            h = $.jcropApi.getBounds()[1];
                            var x = w / 2,
                                y = h / 2,
                                x_ = 556 / 2 * $.jcropApi.getScaleFactor()[0],
                                y_ = 312 / 2 * $.jcropApi.getScaleFactor()[1];
                            $.jcropApi.setSelect([x - x_, y - y_, x + x_, y + y_]);
                        });
                    });
                    function dbhandler() {
                        var _t = $(this);
                        _t.addClass('loading');
                        $.ajax({
                            url:$.picUrl,
                            async: true,
                            type: 'POST',
                            data: { x: o_img.data('x'), y: o_img.data('y'), w: o_img.data('w'), h: o_img.data('h'), path: o_img.data('path'), t: 1 },
                            success: function (data) {
                                var Data = $.parseJSON(data);
                                if (Data.Status !== 0) {
                                    return false;
                                }
                                $('.dn_mem_bg img').attr('src', Data.Data.RightTopPic);
                                $('.dn_men_bg_lv img').attr('src', Data.Data.LeftTopPic);
                                _t.removeClass('loading');
                                $('.f_pan').hide().remove();
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                $.showmsg('服务器错误！');
                            }
                        })
                    };
                    $('.f_pan .u_f').bind('click', dbhandler);
                    o_img.parent().bind('dblclick', dbhandler);
                }
                else {
                    $('#up_btn').show().next().remove();
                    $.showmsg(r.Msg);
                }
            }
        });
    });
});