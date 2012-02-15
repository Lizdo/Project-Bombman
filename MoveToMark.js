
private var lifeTime:float = 0;
private var maxLifeTime:float = 1.0;

function Start () {
	yield WaitForSeconds(maxLifeTime);
	Destroy(this.gameObject);
}

function Update () {
	lifeTime += Time.deltaTime;
	renderer.material.color = Color.Lerp(Color.grey,Color(0.5, 0.5, 0.5, 0), lifeTime/maxLifeTime);
}
