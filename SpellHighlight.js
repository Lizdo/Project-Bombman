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
            endColor = Color(184.0/255, 150/255, 0/255, 0.6);
            break;
        case ExplosiveType.Zap:
            endColor = Color(255.0/255, 187/255, 98/255.0, 0.6);
            break;
        case ExplosiveType.Pulse:
            endColor = Color(0.0/255, 88/255.0, 237/255.0, 0.6);
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