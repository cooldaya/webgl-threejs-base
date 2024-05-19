<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import getModelUrl from "@/assets/models/getModelUrl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
    showGUI: true,
  });

  const addModel = (scene) => {
    const loader = new GLTFLoader();

    const actionMap = new Map();
    let mixer = null;
    const activeActionObject = {
      pre_state: "",
      state: "",
      single_states: ["Yes","Death"],
      morphTargetInfluences: null,
      morphTargetDictionary:null
    };

    const setGUI = () => {
      const GUI = threeTool._gui;
      const folder1 = GUI.addFolder("动作");

      folder1
        .add(activeActionObject, "state")
        .options([...actionMap.keys()])
        .onChange((state) => {
          // 停止上一个动作
          mixer.stopAllAction();
          // 再播放新动作
          const action = actionMap.get(state);
          if (activeActionObject.single_states.includes(state)) {
            // 单次动作
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
          }
          action.play();
          activeActionObject.pre_state = state;
        });

      const folder2 = GUI.addFolder("心情");
      console.log('morphTargetDictionary-->',activeActionObject.morphTargetDictionary)
      for (const key in activeActionObject.morphTargetDictionary) {
        folder2.add(activeActionObject.morphTargetInfluences, activeActionObject.morphTargetDictionary[key], 0, 1).name(key).step(0.01)
      }
    };

    const addModelCallback = (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      mixer = new THREE.AnimationMixer(model);

      // 动画
      gltf.animations.forEach((clip) => {
        const clipAction = mixer.clipAction(clip);
        actionMap.set(clip.name, clipAction);
      });

      const face = model.getObjectByName("Head_4");
      activeActionObject.morphTargetInfluences = face.morphTargetInfluences;
      activeActionObject.morphTargetDictionary = face.morphTargetDictionary;

      setGUI();

      const clock = new THREE.Clock();
      threeTool.callOn("renderUpdate", () => {
        mixer.update(clock.getDelta());
      });
    };
    loader.load(getModelUrl("RobotExpressive.glb"), addModelCallback);
  };

  const addLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
  };

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    addLight(scene);
    addModel(scene);
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
