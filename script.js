window.onload = () => {
  const screenItems = ['archives','message','poem', 'poem-2','text', 'text-2'];

  let mode = 'system';
  let isPoem1 = true;
  let isText1 = true;
  let texts = [];
  let poemIndex = 0;
  let textIndex = 0;
  let poems = [];
  let intervalID = null;

  const gradient = [0x000000, 0x111111, 0x222222, 0x333333, 0x444444, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xaaaaaa, 0xbbbbbb, 0xcccccc, 0xdddddd, 0xeeeeee, 0xffffff];
  let gradientIndex= 0;
  let backgroundChanging = false;
  let toWhite = false;

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

  const forwardGeometry = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialForward = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const forward = new THREE.Mesh(forwardGeometry, materialForward);

  const doubleForwardGeometryLeft = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialDoubleForwardLeft = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const doubleForwardLeft = new THREE.Mesh(doubleForwardGeometryLeft, materialDoubleForwardLeft);

  const doubleForwardGeometryRight = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialDoubleForwardRight = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const doubleForwardRight = new THREE.Mesh(doubleForwardGeometryRight, materialDoubleForwardRight);

  const backwardGeometry = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialBackward = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const backward = new THREE.Mesh(backwardGeometry, materialBackward);

  const doubleBackwardGeometryLeft = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialDoubleBackwardLeft = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const doubleBackwardLeft = new THREE.Mesh(doubleBackwardGeometryLeft, materialDoubleBackwardLeft);

  const doubleBackwardGeometryRight = new THREE.TorusGeometry(1, .2, 8, 3);
  const materialDoubleBackwardRight = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0});
  const doubleBackwardRight = new THREE.Mesh(doubleBackwardGeometryRight, materialDoubleBackwardRight);

  const meshes = [torusSaturn, sphereSaturn, torusSolar, sphereSolar, torusOrbit];
  const poemButtons = [forward, doubleForwardLeft, doubleForwardRight, backward, doubleBackwardLeft, doubleBackwardRight];

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
  scene.add(forward);
  scene.add(doubleForwardLeft);
  scene.add(doubleForwardRight);
  scene.add(backward);
  scene.add(doubleBackwardLeft);
  scene.add(doubleBackwardRight);
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
  forward.position.set(-2,-4,0);
  doubleForwardLeft.position.set(3,-4,0);
  doubleForwardRight.position.set(3.75,-4,0);
  backward.position.set(-10,-4,0);
  backward.rotation.y = Math.PI;
  doubleBackwardLeft.position.set(-15.75,-4,0);
  doubleBackwardLeft.rotation.y = Math.PI;
  doubleBackwardRight.position.set(-15,-4,0);
  doubleBackwardRight.rotation.y = Math.PI;

  const boxSaturn = new THREE.BoxHelper(torusSaturn, 0xffffff);
  const boxForward = new THREE.BoxHelper(forward, 0xffffff);
  const boxDoubleForward = new THREE.BoxHelper(doubleForwardRight, 0xffffff);
  const boxBackward = new THREE.BoxHelper(backward, 0xffffff);
  const boxDoubleBackward = new THREE.BoxHelper(doubleBackwardLeft, 0xffffff);

  sphereSolar.add(boxSaturn);
  scene.add(boxForward);
  scene.add(boxDoubleForward);
  scene.add(boxBackward);
  scene.add(boxDoubleBackward);
  boxSaturn.material.visible = false;
  boxForward.material.visible = false;
  boxDoubleForward.material.visible = false;
  boxBackward.material.visible = false;
  boxDoubleBackward.material.visible = false;

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
      fadeModel(torusOrbit, true, .003);
    }

    makeBackgroundWhite(toWhite);

    if(backgroundChanging){
      renderer.setClearColor(gradient[gradientIndex]);
      darkenMeshes(toWhite);
    }

    for(let button of poemButtons){
      fadeModel(button, toWhite, .05);
    }

    renderer.render(scene, camera);
  }

  function clearScreen(){
    console.log('clearing...');
    for(let item of screenItems){
      quickFadeout(document.getElementById(item));
    }
  }

  function clickHandler() {
    if(hoverObjs.includes(boxSaturn) && !zoomingOutCompleted){
      zoomingOut = true;
      zoomingOutZ = 1;
      zoomingOutY = 1;
      zoomingOutX = 1;
      fadeout(document.getElementById("apollo"));
    }

    if(hoverObjs.includes(boxSaturn) && zoomingOutCompleted && !toWhite){
      toWhite = true;
      quickFadeout(document.getElementById("saturn"));
      quickFadein(document.getElementById("message"));
      poems = message;
      startingPoem(poems[0], true);
      mode = 'message';
    }
    else if(hoverObjs.includes(boxSaturn) && hoverObjs.includes(boxForward) && toWhite){
      nextText(true);
    }

    else if(hoverObjs.includes(boxSaturn) && hoverObjs.includes(boxBackward) && toWhite){
      previousText(true);
    }
    else if(hoverObjs.includes(boxSaturn) && zoomingOutCompleted && toWhite){
      toWhite = false;
      quickFadeout(document.getElementById("system"));
      clearScreen();
      mode = 'system';
    }

    if(hoverObjs.includes(boxSolar) && zoomingOutCompleted && !toWhite){
      toWhite = true;
      quickFadeout(document.getElementById("sol"));
      quickFadein(document.getElementById("archives"));
      poems = archives
      startingPoem(poems[0],false);
      mode = 'archives';
    }
    else if(hoverObjs.includes(boxSolar) && zoomingOutCompleted && toWhite){
      toWhite = false;
      quickFadeout(document.getElementById("system"));
      clearScreen();
      mode = 'system';
    }

    if(hoverObjs.includes(boxForward)){
      nextText(true);
    }
    if(hoverObjs.includes(boxDoubleForward)){
      nextPoem(true);
    }
    if(hoverObjs.includes(boxBackward)){
      previousText(true);
    }
    if(hoverObjs.includes(boxDoubleBackward)){
      previousPoem(true);
    }
  }

  function darkenMeshes(toDarken){
    let color = toDarken?0x555555:0xffffff;
    for(let mesh of meshes){
      mesh.material.color.set(color);
    }
  }

  function fadein(element){
    element.classList.remove("fadeout");
    element.classList.remove("invisible");
    element.classList.add("fadein");
  }

  function fadeModel(model, isFadein, rate){
    if(isFadein && model.material.opacity < 1){
      model.material.opacity += rate;
    }
    else if(!isFadein && model.material.opacity > 0){
      model.material.opacity -= rate;
    }
  }

  function fadeout(element){
    element.classList.remove("fadein");
    element.classList.add("fadeout");
  }

  function intervalFunc(){
    nextPoem(false);
  }

  function makeBackgroundWhite(toWhite){
    if(toWhite){
      document.body.style.color = 'black';
      if(gradientIndex < (gradient.length - 1)){
        backgroundChanging = true;
        gradientIndex++;
      }
      else{
        backgroundChanging = false
      }
    }
    else{
      document.body.style.color = 'white';
      if(gradientIndex > 1){
        backgroundChanging = true;
        gradientIndex--;
      }
      else{
        backgroundChanging = false
      }
    }
  }

  function mouseMoveHandler(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  function nextPoem(endInterval){
    if(endInterval){
      clearInterval(intervalID);
    }
    poemIndex++;
    poemIndex = poemIndex%poems.length;
    switchPoem(poems[poemIndex]);
  }

  function nextText(endInterval){
    if(endInterval){
      clearInterval(intervalID);
    }
    textIndex++;
    textIndex = textIndex%texts.length;
    switchText(texts[textIndex]);
  }

  function objectHover(){
    // update the picking ray with the camera and mouse position
	  raycaster.setFromCamera( mouse, camera );

	 // calculate objects intersecting the picking ray
	 const intersectMain = raycaster.intersectObjects( scene.children );
   const intersectPlanets = raycaster.intersectObjects( sphereSolar.children );

   const color = toWhite?0x555555:0xffffff;

   if(intersectMain.length > 0 || intersectPlanets.length > 0){
     for(let i = 0; i < intersectPlanets.length; i++){
       if(!hoverObjs.includes(intersectPlanets[i])){
         if(intersectPlanets[i].object == boxSaturn){
           if(zoomingOutCompleted && !toWhite){
             quickFadein(document.getElementById('saturn'));
           }
           else if(zoomingOutCompleted && toWhite){
             quickFadein(document.getElementById('system'));
           }
           torusSaturn.material.color.set(0x7851A9);
           sphereSaturn.material.color.set(0x7851A9);
           hoverObjs.push(torusSaturn);
           hoverObjs.push(sphereSaturn);
           hoverObjs.push(boxSaturn);
         }
     }
   }
     for(let i = 0; i < intersectMain.length; i++){
       if(!hoverObjs.includes(intersectMain[i])){
         if(intersectMain[i].object == boxSolar){
           if(zoomingOutCompleted && !toWhite){
             quickFadein(document.getElementById('sol'));
           }
           else if(zoomingOutCompleted && toWhite){
             quickFadein(document.getElementById('system'));
           }
           torusSolar.material.color.set(0xCC5500);
           sphereSolar.material.color.set(0xCC5500);
           hoverObjs.push(torusSolar);
           hoverObjs.push(sphereSolar);
           hoverObjs.push(boxSolar);
         }
         if(intersectMain[i].object == boxForward && toWhite){
           quickFadein(document.getElementById('next-lines'));
           forward.material.color.set(0xffffff);
           hoverObjs.push(forward);
           hoverObjs.push(boxForward);
         }
         if(intersectMain[i].object == boxDoubleForward && toWhite){
           quickFadein(document.getElementById('next-poem'));
           doubleForwardLeft.material.color.set(0xffffff);
           doubleForwardRight.material.color.set(0xffffff);
           hoverObjs.push(doubleForwardLeft);
           hoverObjs.push(doubleForwardRight);
           hoverObjs.push(boxDoubleForward);
         }
         if(intersectMain[i].object == boxBackward && toWhite){
           quickFadein(document.getElementById('previous-lines'));
           backward.material.color.set(0xffffff);
           hoverObjs.push(backward);
           hoverObjs.push(boxBackward);
         }
         if(intersectMain[i].object == boxDoubleBackward && toWhite){
           quickFadein(document.getElementById('previous-poem'));
           doubleBackwardLeft.material.color.set(0xffffff);
           doubleBackwardRight.material.color.set(0xffffff);
           hoverObjs.push(doubleBackwardLeft);
           hoverObjs.push(doubleBackwardRight);
           hoverObjs.push(boxDoubleBackward);
         }
       }
     }
   }
   else if(hoverObjs.length > 0 && intersectMain.length === 0 && intersectPlanets.length === 0){
     for(let i = 0; i < hoverObjs.length; i++){
       if(hoverObjs[i] == boxSolar && zoomingOutCompleted && !toWhite){
         quickFadeout(document.getElementById('sol'));
       }
       if(hoverObjs[i] == boxSaturn && zoomingOutCompleted && !toWhite){
         quickFadeout(document.getElementById('saturn'));
       }
       if(hoverObjs[i] == boxSolar && zoomingOutCompleted && toWhite){
         quickFadeout(document.getElementById('system'));
       }
       if(hoverObjs[i] == boxSaturn && zoomingOutCompleted && toWhite){
         quickFadeout(document.getElementById('system'));
       }
       if(hoverObjs[i] == boxForward && toWhite){
         quickFadeout(document.getElementById('next-lines'));
       }
       if(hoverObjs[i] == boxDoubleForward && toWhite){
         quickFadeout(document.getElementById('next-poem'));
       }
       if(hoverObjs[i] == boxBackward && toWhite){
         quickFadeout(document.getElementById('previous-lines'));
       }
       if(hoverObjs[i] == boxDoubleBackward && toWhite){
         quickFadeout(document.getElementById('previous-poem'));
       }
       hoverObjs[i].material.color.set(color);
     }
     hoverObjs = [];
   }
  }

  function previousPoem(endInterval){
    if(endInterval){
      clearInterval(intervalID);
    }
    poemIndex--;
    poemIndex = poemIndex == -1?poems.length - 1:poemIndex;
    switchPoem(poems[poemIndex]);
  }

  function previousText(endInterval){
    if(endInterval){
      clearInterval(intervalID);
    }
    textIndex--;
    textIndex = textIndex == -1?texts.length - 1:textIndex;
    switchText(texts[textIndex]);
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

  function startingPoem(poem, isDynamic){
    const activePoemElement = document.getElementById('poem');
    const activeTextElement = document.getElementById('text');
    texts = poem.text;
    textIndex = 0;
    activePoemElement.innerHTML = poem.title;
    activeTextElement.innerHTML = texts[textIndex];
    quickFadein(activePoemElement);
    quickFadein(activeTextElement);
    if(isDynamic){
      intervalID = setInterval(intervalFunc, 5000);
    }
  }

  function switchPoem(poem){
    const activePoemId = isPoem1?'poem-2':'poem';
    const hiddenPoemId = isPoem1?'poem':'poem-2';
    isPoem1 = isPoem1?false:true;
    const activePoemElement = document.getElementById(activePoemId);
    const hiddenPoemElement = document.getElementById(hiddenPoemId);
    activePoemElement.innerHTML = poem.title;
    texts = poem.text;
    textIndex = 0;
    switchText(texts[textIndex]);
    quickFadeout(hiddenPoemElement);
    quickFadein(activePoemElement);
  }

  function switchText(text){
    const activeTextId = isText1?'text-2':'text';
    const hiddenTextId = isText1?'text':'text-2';
    isText1 = isText1?false:true;
    const activeTextElement = document.getElementById(activeTextId);
    const hiddenTextElement = document.getElementById(hiddenTextId);
    activeTextElement.innerHTML = text;
    quickFadeout(hiddenTextElement);
    quickFadein(activeTextElement);
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
