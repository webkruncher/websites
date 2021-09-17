



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

function OneMessage(m)
{
	if (AlertLimiter > 1) return
	AlertLimiter+=1
	//alert(m)
}
		
function SystemLocked(sw,msg)
{
	if (sw)
	{
		try
		{
			if (Diagnostics)
				Diagnostics.Write(msg)
			else {
				OneMessage(msg)
			}
		} catch (e) {
			//OneMessage(msg)
		}
	} else {
		if (Diagnostics)
			Diagnostics.Write(msg)
	}
	r=GetObject("WholePage")
	LockMessage=GetObject("SystemLock")
	if (sw)
	{
		ShowNode(false,r)
		ShowNode(true,LockMessage)
		LockMessage.style.display="inline"
		LockMessage.setAttribute("style","display:block;")
		LockDiagnostics.Show()
		LockDiagnostics.Write(msg)
	} else {
		LockDiagnostics.Write(msg)
		ShowNode(true,r)
		ShowNode(false,LockMessage)
	}
}


function Whatever(msg,grace)
{
	if (InitDiagnostics) 
	{
		InitDiagnostics.Write(msg)
	}
	if (Diagnostics)
		Diagnostics.Write(msg)
	if ( (!Diagnostics) && (!UserMessages) )
	{
		sinceopened=Now.getTime()-FirstLoadedAt.getTime()
		if (sinceopened > grace)
			OneMessage(msg)
	}
}

function AjaxFailure(msg,grace)
{
	//setTimeout("Navigate('Verbose')",3000)
	//txt="AJax Failure:" + msg
	//Whatever(msg,grace)
}

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


function buggy()
{
	//if (buggness ) buggness =false;
	//else buggness =true;
	if (buggness) 
	{
		diagnostics_root.style.display="inline";
		//SparkyTextDiv.style.display="none";
	} else {
		diagnostics_root.style.display="none";
		//SparkyTextDiv.style.display="inline";
	}
}


var ambionceness = true;
function ambionce()
{
	if (ambionceness) ambionceness=false;
	else ambionceness=true;
          if (ambionceness)
          {
               sw="inline"          
          }else {
               sw="none"
          }
          //SteelBkg.style.display=sw;
          SteelBkgTop.style.display=sw;
          SteelBkgLeft.style.display=sw;
          SteelBkgRight.style.display=sw;
          SteelBkgBottom.style.display=sw;
}

function wklcollide(d)
{
	if (d < 80)
		return false
	else return true
}




function ToBeDone()
{
	InitializeAjax()
	setTimeout('AfterAjax2()',100)
}

var MenuLoaded=0
var MenuChecker=null
function MenuCheck()
{
	if (UserMessages)
	{
		if (!MenuLoaded)
		{	
			LoadProgress("Menu...")
			LoadLeftMenu();		
			clearInterval(MenuChecker)
		}
	}
}

function AfterAjax2()
{

	MenuChecker=setInterval("MenuCheck()",100);

//	if (!UserMessages)
	{
		UserMessages=new MsgTable(GetObject('UserMessages'))
//		if (buggness) 
		{
			UserMessages.Color("yellow");
			UserMessages.Background("black");
			UserMessages.FontSize("12px");
		}
		UserMessages.MaxLength(30)
	}

	//if (buggness) UserMessages.Write("Testing in progress")


	if (webkruncherxslt_txt.length < 1)
	{
		if (buggness) UserMessages.Write("Loading transformer")
		InitializeAjax()
		setTimeout('AfterAjax2()',100)
		return
	} 
	FocusOn('DeadTarget')
	setVisible(GetObject('MastheadText'),false);
	LoadProgress("***")

	if (1)
	{
		WKLw=400
		WKLh=100
		WKLw+="px"
		WKLh+="px"
	} else {
		//cs=window.getComputedStyle(document.documentElement,null);
		cs=window.getComputedStyle(GetObject("WebKruncherLogo"),null);
		WKLw=Math.floor(cs.getPropertyCSSValue('width').getFloatValue(5))
		WKLh=Math.floor(cs.getPropertyCSSValue('height').getFloatValue(5))
		WKLw+="px"
		WKLh+="px"
	}

	LoadProgress("+++")

	//anim = new Animator('anim',  GetObject('WebKruncherLogo') ,1,31, 1,150,WKLw,WKLh,"Steel/Logo/",".png",4,false);
	anim = new Animator('anim',  GetObject('WebKruncherLogo') ,30,31, 1,150,WKLw,WKLh,"Steel/Logo/",".png",4,false);
	anim.spinstart=12
	anim.spinend=31
	anim.Animate();
	anim.OnDone = function()
	{
		setTimeout("anim.Spin()", 1000 )
	}

	LoadProgress("000")
	UserMessages.Write("Welcome to WebKruncher")
	LoadDynamicMenu()
	FocusOn('DeadTarget')
//	if (buggness) setTimeout("ResetUserMessages()",5000);
}

