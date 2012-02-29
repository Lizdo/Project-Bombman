#pragma strict

enum PickupType{
    HP = 0,
    MP = 1,
    Strength = 2,
    Armor = 3,
}

public var type:PickupType;
private var player:Player;

private var currentLifeTime:float = 0.0;
public var lifeTime:float = 20.0;
private var blinkTime:float = 5.0;
private var pickupDistance:float = 1.0;

function Start(){
    player = FindObjectOfType(Player);
    color = renderer.material.color;
    startingY = transform.position.y;

    yield WaitForSeconds(lifeTime);
    Disappear();
}

private var rotateSpeed:float = 360;

private var color:Color;

function Update(){
    if(Mathf.Abs(transform.position.y - floorHeight) >= 0.01){
        UpdateDrop();
        // TODO: Play a particle when touch the ground;
        return;
    }

    currentLifeTime += Time.deltaTime;

    if (lifeTime - currentLifeTime <= blinkTime){
        Blink();
    }

    // Rotating
    transform.Rotate(Vector3.up * Time.deltaTime*rotateSpeed);

    if (Vector3.Distance(player.Position(), transform.position) <= pickupDistance){
        PickedUp();
    }
}

private var floorHeight:float = 1.0;

private var droppingTime:float = 0;
private var startingY:float;
private var g:float = 2;

function UpdateDrop(){
    droppingTime += Time.deltaTime;

    var newY = startingY - g * droppingTime * droppingTime/2;
    if (newY <= floorHeight){
        newY = floorHeight;
    }

    transform.position = Vector3(transform.position.x, newY, transform.position.z);
}

private var offTime:float;
private var blinkDuration:float = 0.1;
function Blink(){
    offTime += Time.deltaTime;
    if (offTime >= blinkDuration){
        offTime = 0;
        if (renderer.material.color == Color.white){
            renderer.material.color = color;
        }else{
            renderer.material.color = Color.white;
        }
    }
}


function Title():String{
    return "HP Pickup";
}


function Description(){
    return "Add 50 HP";
}

function PickedUp(){
    switch (type){
        case PickupType.HP:
            player.Heal(50);
            break;
        case PickupType.MP:
            player.RefillMP(50);
            break;
        case PickupType.Strength:
            player.AddEffect(Effect.EffectWithName(Effect.Strength));
            break;
        case PickupType.Armor:
            player.AddEffect(Effect.EffectWithName(Effect.Armor));
            break;
    }
    
    Destroy(this.gameObject);
}

function Disappear(){
    Destroy(this.gameObject);
}