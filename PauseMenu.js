#pragma strict

import Tweakable;

private var skin:GUISkin;
public var skinNormal:GUISkin;
public var skin2X:GUISkin;

private var pawnManager:PawnManager;
private var player:Player;
private var doubleResolution:boolean = false;

function Start() {
    Time.timeScale = 1.0;
    pawnManager = FindObjectOfType(PawnManager);
    player = FindObjectOfType(Player);
    skin = skinNormal;

    if (Application.platform == RuntimePlatform.IPhonePlayer){
        switch (iPhoneSettings.generation){
            case iPhoneGeneration.iPhone4:
            case iPhoneGeneration.iPodTouch4Gen:
                doubleResolution = true;
                break;
        }
    }

    if (doubleResolution){
        skin = skin2X;

        padding *= 2;
        menuWidth *= 2;
        hpBarWidth *= 2;
        hpBarHeight *= 2;
        bossHPBarHeight *= 2;
        bossHPBarWidth *= 2;
        barPadding *= 2;
        descriptionUIWidth *= 2;
        descriptionUIHeight *= 2;
        buttonSize *= 2;
        offscreenIconSize *= 2;
    }

    LoadTextures();
}


private var padding:float = 5;
private var menuWidth:float = 100;

private var hpBarWidth:float = 170;
private var hpBarHeight:float = 35;

private var bossHPBarHeight:float = 20.0;
private var bossHPBarWidth:float = 150.0;
private var barPadding:float = 2.0;

private var descriptionUIWidth:float = 150;
private var descriptionUIHeight:float = 100;

private var buttonSize:float = 48;
private var offscreenIconSize:float = 8;

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


function PauseUI() {

    OffscreenPawnUI();
    BossHPUI();
    MPUI();

    DescriptionUI();
    

    GUILayout.BeginArea(Rect(Screen.width - menuWidth - padding, padding, menuWidth, 400));
        if (GUILayout.Button ("Continue")) {
            UnPauseGame();
        }
        if (GUILayout.Button ("Restart")) {
            FindObjectOfType(ObjectiveManager).RestartMission();
        }

        // GUI.color = Tweakable.WeaponColor;
        //     if (GUILayout.Button ("Bomb")) {
        //         Explosive.type = ExplosiveType.Bomb;
        //         UnPauseGame();
        //     }
        //     if (GUILayout.Button ("Zap")) {
        //         Explosive.type = ExplosiveType.Zap;
        //         UnPauseGame();
        //     }
        //     if (GUILayout.Button ("Push")) {
        //         Explosive.type = ExplosiveType.Push;
        //         UnPauseGame();
        //     }
        // GUI.color = Tweakable.DefaultColor;
        
        // GUI.color = Tweakable.FreezeColor;
        //     if (GUILayout.Button ("Freeze")) {
        //         FindObjectOfType(Player).UseAbility(Ability.AbilityFreeze);     
        //         UnPauseGame();
        //     }
        // GUI.color = Tweakable.DefaultColor;
    
    GUILayout.EndArea();

}

public var pauseTexture:Texture2D;

function InGameUI(){
    // Upper Right
    GUILayout.BeginArea(Rect(Screen.width - menuWidth - padding, padding, menuWidth, 200)); 
    if (GUILayout.Button ("Pause")) {
    //if (GUILayout.Button(pauseTexture)){
        PauseGame();
    }
    GUILayout.EndArea();
    
    OffscreenPawnUI();
    MPUI();
    BossHPUI();
    ExplosiveSelectionUI();
}


