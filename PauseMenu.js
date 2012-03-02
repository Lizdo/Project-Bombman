#pragma strict

import Tweakable;

private var skin:GUISkin;
public var skinNormal:GUISkin;
public var skin2X:GUISkin;

private var pawnManager:PawnManager;

function Start() {
    Time.timeScale = 1.0;
    pawnManager = FindObjectOfType(PawnManager);

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
    GUILayout.BeginArea(Rect(Screen.width - 100 - padding, padding, 100, 400));
        if (GUILayout.Button ("Continue")) {
            UnPauseGame();
        }
        if (GUILayout.Button ("Restart")) {
            FindObjectOfType(ObjectiveManager).RestartMission();
        }

        GUI.color = Tweakable.WeaponColor;
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
    DescriptionUI();
    BossHPUI();
}

public var pauseTexture:Texture2D;

function InGameUI(){
    // Upper Right
    GUILayout.BeginArea(Rect(Screen.width - 100 - padding, padding, 100, 200)); 
    if (GUILayout.Button ("Pause")) {
    //if (GUILayout.Button(pauseTexture)){
        PauseGame();
    }
    GUILayout.EndArea();
    
    MPUI();
    BossHPUI();
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

private var bossHPBarHeight:float = 20.0;
private var bossHPBarWidth:float = 300.0;
private var barPadding:float = 2.0;

function BossHPUI(){
    var boss:Pawn = pawnManager.Boss();
    if (boss == null)
        return;

    var r:Rect = Rect(padding, Screen.height - padding - bossHPBarHeight,bossHPBarWidth, bossHPBarHeight);
    GUILayout.BeginArea(r, GUIStyle("BarEmpty"));
        var bar:Rect = Rect(barPadding, barPadding,
            boss.HP/boss.maxHP * (bossHPBarWidth - barPadding * 2),
            bossHPBarHeight - barPadding * 2);
        GUILayout.BeginArea(bar, GUIStyle("BarFull"));
        GUILayout.EndArea();
    GUILayout.EndArea();

}

private var descriptionUIWidth:float = 150;
private var descriptionUIHeight:float = 100;

function DescriptionUI() {
    for (var p:Pawn in pawnManager.Pawns()){
        DescriptionForPawn(p);
    }
    // if (descriptionLocation == Vector2.zero){
    //     return;
    // }

    // GUILayout.BeginArea(Rect(descriptionLocation.x, descriptionLocation.y, descriptionUIWidth, descriptionUIHeight));
    //     GUILayout.Label(title, GUIStyle("Title"));
    //     GUILayout.Label(description, GUIStyle("Description"));
    // GUILayout.EndArea();
}

function DescriptionForPawn(p:Pawn){
    var v:Vector2 = Vector2(p.ScreenPosition().x, Screen.height - p.ScreenPosition().y);

    if (v.x <= 0 || v.x >= Screen.width)
        return;

    if (v.y <= 0 || v.y >= Screen.height)
        return;

    GUILayout.BeginArea(Rect(v.x, v.y, descriptionUIWidth, descriptionUIHeight));
        GUILayout.Label(p.Title(), GUIStyle("Title"));
        if (p.showDetail){
            GUILayout.Label(p.Description(), GUIStyle("Description"));  
        }
    GUILayout.EndArea();    
}


private var descriptionLocation:Vector2;
private var title:String;
private var description:String;

function AddDescription(v:Vector2, s1:String, s2:String){
    descriptionLocation = Vector2(v.x, Screen.height - v.y);    

    
    if (descriptionLocation.x + descriptionUIWidth >= Screen.width + padding){
        descriptionLocation.x = Screen.width - padding - descriptionUIWidth;
    }

    if (descriptionLocation.y + descriptionUIHeight >= Screen.height + padding){
        descriptionLocation.y = Screen.height - padding - descriptionUIHeight;
    }

    title = s1;
    description = s2;
}

function RemoveDescription(){
    descriptionLocation = Vector2.zero;
    title = "";
    description = "";
}

function PauseGame() {
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
    lastPaused = Time.time;
    ParsePauseData();
}

function ParsePauseData(){
    for (var p:Pawn in pawnManager.Pawns()){
        p.ParsePauseData();
    }
}

private var lastPaused:float = 0;

function LastPaused():float{
    return lastPaused;
}

function UnPauseGame() {
    RemoveDescription();
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