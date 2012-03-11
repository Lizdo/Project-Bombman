#pragma strict

public class Exploder extends Enemy{

function Die(){
	SpawnMinion();
	super.Die();
}

private var spawnOffset:float = 2.0;

function SpawnMinion(){
	if (HasEffect(Effect.Freeze))
		return;

	print("Spawning");

	// Spawn 3 ticker
	pawnManager.Spawn(PawnType.Ticker, Position(), spawnOffset, true);
	pawnManager.Spawn(PawnType.Ticker, Position(), spawnOffset, true);
	pawnManager.Spawn(PawnType.Ticker, Position(), spawnOffset, true);
}


}