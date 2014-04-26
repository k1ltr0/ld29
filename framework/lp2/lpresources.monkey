Import mojo
Import lp2.json
Import lpscenemngr
Import lppopup

#If TARGET="html5"
Import "native/lp.${TARGET}.${LANG}"
#End

Import "native/lpgetlanguage.${TARGET}.${LANG}"

#If TARGET<>"html5"
Function lpMouseScroll:Float()
	Return 0.0
End
Function lpResetValues:Void()
End
#End


Extern 

#If TARGET="html5"

Function lpGetLanguage:String()="lpGetLanguage"

Function lpMouseScroll:Float()="lp.MouseScroll"
Function lpResetValues:Void()="lp.ResetValues"

#ElseIf TARGET="android"

Function lpGetLanguage:String()="lpLanguage.lpGetLanguage"

#ElseIf TARGET="ios"

Function lpGetLanguage:String()="lpLanguage::lpGetLanguage"

#Else
Public
'' returns the user configured language
Function lpGetLanguage:String (  )
	Return ""
End
#End
Public

Class lpResources

Private

	Global _instance:lpResources = new lpResources()

	Method New()
		images = new StringMap<Image>()
		pimages = new StringMap<Image>()
		sounds = new StringMap<Sound>()
		translations = New StringMap<String>()
	End

Public

	Field images:StringMap<Image>
	Field pimages:StringMap<Image>
	Field sounds:StringMap<Sound>

	''' load translations
	Field translations:StringMap<String>

''' singleton
	Function GetInstance:lpResources()
		Return _instance;
	End

End

''' se sobreescribe el metodo LoadSound
Function lpLoadSound:Sound( path:String )
	Local lkey:String = path
	Local r:lpResources = lpResources.GetInstance()

	If (Not ( r.sounds.Contains( lkey ) ))
		r.sounds.Set( lkey, LoadSound( path ) )
	EndIf

	Return r.sounds.Get( lkey )
End


''' se sobreescribe el metodo LoadImage
Function lpLoadImage:Image ( path:String, frameCount:Int=1, flags:Int=Image.DefaultFlags )
	Local lkey:String = "" + path + frameCount + flags
	Local r:lpResources = lpResources.GetInstance()

	If (Not ( r.images.Contains( lkey ) ))
		r.images.Set( lkey, LoadImage( path, frameCount, flags ) )
	EndIf

	Return r.images.Get( lkey )
End

''' se sobreescribe el metodo LoadImage
Function lpLoadImage:Image ( path:String, frameWidth:Int, frameHeight:Int, frameCount:Int, flags:Int=Image.DefaultFlags )
	Local lkey:String = "" + path + frameCount + frameWidth + frameHeight + frameCount + flags
	Local r:lpResources = lpResources.GetInstance()

	If (Not ( r.images.Contains( lkey ) ))
		r.images.Set( lkey, LoadImage( path, frameWidth, frameHeight, frameCount, flags ) )
	EndIf

	Return r.images.Get( lkey )
End

''' debe ser llamada sólo en el loop de render.
Function lpLoadToVideoMemory:void()

	Local r:lpResources = lpResources.GetInstance()

	For Local i:=Eachin r.images.Values()
		If (i)
			DrawImage ( i, 0, 0 )
		EndIf
	Next

	'r.noVieoImage.Clear()
End

''' carga una imagen que no se liberará al llamar lpFreeMemory
Function lpLoadPermanentImage :Image ( path:String, frameCount:Int=1, flags:Int=Image.DefaultFlags )
	Local lkey:String = "" + path + frameCount + flags
	Local r:lpResources = lpResources.GetInstance()

	If (Not ( r.pimages.Contains( lkey ) ))
		r.pimages.Set( lkey, LoadImage( path, frameCount, flags ) )
	EndIf

	Return r.pimages.Get( lkey )
End


''' libera memoria ocupada por los recursos que no han sido cargados como permanentes
Function lpFreeMemory:void()
	Local r:lpResources = lpResources.GetInstance()
	
	For Local i:=Eachin r.images.Values ()
		If (i)
			i.Discard()
		EndIf
	Next

	For Local i:=Eachin r.sounds.Values ()
		If (i)
			i.Discard()
		EndIf
		
	Next

	r.images.Clear()
	r.sounds.Clear()
	
End


'' load any text file from the resources must contains the following structure
''[
''  {"text1":"este es el texto 1"},
''  {"text2":"este es el texto 2"},
''  {"text3":"este es el texto 3"},
''  {"text4":"este es el texto 4"}
'']
'' @param resource:String 	resource file name
Function lpLoadTexts:Void( resource:String )

	Local file:String = LoadString ( resource )

    Local data:JSONDataItem = JSONData.ReadJSON(file)
    Local jsonArray:JSONArray = JSONArray(data)

    For Local item:=Eachin jsonArray.values

    	Local jsonObject:JSONObject = JSONObject ( item )

    	For Local k:=Eachin jsonObject.values.Keys()

    		lpResources.GetInstance().translations.Set ( k, jsonObject.GetItem ( k, "" ) )
    		
    	Next
    	
    Next
End

'' get a text from the loaded file with lpLoadTexts
'' @param  textName:String 		must be the json text named
Function lpGetText:String ( textName:String )
	If ( lpResources.GetInstance.translations.IsEmpty() ) Error ( "Must use lpLoadTexts before use lpGetText" )
	Return lpResources.GetInstance.translations.Get( textName )
End

''' sets the current popup field
''' @param p:lpPopup  the pop up will be setted
Function lpSetPopup:Void(p:lpPopup)
	lpSceneMngr.GetInstance().SetPopup(p)
End


''' show the current popup, if this is'nt setted, will instantiate a default popup
''' @param p:lpPopup = Null   if this value is null then will shoe the popup setted with @see SetPopup
Function lpShowPopup:Void( p:lpPopup = Null )
	lpSceneMngr.GetInstance().ShowPopup( p )
End


''' hide the current showing popup
Function lpHidePopup:Void()
	lpSceneMngr.GetInstance().HidePopup()
End