function LogoAnimator()
{
	//anim = new Animator('anim',  GetObject('WebKruncherLogo') ,1,31, 1,250,WKLw,WKLh,"Steel/Logo/",".png",4,false);
	anim.spinstart=12
	anim.spinend=31
	anim.Animate();
	anim.OnDone = function()
	{
		this.ndx=this.spinstart
		this.interval=100
		this.AnimComplete=false
		anim.Animate();
		//setTimeout("anim.Spin()", 1000 )
	}
}

function ResetUserMessages()
{
alert( "ResetUserMessages" )
	UserMessages.Hide()
	UserMessages=new MsgTable(GetObject('UserMessages'))
	buggness=false
}

var flipped=0
function AfterFlip()
{
	try
	{
		LoadProgress("Initializing..")
		if (webkruncherxslt_txt.length < 1)
		{
			LoadProgress("Initializing. " + flipped) 
			new ajax('','',null,null);
			flipped++
			setTimeout('AfterFlip()',1000)
			return
		} 
		GetViewport() 
		emo="display:inline;position:absolute;top:"+(viewportheight-100)+";left:"+(viewportwidth-400)+";"
		GetObject("EntryMsg").setAttribute("style",emo)
		ShowNode(true,"PreInitDiagnosticsDiv")

		LoadProgress("Initializing...")
		jax = new ajax("index.xml",GetObject("RootNode"),ToBeDone,null) }
	catch(e) {
		LoadProgress(e)
	}
}

function LoadProgress(msg)
{
	//GetObject("EntryMsg").setAttribute("style","display:inline")
	GetObject("EntryMsg").innerHTML=msg
	if (LoaderTimeout)
		clearTimeout(LoaderTimeout)
	LoaderTimeout=setTimeout("CloseLoader()", 3000)
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
	document.body.setAttribute("style", "display:none" )
	GetObject("RootNode").innerHTML=""
	GetObject("EntryMsg").innerHTML="Initializing."
	InitializeAjax()
	setTimeout('AfterFlip()',100)
}



function PostThisForm(how,form,nest, callback, target)
{
	this.parts=nest.split("/");
	this.what="<form>\n"
	for (this.n=0;this.n<this.parts.length;this.n++)
		this.what+="<"+this.parts[this.n]+">\n"
	this.ps=new postscrubber();
	this.ps.scrub(this,form);
	for (this.n=this.parts.length-1;this.n>=0;this.n--)
		this.what+="</"+this.parts[this.n]+">\n"
	this.what+="\n</form>"
	new ajax( how, target,  callback, null, this.what )
	return false;
}

function LogginAttempted( status )
{
	if ( buggness ) UserMessages.Write( "Login status: " + parseInt( status ) )
}

function Login( form )
{
	f=GetObject( form )
	UserName=f.elements[ "UserName" ].value 
	Password=f.elements[ "Password" ].value 
	target=Navigate( "Home", "", "", "", "", "Reset" )
	target.setAttribute('style','display:block;')
	target.innerHTML=""
	PostThisForm( "/Home.xml", f, "Login", "LogginAttempted( reqnode.httpRequest.status )", target )
	return false
}




function RegistrationAttempted( status )
{
	if ( buggness ) UserMessages.Write( "Registration status: " + parseInt( status ) )
}

function Register( form )
{
	f=GetObject( form )
	UserName=f.elements[ "UserName" ].value 
	Password=f.elements[ "Password" ].value 
	target=Navigate( "Register", "", "", "", "", "Reset" )
	target.setAttribute('style','display:block;')
	target.innerHTML=""
	PostThisForm( "/Register.xml", f, "Register", "RegistrationAttempted( reqnode.httpRequest.status )", target )
	return false
}




