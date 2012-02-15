private var player:Player;

private var Height:float = 6.0;
private var Rotation:float = 50.0;
private var PivotCompensation:float = 2.5;

private var ZOffset:float;
private var holdingTouch:boolean = false;

function Start (){
	//initialize the Player	
	player = FindObjectOfType(Player); 
	transform.rotation = Quaternion.Euler(Rotation,0,0);	 
	ZOffset = Height * Mathf.Tan(Rotation*Mathf.Deg2Rad)-PivotCompensation;
	print("Camera Initialized.");
}

function Update () {
	UpdateCameraPosition();
}

function UpdateCameraPosition(){
	if (player == null)
		return;
	var MCPosition:Vector3 = player.Position();
	transform.position = Vector3(MCPosition.x, Height, MCPosition.z - ZOffset);
}