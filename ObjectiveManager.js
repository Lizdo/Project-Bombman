#pragma strict


private var pawnManager:PawnManager;
private var pauseMenu:PauseMenu;

private var waves:Array = new Array();

private var delayBetweenWaves:float = 1;
private var resetHPMPBetweenWaves:boolean = false;

private static var kCurrentWave:String = "CurrentWave";

// Game Flow
// -   Press to Start
// -   Load to the latest wave
// -   Announce Wave: Composition
// -       Gameplay
// -   Announce Wave Complete
// -       Unlock New Ability/Feat
// -       Continue/Choose Ability

enum GameState{
    GameLoaded,
    WaveAnnouncement,
    Gameplay,
    WaveCompleted,
    WaveCompleteMenu,
    WaveCompleteAbilitySelectionMenu,
    NewWave
}

function GotoState(s:GameState){
    print(s);
    switch(s){
        case GameState.GameLoaded:
            SetText("Press to Start");
            break;
        case GameState.WaveAnnouncement:
            StartWave();
            break;
        case GameState.Gameplay:
            SetText("");
            break;
        case GameState.WaveCompleted:
            EndWave();
            break;
        case GameState.WaveCompleteMenu:
            SetText("Next Wave");
            break;
        case GameState.WaveCompleteAbilitySelectionMenu:
            SetText("");
            break;
        case GameState.NewWave:
            StartWave();
            break;
    }
    state = s;
}

public var state:GameState;

function IsGamePaused():boolean{
    if (state == GameState.Gameplay 
        ||state == GameState.WaveAnnouncement){
        return pauseMenu.IsGamePaused();
    }

    return true;
}

function IsGameplay():boolean{
    if (state == GameState.Gameplay 
        ||state == GameState.WaveAnnouncement){
        return true;
    }

    return false;
}

function Start() {

    GUI.color = Tweakable.DefaultColor;
    guiText.material.color = Tweakable.DefaultTextColor;

    pawnManager = FindObjectOfType(PawnManager);
    pauseMenu = FindObjectOfType(PauseMenu); 

    waves[0] = [1,1,1];
    waves[1] = [11,5];
    waves[2] = [11,3,3];
    waves[3] = [4,2,12,12];
    waves[4] = [11,5,5,2];
    waves[5] = [100];

    print("ObjManager Initialized");

    maxWave = waves.length;


    // TODO: serialize wave number and skip directly to this wave
    wave = PlayerPrefs.GetInt(kCurrentWave);
    if (wave > maxWave){
        wave = maxWave;
    }

    //StartWave(wave);

    GotoState(GameState.GameLoaded);

}

private var wave:int = 0;
private var maxWave:int = 3;

function Wave(){
    return wave;
}

function Update () {
    if (state != GameState.Gameplay){
        return;
    }

    if (pawnManager.AllPawnDead()){
        //GotoNextWave();
        GotoState(GameState.WaveCompleted);
    }
}

function GotoNextWave(){
    wave++;
    if (wave == maxWave){
        MissionComplete();
        return;
    }

    //Spawn Wave X creatures
    StartWave(wave);
}

function StartWave(){
    StartWave(wave);
}

function CurrentWave(){
    return waves[wave]; 
}

function Tooltip():String{
    return "Tooltip: Use FREEZE against snipers.";
}

public var WaveAnnouncementTime:float = 2.0;

function StartWave(waveNumber:int){

    wave = waveNumber;

    SetText("Wave " + (wave+1).ToString() + " Start");

    if (wave >= maxWave){
        print("Too Many Waves");
        MissionComplete();
        return;
    }

    if (resetHPMPBetweenWaves){
        var player:Player = FindObjectOfType(Player);
        player.ResetHPMP();    
    }

    // Save the current level
    PlayerPrefs.SetInt(kCurrentWave, wave);

    //yield WaitForSeconds(delayBetweenWaves);

    print(wave);
    for (var i:int in waves[wave]){
        pawnManager.Spawn(i);
    } 

    yield WaitForSeconds(WaveAnnouncementTime);

    GotoState(GameState.Gameplay);

}

function EndWave(){
    SetText("Wave " + (wave+1).ToString() + " Cleared!");
    yield WaitForSeconds(2);
    wave++;
    PlayerPrefs.SetInt(kCurrentWave, wave);

    GotoState(GameState.WaveCompleteMenu);
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
    PlayerPrefs.SetInt(kCurrentWave, 0);
    Application.LoadLevel ("Level0");
}

function MissionFail() {
    SetText("Mission Failed");
    yield WaitForSeconds(5);
    Application.LoadLevel ("Level0");   
}