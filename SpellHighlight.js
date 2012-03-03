#pragma strict

import Explosive;

private var percentage:float;
private var scaleRatio:float = 3.0;


function Start (){
    percentage = 0;
    transform.localPosition = Vector3(0,0.05,0);
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

    
    if (percentage <= 0){
        renderer.enabled = false;
    }else{
        renderer.enabled = true;
    }
    
    transform.localScale = Vector3(percentage*Explosive.Range()/scaleRatio, 1.0, percentage*Explosive.Range()/scaleRatio);
    renderer.material.color = Color.Lerp(startColor, endColor, percentage+0.15);
}

function SetPercentage(p:float){
    percentage = p;
}