Strict

Import json.json
Import lplayer
Import lpcamera
Import lpscenemngr

Const debug:bool = False


Class TileSet
	Field firstgid:Int
	Field image:String
	Field imageHeight:Int
	Field imageWidth:Int
	Field margin:Int
	Field name:String
	Field spacing:Int
	Field tileHeight:Int
	Field tileWidth:Int
	
	Field drawableImage:Image
	Field tiles: IntMap<lpRectangle>
	
	Method CalculateTiles:Void()

		Local i:Int = firstgid
		Self.tiles = New IntMap<lpRectangle>()
		Self.drawableImage = LoadImage(Self.image)
			
		For Local y:Int = 0 Until imageHeight / Self.tileHeight
			For Local x:Int = 0 Until imageWidth / Self.tileWidth
				
				tiles.Set(i, New lpRectangle(
									x*tileWidth,
									y*tileHeight,
									tileWidth,
									tileHeight))
				i = i+1
				
			Next
		Next 
	End
End

Class MidLayer Extends lpLayer
	
	Field x		: Int
	Field y		: Int
	Field width	: Int
	Field height: Int
	
	Field name	: String
	Field opacity : Float
	Field type	: String
	Field visible : Bool
	
	Field parent:TileMap
	
	Field camera:lpCamera
	
	Method New(parent:TileMap)
		Self.parent = parent
	End
End

Class TileLayer Extends MidLayer
	Field data	: Int[]
	
	Method New(parent:TileMap)
		Super.New(parent)
	End
	
	Method Render:Void()
		Super.Render()
		
		If ( Self.visible ) Then
			PushMatrix()
			SetAlpha(Self.opacity)
			
			Self.camera = lpSceneMngr.GetInstance().GetCurrentCamera()	
			
			Local minCounterX : Int = Self.camera.ViewPort.X / parent.tileWidth
			Local maxCounterX : Int = ((Self.camera.ViewPort.X + Self.camera.ViewPort.Width) / parent.tileWidth) + 1
			
			Local minCounterY : Int = Self.camera.ViewPort.Y / parent.tileHeight
			Local maxCounterY : Int = ((Self.camera.ViewPort.Y + Self.camera.ViewPort.Height) / parent.tileHeight)+1
			
			minCounterX = Clamp(minCounterX, 0, width)
			maxCounterX = Clamp(maxCounterX, 0, width)
			minCounterY = Clamp(minCounterY, 0, height)
			maxCounterY = Clamp(maxCounterY, 0, height)
			
			Local tx:Int
			Local ty:Int
			
			For ty = minCounterY Until maxCounterY
				For tx = minCounterX Until maxCounterX
					Local index:Int = (tx) + width * ty
					If (data[index] > 0) Then
						Local tileSet : TileSet = parent.GetTileSet(data[index])
						
						Local tile:lpRectangle = tileSet.tiles.Get(data[index])

						Local finalPosition : Vector2 = New Vector2(Float(Self.x) + Float(Float(tile.Width - tileSet.margin + tileSet.spacing) * tx), Float(Self.y) + Float(Float(tile.Height - tileSet.margin + tileSet.spacing) * Float(ty)))
						
						'Local correctedPosition : Vector2 = finalPosition'Self.camera.ClampToCamera(finalPosition)
						
						DrawImageRect(
								tileSet.drawableImage, finalPosition.X, finalPosition.Y,
								tile.X,
								tile.Y,
								tile.Width,
								tile.Height)
					End
				Next
			Next

			SetAlpha(1.0)
			PopMatrix()

		End
	End
End

