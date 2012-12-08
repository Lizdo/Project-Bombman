#pragma strict

import Tweakable;

private var skin:GUISkin;
public var skinNormal:GUISkin;
public var skin2X:GUISkin;

private var objectiveManager:ObjectiveManager;
private var pawnManager:PawnManager;
private var player:Player;
private var doubleResolution:boolean = false;

function Start() {
    Time.timeScale = 1.0;
    pawnManager = FindObjectOfType(PawnManager);
    objectiveManager = FindObjectOfType(ObjectiveManager);
    player = FindObjectOfType(Player);
    skin = skinNormal;

    #if UNITY_IPHONE
        if (Application.platform == RuntimePlatform.IPhonePlayer){
            switch (iPhone.generation){
                case iPhoneGeneration.iPhone4:
                case iPhoneGeneration.iPhone4S:
                case iPhoneGeneration.iPodTouch4Gen:
                    doubleResolution = true;
                    break;
            }
        }
    #endif

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
        topBorderHeight *= 2;
        tooltipHeight *= 2;
        popupUIHeight *= 2;
    }

    LoadTextures();

    page = MenuPage.InGame;
}


private var padding:float = 5;
private var menuWidth:float = 100;

private var hpBarWidth:float = 170;
private var hpBarHeight:float = 20;

private var bossHPBarHeight:float = 20.0;
private var bossHPBarWidth:float = 150.0;
private var barPadding:float = 2.0;

private var descriptionUIWidth:float = 150;
private var descriptionUIHeight:float = 100;

private var buttonSize:float = 48;
private var offscreenIconSize:float = 8;

private var tooltipHeight:float = 16;

private var topBorderHeight:float = 2;
private var popupUIHeight:float = 90;

enum MenuPage{
    InGame,
    PauseMenu,
    FeatSelection,
    WaveComplete,
    WaveCompleteFeatSelection
}

private var page:MenuPage;

function OnGUI () {
    if (skin != null) {
        GUI.skin = skin;
    }

    if (popupInProgress){
        PopupUI();
        return;
    }    

    if (objectiveManager.state == GameState.GameLoaded){
        GameLoadedPage();
        return;
    }

    if (objectiveManager.state == GameState.WaveAnnouncement){
        WaveAnnouncementPage();
        return;
    }

    if (objectiveManager.state != GameState.Gameplay
        && objectiveManager.state != GameState.WaveCompleteMenu
        && objectiveManager.state != GameState.WaveCompleteAbilitySelectionMenu){
        return;
    }
    
    switch (page){
        case MenuPage.InGame:
            InGamePage();
            break;
        case MenuPage.PauseMenu:
            PausePage();
            break;
        case MenuPage.FeatSelection:
            FeatSelectionPage();
            break;
        case MenuPage.WaveComplete:
            WaveCompletePage();
            break;
        case MenuPage.WaveCompleteFeatSelection:
            WaveCompleteFeatSelectionPage();
            break;
    }
}


// Popup Menu
//  Check PopupInProgress
//  Call back
//

private var popupInProgress:boolean = false;

private var callback:String;

function ShowPopup(c:String){
    popupInProgress = true;
    callback = c;
}


function CallbackRestart(){
    objectiveManager.RestartMission();
}

function PopupUI(){
    GUILayout.BeginArea(Rect(Screen.width/2, Screen.height/2, menuWidth, popupUIHeight), GUIStyle("BarFull"));
        GUI.color = Tweakable.DefaultColor;

        GUILayout.Label("Are you sure?");

        GUI.color = Tweakable.WarningColor;
        if (GUILayout.Button ("Yes")) {
            SendMessage(callback);
        }

        GUI.color = Tweakable.FunctionColor;
        if (GUILayout.Button ("No")) {
            popupInProgress = false;
        }        

        GUI.color = Tweakable.DefaultColor;
    
    GUILayout.EndArea();
}


function LateUpdate () {
    if (Input.GetKeyDown("escape")) {
        if (IsGamePaused()){
            UnPauseGame();
        }else{
            PauseGame();
        }
    }
    if (objectiveManager.state == GameState.WaveCompleteMenu){
        if (page == MenuPage.InGame){
            page = MenuPage.WaveComplete;
        }
    }
    if (objectiveManager.state == GameState.Gameplay){
        if (page == MenuPage.WaveComplete){
            page = MenuPage.InGame;
        }
    }
}

function GameLoadedPage(){
    TooltipUI();
}

function WaveAnnouncementPage(){
    WaveDescriptionUI();
    TooltipUI();
}

function WaveDescriptionUI(){
    var description:int[] = objectiveManager.CurrentWave();
    var w:float = (buttonSize + padding) * description.length;
    var h:float = buttonSize;
    // TODO: Fix the padding bug properly
    var r:Rect = Rect(Screen.width/2 - w/2,
        Screen.height/2 + padding*4, //padding,
        w + padding,
        h + padding * 2);

    GUILayout.BeginArea(r);
    GUILayout.BeginHorizontal();
        for (var i:int in description){
            print(i);
            GUILayout.Label(pawnManager.Icon(i),  GUILayout.Width(buttonSize));
        } 
    GUILayout.EndHorizontal();
    GUILayout.EndArea();    
}

