#pragma strict

private var scroll: float = 0.05; // scrolling velocity 
private var duration: float = 1.5; // time to die 
private var alpha: float;
public var color:Color = Color(0.8,0.8,0,1.0);;

function Start(){
    guiText.material.color = color;
    alpha = 1;
}

function Update(){
    if (alpha>0){
        transform.position.y += scroll*Time.deltaTime; 
        alpha -= Time.deltaTime/duration; 
        guiText.material.color.a = alpha;   
    } else {
        Destroy(transform.gameObject);
    }
}