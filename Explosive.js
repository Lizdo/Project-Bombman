#pragma strict

public class Explosive{
    enum ExplosiveType{
        Bomb = 0,
        Push = 1,
        Zap = 2
    }

    // -   Bomb (MP Spender): Big Range, Medium Charge, Big Damage, Small Bounce, cost MP
    // -   Push (Crowd Control): Big Bounce, No Damage, Enemy Freeze for a X seconds
    // -   Zap (MP Generator): Small Range, Fast Charge, Small Damage, generate MP
    
    static var BombRange:float = 4.0;
    static var BombDamage:float = 60.0;
    static var BombCooldown:float = 0.4;
    static var BombChargeTime:float = 1.2;
    static var BombPushback:boolean = true;
    static var BombCost:float = 20.0;
    
    static var PushRange:float = 4.0;
    static var PushDamage:float = 1.0;
    static var PushCooldown:float = 0.1;
    static var PushChargeTime:float = 0.8;     
    static var PushPushback:boolean = true;
    static var PushCost:float = 40.0;
    
    static var ZapRange:float = 2.0;
    static var ZapDamage:float = 2.0;
    static var ZapCooldown:float = 0.1;
    static var ZapChargeTime:float = 0.5;       
    static var ZapPushback:boolean = false;
    static var ZapCost:float = -10.0;
    
    static var _Range = [
        BombRange,
        PushRange,
        ZapRange
    ];
    
    static var _Damage = [
        BombDamage,
        PushDamage,
        ZapDamage
    ];
    
    static var _Cooldown = [
        BombCooldown,
        PushCooldown,
        ZapCooldown
    ];
    
    static var _ChargeTime = [
        BombChargeTime,
        PushChargeTime,
        ZapChargeTime
    ];
    
    static var _Pushback = [
        BombPushback,
        PushPushback,
        ZapPushback
    ];

    static var _Cost = [
        BombCost,
        PushCost,
        ZapCost
    ];             
    
    public static var type:ExplosiveType;
    
    public static function Range(){
        return _Range[type];
    }

    public static function Damage(){
        return _Damage[type];
    }
    
    public static function Cooldown(){
        return _Cooldown[type];
    }
    
    public static function ChargeTime(){
        return _ChargeTime[type];
    }
    
    public static function Pushback(){
        return _Pushback[type];
    }

    public static function Cost(){
        return _Cost[type];
    }       

}