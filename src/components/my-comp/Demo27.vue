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
import { getImg } from "@/assets/imgs";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });
  threeTool._camera.position.set(0, 0, 2);

  const getTexturesFromAtlasFile = (url, tilesNum) => {
    const textures = [];

    for (let i = 0; i < tilesNum; i++) {
      textures[i] = new THREE.Texture();
    }
    const loader = new THREE.ImageLoader();
    loader.load(url, (image) => {
      console.log(image.width, image.height * 8);
      let canvas, context;
      const tileWidth = image.height;
      // 裁切图片
      for (let i = 0; i < tilesNum; i++) {
        canvas = document.createElement("canvas");
        canvas.width = tileWidth;
        canvas.height = tileWidth;
        context = canvas.getContext("2d");
        context.drawImage(
          image,
          i * tileWidth,
          0,
          tileWidth,
          tileWidth,
          0,
          0,
          tileWidth,
          tileWidth
        );
        textures[i].colorSpace = THREE.SRGBColorSpace;
        textures[i].image = canvas;
        textures[i].needsUpdate = true;
      }
    });
    return textures;
  };
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const textures = getTexturesFromAtlasFile(
      getImg("sun_temple_stripe.jpg"),
      6
    );
    const materials = textures.map((texture) =>new THREE.MeshBasicMaterial({ map: texture}));
    const distance = 10000;
    const skyBox = new THREE.Mesh(
      new THREE.BoxGeometry(distance, distance, distance),
      materials
    );
    console.log(skyBox.geometry)

    skyBox.geometry.scale(1,1,-1)
    scene.add(skyBox);
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
