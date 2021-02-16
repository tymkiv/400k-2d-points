// import * as THREE from 'three';
// // import {contain} from 'intrinsic-scale';
// import {contain} from 'intrinsic-scale';

// const OrbitControls = require('three-orbit-controls')(THREE)

// function loadImages(paths, onLoad) {
//   const imgs = [];
//   paths.forEach(path => {
//     const img = new Image;
//     img.onload = () => {
//       imgs.push(img);
//       if (imgs.length === paths.length) onLoad(imgs);
//     }
//     img.src = path;
//   });
// }

// class Sketch {
//   constructor(container) {
//     this.container = container;

//     this.init();


//     // Do something

//     const paths = ['./img/1.1.jpg', './img/2.1.jpg'];

//     const obj = [];
//     paths.forEach((path) => {
//       obj.push({path});
//     });
    
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     document.body.appendChild(canvas);

//     loadImages(paths, (loadedImgs) => {
      
//       loadedImgs.forEach((img, index) => {
        
//         canvas.width = this.resolutionWidth;
//         canvas.height = this.resolutionHeight;
//         canvas.style.width = `${this.width}px`;
//         canvas.style.height = `${this.height}px`;

//         const { width, height, x, y } = contain(this.resolutionWidth, this.resolutionHeight, img.naturalWidth, img.naturalHeight);
        
//         ctx.drawImage(img, x, y, width, height);
//         // ctx.drawImage(img, 0, 0, width, height);

//         const {data: buffer} = ctx.getImageData(0, 0, 640, 640);

//         const rgb = [];

//         const c = new THREE.Color();

//         for (let i = 0; i < buffer.length; i+=4) {
//           c.setRGB(buffer[i], buffer[i+1], buffer[i+2]);
//           rgb.push({c: c.clone(), id: i/4});
//         }

//         const result = new Float32Array(640 * 640);
//         let j = 0;
//         rgb.forEach(e => {
//           result[j] = e.id % 640;
//           result[j+1] = Math.floor(e.id / 640);
//           j += 2;
//         });

//         const texture = new THREE.Texture(img);
//         texture.needsUpdate = true;
//         texture.flipY = false;

//         obj[index].img = img;
//         obj[index].texture = texture;
//         obj[index].result = result;
  
//         console.log('width', width);
//         console.log('height', height);
//       });
//       console.log(obj);
//       console.log(this.resolutionWidth * this.resolutionHeight * 3);
//       const positions = new Float32Array(640 * 640 * 3);
//       let index = 0;
//       for (let i = 0; i < 640; i+=1) {
//         for (let j = 0; j < 640; j+=1) {
//           positions[index*3] = j;
//           positions[index*3 + 1] = i;
//           positions[index*3 + 2] = 0;
//           index += 1;
//         }
//       }

//       const geometry = new THREE.BufferGeometry();
//       console.log(positions);
//       geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//       geometry.setAttribute('source', new THREE.BufferAttribute(obj[0].result, 2));

//       this.material = new THREE.RawShaderMaterial({
//         uniforms: {
//           sourceTex: { type: 't', value: obj[0].texture },
//           blend: { type: 'f', value: 0 },
//           size: { type: 'f', value: window.devicePixelRatio },
//           dimensions: { type: 'v2', value: new THREE.Vector2(640, 640) }
//         },
//         vertexShader: document.getElementById( 'vertexShader' ).textContent,
//         fragmentShader: document.getElementById( 'fragmentShader' ).textContent
//       });

//       const points = new THREE.Points(geometry, this.material);
//       this.scene.add(points);
      
//     });

//     // this.geometry = new THREE.PlaneBufferGeometry(2, 2);

//     // this.material = new THREE.ShaderMaterial({
//     //     uniforms: this.uniforms,
//     //     vertexShader: document.getElementById( 'vertexShader' ).textContent,
//     //     fragmentShader: document.getElementById( 'fragmentShader' ).textContent
//     // });

//     // this.mesh = new THREE.Mesh( this.geometry, this.material );
//     // this.scene.add( this.mesh );

//     // End of something

    
//     this.animate();
//   }

//   init() {
//     // this.camera = new THREE.Camera(); 
//     this.camera = new THREE.PerspectiveCamera(
//       70,
//       this.container.clientWidth / this.container.clientHeight,
//       0.001, 100
//     );
//     this.camera.position.set( 0, 0, 1 );
//     // this.camera.position.z = 1;

//     this.scene = new THREE.Scene();

//     this.renderer = new THREE.WebGLRenderer();
//     // this.renderer.setPixelRatio( window.devicePixelRatio );

//     this.container.appendChild( this.renderer.domElement );

//     this.controls = new OrbitControls(this.camera, this.scene);

//     this.onWindowResize();

//     window.addEventListener('resize', this.onWindowResize.bind(this));
//     // document.addEventListener('mousemove', this.onMouseMove.bind(this));
//   }

//   render() {
//     // this.uniforms.u_time.value += 0.05;
//     this.renderer.render(this.scene, this.camera);
//   }

//   animate() {
//     requestAnimationFrame(this.animate.bind(this));
//     this.render();
//   }

