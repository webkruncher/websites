
function postscrubber()
{
	this.scrub=function(who,what)
	{
		//if ( buggness ) UserMessages.Write( what.nodeName )
		if(what.nodeName=="INPUT") this.addnode(who,what)
		for (this.i=0;this.i<what.childNodes.length;this.i++)
		{
			this.ps=new postscrubber();
			this.ps.scrub(who,what.childNodes[this.i])	
		}
	}

	this.addnode=function(who,what)
	{
		who.what+="<"+what.name+"><![CDATA["+what.value+"]]></"+what.name+">\n";
	}
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

function PostedForm( status )
{
	if ( buggness ) UserMessages.Write( "Status: " + parseInt( status ) )
}

function PostForm( Page, Action, form )
{
	f=GetObject( form )
	target=Navigate( Page, "", "", "", "", "Reset" )
	target.setAttribute('style','display:block;')
	target.innerHTML=""
	PostThisForm( "/" + Page + ".xml", f, Action, "PostedForm( reqnode.httpRequest.status )", target )
	return false
}


