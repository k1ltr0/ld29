Import lp2.lpimage
Import lp2.json.json
Import lp2.lpresources
Import lp2.lpquadtree
Import lp2.lpscenemngr

Const TYPE_IMAGE:Int = 0
Const TYPE_AABB:Int = 1
Const TYPE_POLY:Int = 2

Class lpMapObject Implements iQuadTreeItem
	Field type:Int
	Field name:String 

	Method GetBoundary:lpRectangle()
		Return Null
	End
	
End

Class lpMapImage Extends lpMapObject
	Field drawable:lpImage

	Method GetBoundary:lpRectangle()
		''' getting the object boundary
		Return drawable.GetPoly().GetAABB()
	End
	
End

Class lpMapAABB Extends lpMapObject
	Field drawable:lpRectangle

	Method GetBoundary:lpRectangle()
		Return Self.drawable
	End
	
End

Class lpMapPoly Extends lpMapObject
	Field drawable:lpPoly

	Method GetBoundary:lpRectangle()
		Return drawable.GetAABB ()
	End
	
End

Class lpMapLayer

private
	
	Field fixedRectangle:lpRectangle = New lpRectangle (0,0,0,0)
	Field quadTree:lpQuadTree<lpMapImage>

	''' protected fields
	Field name:String
	Field objects:Stack<lpMapImage> = New Stack<lpMapImage>
	Field aabbs:Stack<lpRectangle> = New Stack<lpRectangle>
	Field poly:Stack<lpPoly> = New Stack<lpPoly>

	Field visible:Bool = True
	Field parallax:Float = 1.0

	Field optimized:Bool = False


	''' used to handle parallax in quadtree
	Field queryPosition:lpRectangle = New lpRectangle(0,0,0,0)

public

	Method New()
		Self.objects = New Stack<lpMapImage>
		Self.aabbs = New Stack<lpRectangle>
		Self.poly = New Stack<lpPoly>
	End

	Method QueryQuadtree:Stack<lpMapImage>( r:lpRectangle )

		queryPosition.X = r.X * Self.parallax
		queryPosition.Y = r.Y * Self.parallax
		queryPosition.Width  = r.Width
		queryPosition.Height = r.Height

		Return Self.quadTree.GetCandidates ( queryPosition )
	End
	

	Method GetImages:Stack<lpMapImage>()
		Return objects
	End
	
	Method GetAABB:Stack<lpRectangle>( )
		Return aabbs
	End
	
	Method GetPolys:Stack<lpPoly>(  )
		Return poly
	End

	Method IsOptimized:Bool()
		Return optimized
	End

	' optimize the current layer, only apply after of all operation
	Method Optimize:Void ()
		Self.optimized = True
		Self.quadTree = New lpQuadTree<lpMapImage> ()

		For Local i:=Eachin Self.objects
			Self.quadTree.Insert ( i )
		Next

		Self.quadTree.Optimize ()

	End

	Method Render:Void ()
		PushMatrix()					
			Local currentMatrix:Float[] = GetMatrix ()
			SetMatrix( currentMatrix[0], currentMatrix[1], currentMatrix[2], currentMatrix[3], currentMatrix[4]*parallax, currentMatrix[5]*parallax)
			If (Not ( IsOptimized () ) )
				For Local m:= Eachin GetImages ()
					m.drawable.Render()
				Next
			Else
				For Local m:= Eachin QueryQuadtree ( lpSceneMngr.GetInstance().GetCurrentCamera().ViewPort )
					m.drawable.Render()
				Next
			EndIf
		PopMatrix()
	End

End

Class lpObjMap Implements iDrawable
	Field images:StringMap<Image>
	Field layers:Stack<lpMapLayer>
	Field respawns:Stack<Vector2>

	'''Field framec:Int = 0

	Method New(map:String)
		Self.LoadMap(LoadString(map))
	End
	
	Method GetRespawns:Stack<Vector2>()
		Return respawns
	End
	
	Method GetLayer:lpMapLayer(n:String)
		For Local l:= Eachin layers
			If (l.name = n) Return l
		Next
		Return Null
	End

	Method GetAABB:Stack<lpRectangle>()

		Local aabbs:Stack<lpRectangle> = new Stack<lpRectangle>()

		For Local i:=Eachin layers
			If (i.name <> "dead_zone")
				aabbs.Push ( i.GetAABB ().ToArray () )
			EndIf
		Next
		
		Return aabbs
	End

	Method GetPolys:Stack<lpPoly>()

		Local polys:Stack<lpPoly> = new Stack<lpPoly>()

		For Local i:=Eachin layers
			polys.Push ( i.GetPolys().ToArray() )
		Next
		
		Return polys
		
	End
	
	Method RemoveLayer:lpMapLayer(n:String)
		For Local i:Int = 0 Until layers.Length()
			If (layers.Get(i).name = n ) Then
				Local l:lpMapLayer = layers.Get(i)
				layers.Remove(i) 
				Return l
			End
		Next
		Return Null
	End
	
	Method Create:Void()
		''' nothing here
	End
	
	Method Update:Void(delta:Int)
		''' nothing here
	End
	
	Method Render:Void()
		For Local l:= Eachin layers
			If (l.visible) Then
				l.Render ()
			End
		Next
	End
	
	'' Load an objects map, can be created with the level editor
	'' @param map:String json data for a map
	Method LoadMap:Void(map:String)
		images = New StringMap<Image>()
		layers = New Stack<lpMapLayer>()
		respawns = New Stack<Vector2>
		
		Local json:JSONDataItem[] = JSONArray(JSONData.ReadJSON(map)).values.ToArray()
		Local jsonImages:JSONArray = Null
		Local jsonLayers:JSONArray = Null

		jsonImages = JSONArray(JSONObject(json[0]).GetItem("images"))
		jsonLayers = JSONArray(JSONObject(json[1]).GetItem("layers"))
		
		For Local img:= Eachin jsonImages.values
			images.Add(img.ToString(),lpLoadImage(img.ToString()))
		End

		For Local layer:= Eachin jsonLayers.values

			Local jsonLayer:JSONObject = JSONObject(layer)
			Local jsonObjects:JSONArray = JSONArray(jsonLayer.GetItem("objects"))
			
			Local l:lpMapLayer = New lpMapLayer()
			
			l.name = jsonLayer.GetItem("name","")
			l.visible = jsonLayer.GetItem("visible", True)
			l.parallax= jsonLayer.GetItem("parallax", 1.0)

			layers.Push(l)
			
			For Local obj:= Eachin jsonObjects.values
				Local jsonObj:JSONObject = JSONObject(obj)
				
				If (jsonObj.GetItem("type") = "lpImage") Then 
				
					If (jsonObj.GetItem("image") = "respawn.png") Then
						Local jsonv:JSONObject = JSONObject(jsonObj.GetItem("position"))
						Local v:Vector2 = New Vector2(Int(jsonv.GetItem("x")), Int(jsonv.GetItem("y")))
						respawns.Push(v)
						Continue
					End
				
					Local jsonScale:JSONObject = JSONObject(jsonObj.GetItem("scale"))
					Local jsonPos:JSONObject = JSONObject(jsonObj.GetItem("position"))
					
					Local newObject:lpMapImage = New lpMapImage()
					
					newObject.name	 	= jsonObj.GetItem("image")
					newObject.drawable	= New lpImage(images.Get(jsonObj.GetItem("image")), New Vector2(jsonPos.GetItem("x",0.0),jsonPos.GetItem("y",0.0)))
					
					newObject.drawable.SetScale(jsonScale.GetItem("x",1.0),jsonScale.GetItem("y",1.0))
					newObject.drawable.SetRotation(jsonObj.GetItem("angle",0.0))
					newObject.type = TYPE_IMAGE
										
					l.objects.Push(lpMapImage(newObject))
					''l.quadTree.Insert(newObject)
					
				Elseif(jsonObj.GetItem("type") = "AABB") Then

					Local jsonPos:JSONObject = JSONObject(jsonObj.GetItem("position"))
					
					Local newObject:lpMapAABB = New lpMapAABB()
										
					l.aabbs.Push(New lpRectangle(jsonPos.GetItem("x",0.0),jsonPos.GetItem("y",0.0),jsonPos.GetItem("width",0.0),jsonPos.GetItem("height",0.0)))

				Elseif(jsonObj.GetItem("type") = "rhombus" Or jsonObj.GetItem("type") = "triangle") Then
					
					Local jsonVertex:JSONArray = JSONArray(jsonObj.GetItem("poly"))
					Local vertex:Float[jsonVertex.values.Count()]
					
					Local c:Int = 0
					For Local v:= Eachin jsonVertex.values
						vertex[c] = v
						c+= 1
					Next
					
					l.poly.Push(New lpPoly(vertex))
				End
			Next			
		Next

	End

End