<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import getModelUrl from "@/assets/models/getModelUrl";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
// SMAA抗锯齿通道
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    usePostprocessing: true,
  });

  const setLight = (scene) => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 20, 0);
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
  };

  const setTree = (scene) => {
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -0.04;
    plane.receiveShadow = true;
    scene.add(plane);

    const loader = new OBJLoader();
    loader.load(getModelUrl("tree.obj"), (obj) => {
      obj.scale.multiplyScalar(5);
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      scene.add(obj);
      console.log(obj);
    });

    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshLambertMaterial();
      material.color.setHSL(Math.random(), 1.0, 0.3);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 4 - 2;
      mesh.position.y = Math.random() * 4 - 2;
      mesh.position.z = Math.random() * 4 - 2;
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      group.add(mesh);
    }
    group.position.y = 2;
    scene.add(group);
    console.log(group);
  };

  const setOutline = (scene) => {
    const { canvas, camera, renderer } = threeTool.getInfo();
    const outlinePass = new OutlinePass(
      new THREE.Vector2(canvas.width, canvas.height),
      scene,
      camera
    );
    //模型描边颜色，默认白色
    outlinePass.visibleEdgeColor.set(0xffff00);
    //高亮发光描边厚度
    outlinePass.edgeThickness = 4;
    //高亮描边发光强度
    outlinePass.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 2;

    threeTool.addPass(outlinePass);



    // 颜色空间校正
    const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
    threeTool.addPass(gammaCorrectionShader);
    return outlinePass;
  };

  threeTool._renderer.shadowMap.enabled = true;
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    setLight(scene);
    setTree(scene);
    const outlinePass = setOutline(scene);
    threeTool.eventOn("click", (args) => {
      const { curObj } = args;
      if (curObj && curObj.object.geometry instanceof THREE.SphereGeometry) {
        outlinePass.selectedObjects = [curObj.object];
      }
    });
    console.log(threeTool);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo21 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
  }
}
</style>
