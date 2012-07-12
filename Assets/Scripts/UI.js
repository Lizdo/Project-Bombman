#pragma strict

public var floatingText:FloatingText;

function SpawnFloatingText(text:String, x: float, y: float, color:Color){
    x = Mathf.Clamp(x,0.05,0.95); // clamp position to screen to ensure
    y = Mathf.Clamp(y,0.05,0.9);  // the string will be visible

    var t:FloatingText = Instantiate(floatingText,Vector3(x,y,0),Quaternion.identity);
    t.guiText.text = text;
    t.color = color;
}


function PopupDamageToEnemy(point:float, x:float, y:float){
	var text:String = Mathf.Round(point).ToString();
	SpawnFloatingText(text, x, y, Tweakable.EnemyDamageColor);
}

function PopupDamageToPlayer(point:float, x:float, y:float){
	var text:String = Mathf.Round(point).ToString();
	SpawnFloatingText(text, x, y, Tweakable.PlayerDamageColor);
}


function PopupHealToPlayer(point:float, x:float, y:float){
	var text:String = "HP +" + Mathf.Round(point).ToString();
	SpawnFloatingText(text, x-0.04, y-0.04, Tweakable.HealthColor);
}

function PopupHealToEnemy(point:float, x:float, y:float){
	var text:String = "HP +" + Mathf.Round(point).ToString();
	SpawnFloatingText(text, x-0.02, y+0.02, Tweakable.EnemyDamageColor);
}

function PopupMana(point:float, x:float, y:float){
	var text:String = "MP +" + Mathf.Round(point).ToString();
	SpawnFloatingText(text, x+0.02, y+0.04, Tweakable.LowManaColor);
}

function PopupUseAbility(){
	var p:Player = FindObjectOfType(Player);
	var v:Vector3 = Camera.main.WorldToViewportPoint(p.Center());
	var text:String = "Used " + Ability.Name();
	SpawnFloatingText(text, v.x-0.04, v.y+0.1, Tweakable.FunctionColor);	
}

function PopupEffect(p:Pawn, name:String){
	var v:Vector3 = Camera.main.WorldToViewportPoint(p.Center());
	SpawnFloatingText(name, v.x-0.04, v.y+0.06, Tweakable.FunctionColor);		
}