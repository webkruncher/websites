
function MsgTable (roottr)
{
	this.fontsize="10px";
	this.textcolor="silver";
	this.backgroundcolor="";
	this.roottr=roottr;
	this.LengthLimit=-1;
	this.MaxLength = function(l) {this.LengthLimit=l;}	
	this.msgcacher  = new Array()
	this.Write = function (txt)
	{
		l=0
		if ( this.roottr )
			if ( this.roottr.childNodes )
				if ( this.roottr.childNodes.length )
					l=this.roottr.childNodes.length;
		if (this.LengthLimit > 0)
			if (l > this.LengthLimit)
			{
				for (i=1;i<this.roottr.childNodes.length;i++)
				{
					ta=this.roottr.childNodes[i-1].firstChild.firstChild.firstChild.firstChild;
					tb=this.roottr.childNodes[i].firstChild.firstChild.firstChild.firstChild;
					ta.nodeValue=tb.nodeValue
				}
				this.roottr.childNodes[l-1].firstChild.firstChild.firstChild.firstChild.nodeValue=txt;
				return
			}

		tb=document.createElement("tbody");
		tr=document.createElement("tr");
		tr.setAttribute("class","utr");
		td=document.createElement("td");
		td.setAttribute("class","utd");
		d=document.createElement("div");
		d.setAttribute("class","UserMessageText")
		style="";
		if (this.backgroundcolor!="") style+="background:"+this.backgroundcolor+";"
		if (this.textcolor!="") style+="color:"+this.textcolor+";"
		if (this.fontsize!="") style+="font-size:"+this.fontsize+";"
		d.setAttribute("style",style);
		m=document.createTextNode(txt);
		this.lasttextnode=m
		d.appendChild(m)
		td.appendChild(d)
		tr.appendChild(td)
		tb.appendChild(tr)
		this.roottr.appendChild(tb)
	}


	this.FontSize = function(c)
	{
		this.fontsize=c;
	}
	this.Color = function(c)
	{
		this.textcolor=c;
	}
	this.Background = function(c)
	{
		this.backgroundcolor=c;
	}

	this.Hide = function()
	{
		try
		{
			for (i=0; i < this.roottr.childNodes.length;i++)
			{
				ta=this.roottr.childNodes[i].firstChild.firstChild.firstChild.firstChild;
				ta.nodeValue=''
			} 
		}catch (e) {
			CriticalFailure("Hidder: Write-> "+ txt)
		//	OneMessage("Cant Hide "+roottr.id+" - "+e)	
		}
	}
}	


