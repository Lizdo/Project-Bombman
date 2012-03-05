#pragma strict

import Tweakable;

public class Enemy extends Pawn{

private var blowBack:boolean = false;

private var innerAttackRadius:float;
private var minimumAttackRadius:float;

//public var phase:int = 0;

private var line:GameObject;
protected var attackRadiusRing:AttackRadiusRing;

function Start () {
    super.Start();
    
    goal = Goal.Move;

    tickTime = Random.value*tickInterval;
    line = Resources.Load("LineMesh");

    InitAttackRadius();

    var ring:GameObject = Instantiate(Resources.Load("AttackRadiusRing"), Vector3.zero, Quaternion.identity);
    ring.transform.position = transform.position;
    ring.transform.parent = transform;            
    attackRadiusRing = ring.GetComponent(AttackRadiusRing);
    attackRadiusRing.SetRadius(attackRadius);
    attackRadiusRing.SetColor(borderColor);   
}

function InitAttackRadius(){
    if (attackType == AttackType.Ranged){
        innerAttackRadius = attackRadius*0.8;
        minimumAttackRadius = attackRadius*0.5;
    }else if(attackType == AttackType.Melee){
        innerAttackRadius = attackRadius*0.9;
    }    
}

// Helper Functions

function InInnerAttackRadius():boolean{
    var distanceToPlayer:float = Vector3.Distance(transform.position, player.Position());
    //print("Distance to Player:" + distanceToPlayer.ToString());
    return distanceToPlayer <= innerAttackRadius;
}

function OutsideAttackRadius():boolean{
    var distanceToPlayer:float = Vector3.Distance(transform.position, player.Position());   
    return distanceToPlayer > attackRadius;
}

function PlayerTooClose():boolean{
    if (attackType == AttackType.Melee){
        return false;
    }
    var distanceToPlayer:float = Vector3.Distance(transform.position, player.Position());       
    return distanceToPlayer < minimumAttackRadius;
}

function MoveToInnerRadius(){
    goal = Goal.Move;
    var playerPosition:Vector3 = player.Position();
    var myPosition:Vector3 = transform.position;
    
    var offset:Vector3 = myPosition - playerPosition;

    //a little bit tolerance
    offset = offset.normalized * innerAttackRadius * 0.95; 
    
    //Rotate a little bit
    var intialAngle:float = Random.Range(-20,20);
    offset = Quaternion.AngleAxis(intialAngle, Vector3.up) * offset;    

    MoveTo(pawnManager.NearestAvailablePositon(playerPosition + offset, this));
}

function Attack(){
    if (goal == Goal.Attack){
        return;
    }
    goal = Goal.Attack;
    attackTime = 0;
}

// Melee AI:
//      1. Move into InnerAttackRadius
//      2. Attack
//          If Outside AttackRadius, back to 1

// Ranged AI:
//      1. Move into InnerAttackRadius
//      2. Attack
//          If Outside AttackRadius, back to 1
//          If Player too close, back to 1

protected var tickInterval:float = 0.2;
private var tickTime:float;

function Update () {
    // if (phase != objectiveManager.Phase()){
    //  return;
    // }

    // No longer controlled by AI
    if (blowBack){
        //TODO: What if AI hit wall
        transform.position = Vector3.MoveTowards(transform.position,
                blowBackOrigin,
                -Time.deltaTime * blowBackSpeed);
        return;
    }

    super.Update(); 

    if (HasEffect(Effect.Freeze)) {
        return;
    }


    tickTime += Time.deltaTime;
    if (tickTime >= tickInterval){
        tickTime = 0;
        UpdateGoals();
    }
    
    // Execute Goals
    if (goal == Goal.Attack){
        UpdateAttack();
        SwitchAnimation(PawnAnimationState.Attack);
        if (attackType == AttackType.Ranged && attackRadiusRing){
            attackRadiusRing.Show();    
        }
    }else{
        if (attackType == AttackType.Ranged && attackRadiusRing){
            attackRadiusRing.Hide();
        }
    }

    if (goal == Goal.Move){
        SwitchAnimation(PawnAnimationState.Move);
    }

    if (goal == Goal.Wait){
        SwitchAnimation(PawnAnimationState.Idle);
    }

}

function UpdateGoals(){
    UpdateOtherGoals();
    // Change Goals 
    switch (goal){
        case Goal.Wait:
            MoveToInnerRadius();
            break;
        case Goal.Attack:
            if (OutsideAttackRadius() || PlayerTooClose()){
                MoveToInnerRadius();
            }
            break;
        case Goal.Move:
            if (InInnerAttackRadius() && !PlayerTooClose()){
                Attack();
            }else{
                MoveToInnerRadius();
            }
            break;
        default:
            break;
    }
}


// Override by subclass
function UpdateOtherGoals(){

}


// TODO: Expose this to Enemy Archetypes
private var attackTime:float = 0;

function UpdateAttack(){
    attackTime += Time.deltaTime;
    if (attackTime >= attackSpeed){
        DealDamage();
        attackTime = 0;
    }
}

function AttackTime(){
    return attackSpeed;
}


private var BulletLineWidth:float = 0.1;

function DealDamage(){
    player.Damage(dps*attackTime);

    var bulletLine:GameObject = Instantiate(line, Vector3.zero, Quaternion.identity);
    bulletLine.GetComponent(Line).SetPoints(Center(), player.Center());
    bulletLine.GetComponent(Line).SetColor(borderColor);
    bulletLine.GetComponent(Line).SetWidth(BulletLineWidth);

    var v:Vector3 = Camera.main.WorldToViewportPoint(player.Center());
    FindObjectOfType(UI).SpawnFloatingText(dps*attackTime, v.x, v.y, Tweakable.PlayerDamageColor);      
}

private var blowBackTime:float = 0.15;
private var blowBackSpeed:float = 8;
private var blowBackOrigin:Vector3;


function BlowBack(origin:Vector3, blowBackType:int){
    blowBackOrigin = origin;
    blowBack = true;
    
    //var typeIndex:int = Enum.GetValues(typeof(BlowBackType))[blowBackType];
    
    blowBackTime = blowBackType*0.1+0.05;
    blowBackSpeed = blowBackType*3+1;
    yield WaitForSeconds(blowBackTime);
    blowBack = false;
}


//function DistanceToNearestEnemy():float{
//  var distance:float = 1000;
//  for (var e:Enemy in enemies){
//      if (e != null && e != this && e != player && e.goal != Goal.Wait){
//          var newDistance:float = Vector2.Dista   nce(e.Position(), transform.position);
//          distance = Mathf.Min(distance, newDistance);
//          print(distance);
//      }
//  }
//  return distance;
//}

}