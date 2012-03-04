#pragma strict

import Explosive;

private var scaleRatio:float = 3.0;
private var player:Player;

function Start (){
    transform.localPosition = Vector3(0,0.05,0);
    player = FindObjectOfType(Player);
}

function Update () {

    var startColor:Color = Color(0.5,0.5,0.5,0.6);
    var endColor:Color;
    switch (Explosive.type){
        case ExplosiveType.Bomb:
            endColor = Tweakable.BombColor;
            break;
        case ExplosiveType.Zap:
            endColor = Tweakable.ZapColor;
            break;
        case ExplosiveType.Push:
            endColor = Tweakable.PushColor;
            break;                          
        default:
            endColor = Color(0.4,0.9,0.5,0.6);
            break;
    }

    var percentage:float = player.HoldPercentage();

    
    if (percentage <= 0){
        renderer.enabled = false;
    }else{
        renderer.enabled = true;
    }
    
    transform.localScale = Vector3(percentage*Explosive.Range()/scaleRatio, 1.0, percentage*Explosive.Range()/scaleRatio);
    if (player.ExplosiveAvailable() && percentage >= 0.95){
        renderer.material.color = Color.Lerp(startColor, endColor, percentage+0.15);    
    }else{
        renderer.material.color = startColor;
    }
    
}
