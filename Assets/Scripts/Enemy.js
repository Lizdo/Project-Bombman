#pragma strict

import Tweakable;
import EnemyAbility;

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

    ParseAbilities();
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
    var distanceToTarget:float = Vector3.Distance(transform.position, target.Position());
    //print("Distance to Player:" + distanceToTarget.ToString());
    return distanceToTarget <= innerAttackRadius;
}

function OutsideAttackRadius():boolean{
    var distanceToTarget:float = Vector3.Distance(transform.position, target.Position());   
    return distanceToTarget > attackRadius;
}

function TargetTooClose():boolean{
    if (attackType == AttackType.Melee){
        return false;
    }

    if (target == this){
        return false;
    }

    var distanceToTarget:float = Vector3.Distance(transform.position, target.Position());       
    return distanceToTarget < minimumAttackRadius;
}

function MoveToInnerRadius(){
    goal = Goal.Move;
    var targetPosition:Vector3 = target.Position();
    var myPosition:Vector3 = transform.position;
    
    var offset:Vector3 = myPosition - targetPosition;

    //a little bit tolerance
    offset = offset.normalized * innerAttackRadius * 0.95; 
    
    //Rotate a little bit
    var intialAngle:float = Random.Range(-20,20);
    offset = Quaternion.AngleAxis(intialAngle, Vector3.up) * offset;    

    MoveTo(pawnManager.NearestAvailablePositon(targetPosition + offset, this));
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
    
    UpdateAbilities();

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

    if (goal == Goal.Cast){
        UpdateCast();
        SwitchAnimation(PawnAnimationState.Cast);        
    }

    if (goal == Goal.Move){
        SwitchAnimation(PawnAnimationState.Move);
    }

    if (goal == Goal.Wait){
        SwitchAnimation(PawnAnimationState.Idle);
    }

}

function UpdateGoals(){
    UpdateAbilityGoals();
    UpdateOtherGoals();
    // Change Goals 
    switch (goal){
        case Goal.Cast:
            break;
        case Goal.Wait:
            MoveToInnerRadius();
            break;
        case Goal.Attack:
            if (OutsideAttackRadius() || TargetTooClose()){
                MoveToInnerRadius();
            }
            break;
        case Goal.Move:
            if (InInnerAttackRadius() && !TargetTooClose()){
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


private var castTime:float = 0;

function UpdateCast(){
    castTime += Time.deltaTime;
    if (castTime >= castSpeed){
        ResolveAbility();
        castTime = 0;
    }
}

function CastTime(){
    return castSpeed;
}



private var BulletLineWidth:float = 0.1;

function DealDamage(){
    var damage:float = dps*attackTime;
    target.Damage(damage, this);

    var bulletLine:GameObject = Instantiate(line, Vector3.zero, Quaternion.identity);
    bulletLine.GetComponent(Line).SetPoints(Center(), target.Center());
    bulletLine.GetComponent(Line).SetColor(borderColor);
    bulletLine.GetComponent(Line).SetWidth(BulletLineWidth);

    var v:Vector3 = Camera.main.WorldToViewportPoint(target.Center());
    if (damage >= 0){
        ui.PopupDamageToPlayer(damage, v.x, v.y);
    }else{
        ui.PopupHealToEnemy(-damage, v.x, v.y);
    }
    
}

private var blowBackTime:float = 0.15;
private var blowBackSpeed:float = 8;
private var blowBackOrigin:Vector3;


function BlowBack(origin:Vector3, blowBackType:int){
    blowBackOrigin = origin;
    blowBack = true;

    if (goal == Goal.Cast){
        goal = Goal.Wait;
    }
    
    //var typeIndex:int = Enum.GetValues(typeof(BlowBackType))[blowBackType];
    
    blowBackTime = blowBackType*0.3+0.05;
    blowBackSpeed = blowBackType*3+1;
    yield WaitForSeconds(blowBackTime);
    blowBack = false;
}

///////////////////////////////
//  Enemy Ability
///////////////////////////////



public var abilityString:String;
private var abilities = new Array();

function ParseAbilities(){
    var abilityTexts:String[] = abilityString.Split("|"[0]);
    for (var s:String in abilityTexts){
        var ability:EnemyAbility = EnemyAbility.EnemyAbilityFromString(s);
        if (ability != null){
            abilities.Add(ability);    
        }
    }
}

function UpdateAbilities(){
    for (var ability:EnemyAbility in abilities){
        UpdateAbility(ability);
    }
}


function UpdateAbility(ability:EnemyAbility){
    ability.Update();    
}


function UpdateAbilityGoals(){
    for (var ability:EnemyAbility in abilities){
        if (AbilityReady(ability)){
            UseAbility(ability);
        }
    }    
}

private var currentAbility:EnemyAbility;
private var castSpeed:float = 2.0;

function UseAbility(ability:EnemyAbility){
    print(this.ToString() + " Using Ability: " + ability.type);
    ability.Use();
    currentAbility = ability;
    goal = Goal.Cast;
    MoveTo(Vector3.zero);
}

function AbilityReady(ability:EnemyAbility):boolean{
    if (!ability.Ready()){
        return false;
    }

    if (goal == Goal.Cast){
        return false;
    }

    switch (ability.type){
        case EnemyAbilityType.Heal:
            if (HP()== maxHP)
                return false;
    }

    return true;
}


function ResolveAbility(){
    goal = Goal.Wait;

    switch (currentAbility.type){
        case EnemyAbilityType.Heal:
            Heal(currentAbility.power);
            break;
        case EnemyAbilityType.Teleport:
            Teleport(currentAbility.power);
    }

}


function Teleport(distance:float){
    //TODO: Spawn an Particle
    var offset:Vector3 = Vector3(distance, 0, 0);
    var intialAngle:float = Random.value*360;
    offset = Quaternion.AngleAxis(intialAngle, Vector3.up) * offset;

    transform.position += offset;  
}


}