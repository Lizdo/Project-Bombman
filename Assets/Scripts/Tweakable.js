#pragma strict

public class Tweakable{

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
    Exploder = 11,
    Healer = 12,    
    Blinker = 100,
}

enum AttackType{
    Melee = 0,
    Ranged = 1,
}

// Colors

static var FreezeColor:Color = Color(77/255.0,116/255.0,185/255.0);
static var DefaultColor:Color = Color(230/255.0,230/255.0,230/255.0);
static var DefaultSecondaryColor:Color = Color(100/255.0,100/255.0,100/255.0);

static var WeaponColor:Color = Color(204/255.0,163/255.0,29/255.0);
static var PlayerDamageColor:Color = Color(204/255.0,69/255.0,29/255.0);
static var EnemyDamageColor:Color = DefaultColor;
static var LowHealthColor:Color = Color(252/255.0,75/255.0,75/255.0);
static var LowManaColor:Color = Color(75/255.0,125/255.0,252/255.0);

static var HealthColor:Color = Color(120/255.0,170/255.0,101/255.0);
static var ManaColor:Color = Color(109/255.0,169/255.0,209/255.0);

static var BombColor:Color = Color(184.0/255, 150.0/255, 0/255, 0.6);
static var ZapColor:Color = Color(255.0/255, 187.0/255, 98.0/255.0, 0.6);
static var PushColor:Color = Color(0.0/255, 88.0/255.0, 237.0/255.0, 0.6);
// Raycast Layers
static var kObstacleMask:int = 1 << 9;
static var kFloorMask:int = 1 << 10;
static var kEnemyMask:int = 1 << 11;
static var kPickupMask:int = 1 << 12;

static var WarningColor:Color = Color(209/255.0,109/255.0,109/255.0);
static var FunctionColor:Color = Color(109/255.0,169/255.0,209/255.0);

static var DefaultTextColor:Color = Color(245/255.0,244/255.0,240/255.0);

}