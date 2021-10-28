window.onload = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();

  const torusGeometry = new THREE.TorusGeometry(1, .2, 8, 6);
  const material = new THREE.MeshLambertMaterial({color: 0xffffff})
  const torus = new THREE.Mesh(torusGeometry, material);

  const sphereGeometry = new THREE.SphereGeometry(.2, 32, 16)
  const sphere = new THREE.Mesh(sphereGeometry, material);

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

  scene.add(torus);
  scene.add(sphere);
  scene.add(directionalLight);

  camera.position.z = 5;
  directionalLight.position.set(0,0,1);

  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', resizeHandler);

  document.body.appendChild(renderer.domElement);

  animate();

  function animate(){
    requestAnimationFrame(animate);
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;
    renderer.render(scene, camera);
  }

  function resizeHandler(){
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize( w, h );
  }
}
