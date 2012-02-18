private var player:Player;
public var pawns:Pawn[];

function Start () {
	pawns = FindObjectsOfType(Pawn);
}


function Update () {
	
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
