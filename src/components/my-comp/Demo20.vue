<template>
  <div class="demo20">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">使用了 ammo 物理引擎，可以模拟物理效果，使用threejs封装的类AmmoPhysics ，需要提前引入ammo.js文件</div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";
import { AmmoPhysics } from "three/addons/physics/AmmoPhysics.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.1, 20),
      // new THREE.ShadowMaterial({color:'red'})
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    floor.position.set(0, -0.1, 0);
    scene.add(floor);

    const floor2 = new THREE.Mesh(
      new THREE.BoxGeometry(500, 0.1, 500),
      // new THREE.ShadowMaterial({color:'red'})
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    floor2.position.set(0, -1, 0);
    scene.add(floor2);

    const distance = 6;
    const count = 200;
    const len = 0.2;
    const geometry = new THREE.BoxGeometry(len, len, len);
    const material = new THREE.MeshLambertMaterial();

    const boxes = new THREE.InstancedMesh(geometry, material, count);
    const spheres = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(len, 3),
      new THREE.MeshLambertMaterial({ color: 0xff0000 }),
      count
    );

    const instancedMeshes = [boxes, spheres];
    instancedMeshes.forEach((instancedMesh) => {
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color();
      for (let i = 0; i < instancedMesh.count; i++) {
        matrix.setPosition(
          distance * Math.random() - distance / 2,
          (Math.random() * distance) / 2,
          distance * Math.random() - distance / 2
        );
        instancedMesh.setMatrixAt(i, matrix);
        instancedMesh.setColorAt(i, color.setHex(Math.random() * 0xffffff));
      }
      scene.add(instancedMesh);
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 200, 200);
    const lightHelper = new THREE.DirectionalLightHelper(light, 1, "red");

    scene.add(lightHelper);
    scene.add(light);

    const light2 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light2);

    const setShadow = () => {
      renderer.shadowMap.enabled = true;
      light.castShadow = true;
      instancedMeshes.forEach((instancedMesh) => {
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;
      });

      floor.castShadow = true;
      floor.receiveShadow = true;

      floor2.castShadow = true;
      floor2.receiveShadow = true;
    };

    let physics = null;
    const enablePhysics = async () => {
      physics = await AmmoPhysics();
      physics.addScene(scene);
      physics.addMesh(floor);
      physics.addMesh(floor2);
      instancedMeshes.forEach((instancedMesh) => {
        physics.addMesh(instancedMesh, 1);
      });
      // console.log(physics);
    };

    enablePhysics();

    setShadow();

    const position = new THREE.Vector3();
    const resetMeshPosition = () => {
      if (physics) {
        instancedMeshes.forEach((instancedMesh) => {
          let index = Math.floor(Math.random() * boxes.count);
          position.set(
            Math.random() * 10 - 5,
            5 + Math.random() * 5,
            Math.random() * 10 - 5
          ); // 设置随机位置
          physics.setMeshPosition(instancedMesh, position, index); // 设置盒子位置
        });
      }
    };

    setInterval(() => {
      resetMeshPosition();
    }, 100);
    camera.position.set(8, 2, 0);

    renderer.outputEncoding = THREE.sRGBEncoding;
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo20 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
