#pragma strict


private var pawnManager:PawnManager;
private var pauseMenu:PauseMenu;

private var waves:Array = new Array();
private var tooltips:Array = new Array();

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
    waves[1] = [5];
    waves[2] = [1,1,4];
    waves[3] = [11,4,1,1];
    waves[4] = [11,11,11,4];
    waves[5] = [11,11,5];
    waves[6] = [5,5,5];
    waves[7] = [5,5,11,11,4];    
    waves[8] = [3,3];
    waves[9] = [3,3,12,12];
    waves[10] = [1,1,1,11,11,11,5,5];
    waves[11] = [11,11,4,4,4,5,12];
    waves[12] = [2,2,2];
    waves[13] = [2,2,2,12,12,4];
    waves[14] = [100];
    
    tooltips[0] = "Hold touch to charge EXPLOSION.";
    tooltips[1] = "You can switch between CHARGE and EXPLOSION.";
    tooltips[2] = "Use SHIELD to absorb some damage.";
    tooltips[3] = "EXPLODER will spawn TICKERs when killed.";
    tooltips[4] = "Use HEAL to replenish some health.";
    tooltips[5] = "Choose your active ability wisely.";
    tooltips[6] = "Use TRAMPLE to push back melee enemies.";
    tooltips[7] = "Keep distance from your enemies.";
    tooltips[8] = "Use FREEZE to stop the enemies from moving.";    
    tooltips[9] = "HEALER will heal the other units";
    tooltips[10] = "Use WRATH to boost your damage.";   
    tooltips[11] = "Use CHARGE to replenish your MANA from time to time.";
    tooltips[12] = "Use TELEPORT to quickly move outside BOOMER's attack range.";   
    tooltips[13] = "Kill the HEALERs first.";
    tooltips[14] = "Use DEFLECTION with good timing to deal good damage.";

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
    return "TIP: " + tooltips[wave];
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