function MPUI(){
    // Upper Left
    if (player == null)
        return;

    GUI.color = Tweakable.DefaultColor;    

    var HP:int = Mathf.Clamp(Mathf.Ceil(player.HP), 0, 100000);
    var maxHP:int = Mathf.Ceil(player.maxHP); 
    var MP:int = Mathf.Clamp(Mathf.Ceil(player.MP), 0, 100000);
    var maxMP:int = Mathf.Ceil(player.maxMP);

    GUILayout.BeginArea(Rect(padding, padding, hpBarWidth, hpBarHeight*2),  GUIStyle("BarEmpty"));    

        var bar:Rect = Rect(barPadding, barPadding,
            (HP+0.001)/maxHP * (hpBarWidth - barPadding * 2),
            hpBarHeight - barPadding * 2);
        GUILayout.BeginArea(bar, GUIStyle("BarFull"));
        GUILayout.EndArea();

        bar = Rect(barPadding, hpBarHeight + barPadding,
            (MP+0.001)/maxMP * (hpBarWidth - barPadding * 2),
            hpBarHeight - barPadding * 2);
        GUILayout.BeginArea(bar, GUIStyle("BarFull"));
        GUILayout.EndArea();        


        if((HP+0.001)/maxHP <= 0.2){
            GUI.color = Tweakable.LowHealthColor;
        }
        GUILayout.Label("HP:"+HP+"/"+maxHP);
        GUI.color = Tweakable.DefaultColor;

        if((MP+0.001)/maxMP <= 0.2){
            GUI.color = Tweakable.LowManaColor;
        }
        GUILayout.Label("MP:"+MP+"/"+maxMP);
        GUI.color = Tweakable.DefaultColor;

    GUILayout.EndArea();
}


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


function OffscreenPawnUI(){
    for (var p:Pawn in pawnManager.Pawns()){
        OffscreenIconForPawn(p);
    }
    GUI.color = Tweakable.DefaultColor;
}



function OffscreenIconForPawn(p:Pawn){
    if (p == player || !IsOffscreen(p))
        return;

    // Draw a arrow
    var v:Vector2 = Vector2(p.ScreenPosition().x, Screen.height - p.ScreenPosition().y);    
    var center:Vector2 = Vector2(Screen.width/2-offscreenIconSize, Screen.height/2-offscreenIconSize);
    var topLeft:Vector2 = Vector2(offscreenIconSize,offscreenIconSize);
    var topRight:Vector2 = Vector2(Screen.width-offscreenIconSize, offscreenIconSize);
    var bottomLeft:Vector2 = Vector2(offscreenIconSize,Screen.height-offscreenIconSize);
    var bottomRight:Vector2 = Vector2(Screen.width-offscreenIconSize,Screen.height-offscreenIconSize);
    var intersection:Vector2;

    GUI.color = p.FillColor();

    //Top
    intersection = IntersectionForLines(v,center,topLeft,topRight);
    if (intersection != Vector2.zero){
        DrawDotAt(intersection);
        return;
    }

    //Left
    intersection = IntersectionForLines(v,center,topLeft,bottomLeft);
    if (intersection != Vector2.zero){
        DrawDotAt(intersection);
        return;
    }

    //Bottom
    intersection = IntersectionForLines(v,center,bottomRight,bottomLeft);
    if (intersection != Vector2.zero){
        DrawDotAt(intersection);
        return;
    }

    //Right
    intersection = IntersectionForLines(v,center,bottomRight,topRight);
    if (intersection != Vector2.zero){
        DrawDotAt(intersection);
        return;
    }    
}

private var dotTexture:Texture2D;

function DrawDotAt(v:Vector2){
    GUI.DrawTexture(Rect(v.x - offscreenIconSize,v.y - offscreenIconSize,offscreenIconSize*2,offscreenIconSize*2), dotTexture,ScaleMode.StretchToFill, true);
}

// http://paulbourke.net/geometry/lineline2d/

