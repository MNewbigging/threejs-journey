import * as THREE from 'three';
import { Camera, RawShaderMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import flag from '../../assets/flag.png';
import flagFragment from './flag/fragment.glsl';
import flagVertex from './flag/vertex.glsl';
import patternFragment from './pattern/fragment.glsl';
import patternVertex from './pattern/vertex.glsl';
import seaFragment from './sea/fragment.glsl';
import seaVertex from './sea/vertex.glsl';
import { BaseScene } from '../BaseScene';

export class ShaderScene extends BaseScene {
  private _camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private meshes: THREE.Mesh[] = [];
  private planeMat: THREE.RawShaderMaterial;

  public get camera(): Camera {
    return this._camera;
  }

  public initScene(): void {
    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color('#1680AF');

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvasListener.width / this.canvasListener.height,
      0.1,
      1000
    );
    camera.position.x = 0;
    camera.position.y = 2;
    camera.position.z = 2;
    this._camera = camera;
    this.controls = new OrbitControls(this.camera, this.canvasListener.canvas);
    this.controls.enableDamping = true;

    // Objects
    const planeGeom = new THREE.PlaneBufferGeometry(2, 2, 128, 128);
    const planeMat = new THREE.ShaderMaterial({
      vertexShader: seaVertex,
      fragmentShader: seaFragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.4 },
      },
    });
    this.planeMat = planeMat;

    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI * 0.5;

    this.meshes.push(plane);
    this.scene.add(plane);
  }

  public updateScene(deltaTime: number): void {
    this.controls.update();

    this.planeMat.uniforms.uTime.value += deltaTime;
  }

  public destroyScene(): void {
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as RawShaderMaterial).dispose();
    });
  }

  private setupFlag() {
    const flagGeom = new THREE.PlaneBufferGeometry(1, 1, 128, 128);
    flagGeom.scale(1.6, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(flag);

    const planeMat = new THREE.RawShaderMaterial({
      vertexShader: flagVertex,
      fragmentShader: flagFragment,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
      },
    });

    const mesh = new THREE.Mesh(flagGeom, planeMat);
    this.meshes.push(mesh);
    this.scene.add(mesh);

    this.planeMat = planeMat;
  }
}
