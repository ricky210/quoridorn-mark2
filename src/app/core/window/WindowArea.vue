<template>
  <div id="window-area">
    <window-frame
      v-for="windowInfo in windowInfoList"
      :key="windowInfo.key"
      v-show="
        windowInfo.status === 'window' || windowInfo.status.endsWith('-window')
      "
      :windowInfo="windowInfo"
      status="window"
    />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import TaskProcessor from "../task/TaskProcessor";
import { Task, TaskResult } from "task";
import WindowFrame from "./WindowFrame.vue";
import WindowManager from "./WindowManager";
import {
  calcWindowPosition,
  getWindowSize
} from "../utility/CoordinateUtility";
import { getCssPxNum } from "../css/Css";
import { WindowInfo } from "@/@types/window";
import ComponentVue from "@/app/core/window/ComponentVue";
import { Mixins } from "vue-mixin-decorator";

@Component({
  components: { WindowFrame }
})
export default class WindowArea extends Mixins<ComponentVue>(ComponentVue) {
  private windowInfoList: WindowInfo<unknown>[] =
    WindowManager.instance.windowInfoList;

  public key = "window-area";

  @TaskProcessor("window-close-closing")
  private async windowCloseClosing(
    task: Task<string, never>
  ): Promise<TaskResult<never> | void> {
    const index = this.getWindowInfoIndex(task.value);
    this.windowInfoList.splice(index, 1);
  }

  @TaskProcessor("window-close-finished")
  private async windowCloseFinished(
    task: Task<string, never>
  ): Promise<TaskResult<never> | void> {
    this.arrangeOrder();
    this.arrangeMinimizeIndex();

    let maxOrder: number = -1;
    const normalList: WindowInfo<any>[] = this.windowInfoList.filter(
      info => !info.isMinimized
    );
    normalList.forEach(info => {
      if (info.order > maxOrder) maxOrder = info.order;
    });
    const newActiveWindowInfo = normalList.find(n => n.order === maxOrder);
    if (newActiveWindowInfo) {
      WindowManager.instance.activeWindowKey = newActiveWindowInfo.key;
    }
    task.resolve();
  }

  @TaskProcessor("window-minimize-finished")
  private async minimizeWindow(
    task: Task<string, never>
  ): Promise<TaskResult<never> | void> {
    const index = this.getWindowInfoIndex(task.value);
    const windowInfo = this.windowInfoList[index];

    const minimize = () => {
      windowInfo.isMinimized = true;
      windowInfo.isMinimizeAnimationEnd = false;
      window.setTimeout(() => {
        windowInfo.isMinimizeAnimationEnd = true;
      }, 200);

      this.arrangeMinimizeIndex();
    };

    if (windowInfo.status === "window") {
      minimize();
    } else {
      windowInfo.status = "window";
      setTimeout(minimize);
    }

    task.resolve();
  }

  @TaskProcessor("window-normalize-finished")
  private async normalizeWindow(
    task: Task<string, never>
  ): Promise<TaskResult<never> | void> {
    const index = this.getWindowInfoIndex(task.value);
    const windowInfo = this.windowInfoList[index];
    windowInfo.isMinimized = false;
    windowInfo.isMinimizeAnimationEnd = false;

    // 現在のサイズのまま、初期配置場所に設置しなおす
    const size = getWindowSize(
      windowInfo,
      document.getElementById(windowInfo.key)!
    );
    const point = calcWindowPosition(
      windowInfo.declare.position,
      size,
      getCssPxNum("--menu-bar-height")
    );
    windowInfo.x = point.x;
    windowInfo.y = point.y;

    this.arrangeMinimizeIndex();

    task.resolve();
  }

  @TaskProcessor("window-active-finished")
  private async activeWindow(
    task: Task<string, never>
  ): Promise<TaskResult<never> | void> {
    const index = this.getWindowInfoIndex(task.value);
    const windowInfo = this.windowInfoList[index];
    windowInfo.order = this.windowInfoList.length;

    WindowManager.instance.activeWindowKey = task.value!;

    this.arrangeOrder();
    WindowManager.instance.arrangePoint(windowInfo.key);

    task.resolve();
  }

  private arrangeOrder() {
    this.windowInfoList
      .concat()
      .sort((w1, w2) => {
        if (w1.order < w2.order) return -1;
        if (w1.order > w2.order) return 1;
        return 0;
      })
      .forEach((info, i) => {
        info.order = i + (info.isMinimized ? 1000 : 0);
      });
  }

  private arrangeMinimizeIndex() {
    this.windowInfoList
      .filter(info => info.isMinimized)
      .sort((w1, w2) => {
        if (w1.order < w2.order) return -1;
        if (w1.order > w2.order) return 1;
        return 0;
      })
      .forEach((info, i, list) => {
        info.minimizeIndex = list.length - i - 1;
      });

    document.documentElement.style.setProperty(
      "--windowMinimizeLength",
      this.windowInfoList.filter(info => info.isMinimized).length.toString()
    );
  }

  private getWindowInfoIndex(windowKey: string | null): number {
    if (!windowKey) return -1;
    return this.windowInfoList.findIndex(info => info.key === windowKey);
  }
}
</script>
