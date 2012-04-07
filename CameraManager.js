private var player:Player;

private var height:float = 6.0;
private var heightDuringPause:float = 3.0;

private var rotation:float = 50.0;
private var rotationDuringPause:float = 30.0;


private var PivotCompensation:float = 0;//2.5;
private var fov:float = 50.0;

private var holdingTouch:boolean = false;

public function Height(){
    return height;
}


private var objectiveManager:ObjectiveManager;

function Start (){
    InitializeQualitySetting();
    //initialize the Player 
    player = FindObjectOfType(Player); 
    objectiveManager = FindObjectOfType(ObjectiveManager);
      
    camera.fieldOfView = fov;

    r = rotationDuringPause;
    h = heightDuringPause;

    //ZOffset = height * Mathf.Tan((90-rotation)*Mathf.Deg2Rad)-PivotCompensation;
    print("Camera Initialized.");
}

function Update () {
    UpdateCameraPosition();
}

function ScreenBound():float{
    return height * Mathf.Tan((90-rotation)*Mathf.Deg2Rad) + PivotCompensation;
}

private var targetR:float;
private var targetH:float;

private var r:float;
private var h:float;
private var lerpTime:float = 4;
private var startTime:float;

function UpdateCameraPosition(){
    if (player == null)
        return;

    if (!objectiveManager.IsGameplay()){
        targetR = rotationDuringPause;
        targetH = heightDuringPause;
    }else{
        targetR = rotation;
        targetH = height;
    }

    if (r == targetR){
        startTime = Time.time;
    }

    var percentage:float = (Time.time - startTime)/lerpTime;

    r = Mathf.Lerp(r,targetR,percentage);
    h = Mathf.Lerp(h,targetH,percentage);

    transform.rotation = Quaternion.Euler(r,0,0);   

    var MCPosition:Vector3 = player.Center();

    var a:float = 90-r;
    var x:float = h * Mathf.Tan(a*Mathf.Deg2Rad);
    var l:float = MCPosition.y * Mathf.Tan(a*Mathf.Deg2Rad);
    var ZOffset:float = x - l;

    transform.position = Vector3(MCPosition.x, h, MCPosition.z-ZOffset);


}

function InitializeQualitySetting(){
    if (Application.platform == RuntimePlatform.IPhonePlayer){
        switch (iPhone.generation){
            case iPhoneGeneration.iPad1Gen:
            case iPhoneGeneration.iPhone3GS:
                QualitySettings.antiAliasing = 0;
        }
    }
}