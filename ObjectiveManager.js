
private var isGamePaused:boolean;
private var pawnManager:PawnManager;

private var waves:Array = new Array();
private var spawnInProgress:boolean = true;

function Start() {
	isGamePaused = true;
	MissionStart();


	GUI.color = Tweakable.DefaultColor;

	pawnManager = FindObjectOfType(PawnManager);

	waves[0] = [1,1,1];
	waves[1] = [1,1,1,1];
	waves[2] = [1,1,1,2,2,2];

	print("ObjManager Initialized");

	StartPhase();
	isGamePaused = false;


}

private var phase:int = 0;
private var maxPhase:int = 3;

function Phase(){
	return phase;
}

function Update () {
	if (spawnInProgress){
		return;
	}

	var allDead:boolean = true;

	var enemies:Enemy[] = FindObjectsOfType(Enemy);
	for (var e:Enemy in enemies){
		if (e != null && !e.IsDead()){
			allDead = false;
			break;
		}
	}



	if (allDead){
		GotoNextPhase();
	}
}

function GotoNextPhase(){
	spawnInProgress = true;

	phase++;
	if (phase == maxPhase){
		MissionComplete();
		return;
	}

	//Spawn Phase X creatures
	StartPhase();
}

function StartPhase(){

	if (phase >= 1){
		SetText("Phase " + (phase+1).ToString() + " Start");
	}

	for (var i:int in waves[phase]){
		pawnManager.Spawn(i);
	}

	spawnInProgress = false;	

	yield WaitForSeconds(2);
	SetText("");	

}


function IsGamePaused():boolean{
	return isGamePaused;
}

function SetText(text:String){
	guiText.text = text;
}

function MissionStart() {
	SetText("Mission Start");

	yield WaitForSeconds(2);
	SetText("");	
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