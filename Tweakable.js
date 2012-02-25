public class Tweakable{

static var PlayerSpeed = 3.0;
static var PlayerHP = 1000.0;
static var PlayerRadius = 0.5;
static var PlayerAttackRadius = 0.5;
static var PlayerDPS = 10.0;
static var PlayerAttackType = AttackType.Melee;
static var PlayerAttackSpeed = 1.0;

static var TickerSpeed = 2.8;
static var TickerHP = 50.0;
static var TickerRadius = 0.3;
static var TickerAttackRadius = 1.2;
static var TickerDPS = 10.0;
static var TickerAttackType = AttackType.Melee;
static var TickerAttackSpeed = 0.5;

static var BoomerSpeed = 1.5;
static var BoomerHP = 500.0;
static var BoomerRadius = 0.5;
static var BoomerAttackRadius = 3.0;
static var BoomerDPS = 100.0;
static var BoomerAttackType = AttackType.Ranged;
static var BoomerAttackSpeed = 1.5;

static var GunnerSpeed = 3.0;
static var GunnerHP = 250.0;
static var GunnerRadius = 2.0;
static var GunnerAttackRadius = 5.0;
static var GunnerDPS = 5.0;
static var GunnerAttackType = AttackType.Melee;
static var GunnerAttackSpeed = 2.0;

static var BeastSpeed = 2.0;
static var BeastHP = 500.0;
static var BeastRadius = 1.5;
static var BeastAttackRadius = 2.2;
static var BeastDPS = 100.0;
static var BeastAttackType = AttackType.Melee;
static var BeastAttackSpeed = 3.0;

static var BrawlerSpeed = 3.0;
static var BrawlerHP = 100.0;
static var BrawlerRadius = 1.5;
static var BrawlerAttackRadius = 2.2;
static var BrawlerDPS = 30.0;
static var BrawlerAttackType = AttackType.Melee;
static var BrawlerAttackSpeed = 1.5;

static var FootCompensation = 0.38;


// global flags
static var UsePathfinding:boolean = false;
static var UseDynamicSpawn:boolean = false;

enum PawnType{
    Player  = 0,
    Ticker  = 1,
    Boomer  = 2,
    Gunner  = 3,
    Beast   = 4,
    Brawler = 5,
}

enum AttackType{
    Melee = 0,
    Ranged = 1,
}

static var _speed = [
    PlayerSpeed,
    TickerSpeed,
    BoomerSpeed,
    GunnerSpeed,
    BeastSpeed,
    BrawlerSpeed
];

static var _hp = [
    PlayerHP,
    TickerHP,
    BoomerHP,
    GunnerHP,
    BeastHP,
    BrawlerHP
];


static var _radius = [
    PlayerRadius,
    TickerRadius,
    BoomerRadius,
    GunnerRadius,
    BeastRadius,
    BrawlerRadius
];

static var _attackRadius = [
    PlayerAttackRadius,
    TickerAttackRadius,
    BoomerAttackRadius,
    GunnerAttackRadius,
    BeastAttackRadius,
    BrawlerAttackRadius
];

static var _dps = [
    PlayerDPS,
    TickerDPS,
    BoomerDPS,
    GunnerDPS,
    BeastDPS,
    BrawlerDPS
];

static var _attackType = [
    PlayerAttackType,
    TickerAttackType,
    BoomerAttackType,
    GunnerAttackType,
    BeastAttackType,
    BrawlerAttackType
];

static var _attackSpeed = [
    PlayerAttackSpeed,
    TickerAttackSpeed,
    BoomerAttackSpeed,
    GunnerAttackSpeed,
    BeastAttackSpeed,
    BrawlerAttackSpeed
];


static function SpeedForType(type:PawnType){
    return _speed[type];
}

static function HPForType(type:PawnType){
    return _hp[type];
}

static function RadiusForType(type:PawnType){
    return _radius[type];
}

static function AttackRadiusForType(type:PawnType){
    return _attackRadius[type];
}

static function DPSForType(type:PawnType){
    return _dps[type];
}

static function AttackTypeForType(type:PawnType){
    return _attackType[type];
}

static function AttackSpeedForType(type:PawnType){
    return _attackSpeed[type];
}

// Colors

static var FreezeColor:Color = Color(77/255.0,116/255.0,185/255.0);
static var DefaultColor:Color = Color(230/255.0,230/255.0,230/255.0);
static var BombColor:Color = Color(204/255.0,163/255.0,29/255.0);
static var PlayerDamageColor:Color = Color(204/255.0,69/255.0,29/255.0);
static var EnemyDamageColor:Color = DefaultColor;



}