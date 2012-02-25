

private var HP:float;
public var maxHP:float;
private var color;

function Start(){
	HP = maxHP;
    color = Renderer().material.color;	
}

function Update(){
	UpdateHP();
}

function Position(){
	return transform.position;
}

function Center(){
    return Renderer().bounds.center;
}

function Damage(amount:float){
	print("Damaged!");
	HP -= amount;
	if (HP <= 0){
		Destroy();
	}
}

private function UpdateHP(){
    var ratio:float = 1-HP/maxHP;
    Renderer().material.color = Color.Lerp(color, Color.grey, ratio*0.8);   
}

private function Renderer():Renderer{
    if (renderer)
        return renderer;
    
    var child:Transform = transform.Find("Arm/Bone");
    return child.renderer;
}

function Destroy(){
	gameObject.SetActiveRecursively(false);
}