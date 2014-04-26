
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="debug";
CFG_HOST="macos";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_INCDIRS="/Users/ricardo/MonkeyPro69/modules/monkey/native";
CFG_LANG="js";
CFG_MODPATH=".;/Users/ricardo/MonkeyPro69/modules/lp2/angelfont;/Users/ricardo/MonkeyPro69/modules;/Users/ricardo/MonkeyPro69/targets/html5/modules";
CFG_MOJO_AUTO_SUSPEND_ENABLED="0";
CFG_MONKEYDIR="";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
CFG_TRANSDIR="";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	print( str );
}

function debugStop(){
	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}

function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}

function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.ontouchstart=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}

function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<6 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.pause();
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;

	var chan=this.channels[channel];

	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;
	
	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state!=0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}

function BBThread(){
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}

function BBAsyncImageLoaderThread(){
	BBThread.call(this);
}

BBAsyncImageLoaderThread.prototype=extend_class( BBThread );

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;

	var image=new Image();
	
	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread.running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread.running=false;
	}
	
	thread.running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}


function BBAsyncSoundLoaderThread(){
	BBThread.call(this);
}

BBAsyncSoundLoaderThread.prototype=extend_class( BBThread );

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}
function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<99>";
	if((bb_app__app)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<99>";
		error("App has already been created");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<100>";
	bb_app__app=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<102>";
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<103>";
	bb_app__game.SetDelegate(bb_app__delegate);
	pop_err();
	return this;
}
c_App.prototype.p_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
function c_AngelFontExample(){
	c_App.call(this);
	this.m_font=null;
	this.m_inp=null;
	this.m_textBoxText="";
}
c_AngelFontExample.prototype=extend_class(c_App);
c_AngelFontExample.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<10>";
	c_App.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<10>";
	pop_err();
	return this;
}
c_AngelFontExample.prototype.p_OnCreate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<19>";
	bb_app_SetUpdateRate(30);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<21>";
	bb_input_EnableKeyboard();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<23>";
	this.m_font=c_AngelFont.m_new.call(new c_AngelFont,"");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<25>";
	dbg_object(this.m_font).m_italicSkew=0.15;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<26>";
	this.m_font.p_LoadFont("angel3");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<29>";
	this.m_inp=c_SimpleInput.m_new.call(new c_SimpleInput,"simple input",0,0);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<32>";
	this.m_textBoxText=bb_app_LoadString("simpletextboxhtml.txt");
	pop_err();
	return 0;
}
c_AngelFontExample.prototype.p_OnUpdate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<38>";
	this.m_inp.p_Update();
	pop_err();
	return 0;
}
c_AngelFontExample.prototype.p_OnRender=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<43>";
	bb_graphics_Cls(50.0,50.0,50.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<45>";
	print("llega");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<47>";
	this.m_font.p_DrawText2("Testing angel fonts",((bb_graphics_DeviceWidth()/2)|0),5,1);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<51>";
	this.m_inp.p_Draw2(5,45);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<56>";
	bb_graphics_PushMatrix();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<57>";
	bb_graphics_Scale(0.75,0.75);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<59>";
	c_SimpleTextBox.m_DrawHTML(this.m_textBoxText,426,180,832,1);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<60>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<26>";
	pop_err();
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<35>";
	this.m__graphics=(new gxtkGraphics);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<36>";
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<37>";
	bb_graphics_SetFont(null,32);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<39>";
	this.m__audio=(new gxtkAudio);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<40>";
	bb_audio_SetAudioDevice(this.m__audio);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<42>";
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<43>";
	bb_input_SetInputDevice(this.m__input);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<45>";
	bb_app__app.p_OnCreate();
	pop_err();
}
c_GameDelegate.prototype.SuspendGame=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<49>";
	bb_app__app.p_OnSuspend();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<50>";
	this.m__audio.Suspend();
	pop_err();
}
c_GameDelegate.prototype.ResumeGame=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<54>";
	this.m__audio.Resume();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<55>";
	bb_app__app.p_OnResume();
	pop_err();
}
c_GameDelegate.prototype.UpdateGame=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<59>";
	this.m__input.p_BeginUpdate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<60>";
	bb_app__app.p_OnUpdate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<61>";
	this.m__input.p_EndUpdate();
	pop_err();
}
c_GameDelegate.prototype.RenderGame=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<65>";
	var t_mode=this.m__graphics.BeginRender();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<66>";
	if((t_mode)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<66>";
		bb_graphics_BeginRender();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<67>";
	if(t_mode==2){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<67>";
		bb_app__app.p_OnLoading();
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<67>";
		bb_app__app.p_OnRender();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<68>";
	if((t_mode)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<68>";
		bb_graphics_EndRender();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<69>";
	this.m__graphics.EndRender();
	pop_err();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<73>";
	this.m__input.p_KeyEvent(t_event,t_data);
	pop_err();
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<77>";
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<81>";
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<85>";
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
	pop_err();
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<89>";
	this.m__graphics.DiscardGraphics();
	pop_err();
}
var bb_app__delegate=null;
var bb_app__game=null;
function bbMain(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont_example.monkey<68>";
	c_AngelFontExample.m_new.call(new c_AngelFontExample);
	pop_err();
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<58>";
	bb_graphics_device=t_dev;
	pop_err();
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<65>";
	pop_err();
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<109>";
	dbg_object(this).m_tx=t_tx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<110>";
	dbg_object(this).m_ty=t_ty;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<111>";
	dbg_object(this).m_flags=dbg_object(this).m_flags&-2;
	pop_err();
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<184>";
	this.m_flags=t_iflags;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<186>";
	if((this.m_flags&2)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
		var t_=this.m_frames;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
		var t_2=0;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
		while(t_2<t_.length){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
			var t_f=dbg_array(t_,t_2)[dbg_index];
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<187>";
			t_2=t_2+1;
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<188>";
			dbg_object(t_f).m_x+=1;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<190>";
		this.m_width-=2;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<193>";
	if((this.m_flags&4)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
		var t_3=this.m_frames;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
		var t_4=0;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
		while(t_4<t_3.length){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
			var t_f2=dbg_array(t_3,t_4)[dbg_index];
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<194>";
			t_4=t_4+1;
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<195>";
			dbg_object(t_f2).m_y+=1;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<197>";
		this.m_height-=2;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<200>";
	if((this.m_flags&1)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<201>";
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<204>";
	if(this.m_frames.length==1 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_x==0 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<205>";
		this.m_flags|=65536;
	}
	pop_err();
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<142>";
	this.m_surface=t_surf;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<144>";
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<145>";
	this.m_height=this.m_surface.Height();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<147>";
	this.m_frames=new_object_array(t_nframes);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<148>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<149>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0)
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<152>";
	this.p_ApplyFlags(t_iflags);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<153>";
	pop_err();
	return this;
}
c_Image.prototype.p_Grab=function(t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_source){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<157>";
	dbg_object(this).m_source=t_source;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<158>";
	this.m_surface=dbg_object(t_source).m_surface;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<160>";
	this.m_width=t_iwidth;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<161>";
	this.m_height=t_iheight;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<163>";
	this.m_frames=new_object_array(t_nframes);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<165>";
	var t_ix=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<165>";
	var t_iy=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<167>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<168>";
		if(t_ix+this.m_width>dbg_object(t_source).m_width){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<169>";
			t_ix=0;
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<170>";
			t_iy+=this.m_height;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<172>";
		if(t_ix+this.m_width>dbg_object(t_source).m_width || t_iy+this.m_height>dbg_object(t_source).m_height){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<173>";
			error("Image frame outside surface");
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<175>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_ix+dbg_object(dbg_array(dbg_object(t_source).m_frames,0)[dbg_index]).m_x,t_iy+dbg_object(dbg_array(dbg_object(t_source).m_frames,0)[dbg_index]).m_y)
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<176>";
		t_ix+=this.m_width;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<179>";
	this.p_ApplyFlags(t_iflags);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<180>";
	pop_err();
	return this;
}
c_Image.prototype.p_GrabImage=function(t_x,t_y,t_width,t_height,t_frames,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<104>";
	if(dbg_object(this).m_frames.length!=1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<104>";
		pop_err();
		return null;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<105>";
	var t_=(c_Image.m_new.call(new c_Image)).p_Grab(t_x,t_y,t_width,t_height,t_frames,t_flags,this);
	pop_err();
	return t_;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<24>";
	pop_err();
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<35>";
	if((this.m_matDirty)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<36>";
		bb_graphics_renderDevice.SetMatrix(dbg_object(bb_graphics_context).m_ix,dbg_object(bb_graphics_context).m_iy,dbg_object(bb_graphics_context).m_jx,dbg_object(bb_graphics_context).m_jy,dbg_object(bb_graphics_context).m_tx,dbg_object(bb_graphics_context).m_ty);
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<37>";
		this.m_matDirty=0;
	}
	pop_err();
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<3>";
	var t_i=t_path.indexOf(":/",0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<4>";
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<4>";
		pop_err();
		return t_path;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<5>";
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<5>";
		pop_err();
		return t_path;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/data.monkey<6>";
	var t_="monkey://data/"+t_path;
	pop_err();
	return t_;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<18>";
	dbg_object(this).m_x=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<19>";
	dbg_object(this).m_y=t_y;
	pop_err();
	return this;
}
c_Frame.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<13>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<234>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<235>";
	if((t_surf)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<235>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<239>";
	var t_atlas=bb_graphics_LoadImage(t_path,1,0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<240>";
	if((t_atlas)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<240>";
		var t_=t_atlas.p_GrabImage(0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<532>";
	if(!((t_font)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<533>";
		if(!((dbg_object(bb_graphics_context).m_defaultFont)!=null)){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<534>";
			dbg_object(bb_graphics_context).m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<536>";
		t_font=dbg_object(bb_graphics_context).m_defaultFont;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<537>";
		t_firstChar=32;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<539>";
	dbg_object(bb_graphics_context).m_font=t_font;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<540>";
	dbg_object(bb_graphics_context).m_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<17>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<20>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<21>";
		dbg_array(this.m__joyStates,t_i)[dbg_index]=c_JoyState.m_new.call(new c_JoyState)
	}
	pop_err();
	return this;
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<173>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<174>";
		var t_state=dbg_array(this.m__joyStates,t_i)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<175>";
		if(!BBGame.Game().PollJoystick(t_i,dbg_object(t_state).m_joyx,dbg_object(t_state).m_joyy,dbg_object(t_state).m_joyz,dbg_object(t_state).m_buttons)){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<175>";
			break;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<176>";
		for(var t_j=0;t_j<32;t_j=t_j+1){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<177>";
			var t_key=256+t_i*32+t_j;
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<178>";
			if(dbg_array(dbg_object(t_state).m_buttons,t_j)[dbg_index]){
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<179>";
				if(!dbg_array(this.m__keyDown,t_key)[dbg_index]){
					err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<180>";
					dbg_array(this.m__keyDown,t_key)[dbg_index]=true
					err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<181>";
					dbg_array(this.m__keyHit,t_key)[dbg_index]+=1
				}
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<184>";
				dbg_array(this.m__keyDown,t_key)[dbg_index]=false
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_EndUpdate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<191>";
	for(var t_i=0;t_i<512;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<192>";
		dbg_array(this.m__keyHit,t_i)[dbg_index]=0
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<194>";
	this.m__charGet=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<195>";
	this.m__charPut=0;
	pop_err();
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<99>";
	var t_=t_event;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<100>";
	if(t_==1){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<101>";
		dbg_array(this.m__keyDown,t_data)[dbg_index]=true
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<102>";
		dbg_array(this.m__keyHit,t_data)[dbg_index]+=1
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<103>";
		if(t_data==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<104>";
			dbg_array(this.m__keyDown,384)[dbg_index]=true
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<105>";
			dbg_array(this.m__keyHit,384)[dbg_index]+=1
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<106>";
			if(t_data==384){
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<107>";
				dbg_array(this.m__keyDown,1)[dbg_index]=true
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<108>";
				dbg_array(this.m__keyHit,1)[dbg_index]+=1
			}
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<110>";
		if(t_==2){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<111>";
			dbg_array(this.m__keyDown,t_data)[dbg_index]=false
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<112>";
			if(t_data==1){
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<113>";
				dbg_array(this.m__keyDown,384)[dbg_index]=false
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<114>";
				if(t_data==384){
					err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<115>";
					dbg_array(this.m__keyDown,1)[dbg_index]=false
				}
			}
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<117>";
			if(t_==3){
				err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<118>";
				if(this.m__charPut<this.m__charQueue.length){
					err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<119>";
					dbg_array(this.m__charQueue,this.m__charPut)[dbg_index]=t_data
					err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<120>";
					this.m__charPut+=1;
				}
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<126>";
	var t_=t_event;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<127>";
	if(t_==4){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<128>";
		this.p_KeyEvent(1,1+t_data);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<129>";
		if(t_==5){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<130>";
			this.p_KeyEvent(2,1+t_data);
			pop_err();
			return;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<132>";
			if(t_==6){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<136>";
	this.m__mouseX=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<137>";
	this.m__mouseY=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<138>";
	dbg_array(this.m__touchX,0)[dbg_index]=t_x
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<139>";
	dbg_array(this.m__touchY,0)[dbg_index]=t_y
	pop_err();
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<143>";
	var t_=t_event;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<144>";
	if(t_==7){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<145>";
		this.p_KeyEvent(1,384+t_data);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<146>";
		if(t_==8){
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<147>";
			this.p_KeyEvent(2,384+t_data);
			pop_err();
			return;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<149>";
			if(t_==9){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<153>";
	dbg_array(this.m__touchX,t_data)[dbg_index]=t_x
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<154>";
	dbg_array(this.m__touchY,t_data)[dbg_index]=t_y
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<155>";
	if(t_data==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<156>";
		this.m__mouseX=t_x;
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<157>";
		this.m__mouseY=t_y;
	}
	pop_err();
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<162>";
	var t_=t_event;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<163>";
	if(t_==10){
	}else{
		pop_err();
		return;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<167>";
	this.m__accelX=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<168>";
	this.m__accelY=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<169>";
	this.m__accelZ=t_z;
	pop_err();
}
c_InputDevice.prototype.p_SetKeyboardEnabled=function(t_enabled){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<35>";
	BBGame.Game().SetKeyboardEnabled(t_enabled);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<36>";
	pop_err();
	return 1;
}
c_InputDevice.prototype.p_GetChar=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<50>";
	if(this.m__charGet==this.m__charPut){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<50>";
		pop_err();
		return 0;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<51>";
	var t_chr=dbg_array(this.m__charQueue,this.m__charGet)[dbg_index];
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<52>";
	this.m__charGet+=1;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<53>";
	pop_err();
	return t_chr;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<8>";
	pop_err();
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<16>";
	bb_input_device=t_dev;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<307>";
	dbg_object(bb_graphics_context).m_ix=t_ix;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<308>";
	dbg_object(bb_graphics_context).m_iy=t_iy;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<309>";
	dbg_object(bb_graphics_context).m_jx=t_jx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<310>";
	dbg_object(bb_graphics_context).m_jy=t_jy;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<311>";
	dbg_object(bb_graphics_context).m_tx=t_tx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<312>";
	dbg_object(bb_graphics_context).m_ty=t_ty;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<313>";
	dbg_object(bb_graphics_context).m_tformed=((t_ix!=1.0 || t_iy!=.0 || t_jx!=.0 || t_jy!=1.0 || t_tx!=.0 || t_ty!=.0)?1:0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<314>";
	dbg_object(bb_graphics_context).m_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<303>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<249>";
	dbg_object(bb_graphics_context).m_color_r=t_r;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<250>";
	dbg_object(bb_graphics_context).m_color_g=t_g;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<251>";
	dbg_object(bb_graphics_context).m_color_b=t_b;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<252>";
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<266>";
	dbg_object(bb_graphics_context).m_alpha=t_alpha;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<267>";
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<275>";
	dbg_object(bb_graphics_context).m_blend=t_blend;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<276>";
	bb_graphics_renderDevice.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<226>";
	var t_=bb_graphics_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<230>";
	var t_=bb_graphics_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<284>";
	dbg_object(bb_graphics_context).m_scissor_x=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<285>";
	dbg_object(bb_graphics_context).m_scissor_y=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<286>";
	dbg_object(bb_graphics_context).m_scissor_width=t_width;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<287>";
	dbg_object(bb_graphics_context).m_scissor_height=t_height;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<288>";
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<212>";
	bb_graphics_renderDevice=bb_graphics_device;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<213>";
	dbg_object(bb_graphics_context).m_matrixSp=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<214>";
	bb_graphics_SetMatrix(1.0,.0,.0,1.0,.0,.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<215>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<216>";
	bb_graphics_SetAlpha(1.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<217>";
	bb_graphics_SetBlend(0);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<218>";
	bb_graphics_SetScissor(.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<222>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<139>";
	bb_app__updateRate=t_hertz;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<140>";
	bb_app__game.SetUpdateRate(t_hertz);
	pop_err();
	return 0;
}
function bb_input_EnableKeyboard(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<45>";
	var t_=bb_input_device.p_SetKeyboardEnabled(true);
	pop_err();
	return t_;
}
function c_AngelFont(){
	Object.call(this);
	this.m_iniText="";
	this.m_kernPairs=c_StringMap.m_new.call(new c_StringMap);
	this.m_chars=new_object_array(256);
	this.m_height=0;
	this.m_heightOffset=9999;
	this.m_image=null;
	this.m_name="";
	this.m_italicSkew=0.25;
	this.m_xOffset=0;
	this.m_useKerning=true;
}
c_AngelFont.m_error="";
c_AngelFont.m_current=null;
c_AngelFont.prototype.p_LoadFont=function(t_url){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<61>";
	c_AngelFont.m_error="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<62>";
	c_AngelFont.m_current=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<63>";
	this.m_iniText=bb_app_LoadString(t_url+".txt");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<64>";
	var t_lines=this.m_iniText.split(String.fromCharCode(10));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
	var t_=t_lines;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
	var t_2=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
	while(t_2<t_.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
		var t_line=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<65>";
		t_2=t_2+1;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<67>";
		t_line=string_trim(t_line);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<69>";
		if(string_startswith(t_line,"id,") || t_line==""){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<69>";
			continue;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<70>";
		if(string_startswith(t_line,"first,")){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<72>";
			continue;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<74>";
		var t_data=t_line.split(",");
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<76>";
		for(var t_i=0;t_i<t_data.length;t_i=t_i+1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<77>";
			dbg_array(t_data,t_i)[dbg_index]=string_trim(dbg_array(t_data,t_i)[dbg_index])
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<80>";
		c_AngelFont.m_error=c_AngelFont.m_error+(String(t_data.length)+",");
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<81>";
		if(t_data.length>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<82>";
			if(t_data.length==3){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<84>";
				this.m_kernPairs.p_Insert(String.fromCharCode(parseInt((dbg_array(t_data,0)[dbg_index]),10))+"_"+String.fromCharCode(parseInt((dbg_array(t_data,1)[dbg_index]),10)),c_KernPair.m_new.call(new c_KernPair,parseInt((dbg_array(t_data,0)[dbg_index]),10),parseInt((dbg_array(t_data,1)[dbg_index]),10),parseInt((dbg_array(t_data,2)[dbg_index]),10)));
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<86>";
				if(t_data.length>=8){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<87>";
					dbg_array(this.m_chars,parseInt((dbg_array(t_data,0)[dbg_index]),10))[dbg_index]=c_Char.m_new.call(new c_Char,parseInt((dbg_array(t_data,1)[dbg_index]),10),parseInt((dbg_array(t_data,2)[dbg_index]),10),parseInt((dbg_array(t_data,3)[dbg_index]),10),parseInt((dbg_array(t_data,4)[dbg_index]),10),parseInt((dbg_array(t_data,5)[dbg_index]),10),parseInt((dbg_array(t_data,6)[dbg_index]),10),parseInt((dbg_array(t_data,7)[dbg_index]),10))
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<88>";
					var t_ch=dbg_array(this.m_chars,parseInt((dbg_array(t_data,0)[dbg_index]),10))[dbg_index];
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<89>";
					if(dbg_object(t_ch).m_height>dbg_object(this).m_height){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<89>";
						dbg_object(this).m_height=dbg_object(t_ch).m_height;
					}
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<90>";
					if(dbg_object(t_ch).m_yOffset<dbg_object(this).m_heightOffset){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<90>";
						dbg_object(this).m_heightOffset=dbg_object(t_ch).m_yOffset;
					}
				}
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<97>";
	this.m_image=bb_graphics_LoadImage(t_url+".png",1,c_Image.m_DefaultFlags);
	pop_err();
}
c_AngelFont.m__list=null;
c_AngelFont.m_new=function(t_url){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<48>";
	if(t_url!=""){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<49>";
		this.p_LoadFont(t_url);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<50>";
		dbg_object(this).m_name=t_url;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<51>";
		c_AngelFont.m__list.p_Insert2(t_url,this);
	}
	pop_err();
	return this;
}
c_AngelFont.m_GetCurrent=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<105>";
	pop_err();
	return c_AngelFont.m_current;
}
c_AngelFont.prototype.p_DrawText=function(t_txt,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<136>";
	var t_prevChar="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<137>";
	this.m_xOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<139>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<140>";
		var t_asc=t_txt.charCodeAt(t_i);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<141>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<142>";
		var t_thisChar=String.fromCharCode(t_asc);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<143>";
		if(t_ac!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<144>";
			if(this.m_useKerning){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<145>";
				var t_key=t_prevChar+"_"+t_thisChar;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<146>";
				if(this.m_kernPairs.p_Contains(t_key)){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<147>";
					this.m_xOffset+=dbg_object(this.m_kernPairs.p_Get(t_key)).m_amount;
				}
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<150>";
			t_ac.p_Draw(this.m_image,t_x+this.m_xOffset,t_y);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<151>";
			this.m_xOffset+=dbg_object(t_ac).m_xAdvance;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<152>";
			t_prevChar=t_thisChar;
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_TextWidth=function(t_txt){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<252>";
	var t_prevChar="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<253>";
	var t_width=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<254>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<255>";
		var t_asc=t_txt.charCodeAt(t_i);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<256>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<257>";
		var t_thisChar=String.fromCharCode(t_asc);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<258>";
		if(t_ac!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<259>";
			if(this.m_useKerning){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<260>";
				var t_key=t_prevChar+"_"+t_thisChar;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<261>";
				if(this.m_kernPairs.p_Contains(t_key)){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<263>";
					t_width+=dbg_object(this.m_kernPairs.p_Get(t_key)).m_amount;
				}
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<267>";
			t_width+=dbg_object(t_ac).m_xAdvance;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<268>";
			t_prevChar=t_thisChar;
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<271>";
	pop_err();
	return t_width;
}
c_AngelFont.prototype.p_DrawText2=function(t_txt,t_x,t_y,t_align){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<158>";
	this.m_xOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<159>";
	var t_=t_align;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<160>";
	if(t_==1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<161>";
		this.p_DrawText(t_txt,t_x-((this.p_TextWidth(t_txt)/2)|0),t_y);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<162>";
		if(t_==2){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<163>";
			this.p_DrawText(t_txt,t_x-this.p_TextWidth(t_txt),t_y);
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<164>";
			if(t_==0){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<166>";
				this.p_DrawText(t_txt,t_x,t_y);
			}
		}
	}
	pop_err();
}
c_AngelFont.m_StripHTML=function(t_txt){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<246>";
	var t_plainText=string_replace(t_txt,"</","<");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<247>";
	t_plainText=string_replace(t_plainText,"<b>","");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<248>";
	var t_=string_replace(t_plainText,"<i>","");
	pop_err();
	return t_;
}
c_AngelFont.prototype.p_TextHeight=function(t_txt){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<275>";
	var t_h=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<276>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<277>";
		var t_asc=t_txt.charCodeAt(t_i);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<278>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<279>";
		if(dbg_object(t_ac).m_height>t_h){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<279>";
			t_h=dbg_object(t_ac).m_height;
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<281>";
	pop_err();
	return t_h;
}
c_AngelFont.prototype.p_DrawHTML=function(t_txt,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<171>";
	var t_prevChar="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<172>";
	this.m_xOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<173>";
	var t_italic=false;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<174>";
	var t_bold=false;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<175>";
	var t_th=(this.p_TextHeight(t_txt));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<177>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<180>";
		while(t_txt.slice(t_i,t_i+1)=="<"){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<181>";
			var t_=t_txt.slice(t_i+1,t_i+3);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<182>";
			if(t_=="i>"){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<183>";
				t_italic=true;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<184>";
				t_i+=3;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<185>";
				if(t_=="b>"){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<186>";
					t_bold=true;
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<187>";
					t_i+=3;
				}else{
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<189>";
					var t_2=t_txt.slice(t_i+1,t_i+4);
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<190>";
					if(t_2=="/i>"){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<191>";
						t_italic=false;
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<192>";
						t_i+=4;
					}else{
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<193>";
						if(t_2=="/b>"){
							err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<194>";
							t_bold=false;
							err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<195>";
							t_i+=4;
						}
					}
				}
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<198>";
			if(t_i>=t_txt.length){
				pop_err();
				return;
			}
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<202>";
		var t_asc=t_txt.charCodeAt(t_i);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<203>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<204>";
		var t_thisChar=String.fromCharCode(t_asc);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<205>";
		if(t_ac!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<206>";
			if(this.m_useKerning){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<207>";
				var t_key=t_prevChar+"_"+t_thisChar;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<208>";
				if(this.m_kernPairs.p_Contains(t_key)){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<209>";
					this.m_xOffset+=dbg_object(this.m_kernPairs.p_Get(t_key)).m_amount;
				}
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<212>";
			if(t_italic==false){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<213>";
				t_ac.p_Draw(this.m_image,t_x+this.m_xOffset,t_y);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<214>";
				if(t_bold){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<215>";
					t_ac.p_Draw(this.m_image,t_x+this.m_xOffset+1,t_y);
				}
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<218>";
				bb_graphics_PushMatrix();
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<219>";
				bb_graphics_Transform(1.0,.0,-this.m_italicSkew,1.0,(t_x+this.m_xOffset)+t_th*this.m_italicSkew,(t_y));
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<220>";
				t_ac.p_Draw(this.m_image,0,0);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<221>";
				if(t_bold){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<222>";
					t_ac.p_Draw(this.m_image,1,0);
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<224>";
				bb_graphics_PopMatrix();
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<226>";
			this.m_xOffset+=dbg_object(t_ac).m_xAdvance;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<227>";
			t_prevChar=t_thisChar;
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_DrawHTML2=function(t_txt,t_x,t_y,t_align){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<233>";
	this.m_xOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<234>";
	var t_=t_align;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<235>";
	if(t_==1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<236>";
		this.p_DrawHTML(t_txt,t_x-((this.p_TextWidth(c_AngelFont.m_StripHTML(t_txt))/2)|0),t_y);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<237>";
		if(t_==2){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<238>";
			this.p_DrawHTML(t_txt,t_x-this.p_TextWidth(c_AngelFont.m_StripHTML(t_txt)),t_y);
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<239>";
			if(t_==0){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<241>";
				this.p_DrawHTML(t_txt,t_x,t_y);
			}
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_GetChars=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/angelfont.monkey<56>";
	pop_err();
	return this.m_chars;
}
function bb_app_LoadString(t_path){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<135>";
	var t_=bb_app__game.LoadString(bb_data_FixDataPath(t_path));
	pop_err();
	return t_;
}
function c_KernPair(){
	Object.call(this);
	this.m_first="";
	this.m_second="";
	this.m_amount=0;
}
c_KernPair.m_new=function(t_first,t_second,t_amount){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/kernpair.monkey<9>";
	dbg_object(this).m_first=String(t_first);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/kernpair.monkey<10>";
	dbg_object(this).m_second=String(t_second);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/kernpair.monkey<11>";
	dbg_object(this).m_amount=t_amount;
	pop_err();
	return this;
}
c_KernPair.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/kernpair.monkey<2>";
	pop_err();
	return this;
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<223>";
					this.p_RotateLeft(t_node);
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<227>";
				this.p_RotateRight(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<239>";
					this.p_RotateRight(t_node);
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<243>";
				this.p_RotateLeft(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map.prototype.p_Set=function(t_key,t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<45>";
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<53>";
		this.p_InsertFixup(t_node);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map.prototype.p_Insert=function(t_key,t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<126>";
	var t_=this.p_Set(t_key,t_value);
	pop_err();
	return t_;
}
c_Map.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map.prototype.p_Contains=function(t_key){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<25>";
	var t_=this.p_FindNode(t_key)!=null;
	pop_err();
	return t_;
}
c_Map.prototype.p_Get=function(t_key){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return null;
}
function c_StringMap(){
	c_Map.call(this);
}
c_StringMap.prototype=extend_class(c_Map);
c_StringMap.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	c_Map.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function c_Node(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_Char(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
	this.m_width=0;
	this.m_height=0;
	this.m_xOffset=0;
	this.m_yOffset=0;
	this.m_xAdvance=0;
}
c_Char.m_new=function(t_x,t_y,t_w,t_h,t_xoff,t_yoff,t_xadv){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<17>";
	dbg_object(this).m_x=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<18>";
	dbg_object(this).m_y=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<19>";
	dbg_object(this).m_width=t_w;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<20>";
	dbg_object(this).m_height=t_h;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<22>";
	dbg_object(this).m_xOffset=t_xoff;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<23>";
	dbg_object(this).m_yOffset=t_yoff;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<24>";
	dbg_object(this).m_xAdvance=t_xadv;
	pop_err();
	return this;
}
c_Char.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<3>";
	pop_err();
	return this;
}
c_Char.prototype.p_Draw=function(t_fontImage,t_linex,t_liney){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/char.monkey<28>";
	bb_graphics_DrawImageRect(t_fontImage,(t_linex+this.m_xOffset),(t_liney+this.m_yOffset),this.m_x,this.m_y,this.m_width,this.m_height,0);
	pop_err();
	return 0;
}
function c_Map2(){
	Object.call(this);
	this.m_root=null;
}
c_Map2.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map2.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_RotateLeft2=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_RotateRight2=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_InsertFixup2=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<223>";
					this.p_RotateLeft2(t_node);
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<227>";
				this.p_RotateRight2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<239>";
					this.p_RotateRight2(t_node);
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<243>";
				this.p_RotateLeft2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map2.prototype.p_Set2=function(t_key,t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<45>";
	t_node=c_Node2.m_new.call(new c_Node2,t_key,t_value,-1,t_parent);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<53>";
		this.p_InsertFixup2(t_node);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map2.prototype.p_Insert2=function(t_key,t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<126>";
	var t_=this.p_Set2(t_key,t_value);
	pop_err();
	return t_;
}
function c_StringMap2(){
	c_Map2.call(this);
}
c_StringMap2.prototype=extend_class(c_Map2);
c_StringMap2.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	c_Map2.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap2.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function c_Node2(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node2.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node2.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_SimpleInput(){
	Object.call(this);
	this.m_text="";
	this.m_x=0;
	this.m_y=0;
	this.m_font=null;
	this.m_height=0;
	this.m_heightOffset=0;
	this.m_cursorPos=0;
}
c_SimpleInput.m_new=function(t_txt,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<27>";
	dbg_object(this).m_text=t_txt;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<28>";
	dbg_object(this).m_x=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<29>";
	dbg_object(this).m_y=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<30>";
	dbg_object(this).m_font=c_AngelFont.m_GetCurrent();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<31>";
	dbg_object(this).m_height=dbg_object(dbg_object(this).m_font).m_height;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<32>";
	dbg_object(this).m_heightOffset=dbg_object(dbg_object(this).m_font).m_heightOffset;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<33>";
	dbg_object(this).m_cursorPos=t_txt.length;
	pop_err();
	return this;
}
c_SimpleInput.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<7>";
	pop_err();
	return this;
}
c_SimpleInput.m_count=0;
c_SimpleInput.prototype.p_Update=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<46>";
	c_SimpleInput.m_count=(c_SimpleInput.m_count+1) % 7;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<47>";
	var t_asc=bb_input_GetChar();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<48>";
	if(t_asc>31 && t_asc<127){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<49>";
		this.m_text=this.m_text.slice(0,this.m_cursorPos)+String.fromCharCode(t_asc)+this.m_text.slice(this.m_cursorPos,this.m_text.length);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<50>";
		this.m_cursorPos+=1;
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<52>";
		var t_=t_asc;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<53>";
		if(t_==8){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<54>";
			if(this.m_cursorPos>0){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<55>";
				this.m_text=this.m_text.slice(0,this.m_cursorPos-1)+this.m_text.slice(this.m_cursorPos,this.m_text.length);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<56>";
				this.m_cursorPos-=1;
			}
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<58>";
			if(t_==13){
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<61>";
				if(t_==65573){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<62>";
					this.m_cursorPos-=1;
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<63>";
					if(this.m_cursorPos<0){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<63>";
						this.m_cursorPos=0;
					}
				}else{
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<65>";
					if(t_==65575){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<66>";
						this.m_cursorPos+=1;
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<67>";
						if(this.m_cursorPos>this.m_text.length){
							err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<67>";
							this.m_cursorPos=this.m_text.length;
						}
					}
				}
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<70>";
	pop_err();
	return this.m_text;
}
c_SimpleInput.prototype.p_Draw2=function(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<41>";
	this.m_font.p_DrawText(this.m_text,t_x,t_y);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<42>";
	if(c_SimpleInput.m_count>3){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<42>";
		bb_graphics_DrawRect((t_x+this.m_font.p_TextWidth(this.m_text.slice(0,this.m_cursorPos))),(t_y+this.m_heightOffset),2.0,(this.m_height));
	}
	pop_err();
}
c_SimpleInput.prototype.p_Draw3=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpleinput.monkey<37>";
	this.p_Draw2(this.m_x,this.m_y);
	pop_err();
}
function bb_input_GetChar(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<61>";
	var t_=bb_input_device.p_GetChar();
	pop_err();
	return t_;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<48>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<48>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<372>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<374>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_frame){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<482>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<483>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<483>";
		error("Invalid image frame");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<484>";
	if(t_srcX<0 || t_srcY<0 || t_srcX+t_srcWidth>dbg_object(t_image).m_width || t_srcY+t_srcHeight>dbg_object(t_image).m_height){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<484>";
		error("Invalid image rectangle");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<487>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<489>";
	bb_graphics_context.p_Validate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<491>";
	bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,-dbg_object(t_image).m_tx+t_x,-dbg_object(t_image).m_ty+t_y,t_srcX+dbg_object(t_f).m_x,t_srcY+dbg_object(t_f).m_y,t_srcWidth,t_srcHeight);
	pop_err();
	return 0;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<328>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<329>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index]=dbg_object(bb_graphics_context).m_ix
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<330>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index]=dbg_object(bb_graphics_context).m_iy
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<331>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index]=dbg_object(bb_graphics_context).m_jx
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<332>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index]=dbg_object(bb_graphics_context).m_jy
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<333>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index]=dbg_object(bb_graphics_context).m_tx
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<334>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]=dbg_object(bb_graphics_context).m_ty
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<335>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<349>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).m_ix+t_iy*dbg_object(bb_graphics_context).m_jx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<350>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).m_iy+t_iy*dbg_object(bb_graphics_context).m_jy;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<351>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).m_ix+t_jy*dbg_object(bb_graphics_context).m_jx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<352>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).m_iy+t_jy*dbg_object(bb_graphics_context).m_jy;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<353>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).m_ix+t_ty*dbg_object(bb_graphics_context).m_jx+dbg_object(bb_graphics_context).m_tx;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<354>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).m_iy+t_ty*dbg_object(bb_graphics_context).m_jy+dbg_object(bb_graphics_context).m_ty;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<355>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<345>";
	bb_graphics_Transform(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<359>";
	bb_graphics_Transform(1.0,.0,.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<367>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),.0,.0);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<363>";
	bb_graphics_Transform(t_x,.0,.0,t_y,.0,.0);
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<339>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp-6;
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<340>";
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<341>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect2(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<497>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<498>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<498>";
		error("Invalid image frame");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<499>";
	if(t_srcX<0 || t_srcY<0 || t_srcX+t_srcWidth>dbg_object(t_image).m_width || t_srcY+t_srcHeight>dbg_object(t_image).m_height){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<499>";
		error("Invalid image rectangle");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<502>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<504>";
	bb_graphics_PushMatrix();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<506>";
	bb_graphics_Translate(t_x,t_y);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<507>";
	bb_graphics_Rotate(t_rotation);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<508>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<509>";
	bb_graphics_Translate(-dbg_object(t_image).m_tx,-dbg_object(t_image).m_ty);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<511>";
	bb_graphics_context.p_Validate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<513>";
	bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,.0,.0,t_srcX+dbg_object(t_f).m_x,t_srcY+dbg_object(t_f).m_y,t_srcWidth,t_srcHeight);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<515>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<387>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<389>";
	bb_graphics_context.p_Validate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<390>";
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	pop_err();
	return 0;
}
function c_SimpleTextBox(){
	Object.call(this);
}
c_SimpleTextBox.m_font=null;
c_SimpleTextBox.m_align=0;
c_SimpleTextBox.m_yOffset=0;
c_SimpleTextBox.m_lineGap=0;
c_SimpleTextBox.m_DrawTextLineHTML=function(t_txt,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<157>";
	c_SimpleTextBox.m_font.p_DrawHTML2(t_txt,t_x,t_y,c_SimpleTextBox.m_align);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<158>";
	c_SimpleTextBox.m_yOffset+=c_SimpleTextBox.m_lineGap+dbg_object(c_SimpleTextBox.m_font).m_height;
	pop_err();
}
c_SimpleTextBox.m_DrawTextLine=function(t_txt,t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<152>";
	c_SimpleTextBox.m_font.p_DrawText2(t_txt,t_x,t_y,c_SimpleTextBox.m_align);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<153>";
	c_SimpleTextBox.m_yOffset+=c_SimpleTextBox.m_lineGap+dbg_object(c_SimpleTextBox.m_font).m_height;
	pop_err();
}
c_SimpleTextBox.m_DrawHTML=function(t_text,t_x,t_y,t_width,t_alignment){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<79>";
	var t_thisLine="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<80>";
	var t_charOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<82>";
	var t_wordLen=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<83>";
	var t_word="";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<85>";
	c_SimpleTextBox.m_font=c_AngelFont.m_current;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<86>";
	c_SimpleTextBox.m_align=t_alignment;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<88>";
	c_SimpleTextBox.m_yOffset=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<89>";
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<90>";
		if(t_y+c_SimpleTextBox.m_yOffset>bb_graphics_DeviceHeight()){
			pop_err();
			return;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<94>";
		var t_asc=t_text.charCodeAt(t_i);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<95>";
		var t_=t_asc;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<96>";
		if(t_==32){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<97>";
			t_wordLen=c_AngelFont.m_current.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<98>";
			if(t_charOffset+t_wordLen>t_width){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<99>";
				c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<100>";
				t_thisLine="";
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<101>";
				t_charOffset=0;
			}
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<104>";
			t_charOffset+=t_wordLen+dbg_object(dbg_array(c_SimpleTextBox.m_font.p_GetChars(),32)[dbg_index]).m_xAdvance;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<105>";
			t_thisLine=t_thisLine+(t_word+" ");
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<107>";
			t_word="";
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<109>";
			if(t_==10){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<110>";
				t_wordLen=c_SimpleTextBox.m_font.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<111>";
				if(t_charOffset+t_wordLen>t_width){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<112>";
					c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<113>";
					t_thisLine="";
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<115>";
				t_thisLine=t_thisLine+t_word;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<117>";
				c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<119>";
				t_thisLine="";
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<120>";
				t_charOffset=0;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<121>";
				t_word="";
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<122>";
				if(t_==60){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<123>";
					if(t_text.slice(t_i+1,t_i+3)=="i>" || t_text.slice(t_i+1,t_i+3)=="b>"){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<124>";
						t_word=t_word+t_text.slice(t_i,t_i+3);
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<125>";
						t_i+=2;
					}else{
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<127>";
						if(t_text.slice(t_i+1,t_i+4)=="/i>" || t_text.slice(t_i+1,t_i+4)=="/b>"){
							err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<128>";
							t_word=t_word+t_text.slice(t_i,t_i+4);
							err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<129>";
							t_i+=3;
						}
					}
				}else{
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<133>";
					var t_ch=dbg_array(c_SimpleTextBox.m_font.p_GetChars(),t_asc)[dbg_index];
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<134>";
					t_word=t_word+String.fromCharCode(t_asc);
				}
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<138>";
	if(t_word!=""){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<139>";
		t_wordLen=c_SimpleTextBox.m_font.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<140>";
		if(t_charOffset+t_wordLen>t_width){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<141>";
			c_SimpleTextBox.m_DrawTextLine(t_thisLine,t_x,t_y);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<142>";
			t_thisLine="";
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<144>";
		t_thisLine=t_thisLine+t_word;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<146>";
	if(t_thisLine!=""){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/angelfont/simpletextbox.monkey<147>";
		c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y);
	}
	pop_err();
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	c_AngelFont.m_error="";
	c_AngelFont.m_current=null;
	c_AngelFont.m__list=c_StringMap2.m_new.call(new c_StringMap2);
	c_SimpleInput.m_count=0;
	c_SimpleTextBox.m_font=null;
	c_SimpleTextBox.m_align=0;
	c_SimpleTextBox.m_yOffset=0;
	c_SimpleTextBox.m_lineGap=5;
}
//${TRANSCODE_END}
