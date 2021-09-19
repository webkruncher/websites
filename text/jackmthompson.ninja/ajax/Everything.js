



// All of the JavaScript in this site is a kludge
// much kippple and cruft needs to be elliminated
// tbd: rework the entire site

var MenuRoot="";
var LastAjaxSuccess=null
var FirstLoadedAt=new Date
var CantAjax=false
var HeartBeatInterval=null
var Diagnostics = null
var LockDiagnostics = null
var InitDiagnostics = null
var UserMessages = null
var buggness = true;
var AlertLimiter = 1 
var StartedApplicationAt=new Date()
var ConnectionStatus = true
var LoaderTimeout = 0
var FlipInterval = 0


var last_viewportwidth=0
var last_viewportheight=0
function ViewPortManager()
{
	GetViewport ()
	if (
		(last_viewportwidth!=viewportwidth)
			||
		(last_viewportheight!=viewportheight)
	)
	{
		if ( (last_viewportheight) && (last_viewportwidth) )
		{
			s="/index.html?";
			s+=viewportwidth;
			s+="x";
			s+=viewportheight;
			window.location=s;
		} else {
			last_viewportwidth=viewportwidth;
			last_viewportheight=viewportheight;
		}
	} else {
		last_viewportwidth=viewportwidth;
		last_viewportheight=viewportheight;
	}
}
//setInterval("ViewPortManager()",900)


function wklcollide(d)
{
	if (d < 80)
		return false
	else return true
}





function LogoAnimator()
{
return
	WKLw=400
	WKLh=100
	WKLw+="px"
	WKLh+="px"
	anim = new Animator('anim',  GetObject('WebKruncherLogo') ,1,31, 1,250,WKLw,WKLh,"Steel/Logo/",".png",4,false);
	//anim = new Animator('anim',  GetObject('WebKruncherLogo') ,30,31, 1,150,WKLw,WKLh,"Steel/Logo/",".png",4,false);
	anim.spinstart=12
	anim.spinend=31
	anim.Animate();
	anim.OnDone = function()
	{
		this.ndx=this.spinstart
		this.interval=100
		this.AnimComplete=false
		anim.Animate();
		setTimeout("anim.Spin()", 1000 )
	}
}


var flipped=0
function AfterFlip()
{
	try
	{
		if (!webkruncherxslt) 
		{
			setTimeout('AfterFlip()',1000)
			return
		} 
		GetViewport() 
		emo="display:inline;position:absolute;top:"+(viewportheight-100)+";left:"+(viewportwidth-400)+";"
		GetObject("EntryMsg").setAttribute("style",emo)
		GetObject("EntryMsg").innerHTML="Loading"

		jax = new ajax("index.xml",GetObject("RootNode"), LoadDynamicMenu ,null) 
		wk = new LogoAnimator()
	} catch(e) {
		LoadProgress(e)
	}
}

function ClearLoader()
{
	GetObject("EntryMsg").innerHTML=""
}

function LoadProgress(msg)
{
	//GetObject("EntryMsg").setAttribute("style","display:inline")
	GetObject("EntryMsg").innerHTML=msg
	if (LoaderTimeout)
		clearTimeout(LoaderTimeout)
	//LoaderTimeout=setTimeout("CloseLoader()", 3000)
	LoaderTimeout=setTimeout("ClearLoader()", 3000)
}

function LoadError(msg)
{
	GetObject("ErrorLoadMsg").setAttribute("style","display:block; float:right;color:red")
	GetObject("ErrorLoadMsg").innerHTML=msg
	Navigate( "Home", "", "", "", "", "Reload" )
}

function CloseLoader()
{
	GetObject("EntryMsg").setAttribute("style","display:none")
	LoaderTimeout=0
}

function BackFlip() 
{
	document.body.style.backgroundColor = "#AAAAAA";
	GetObject("RootNode").innerHTML=""
	//GetObject("EntryMsg").innerHTML="Initializing."
	UserMessages=new MsgTable(GetObject('UserMessages'))
	UserMessages.Color("green");
	UserMessages.Background("black");
	UserMessages.FontSize("10px");
	UserMessages.LengthLimit=30
	UserMessages.Write( "Setting up" )
	//document.body.setAttribute("style", "display:none" )
	InitializeAjax()
	AfterFlip()
}