function IntersectionForLines(v1:Vector2, v2:Vector2, v3:Vector2, v4:Vector2):Vector2{
    var ua:float = ((v4.x - v3.x) * (v1.y - v3.y) - (v4.y - v3.y) * (v1.x - v3.x))/((v4.y - v3.y)*(v2.x - v1.x) - (v4.x - v3.x) * (v2.y - v1.y));
    var ub:float = ((v2.x - v1.x) * (v1.y - v3.y) - (v2.y - v1.y) * (v1.x - v3.x))/((v4.y - v3.y)*(v2.x - v1.x) - (v4.x - v3.x) * (v2.y - v1.y));

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1){
        return Vector2.zero;
    }

    var x:float = v1.x + ua * (v2.x - v1.x);
    var y:float = v1.y + ua * (v2.y - v1.y);

    //print("Intersection:" + Vector2(x,y).ToString());
    return Vector2(x,y);
}


private var offscreenTolerance:float = 20; //px

function IsOffscreen(p:Pawn){
    var v:Vector2 = Vector2(p.ScreenPosition().x, Screen.height - p.ScreenPosition().y);

    if (v.x <= -offscreenTolerance || v.x >= Screen.width+offscreenTolerance)
        return true;

    if (v.y <= -offscreenTolerance || v.y >= Screen.height+offscreenTolerance)
        return true;

    return false;
}

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

private var savedTimeScale:float;

function PauseGame() {
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
    lastButtonPress = Time.time;
    ParsePauseData();
}

function ParsePauseData(){
    for (var p:Pawn in pawnManager.Pawns()){
        p.ParsePauseData();
    }
}

private var bombActive:Texture2D;
private var bombInactive:Texture2D;

private var zapActive:Texture2D;
private var zapInactive:Texture2D;

private var pushActive:Texture2D;
private var pushInactive:Texture2D;

function LoadTextures(){
    bombActive = Resources.Load("BombActive", Texture2D);
    bombInactive = Resources.Load("BombInactive", Texture2D);

    zapActive = Resources.Load("ZapActive", Texture2D);
    zapInactive = Resources.Load("ZapInactive", Texture2D);

    pushActive = Resources.Load("PushActive", Texture2D);
    pushInactive = Resources.Load("PushInactive", Texture2D);

    dotTexture = Resources.Load("RedDot");
}

function ExplosiveSelectionUI () {
    var w:float = buttonSize * 4;
    var h:float = buttonSize;
    // TODO: Fix the padding bug properly
    var r:Rect = Rect(Screen.width - menuWidth - padding - w,
        0, //padding,
        w + padding,
        h + padding * 2);
    GUILayout.BeginArea(r);//,  GUIStyle("BarFull")); 
    GUILayout.BeginHorizontal();


    if(player.FeatAvailable() && !Feat.inUse){
        if (GUILayout.Button (Feat.Icon(),  GUILayout.Width(buttonSize))) {
            player.UseFeat();
            lastButtonPress = Time.time;
        }
    }else{
        GUILayout.Button(Feat.IconInactive(),  GUILayout.Width(buttonSize));
    }

    if (Explosive.type == ExplosiveType.Bomb){
        if (GUILayout.Button (bombActive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Bomb;
            lastButtonPress = Time.time;
        }        
    }else{
        if (GUILayout.Button (bombInactive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Bomb;
            lastButtonPress = Time.time;
        }          
    }

    if (Explosive.type == ExplosiveType.Zap){
        if (GUILayout.Button (zapActive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Zap;
            lastButtonPress = Time.time;
        }        
    }else{
        if (GUILayout.Button (zapInactive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Zap;
            lastButtonPress = Time.time;
        }
    }       

    if (Explosive.type == ExplosiveType.Push){
        if (GUILayout.Button (pushActive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Push;
            lastButtonPress = Time.time;
        }        
    }else{
        if (GUILayout.Button (pushInactive,  GUILayout.Width(buttonSize))) {
            Explosive.type = ExplosiveType.Push;
            lastButtonPress = Time.time;
        }
    }

    GUILayout.EndHorizontal();
    GUILayout.EndArea();    
}

private var lastButtonPress:float = 0;

function LastButtonPress():float{
    return lastButtonPress;
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