
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
CFG_MODPATH=".;/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook;/Users/ricardo/MonkeyPro69/modules;/Users/ricardo/MonkeyPro69/targets/html5/modules";
CFG_MOJO_AUTO_SUSPEND_ENABLED="0";
CFG_MONKEYDIR="";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json|*.php";
CFG_TRANSDIR="";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[comment.png];type=image/png;width=376;height=108;\n[sig_in.png];type=image/png;width=330;height=82;\n[mojo_font.png];type=image/png;width=864;height=13;\n";
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
function lpGetLanguage()
{
    var language = window.navigator.userLanguage || window.navigator.language;
    return language;
}function Finish()
{
	window.location.href = "http://www.loadingplay.com";
}

lpLaunchBrowser=function(address, windowName)
{
    //window.open(address, windowName);
    window.open(address, windowName);
}

function changeUrl()
{
    alert("llega");
}



// facebook variables
var lpfb_lasturl = document.location.href;
var lpfb_changelistener = null;
var lpfb_instance = null;

// url change listener for javascript
lpfb_UrlChangeListener=function()
{   
    if (lpfb_lasturl != document.location.href) {
        clearTimeout(lpfb_changelistener);
        
        // code when changed        
        var token = document.location.href.split("#?token=")[1];
        console.log("access_token : " + token);
        lpfb_instance.p_OnLoginResponse( token )
    };

    lpfb_lasturl = document.location.href;
}

// facebook dialog opener
lpFacebookLaunchBrowser=function(address, lpfacebook)
{
    window.open(address, "_blank", "width=100,height=100");

    lpfb_lasturl = document.location.href;
    lpfb_changelistener =setInterval(function(){lpfb_UrlChangeListener()},100);

    lpfb_instance = lpfacebook
}
var lprc;
// implementing the lpHttpRequest class
lpHttpRequestBase=function()
{

    var lpxmlhttp;

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        lpxmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        lpxmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    lpxmlhttp.onreadystatechange=function()
        {
            if (lpxmlhttp.readyState==4 && lpxmlhttp.status==200)
            {
                lprc.p_OnHttpRequestComplete(lpxmlhttp.responseText);
            }
        };

    this.lpxmlhttp = lpxmlhttp;

};

lpHttpRequestBase.prototype.Open=function( query_method, url, requestComplete )
{
    // debug: alert(query_method + " " + url);
    this.lpxmlhttp.open(query_method,url,true);
    this.method = query_method

    lprc = requestComplete
};

