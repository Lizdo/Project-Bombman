import Ability;

public var type:PawnType;

protected var speed:float;


protected var attackRadius:float;
protected var dps:float;
protected var attackType:AttackType;
protected var radius:float = 2.0;
protected var attackSpeed = 1.0;

protected var deathParticle:GameObject;

protected var smooth:float = 4.0;
protected var turnOnSpotRotationLimit = 60.0;


//Pathfinding Variables
private var seeker:Seeker;

private var path:Path;
//The max distance from the AI to a waypoint for it to continue to the next waypoint
private var distanceTolerance:float = 0.1;

//The waypoint we are currently moving towards
private var currentWaypoint:int = 0;

protected var targetPosition:Vector3 = Vector3.zero;
public var HP:float;
public var maxHP:float;
protected var isDead:boolean = false;

private var color:Color;
private var borderColor:Color;

protected var objectiveManager:ObjectiveManager;
protected var pawnManager:PawnManager;
protected var player:Player;

static var kOutlineColor:String = "_OutlineColor";
static var kOutlineWidth:String = "_Outline";

static var outlineWidth:float = 0.01;
static var freezeOutlineWidth:float = 0.02;

function Start () {
	player = FindObjectOfType(Player);
	objectiveManager = FindObjectOfType(ObjectiveManager);
	pawnManager = FindObjectOfType(PawnManager);

	seeker = GetComponent(Seeker);

	speed = Tweakable.SpeedForType(type);
	HP = Tweakable.HPForType(type);
	attackRadius = Tweakable.AttackRadiusForType(type);
	dps = Tweakable.DPSForType(type);
	attackType = Tweakable.AttackTypeForType(type);
	radius = Tweakable.RadiusForType(type);
	attackSpeed = Tweakable.AttackSpeedForType(type);
	
	maxHP = HP;
	color = Renderer().material.color;
	borderColor = Renderer().material.GetColor(kOutlineColor);
	Renderer().material.SetFloat(kOutlineWidth, outlineWidth);
	
	// Snap the Y axis
	transform.position = SnapToGround(transform.position);
	
	deathParticle = Resources.Load("Sparks");	
}

function Update () {
	if (objectiveManager.IsGamePaused())
		return;

	if (!HasEffect(Effect.Freeze)) {
		UpdateMovement();
		RotateToPlayer();		
	}
	
	UpdateHP();
	UpdateEffects();

}

private function Renderer():Renderer{
	if (renderer)
		return renderer;
	
	var child:Transform = transform.Find("Arm/Bone");
	return child.renderer;
}

private function LineOfSightToTarget():boolean{
	// TODO: Current implenmentation is buggy, need to consider cylinder radius into consideration
	var source:Vector3 = SnapToGround(transform.position);
    var distance:float = Vector3.Distance(source, targetPosition);
	var offset:Vector3 = targetPosition - source;

    if (distance <= distanceTolerance)
    	return true;
    
	var obstacleMask:int = 1 << 9;
    if (Physics.Raycast (source, offset, distance, obstacleMask)){
		return false;
	}


	var source1:Vector3 = source + Quaternion.AngleAxis(90, Vector3.up) * offset.normalized * radius;
	var target1:Vector3 = targetPosition + Quaternion.AngleAxis(90, Vector3.up) * offset.normalized * radius;
    if (Physics.Raycast (source1, offset, distance, obstacleMask)){
		return false;
	}

	var source2:Vector3 = source + Quaternion.AngleAxis(-90, Vector3.up) * offset.normalized * radius;
	var target2:Vector3 = targetPosition + Quaternion.AngleAxis(-90, Vector3.up) * offset.normalized * radius;
    if (Physics.Raycast (source2, offset, distance, obstacleMask)){
		return false;
	}

	return true;
}

private function DirectPathToTarget(){
	path = new Path();
	path.vectorPath = new Vector3[2];
	path.vectorPath[0] = transform.position;	
	path.vectorPath[1] = targetPosition;
	//if (this == player)
		//print("Direct Path Generated");
	currentWaypoint = 0;	
}

private function UpdateMovement(){

	if (targetPosition == Vector3.zero)
		return;

	if(!Tweakable.UsePathfinding){
		RotateTowardTarget();
	    //Direction to the next waypoint
	    if (AngleNeedToRotate() < turnOnSpotRotationLimit){
	    	MoveTowardTarget();
	    }
	    return;
	}


    if (path == null) {
         //We have no path to move after yet
        return;
     }
     
    if (currentWaypoint >= path.vectorPath.Length) {
        Debug.Log ("End Of Path Reached");
		path = null;
        return;
    }

	RotateTowardTarget();
    //Direction to the next waypoint
    if (AngleNeedToRotate() < turnOnSpotRotationLimit){
    	MoveTowardTarget();
    }

    var distance:float = Vector3.Distance(NextPoint(), transform.position);
    if (distance < distanceTolerance){
    	currentWaypoint++;
    	// Don't check if it's already the last segment
    	if (currentWaypoint+1 < path.vectorPath.Length && LineOfSightToTarget()){
    		DirectPathToTarget();
    	}
    	return;
    }
}

private function AngleNeedToRotate(){
	var offset:Vector3 = -(NextPoint() - transform.position);
	if (offset == Vector3.zero) {
		return 0;
	};
 	var targetRotation:Quaternion = Quaternion.LookRotation(offset);	
 	var angle:float = Quaternion.Angle(transform.rotation, targetRotation);
 	if (this == player)
 		print("Angle Need to Rotate:" + angle.ToString());
	return angle;
}