Class TileObject Extends lpRectangle
	Field gid : Int
	Field properties:StringMap<String>
	
	Field parent:MidLayer

	Method New(x:Int,y:Int,w:Int,h:Int)
		Super.New(x,y,w,h)
	End

	Method Render:Void()
		If ( gid > 0 ) Then
			Local tileSet : TileSet = parent.parent.GetTileSet(gid)
			Local tile:lpRectangle = tileSet.tiles.Get(gid)

			Local finalPosition : Vector2 = New Vector2(parent.x + Self.X, parent.y + Self.Y - tile.Height)
			Local correctedPosition : Vector2 = finalPosition'parent.camera.ClampToCamera(finalPosition)
			
			DrawImageRect(
					tileSet.drawableImage, Int(correctedPosition.X), Int(correctedPosition.Y),
					tile.X,
					tile.Y,
					tile.Width,
					tile.Height)
		ElseIf(debug)
			Local finalPosition : Vector2 = New Vector2(parent.x + Self.X, parent.y + Self.Y)
			Local correctedPosition : Vector2 = finalPosition'parent.camera.ClampToCamera(finalPosition)
			
			DrawRect(correctedPosition.X, correctedPosition.Y, self.Width, self.Height)
		End
	End
End

Class ObjectGroup Extends MidLayer
	Field objects:Stack<TileObject>
	
	Method New(parent:TileMap)
		Super.New(parent)
		objects = New Stack<TileObject>
	End
	
	Method Render:Void()
		Super.Render()
		SetAlpha(self.opacity)
		If (Self.visible And lpSceneMngr.GetInstance().GetCurrentCamera() <> Null ) Then
			For Local ob:= EachIn objects
				ob.Render()
			Next
		End
		SetAlpha(1.0)
	End
End

