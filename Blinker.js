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

private var teleportDistance:float = 10.0;

function Teleport(){
	var teleportMarkers:GameObject[] = GameObject.FindGameObjectsWithTag("TeleportMarker"); 
	var i = Mathf.Floor(Random.Range(0,teleportMarkers.length-0.001));
	var randomMarker:GameObject = teleportMarkers[i];

	transform.position = randomMarker.GetComponent(Transform).position;

	

	// var offset:Vector3 = Vector3(0,0,teleportDistance);
 //    var randomAngle:float = Random.value * 360;
 //    offset = Quaternion.AngleAxis(randomAngle, Vector3.up) * offset; 	
	// transform.position = player.Position() + offset;
}

}