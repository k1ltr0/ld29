''' Pure virtual Class
Interface ilpAnimation

    ' add an animation sequence
    ' @param    name:String, name of the animation, must be unique
    ' @param    seq:Int[], number vector with the numbers of each tile in the animation 
    Method AddSequence:Void(name:String, seq:Int[])

    ' same as PlaySequence, but this put Pause false
    Method ForcePlay:Void(name:String,  frameTime:Int = 100, looped:Bool = True)

    ' Search an animation sequence by the @name and play it
    ' @param    name:String, name of an animation sequence
    Method PlaySequence:Void(name:String,  frameTime:Int = 100, looped:Bool = True)

    ' stop the playing sequence and back to the first frame
    Method Stop:Void()
    Method IsLastFrame:Bool()

End