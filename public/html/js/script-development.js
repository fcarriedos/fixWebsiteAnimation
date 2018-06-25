// Developer menu
$("body").append('<a onclick="openDevMenu(false,true);" style="position:fixed;right:30px;bottom:90px;z-index:9998;background:#fff;width:40px;height:40px;border-radius:50%; color:red; font-size:24px;line-height:40px;text-align:center"><i class="fa fa-cog"></i></a>');
$("body").append('<a onclick="openDevMenu(false,true,true);" class="dev_menu_right" style="position:fixed;right:30px;bottom:30px;z-index:9998;background:#fff;width:40px;height:40px;border-radius:50%; color:blue; font-size:24px;line-height:40px;text-align:center"><i class="fa fa-arrow-right"></i></a>');
$("head").append('<style>.dev_menu_right:hover{color:green !important;}</style>');

$("body").keydown(function(e){
	if(e.keyCode==45){
		openDevMenu(e,false);
	}
	if(e.keyCode==27){
		closeDevMenu();
	}
});

function closeDevMenu(){
	$(".dev_menu").remove();
}

function openDevMenu(e,dev_open, next){
	if(e.keyCode==45 && $(".dev_menu").length==0 || dev_open===true && $(".dev_menu").length==0){
		var headers = '';
		var contents = '';
		var features = '';
		var forms = '';
		var calls_to_actions = '';
		var teams = '';
		var pricing_tables = '';
		var contacts = '';
		var showcases = '';
		var navigations = '';
		var footers = '';
		var color = "blue";
		for(var i=1; i<=20;i++){
		    if(window.location.href.indexOf("header_"+i)!=-1){color = "red";}else{color = "blue";}
			headers += '<a href="?category=headers&block=header_'+i+'" style="display:block;" class="font20 link '+color+'">Header '+i+'</a>';
		}
		for(var i=1; i<=40;i++){
		    if(window.location.href.indexOf("content_"+i)!=-1){color = "red";}else{color = "blue";}
			contents += '<a href="?category=contents&block=content_'+i+'" style="display:block;" class="font20 link '+color+'">Content '+i+'</a>';
		}
		for(var i=1; i<=30;i++){
		    if(window.location.href.indexOf("feature_"+i)!=-1){color = "red";}else{color = "blue";}
			features += '<a href="?category=features&block=feature_'+i+'" style="display:block;" class="font20 link '+color+'">Feature '+i+'</a>';
		}
		for(var i=1; i<=13;i++){
		    if(window.location.href.indexOf("footer_"+i)!=-1){color = "red";}else{color = "blue";}
			footers += '<a href="?category=footers&block=footer_'+i+'" style="display:block;" class="font20 link '+color+'">Footer '+i+'</a>';
		}
		for(var i=1; i<=15;i++){
		    if(window.location.href.indexOf("form_"+i)!=-1){color = "red";}else{color = "blue";}
			forms += '<a href="?category=forms&block=form_'+i+'" style="display:block;" class="font20 link '+color+'">Form '+i+'</a>';
		}
		for(var i=1; i<=20;i++){
		    if(window.location.href.indexOf("call_to_action_"+i)!=-1){color = "red";}else{color = "blue";}
			calls_to_actions += '<a href="?category=calls_to_actions&block=call_to_action_'+i+'" style="display:block;" class="font20 link '+color+'">Call to action '+i+'</a>';
		}
		for(var i=1; i<=5;i++){
		    if(window.location.href.indexOf("team_"+i)!=-1){color = "red";}else{color = "blue";}
			teams += '<a href="?category=teams&block=team_'+i+'" style="display:block;" class="font20 link '+color+'">Team '+i+'</a>';
		}
		for(var i=1; i<=7;i++){
		    if(window.location.href.indexOf("pricing_table_"+i)!=-1){color = "red";}else{color = "blue";}
			pricing_tables += '<a href="?category=pricing_tables&block=pricing_table_'+i+'" style="display:block;" class="font20 link '+color+'">Pricing table '+i+'</a>';
		}
		for(var i=1; i<=10;i++){
		    if(window.location.href.indexOf("contact_"+i)!=-1){color = "red";}else{color = "blue";}
			contacts += '<a href="?category=contacts&block=contact_'+i+'" style="display:block;" class="font20 link '+color+'">Contact '+i+'</a>';
		}
		for(var i=1; i<=10;i++){
		    if(window.location.href.indexOf("showcase_"+i)!=-1){color = "red";}else{color = "blue";}
			showcases += '<a href="?category=showcases&block=showcase_'+i+'" style="display:block;" class="font20 link '+color+'">Showcase '+i+'</a>';
		}
		for(var i=1; i<=20;i++){
		    if(window.location.href.indexOf("nav_"+i)!=-1){color = "red";}else{color = "blue";}
			navigations += '<a href="?category=navigations&block=nav_'+i+'" style="display:block;" class="font20 link '+color+'">Navigation '+i+'</a>';
		}
		var dev_menu = '<div class="dev_menu" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#fff;overflow:auto;padding:50px;">';
		dev_menu+='<a onclick="closeDevMenu();" style="position:absolute;top:20px;right:20px;color:red;font-size:32px;opacity:1;"><i class="fa fa-close"></i></a>';
	    dev_menu+='<div class="col-xs-12"><h3>Device: '+$(window).width()+' x '+$(window).height()+'</h3></div>';
		dev_menu+='<div class="col-md-2 col-xs-6"><h3>Headers:</h3>'+headers+'<h3>Teams:</h3>'+teams+'<h3>Pricing tables:</h3>'+pricing_tables+'</div>';
		dev_menu+='<div class="col-md-2 col-xs-6"><h3>Contents:</h3>'+contents+'</div>';
		dev_menu+='<div class="col-md-2 col-xs-6"><h3>Features:</h3>'+features+'<h3>Footers:</h3>'+footers+'</div>';
		dev_menu+='<div class="col-md-2 col-xs-6"><h3>Forms:</h3>'+forms+'<h3>Contacts:</h3>'+contacts+'<h3>Showcases:</h3>'+showcases+'</div>';
		dev_menu+='<div class="col-md-2 col-xs-6"><h3>Call to action:</h3>'+calls_to_actions+'<h3>Navigations:</h3>'+navigations+'</div>';
		dev_menu+='</div>';
		$("body").append(dev_menu);
		
		if(next===true){
			var links_length = $("body").find(".dev_menu .link.red").length - 1;
			var url = $("body").find(".dev_menu .link.red:eq("+links_length+")").next().attr("href");
			if(url == undefined){
				var url = $("body").find(".dev_menu .link.red:eq("+links_length+")").next().next().attr("href");
				if(url == undefined){
					var url = $("body").find(".dev_menu .link.red:eq("+links_length+")").parent().next().find("a:eq(0)").attr("href");
				}
			}
			window.location.href = url;
		}
	}
}