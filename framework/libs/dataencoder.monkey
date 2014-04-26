
' runlength functions

Function RunLength32Encode:Int[](data:Int[])
	Local encode[]
	Local count
	Local seq
	Local rept
	Local prev
	encode=New Int[data.Length+2]
	prev=data[0]-1
	seq=-1
	For Local i=0 To data.Length-1
		Local d=data[i]
		If d=prev
			rept+=1
			If rept=3 And seq>0
				encode[count-seq-3]=seq
				count+=1
				seq=0
			Endif
		Else
			prev=d
			If rept<3
				seq+=1+rept
			Else
				encode[count-3]=-rept-1
				count-=1
			Endif
			rept=0
		Endif
		If rept<3
			count+=1
			encode[count]=d
		Endif	
	Next
	If rept>2
		encode[count-3]=-rept-1
		count-=2
	Else
		seq+=rept+1
	Endif	
	If seq>0
		encode[count-seq]=seq
	Endif
	Return encode.Resize(count+1)
End

Function RunLength32Decode:Int[](data:Int[])
	Local decode[]
	Local count
	Local i
	While i<data.Length	
		Local d=data[i]
		If d<0
			count-=d
			i=i+2
		Else
			count+=d
			i=i+1+d
		Endif
	Wend
	decode=New Int[count]
	i=0
	count=0
	While i<data.Length	
		Local d=data[i]
		i+=1
		If d<0
			Local v=data[i]
			i=i+1			
			While d
				decode[count]=v	
				count+=1
				d+=1
			Wend
		Else
			While d
				decode[count]=data[i]			
				i+=1
				count+=1
				d-=1
			Wend
		Endif
	Wend
	Return decode
End

' utf8 functions

Function UTF8Encode:Int[](data:Int[])
	Local bytes[]
	Local count
	
	bytes=New Int[data.Length*6]
	For Local d=Eachin data
		If d<0 Or d>=$4000000
			bytes[count]=$FC|((d Shr 30)&$3)
			bytes[count+1]=$80|((d Shr 24)&$3F)
			bytes[count+2]=$80|((d Shr 18)&$3F)
			bytes[count+3]=$80|((d Shr 12)&$3F)
			bytes[count+4]=$80|((d Shr 6)&$3F)
			bytes[count+5]=$80|(d&$3F)
			count+=6
			Continue
		Endif
		If d<$80
			bytes[count]=d
			count+=1
			Continue
		Endif
		If d<$800
			bytes[count]=$c0|((d Shr 6)&$1F)
			bytes[count+1]=$80|(d&$3F)
			count+=2
			Continue
		Endif
		If d<$10000
			bytes[count]=$E0|((d Shr 12)&$F)
			bytes[count+1]=$80|((d Shr 6)&$3F)
			bytes[count+2]=$80|(d&$3F)
			count+=3
			Continue			
		Endif
		If d<$200000
			bytes[count]=$F0|((d Shr 18)&$7)
			bytes[count+1]=$80|((d Shr 12)&$3F)
			bytes[count+2]=$80|((d Shr 6)&$3F)
			bytes[count+3]=$80|(d&$3F)
			count+=4
			Continue			
		Endif
		If d<$4000000
			bytes[count]=$F8|((d Shr 24)&$3)
			bytes[count+1]=$80|((d Shr 18)&$3F)
			bytes[count+2]=$80|((d Shr 12)&$3F)
			bytes[count+3]=$80|((d Shr 6)&$3F)
			bytes[count+4]=$80|(d&$3F)
			count+=5
			Continue			
		Endif
	Next	
	Return bytes.Resize(count)
End

Function UTF8Decode:Int[](bytes:Int[])
	Local data[]
	Local in
	Local out	
	data=New Int[bytes.Length]	
	While in<bytes.Length
		Local d=bytes[in]
		If d&$80=0 		
			in+=1
		Else If d&$E0=$C0
			d=((d&$1F)Shl 6) | (bytes[in+1]&$3F)
			in+=2
		Else If d&$F0=$E0
			d=((d&$F) Shl 12) | ((bytes[in+1]&$3F)Shl 6) | (bytes[in+2]&$3F)
			in+=3		
		Else If d&$F8=$F0
			d=((d&$7) Shl 18) | ((bytes[in+1]&$3F)Shl 12) | ((bytes[in+2]&$3F)Shl 6) | (bytes[in+3]&$3F)
			in+=4			
		Else If d&$FC=$F8
			d=((d&$3) Shl 24) | ((bytes[in+1]&$3F)Shl 18) | ((bytes[in+2]&$3F)Shl 12) | ((bytes[in+3]&$3F)Shl 6) | (bytes[in+4]&$3F)
			in+=5					
		Else
			d=((d&$3) Shl 30) | ((bytes[in+1]&$3F)Shl 24) | ((bytes[in+2]&$3F)Shl 18) | ((bytes[in+3]&$3F)Shl 12) | ((bytes[in+4]&$3F)Shl 6) | (bytes[in+5]&$3F)
			in+=6							
		Endif		
		data[out]=d	
		out+=1
	Wend	
	Return data.Resize(out)