function TooltipUI(){
    var tipRect:Rect = Rect(padding, Screen.height - padding -tooltipHeight,
        tooltipHeight, Screen.width);

    GUI.Label (tipRect, objectiveManager.Tooltip());
}


function PausePage() {

    OffscreenPawnUI();
    BossHPBar();
    HPMPBar();

    DescriptionUI();
    

    GUILayout.BeginArea(Rect(Screen.width - menuWidth - padding, padding, menuWidth, 400));
        GUI.color = Tweakable.DefaultColor;
        if (GUILayout.Button ("Continue")) {
            UnPauseGame();
        }
        GUI.color = Tweakable.WarningColor;

        if (GUILayout.Button ("Restart")) {
            //objectiveManager.RestartMission();
            ShowPopup("CallbackRestart");
        }

        GUI.color = Tweakable.FunctionColor;

        if (GUILayout.Button ("Abilities")) {
            page = MenuPage.FeatSelection;
        }        

        GUI.color = Tweakable.DefaultColor;
    
    GUILayout.EndArea();

    TopBorder();
    TooltipUI();

}

public var pauseTexture:Texture2D;

function InGamePage(){
    // Upper Right
    GUILayout.BeginArea(Rect(Screen.width - menuWidth - padding, padding, menuWidth, 200)); 
    if (GUILayout.Button ("Pause")) {
    //if (GUILayout.Button(pauseTexture)){
        PauseGame();
    }
    GUILayout.EndArea();
    
    OffscreenPawnUI();
    HPMPBar();
    BossHPBar();
    AbilitySelectionUI();

    TopBorder();
}


function FeatSelectionPage(){
    GUILayout.BeginArea(Rect(Screen.width - menuWidth - padding, padding, menuWidth, 200)); 
    if (GUILayout.Button ("Done")) {
    //if (GUILayout.Button(pauseTexture)){
        if (objectiveManager.state == GameState.Gameplay){
            UnPauseGame();
        }else{
            page = MenuPage.WaveComplete;
            objectiveManager.GotoState(GameState.WaveCompleteMenu);
        }
        
    }
    GUILayout.EndArea();

    AbilitySelectionMenu();
    FeatSelectionMenu();

    TopBorder();
}

function WaveCompletePage(){
    GUILayout.BeginArea(Rect(Screen.width - menuWidth*2 - padding, padding, menuWidth*2, 200)); 
        GUI.color = Tweakable.DefaultColor;
        if (GUILayout.Button ("Next Wave")) {
            objectiveManager.GotoState(GameState.NewWave);
        }

        GUI.color = Tweakable.FunctionColor;

        if (GUILayout.Button ("Abilities")) {
            page = MenuPage.WaveCompleteFeatSelection;
            objectiveManager.GotoState(GameState.WaveCompleteAbilitySelectionMenu);
        }
        GUI.color = Tweakable.DefaultColor;
    GUILayout.EndArea();
    
    WaveDescriptionUI();

    TopBorder();
    TooltipUI();
}

function WaveCompleteFeatSelectionPage(){
    FeatSelectionPage();
}

function TopBorder(){
    var r:Rect = Rect(0,0,Screen.width,topBorderHeight);
    GUI.DrawTexture(r,topBorderTexture, ScaleMode.ScaleAndCrop);
}


