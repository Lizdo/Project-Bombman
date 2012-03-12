#pragma strict

public class Ability{

// Abilities:
//      - Actively triggered by player
//      - Have a finite Duration/CD
//      - Each use cost MP
//      - Power is the tweakable multiplier

// -   Freeze
// -   Trample: Push Back
// -   Teleport: instead of Move for a duration
// -   Wrath: Double Damage
// -   Shield: Invincible for a duration
// -   Heal: Instant give back HP
// -   Deflection: Deflect a percentage of damage
// -   Meteor: Full Screen AOE
// -   Trail: DOT Puddle
// -   Avatar: become bigger, increase all parameters


    enum AbilityType{
        Freeze      = 0,
        Trample     = 1,
        Teleport    = 2,
        Wrath       = 3,
        Shield      = 4,
        Heal        = 5,
        Deflection  = 6,
        Meteor      = 7,
        Trail       = 8,
        Avatar      = 9,
    }

    // Freeze      
    // Trample     
    // Teleport    
    // Wrath       
    // Shield      
    // Heal        
    // Deflection  
    // Meteor      
    // Trail       
    // Avatar      

    public static var type = AbilityType.Freeze;
    public static var inUse:boolean = false;

    private static var _Cost = [
        40,    // Freeze      
        40,    // Trample     
        60,    // Teleport    
        60,    // Wrath       
        40,    // Shield      
        60,    // Heal        
        60,    // Deflection  
        80,    // Meteor      
        80,    // Trail       
        100    // Avatar  
    ];

    private static var _Duration = [
        10,    // Freeze      
        0,    // Trample     
        10,    // Teleport    
        10,    // Wrath       
        10,    // Shield      
        0,    // Heal        
        5,    // Deflection  
        10,    // Meteor      
        10,    // Trail       
        10    // Avatar  
    ];

    private static var _Power = [
        10,    // Freeze      
        0,    // Trample     
        0,    // Teleport    
        2,    // Wrath       
        0.9,    // Shield      
        400,    // Heal        
        1.5,    // Deflection  
        100,    // Meteor      
        100,    // Trail       
        2    // Avatar  
    ];


    public static function Cost(){
        return _Cost[type];
    }

    public static function Duration(){
        return _Duration[type];
    }

    public static function Power(){
        return _Power[type];
    }    

    public static function Name():String{
        return type.ToString();
    }

    // TODO: Manually load the icons
    public static function Icon():Texture2D{
        var tex:Texture2D = Resources.Load(Name(),Texture2D);
        if (tex == null){
            tex = Resources.Load("Freeze", Texture2D);
        }
        return tex;
    }

    public static function IconInactive():Texture2D{
        var tex:Texture2D = Resources.Load(Name()+"_Inactive",Texture2D);
        if (tex == null){
            tex = Resources.Load("Freeze"+"_Inactive", Texture2D);
        }
        return tex;        
    }


}

