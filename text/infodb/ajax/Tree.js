

var TraceNdx=0
String.prototype.replaceEvery = function(what, how) { return this.split(what).join(how); }
function Trace( what )
{
	tr=document.createElement("tr")
	tdndx=document.createElement("td")
	dndx=document.createElement("div")
	td=document.createElement("td")
	d=document.createElement("div")
	dndx.setAttribute("style","border:none;background:black;color:white;padding:2px;border-style:inset;font-weight:thin;font-size:0.8em;display:inline;")
	d.setAttribute("style","border:none;background:white;color:black;padding:2px;border-style:outset;font-weight:thin;font-size:0.8em;")
	d.innerHTML=what
	dndx.innerHTML=TraceNdx
	tdndx.appendChild(dndx)
	td.appendChild(d)
	tr.appendChild(tdndx)
	tr.appendChild(td)
	GetObject("Progress").appendChild( tr )
	TraceNdx++
}

function ErrorHandler( err )
{
	what=err.message + "<br /> <pre>" + err.stack  + "</pre>" 
	tr=document.createElement("tr")
	td=document.createElement("td")
	d=document.createElement("div")
	d.setAttribute("style","border:yellow;background:red;color:yellow;padding:8px;border-style:outset;font-weight:bold;");
	d.innerHTML=what
	td.appendChild(d)
	tr.appendChild(td)
	GetObject("Errors").appendChild( tr )
}

function opendiv( what) {
	GetObject( what ).style.display="block"
	GetObject( "open_"+what ).style.display="none"
	GetObject( "close_"+what ).style.display="inline"
}
function closediv( what) {
	GetObject( what ).style.display="none"
	GetObject( "open_"+what ).style.display="inline"
	GetObject( "close_"+what ).style.display="none"
}



function GetObject(name)
{
	if (document.layers){return document.layers[name];}
	else if (document.all){return document.all[name];}
	else if (document.getElementById){return document.getElementById(name);}
}

function JsonTree(){} 
var node=new JsonTree()
function TreeBuilder( json )
{
        try
        { 
		node.buildjson( json, "TreeRoot" , GetObject("TreeRoot") )
		var s = JSON.stringify( node, null, 2 ) // format
		var e = new Option(s).innerHTML // escape 
		WorkingObjFrame.insertAdjacentHTML('beforeend','<pre>'+e+'</pre>') // display
        } catch (e) {
		ErrorHandler( e )
        }

}


function Html( yourself, txt, what, target, editable, style )
{
        try
        {
		if ( editable )
		{
			d=document.createElement("input")
			d.setAttribute("style","margin-left:20px;"+style )
			d.setAttribute("ID",what)
			d.value=txt
			yourself.div=d
			target.appendChild( d )
			target.onclick = function () { yourself.click( what ) }; 
			target.onchange = function () { yourself.change( what ) }; 
		} else {
			d=document.createElement("div")
			d.setAttribute("style","margin-left:20px;"+style )
			d.setAttribute("ID",what)
			d.innerHTML=txt + " -> " + what
			yourself.div=d
			target.appendChild( d )
			target.onclick = function () { yourself.click( what ) }; 
		}
		return d
        } catch(e) {
		ErrorHandler( e )
        }
}

JsonTree.prototype.click = function ( id )
{
	GetObject( id ).style="color:red;"
	//alert( JSON.stringify( this.json ) )
}


JsonTree.prototype.change = function ( id )
{
	GetObject( id ).style="background:red;"
	this.value=GetObject( id ).value
	this.divid=id
	this.json=json
}

JsonTree.prototype.Submit = function ( result )
{
	if( typeof this == 'object' )
	{
		for ( ndx in this )
		{
			if( typeof this[ndx] == 'string' )
			{
				result[ ndx ] = this[ndx]
			}
		}
	}
	if( typeof this == 'object' )
		for ( ndx in this )
		{
			if( typeof this[ndx].Submit == 'function' )
			{
				result[ ndx ] = {}
				this[ ndx ].Submit( result[ ndx ] )
			}
		}
	return result
}

JsonTree.prototype.buildjson = function ( json, name, parentobject )
{
        try
        {
		if ( typeof json == 'object' )
		{
			for ( left in json )
			{
				css="color:gold;"
				OOO="Label"
				if ( JSON.stringify( json[ left ] )[ 0 ]  == '[' ) 
				{
					css="color:blue;"
					OOO="Array";
				}
				if ( JSON.stringify( json[ left ] )[ 0 ]  == '{' ) 
				{
					css="color:black;" 
					OOO="Object"
				}
				sub=Html( this, left, typeof json[ left ] + "_" + OOO + "_"+name+"_"+left , parentobject, false, css )
				this[ left ]=new JsonTree()
				this[ left ].buildjson( json[ left ], name+"_"+left, sub )
			}
		} 
		if ( typeof json == 'string' )
		{
				sub=Html( this, json, typeof json[ left ] + "_String_"+name+"_"+json , parentobject , true, "background:silver;color:green;")
				this[ left ]=new JsonTree()
				this[ left ].json=json
		} 
		if ( typeof json == 'number' )
		{
				sub=Html( this, json, typeof json[ left ] + "_String_"+name+"_"+json , parentobject , true, "background:beige;color:green;")
				this[ left ]=new JsonTree()
				this[ left ].json=json
		} 
        } catch(e) {
		ErrorHandler( e )
        }
}