End Function

' base64 functions

Global MIME$="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
Global Dime:Int[]

Function B64:String(x:Int)
	if ((x < 0) Or (x > 63))
		Print "[B64]: Out of 64 range!"
	EndIf
	
	Return String.FromChar(MIME[x])
End

Function RB64:Int(c:Int)
	If (Not Dime)
		Dime = New Int[256]
		For Local i:Int = 0 To 63
			Dime[MIME[i]] = i
		Next
	End
	
	Return Dime[c]
End

Function StringToIntArray:Int[](s:String)
	Local byteArray:List<Int> = New List<Int> ()

	For Local i:= Eachin s
		byteArray.AddLast(i)
	End
	
	Return byteArray.ToArray()
End

Function IntArrayToString:String(d:Int[])
	Local s:String = ""
	For Local i:Int = 0 Until d.Length()
		s += String.FromChar((d[i] Shr 0) & 127)
		s += String.FromChar((d[i] Shr 8) & 127)
		s += String.FromChar((d[i] Shr 16) & 127)
		s += String.FromChar((d[i] Shr 24) & 127)
	Next
	Return s
End

Function Base64Encode:String(data$)
	Local bytes:Int[] = StringToIntArray(data)
	Local n:=bytes.Length	
	Local buffer$

	For Local i=0 Until n Step 3	
		Local b0,b1,b2,b24
		Local pad$
		b0=bytes[i]
		If i+1<n
			b1=bytes[i+1]
			If i+2<n
				b2=bytes[i+2]
			Else
				pad="="
			Endif
		Else
			pad="=="
		Endif		
		b24=(b0 Shl 16) | (b1 Shl 8) | (b2)
		buffer+=String.FromChar( MIME[(b24 Shr 18)&63] )
		buffer+=String.FromChar( MIME[(b24 Shr 12)&63] )
		If (i < n-1) Then
			buffer+=String.FromChar( MIME[(b24 Shr 6)&63] )
			buffer+=String.FromChar( MIME[(b24)&63] )
		End
		If pad buffer+=pad	
	Next	

	Return buffer
End

Function Base64Decode:String(s:String)
	Local b6:Int[4]
	Local b:Int[3]
	Local data:Int[]
	
	Local TotalBytes:Int = s.Length() * 3 / 4
	Local ProcessedBytes:Int = 0
	Local NrBlocks:Int = s.Length() / 4
	
	data = New Int[TotalBytes / 4]
	
	Local crtPos:Int = 0
	
	For Local i:Int = 0 Until NrBlocks
		b6[0] = RB64(s[i*4])
		b6[1] = RB64(s[i*4+1])
		b6[2] = RB64(s[i*4+2])
		b6[3] = RB64(s[i*4+3])
			
		b[0] = ((b6[0] Shl 2) | (b6[1] Shr 4)) & 255
		b[1] = ((b6[1] Shl 4) | (b6[2] Shr 2)) & 255
		b[2] = ((b6[2] Shl 6) | b6[3]) & 255
		
		Select (crtPos Mod 4)
			Case 0
				data[Floor(crtPos / 4.0)] |= b[0] Shl 0
				data[Floor(crtPos / 4.0)] |= b[1] Shl 8
				data[Floor(crtPos / 4.0)] |= b[2] Shl 16
			Case 1
				data[Floor(crtPos / 4.0)] |= b[0] Shl 8
				data[Floor(crtPos / 4.0)] |= b[1] Shl 16
				data[Floor(crtPos / 4.0)] |= b[2] Shl 24
			Case 2
				data[Floor(crtPos / 4.0)] |= b[0] Shl 16
				data[Floor(crtPos / 4.0)] |= b[1] Shl 24
				If (b[2]) data[Floor(crtPos / 4.0)+1] |= b[2] Shl 0
			Case 3
				data[Floor(crtPos / 4.0)] |= b[0] Shl 24
				If (b[1]) data[Floor(crtPos / 4.0)+1] |= b[1] Shl 0
				If (b[2]) data[Floor(crtPos / 4.0)+1] |= b[2] Shl 8
		End
		
		crtPos += 3
	Next
	
	Return IntArrayToString(data)
End