private function RotateTowardTarget(){
	var offset:Vector3 = -(NextPoint() - transform.position);
	// Update Rotation
	if (offset == Vector3.zero) {
		return;
	}
 	var targetRotation:Quaternion = Quaternion.LookRotation(offset);	
	transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * smooth);
}

private function MoveTowardTarget(){
	transform.position = Vector3.MoveTowards(transform.position,
		NextPoint(),
		Time.deltaTime * speed);
}

private function RotateToPlayer(){
	if (targetPosition == transform.position && this != player){
		var offset:Vector3 = transform.position - player.Position();	
		var targetRotation:Quaternion = Quaternion.LookRotation(offset);
	 	
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation,
			Time.deltaTime * smooth);		
	}	
}

private function NextPoint(){
	if(Tweakable.UsePathfinding){
		return path.vectorPath[currentWaypoint];
	}else{
		return targetPosition;
	}
}

function MoveTo(p:Vector3){
	if (p == Vector3.zero){
		targetPosition = Vector3.zero;
		path = null;
		return;
	}
	targetPosition = SnapToGround(p);
	print("Moving To:" + targetPosition.ToString());

	if(Tweakable.UsePathfinding){
		if (!LineOfSightToTarget()){
	    	seeker.StartPath (transform.position,targetPosition, PathfindingComplete);		
	    }else{
	    	DirectPathToTarget();	
	    }	
	}
}

function PathfindingComplete(p:Path){
    Debug.Log ("Yey, we got a path back. Did it have an error? "+p.error);	
    if (!p.error) {
        path = p;
        //Reset the waypoint counter
        currentWaypoint = 0;
		for (var i:int = 0; i< path.vectorPath.Length; i++){
			path.vectorPath[i] = SnapToGround(path.vectorPath[i]);
			print(path.vectorPath[i]);
		}
    }
}


private function UpdateHP(){
	var ratio:float = 1-HP/maxHP;
	Renderer().material.color = Color.Lerp(color, Color.grey, ratio*0.8);	
}

private var fireColor:Color = Color(204/255.0,29/255.0,64/255.0);
private var freezeInProgress:boolean = false;
private var fireInProgress:boolean = false;


private function UpdateEffects(){
	if (!effects || effects.length == 0)
		return;
	
	var newEffects:Array = new Array();
	
	for (var e:Effect in effects){
		e.currentTime += Time.deltaTime;
		if (e.currentTime < e.duration){
			newEffects.Add(e);
		}
	}
	
	effects = newEffects;

	if (effects.length != 0){
		print(effects[0]);
	}

	// Update the visual
	if (HasEffect(Effect.Freeze)){
		if (!freezeInProgress){
			freezeInProgress = true;
			Renderer().material.SetColor(kOutlineColor, Tweakable.FreezeColor);
			Renderer().material.SetFloat(kOutlineWidth, freezeOutlineWidth);			
			print("Changing Color");
		}
	}else{
		if (freezeInProgress){
			freezeInProgress = false;
			Renderer().material.SetColor(kOutlineColor, borderColor);			
			Renderer().material.SetFloat(kOutlineWidth, outlineWidth);			
		}
	}
	
	if (HasEffect(Effect.Fire)){
		if (!fireInProgress){
			fireInProgress = true;
			Renderer().material.SetColor(kOutlineColor, Tweakable.FreezeColor);
		}
	}else{
		if (fireInProgress){
			fireInProgress = false;
			Renderer().material.SetColor(kOutlineColor, borderColor);			
		}
	}
	
}

private var currentAnimation:PawnAnimationState;
private var blendTime:float = 0.2;

enum PawnAnimationState{
	Idle = 0,
	Move = 1,
	Attack = 2,
}

static var AnimationName = [
	"idle",
	"move",
	"attack"
];

function SwitchAnimation(newAnimation:PawnAnimationState){
	if (newAnimation == currentAnimation)
		return;
		
	currentAnimation = newAnimation;
	if (animation && animation[AnimationName[newAnimation]]){
		//print(AnimationName[newAnimation]);
		animation.CrossFade(AnimationName[newAnimation], blendTime);
		print("Attack Anim")		;
	}
}

function Position():Vector3{
	return GetComponent(Transform).position;
}

function Rotation():Quaternion{
	return GetComponent(Transform).rotation;
}

function Radius():float{
	return radius;
}


function SnapToGround(p:Vector3):Vector3{
	return Vector3(p.x, Tweakable.FootCompensation, p.z);
}



private var centerCompensation:float = 1.2;

function CenterCompensatedPosition(p:Vector3):Vector3{
	return Vector3(p.x, p.y+centerCompensation, p.z);
}

function Damage(damage:float){
	HP -= damage;
	if (HP <= 0 && !isDead){
		isDead = true;	
		Die();
	}
}

function Heal(amount:float){
	// TODO: Add feedback;
	HP += amount;
	if (HP >= maxHP){
		HP = maxHP;
	}
}

private var effects:Array = new Array();

function AddEffect(e:Effect){
	var currentEffect:Effect = HasEffect(e.name);
	if (currentEffect) {
		currentEffect.Reset();
	}else{
		effects.Add(e);		
	}
}

function HasEffect(n:String){
	for (var e:Effect in effects){
		if (e.name == n){
			return e;			
		}
	}
	return null;
}

function Die(){
	var fx:GameObject = Instantiate(deathParticle, transform.position, Quaternion.identity);
	fx.GetComponent(ParticleAnimator).autodestruct = true;
	gameObject.SetActiveRecursively(false);
}

function IsDead(){
	return isDead;
}