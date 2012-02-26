public class Blinker extends Enemy{

function Start(){
	super.Start();

	//Override values
	speed = 3.0;
	maxHP = HP = 2000.0;
	attackRadius = 5.0;
	dps = 20;
	attackType = AttackType.Ranged;
	attackSpeed = 1.0;

	InitAttackRadius();
}

// Loop:
//		Normal Attack for 10 seconds
//		Teleport to random position

private var teleportTickingTime:float;
private var teleportInterval:float = 10.0;

function UpdateGoals(){
	teleportTickingTime += tickInterval;
	if (teleportTickingTime >= teleportInterval){
		teleportTickingTime = 0;
		Teleport();
	}

	super.UpdateGoals();
}

function Update(){
	super.Update();

	if (blinking){
		wasBlinking = true;
		UpdateBlink();
	}

	if (!blinking && wasBlinking){
		wasBlinking = false;
		ResetBlink();
	}	
}

private var teleportDistance:float = 10.0;


//Blink for 1 seconds, then real teleport

private var blinkTime:float = 2.0;

function Teleport(){
	if (HasEffect(Effect.Freeze))
		return;

	var teleportMarkers:GameObject[] = GameObject.FindGameObjectsWithTag("TeleportMarker"); 

	if (teleportMarkers.length == 0){
		print("No Marker To Teleport");
		return;
	}

	blinking = true;
	print("Blinking");
	yield WaitForSeconds(blinkTime);
	blinking = false;

	var randomIndex = Mathf.Floor(Random.Range(0,teleportMarkers.length-0.001));
	var randomMarker:GameObject = teleportMarkers[randomIndex];

	transform.position = randomMarker.GetComponent(Transform).position;
}

private var offTime:float = 0;
private var blinkDuration:float = 0.1;
private var blinking:boolean = false;
private var wasBlinking:boolean = false;

function UpdateBlink(){
    offTime += Time.deltaTime;
    if (offTime >= blinkDuration){
        offTime = 0;
        if (Renderer().material.color == Color.white){
            SetColor(color);
            SetOutlineColor(borderColor);
        }else{
            SetColor(Color.white);
            SetOutlineColor(Color.white);
        }
    }
}

function ResetBlink(){
    SetColor(color);
    SetOutlineColor(borderColor);
}

}