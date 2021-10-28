window.onload = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  const torusSaturnGeometry = new THREE.TorusGeometry(1, .2, 8, 6);
  const materialSaturn = new THREE.MeshLambertMaterial({color: 0xffffff})
  const torusSaturn = new THREE.Mesh(torusSaturnGeometry, materialSaturn);
  const boxSaturn = new THREE.BoxHelper(torusSaturn, 0xffffff);

  const sphereSaturnGeometry = new THREE.SphereGeometry(.2, 8, 4)
  const sphereSaturn = new THREE.Mesh(sphereSaturnGeometry, materialSaturn);

  const torusSolarGeometry = new THREE.TorusGeometry(1, .2, 32, 24);
  const materialSolar = new THREE.MeshLambertMaterial({color: 0xffffff})
  const torusSolar = new THREE.Mesh(torusSolarGeometry, materialSolar);


  const sphereSolarGeometry = new THREE.SphereGeometry(.2, 32, 16)
  const sphereSolar = new THREE.Mesh(sphereSolarGeometry, materialSolar);

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

  let mouse = new THREE.Vector2(5,5);
  let raycaster = new THREE.Raycaster();
  let hoverObjs = [];

  let zoomingOut = false;
  let zoomingOutZ = 0;
  let zoomingOutY = 0;
  let zoomingOutX = 0;
  let zoomingOutCompleted = false;

  scene.add(torusSaturn);
  scene.add(sphereSaturn);
  scene.add(boxSaturn);
  scene.add(torusSolar);
  scene.add(sphereSolar);
  scene.add(directionalLight);

  boxSaturn.material.visible = false;

  camera.position.z = 5;
  directionalLight.position.set(0,0,1);
  torusSolar.position.set(-6,6,0);
  sphereSolar.position.set(-6,6,0);

  const boxSolar = new THREE.BoxHelper(torusSolar, 0xffffff);

  scene.add(boxSolar);

  boxSolar.material.visible = false;

  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', resizeHandler);

  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('click', clickHandler);

  document.body.appendChild(renderer.domElement);

  animate();

  function animate(){
    requestAnimationFrame(animate);

    objectHover();

    torusSaturn.rotation.y += 0.01;
    torusSaturn.rotation.z += 0.01;
    torusSolar.rotation.x += 0.001;

    if(zoomingOut){
      zoomOut();
    }

    renderer.render(scene, camera);
  }

  function mouseMoveHandler(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function clickHandler() {
    if(hoverObjs.includes(sphereSaturn) && !zoomingOutCompleted){
      zoomingOut = true;
      zoomingOutZ = 1;
      zoomingOutY = 1;
      zoomingOutX = 1;
      fadeout(document.getElementById("title"));
    }
  }

  function fadein(element){
    element.classList.remove("fadeout");
    element.classList.add("fadein");
  }

  function fadeout(element){
    element.classList.remove("fadein");
    element.classList.add("fadeout");
  }

  function objectHover(){
    // update the picking ray with the camera and mouse position
	  raycaster.setFromCamera( mouse, camera );

	 // calculate objects intersecting the picking ray
	 const intersects = raycaster.intersectObjects( scene.children );

   if(intersects.length > 0){
     for(let i = 0; i < intersects.length; i++){
       if(!hoverObjs.includes(intersects[i])){
         if(intersects[i].object == boxSaturn){
           torusSaturn.material.color.set(0x7851A9)
           sphereSaturn.material.color.set(0x7851A9)
           hoverObjs.push(torusSaturn);
           hoverObjs.push(sphereSaturn);
         }
         else if(intersects[i].object == boxSolar){
           torusSolar.material.color.set(0xCC5500)
           sphereSolar.material.color.set(0xCC5500)
           hoverObjs.push(torusSolar);
           hoverObjs.push(sphereSolar);
         }
       }
     }
   }
   else if(hoverObjs.length > 0 && intersects.length === 0){
     for(let i = 0; i < hoverObjs.length; i++){
       hoverObjs[i].material.color.set(0xffffff);
     }
     hoverObjs = [];
   }
  }

  function resizeHandler(){
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize( w, h );
  }

  function zoomOut(){
    if(camera.position.z >= 15){
      zoomingOutZ = 2;
    }
    else{
      camera.position.z += 0.05;
    }
    if(camera.position.y >= 6){
      zoomingOutY = 2;
    }
    else{
      camera.position.y += 0.02;
    }
    if(camera.position.x <= -6){
      zoomingOutX = 2;
    }
    else{
      camera.position.x -= 0.02;
    }
    if(zoomingOutZ === 2 && zoomingOutY === 2 && zoomingOutX === 2){
      zoomingOut = false;
      zoomingOutCompleted = true;
    }

  }
}
