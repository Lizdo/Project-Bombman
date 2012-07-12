#pragma strict

private var player:Player;

private var holdingTouch:boolean = false;
private var pauseMenu:PauseMenu;
private var objectiveManager:ObjectiveManager;

function Start (){
    //initialize the Player 
    player = FindObjectOfType(Player); 
    pauseMenu = FindObjectOfType(PauseMenu); 
    objectiveManager = FindObjectOfType(ObjectiveManager); 
    
    print("player initialized.");
    
    if (Application.platform == RuntimePlatform.IPhonePlayer){
        nearPlayerTolerance = nearPlayerToleranceIOS;
    }else{
        nearPlayerTolerance = nearPlayerTolerancePC;
    }
    
    
}

private var ignoreInputTime:float = 0.1;

function Update () {
    // if (pauseMenu.IsGamePaused()){
    //     return;     
    // }

    if (!player.gameObject.active){
        return;
    }

    // if (Time.time - pauseMenu.LastButtonPress() < ignoreInputTime){
    //     return;
    // }

    ProcessInput();
}

// Porcess the touch events during game pause to show the description views
function OnGUI() {
    if (pauseMenu.IsGamePaused()){
        ProcessPauseInput();
    }
}

function ProcessInput(){
    if (Application.platform == RuntimePlatform.IPhonePlayer){
        var touches = Input.touches;
        if (touches.length < 1)
            return;
        var touch:Touch = touches[0];
        if(touch.phase == TouchPhase.Began){
            TouchBeganAt(touch.position);
        }else if(touch.phase == TouchPhase.Moved
        || touch.phase == TouchPhase.Stationary){
            TouchMovedAt(touch.position);
        }else if(touch.phase == TouchPhase.Ended){
            TouchEndedAt(touch.position);
        }
    }else{
        if(Input.GetMouseButtonDown(0)){
            TouchBeganAt(Input.mousePosition);
        }else if(Input.GetMouseButton(0)){
            TouchMovedAt(Input.mousePosition);
        }else if(Input.GetMouseButtonUp(0)){
            TouchEndedAt(Input.mousePosition);
        }
    }   
}

function ProcessPauseInput(){
    // During Layout Wave, no event should be fired.
    if (Event.current.type == EventType.Layout){
        return;
    }

    if (Application.platform == RuntimePlatform.IPhonePlayer){
        var touches = Input.touches;
        if (touches.length < 1)
            return;
        var touch:Touch = touches[0];
        if(touch.phase == TouchPhase.Ended){
            PauseTouchEndedAt(touch.position);
        }
    }else{
        if(Input.GetMouseButtonUp(0)){
            PauseTouchEndedAt(Input.mousePosition);
        }
    }  
}

function PauseTouchEndedAt (point:Vector2){
    var ray : Ray = camera.ScreenPointToRay(Vector3(point.x,
        point.y,0));
    var hit : RaycastHit;
    var v:Vector2;
    if (Physics.Raycast (ray, hit, 200, Tweakable.kEnemyMask)){
        var enemy:Enemy = hit.collider.GetComponent(Enemy);
        enemy.SetDetail(!enemy.ShowDetail());
        //v = camera.WorldToScreenPoint(enemy.Position());
        //pauseMenu.AddDescription(point, enemy.Title(),enemy.Description());
        return;
    }

    if (Physics.Raycast (ray, hit, 200, Tweakable.kPickupMask)){
        var pickup:Pickup = hit.collider.GetComponent(Pickup);
        v = camera.WorldToScreenPoint(pickup.transform.position);        
        pauseMenu.AddDescription(point, pickup.Title(),pickup.Description());
        return;
    }

}


private var startHoldingTime:float;
private var touchNearPlayer:boolean;


// Input Handlers
function TouchBeganAt (point:Vector2){
    if (objectiveManager.IsGamePaused()){
        return;
    }

    holdingTouch = false;
    startHoldingTime = Time.time;
    touchNearPlayer = PointNearPlayer(point);
}

function TouchMovedAt (point:Vector2){
    if (objectiveManager.IsGamePaused()){
        return;
    }

    if(touchNearPlayer && PointNearPlayer(point) && !player.ExplodeCooldown()){
        if (Time.time - startHoldingTime >= player.HoldTimeThreshold()){
            holdingTouch = true;
            player.ProcessHold(startHoldingTime);
        }
    }else{
        touchNearPlayer = false;
        player.EndHold();
    }
}

function TouchEndedAt (point:Vector2){
    if (objectiveManager.state == GameState.GameLoaded){
        objectiveManager.GotoState(GameState.WaveAnnouncement);
        return;
    }

    if (objectiveManager.IsGamePaused()){
        return;
    }    

    if (holdingTouch){
        player.EndHold();
        holdingTouch = false;
        return;
    }
    
    // Issue Move Command
    var ray : Ray = camera.ScreenPointToRay(Vector3(point.x,
        point.y,0));
    var hit : RaycastHit;

    if (Physics.Raycast (ray, hit, 200, Tweakable.kObstacleMask)){
        return;
    }
    
    if (Physics.Raycast (ray, hit, 200, Tweakable.kFloorMask)){
        //Spawn Mark
        //Instantiate(moveTargetMark, hit.point, Quaternion.identity);  
        player.MoveTo(hit.point);
    }
    
}

private var nearPlayerTolerancePC:float = 1000;//100;
private var nearPlayerToleranceIOS:float = 1000;//200;
private var nearPlayerTolerance:float;

function PointNearPlayer (point:Vector2) :boolean{
    var center:Vector2 = Vector2(Screen.width/2, Screen.height/2);
    return Vector2.Distance(center,point) <= nearPlayerTolerance;
}
