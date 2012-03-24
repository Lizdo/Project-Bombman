#pragma strict

public class Healer extends Enemy{

function Update(){
	super.Update();
	UpdateTarget();
}


function UpdateTarget(){
	if (target != player && target.HP() < target.maxHP){
		return;
	}

	for (var p:Pawn in pawnManager.Pawns()){
		if (p == player)
			continue;

		if (p.HP() < p.maxHP){
			target = p;
			return;
		}
	}

	// No Target Found, follow a random guy
	for (var p:Pawn in pawnManager.Pawns()){
		if (p == player || p == this)
			continue;
		target = p;
		return;
	}
}

}

