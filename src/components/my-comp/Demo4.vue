<template>
  <div class="demo4">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="gui-wrap"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool";
import { setupCanvas } from "@/utils/canvas";
import { onMounted, ref } from "vue";
import { PointLightHelper } from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import * as THREE from "three";
import { ElMessage } from "element-plus";
const props = defineProps({});

const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;

  const params = {
    light: "PointLight",
    lightObj: null,
    lightHelper: null,
  };
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: false,
    showGUI: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    renderer.shadowMap.enabled = true; // 开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用更好的阴影算法

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
    planeMesh.receiveShadow = true; // 开启接收阴影
    scene.add(planeMesh);

    // 添加meshes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });
    const defaultColor = new THREE.Color("#9b59b6");
    const mesheInfos = [
      {
        position: [-1, 0.5, 0],
      },
      {
        position: [3, 0.5, 2],
      },
    ];
    const meshes = new THREE.InstancedMesh(
      geometry,
      material,
      mesheInfos.length
    );
    // 设置位置
    mesheInfos.forEach((info, index) => {
      meshes.setMatrixAt(
        index,
        new THREE.Matrix4().makeTranslation(...info.position)
      );
      meshes.setColorAt(index, defaultColor);
    });
    scene.add(meshes);
    meshes.castShadow = true;
    meshes.receiveShadow = true;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    camera.position.set(-5, 5, 0);
  });

  const gui = threeTool.gui;
  var folder = gui.addFolder("Flow Field");
  const lightOperationMap = new Map([
    [
      "DirectionalLight",
      (threeTool, THREE) => {
        const { scene } = threeTool;
        // 平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(0, 2, 2);

        directionalLight.castShadow = true; // 灯光将投射阴影
        scene.add(directionalLight);
        const directionalLightHelper = new THREE.DirectionalLightHelper(
          directionalLight,
          1
        );
        scene.add(directionalLightHelper);
        params.lightObj = directionalLight;
        params.lightHelper = directionalLightHelper;
      },
    ],
    [
      "PointLight",
      (threeTool, THREE) => {
        const { scene } = threeTool;

        // 点光源
        const pointLight = new THREE.PointLight(0xffffff, 30, 100, 2);
        pointLight.position.set(0, 2, 1);
        pointLight.castShadow = true; // 灯光将投射阴影

        scene.add(pointLight);
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
        scene.add(pointLightHelper);
        params.lightObj = pointLight;
        params.lightHelper = pointLightHelper;
      },
    ],
    [
      "SpotLight",
      (threeTool, THREE) => {
        // 聚光灯
        const { scene, camera } = threeTool;
        const spotLight = new THREE.SpotLight(
          0xffffff,
          160,
          10,
          Math.PI / 3,
          1
        );
        spotLight.position.set(0, 4, 5);

        spotLight.castShadow = true; // 灯光将投射阴影
        scene.add(spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
        params.lightObj = spotLight;
        params.lightHelper = spotLightHelper;
      },
    ],
    [
      "RectAreaLight",
      (threeTool, THREE) => {
        const { scene } = threeTool;
        const rectAreaLight = new THREE.RectAreaLight(0xffffff, 10, 10, 10);
        rectAreaLight.position.set(0, 2, 1);
        rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
        rectAreaLight.intensity = 100;
        rectAreaLight.width = 8;
        rectAreaLight.height = 4;
        rectAreaLight.castShadow = true; // 灯光将投射阴影
        scene.add(rectAreaLight);
        const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
        scene.add(rectAreaLightHelper);

        params.lightObj = rectAreaLight;
        params.lightHelper = rectAreaLightHelper;
        ElMessage({
          showClose: true,
          message: "平面光光源 不支持阴影",
          type: "warning",
        });
      },
    ],
  ]);
  folder
    .add(params, "light", [...lightOperationMap.keys()])
    .onChange((lightType) => {
      const { scene } = threeTool;
      if (params.lightObj)
        scene.remove(params.lightObj),
          (params.castShadow = false),
          params.lightObj.dispose();
      if (params.lightHelper)
        scene.remove(params.lightHelper), params.lightHelper.dispose();
      lightOperationMap.get(lightType)?.(threeTool, THREE);
    });
  lightOperationMap.get(params.light)?.(threeTool, THREE);

  folder.open();
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo4 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
