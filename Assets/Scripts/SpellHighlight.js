#pragma strict

import Explosive;

private var scaleRatio:float = 3.0;
private var player:Player;

function Start (){
    transform.localPosition = Vector3(0,0.05,0);
    player = FindObjectOfType(Player);
}

private var bombTex:Texture = Resources.Load("Ring_Bomb", Texture);
private var zapTex:Texture = Resources.Load("Ring_Zap", Texture);
private var pushTex:Texture = Resources.Load("Ring_Push", Texture);

private var type:ExplosiveType = -1;

private var startColor:Color = Color(0.5,0.5,0.5,0.6);
private var endColor:Color = startColor;

function Update () {    

    if (Explosive.type != type){
        switch (Explosive.type){
            case ExplosiveType.Bomb:
                endColor = Tweakable.BombColor;
                renderer.material.mainTexture = bombTex;
                break;
            case ExplosiveType.Zap:
                endColor = Tweakable.ZapColor;
                renderer.material.mainTexture = zapTex;
                break;
            case ExplosiveType.Push:
                endColor = Tweakable.PushColor;
                renderer.material.mainTexture = pushTex;
                break;                          
            default:
                endColor = Color(0.4,0.9,0.5,0.6);
                break;
        }
        type = Explosive.type;
    }

    var percentage:float = player.HoldPercentage();
    
    if (percentage <= 0){
        renderer.enabled = false;
    }else{
        renderer.enabled = true;
    }
    
    transform.localScale = Vector3(percentage*Explosive.Range()/scaleRatio, 1.0, percentage*Explosive.Range()/scaleRatio);

    if (player.ExplosiveAvailable() && percentage >= 0.95){
        renderer.material.color = Color.Lerp(startColor, endColor, percentage);    
    }else{
        renderer.material.color = startColor;
    }
    
}





