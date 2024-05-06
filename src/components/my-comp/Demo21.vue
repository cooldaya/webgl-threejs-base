<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      1.GLTFLoader 加载模型<br>
      2.DRACOLoader 加载压缩模型<br>
      3.RoomEnvironment 加载环境<br>
      4.AnimationMixer 动画混合<br>
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import getModelUrl from "@/assets/models/getModelUrl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/assets/3d/js/gltf/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const modelUrl = getModelUrl("LittlestTokyo.glb");

    const setupEnv = () => {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
    };
    setupEnv();

    const clock = new THREE.Clock();
    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 1, 0);
      model.scale.set(0.01, 0.01, 0.01);
      scene.add(model);
      const mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();

      const box = threeTool.utils.autoFitCameraToModel(model);
      model.position.y = (box.max.y - box.min.y) /2;

      threeTool.callOn("renderUpdate", () => {
        const delta = clock.getDelta();

        mixer.update(delta);
      });
    });
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
  .tip{
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
