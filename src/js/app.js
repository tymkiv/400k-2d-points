import * as THREE from 'three';
import gsap from 'gsap';

import VTKLoader from './lib/vtkloader';

const OrbitControls = require('three-orbit-controls')(THREE);

// const loader = new THREE.VTKLoader();
// loader.load('img/female.vtk', (geometry) => {
//   console.log(mesh);

//   this.geometry = new THREE.BufferGeometry();

//   this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//   this.geometry.setAttribute('source', new THREE.BufferAttribute(obj[0].sourcePos, 2));
//   this.geometry.setAttribute('target', new THREE.BufferAttribute(obj[1].sourcePos, 2));

//   this.material = new THREE.RawShaderMaterial({
//     uniforms: {
//       blend: { type: 'f', value: 0 },
//       size: { type: 'f', value: window.devicePixelRatio },
//       dimensions: { type: 'v2', value: new THREE.Vector2(this.nW, this.nH) }
//     },
//     vertexShader: document.getElementById( 'vertexShader' ).textContent,
//     fragmentShader: document.getElementById( 'fragmentShader' ).textContent
//   });

//   const points = new THREE.Points(this.geometry, this.material);
//   this.scene.add(points);
// })

function loadImages(paths, onLoad) {
  const imgs = [];
  let counter = 0;
  paths.forEach((path, i) => {
    const img = new Image;
    
    img.onload = () => {
      imgs[i] = img;
      counter += 1;
      if (counter === paths.length) onLoad(imgs);
    }
    img.src = path;
  });
}

class Sketch {
  constructor(container) {
    this.container = container;

    this.init();


    // Do something
    this.states = [];
    this.vtkLoader.load('img/female.vtk', geometry => {
      this.geometry = geometry;
      this.count = geometry.attributes.position.count;

      this.girlArr = Float32Array.from(geometry.attributes.position.array); 
      this.girlAttr = new THREE.BufferAttribute( this.girlArr, 3 );
      
      this.cubeArr = new Float32Array(this.count * 3);
      
      for (let i = 0; i < this.count * 3; i += 3) {
        this.cubeArr[i + 0] = Math.random() * 2;
        this.cubeArr[i + 1] = Math.random() * 2 + 1;
        this.cubeArr[i + 2] = Math.random() * 2 - 1;
      }

      this.cubeAttr = new THREE.BufferAttribute( this.cubeArr, 3 );
      
      this.states.push(this.girlAttr); 
      this.states.push(this.cubeAttr); 
      console.log(this.states);
      this.geometry.setAttribute('source', this.girlAttr);
      this.geometry.setAttribute('target', this.cubeAttr);

      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          dot: { type: 't', value: new THREE.TextureLoader().load('img/reddot.png') },
          blend: { type: 'f', value: 0 },
          size: { type: 'f', value: window.devicePixelRatio },
          dimensions: { type: 'v2', value: new THREE.Vector2(this.nW, this.nH) }
        },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        alphaTest: 0.5,
        transparent: true,
      });

      const points = new THREE.Points(this.geometry, this.material);
      this.scene.add(points);

      points.position.y = -2;
      points.rotation.y = -1.6;

      document.querySelector('body').addEventListener('click', () => {
        gsap.to(this.material.uniforms.blend, {value: 1, duration: 0.5, onComplete: () => {
          const tmp1 = this.geometry.attributes.target;
          this.material.uniforms.blend.value = 0;
          this.geometry.attributes.target = this.geometry.attributes.source;
          this.geometry.attributes.source = tmp1;

        }})
      })
    });
    
    // End of something

    
    this.animate();
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.container.clientWidth / this.container.clientHeight,
      0.001, 500
    );
    this.camera.position.set( 0, 0, 4 );

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.container.appendChild( this.renderer.domElement );

    this.vtkLoader = new THREE.VTKLoader();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.onWindowResize();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.renderer.setSize(this.width, this.height);

    this.resolutionWidth = this.renderer.domElement.width;
    this.resolutionHeight = this.renderer.domElement.height;
  }
}

const sketch = new Sketch(document.getElementById('root'));