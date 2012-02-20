private var lifeSpan:float = 0.1;

function Start(){
	yield(lifeSpan);
	Destroy(gameObject);
}

function SetPoints(startPoint:Vector3, endPoint:Vector3){
	var lineRenderer : LineRenderer = GetComponent(LineRenderer);
	lineRenderer.SetPosition(0, startPoint);
	lineRenderer.SetPosition(1, endPoint);
}