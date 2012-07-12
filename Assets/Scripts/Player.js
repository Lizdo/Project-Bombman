#pragma strict

import Explosive;
import Feat;
import Ability;

public class Player extends Pawn{

private var highlight:SpellHighlight;
private var _MP:float;
public var maxMP:float = 100.0;
private var baseHPIncreaseRate:float = 1; //per second
private var baseMPIncreaseRate:float = 0.5; //per second


function Start() {
    super.Start();
            
    var ring = Instantiate(Resources.Load("Ring", GameObject), Vector3.zero, Quaternion.identity);

    transform.position = SnapToGround(transform.position);
    transform.rotation = Quaternion.Euler(0, 30, 0);

    highlight = ring.GetComponent(SpellHighlight);
    highlight.transform.position = transform.position;
    highlight.transform.parent = transform;
    
    Explosive.type = ExplosiveType.Bomb;
    _MP = maxMP;
    
    print("Player Intialized");

    goal = Goal.Wait;
}


function Update () {
    super.Update();
    UpdateHPMP();
    UpdateAnimation();
    UpdateAbility();
}

function MP(){
    return _MP;
}

private var veryHighSpeed:float = 40;

function Speed(){
    if (Feat.type == FeatType.Haste){
        return speed * (1 + Feat.Power());
    }

    if (HasEffect(Effect.Teleport)){
        return veryHighSpeed;
    }


    return speed;
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

private var holdTimeThreshold:float = 0.1;

function UpdateHPMP(){
    _MP += baseMPIncreaseRate * Time.deltaTime;
    _MP = Mathf.Clamp(_MP,0,maxMP);

    _HP += baseHPIncreaseRate * Time.deltaTime;
    _HP = Mathf.Clamp(_HP,0,maxHP);    
}

private var holdPercentage:float = 0;

function HoldTimeThreshold():float{
    return holdTimeThreshold;
}

function ProcessHold (startTime:float){
    if (explodeCooldown){
        holdPercentage = 0;
        return;
    }

    var currentTime = Time.time - startTime;
    if (currentTime > holdTimeThreshold){
        // Show Highlight
        holdPercentage = Mathf.Clamp01((currentTime - holdTimeThreshold)/Explosive.ChargeTime());
        StopMoving();
        goal = Goal.Attack;
    }else{
        // Hide Highlight
        holdPercentage = 0;
    }
}

function AttackTime(){
    return Explosive.ChargeTime() - holdTimeThreshold;
}

public function HoldPercentage():float{
    return holdPercentage;
}

function EndHold (){
    if (holdPercentage == 1){
        Explode();
    }
    holdPercentage = 0;
    goal = Goal.Wait;
}


private var explodeCooldown:boolean;

public function ExplodeCooldown():boolean{
    return explodeCooldown;
}

function Explode(){

    goal = Goal.Wait;

    //Update Mana Cost
    if (_MP < Explosive.Cost()){
        return;
    }

    _MP -= Explosive.Cost();
    _MP = Mathf.Clamp(_MP, 0, maxMP);

    var v:Vector3;

    // Display Mana Gain UI
    if (Explosive.Cost() < 0){
        v = Camera.main.WorldToViewportPoint(Center());
        ui.PopupMana(-Explosive.Cost(), v.x, v.y);    
    }
    

    explodeCooldown = true;
    
    var damageDealt:float = 0;

    var enemies:Enemy[] = FindObjectsOfType(Enemy);
    for (var e:Enemy in enemies){
        if (Vector3.Distance(e.Position(), transform.position) <= Explosive.Range()){
            if (Explosive.Pushback()){
                //TODO: Tweak Pushback Logic, need to push back even with small imPush
                e.BlowBack(transform.position, BlowBackType.Large);
            }else{
                e.BlowBack(transform.position, BlowBackType.Tiny);
            }
            e.Damage(Explosive.Damage(), this);
            damageDealt += Explosive.Damage();
            v = Camera.main.WorldToViewportPoint(e.Center());
            ui.PopupDamageToEnemy(Explosive.Damage(), v.x, v.y);

            if (Explosive.type == ExplosiveType.Bomb
                && Feat.type == FeatType.Flame){
                e.AddEffect(Effect.EffectWithName(Effect.Flame));
            }

            if (Explosive.type == ExplosiveType.Zap
                && Feat.type == FeatType.Poison){
                e.AddEffect(Effect.EffectWithName(Effect.Poison));
            }

        }
    }

    if (Feat.type == FeatType.Vampiric){
        Heal(Feat.Power() * damageDealt);
    }


    if (Feat.type == FeatType.Vampiric){
        RefillMP(Feat.Power() * damageDealt);
    }

    var destructibles:Destructible[] = FindObjectsOfType(Destructible) as Destructible[];
    for (var d:Destructible in destructibles){
        if (Vector3.Distance(d.Position(), transform.position) <= Explosive.Range()){
            d.Damage(Explosive.Damage(), this);
            v = Camera.main.WorldToViewportPoint(d.Center());
            ui.PopupDamageToEnemy(Explosive.Damage(), v.x, v.y);
        }
    }    
    
    yield WaitForSeconds(Explosive.Cooldown());
    explodeCooldown = false;
}


// TODO: Cache FX

function UseAbility(){
    if (!AbilityAvailable())
        return;

    var obj:GameObject = Resources.Load("FX"+Ability.Name(), GameObject);
    if (obj != null){
        var positionInFront:Vector3 = Center() + Vector3(0,0.5,-0.5);
        var fx:ParticleSystem = Instantiate(obj, positionInFront, Quaternion.identity).GetComponent(ParticleSystem);
        fx.Play();
    }


    print("Using Ability:" + Ability.Name());
    ui.PopupUseAbility();

    _MP -= Ability.Cost();
    Ability.inUse = true;
    
    if (Ability.type == AbilityType.Freeze){
        for (var p:Pawn in pawnManager.pawns){
            if (p != this){
                p.AddEffect(Effect.EffectWithName(Ability.Name()));
            }
        }
    }

    if (Ability.type == AbilityType.Heal){
        Heal(Ability.Power());
    }

    if (Ability.type == AbilityType.Trample){
        var enemies:Enemy[] = FindObjectsOfType(Enemy);
        for (var e:Enemy in enemies){
            if (Vector3.Distance(e.Position(), transform.position) <= Ability.Power()){
                e.BlowBack(transform.position, BlowBackType.Huge);
            }
        }
    }


    if (Ability.type == AbilityType.Shield){
        AddEffect(Effect.EffectWithName(Ability.Name()));
    }    

    if (Ability.type == AbilityType.Teleport){
        AddEffect(Effect.EffectWithName(Ability.Name()));
    }

    yield WaitForSeconds(Ability.Duration());
    Ability.inUse = false;
    
}


function ExplosiveAvailable():boolean{
    return _MP >= Explosive.Cost();
}

function UpdateAbility(){

}

function AbilityAvailable():boolean{
    if (_MP < Ability.Cost()){
        return false;
    }
    return true;
}

private var popupThreshold:float = 5.0;

function RefillMP(amount:float){
    // TODO: Add feedback;
    
    _MP += amount;
    if (_MP >= maxMP){
        amount -= (_MP - maxMP);
        _MP = maxMP;
    }

    if (amount >= popupThreshold){
        var v:Vector3 = Camera.main.WorldToViewportPoint(Center());
        ui.PopupMana(amount, v.x, v.y);
    }    
}

function LowHP(){
    return _HP/maxHP <= 0.2;
}

function ResetHPMP(){
    _MP = maxMP;
    _HP = maxHP;
}

function Damage(damage:float, source:Pawn){
    if (Feat.type == FeatType.Numb){
        if (damage <= Feat.Power())
            return;
    }

    if (Feat.type == FeatType.Evade){
        var evade:float = Random.value;
        if (evade <= Feat.Power()){
            return;
        }
    }

    if (HasEffect(Effect.Shield)){
        damage *= (1 - Ability.Power());
    }

    if (Ability.type == AbilityType.Deflection){
        source.Damage(damage * Ability.Power(), this);
    }

    super.Damage(damage, source);
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

private var deathCheated:boolean = false;

function Die(){
    if (Feat.type == FeatType.Resurrect && !deathCheated){
        deathCheated = true;
        ResetHPMP();
        return;
    }

    FindObjectOfType(ObjectiveManager).MissionFail();
    Instantiate(deathParticle, transform.position, Quaternion.identity);
    gameObject.active = false;
}

}