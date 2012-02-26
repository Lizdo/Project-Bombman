#pragma strict

public class Tweakable{

static var PlayerSpeed:float = 3.0;
static var PlayerHP:float = 1000.0;
static var PlayerRadius:float = 0.5;
static var PlayerAttackRadius:float = 0.5;
static var PlayerDPS:float = 10.0;
static var PlayerAttackType = AttackType.Melee;
static var PlayerAttackSpeed:float = 1.0;

static var TickerSpeed:float = 2.8;
static var TickerHP:float = 50.0;
static var TickerRadius:float = 0.3;
static var TickerAttackRadius:float = 1.2;
static var TickerDPS:float = 10.0;
static var TickerAttackType:AttackType = AttackType.Melee;
static var TickerAttackSpeed:float = 0.5;

static var BoomerSpeed:float = 1.5;
static var BoomerHP:float = 500.0;
static var BoomerRadius:float = 0.5;
static var BoomerAttackRadius:float = 3.0;
static var BoomerDPS:float = 100.0;
static var BoomerAttackType:AttackType = AttackType.Ranged;
static var BoomerAttackSpeed:float = 1.5;

static var SniperSpeed:float = 3.0;
static var SniperHP:float = 250.0;
static var SniperRadius:float = 2.0;
static var SniperAttackRadius:float = 5.0;
static var SniperDPS:float = 100.0;
static var SniperAttackType:AttackType = AttackType.Ranged;
static var SniperAttackSpeed:float = 4.0;

static var BeastSpeed:float = 2.0;
static var BeastHP:float = 500.0;
static var BeastRadius:float = 1.5;
static var BeastAttackRadius:float = 2.2;
static var BeastDPS:float = 100.0;
static var BeastAttackType:AttackType = AttackType.Melee;
static var BeastAttackSpeed:float = 3.0;

static var BrawlerSpeed:float = 3.0;
static var BrawlerHP:float = 400.0;
static var BrawlerRadius:float = 1.5;
static var BrawlerAttackRadius:float = 2.2;
static var BrawlerDPS:float = 60.0;
static var BrawlerAttackType:AttackType = AttackType.Melee;
static var BrawlerAttackSpeed:float = 2.0;

static var FootCompensation = 0.38;


// global flags
static var UsePathfinding:boolean = false;
static var UseDynamicSpawn:boolean = false;

enum PawnType{
    Player  = 0,
    Ticker  = 1,
    Boomer  = 2,
    Sniper  = 3,
    Beast   = 4,
    Brawler = 5,
    Other   = 100,
}

enum AttackType{
    Melee = 0,
    Ranged = 1,
}

static var _speed:float[] = [
    PlayerSpeed,
    TickerSpeed,
    BoomerSpeed,
    SniperSpeed,
    BeastSpeed,
    BrawlerSpeed
];

static var _hp:float[] = [
    PlayerHP,
    TickerHP,
    BoomerHP,
    SniperHP,
    BeastHP,
    BrawlerHP
];


static var _radius:float[] = [
    PlayerRadius,
    TickerRadius,
    BoomerRadius,
    SniperRadius,
    BeastRadius,
    BrawlerRadius
];

static var _attackRadius:float[] = [
    PlayerAttackRadius,
    TickerAttackRadius,
    BoomerAttackRadius,
    SniperAttackRadius,
    BeastAttackRadius,
    BrawlerAttackRadius
];

static var _dps:float[] = [
    PlayerDPS,
    TickerDPS,
    BoomerDPS,
    SniperDPS,
    BeastDPS,
    BrawlerDPS
];

static var _attackType:AttackType[] = [
    PlayerAttackType,
    TickerAttackType,
    BoomerAttackType,
    SniperAttackType,
    BeastAttackType,
    BrawlerAttackType
];

static var _attackSpeed:float[] = [
    PlayerAttackSpeed,
    TickerAttackSpeed,
    BoomerAttackSpeed,
    SniperAttackSpeed,
    BeastAttackSpeed,
    BrawlerAttackSpeed
];


static function SpeedForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;
    return _speed[type];
}

static function HPForType(type:PawnType){
if (type == PawnType.Other)
        return 0;    
    return _hp[type];
}

static function RadiusForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;    
    return _radius[type];
}

static function AttackRadiusForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;    
    return _attackRadius[type];
}

static function DPSForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;    
    return _dps[type];
}

static function AttackTypeForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;
    return _attackType[type];
}

static function AttackSpeedForType(type:PawnType){
    if (type == PawnType.Other)
        return 0;
    return _attackSpeed[type];
}

// Colors

static var FreezeColor:Color = Color(77/255.0,116/255.0,185/255.0);
static var DefaultColor:Color = Color(230/255.0,230/255.0,230/255.0);
static var BombColor:Color = Color(204/255.0,163/255.0,29/255.0);
static var PlayerDamageColor:Color = Color(204/255.0,69/255.0,29/255.0);
static var EnemyDamageColor:Color = DefaultColor;



}