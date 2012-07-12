#pragma strict

public class EnemyAbility{

enum EnemyAbilityType {
    Heal,
    Teleport,
    SpawnMinion,
    Explode
};

public var interval:float;

public var power:float;

public var type:EnemyAbilityType;

public function EnemyAbility(t:EnemyAbilityType, i:float, a:float){
	type = t;
	interval = i;
	power = a;
}


private var tickingTime:float = 0;
private var ready:boolean = false;

public function Update(){
	print("Ticking");
	tickingTime += Time.deltaTime;
	if (tickingTime >= interval){
		ready = true;
	}
}

public function Ready():boolean{
	return ready;
}

public function Use(){
	ready = false;
	tickingTime = 0;
}

public static function EnemyAbilityFromString(s:String):EnemyAbility{
	if (s == "Heal")
		return EnemyAbility(EnemyAbilityType.Heal, 30, 50);
	if (s == "Teleport")
		return EnemyAbility(EnemyAbilityType.Teleport, 25, 3);
	if (s == "SpawnMinion")
		return EnemyAbility(EnemyAbilityType.SpawnMinion, 15, 2);
	if (s == "Explode")
		return EnemyAbility(EnemyAbilityType.SpawnMinion, 15, 5);
	return null;
}


}