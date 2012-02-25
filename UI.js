public var floatingText:FloatingText;

function SpawnFloatingText(points: float, x: float, y: float, color:Color){
    x = Mathf.Clamp(x,0.05,0.95); // clamp position to screen to ensure
    y = Mathf.Clamp(y,0.05,0.9);  // the string will be visible

    var gui:FloatingText = Instantiate(floatingText,Vector3(x,y,0),Quaternion.identity);
    gui.guiText.text = Mathf.Round(points).ToString();
    gui.color = color;
}