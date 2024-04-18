<template>
  <div class="demo7">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip-wrap">
      <p>
        <span>plane</span> 信息框
        样式难调，可以随场景缩放，不跟随视角，可其他物体遮挡
      </p>
      <p>
        <span>sprite</span> 信息框
        样式难调，可以随场景缩放，跟随视角，可被其他物体遮挡
      </p>
      <p>
        <span>css2D</span> 信息框
        样式好调，不可随场景缩放，跟随视角，不可其他物体遮挡
      </p>
      <p>
        <span>css3D</span> 信息框
        样式好调，可以随场景缩放，不跟随视角，不可其他物体遮挡
      </p>
      <p>
        <span>css3DSprite</span> 信息框
        样式好调，可以随场景缩放，跟随视角，不可其他物体遮挡
      </p>
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";

import * as THREE from "three";
import getTextureImg from "@/assets/textures/cube6p/getImg.js";

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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
      {
        material: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        position: [-2, 0.5, 0],
        effect: (position, mesh) => {
          // sprite 信息框

          // 创建一个用于渲染文本的画布
          const canvas = document.createElement("canvas");
          canvas.width = 2000; // 设置画布宽度
          canvas.height = 1024; // 设置画布高度
          const context = canvas.getContext("2d");
          context.font = "Bold 100px Arial";
          context.strokeStyle = "red";
          context.lineWidth = 6;
          context.strokeText(
            `sprite信息框\n mesh坐标：${position[0].toFixed(
              2
            )},${position[1].toFixed(2)},${position[2].toFixed(2)}`,
            0,
            500
          );

          // 创建一个纹理
          const texture = new THREE.CanvasTexture(canvas);

          // 创建Sprite
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.position.set(0, 1.2, 0); // 设置 Sprite 的位置
          sprite.scale.set(2, 2, 2); // 设置 Sprite 的缩放
          mesh.userData.msgType = "sprite"; // 标记为 sprite 对象
          return sprite;
        },
      },
      {
        material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        position: [1, 0.5, 2],
        effect: (position) => {
          // 自定义信息框 CSS2D
          const css2DObj = threeTool.utils.addCSS2DObject((div) => {
            div.innerHTML = `CSS2D信息框\n mesh坐标：${position[0].toFixed(
              2
            )},${position[1].toFixed(2)},${position[2].toFixed(2)}`;
            div.classList.add("custom-css2d-label");
          });
          css2DObj.position.set(...position);
        },
      },
      {
        material: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
        position: [2, 0.5, 0],
        effect: (position) => {
          // 自定义信息框 CSS3D
          const css3DObj = threeTool.utils.addCSS3DObject((div) => {
            div.innerHTML = `CSS3D信息框\n mesh坐标：${position[0].toFixed(
              2
            )},${position[1].toFixed(2)},${position[2].toFixed(2)}`;
            div.classList.add("custom-css3d-label");
          });
          css3DObj.position.set(...position);
          css3DObj.scale.set(0.02, 0.02, 0.02); //缩放标签尺寸
        },
      },
      {
        material: new THREE.MeshBasicMaterial({ color: 0x00ffff }),
        position: [1, 0.5, -2],
        effect: (position) => {
          // 自定义信息框 CSS3D
          const css3DSprite = threeTool.utils.addCSS3DSprite((div) => {
            div.innerHTML = `CSS3DSprite信息框\n mesh坐标：${position[0].toFixed(
              2
            )},${position[1].toFixed(2)},${position[2].toFixed(2)}`;
            div.classList.add("custom-css3d-sprite-label");
          });
          css3DSprite.position.set(...position);
          css3DSprite.scale.set(0.02, 0.02, 0.02); //缩放标签尺寸
        },
      },
      {
        material: new THREE.MeshBasicMaterial({ color: "pink" }),
        position: [-2, 0.5, -2],
        effect: (position, mesh) => {
          // 自定义信息框 Plane
          // 创建文本信息
          const text = "Plane 信息框";

          // 创建纹理对象
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          context.font = "Bold 32px Arial";
          context.fillStyle = "white";
          context.fillText(text, 10, 80);

          // 创建纹理
          const texture = new THREE.CanvasTexture(canvas);

          // 创建平面的几何体
          const planeGeometry = new THREE.PlaneGeometry(2, 1); // 定义平面的宽度和高度

          // 创建材质，使用Basic材质
          const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
          });

          // 创建平面对象
          const plane = new THREE.Mesh(planeGeometry, planeMaterial);
          mesh.userData.msgType = "plane"; // 标记为平面对象

          // 设置平面对象的位置
          plane.position.set(0, 2, 0);

          // 将平面对象添加到场景中
          return plane;
        },
      },
    ];
    materials.forEach(({ material, position, effect }) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      const msgbox = effect?.(position, mesh);
      if (msgbox instanceof THREE.Object3D) {
        mesh.add(msgbox);
      }
      scene.add(mesh);
    });

    camera.position.set(4, 6, 6);
  });
  const params = {
    plane: {
      val: true,
      call: (val) => {
        const msgBox = threeTool._scene.children.find(
          (mesh) => mesh.userData.msgType === "plane"
        ).children[0];
        msgBox.visible = val;
      },
    },
    sprite: {
      val: true,
      call: (val) => {
        const msgBox = threeTool._scene.children.find(
          (mesh) => mesh.userData.msgType === "sprite"
        ).children[0];
        msgBox.visible = val;
      },
    },
    css2D: {
      val: true,
      call: (val) => {
        threeTool._css2DObjectDefaultGroup.children.forEach(
          (obj) => (obj.visible = val)
        );
      },
    },
    css3D: {
      val: true,
      call: (val) => {
        threeTool._css3DObjectDefaultGroup.children.forEach(
          (obj) => (obj.visible = val)
        );
      },
    },
    css3DSprite: {
      val: true,
      call: (val) => {
        threeTool._css3DSpriteDefaultGroup.children.forEach(
          (obj) => (obj.visible = val)
        );
      },
    },
  };

  const folder = threeTool._gui.addFolder("信息框");
  for (const type in params) {
    folder
      .add(params[type], "val")
      .name(type)
      .onChange(() => params[type]["call"](params[type]["val"]));
  }
  folder.open();
  // threeTool.eventOn('hover',(event)=>{},[mesh1,mesh2])
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo7 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
<style lang="less">
.demo7 {
  .custom-css2d-label {
    background-color: red;
    color: white;
    padding: 4px 10px;
  }
  .custom-css3d-label {
    background-color: blue;
    color: white;
    padding: 4px 10px;
  }
  .custom-css3d-sprite-label {
    background-color: pink;
    color: white;
    padding: 4px 10px;
  }

  position: relative;
  .tip-wrap {
    position: absolute;
    bottom: 0;
    right: -20px;
    transform: translateX(100%);
    background-color: pink;
    max-width: 200px;
    padding: 10px;
    span {
      color: red;
    }
  }
}
</style>
