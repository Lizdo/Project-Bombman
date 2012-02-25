private var player:Player;

private var height:float = 6.0;
private var rotation:float = 50.0;
private var PivotCompensation:float = 2.5;

private var ZOffset:float;
private var holdingTouch:boolean = false;

public function Height(){
	return height;
}

function Start (){
	InitializeQualitySetting();
	//initialize the Player	
	player = FindObjectOfType(Player); 
	transform.rotation = Quaternion.Euler(rotation,0,0);	 
	ZOffset = height * Mathf.Tan(rotation*Mathf.Deg2Rad)-PivotCompensation;
	print("Camera Initialized.");
}

function Update () {
	UpdateCameraPosition();
}

function ScreenBound():float{
	return height * Mathf.Tan(rotation*Mathf.Deg2Rad) + PivotCompensation;
}

function UpdateCameraPosition(){
	if (player == null)
		return;
	var MCPosition:Vector3 = player.Position();
	transform.position = Vector3(MCPosition.x, height, MCPosition.z - ZOffset);
}

function InitializeQualitySetting(){
	if (Application.platform == RuntimePlatform.IPhonePlayer){
		switch (iPhoneSettings.generation){
			case iPhoneGeneration.iPad1Gen:
			case iPhoneGeneration.iPhone3GS:
				QualitySettings.antiAliasing = 0;
		}
	}
}