Class TileMap Extends lpLayer

	Field height 	: Int
	Field width 	: Int
	Field version 	: Float
	Field tileHeight: Float
	Field tileWidth	: Float
	Field tileSets	: Stack<TileSet>

	Field layers	: Stack<MidLayer>

	Field tilemapUri:String

	' Default constructor
	' @param tilemapUri,  ruta del archivo json que contiene el mapa de tiles
	Method New(tilemapUri:String)
		Self.tilemapUri = tilemapUri
		Self.tileSets = New Stack<TileSet>
		Self.layers = New Stack<MidLayer>
		
		Self.LoadTileMap(Self.tilemapUri)
	End
	
	Method Update:Void(delta:Int)
		Super.Update(delta)
	End

	Method Render:Void()
		Super.Render()
		
		For Local layer:=EachIn Self.layers
			layer.Render()
		Next
	End
	
	Method GetLayer:MidLayer(name:String)
		
		For Local m:=EachIn Self.layers
			If m.name = name Then Return m
		Next
		
		Return null
	End
	
	Method RemoveLayer:MidLayer(name:String)
		
		For Local i:= 0 Until Self.layers.Length()
			If Self.layers.Get(i).name = name Then
				Local m : MidLayer = Self.layers.Get(i)
				Self.layers.Remove(i)
				Return m
			End
		Next
		
		Return null
	End
	
	Method GetTileSet:TileSet(id:Int)
		Local ts:TileSet
		
		For Local i:Int = 0 Until tileSets.Length()
			' Print("llega")
			If ( id >= tileSets.Get(i).firstgid)Then
				ts = tileSets.Get(i)
			End
		Next
		Return ts
	End

	Method LoadTileMap:Void(tilemapUri:String)
	
		Self.tileSets.Clear()
		Self.layers.Clear()
		
		Local content:String = LoadString(tilemapUri)
		Local data:JSONDataItem = JSONData.ReadJSON(content)
		Local jsonObject:JSONObject = JSONObject(data)
		
		Self.height = Int(jsonObject.GetItem("height").ToString())
		Self.width = Int(jsonObject.GetItem("width").ToString())
		Self.version = Int(jsonObject.GetItem("version").ToString())
		Self.tileHeight = Int(jsonObject.GetItem("tileheight").ToString())
		Self.tileWidth = Int(jsonObject.GetItem("tilewidth").ToString())
		
		Local jsonArrayT:JSONArray = JSONArray(jsonObject.GetItem("tilesets"))
		
		For Local di:JSONDataItem=EachIn jsonArrayT.values
			Local jo:JSONObject = JSONObject(di)
			Local ts:TileSet = New TileSet()
			
			ts.firstgid = Int(jo.GetItem("firstgid").ToString())
			ts.image = jo.GetItem("image").ToString()
			ts.imageHeight = Int(jo.GetItem("imageheight").ToString())
			ts.imageWidth = Int(jo.GetItem("imagewidth").ToString())
			ts.margin = Int(jo.GetItem("margin").ToString())
			ts.name = jo.GetItem("name").ToString()
			ts.spacing = Int(jo.GetItem("spacing").ToString())
			ts.tileHeight = Int(jo.GetItem("tileheight").ToString())
			ts.tileWidth = Int(jo.GetItem("tilewidth").ToString())
			ts.CalculateTiles()
			
			Self.tileSets.Push(ts)
		Next
		
		Local jsonArrayL:JSONArray = JSONArray(jsonObject.GetItem("layers"))
		
		For Local di:JSONDataItem=EachIn jsonArrayL
			Local jo:JSONObject = JSONObject(di)
			
			If ( jo.GetItem("type").ToString() = "tilelayer" )Then
				
				Local ja:JSONArray = JSONArray(jo.GetItem("data"))
				Local tileLayer:TileLayer = New TileLayer(Self)
				
				tileLayer.x = jo.GetItem("x").ToInt()
				tileLayer.y = jo.GetItem("y").ToInt()
				tileLayer.width = jo.GetItem("width").ToInt()
				tileLayer.height = jo.GetItem("height").ToInt()
				
				tileLayer.name = jo.GetItem("name").ToString()
				tileLayer.opacity = jo.GetItem("opacity").ToFloat()
				tileLayer.type = jo.GetItem("type").ToString()
				tileLayer.visible = jo.GetItem("visible").ToBool()
				
				Local dataList:List<Int> = New List<Int>
				
				For Local i:JSONDataItem = EachIn ja
					Local jsonInt:JSONInteger = JSONInteger(i)
					dataList.AddLast(jsonInt.value)
				Next
				
				tileLayer.data = dataList.ToArray()
				
				'tileLayer.camera = Self.camera

				Self.layers.Push(tileLayer)
			
			Else
				Local ja:JSONArray = JSONArray(jo.GetItem("objects"))
				Local objectGroup:ObjectGroup = New ObjectGroup(Self)
				
				objectGroup.x = jo.GetItem("x").ToInt()
				objectGroup.y = jo.GetItem("y").ToInt()
				objectGroup.width = jo.GetItem("width").ToInt()
				objectGroup.height = jo.GetItem("height").ToInt()
				
				objectGroup.name = jo.GetItem("name").ToString()
				objectGroup.opacity = jo.GetItem("opacity").ToFloat()
				objectGroup.type = jo.GetItem("type").ToString()
				objectGroup.visible = jo.GetItem("visible").ToBool()
				
				For Local dataRect:JSONDataItem = EachIn ja
					Local jRect:JSONObject = JSONObject(dataRect)
					Local rect:TileObject = New TileObject(
													jRect.GetItem("x").ToInt(),
													jRect.GetItem("y").ToInt(),
													jRect.GetItem("width").ToInt(),
													jRect.GetItem("height").ToInt() )
					rect.gid = jRect.GetItem("gid", 0)
					
					If ( rect.Width = 0 And rect.Height = 0 ) Then 
						Local tileSet : TileSet = Self.GetTileSet(rect.gid)
						Local tile:lpRectangle = tileSet.tiles.Get(rect.gid)
						
						rect.Width = tile.Width
						rect.Height = tile.Height
					End
					
					rect.properties = New StringMap<String>
					
					Local jsonProperties:JSONObject = JSONObject(jRect.GetItem("properties"))
					Local keys:Stack<String> = New Stack<String>
					Local values:Stack<String>=New Stack<String>

					For Local j:=EachIn jsonProperties.values.Keys()
						keys.Push(j)
					Next
					
					For Local v:=EachIn jsonProperties.values.Values()
						values.Push(v)
					Next
					
					For Local i:Int=0 Until keys.Length()
						rect.properties.Set(keys.Get(i), values.Get(i))
					Next
					rect.parent = objectGroup

					objectGroup.objects.Push(rect)
				Next
				
				'objectGroup.camera = Self.camera

				Self.layers.Push(objectGroup)
			End
		Next
		
	End

End
