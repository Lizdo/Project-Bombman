
private var isGamePaused:boolean;

function Start() {
	isGamePaused = true;
	MissionStart();
	yield WaitForSeconds(2);
	SetText("");
	isGamePaused = false;
}

function Update () {
	var allDead:boolean = true;

	var enemies:Enemy[] = FindObjectsOfType(Enemy);
	for (var e:Enemy in enemies){
		if (e != null && !e.IsDead()){
			allDead = false;
			break;
		}
	}
	
	if (allDead){
		MissionComplete();
	}
}

function IsGamePaused():boolean{
	return isGamePaused;
}

function SetText(text:String){
	guiText.text = text;
}

function MissionStart() {
	SetText("Mission Start");
}

function MissionComplete() {
	SetText("Mission Complete");
	yield WaitForSeconds(5);
	RestartMission();
}

function RestartMission(){
	Application.LoadLevel ("Level0");	
}

function MissionFail() {
	SetText("Mission Failed");
	yield WaitForSeconds(5);
	Application.LoadLevel ("Level0");	
}