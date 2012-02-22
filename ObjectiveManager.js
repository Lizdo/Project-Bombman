
private var isGamePaused:boolean;
private var pawnManager:PawnManager;


function Start() {
	isGamePaused = true;
	MissionStart();
	yield WaitForSeconds(2);
	SetText("");
	isGamePaused = false;

	GUI.color = Tweakable.DefaultColor;
	StartPhase();

	pawnManager = FindObjectOfType(PawnManager);
	pawnManager.Spawn(PawnType.Boomer);
	pawnManager.Spawn(PawnType.Boomer);
	pawnManager.Spawn(PawnType.Boomer);

	pawnManager.Spawn(PawnType.Ticker);
	pawnManager.Spawn(PawnType.Ticker);
	pawnManager.Spawn(PawnType.Ticker);

}

private var phase:int = 0;
private var maxPhase:int = 1;

function Phase(){
	return phase;
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

function GotoNextPhase(){
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
		SetText("Phase " + phase.ToString() + " Start");
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