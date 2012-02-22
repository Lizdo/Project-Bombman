private var lifeSpan:float = 0.2;

function Start(){
	yield(lifeSpan);
	Destroy(gameObject);
}

function SetPoints(startPoint:Vector3, endPoint:Vector3){
	var lineRenderer:LineRenderer = GetComponent(LineRenderer);		
	lineRenderer.SetVertexCount(2);
	lineRenderer.SetPosition(0, startPoint);
	lineRenderer.SetPosition(1, endPoint);
}

function SetColor(c:Color){
	var lineRenderer:LineRenderer = GetComponent(LineRenderer);			
	lineRenderer.SetColors(c,c);
}

function SetWidth(w:float){
	var lineRenderer:LineRenderer = GetComponent(LineRenderer);			
	lineRenderer.SetWidth(w,w);
}