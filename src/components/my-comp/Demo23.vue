<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      1.pdb 文件加载 数据分析<br />
      2.根据数据展示模型 <br />
      3.根据数据添加原子label<br />
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import { getPdb } from "@/assets/pdbs/getPdb";
import { PDBLoader } from "three/addons/loaders/PDBLoader.js";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    scene.background = new THREE.Color(0x000000);
    const url = getPdb("caffeine");
    console.log({ url });

    const setupPdb = () => {
      const loader = new PDBLoader();
      loader.load(url, (pdb) => {
        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;
        const atoms = pdb.json.atoms;

        {
          // 原子
          const positions = geometryAtoms.attributes.position;
          const colors = geometryAtoms.attributes.color;
          const count = positions.count;
          const position = new THREE.Vector3();
          const color = new THREE.Color();
          for (let i = 0; i < count; i++) {
            position.set(
              positions.getX(i),
              positions.getY(i),
              positions.getZ(i)
            );
            color.setRGB(colors.getX(i), colors.getY(i), colors.getZ(i));

            const mesh = new THREE.Mesh(
              new THREE.IcosahedronGeometry(0.2, 3),
              new THREE.MeshPhongMaterial({ color: color, shininess: 50 })
            );
            mesh.position.copy(position);
            const css2d = threeTool.utils.addCSS2DObject((div) => {
              const text = atoms[i][4];
              div.innerText = text;
              div.style.color = color.getStyle();
            });
            mesh.add(css2d);
            scene.add(mesh);
          }
        }

        {
          // 线
          const positions = geometryBonds.attributes.position;
          const count = positions.count;

          const start = new THREE.Vector3();
          const end = new THREE.Vector3();
          console.log({ count });
          console.log(positions);
          for (let i = 0; i < count; i += 2) {
            // debugger;
            start.x = positions.getX(i);
            start.y = positions.getY(i);
            start.z = positions.getZ(i);

            end.x = positions.getX(i + 1);
            end.y = positions.getY(i + 1);
            end.z = positions.getZ(i + 1);
            // console.log({ start, end });
            const mesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.1, 0.1, 0.1),
              new THREE.MeshBasicMaterial({ color: 0xffffff })
            );

            // start.multiplyScalar(75);
            // end.multiplyScalar(75);

            mesh.position.copy(start);
            mesh.position.lerp(end, 0.5);
            console.log(mesh.position.distanceTo(end));
            mesh.scale.set(1, 1, mesh.position.distanceTo(end) / 0.1);
            mesh.lookAt(end);
            scene.add(mesh);
          }
        }
      });
    };
    setupPdb();
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(3, 3, 3);
    scene.add(light);
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