function HPMPBar(){
    // Upper Left
    if (player == null)
        return;

    GUI.color = Tweakable.DefaultColor;    

    var HP:int = Mathf.Clamp(Mathf.Ceil(player.HP()), 0, 100000);
    var maxHP:int = Mathf.Ceil(player.maxHP); 
    var MP:int = Mathf.Clamp(Mathf.Ceil(player.MP()), 0, 100000);
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


function BossHPBar(){
    var boss:Pawn = pawnManager.Boss();
    if (boss == null)
        return;

    var r:Rect = Rect(padding, Screen.height - padding - bossHPBarHeight,bossHPBarWidth, bossHPBarHeight);
    GUILayout.BeginArea(r, GUIStyle("BarEmpty"));
        var bar:Rect = Rect(barPadding, barPadding,
            boss.HP()/boss.maxHP * (bossHPBarWidth - barPadding * 2),
            bossHPBarHeight - barPadding * 2);
        GUILayout.BeginArea(bar, GUIStyle("BarFull"));
        GUILayout.EndArea();
    GUILayout.EndArea();

}


//////////////////////////////////////
//  Offscreen Pawn Dot
//////////////////////////////////////

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

//////////////////////////////////////
//  Pause Game UI -  Pawn Info
//////////////////////////////////////

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
        if (p.ShowDetail()){
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


function ParsePauseData(){
    for (var p:Pawn in pawnManager.Pawns()){
        p.ParsePauseData();
    }
}

///////////////////
//  In Game UI
///////////////////


private var bombActive:Texture2D;
private var bombInactive:Texture2D;

private var zapActive:Texture2D;
private var zapInactive:Texture2D;

private var pushActive:Texture2D;
private var pushInactive:Texture2D;

private var topBorderTexture:Texture2D;

function LoadTextures(){
    bombActive = Resources.Load("BombActive", Texture2D);
    bombInactive = Resources.Load("BombInactive", Texture2D);

    zapActive = Resources.Load("ZapActive", Texture2D);
    zapInactive = Resources.Load("ZapInactive", Texture2D);

    pushActive = Resources.Load("PushActive", Texture2D);
    pushInactive = Resources.Load("PushInactive", Texture2D);

    dotTexture = Resources.Load("RedDot", Texture2D);

    topBorderTexture = Resources.Load("YellowBlackStrip", Texture2D);
}

function AbilitySelectionUI () {
    var w:float = buttonSize * 4;
    var h:float = buttonSize;
    // TODO: Fix the padding bug properly
    var r:Rect = Rect(Screen.width - menuWidth - padding - w,
        0, //padding,
        w + padding,
        h + padding * 2);
    GUILayout.BeginArea(r);//,  GUIStyle("BarFull")); 
    GUILayout.BeginHorizontal();


    GUILayout.Button(Feat.Icon(), GUILayout.Width(buttonSize));

    if(player.AbilityAvailable() && !Ability.inUse){
        if (GUILayout.Button (Ability.Icon(),  GUILayout.Width(buttonSize))) {
            player.UseAbility();
            lastButtonPress = Time.time;
        }
    }else{
        GUILayout.Button(Ability.IconInactive(),  GUILayout.Width(buttonSize));
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


    GUILayout.EndHorizontal();
    GUILayout.EndArea();    
}

//////////////////////////////////////
//  Ability Selection
//////////////////////////////////////

function AbilitySelectionMenu(){
    var w:float = Screen.width - menuWidth - padding * 2;
    var h:float = Screen.height/2;
    // TODO: Fix the padding bug properly
    var r:Rect = Rect(padding,
        padding,
        w,
        h);
    GUILayout.BeginArea(r, GUIStyle("BarEmpty")); 

    var half:int = Mathf.Ceil(Ability.NumberOfTypes/2.0);
    var i:int;

    // Group 1
    GUILayout.BeginHorizontal();
        for (i = 0; i < half; i++){
            AbilityItem(i);
        }
    GUILayout.EndHorizontal();

    // Group 2
    GUILayout.BeginHorizontal();
        for (i = half; i < Ability.NumberOfTypes; i++){
            AbilityItem(i);
        }
    GUILayout.EndHorizontal();


    GUILayout.EndArea();
}

function AbilityItem(i:int){
    var content:GUIContent;
    if (Ability.type == i){
        content = GUIContent(Ability.Name(i), Ability.Icon(i));    
    }else{
        content = GUIContent(Ability.Name(i), Ability.IconInactive(i));
    }
    
    if (GUILayout.Button (content, GUIStyle("AbilityButton"), GUILayout.Width(buttonSize+padding*4))) {
        if (Ability.Unlocked(i)){
            Ability.type = i;    
        }
    }
}


function FeatSelectionMenu(){

    var w:float = Screen.width - menuWidth - padding * 2;
    var h:float = Screen.height/2;
    // TODO: Fix the padding bug properly
    var r:Rect = Rect(padding,
        padding + Screen.height/2,
        w,
        h);
    GUILayout.BeginArea(r, GUIStyle("BarEmpty")); 

    var half:int = Mathf.Ceil(Feat.NumberOfTypes/2.0);
    var i:int;

    // Group 1
    GUILayout.BeginHorizontal();
        for (i = 0; i < half; i++){
            FeatItem(i);
        }
    GUILayout.EndHorizontal();

    // Group 2
    GUILayout.BeginHorizontal();
        for (i = half; i < Feat.NumberOfTypes; i++){
            FeatItem(i);
        }
    GUILayout.EndHorizontal();


    GUILayout.EndArea();

}

function FeatItem(i:int){
    var content:GUIContent;
    if (Feat.type == i){
        content = GUIContent(Feat.Name(i), Feat.Icon(i));    
    }else{
        content = GUIContent(Feat.Name(i), Feat.IconInactive(i));
    }

    if (GUILayout.Button (content, GUIStyle("AbilityButton"), GUILayout.Width(buttonSize+padding*4))) {
        if (Feat.Unlocked(i)){
            Feat.type = i;    
        }
    }
}


//////////////////////////////////////
//  Handle Pause/Resume
//////////////////////////////////////

private var lastButtonPress:float = 0;

function LastButtonPress():float{
    return lastButtonPress;
}


private var savedTimeScale:float;

function PauseGame() {
    page = MenuPage.PauseMenu;
    savedTimeScale = Time.timeScale;
    Time.timeScale = 0;
    AudioListener.pause = true;
    lastButtonPress = Time.time;
    ParsePauseData();
}

function UnPauseGame() {
    page = MenuPage.InGame;
    RemoveDescription();
    Time.timeScale = savedTimeScale;
    AudioListener.pause = false;
}

function IsGamePaused():boolean{
    if (page == MenuPage.InGame){
        return false;
    }
    return true;
}

function OnApplicationPause(pause:boolean) {
    if (IsGamePaused()) {
        AudioListener.pause = true;
    }
}