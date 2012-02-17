public class Ability{
	static var Freeze:String = "Freeze";
	static var Fire:String = "Fire";	
	
	public var name:String;
	public var cost:float;
	
	public static var AbilityFreeze = Ability(Freeze, 40);
	public static var AbilityFire = Ability(Fire, 70);	
	
	public function Ability(n:String, c:float){
		name = n;
		cost = c;
	}
	
	public static function AbilityWithName(name:String):Ability{
		if (name == Freeze)
			return AbilityFreeze;
		else if (name == Fire)
			return AbilityFire;
		else
			return null;
	}
}

public class Effect{
	static var Freeze:String = "Freeze";
	static var Fire:String = "Fire";
	static var Armor:String = "Armor";
	static var Strength:String = "Strength";
	
	public var name:String;
	public var duration:float;
	public var currentTime:float;	
	
	public function Effect(n:String, d:float){
		name = n;
		duration = d;
		currentTime = 0;
	}
	
	public function Reset(){
		currentTime = 0;
	}

	public static function EffectWithName(name:String):Effect{
		if (name == Freeze)
			return new Effect(Freeze, 8);
		else if (name == Fire)
			return new Effect(Fire, 10);
		else if (name == Fire)
			return new Effect(Strength, 10);			
		else if (name == Fire)
			return new Effect(Armor, 10);			
		else
			return null;
	}
	
	
}