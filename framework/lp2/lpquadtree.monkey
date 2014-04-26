Strict

Import mojo
Import lp2.lprectangle

Global QT_NODE_CAPACITY:Int = 4


''' must implement this interface
Interface iQuadTreeItem

	Method GetBoundary:lpRectangle()

End


''' quadtree container
Class lpQuadTree<T>

Private

	Field candidates:Stack<T>
	Field allChildren:Stack<T>

Public

	Field rootNode:lpQuadTreeNode<T>

	Method New( size:lpRectangle=null )
		If (null = size)
			size = New lpRectangle(0,0,0,0)
		EndIf
		
		rootNode = new lpQuadTreeNode<T>( size )
		allChildren = New Stack<T>

		candidates = New Stack<T>()
	End

	Method GetCandidates:Stack<T> ( objectBounds:lpRectangle )
		
		self.candidates.Clear ()
		self.rootNode.GetCandidates ( self.candidates, objectBounds )

		Return self.candidates
	End

	'' Call only on loading
	Method Optimize:void( usingAllChildrenStack:Bool = false )

		'''  getting all the items
		Local items:Stack<T> = null

		If (Not ( usingAllChildrenStack ))
			items = Self.rootNode.RemoveChildren ()
		Else
			Self.rootNode.RemoveChildren ()
			items = Self.allChildren
		EndIf

		For Local i:=Eachin items
			Self.rootNode.Insert ( i )
		Next
		
		Self.rootNode.Optimize ()

		Self.RecalcAllChildren ()
	End

	Method Insert:Bool(item:T)
		
		Local inserted:Bool = Self.rootNode.Insert ( item )

		If ( Not ( inserted ) )
			Self.Resize ( iQuadTreeItem(item).GetBoundary () )
			inserted = Self.rootNode.Insert( item )
		EndIf

		Return inserted
	End

	Method Resize:Void ( rect:lpRectangle )
		''' detect if rect is outside by x
		If ( Self.rootNode.boundary.X > rect.X )
			Self.rootNode.boundary.Width += Self.rootNode.boundary.X-rect.X
			Self.rootNode.boundary.X = rect.X
		EndIf

		''' detect if rect is outside by y
		If ( Self.rootNode.boundary.Y > rect.Y )
			Self.rootNode.boundary.Height += Self.rootNode.boundary.Y-rect.Y
			Self.rootNode.boundary.Y = rect.Y
		EndIf
		
		''' detect if rect is outside by width
		If ( Self.rootNode.boundary.X+Self.rootNode.boundary.Width < rect.X+rect.Width )
			Self.rootNode.boundary.Width += Abs ( (Self.rootNode.boundary.X + Self.rootNode.boundary.Width) - ( rect.X + rect.Width ) )
		EndIf

		''' detect if rect is outside by height
		If ( Self.rootNode.boundary.Y+Self.rootNode.boundary.Height < rect.Y+rect.Height )
			Self.rootNode.boundary.Height += Abs ( (Self.rootNode.boundary.Y + Self.rootNode.boundary.Height) - ( rect.Y + rect.Height ) )
		EndIf

		Self.rootNode.boundary.Width = Max ( self.rootNode.boundary.Height,  self.rootNode.boundary.Width )
		Self.rootNode.boundary.Height = Max ( self.rootNode.boundary.Height, self.rootNode.boundary.Width )

		Self.rootNode.Resize ()
	End

	Method RecalcAllChildren:void()
		allChildren.Clear ()

		Self.rootNode.GetAllChildren  ( allChildren )
	End
	

	Method GetAllChildren:Stack<T>()
		Return allChildren
	End
	
			
End


''' quadtree nodes
Class lpQuadTreeNode<T>

	Field parentNode:lpQuadTreeNode
	
	Field topLeft:lpQuadTreeNode
	Field topRight:lpQuadTreeNode
	Field bottomLeft:lpQuadTreeNode
	Field bottomRight:lpQuadTreeNode

	Field children:Stack<T>
	Field staticChildren:T[]

	Field boundary:lpRectangle
	
	Method New( rect:lpRectangle )
		self.topLeft = null
		self.topRight = null
		self.bottomLeft = null
		self.bottomRight = null

		Self.children = New Stack<T>()

		self.boundary = rect
	End

	Method Split:Void()
		Local w# = self.boundary.Width*0.5
		Local h# = self.boundary.Height*0.5

		self.topLeft = new lpQuadTreeNode <T>( new lpRectangle( self.boundary.X, self.boundary.Y, w, h ) )
		self.topRight = new lpQuadTreeNode <T>( new lpRectangle( self.boundary.X+w, self.boundary.Y, w, h ) )
		self.bottomLeft = new lpQuadTreeNode <T>( new lpRectangle ( self.boundary.X, self.boundary.Y+h, w, h ) )
		self.bottomRight = new lpQuadTreeNode <T>( new lpRectangle ( self.boundary.X+w, self.boundary.Y+h, w, h ) )
	End

	Method Insert:Bool(child:T)

		'Ignore objects which do not belong in this quad tree
		If (Not(boundary.Contains(iQuadTreeItem ( child ).GetBoundary())))
			Return false ' object cannot be added
		End

		'' If there is space in this quad tree, add the object here
		If (children.Length() < QT_NODE_CAPACITY)
			children.Push( child )
			Return True
		EndIf

		'' Otherwise, we need to subdivide then add the point to whichever node will accept it
		If (self.topLeft = null)
			self.Split()
		EndIf
		
		If ( self.topLeft.Insert(child) ) 
			Return true;
		End
		If ( self.topRight.Insert(child) ) 
			Return true;
		End
		If ( self.bottomLeft.Insert(child) ) 
			Return true;
		End
		If ( self.bottomRight.Insert(child) ) 
			Return true;
		End

		'' Otherwise, the point cannot be inserted for some unknown reason (which should never happen)
		self.children.Push( child )
		Return True;
		
	End	

	''' only for testing purposes
	Method Draw:Void( r# = 255, g# = 0, b# = 0 )
		self.boundary.Draw( r,g,b )

		For Local rect:=Eachin self.children
			iQuadTreeItem ( rect ).GetBoundary().Draw(0,0,0)
		Next

		If (self.topLeft = null)
			Return
		EndIf

		self.topLeft.Draw()
		self.topRight.Draw()
		self.bottomLeft.Draw()
		self.bottomRight.Draw()
		
	End


	Method GetCandidates:Void( currentStack:Stack<T>, rect:lpRectangle )

		If ( self.boundary.Intersects( rect ) )
			currentStack.Push( staticChildren )

			If (self.topLeft)

				self.topLeft.GetCandidates( currentStack, rect )
				self.topRight.GetCandidates( currentStack, rect )
				self.bottomLeft.GetCandidates( currentStack, rect )
				self.bottomRight.GetCandidates( currentStack, rect )

			EndIf

		EndIf
		
		
	End

	''' remove and return the lpRectangles stack
	Method RemoveChildren:Stack<T> ()

		''' local variable for overtun the aabb children
		Local overturn:Stack <T> = New Stack <T>
		overturn.Push ( Self.children.ToArray () )
		
		''' clear the children var
		Self.children.Clear ()

		If (topLeft)
			overturn.Push ( topLeft.RemoveChildren ().ToArray () )
			overturn.Push ( topRight.RemoveChildren ().ToArray () )
			overturn.Push ( bottomLeft.RemoveChildren ().ToArray () )
			overturn.Push ( bottomRight.RemoveChildren ().ToArray () )
		EndIf
		

		Return overturn

	End	

	''' call only on load
	Method Optimize:Void()

		If ( self.topLeft )
			Local arrChildren:T[] = self.children.ToArray()

			For Local item:=Eachin arrChildren

				Local r:lpRectangle = iQuadTreeItem ( item ).GetBoundary ()
				Local rm:Bool = false

				If (topLeft.boundary.Contains ( r ) )
					topLeft.Insert ( item )

					rm = true
				EndIf

				If (topRight.boundary.Contains ( r ) )
					topRight.Insert ( item )

					rm = true
				EndIf

				If (bottomLeft.boundary.Contains( r ))
					bottomLeft.Insert ( item )

					rm = true
				EndIf
				
				If (bottomRight.boundary.Contains( r ))
					bottomRight.Insert ( item )

					rm = true
				EndIf
				

				If (rm)
					self.children.RemoveEach( item )
				EndIf

			Next

			topLeft.Optimize()
			topRight.Optimize()
			bottomLeft.Optimize()
			bottomRight.Optimize()
		EndIf

		staticChildren = self.children.ToArray ()
		
	End

	''' resize the children
	Method Resize:Void( )

		If (topLeft)

			Local hwidth:Float = Self.boundary.Width * 0.5
			Local hheight:Float = Self.boundary.Height * 0.5

			''' resizing the topeft child
			topLeft.boundary.X = Self.boundary.X
			topLeft.boundary.Y = Self.boundary.Y
			topLeft.boundary.Width = hwidth
			topLeft.boundary.Height = hheight

			''' resizing the topRight child
			topRight.boundary.X = Self.boundary.X + hwidth
			topRight.boundary.Y = Self.boundary.Y
			topRight.boundary.Width = hwidth
			topRight.boundary.Height = hheight

			''' resizing bottom left 
			bottomLeft.boundary.X = Self.boundary.X
			bottomLeft.boundary.Y = Self.boundary.Y + hheight
			bottomLeft.boundary.Width = hwidth
			bottomLeft.boundary.Height = hheight

			''' resizing bottom right
			bottomRight.boundary.X = Self.boundary.X + hwidth
			bottomRight.boundary.Y = Self.boundary.Y + hheight
			bottomRight.boundary.Width = hwidth
			bottomRight.boundary.Height = hheight

			''' resizing children
			topLeft.Resize ()
			topRight.Resize ()
			bottomLeft.Resize ()
			bottomRight.Resize ()
		EndIf

	End

	Method GetAllChildren:void( allChildren:Stack<T> )
		allChildren.Push( children.ToArray () )

		If (topLeft)
			topLeft.GetAllChildren ( allChildren )
			topRight.GetAllChildren ( allChildren )
			bottomLeft.GetAllChildren ( allChildren )
			bottomRight.GetAllChildren ( allChildren )
		EndIf
		
	End
	
	
End