//   // onMouseMove(e) {
//   //   this.uniforms.u_mouse.value.x = e.pageX
//   //   this.uniforms.u_mouse.value.y = e.pageY
//   // }

//   onWindowResize() {
//     this.width = this.container.clientWidth;
//     this.height = this.container.clientHeight;

//     this.renderer.setSize(this.width, this.height);

//     this.resolutionWidth = this.renderer.domElement.width;
//     this.resolutionHeight = this.renderer.domElement.height;

//     // this.uniforms.u_resolution.value.x = this.resolutionWidth;
//     // this.uniforms.u_resolution.value.y = this.resolutionHeight;
//   }
// }

// const sketch = new Sketch(document.getElementById('root'));

import * as THREE from 'three';
import {TimelineMax} from 'gsap';

const OrbitControls = require('three-orbit-controls')(THREE);



let camera; let pos; let controls; let scene; let renderer; let geometry1; let material;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
function render() {
  renderer.render(scene, camera);
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  renderer = new THREE.WebGLRenderer();



  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  const container = document.getElementById('root');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  controls = new OrbitControls(camera, renderer.domElement);




  function loadImages(paths,whenLoaded) {
    const imgs=[];
    paths.forEach(function(path) {
      const img = new Image;
      img.onload = function() {
        imgs.push(img);
        if (imgs.length===paths.length) whenLoaded(imgs);
      };
      img.src = path;
    });
  }

  const images = ['img/1.1.jpg','img/2.1.jpg'];

  const obj = [];
  images.forEach((img) => {
    obj.push({file:img});
  });

  console.log(obj);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  const temp1 = new THREE.Color();
  const temp2 = new THREE.Color();

  loadImages(images,function(loadedImages) {


    obj.forEach((image,index) => {
      const img = loadedImages[index];

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      ctx.drawImage(img,0,0);

      

      const data = ctx.getImageData(0,0,canvas.width,canvas.height);

      const buffer = data.data;


      const rgb = [];
      const c = new THREE.Color();

      for (let i = 0; i < buffer.length; i+=4) {
        c.setRGB(buffer[i],buffer[i+1],buffer[i+2]);
        rgb.push({c: c.clone(),id: i/4});
      }

      console.log(rgb);

      const result = new Float32Array(img.width*img.height*2);
      let j = 0;

      rgb.sort( function( a, b ) {
        // console.log(a);
        
        const color1 = a.c.getHSL(temp1);
        const color2 = b.c.getHSL(temp2);

        // console.log(color1 === temp1);

        // console.log( temp1.s - temp2.s );
        // console.log(a.c.getHSL(obj1).s - b.c.getHSL(obj1).s);
        // return a.c.getHSL(obj1).s - b.c.getHSL(obj2).s;
        // console.log(a.c.getHSL().s - b.c.getHSL().s);
        return color1.s - color2.s;
        // return 0;
        // return a.c.getHSL().s - b.c.getHSL().s;
      });

      // rgb.sort( function( a, b ) {
      //   return a.c.getHSL().s - b.c.getHSL().s;
      // });

      rgb.forEach(e => {
        result[j] = e.id % img.width;
        result[j+1] = Math.floor(e.id / img.height);
        j+=2;
      });

      console.log(result,'result');

      obj[index].image = img;
      obj[index].texture = new THREE.Texture(img);
      obj[index].buffer = result;
      obj[index].texture.needsUpdate = true;
      obj[index].texture.flipY = false;
    });
    

    console.log(obj);


    const w = loadedImages[0].width;
    const h = loadedImages[0].height;

    const positions = new Float32Array(w*h*3);
    let index = 0;
    for (let i = 0; i < w; i+=1) {
      for (let j = 0; j < h; j+=1) {
        positions[index*3] = j;
        positions[index*3+1] = i;
        positions[index*3+2] = 0;
        index+=1;
      }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));

    geometry.setAttribute('source',new THREE.BufferAttribute(obj[0].buffer,2));
    geometry.setAttribute('target',new THREE.BufferAttribute(obj[1].buffer,2));

    material = new THREE.RawShaderMaterial( {
      uniforms: {
        sourceTex: { type: 't', value: obj[0].texture },
        targetTex: { type: 't', value: obj[1].texture },
        blend: { type: 'f', value: 0 },
        size: { type: 'f', value: 2.1 },// window.devicePixelRatio },
        dimensions: { type: 'v2', value: new THREE.Vector2(w,h) }
      },
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    });

    const points = new THREE.Points(geometry,material);
    scene.add(points);



    const tl = new TimelineMax({paused:true});
    console.log(material);
    tl
      .to(material.uniforms.blend,3,{value:1},0);
    $('body').on('click',() => {
      
      if($('body').hasClass('done')) {
        tl.reverse();
        $('body').removeClass('done');
      } else{
        tl.play();
        $('body').addClass('done');
      }
    });

  });

  			

  resize();
    

 
}




let time = 0;
function animate() {
  time+=1;
  
  requestAnimationFrame(animate);
  render();
}



init();
animate();