#pragma strict

public class Effect{
    static var Freeze:String = "Freeze";
    static var Fire:String = "Fire";
    static var Armor:String = "Armor";
    static var Strength:String = "Strength";
    
    public var name:String;
    public var duration:float;
    public var currentTime:float;   
    
    public function Effect(n:String, d:float){
        name = n;
        duration = d;
        currentTime = 0;
    }
    
    public function Reset(){
        currentTime = 0;
    }

    public static function EffectWithName(name:String):Effect{
        if (name == Freeze)
            return new Effect(Freeze, 10);
        else if (name == Fire)
            return new Effect(Fire, 10);
        else if (name == Fire)
            return new Effect(Strength, 10);            
        else if (name == Fire)
            return new Effect(Armor, 10);           
        else
            return null;
    }
    
    
}