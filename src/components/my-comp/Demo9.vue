<template>
  <div class="demo9">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="controls">
      <button id="playBtn">播放</button>
    </div>
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

    clipAction.loop = THREE.LoopOnce;

    clipAction.play();
    clipAction.paused = true; //暂停状态
    //不循环播放

    const clock = new THREE.Clock();
    threeTool.callOn("renderUpdate", () => {
      const frameT = clock.getDelta();
      // 更新播放器相关的时间
      mixer.update(frameT);
    });

    const bu = document.getElementById("playBtn");
    bu.addEventListener("click", function () {
      // AnimationAction.paused默认值false，设置为true，可以临时暂停动画
      if (clipAction.paused) {
        //暂停状态
        clipAction.paused = false; //切换为播放状态
        bu.innerHTML = "暂停"; // 如果改变为播放状态，按钮文字设置为“暂停”
      } else {
        //播放状态
        clipAction.paused = true; //切换为暂停状态
        bu.innerHTML = "播放"; // 如果改变为暂停状态，按钮文字设置为“播放”
      }
    });

    // 动画播放完成事件
    mixer.addEventListener("finished", function () {
      bu.innerHTML = "播放"; //播放完成，按钮显示为“播放”
      clipAction.reset(); //重新开始新的动画播放
      clipAction.paused = true; //切换为暂停状态
    });
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo9 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .controls{
    position: absolute;
    left: 10px;
    bottom: 10px;
    button{
      background-color: aquamarine;

      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      color: white;

      font-size: 16px;
    }
  }
}
</style>
<style lang="less">
.demo9 {
}
</style>
