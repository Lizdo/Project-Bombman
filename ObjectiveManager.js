#pragma strict


private var isGamePaused:boolean;
private var pawnManager:PawnManager;

private var waves:Array = new Array();
private var spawnInProgress:boolean = true;

private var delayBetweenWaves:float = 1;

private static var kCurrentPhase:String = "CurrentPhase";

function Start() {
    isGamePaused = true;
    MissionStart();


    GUI.color = Tweakable.DefaultColor;

    pawnManager = FindObjectOfType(PawnManager);

    waves[0] = [1];
    waves[1] = [2];
    waves[2] = [3];
    waves[3] = [4];
    waves[4] = [5];
    waves[5] = [2,3,4,4];
    waves[6] = [2,2,3,3,4];
    waves[7] = [100];

    print("ObjManager Initialized");

    maxPhase = waves.length;


    // TODO: serialize phase number and skip directly to this phase
    phase = PlayerPrefs.GetInt(kCurrentPhase);
    if (phase > maxPhase){
        phase = maxPhase;
    }

    StartPhase(phase);
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

    if (pawnManager.AllPawnDead()){
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
    StartPhase(phase);
}

function StartPhase(phaseNumber:int){

    if (phaseNumber >= 1){
        SetText("Phase " + (phaseNumber+1).ToString() + " Start");
    }

    if (phaseNumber >= maxPhase){
        print("Too Many Phases");
        MissionComplete();
        return;
    }

    var player:Player = FindObjectOfType(Player);
    player.ResetHPMP();

    // Save the current level
    PlayerPrefs.SetInt(kCurrentPhase, phase);

    yield WaitForSeconds(delayBetweenWaves);

    print(phaseNumber);
    for (var i:int in waves[phaseNumber]){
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
    PlayerPrefs.SetInt(kCurrentPhase, 0);
    Application.LoadLevel ("Level0");
}

function MissionFail() {
    SetText("Mission Failed");
    yield WaitForSeconds(5);
    Application.LoadLevel ("Level0");   
}