lpHttpRequestBase.prototype.Send=function( params )
{
    // debug: alert( this.method );
    
    // if method is post must set some headers.
    if (this.method == "POST") 
    {
        this.lpxmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.lpxmlhttp.setRequestHeader("Content-length", params.length);
        this.lpxmlhttp.setRequestHeader("Connection", "close");
    };

    this.lpxmlhttp.send(params);
};

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
function c_lpSceneMngr(){
	c_App.call(this);
	this.m__loadingTween=null;
	this.m__currentCamera=null;
	this.m__currentScene=null;
	this.m__timeLastUpdate=0;
	this.m__deltaTime=0;
	this.m__loadingState=bb_lpscenemngr_LONENTERLOADING;
	this.m__clsColor=c_lpColor.m_Black();
	this.m__lastSceneId=0;
	this.implments={c_iDrawable:1};
}
c_lpSceneMngr.prototype=extend_class(c_App);
c_lpSceneMngr.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<17>";
	c_App.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<17>";
	pop_err();
	return this;
}
c_lpSceneMngr.m__instance=null;
c_lpSceneMngr.prototype.p_Create=function(){
	push_err();
	pop_err();
}
c_lpSceneMngr.prototype.p_PostCreate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<224>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<224>";
	var t_=this.m__currentScene.p_GetChildren().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<224>";
	while(t_.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<224>";
		var t_l=t_.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<225>";
		t_l.p_Create();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<228>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<228>";
	var t_2=this.m__currentScene.p_GetGui().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<228>";
	while(t_2.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<228>";
		var t_l2=t_2.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<229>";
		t_l2.p_Create();
	}
	pop_err();
}
c_lpSceneMngr.prototype.p_OnCreate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<34>";
	c_lpSceneMngr.m__instance=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<35>";
	this.m__loadingTween=c_lpTween.m_CreateLinear(0.0,1.0,300.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<36>";
	var t_defCamera=c_lpCamera.m_new.call(new c_lpCamera,.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()),.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<37>";
	dbg_object(this).m__currentCamera=t_defCamera;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<39>";
	this.p_Create();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<41>";
	if(this.m__currentScene==null){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<42>";
		error("Debes crear una escena, implementa 'Method GetScene:lpScene(id:Int)'");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<45>";
	if(0>=this.m__currentScene.p_GetCameras().p_Length()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<46>";
		print("auto camera");
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<47>";
		this.m__currentScene.p_AddCamera(t_defCamera);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<50>";
	if(this.m__currentScene.p_AutoCreate()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<51>";
		this.p_PostCreate();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<55>";
	pop_err();
	return 0;
}
c_lpSceneMngr.prototype.p_Update=function(t_delta){
	push_err();
	pop_err();
}
c_lpSceneMngr.prototype.p_OnUpdate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<59>";
	this.m__deltaTime=bb_app_Millisecs()-this.m__timeLastUpdate;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<60>";
	this.m__timeLastUpdate=bb_app_Millisecs();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<62>";
	if(this.m__loadingState==bb_lpscenemngr_LONLOADING){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<63>";
		this.m__currentScene.p_SetLoadingState(this.m__currentScene.p_Loading(this.m__deltaTime));
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<66>";
	if(this.m__loadingState==bb_lpscenemngr_LONPLAYING){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<67>";
		this.m__currentScene.p_Update(this.m__deltaTime);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<68>";
		this.p_Update(this.m__deltaTime);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<71>";
	pop_err();
	return 0;
}
c_lpSceneMngr.prototype.p_OnLoading=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<78>";
	pop_err();
	return 0;
}
c_lpSceneMngr.prototype.p_Render=function(){
	push_err();
	pop_err();
}
c_lpSceneMngr.prototype.p_OnRender=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<82>";
	bb_graphics_Cls(dbg_object(this.m__clsColor).m_r,dbg_object(this.m__clsColor).m_g,dbg_object(this.m__clsColor).m_b);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<87>";
	if(this.m__loadingState==bb_lpscenemngr_LONENTERLOADING){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<89>";
		if(!this.m__loadingTween.p_IsRunning()){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<90>";
			this.m__loadingTween.p_Start();
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<93>";
		this.m__loadingTween.p_Update2();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<94>";
		bb_graphics_SetAlpha(this.m__loadingTween.p_GetCurrentValue());
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<95>";
		this.m__currentScene.p_LoadingRender();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<97>";
		if(this.m__loadingTween.p_GetCurrentValue()==1.0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<98>";
			this.m__loadingState=bb_lpscenemngr_LONLOADING;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<101>";
		pop_err();
		return 0;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<105>";
	if(this.m__loadingState==bb_lpscenemngr_LONLOADING){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<107>";
		if(this.m__currentScene.p_GetLoadingState()<=0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<108>";
			this.m__loadingState=bb_lpscenemngr_LONENTERSCENE;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<109>";
			this.m__loadingTween.p_SetValues(1.0,0.0);
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<112>";
		bb_lpresources_lpLoadToVideoMemory();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<113>";
		this.m__currentScene.p_LoadingRender();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<115>";
		pop_err();
		return 0;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<118>";
	if(this.m__loadingState==bb_lpscenemngr_LONENTERSCENE){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<120>";
		if(!this.m__loadingTween.p_IsRunning()){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<121>";
			this.m__loadingTween.p_Start();
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<124>";
		this.m__loadingTween.p_Update2();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<125>";
		bb_graphics_SetAlpha(this.m__loadingTween.p_GetCurrentValue());
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<126>";
		this.m__currentScene.p_LoadingRender();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<128>";
		if(this.m__loadingTween.p_GetCurrentValue()==0.0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<129>";
			this.m__loadingState=bb_lpscenemngr_LONPLAYING;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<132>";
		pop_err();
		return 0;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<139>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<139>";
	var t_=this.m__currentScene.p_GetCameras().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<139>";
	while(t_.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<139>";
		var t_c=t_.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<140>";
		bb_graphics_PushMatrix();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<142>";
		this.m__currentCamera=t_c;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<144>";
		if(dbg_object(dbg_object(t_c).m_Position).m_Width!=dbg_object(dbg_object(t_c).m_ViewPort).m_Width || dbg_object(dbg_object(t_c).m_Position).m_Height!=dbg_object(dbg_object(t_c).m_ViewPort).m_Height){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<149>";
			bb_graphics_Scale(dbg_object(dbg_object(t_c).m_Position).m_Width/dbg_object(dbg_object(t_c).m_ViewPort).m_Width,dbg_object(dbg_object(t_c).m_Position).m_Height/dbg_object(dbg_object(t_c).m_ViewPort).m_Height);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<153>";
			bb_graphics_Translate(-(dbg_object(dbg_object(t_c).m_ViewPort).m_X*dbg_array(bb_graphics_GetMatrix(),0)[dbg_index]-dbg_object(dbg_object(t_c).m_Position).m_X)/dbg_array(bb_graphics_GetMatrix(),0)[dbg_index],-(dbg_object(dbg_object(t_c).m_ViewPort).m_Y*dbg_array(bb_graphics_GetMatrix(),3)[dbg_index]-dbg_object(dbg_object(t_c).m_Position).m_Y)/dbg_array(bb_graphics_GetMatrix(),3)[dbg_index]);
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<157>";
			bb_graphics_Translate(-(dbg_object(dbg_object(t_c).m_ViewPort).m_X-dbg_object(dbg_object(t_c).m_Position).m_X)/dbg_array(bb_graphics_GetMatrix(),0)[dbg_index],-(dbg_object(dbg_object(t_c).m_ViewPort).m_Y-dbg_object(dbg_object(t_c).m_Position).m_Y)/dbg_array(bb_graphics_GetMatrix(),3)[dbg_index]);
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<160>";
		bb_graphics_SetScissor(dbg_object(dbg_object(t_c).m_Position).m_X,dbg_object(dbg_object(t_c).m_Position).m_Y,dbg_object(dbg_object(t_c).m_Position).m_Width,dbg_object(dbg_object(t_c).m_Position).m_Height);
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<162>";
		this.m__currentScene.p_Render();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<163>";
		this.p_Render();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<165>";
		bb_graphics_PopMatrix();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<168>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<168>";
	var t_2=this.m__currentScene.p_GetGui().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<168>";
	while(t_2.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<168>";
		var t_gui=t_2.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<169>";
		bb_graphics_PushMatrix();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<170>";
		bb_graphics_SetScissor(.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<171>";
		t_gui.p_Render();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<172>";
		bb_graphics_PopMatrix();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<175>";
	pop_err();
	return 0;
}
c_lpSceneMngr.m_GetInstance=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<244>";
	pop_err();
	return c_lpSceneMngr.m__instance;
}
c_lpSceneMngr.prototype.p_GetScene=function(t_id){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<220>";
	pop_err();
	return null;
}
c_lpSceneMngr.prototype.p_SetScene=function(t_id){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<186>";
	if(this.m__lastSceneId!=t_id){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<187>";
		print("lpFreeMemory");
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<188>";
		bb_lpresources_lpFreeMemory();
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<191>";
	this.m__lastSceneId=t_id;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<193>";
	this.m__loadingState=bb_lpscenemngr_LONENTERLOADING;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<194>";
	this.m__loadingTween.p_SetValues(0.0,1.0);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<195>";
	this.m__loadingTween.p_Start();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<197>";
	this.m__currentScene=this.p_GetScene(t_id);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<199>";
	var t_defCamera=c_lpCamera.m_new.call(new c_lpCamera,.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()),.0,.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<200>";
	dbg_object(this).m__currentCamera=t_defCamera;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<202>";
	this.m__currentScene.p_Create();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<204>";
	if(0>=this.m__currentScene.p_GetCameras().p_Length()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<205>";
		print("auto camera");
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscenemngr.monkey<206>";
		this.m__currentScene.p_AddCamera(t_defCamera);
	}
	pop_err();
}
function c_LoginSample(){
	c_lpSceneMngr.call(this);
	this.implments={c_iDrawable:1};
}
c_LoginSample.prototype=extend_class(c_lpSceneMngr);
c_LoginSample.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<196>";
	c_lpSceneMngr.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<196>";
	pop_err();
	return this;
}
c_LoginSample.prototype.p_Create=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<199>";
	c_lpSceneMngr.m_GetInstance().p_SetScene(0);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<200>";
	bb_app_SetUpdateRate(60);
	pop_err();
}
c_LoginSample.prototype.p_GetScene=function(t_id){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<204>";
	var t_=(c_LoginSampleScene.m_new.call(new c_LoginSampleScene));
	pop_err();
	return t_;
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
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<210>";
	c_LoginSample.m_new.call(new c_LoginSample);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<211>";
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
c_Image.prototype.p_Discard=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<115>";
	if(((this.m_surface)!=null) && !((this.m_source)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<116>";
		this.m_surface.Discard();
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<117>";
		this.m_surface=null;
	}
	pop_err();
	return 0;
}
c_Image.prototype.p_Width=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<76>";
	pop_err();
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<80>";
	pop_err();
	return this.m_height;
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
c_InputDevice.prototype.p_KeyHit=function(t_key){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<45>";
	if(t_key>0 && t_key<512){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<45>";
		var t_=dbg_array(this.m__keyHit,t_key)[dbg_index];
		pop_err();
		return t_;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<46>";
	pop_err();
	return 0;
}
c_InputDevice.prototype.p_MouseX=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<57>";
	pop_err();
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/inputdevice.monkey<61>";
	pop_err();
	return this.m__mouseY;
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
function c_lpTween(){
	Object.call(this);
	this.m__function=0;
	this.m__initialValue=0.0;
	this.m__currentValue=0.0;
	this.m__endValue=0.0;
	this.m__time=.0;
	this.m__easing=0;
	this.m__running=false;
	this.m__beginTime=0.0;
}
c_lpTween.m_new=function(t_funct,t_initValue,t_endValue,t_time,t_easing){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<46>";
	this.m__function=t_funct;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<47>";
	this.m__initialValue=t_initValue;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<48>";
	this.m__currentValue=t_initValue;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<49>";
	this.m__endValue=t_endValue;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<50>";
	this.m__time=t_time;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<51>";
	this.m__easing=t_easing;
	pop_err();
	return this;
}
c_lpTween.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<3>";
	pop_err();
	return this;
}
c_lpTween.m_CreateLinear=function(t_initValue,t_endValue,t_time){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<30>";
	var t_=c_lpTween.m_new.call(new c_lpTween,0,t_initValue,t_endValue,t_time,0);
	pop_err();
	return t_;
}
c_lpTween.prototype.p_IsRunning=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<166>";
	pop_err();
	return this.m__running;
}
c_lpTween.prototype.p_Start=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<59>";
	dbg_object(this).m__beginTime=(bb_app_Millisecs());
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<60>";
	dbg_object(this).m__running=true;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<61>";
	dbg_object(this).m__currentValue=this.m__initialValue;
	pop_err();
}
c_lpTween.prototype.p_LinearUpdate=function(t_t,t_b,t_c,t_d){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<105>";
	this.m__currentValue=t_c*t_t/t_d+t_b;
	pop_err();
}
c_lpTween.prototype.p_QuadUpdate=function(t_easing,t_t,t_b,t_c,t_d){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<109>";
	var t_=t_easing;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<110>";
	if(t_==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<111>";
		t_t/=t_d;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<112>";
		this.m__currentValue=t_c*t_t*t_t+t_b;
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<113>";
		if(t_==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<114>";
			t_t/=t_d;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<115>";
			this.m__currentValue=-t_c*t_t*(t_t-2.0)+t_b;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<116>";
			if(t_==2){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<117>";
				t_t/=t_d/2.0;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<118>";
				if(t_t<1.0){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<118>";
					this.m__currentValue=t_c/2.0*t_t*t_t+t_b;
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<119>";
				t_t=t_t-1.0;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<120>";
				this.m__currentValue=-t_c/2.0*(t_t*(t_t-2.0)-1.0)+t_b;
			}
		}
	}
	pop_err();
}
c_lpTween.prototype.p_CubicUpdate=function(t_easing,t_t,t_b,t_c,t_d){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<126>";
	var t_=t_easing;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<127>";
	if(t_==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<128>";
		t_t/=t_d;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<129>";
		this.m__currentValue=t_c*t_t*t_t*t_t+t_b;
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<130>";
		if(t_==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<131>";
			t_t/=t_d;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<132>";
			t_t=t_t-1.0;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<133>";
			this.m__currentValue=t_c*(t_t*t_t*t_t+1.0)+t_b;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<134>";
			if(t_==2){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<135>";
				t_t/=t_d/2.0;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<136>";
				if(t_t<1.0){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<136>";
					this.m__currentValue=t_c/2.0*t_t*t_t*t_t+t_b;
				}
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<137>";
				t_t=t_t-2.0;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<138>";
				this.m__currentValue=t_c/2.0*(t_t*t_t*t_t+2.0)+t_b;
			}
		}
	}
	pop_err();
}
c_lpTween.prototype.p_BackUpdate=function(t_easing,t_t,t_b,t_c,t_d){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<143>";
	var t_=t_easing;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<144>";
	if(t_==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<145>";
		var t_s=1.70158;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<146>";
		t_t/=t_d;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<147>";
		this.m__currentValue=t_c*t_t*t_t*((t_s+1.0)*t_t-t_s)+t_b;
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<148>";
		if(t_==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<149>";
			var t_s2=1.70158;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<150>";
			t_t=t_t/t_d-1.0;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<151>";
			this.m__currentValue=t_c*(t_t*t_t*((t_s2+1.0)*t_t+t_s2)+1.0)+t_b;
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<152>";
			if(t_==2){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<153>";
				var t_s3=1.70158;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<154>";
				t_s3*=1.525;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<155>";
				if(t_t<1.0){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<156>";
					t_t/=t_d/2.0;
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<157>";
					this.m__currentValue=t_c/2.0*(t_t*t_t*((t_s3+1.0)*t_t-t_s3))+t_b;
				}else{
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<159>";
					t_t=t_t-2.0;
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<160>";
					this.m__currentValue=t_c/2.0*(t_t*t_t*((t_s3+1.0)*t_t+t_s3)+2.0)+t_b;
				}
			}
		}
	}
	pop_err();
}
c_lpTween.prototype.p_Update2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<83>";
	var t_currentTime=(bb_app_Millisecs())-dbg_object(this).m__beginTime;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<85>";
	if(dbg_object(this).m__running){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<86>";
		var t_=this.m__function;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<87>";
		if(t_==0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<88>";
			this.p_LinearUpdate(t_currentTime,dbg_object(this).m__initialValue,this.m__endValue-this.m__initialValue,dbg_object(this).m__time);
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<89>";
			if(t_==1){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<90>";
				this.p_QuadUpdate(this.m__easing,t_currentTime,dbg_object(this).m__initialValue,this.m__endValue-this.m__initialValue,dbg_object(this).m__time);
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<91>";
				if(t_==2){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<92>";
					this.p_CubicUpdate(this.m__easing,t_currentTime,dbg_object(this).m__initialValue,this.m__endValue-this.m__initialValue,dbg_object(this).m__time);
				}else{
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<93>";
					if(t_==3){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<94>";
						this.p_BackUpdate(this.m__easing,t_currentTime,dbg_object(this).m__initialValue,this.m__endValue-this.m__initialValue,dbg_object(this).m__time);
					}
				}
			}
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<98>";
	if(t_currentTime>=this.m__time){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<99>";
		this.m__currentValue=this.m__endValue;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<100>";
		dbg_object(this).m__running=false;
	}
	pop_err();
}
c_lpTween.prototype.p_GetCurrentValue=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<170>";
	pop_err();
	return this.m__currentValue;
}
c_lpTween.prototype.p_SetInitialValue=function(t_v){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<65>";
	dbg_object(this).m__initialValue=t_v;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<66>";
	dbg_object(this).m__currentValue=t_v;
	pop_err();
}
c_lpTween.prototype.p_SetEndValue=function(t_v){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<70>";
	dbg_object(this).m__endValue=t_v;
	pop_err();
}
c_lpTween.prototype.p_SetValues=function(t_v1,t_v2){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<74>";
	this.p_SetInitialValue(t_v1);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<75>";
	this.p_SetEndValue(t_v2);
	pop_err();
}
c_lpTween.m_CreateCubic=function(t_easing,t_initValue,t_endValue,t_time){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lptween.monkey<38>";
	var t_=c_lpTween.m_new.call(new c_lpTween,2,t_initValue,t_endValue,t_time,t_easing);
	pop_err();
	return t_;
}
function c_lpCamera(){
	Object.call(this);
	this.m_Position=null;
	this.m_ViewPort=null;
	this.m__firstViewPort=null;
	this.implments={c_iDrawable:1};
}
c_lpCamera.prototype.p__init=function(t_px,t_py,t_pw,t_ph,t_vx,t_vy,t_vw,t_vh){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcamera.monkey<15>";
	dbg_object(this).m_Position=c_lpRectangle.m_new2.call(new c_lpRectangle,t_px,t_py,t_pw,t_ph);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcamera.monkey<16>";
	dbg_object(this).m_ViewPort=c_lpRectangle.m_new2.call(new c_lpRectangle,t_vx,t_vy,t_vw,t_vh);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcamera.monkey<17>";
	dbg_object(this).m__firstViewPort=c_lpRectangle.m_new2.call(new c_lpRectangle,t_vx,t_vy,t_vw,t_vh);
	pop_err();
}
c_lpCamera.m_new=function(t_px,t_py,t_pw,t_ph,t_vx,t_vy,t_vw,t_vh){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcamera.monkey<26>";
	this.p__init(t_px,t_py,t_pw,t_ph,t_vx,t_vy,t_vw,t_vh);
	pop_err();
	return this;
}
c_lpCamera.prototype.p_Create=function(){
	push_err();
	pop_err();
}
c_lpCamera.prototype.p_Render=function(){
	push_err();
	pop_err();
}
c_lpCamera.prototype.p_Update=function(t_delta){
	push_err();
	pop_err();
}
function c_lpRectangle(){
	Object.call(this);
	this.m_X=.0;
	this.m_Y=.0;
	this.m_Width=.0;
	this.m_Height=.0;
	this.m_pos=c_Vector2.m_new2.call(new c_Vector2);
	this.m_Radius=.0;
	this.m__poly=null;
}
c_lpRectangle.m_new=function(t_avoidpoly){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<30>";
	dbg_object(this).m_X=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<31>";
	dbg_object(this).m_Y=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<32>";
	dbg_object(this).m_Width=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<33>";
	dbg_object(this).m_Height=.0;
	pop_err();
	return this;
}
c_lpRectangle.m_new2=function(t_x,t_y,t_width,t_height){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<38>";
	dbg_object(this).m_X=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<39>";
	dbg_object(this).m_Y=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<40>";
	dbg_object(this).m_Width=t_width;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<41>";
	dbg_object(this).m_Height=t_height;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<43>";
	dbg_object(this).m_pos=c_Vector2.m_Zero();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<44>";
	dbg_object(this).m_Radius=dbg_object(this).m_Width/2.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<46>";
	dbg_object(this).m__poly=c_lpPoly.m_new3.call(new c_lpPoly,[0.0,0.0,0.0,0.0,0.0,0.0,0.0,.0]);
	pop_err();
	return this;
}
c_lpRectangle.m_new3=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<21>";
	dbg_object(this).m_X=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<22>";
	dbg_object(this).m_Y=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<23>";
	dbg_object(this).m_Width=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<24>";
	dbg_object(this).m_Height=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<26>";
	dbg_object(this).m__poly=c_lpPoly.m_new3.call(new c_lpPoly,[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]);
	pop_err();
	return this;
}
c_lpRectangle.prototype.p_IsPointInside=function(t_point){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<97>";
	var t_val=false;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<99>";
	if(dbg_object(t_point).m_X>this.m_X && dbg_object(t_point).m_X<this.m_X+this.m_Width){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<100>";
		if(dbg_object(t_point).m_Y>this.m_Y && dbg_object(t_point).m_Y<this.m_Y+this.m_Height){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<101>";
			t_val=true;
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<105>";
	pop_err();
	return t_val;
}
c_lpRectangle.prototype.p_IsPointInside2=function(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<109>";
	dbg_object(this.m_pos).m_X=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<110>";
	dbg_object(this.m_pos).m_Y=t_y;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lprectangle.monkey<111>";
	var t_=this.p_IsPointInside(this.m_pos);
	pop_err();
	return t_;
}
function c_lpPoly(){
	Object.call(this);
	this.m__vertices=null;
	this.m_aabb=null;
}
c_lpPoly.m_new=function(t_vertices){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<42>";
	var t_v=new_number_array(t_vertices.length);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<44>";
	for(var t_i=0;t_i<t_vertices.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<45>";
		dbg_array(t_v,t_i)[dbg_index]=(dbg_array(t_vertices,t_i)[dbg_index])
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<48>";
	this.p__init2(t_v);
	pop_err();
	return this;
}
c_lpPoly.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<13>";
	pop_err();
	return this;
}
c_lpPoly.prototype.p__init2=function(t_vertices){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<20>";
	if(t_vertices.length % 2!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<21>";
		error("lpoly.new: vertices:int[] no puede ser impar");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<24>";
	this.m__vertices=c_Stack.m_new.call(new c_Stack);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<26>";
	for(var t_i=0;t_i<t_vertices.length;t_i=t_i+2){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<27>";
		this.m__vertices.p_Push(c_Vector2.m_new.call(new c_Vector2,dbg_array(t_vertices,t_i)[dbg_index],dbg_array(t_vertices,t_i+1)[dbg_index]));
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<30>";
	this.m_aabb=c_lpRectangle.m_new.call(new c_lpRectangle,false);
	pop_err();
}
c_lpPoly.m_new3=function(t_vertices){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lppoly.monkey<38>";
	this.p__init2(t_vertices);
	pop_err();
	return this;
}
function c_Vector2(){
	Object.call(this);
	this.m_X=.0;
	this.m_Y=.0;
}
c_Vector2.m_new=function(t_x,t_y){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/vector2.monkey<11>";
	dbg_object(this).m_X=t_x;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/vector2.monkey<12>";
	dbg_object(this).m_Y=t_y;
	pop_err();
	return this;
}
c_Vector2.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/vector2.monkey<4>";
	pop_err();
	return this;
}
c_Vector2.m_Zero=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/vector2.monkey<75>";
	var t_=c_Vector2.m_new.call(new c_Vector2,.0,.0);
	pop_err();
	return t_;
}
function c_Stack(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack.m_new2=function(t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack.prototype.p_Push=function(t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack.prototype.p_Push2=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<70>";
		this.p_Push(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack.prototype.p_Push3=function(t_values,t_offset){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<64>";
		this.p_Push(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
function c_lpScene(){
	Object.call(this);
	this.m__cameras=c_Stack2.m_new.call(new c_Stack2);
	this.m__autocreate=false;
	this.m__children=c_List.m_new.call(new c_List);
	this.m__gui=c_List.m_new.call(new c_List);
	this.m__loadingState=1;
	this.m__pause=false;
	this.m__pausegui=false;
	this.implments={c_iDrawable:1};
}
c_lpScene.prototype.p_GetCameras=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<76>";
	pop_err();
	return this.m__cameras;
}
c_lpScene.prototype.p_AddCamera=function(t_camera){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<72>";
	this.m__cameras.p_Push4(t_camera);
	pop_err();
}
c_lpScene.prototype.p_AutoCreate=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<29>";
	pop_err();
	return this.m__autocreate;
}
c_lpScene.prototype.p_GetChildren=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<80>";
	pop_err();
	return this.m__children;
}
c_lpScene.prototype.p_GetGui=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<84>";
	pop_err();
	return this.m__gui;
}
c_lpScene.prototype.p_Loading=function(t_delta){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<57>";
	pop_err();
	return 0;
}
c_lpScene.prototype.p_SetLoadingState=function(t_state){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<68>";
	dbg_object(this).m__loadingState=t_state;
	pop_err();
}
c_lpScene.prototype.p_Update=function(t_delta){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<37>";
	if(!this.m__pause){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<38>";
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<38>";
		var t_=dbg_object(this).m__children.p_ObjectEnumerator();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<38>";
		while(t_.p_HasNext()){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<38>";
			var t_layer=t_.p_NextObject();
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<39>";
			t_layer.p_Update(t_delta);
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<43>";
	if(!this.m__pausegui){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<44>";
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<44>";
		var t_2=dbg_object(this).m__gui.p_ObjectEnumerator();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<44>";
		while(t_2.p_HasNext()){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<44>";
			var t_gui=t_2.p_NextObject();
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<45>";
			t_gui.p_Update(t_delta);
		}
	}
	pop_err();
}
c_lpScene.prototype.p_LoadingRender=function(){
	push_err();
	pop_err();
}
c_lpScene.prototype.p_GetLoadingState=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<64>";
	pop_err();
	return this.m__loadingState;
}
c_lpScene.prototype.p_Render=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<50>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<50>";
	var t_=dbg_object(this).m__children.p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<50>";
	while(t_.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<50>";
		var t_layer=t_.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<51>";
		t_layer.p_Render();
	}
	pop_err();
}
c_lpScene.prototype.p_Create=function(){
	push_err();
	pop_err();
}
c_lpScene.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpscene.monkey<6>";
	pop_err();
	return this;
}
function c_Stack2(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack2.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_Stack2.m_new2=function(t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<13>";
	dbg_object(this).m_data=t_data.slice(0);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<14>";
	dbg_object(this).m_length=t_data.length;
	pop_err();
	return this;
}
c_Stack2.prototype.p_Length=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<41>";
	pop_err();
	return this.m_length;
}
c_Stack2.prototype.p_Push4=function(t_value){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<55>";
	if(this.m_length==this.m_data.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<56>";
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<58>";
	dbg_array(this.m_data,this.m_length)[dbg_index]=t_value
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<59>";
	this.m_length+=1;
	pop_err();
	return 0;
}
c_Stack2.prototype.p_Push5=function(t_values,t_offset,t_count){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<69>";
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<70>";
		this.p_Push4(dbg_array(t_values,t_offset+t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack2.prototype.p_Push6=function(t_values,t_offset){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<63>";
	for(var t_i=t_offset;t_i<t_values.length;t_i=t_i+1){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<64>";
		this.p_Push4(dbg_array(t_values,t_i)[dbg_index]);
	}
	pop_err();
	return 0;
}
c_Stack2.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<139>";
	var t_=c_Enumerator2.m_new.call(new c_Enumerator2,this);
	pop_err();
	return t_;
}
c_Stack2.prototype.p_Get=function(t_index){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<90>";
	var t_=dbg_array(this.m_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<120>";
	var t_=c_Node.m_new.call(new c_Node,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List.m_new2=function(t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<14>";
		this.p_AddLast(t_t);
	}
	pop_err();
	return this;
}
c_List.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<124>";
	var t_=c_Enumerator.m_new.call(new c_Enumerator,this);
	pop_err();
	return t_;
}
function c_Node(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<199>";
	this.m__succ=t_succ;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<200>";
	this.m__pred=t_pred;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<201>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<202>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<203>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<196>";
	pop_err();
	return this;
}
function c_HeadNode(){
	c_Node.call(this);
}
c_HeadNode.prototype=extend_class(c_Node);
c_HeadNode.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<248>";
	c_Node.m_new2.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<249>";
	this.m__succ=(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<250>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<264>";
	this.m__list=t_list;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<265>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<261>";
	pop_err();
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<269>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<270>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<272>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<276>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<277>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/list.monkey<278>";
	pop_err();
	return t_data;
}
function bb_app_Millisecs(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/app.monkey<148>";
	var t_=bb_app__game.Millisecs();
	pop_err();
	return t_;
}
var bb_lpscenemngr_LONENTERLOADING=0;
var bb_lpscenemngr_LONLOADING=0;
var bb_lpscenemngr_LONPLAYING=0;
function c_lpColor(){
	Object.call(this);
	this.m_r=.0;
	this.m_g=.0;
	this.m_b=.0;
}
c_lpColor.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<11>";
	dbg_object(this).m_r=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<12>";
	dbg_object(this).m_g=.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<13>";
	dbg_object(this).m_b=.0;
	pop_err();
	return this;
}
c_lpColor.m_new2=function(t_r,t_g,t_b){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<18>";
	dbg_object(this).m_r=t_r;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<19>";
	dbg_object(this).m_g=t_g;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<20>";
	dbg_object(this).m_b=t_b;
	pop_err();
	return this;
}
c_lpColor.m_Black=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpcolor.monkey<45>";
	var t_=c_lpColor.m_new.call(new c_lpColor);
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
var bb_lpscenemngr_LONENTERSCENE=0;
function c_lpResources(){
	Object.call(this);
	this.m_images=null;
	this.m_pimages=null;
	this.m_sounds=null;
	this.m_translations=null;
}
c_lpResources.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<34>";
	this.m_images=c_StringMap.m_new.call(new c_StringMap);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<35>";
	this.m_pimages=c_StringMap.m_new.call(new c_StringMap);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<36>";
	this.m_sounds=c_StringMap2.m_new.call(new c_StringMap2);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<37>";
	this.m_translations=c_StringMap3.m_new.call(new c_StringMap3);
	pop_err();
	return this;
}
c_lpResources.m__instance=null;
c_lpResources.m_GetInstance=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<51>";
	pop_err();
	return c_lpResources.m__instance;
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
c_Map.prototype.p_Values=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<117>";
	var t_=c_MapValues.m_new.call(new c_MapValues,this);
	pop_err();
	return t_;
}
c_Map.prototype.p_FirstNode=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<137>";
	if(!((this.m_root)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<139>";
	var t_node=this.m_root;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).m_left)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).m_left;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
c_Map.prototype.p_Clear=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<13>";
	this.m_root=null;
	pop_err();
	return 0;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
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
		this.p_InsertFixup(t_node);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map.prototype.p_Get2=function(t_key){
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
function c_Sound(){
	Object.call(this);
	this.m_sample=null;
}
c_Sound.prototype.p_Discard=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<31>";
	if((this.m_sample)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<32>";
		this.m_sample.Discard();
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<33>";
		this.m_sample=null;
	}
	pop_err();
	return 0;
}
c_Sound.m_new=function(t_sample){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<27>";
	dbg_object(this).m_sample=t_sample;
	pop_err();
	return this;
}
c_Sound.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<24>";
	pop_err();
	return this;
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
c_Map2.prototype.p_Values=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<117>";
	var t_=c_MapValues2.m_new.call(new c_MapValues2,this);
	pop_err();
	return t_;
}
c_Map2.prototype.p_FirstNode=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<137>";
	if(!((this.m_root)!=null)){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<139>";
	var t_node=this.m_root;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).m_left)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).m_left;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
c_Map2.prototype.p_Clear=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<13>";
	this.m_root=null;
	pop_err();
	return 0;
}
c_Map2.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_FindNode=function(t_key){
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
c_Map2.prototype.p_Contains=function(t_key){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<25>";
	var t_=this.p_FindNode(t_key)!=null;
	pop_err();
	return t_;
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
	t_node=c_Node3.m_new.call(new c_Node3,t_key,t_value,-1,t_parent);
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
c_Map2.prototype.p_Get2=function(t_key){
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
function c_Map3(){
	Object.call(this);
}
c_Map3.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
function c_StringMap3(){
	c_Map3.call(this);
}
c_StringMap3.prototype=extend_class(c_Map3);
c_StringMap3.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	c_Map3.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
function c_MapValues(){
	Object.call(this);
	this.m_map=null;
}
c_MapValues.m_new=function(t_map){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<519>";
	dbg_object(this).m_map=t_map;
	pop_err();
	return this;
}
c_MapValues.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<516>";
	pop_err();
	return this;
}
c_MapValues.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<523>";
	var t_=c_ValueEnumerator.m_new.call(new c_ValueEnumerator,this.m_map.p_FirstNode());
	pop_err();
	return t_;
}
function c_ValueEnumerator(){
	Object.call(this);
	this.m_node=null;
}
c_ValueEnumerator.m_new=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<481>";
	dbg_object(this).m_node=t_node;
	pop_err();
	return this;
}
c_ValueEnumerator.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<478>";
	pop_err();
	return this;
}
c_ValueEnumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<485>";
	var t_=this.m_node!=null;
	pop_err();
	return t_;
}
c_ValueEnumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<489>";
	var t_t=this.m_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<490>";
	this.m_node=this.m_node.p_NextNode();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<491>";
	pop_err();
	return dbg_object(t_t).m_value;
}
function c_Node2(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_value=null;
	this.m_key="";
	this.m_color=0;
}
c_Node2.prototype.p_NextNode=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<386>";
	if((this.m_right)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<387>";
		t_node=this.m_right;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).m_left)!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).m_left;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).m_right){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).m_parent;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
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
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<436>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<437>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<437>";
		error("Invalid image frame");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<440>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<442>";
	bb_graphics_context.p_Validate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<444>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<445>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<447>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,t_x-dbg_object(t_image).m_tx,t_y-dbg_object(t_image).m_ty,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
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
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<454>";
	bb_graphics_DebugRenderDevice();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<455>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<455>";
		error("Invalid image frame");
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<458>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<460>";
	bb_graphics_PushMatrix();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<462>";
	bb_graphics_Translate(t_x,t_y);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<463>";
	bb_graphics_Rotate(t_rotation);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<464>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<466>";
	bb_graphics_Translate(-dbg_object(t_image).m_tx,-dbg_object(t_image).m_ty);
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<468>";
	bb_graphics_context.p_Validate();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<470>";
	if((dbg_object(t_image).m_flags&65536)!=0){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<471>";
		bb_graphics_renderDevice.DrawSurface(dbg_object(t_image).m_surface,.0,.0);
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<473>";
		bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,.0,.0,dbg_object(t_f).m_x,dbg_object(t_f).m_y,dbg_object(t_image).m_width,dbg_object(t_image).m_height);
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<476>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_lpresources_lpLoadToVideoMemory(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<96>";
	var t_r=c_lpResources.m_GetInstance();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<98>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<98>";
	var t_=dbg_object(t_r).m_images.p_Values().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<98>";
	while(t_.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<98>";
		var t_i=t_.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<99>";
		if((t_i)!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<100>";
			bb_graphics_DrawImage(t_i,.0,.0,0);
		}
	}
	pop_err();
}
function c_Enumerator2(){
	Object.call(this);
	this.m_stack=null;
	this.m_index=0;
}
c_Enumerator2.m_new=function(t_stack){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<158>";
	dbg_object(this).m_stack=t_stack;
	pop_err();
	return this;
}
c_Enumerator2.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<155>";
	pop_err();
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<162>";
	var t_=this.m_index<this.m_stack.p_Length();
	pop_err();
	return t_;
}
c_Enumerator2.prototype.p_NextObject=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<166>";
	this.m_index+=1;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/stack.monkey<167>";
	var t_=this.m_stack.p_Get(this.m_index-1);
	pop_err();
	return t_;
}
function bb_graphics_GetMatrix(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<318>";
	var t_=[dbg_object(bb_graphics_context).m_ix,dbg_object(bb_graphics_context).m_iy,dbg_object(bb_graphics_context).m_jx,dbg_object(bb_graphics_context).m_jy,dbg_object(bb_graphics_context).m_tx,dbg_object(bb_graphics_context).m_ty];
	pop_err();
	return t_;
}
function bb_graphics_GetMatrix2(t_matrix){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<322>";
	dbg_array(t_matrix,0)[dbg_index]=dbg_object(bb_graphics_context).m_ix
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<322>";
	dbg_array(t_matrix,1)[dbg_index]=dbg_object(bb_graphics_context).m_iy
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<323>";
	dbg_array(t_matrix,2)[dbg_index]=dbg_object(bb_graphics_context).m_jx
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<323>";
	dbg_array(t_matrix,3)[dbg_index]=dbg_object(bb_graphics_context).m_jy
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<324>";
	dbg_array(t_matrix,4)[dbg_index]=dbg_object(bb_graphics_context).m_tx
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/graphics.monkey<324>";
	dbg_array(t_matrix,5)[dbg_index]=dbg_object(bb_graphics_context).m_ty
	pop_err();
	return 0;
}
function c_MapValues2(){
	Object.call(this);
	this.m_map=null;
}
c_MapValues2.m_new=function(t_map){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<519>";
	dbg_object(this).m_map=t_map;
	pop_err();
	return this;
}
c_MapValues2.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<516>";
	pop_err();
	return this;
}
c_MapValues2.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<523>";
	var t_=c_ValueEnumerator2.m_new.call(new c_ValueEnumerator2,this.m_map.p_FirstNode());
	pop_err();
	return t_;
}
function c_ValueEnumerator2(){
	Object.call(this);
	this.m_node=null;
}
c_ValueEnumerator2.m_new=function(t_node){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<481>";
	dbg_object(this).m_node=t_node;
	pop_err();
	return this;
}
c_ValueEnumerator2.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<478>";
	pop_err();
	return this;
}
c_ValueEnumerator2.prototype.p_HasNext=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<485>";
	var t_=this.m_node!=null;
	pop_err();
	return t_;
}
c_ValueEnumerator2.prototype.p_NextObject=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<489>";
	var t_t=this.m_node;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<490>";
	this.m_node=this.m_node.p_NextNode();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<491>";
	pop_err();
	return dbg_object(t_t).m_value;
}
function c_Node3(){
	Object.call(this);
	this.m_left=null;
	this.m_right=null;
	this.m_parent=null;
	this.m_value=null;
	this.m_key="";
	this.m_color=0;
}
c_Node3.prototype.p_NextNode=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<386>";
	if((this.m_right)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<387>";
		t_node=this.m_right;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).m_left)!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).m_left;
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).m_parent;
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).m_right){
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).m_parent;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
}
c_Node3.m_new=function(t_key,t_value,t_color,t_parent){
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
c_Node3.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_lpresources_lpFreeMemory(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<122>";
	var t_r=c_lpResources.m_GetInstance();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<124>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<124>";
	var t_=dbg_object(t_r).m_images.p_Values().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<124>";
	while(t_.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<124>";
		var t_i=t_.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<125>";
		if((t_i)!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<126>";
			t_i.p_Discard();
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<130>";
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<130>";
	var t_2=dbg_object(t_r).m_sounds.p_Values().p_ObjectEnumerator();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<130>";
	while(t_2.p_HasNext()){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<130>";
		var t_i2=t_2.p_NextObject();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<131>";
		if((t_i2)!=null){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<132>";
			t_i2.p_Discard();
		}
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<137>";
	dbg_object(t_r).m_images.p_Clear();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<138>";
	dbg_object(t_r).m_sounds.p_Clear();
	pop_err();
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
function c_LoginSampleScene(){
	c_lpScene.call(this);
	this.m_facebook=null;
	this.m_loginButton=null;
	this.m_postButton=null;
	this.implments={c_ilpFacebook:1,c_iHudButton:1,c_iDrawable:1};
}
c_LoginSampleScene.prototype=extend_class(c_lpScene);
c_LoginSampleScene.m_new=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<134>";
	c_lpScene.m_new.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<134>";
	pop_err();
	return this;
}
c_LoginSampleScene.prototype.p_Create=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<148>";
	this.m_facebook=c_lpFacebook.m_new.call(new c_lpFacebook,"155360927970352");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<151>";
	this.m_loginButton=c_HudButton.m_new.call(new c_HudButton,"sig_in.png","");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<152>";
	this.m_postButton=c_HudButton.m_new.call(new c_HudButton,"comment.png","");
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<154>";
	dbg_object(dbg_object(this.m_loginButton).m_Position).m_X=((bb_graphics_DeviceWidth()/2)|0)-dbg_object(dbg_object(this.m_loginButton).m_Position).m_Width/2.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<155>";
	dbg_object(dbg_object(this.m_loginButton).m_Position).m_Y=100.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<157>";
	dbg_object(dbg_object(this.m_postButton).m_Position).m_X=((bb_graphics_DeviceWidth()/2)|0)-dbg_object(dbg_object(this.m_postButton).m_Position).m_Width/2.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<158>";
	dbg_object(dbg_object(this.m_postButton).m_Position).m_Y=200.0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<161>";
	dbg_object(this.m_loginButton).m_id=0;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<162>";
	dbg_object(this.m_postButton).m_id=1;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<164>";
	this.m_loginButton.p_SetListener(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<165>";
	this.m_postButton.p_SetListener(this);
	pop_err();
}
c_LoginSampleScene.prototype.p_Update=function(t_delta){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<170>";
	this.m_loginButton.p_Update(t_delta);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<171>";
	this.m_postButton.p_Update(t_delta);
	pop_err();
}
c_LoginSampleScene.prototype.p_Render=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<175>";
	this.m_loginButton.p_Render();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<176>";
	this.m_postButton.p_Render();
	pop_err();
}
c_LoginSampleScene.prototype.p_OnFacebookResponse=function(t_response){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<181>";
	print("aaaaa"+t_response);
	pop_err();
}
c_LoginSampleScene.prototype.p_OnClick=function(t_id){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<186>";
	var t_=t_id;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<187>";
	if(t_==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<188>";
		dbg_object(this).m_facebook.p_Login("email,publish_actions");
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<189>";
		if(t_==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<190>";
			dbg_object(this).m_facebook.p_WallPost("test");
		}
	}
	pop_err();
}
function c_lpFacebook(){
	Object.call(this);
	this.m_appid="";
	this.m_logged=false;
	this.m_accessToken="";
	this.m_listener=null;
	this.implments={c_lpIOnHttpRequestComplete:1};
}
c_lpFacebook.prototype.p_OnLoginResponse=function(t_token,t_nogo){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<93>";
	if(t_nogo){
		pop_err();
		return;
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<97>";
	if(t_token!="undefined"){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<98>";
		dbg_object(this).m_logged=true;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<99>";
		dbg_object(this).m_accessToken=t_token;
	}
	pop_err();
}
c_lpFacebook.prototype.p_OnHttpRequestComplete=function(t_req){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<121>";
	if((dbg_object(this).m_listener)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<122>";
		dbg_object(this).m_listener.p_OnFacebookResponse(t_req);
	}
	pop_err();
}
c_lpFacebook.m_new=function(t_appid){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<78>";
	dbg_object(this).m_appid=t_appid;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<81>";
	pop_err();
	return this;
}
c_lpFacebook.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<66>";
	pop_err();
	return this;
}
c_lpFacebook.prototype.p_Login=function(t_permissions){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<88>";
	lpFacebookLaunchBrowser("https://www.facebook.com/dialog/oauth?client_id="+dbg_object(this).m_appid+"&redirect_uri=http://www.loadingnutrition.com/facebooktest.html&state=state&scope="+t_permissions+"&response_type=token&display=popup",this);
	pop_err();
}
c_lpFacebook.prototype.p_WallPost=function(t_post){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<114>";
	var t_r=c_lpHttpRequest.m_new2.call(new c_lpHttpRequest,"POST","http://www.loadingnutrition.com/data/proxy.php?u=https://graph.facebook.com/me/feed?access_token="+dbg_object(this).m_accessToken,(this));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<115>";
	t_r.Send("message="+t_post);
	pop_err();
}
function c_lpImage(){
	Object.call(this);
	this.m__img=null;
	this.m_Position=null;
	this.m_DiscardThread=null;
	this.m_isDestroyed=false;
	this.m__rotated=false;
	this.m_correctPosition=c_lpRectangle.m_new2.call(new c_lpRectangle,.0,.0,.0,.0);
	this.m__rotationPivot=c_Vector2.m_Zero();
	this.m__flipped=false;
	this.m__angle=.0;
	this.m__scalex=1.0;
	this.m__scaley=1.0;
	this.implments={c_iDrawable:1};
}
c_lpImage.prototype.p_Create=function(){
	push_err();
	pop_err();
}
c_lpImage.prototype.p__init3=function(t_img,t_position,t_margin){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<27>";
	dbg_object(this).m__img=t_img;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<32>";
	dbg_object(this).m_Position=c_lpRectangle.m_new2.call(new c_lpRectangle,dbg_object(t_position).m_X,dbg_object(t_position).m_Y,(this.m__img.p_Width())-t_margin,(this.m__img.p_Height())-t_margin);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<34>";
	this.m_DiscardThread=c_DiscardProcess.m_new.call(new c_DiscardProcess,dbg_object(this).m__img);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<36>";
	this.p_Create();
	pop_err();
}
c_lpImage.m_new=function(t_image,t_position){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<60>";
	var t_img=bb_lpresources_lpLoadImage(t_image,1,c_Image.m_DefaultFlags);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<61>";
	this.p__init3(t_img,t_position,.0);
	pop_err();
	return this;
}
c_lpImage.m_new2=function(t_image,t_position){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<67>";
	this.p__init3(t_image,t_position,.0);
	pop_err();
	return this;
}
c_lpImage.m_new3=function(t_image,t_position,t_margin){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<73>";
	var t_img=bb_lpresources_lpLoadImage(t_image,1,c_Image.m_DefaultFlags);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<74>";
	this.p__init3(t_img,t_position,t_margin);
	pop_err();
	return this;
}
c_lpImage.m_new4=function(t_image,t_position,t_margin){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<80>";
	this.p__init3(t_image,t_position,t_margin);
	pop_err();
	return this;
}
c_lpImage.m_new5=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<24>";
	pop_err();
	return this;
}
c_lpImage.prototype.p_Update=function(t_delta){
	push_err();
	pop_err();
}
c_lpImage.prototype.p_Render=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<93>";
	if(!dbg_object(this).m_isDestroyed){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<95>";
		var t_flipCorrection=.0;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<97>";
		bb_graphics_PushMatrix();
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<98>";
		t_flipCorrection=dbg_object(dbg_object(this).m_Position).m_Width;
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<100>";
		if(this.m__rotated){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<101>";
			t_flipCorrection=.0;
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<102>";
			bb_graphics_Translate(dbg_object(this.m_correctPosition).m_X+dbg_object(this.m__rotationPivot).m_X,dbg_object(this.m_correctPosition).m_Y+dbg_object(this.m__rotationPivot).m_Y);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<103>";
			dbg_object(this).m__img.p_SetHandle(dbg_object(this.m_correctPosition).m_X+dbg_object(this.m__rotationPivot).m_X,dbg_object(this.m_correctPosition).m_Y+dbg_object(this.m__rotationPivot).m_Y);
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<106>";
		if(this.m__flipped){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<107>";
			bb_graphics_DrawImage2(dbg_object(this).m__img,dbg_object(dbg_object(this).m_Position).m_X+t_flipCorrection,dbg_object(dbg_object(this).m_Position).m_Y,this.m__angle,-this.m__scalex,this.m__scaley,0);
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<109>";
			bb_graphics_DrawImage2(dbg_object(this).m__img,dbg_object(dbg_object(this).m_Position).m_X,dbg_object(dbg_object(this).m_Position).m_Y,this.m__angle,this.m__scalex,this.m__scaley,0);
		}
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<112>";
		bb_graphics_PopMatrix();
	}
	pop_err();
}
function c_HudButton(){
	c_lpImage.call(this);
	this.m_sound=null;
	this.m_id=0;
	this.m_listener=null;
	this.m_state=0;
	this.m_mx=0;
	this.m_my=0;
	this.m_theTween=null;
	this.m_ystate=0;
	this.implments={c_iDrawable:1};
}
c_HudButton.prototype=extend_class(c_lpImage);
c_HudButton.m_new=function(t_resource,t_snd){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<50>";
	c_lpImage.m_new2.call(this,bb_lpresources_lpLoadImage(t_resource,1,c_Image.m_DefaultFlags),c_Vector2.m_new.call(new c_Vector2,10.0,10.0));
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<51>";
	dbg_object(this).m_sound=bb_lpresources_lpLoadSound(t_snd);
	pop_err();
	return this;
}
c_HudButton.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<16>";
	c_lpImage.m_new5.call(this);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<16>";
	pop_err();
	return this;
}
c_HudButton.prototype.p_SetListener=function(t_l){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<114>";
	this.m_listener=t_l;
	pop_err();
}
c_HudButton.prototype.p_Update=function(t_delta){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<64>";
	c_lpImage.prototype.p_Update.call(this,t_delta);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<67>";
	var t_=this.m_state;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<68>";
	if(t_==0){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<70>";
		if((bb_input_MouseHit(0))!=0){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<71>";
			this.m_mx=((bb_input_MouseX())|0);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<72>";
			this.m_my=((bb_input_MouseY())|0);
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<74>";
			if(dbg_object(this).m_Position.p_IsPointInside2((this.m_mx),(this.m_my))){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<75>";
				dbg_object(this).m_state=1;
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<76>";
				this.m_theTween.p_Start();
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<77>";
				this.m_ystate=((dbg_object(dbg_object(this).m_Position).m_Y)|0);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<80>";
				bb_audio_PlaySound(dbg_object(this).m_sound,0,0);
			}
		}
	}else{
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<86>";
		if(t_==1){
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<88>";
			this.m_theTween.p_Update2();
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<89>";
			dbg_object(dbg_object(this).m_Position).m_Y=(this.m_ystate)+this.m_theTween.p_GetCurrentValue();
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<91>";
			if(!this.m_theTween.p_IsRunning()){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<92>";
				dbg_object(this).m_state=2;
			}
		}else{
			err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<95>";
			if(t_==2){
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<97>";
				dbg_object(dbg_object(this).m_Position).m_Y=(this.m_ystate);
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<98>";
				dbg_object(this).m_state=3;
			}else{
				err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<99>";
				if(t_==3){
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<102>";
					if(this.m_listener!=null){
						err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<103>";
						this.m_listener.p_OnClick(dbg_object(this).m_id);
					}
					err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<107>";
					dbg_object(this).m_state=0;
				}
			}
		}
	}
	pop_err();
}
c_HudButton.prototype.p_Create=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lphudbutton.monkey<60>";
	this.m_theTween=c_lpTween.m_CreateCubic(1,.0,10.0,100.0);
	pop_err();
}
function bb_lpresources_lpLoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<71>";
	var t_lkey=""+t_path+String(t_frameCount)+String(t_flags);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<72>";
	var t_r=c_lpResources.m_GetInstance();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<74>";
	if(!dbg_object(t_r).m_images.p_Contains(t_lkey)){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<75>";
		dbg_object(t_r).m_images.p_Set(t_lkey,bb_graphics_LoadImage(t_path,t_frameCount,t_flags));
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<78>";
	var t_=dbg_object(t_r).m_images.p_Get2(t_lkey);
	pop_err();
	return t_;
}
function bb_lpresources_lpLoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<83>";
	var t_lkey=""+t_path+String(t_frameCount)+String(t_frameWidth)+String(t_frameHeight)+String(t_frameCount)+String(t_flags);
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<84>";
	var t_r=c_lpResources.m_GetInstance();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<86>";
	if(!dbg_object(t_r).m_images.p_Contains(t_lkey)){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<87>";
		dbg_object(t_r).m_images.p_Set(t_lkey,bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags));
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<90>";
	var t_=dbg_object(t_r).m_images.p_Get2(t_lkey);
	pop_err();
	return t_;
}
function c_DiscardProcess(){
	Object.call(this);
	this.m_img=null;
}
c_DiscardProcess.m_new=function(t_i){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<13>";
	this.m_img=t_i;
	pop_err();
	return this;
}
c_DiscardProcess.m_new2=function(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpimage.monkey<10>";
	pop_err();
	return this;
}
function bb_audio_LoadSound(t_path){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<42>";
	var t_sample=bb_audio_device.LoadSample(bb_data_FixDataPath(t_path));
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<43>";
	if((t_sample)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<43>";
		var t_=c_Sound.m_new.call(new c_Sound,t_sample);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_lpresources_lpLoadSound(t_path){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<58>";
	var t_lkey=t_path;
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<59>";
	var t_r=c_lpResources.m_GetInstance();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<61>";
	if(!dbg_object(t_r).m_sounds.p_Contains(t_lkey)){
		err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<62>";
		dbg_object(t_r).m_sounds.p_Set2(t_lkey,bb_audio_LoadSound(t_path));
	}
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpresources.monkey<65>";
	var t_=dbg_object(t_r).m_sounds.p_Get2(t_lkey);
	pop_err();
	return t_;
}
function bb_input_MouseHit(t_button){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<84>";
	var t_=bb_input_device.p_KeyHit(1+t_button);
	pop_err();
	return t_;
}
function bb_input_MouseX(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<72>";
	var t_=bb_input_device.p_MouseX();
	pop_err();
	return t_;
}
function bb_input_MouseY(){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/input.monkey<76>";
	var t_=bb_input_device.p_MouseY();
	pop_err();
	return t_;
}
function bb_audio_PlaySound(t_sound,t_channel,t_flags){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<47>";
	if((dbg_object(t_sound).m_sample)!=null){
		err_info="/Users/ricardo/MonkeyPro69/modules/mojo/audio.monkey<47>";
		bb_audio_device.PlaySample(dbg_object(t_sound).m_sample,t_channel,t_flags);
	}
	pop_err();
	return 0;
}
function c_lpHttpRequest(){
	lpHttpRequestBase.call(this);
}
c_lpHttpRequest.prototype=extend_class(lpHttpRequestBase);
c_lpHttpRequest.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_lpHttpRequest.m_new2=function(t_query_method,t_url,t_requestComplete){
	push_err();
	err_info="/Users/ricardo/MonkeyPro69/modules/lp2/lpfacebook/loginsample.monkey<60>";
	this.Open(t_query_method,t_url,t_requestComplete);
	pop_err();
	return this;
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
	c_lpSceneMngr.m__instance=null;
	bb_lpscenemngr_LONENTERLOADING=0;
	bb_lpscenemngr_LONLOADING=1;
	bb_lpscenemngr_LONPLAYING=3;
	bb_lpscenemngr_LONENTERSCENE=2;
	c_lpResources.m__instance=c_lpResources.m_new.call(new c_lpResources);
	bb_app__updateRate=0;
}
//${TRANSCODE_END}
