var lp = new Object();
var lpscroll = 0.0;
var lpisscrollinit = false;

lp.ScrollInit = function()
{
    var canvas=document.getElementById( "GameCanvas" );
    canvas.onmousewheel = function(event) 
    {
        lpscroll = event.wheelDelta;
        return false;
    }

    lpisscrollinit = true;
};

lp.MouseScroll = function() 
{
    if (!lpisscrollinit) 
    {
        lp.ScrollInit()
    }

    return lpscroll;
};

// execute at the end of the stack
lp.ResetValues = function()
{
    lpscroll = 0;
};
