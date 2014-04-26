Import lp2.adcolony.adcolonybase

Class lpAdColony 

private
	
	Global adcolony_instance:lpAdColonyBase

public

	Function Init:Void(app_id:String, zone_id:String[])
		adcolony_instance = New lpAdColonyBase
		adcolony_instance.Init(app_id, zone_id)
	End
	Function IsAvailable:Bool(zone_id:String)
		Return adcolony_instance.IsAvailable(zone_id)
	End
	Function ShowV4VC:Void(zone_id:String)
		adcolony_instance.ShowV4VC(zone_id)
	End
	Function ShowVideo:Void(zone_id:String)
		adcolony_instance.ShowVideo(zone_id)
	End

End
