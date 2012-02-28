#pragma strict

import Tweakable;

private var skin:GUISkin;
public var skinNormal:GUISkin;
public var skin2X:GUISkin;

function Start() {
    Time.timeScale = 1.0;

    skin = skinNormal;

    if (Application.platform == RuntimePlatform.IPhonePlayer){
        switch (iPhoneSettings.generation){
            case iPhoneGeneration.iPhone4:
            case iPhoneGeneration.iPodTouch4Gen:
                skin = skin2X;
                break;
        }
    }

}


function OnGUI () {
    if (skin != null) {
        GUI.skin = skin;
    }   
    
    if (IsGamePaused()) {
        PauseUI();
    }else{
        InGameUI();
    }   
}


function LateUpdate () {
    if (Input.GetKeyDown("escape")) {
        if (IsGamePaused()){
            UnPauseGame();
        }else{
            PauseGame();
        }
    }
}

private var padding:float = 10;
private var savedTimeScale:float;


function PauseUI() {
    GUILayout.BeginArea(Rect(Screen.width - 200 - padding, padding, 200, 400));
    if (GUILayout.Button ("Continue")) {
        UnPauseGame();
    }
    if (GUILayout.Button ("Restart")) {
        FindObjectOfType(ObjectiveManager).RestartMission();
    }

    GUI.color = Tweakable.BombColor;
    if (GUILayout.Button ("Bomb")) {
        Explosive.type = ExplosiveType.Bomb;
        UnPauseGame();
    }
    if (GUILayout.Button ("Zap")) {
        Explosive.type = ExplosiveType.Zap;
        UnPauseGame();
    }
    if (GUILayout.Button ("Pulse")) {
        Explosive.type = ExplosiveType.Pulse;
        UnPauseGame();
    }
    GUI.color = Tweakable.DefaultColor;
    
    GUI.color = Tweakable.FreezeColor;
    if (GUILayout.Button ("Freeze")) {
        FindObjectOfType(Player).UseAbility(Ability.AbilityFreeze);     
        UnPauseGame();
    }
    GUI.color = Tweakable.DefaultColor;
    
    GUILayout.EndArea();
    
    MPUI(); 
}

function InGameUI(){
    // Upper Right
    GUILayout.BeginArea(Rect(Screen.width - 200 - padding, padding, 200, 200)); 
    if (GUILayout.Button ("Pause")) {
        PauseGame();
    }
    GUILayout.EndArea();
    
    MPUI();
}

function MPUI(){
    // Upper Left
    if (FindObjectOfType(Player) == null)
        return;

    GUI.color = Tweakable.DefaultColor;    

    var HP:int = Mathf.Ceil(FindObjectOfType(Player).HP);
    var maxHP:int = Mathf.Ceil(FindObjectOfType(Player).maxHP); 
    var MP:int = Mathf.Ceil(FindObjectOfType(Player).MP);
    var maxMP:int = Mathf.Ceil(FindObjectOfType(Player).maxMP);

    GUILayout.BeginArea(Rect(padding, padding, 400, 200));    

    if((HP+0.001)/maxHP <= 0.2){
        GUI.color = Tweakable.LowHealthColor;
    }
    GUILayout.Label("Health:"+HP+"/"+maxHP);
    GUI.color = Tweakable.DefaultColor;

    if((MP+0.001)/maxMP <= 0.2){
        GUI.color = Tweakable.LowManaColor;
    }
    GUILayout.Label("Mana:"+MP+"/"+maxMP);
    GUI.color = Tweakable.DefaultColor;

    GUILayout.EndArea();
}

function PauseGame() {
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
}

function UnPauseGame() {
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
}

function IsGamePaused() {
    return Time.timeScale==0;
}

function OnApplicationPause(pause:boolean) {
    if (IsGamePaused()) {
        AudioListener.pause = true;
    }
}