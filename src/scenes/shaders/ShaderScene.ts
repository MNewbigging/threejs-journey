import * as THREE from 'three';
import { BufferAttribute, Camera, MeshBasicMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BaseScene } from '../BaseScene';
import vertexShader from './simple/vertex.glsl';
import fragmentShader from './simple/fragment.glsl';

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

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvasListener.width / this.canvasListener.height,
      0.1,
      1000
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 2;
    this._camera = camera;
    this.controls = new OrbitControls(this.camera, this.canvasListener.canvas);
    this.controls.enableDamping = true;

    // Objects
    const planeGeom = new THREE.PlaneBufferGeometry(3, 1, 100, 100);

    // Pass random values as new geom attr
    const vertices = planeGeom.attributes.position.count;
    const randoms = new Float32Array(vertices);
    for (let i = 0; i < vertices; i++) {
      randoms[i] = Math.random();
    }
    planeGeom.setAttribute('aRandom', new BufferAttribute(randoms, 1));

    const planeMat = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5.0) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
      },
    });

    const mesh = new THREE.Mesh(planeGeom, planeMat);
    this.meshes.push(mesh);
    this.scene.add(mesh);

    this.planeMat = planeMat;
  }

  public updateScene(deltaTime: number): void {
    this.controls.update();

    this.planeMat.uniforms.uTime.value += deltaTime;
  }

  public destroyScene(): void {
    this.meshes.forEach((m) => {
      m.geometry.dispose();
      (m.material as MeshBasicMaterial).dispose();
    });
  }

  private getShaderMaterial() {
    return new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }
}
