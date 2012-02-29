#pragma strict

private var player:Player;
public var pawns:Array;

function Start () {
    player = FindObjectOfType(Player);
    pawns = FindObjectsOfType(Pawn);
}

function Spawn(type:PawnType){
    var template:GameObject;
    switch(type){
        case PawnType.Ticker:
            template = Resources.Load("Ticker");
            break;
        case PawnType.Boomer:
            template = Resources.Load("Boomer");
            break;
        case PawnType.Beast:
            template = Resources.Load("Beast");
            break;
        case PawnType.Brawler:
            template = Resources.Load("Brawler");
            break;
        case PawnType.Sniper:
            template = Resources.Load("Sniper");
            break;
        case PawnType.Other:
            template = Resources.Load("Blinker");
            break;    
    }

    if (template == null){
        print("Spawn Failed!");
        return;
    }

    var enemy:GameObject = Instantiate(template, RandomOffScreenPosition(), Quaternion.identity);
    pawns.Add(enemy.GetComponent(Pawn));
}

function AllPawnDead(){
    var allDead:boolean = true;
    for (var e:Pawn in pawns){
        if (e == player){
            continue;
        }

        if (e != null && !e.IsDead()){
            allDead = false;
            break;
        }
    }
    return allDead;
}

function Boss(){
    for (var e:Pawn in pawns){
        if (e.type == PawnType.Other){
            return e;
        }
    }
    return null;
}

function RandomOffScreenPosition(){
    var screenbound:float = FindObjectOfType(CameraManager).ScreenBound();
    var cameraHeight:float = FindObjectOfType(CameraManager).Height();
    var randomOffset:Vector3 = Quaternion.AngleAxis(Random.value*360, Vector3.up) * Vector3(screenbound,0,0);
    var verticalHeight:Vector3 = Vector3(0,cameraHeight,0);
    return player.Position() + randomOffset + verticalHeight;
}

static var PositionCount:int = 8;

function NearestAvailablePositon(position:Vector3, pawn:Pawn):Vector3{
    if (IsPositionAvailable(position, pawn)){
        // print("Position is available!");
        // print(position);
        return position;
    }
    
    // Random Position Near the target Position, check if available
    var positions:Vector3[] = ClosestRandomPositions(position, pawn);
    for (var i:int = 0; i < PositionCount; i++){
        var p:Vector3 = positions[i];
        if (IsPositionAvailable(p, pawn)){
            // print("Found Position!");
            // print(p);
            return p;
        }
    }
    return Vector3.zero;
}

private function IsPositionAvailable(position:Vector3, pawn:Pawn):boolean{
    for (var p:Pawn in pawns){
        if (p == null || p.IsDead() || p == pawn)
            continue;
        if (Vector3.Distance(p.Position(), position) <= (p.Radius() + pawn.Radius()) * 0.8){
            return false;
        }
    }
    return true;
}

private function ClosestRandomPositions(position:Vector3, pawn:Pawn){
    var positions = new Vector3[PositionCount];
    var offset:Vector3 = Vector3(pawn.Radius(), 0, 0);
    var intialAngle:float = Random.value*360;
    offset = Quaternion.AngleAxis(intialAngle, Vector3.up) * offset;
    for (var i:int = 0; i < PositionCount; i++){
        positions[i] = position + offset;
        offset = Quaternion.AngleAxis(360/PositionCount, Vector3.up) * offset;
    }
    return positions;
}
