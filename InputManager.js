#pragma strict

private var player:Player;

private var holdingTouch:boolean = false;
private var pauseMenu:PauseMenu;

function Start (){
    //initialize the Player 
    player = FindObjectOfType(Player); 
    pauseMenu = FindObjectOfType(PauseMenu); 
    
    print("player initialized.");
    
    if (Application.platform == RuntimePlatform.IPhonePlayer){
        nearPlayerTolerance = nearPlayerToleranceIOS;
    }else{
        nearPlayerTolerance = nearPlayerTolerancePC;
    }
    
    
}

function Update () {
    if (pauseMenu.IsGamePaused()){
        return;     
    }
    ProcessInput();
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

private var startHoldingTime:float;
private var touchNearPlayer:boolean;


// Input Handlers
function TouchBeganAt (point:Vector2){
    holdingTouch = false;
    startHoldingTime = Time.time;
    touchNearPlayer = PointNearPlayer(point);
}

function TouchMovedAt (point:Vector2){
    if(touchNearPlayer && PointNearPlayer(point) && !player.explodeCooldown){
        if (Time.time - startHoldingTime >= player.holdTimeThreshold){
            holdingTouch = true;
            player.ProcessHold(startHoldingTime);
        }
    }else{
        touchNearPlayer = false;
        player.EndHold();
    }
}

function TouchEndedAt (point:Vector2){

    if (holdingTouch){
        player.EndHold();
        holdingTouch = false;
        return;
    }
    
    // Issue Move Command
    var ray : Ray = camera.ScreenPointToRay(Vector3(point.x,
        point.y,0));
    var hit : RaycastHit;

    var obstacleMask:int = 1 << 9;
    if (Physics.Raycast (ray, hit, 200, obstacleMask)){
        return;
    }
    
    var floorLayerMask:int = 1 << 10;
    if (Physics.Raycast (ray, hit, 200, floorLayerMask)){
        //Spawn Mark
        //Instantiate(moveTargetMark, hit.point, Quaternion.identity);  
        player.MoveTo(hit.point);
    }
    
}

private var nearPlayerTolerancePC:float = 100;
private var nearPlayerToleranceIOS:float = 200;
private var nearPlayerTolerance:float;

function PointNearPlayer (point:Vector2) :boolean{
    var center:Vector2 = Vector2(Screen.width/2, Screen.height/2);
    return Vector2.Distance(center,point) <= nearPlayerTolerance;
}
