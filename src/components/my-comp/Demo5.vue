<template>
  <div class="demo5">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="gui-wrap"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import fragmentShader from '@/assets/shaders/shader-basic/fragment.fs?raw';
import vertexShader from '@/assets/shaders/shader-basic/vertex.vs?raw';
const props = defineProps({});

const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;

  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: false,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const loader = new THREE.TextureLoader();
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xecf0f1,
      side: THREE.DoubleSide,
    });
    // 添加地面
    const planeSize = 20;
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize, planeSize),
      planeMaterial
    );
    loader.load("/imgs/checker.png", (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);
      planeMaterial.map = texture;
      planeMaterial.needsUpdate = true;
    });

    planeMesh.rotation.x = Math.PI * -0.5;
    planeMesh.position.y = -0.01;
    scene.add(planeMesh);

    // 添加meshes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
      {
        material: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        position: [-2, 0.5, 0],
      },
      {
        material: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
        position: [0, 0.5, 0],
      },
      {
        material: new THREE.MeshPhongMaterial({ color: 0x0000ff }),
        position: [2, 0.5, 0],
      },
      {
        material: new THREE.MeshStandardMaterial({ color: 0x00ffff }),
        position: [0, 0.5, 2],
      },
      {
        material: new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader
        }),
        position: [-2, 0.5, -2],
      }
    ];
    materials.forEach(({ material, position }) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      scene.add(mesh);
    });

    // 环境光
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      1
    );
    scene.add(directionalLightHelper);

    camera.position.set(-5, 5, 3);


    console.log(scene)
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo5 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
