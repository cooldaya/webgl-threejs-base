<template>
  <div class="demo9">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";

import * as THREE from "three";
import getTextureImg from "@/assets/textures/cube6p/getImg.js";
import getModelUrl from "@/assets/models/getModelUrl.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    showGUI: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    camera.position.set(4, 6, 6);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.name = "cube";
    // 创建动画
    const posKF = new THREE.KeyframeTrack(
      "cube.position", // 这里不能乱写，需要和物体的名字对应
      [0, 5],
      [0, 0, 0, 5, 5, 5]
    );
    const colorKF = new THREE.KeyframeTrack(
      "cube.material.color",
      [2, 5],
      [1, 0, 0, 0, 0, 1]
    );
    const clip = new THREE.AnimationClip("test", 5, [posKF, colorKF]);

    const mixer = new THREE.AnimationMixer(cube);

    const clipAction = mixer.clipAction(clip);

    clipAction.play();
    //不循环播放
    clipAction.loop = THREE.LoopOnce;
    // 物体状态停留在动画结束的时候
    clipAction.clampWhenFinished = true;

    const clock = new THREE.Clock();
    threeTool.callOn("renderUpdate", () => {
      const frameT = clock.getDelta();
      // 更新播放器相关的时间
      mixer.update(frameT);
    });
    threeTool._gui.add(clipAction, "timeScale", 0, 6);
    threeTool._gui.add(clipAction, 'time', 0, 6).step(0.1);


    setTimeout(() => {
      clipAction.paused = true;
      clipAction.time = 1;//物体状态为动画3秒对应状态
    }, 4000);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo9 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
<style lang="less">
.demo9 {
}
</style>
