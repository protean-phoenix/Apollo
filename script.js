window.onload = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  const torusOrbitGeometry = new THREE.TorusGeometry(8.5, .03, 32, 48);
  const materialOrbit = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0});
  const torusOrbit = new THREE.Mesh(torusOrbitGeometry, materialOrbit);

  const torusSaturnGeometry = new THREE.TorusGeometry(1, .2, 8, 6);
  const materialSaturn = new THREE.MeshLambertMaterial({color: 0xffffff});
  const torusSaturn = new THREE.Mesh(torusSaturnGeometry, materialSaturn);

  const sphereSaturnGeometry = new THREE.SphereGeometry(.2, 8, 4);
  const sphereSaturn = new THREE.Mesh(sphereSaturnGeometry, materialSaturn);

  const torusSolarGeometry = new THREE.TorusGeometry(1, .2, 32, 24);
  const materialSolar = new THREE.MeshLambertMaterial({color: 0xffffff});
  const torusSolar = new THREE.Mesh(torusSolarGeometry, materialSolar);


  const sphereSolarGeometry = new THREE.SphereGeometry(.2, 32, 16);
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

  scene.add(torusOrbit);
  scene.add(torusSolar);
  scene.add(sphereSolar);
  sphereSolar.add(torusSaturn);
  sphereSolar.add(sphereSaturn);
  scene.add(directionalLight);

  camera.position.z = 5;
  directionalLight.position.set(0,0,1);
  torusOrbit.position.set(-6,6,0);
  torusSolar.position.set(-6,6,0);
  sphereSolar.position.set(-6,6,0);
  torusSaturn.position.set(6,-6,0);
  sphereSaturn.position.set(6,-6,0);

  const boxSaturn = new THREE.BoxHelper(torusSaturn, 0xffffff);

  sphereSolar.add(boxSaturn);
  boxSaturn.material.visible = false;

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
    if(zoomingOut || zoomingOutCompleted){
      sphereSolar.rotation.z += 0.001;
    }

    if(zoomingOut){
      zoomOut();
      torusOrbit.material.opacity += .003;
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
      fadeout(document.getElementById("apollo"));
    }
  }

  function fadein(element){
    element.classList.remove("fadeout");
    element.classList.remove("invisible");
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
	 const intersectSolar = raycaster.intersectObjects( scene.children );
   const intersectPlanets = raycaster.intersectObjects( sphereSolar.children );

   if(intersectSolar.length > 0 || intersectPlanets.length > 0){
     for(let i = 0; i < intersectPlanets.length; i++){
       if(!hoverObjs.includes(intersectPlanets[i])){
         if(intersectPlanets[i].object == boxSaturn){
           if(zoomingOutCompleted){
             quickFadein(document.getElementById('saturn'));
           }
           torusSaturn.material.color.set(0x7851A9);
           sphereSaturn.material.color.set(0x7851A9);
           hoverObjs.push(torusSaturn);
           hoverObjs.push(sphereSaturn);
           hoverObjs.push(boxSaturn);
         }
     }
   }
     for(let i = 0; i < intersectSolar.length; i++){
       if(!hoverObjs.includes(intersectSolar[i])){
         if(intersectSolar[i].object == boxSolar){
           if(zoomingOutCompleted){
             quickFadein(document.getElementById('sol'));
           }
           torusSolar.material.color.set(0xCC5500);
           sphereSolar.material.color.set(0xCC5500);
           hoverObjs.push(torusSolar);
           hoverObjs.push(sphereSolar);
           hoverObjs.push(boxSolar);
         }
       }
     }
   }
   else if(hoverObjs.length > 0 && intersectSolar.length === 0 && intersectPlanets.length === 0){
     for(let i = 0; i < hoverObjs.length; i++){
       if(hoverObjs[i] == boxSolar && zoomingOutCompleted){
         quickFadeout(document.getElementById('sol'));
       }
       if(hoverObjs[i] == boxSaturn && zoomingOutCompleted){
         quickFadeout(document.getElementById('saturn'));
       }
       hoverObjs[i].material.color.set(0xffffff);
     }
     hoverObjs = [];
   }
  }

  function quickFadein(element){
    element.classList.remove("quickfadeout");
    element.classList.remove("invisible");
    element.classList.add("quickfadein");
  }

  function quickFadeout(element){
    element.classList.remove("quickfadein");
    element.classList.add("quickfadeout");
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
