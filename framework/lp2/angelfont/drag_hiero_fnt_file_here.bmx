SuperStrict

Framework BRL.Filesystem
Import BRL.Retro

Global section$ = "char"

If AppArgs.length = 2
	ParseFile(AppArgs[1])
Else
	If FileType("hiero_arial.fnt") = 1
		ParseFile("hiero_arial.fnt")
	EndIf
EndIf



End

Function ParseFile(filename$)
	Local in:TStream = ReadFile(filename)
	If (Not in) Return
	Local out:TStream = WriteFile(StripExt(filename)+".txt")
	If (Not out) Return
	
	WriteLine out, "id,x,y,width,height,xoffset,yoffset,xadvance,page,chnl"
	While Not Eof(in)
		Local before$ = ReadLine(in)
		Local after$ = ParseLine(before)
		If after <> "" WriteLine out, after
	Wend
	CloseFile out
	CloseFile in

End Function


Function ParseLine$(line$)
	Local result$ = ""
	line = Trim(line)
	If line.StartsWith("char id=")
		Local parts$[] = line.Split(" ")
		For Local part$ = EachIn parts
			If part.Contains("=")
				Local dec$[] = part.Split("=")
				result :+ dec[1]+","
				result = Replace(result,Chr(34),"")
			EndIf
			
		Next
		result = result[..result.length-1]
	EndIf
	Return result
End Function





