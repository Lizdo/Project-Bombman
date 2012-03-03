#pragma strict

public class Feat{

// Unlock feats (Feat Burn MP)
// - Freeze
// - Health leech
// - Mana leech
// - Push back
// - Bigger bomb radius
// - Teleport
// - Wrath, double damage
// - Shield, ignore damage

// Feat
//	-	Type
//	-	Mana Cost (Per Second)
//	-	Unlock Level
//	-	Name
//	-	Description
//	-	Icon
	
	enum FeatType{
		Freeze 			= 0,
		HealthLeech 	= 1,
		ManaLeech 		= 2,
		ExtraBombRadius = 3,
		Teleport 		= 4,
		DoubleDamage 	= 5,
		Shield 			= 6,
	}

	//Freeze 			
	//HealthLeech 	
	//ManaLeech 		
	//ExtraBombRadius 
	//Teleport 		
	//DoubleDamage 	
	//Shield 			

	public static var type = FeatType.Freeze;
	public static var inUse:boolean = false;

	private static var _Cost = [
		5,	//Freeze 			
		0,	//HealthLeech 	
		0,	//ManaLeech 		
		0,	//ExtraBombRadius 
		10,	//Teleport 		
		10,	//DoubleDamage 	
		5	//Shield 			
	];

	public static function Cost(){
		return _Cost[type];
	}

	public static function Name():String{
		return type.ToString();
	}

	public static function Level():int{
		return type;
	}

	// TODO: Manually load the icons
	public static function Icon():Texture2D{
		return Resources.Load(Name(),Texture2D);
	}

	public static function IconInactive():Texture2D{
		return Resources.Load(Name()+"_Inactive",Texture2D);
	}	



}