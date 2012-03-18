#pragma strict

public class Feat{


// Feats:
//		- Passive Abilities
//		- Always active

// -	Vampiric: Health leech
// -	Moonshine: Mana leech
// -	Explosive: Bigger bomb radius
// -	TODO: Electrify: Zap will Stun Enemies
// -	Numb: Ignore Damage < 20
// -	Evade: 20% Evade
// -	Haste: +20% Movement Speed
// -	TODO: Flame: Dot for Bomb Damage
// -	TODO: Poison: Dot for Zap Damage
// -	Resurrect: HP Refill after one death

    static var NumberOfTypes:int = 10;

	
	enum FeatType{
		Vampiric		= 0,
		Moonshine		= 1,
		Explosive		= 2,
		Electrify		= 3,
		Numb			= 4,
		Evade			= 5,
		Haste			= 6,
		Flame			= 7,
		Poison			= 8,
		Resurrect		= 9,
	}

	// Vampiric	
	// Moonshine	
	// Explosive	
	// Electrify	
	// Numb		
	// Evade		
	// Haste		
	// Flame		
	// Poison		
	// Resurrect		

	public static var type = FeatType.Vampiric;

	private static var _Power = [
		0.1,	// Vampiric	
		0.05,	// Moonshine	
		1.2,	// Explosive	
		0,	// Electrify	
		10,	// Numb		
		0.2,	// Evade		
		0.2,	// Haste		
		0,	// Flame		
		0,	// Poison		
		0	// Resurrect			
	];

	public static function Name():String{
		return type.ToString();
	}


    public static function Name(t:FeatType){
        return t.ToString();
    }

    public static function Unlocked(t:FeatType):boolean{
        return true;
    }

    public static function Power(){
        return _Power[type];
    }   

	// TODO: Manually load the icons
    public static function Icon(t:FeatType):Texture2D{
        var tex:Texture2D = Resources.Load(Name(t)+"Active",Texture2D);
        if (tex == null){
            tex = Resources.Load("FreezeActive", Texture2D);
        }
        return tex;
    }

    public static function Icon():Texture2D{
    	return Icon(type);
    }

    public static function IconInactive(t:FeatType):Texture2D{
        var tex:Texture2D = Resources.Load(Name(t)+"Inactive",Texture2D);
        if (tex == null){
            tex = Resources.Load("Freeze"+"Inactive", Texture2D);
        }
        return tex;        
    }

    public static function IconInactive():Texture2D{
    	return IconInactive(type);
    }




}