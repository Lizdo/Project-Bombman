#pragma strict

import Explosive;
import Ability;
import Enemy;
import Pathfinding;

public class Player extends Pawn{

public var highlight:SpellHighlight;
public var MP:float;
public var maxMP:float = 100.0;
private var increaseRate:float = 2.0; //per second


function Start() {
    super.Start();
            
    var ring:GameObject = Instantiate(Resources.Load("Ring"), Vector3.zero, Quaternion.identity);

    highlight = ring.GetComponent(SpellHighlight);
    highlight.transform.position = transform.position;
    highlight.transform.parent = transform;
    
    Explosive.type = ExplosiveType.Bomb;
    MP = maxMP;
    
    print("Player Intialized");

    goal = Goal.Wait;
}


function Update () {
    super.Update();
    UpdateMP();
    UpdateAnimation();
}

function UpdateAnimation(){
    if (goal == Goal.Attack){
        SwitchAnimation(PawnAnimationState.Attack);
        return;
    }

    if (goal == Goal.Move){
        SwitchAnimation(PawnAnimationState.Move);
        return;
    }

    SwitchAnimation(PawnAnimationState.Idle);

}

public var holdTimeThreshold:float = 0.1;

function UpdateMP(){
    MP += increaseRate * Time.deltaTime;
    MP = Mathf.Clamp(MP,0,maxMP);
}

function ProcessHold (startTime:float){
    if (explodeCooldown){
        highlight.SetPercentage(0);
        return;
    }

    var currentTime = Time.time - startTime;
    if (currentTime > holdTimeThreshold){
        // Show Highlight
        var percentage:float = Mathf.Clamp01((currentTime - holdTimeThreshold)/Explosive.ChargeTime());
        highlight.SetPercentage(percentage);
        StopMoving();
        if (percentage == 1){
            Explode();
        }
        goal = Goal.Attack;
    }else{
        // Hide Highlight
        highlight.SetPercentage(0);
    }
}

function AttackTime(){
    return Explosive.ChargeTime() - holdTimeThreshold;
}

function EndHold (){
    highlight.SetPercentage(0);
    goal = Goal.Wait;
}


public var explodeCooldown:boolean;

function Explode(){

    goal = Goal.Wait;

    //Update Mana Cost
    if (MP < Explosive.Cost()){
        return;
    }

    MP -= Explosive.Cost();
    MP = Mathf.Clamp(MP, 0, maxMP);

    var v:Vector3;

    // Display Mana Gain UI
    if (Explosive.Cost() < 0){
        v = Camera.main.WorldToViewportPoint(Center());
        FindObjectOfType(UI).SpawnFloatingText(-Explosive.Cost(), v.x-0.05, v.y, Tweakable.LowManaColor);    
    }
    

    explodeCooldown = true;
    

    var enemies:Enemy[] = FindObjectsOfType(Enemy);
    for (var e:Enemy in enemies){
        if (Vector3.Distance(e.Position(), transform.position) <= Explosive.Range()){
            if (Explosive.Pushback()){
                //TODO: Tweak Pushback Logic, need to push back even with small imPush
                e.BlowBack(transform.position, BlowBackType.Large);
            }else{
                e.BlowBack(transform.position, BlowBackType.Tiny);
            }
            e.Damage(Explosive.Damage());
            v = Camera.main.WorldToViewportPoint(e.Center());
            FindObjectOfType(UI).SpawnFloatingText(Explosive.Damage(), v.x, v.y, Tweakable.EnemyDamageColor);
        }
    }

    var destructibles:Destructible[] = FindObjectsOfType(Destructible) as Destructible[];
    for (var d:Destructible in destructibles){
        if (Vector3.Distance(d.Position(), transform.position) <= Explosive.Range()){
            d.Damage(Explosive.Damage());
            v = Camera.main.WorldToViewportPoint(d.Center());
            FindObjectOfType(UI).SpawnFloatingText(Explosive.Damage(), v.x, v.y, Tweakable.EnemyDamageColor);
        }
    }    
    
    yield WaitForSeconds(Explosive.Cooldown());
    explodeCooldown = false;
}

function UseAbility(a:Ability){
    if (MP < a.cost){
        // TODO: Add a MP not enough Hint, or Block UI to make it impossible
        print("Not Enough MP");
        return;
    }
    
    print("Using Ability:" + a.name);
    
    MP -= a.cost;
    
    for (var p:Pawn in pawnManager.pawns){
        if (p != this){
            p.AddEffect(Effect.EffectWithName(a.name));
        }
    }
    
}

function RefillMP(amount:float){
    // TODO: Add feedback;
    MP += amount;
    if (MP >= maxMP){
        MP = maxMP;
    }
}

function ResetHPMP(){
    MP = maxMP;
    HP = maxHP;
}

function MoveTo(p:Vector3){
    super.MoveTo(p);
    goal = Goal.Move;
}

function StopMoving(){
    MoveTo(Vector3.zero);
    goal = Goal.Wait;
}

function MovementComplete(){
    goal = Goal.Wait;
}

function Die(){
    FindObjectOfType(ObjectiveManager).MissionFail();
    Instantiate(deathParticle, transform.position, Quaternion.identity);
    gameObject.active = false;
}

}