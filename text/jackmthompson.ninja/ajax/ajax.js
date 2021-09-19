


var webkruncherxslt=null;
var webkruncherxslt_txt="";
function callInProgress(xmlhttp) 
{
	switch ( xmlhttp.readyState ) 
	{
		case 1, 2, 3:
			return true;
			break;

		// Case 4 and 0
		default:
			return false;
			break;
	}
}





function ajax(xmlname,target,callback,positioner,apost=null) 
{
	try
	{
		//LoadProgress("Need " + xmlname)
		this.xmlname = xmlname;
		this.target = target;
		this.callback=callback
		this.positioner=positioner
		this.apost=apost
		//LoadProgress("Generating request")
		this.httpRequest = new XMLHttpRequest(); 
		//LoadProgress("Getting " + this.xmlname)
		this.httpRequest.async = false
		this.cachexslt = false;
		if (!this.xmlname.length) 
		{
			this.cachexslt=true;
			GetObject("EntryMsg").innerHTML="Loading the WebKruncher style"
			this.load('ajax/webkruncher.xslt', this.apost)
		} else {
			if ( buggness  ) 
				if ( UserMessages ) UserMessages.Write( this.xmlname )
			this.load(this.xmlname, this.apost)
		}
	} catch (e) {
		LoadError("Cannot Ajax.")
	}
}



ajax.prototype.getXMLHttpRequest = function () 
{
	try 
	{ 
		LoadProgress("Creating request")
		return new XMLHttpRequest(); 
	} catch(e) {
		LoadError("Cannot get XMLHttpRequest")
	}
	return null;
}

ajax.prototype.StatusMessage = function(ssv)
{
	if (ssv == '0') return 'uninitialized';
	if (ssv == '1') return 'loading';
	if (ssv == '2') return 'loaded';
	if (ssv == '3') return 'interactive';
	if (ssv == '4') return 'complete';
	return 'unknown state'
}

ajax.prototype.diagnostics = function(msg)
{
	if (!buggness) return;
	if (UserMessages)
		UserMessages.Write(msg)
	else 
	{
		Now=new Date()
		sinceopened=Now.getTime()-StartedApplicationAt.getTime()
	}
}

ajax.prototype.StatusChange = function (url,reqobj)
{
	if (buggness)
	{
		//msg=url+" -> "+this.StatusMessage(reqobj.readyState)
		//this.diagnostics(msg)
	}
	if (reqobj.status == 200)
	{
		LastAjaxSuccess=new Date()
	//	if (this.xmlname != "ping.xml") this.diagnostics(msg)
	}
}

ajax.prototype.load = function (url, apost)
{

	//LoadProgress("Getting " + url)
	try
	{
		if (this.httpRequest != null) 
		{
			var reqnode = this;
			if ( apost==null ) 
			{
				this.httpRequest.open('get', url, true);
			} else {
				this.httpRequest.open('post', url, true);
				this.httpRequest.setRequestHeader("Content-length", apost.length);
			}
			this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//		this.httpRequest.setRequestHeader("Content-length", params.length);
			this.httpRequest.setRequestHeader("Connection", "close");
//			this.httpRequest.setRequestHeader("Client", "1280x768");

			this.httpRequest.onreadystatechange = function () 
			{
				reqnode.StatusChange(url,reqnode.httpRequest)
				if (reqnode.httpRequest.readyState == 4) 
				{
					if (reqnode.httpRequest.status == 422) 
					{
						document.location="/index.html"
						return
					}
					if (reqnode.httpRequest.status != 200) 
					{
						if (buggness) UserMessages.Write( url + " status " + reqnode.httpRequest.status )
					}
					if (reqnode.cachexslt)
					{
						//LoadProgress("Stylizing..")
						webkruncherxslt=reqnode.httpRequest.responseXML;
						webkruncherxslt_txt=reqnode.httpRequest.responseText;
						return;
					}
					reqnode.xml = reqnode.httpRequest.responseXML;
					if (this.xmlname == "unused_ping.xml") 
					{
						if (reqnode.callback) reqnode.callback( reqnode.httpRequest.status )
					} else {
						if (reqnode.httpRequest.responseText.length < 1)
						{ 
							this.httpRequest.send(apost)
						} else {
							reqnode.xform();
							if (reqnode.positioner) 
							{
								reqnode.positioner(reqnode.transformed)
							}
							if (!reqnode.transformed) 
							{
								ajax(this.xmlname,  this.target,this.callback,this.positioner) 
								return ;
							}
							if  ( reqnode.target ) 
								reqnode.target.appendChild(reqnode.transformed)
							if (reqnode.callback) 
							{
								if ( typeof( reqnode.callback ) == "function" ) 
								{
									setTimeout(reqnode.callback,10)
								} else  {
									if ( typeof( reqnode.callback ) == "string" )
									{
										eval( reqnode.callback )
									}
								}
							}
						}
					}
				}
			};
			this.httpRequest.send(apost);
		}
	} catch (e) {
		AjaxFailure(e)
	}
};

ajax.prototype.xform = function () 
{
	try
	{
		if (typeof XSLTProcessor != 'undefined') 
		{
			var xsltProcessor = new XSLTProcessor();
			xsltProcessor.importStylesheet(webkruncherxslt)
			this.transformed=
				xsltProcessor.transformToFragment(this.xml, this.target.ownerDocument);
		}
		else 
			if (typeof this.xml.transformNode != 'undefined') 
			{
				this.transformed=
					this.xml.transformNode(webkruncherxslt);
			}
			 else {
				AjaxFailure("ajax failed")
			 }
	} catch (e) {
		AjaxFailure(e)
	}
}




function InitializeAjax() 
{
	try { 
		LoadProgress("Initializing Ajax")
		new ajax('','',null,null);
	} catch(e) {
		//LoadProgress("Cannot start Ajax.")
	}
}

		
		
	var LoginMessages=null
	function ShowResults(form,resultnode)
	{
		if (resultnode.nodeName!="#text") LoginMessages.Write(resultnode.nodeName)
		for (this.i=0;this.i<resultnode.childNodes.length;this.i++)
			new ShowResults(form,resultnode.childNodes[this.i])
	}
	function LoginUser(forms)
	{
		try
		{
			if (!LoginMessages)
			{
				LoginMessages=new MsgTable(GetObject('DiagnosticsDiv'))
				LoginMessages.Color("black");
				LoginMessages.Background("gray");
				LoginMessages.MaxLength(20)
			}
			ShowObject("LoginText","block")
			this.results=GetObject("LoginText")
			this.values={}
			this.results.response=function(xml)
			{
				LoginMessages.Write("responded")
				new ShowResults(this,xml)
			}
			this.post="<form>\n<signals>\n";
			for (this.j=0;this.j<forms.childNodes.length;this.j++)
			{
				LoginMessages.Write(forms.childNodes[this.j])
				this.o=forms.childNodes[this.j]
				this.post+="<context>"
				//this.post+=this.o.childNodes[1]
				this.post+="</context>\n"
			}
			this.post+="</signals>\n</form>\n";
			
			LoginMessages.Write("Posting")
			new actionpost("/authorize",this.post,this.results);
		} catch (e) {
			alert(e)
		}
		return false;
	}
		
