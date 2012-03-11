#pragma strict

private var player:Player;
public var pawns:Array;

function Start () {
    player = FindObjectOfType(Player);
    pawns = FindObjectsOfType(Pawn);
}

function Spawn(type:PawnType){
    Spawn(type, RandomOffScreenPosition());
}

function Spawn(type:PawnType, position:Vector3, offset:float, burrow:boolean){
    var p:Vector3 = RandomPositionWithOffset(position, offset, burrow);
    Spawn(type, p);
}


function Spawn(type:PawnType, position:Vector3){
    var template:GameObject = Resources.Load("Pawn" + type.ToString());

    if (template == null){
        print("Spawn Failed!");
        return;
    }

    var enemy:GameObject = Instantiate(template, position, Quaternion.identity);
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

function Pawns():Array{
    var array:Array = new Array();
    for (var p:Pawn in pawns){
        if (p != null && !p.IsDead()){
            array.Add(p);
        }
    }
    return array;
}

function Boss(){
    for (var e:Pawn in pawns){
        if (e != null && e.type == PawnType.Blinker){
            return e;
        }
    }
    return null;
}

function RandomOffScreenPosition():Vector3{
    var screenbound:float = FindObjectOfType(CameraManager).ScreenBound();
    return RandomPositionWithOffset(player.Position(), screenbound, false);    
}

static var PositionCount:int = 8;

function RandomPositionWithOffset(position:Vector3, offset:float, burrow:boolean):Vector3{
    var zOffset:float;
    if (burrow){
        zOffset = -2;
    }else{
        zOffset = FindObjectOfType(CameraManager).Height();
    }

    var randomOffset:Vector3 = Quaternion.AngleAxis(Random.value*360, Vector3.up) * Vector3(offset,0,0);
    var verticalHeight:Vector3 = Vector3(0,zOffset,0);
    return position + randomOffset + verticalHeight;
}

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
