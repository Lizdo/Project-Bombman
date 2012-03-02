#pragma strict

public class Explosive{
    enum ExplosiveType{
        Bomb = 0,
        Pulse = 1,
        Zap = 2
    }

    // -   Bomb (MP Spender): Big Range, Medium Charge, Big Damage, Small Bounce, cost MP
    // -   Pulse (Crowd Control): Big Bounce, No Damage, Enemy Freeze for a X seconds
    // -   Zap (MP Generator): Small Range, Fast Charge, Small Damage, generate MP
    
    static var BombRange:float = 4.0;
    static var BombDamage:float = 60.0;
    static var BombCooldown:float = 0.4;
    static var BombChargeTime:float = 1.2;
    static var BombPushback:boolean = true;
    static var BombCost:float = 20.0;
    
    static var PulseRange:float = 4.0;
    static var PulseDamage:float = 1.0;
    static var PulseCooldown:float = 0.1;
    static var PulseChargeTime:float = 0.8;     
    static var PulsePushback:boolean = true;
    static var PulseCost:float = 40.0;
    
    static var ZapRange:float = 2.0;
    static var ZapDamage:float = 2.0;
    static var ZapCooldown:float = 0.1;
    static var ZapChargeTime:float = 0.5;       
    static var ZapPushback:boolean = false;
    static var ZapCost:float = -10.0;
    
    static var _Range = [
        BombRange,
        PulseRange,
        ZapRange
    ];
    
    static var _Damage = [
        BombDamage,
        PulseDamage,
        ZapDamage
    ];
    
    static var _Cooldown = [
        BombCooldown,
        PulseCooldown,
        ZapCooldown
    ];
    
    static var _ChargeTime = [
        BombChargeTime,
        PulseChargeTime,
        ZapChargeTime
    ];
    
    static var _Pushback = [
        BombPushback,
        PulsePushback,
        ZapPushback
    ];

    static var _Cost = [
        BombCost,
        PulseCost,
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