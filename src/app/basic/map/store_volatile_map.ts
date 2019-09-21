import { Matrix, Point } from "@/@types/address";

export type VolatileMapMoveInfo = {
  from: Point;
  total: Point;
  dragging: Point;
};

export type VolatileMapAngleInfo = {
  dragging: number;
  dragStart: number;
};

export type State = {
  grid: Matrix;
  mouse: {
    onScreen: Point;
    onTable: Point;
    onCanvas: Point;
  };
  isDraggingLeft: boolean;
  isMouseDownRight: boolean;
  isDraggingRight: boolean;
  isOverEvent: boolean;
  isMoving: boolean;
  isWheeling: boolean;
  moveObj: string;
  isRolling: boolean;
  rollObj: string;
  move: VolatileMapMoveInfo;
  angle: VolatileMapAngleInfo;
};

const state: State = {
  grid: { column: 0, row: 0 },
  mouse: {
    onScreen: { x: 0, y: 0 },
    onTable: { x: 0, y: 0 },
    onCanvas: { x: 0, y: 0 }
  },
  isDraggingLeft: false,
  isMouseDownRight: false,
  isDraggingRight: false,
  isOverEvent: false,
  isMoving: false,
  isWheeling: false,
  moveObj: "",
  isRolling: false,
  rollObj: "",
  move: {
    from: { x: 0, y: 0 },
    total: { x: 0, y: 0 },
    dragging: { x: 0, y: 0 }
  },
  angle: {
    dragging: 0,
    dragStart: 0
  }
};

export default {
  state,
  mutations: {
    setMapAngleDragging: (state: State, value: number) => {
      state.angle.dragging = value;
    },
    setMapAngleDragStart: (state: State, value: number) => {
      state.angle.dragStart = value;
    },
    setIsMapMouseDownRight: (state: State, value: boolean) => {
      state.isMouseDownRight = value;
    },
    setIsMapDraggingLeft: (state: State, value: boolean) => {
      state.isDraggingLeft = value;
    },
    setIsMapDraggingRight: (state: State, value: boolean) => {
      state.isDraggingRight = value;
    },
    setMapMoveFromLocate: (state: State, value: Point) => {
      state.move.from.x = value.x;
      state.move.from.y = value.y;
    },
    setMapMoveTotalLocate: (state: State, value: Point) => {
      state.move.total.x = value.x;
      state.move.total.y = value.y;
    },
    setMapMoveDraggingLocate: (state: State, value: Point) => {
      state.move.dragging.x = value.x;
      state.move.dragging.y = value.y;
    },
    setMouseLocateSet: (
      state: State,
      {
        locateOnScreen,
        locateOnCanvas,
        locateOnTable,
        grid
      }: {
        locateOnScreen: Point;
        locateOnCanvas: Point;
        locateOnTable: Point;
        grid: Matrix;
      }
    ) => {
      state.mouse.onScreen.x = locateOnScreen.x;
      state.mouse.onScreen.y = locateOnScreen.y;
      state.mouse.onCanvas.x = locateOnCanvas.x;
      state.mouse.onCanvas.y = locateOnCanvas.y;
      state.mouse.onTable.x = locateOnTable.x;
      state.mouse.onTable.y = locateOnTable.y;
      state.grid = grid;
    },
    setMouseOnScreenLocate: (state: State, value: Point) => {
      state.mouse.onScreen.x = value.x;
      state.mouse.onScreen.y = value.y;
    },
    setMouseOnCanvasLocate: (state: State, value: Point) => {
      state.mouse.onCanvas.x = value.x;
      state.mouse.onCanvas.y = value.y;
    },
    setMouseOnTableLocate: (state: State, value: Point) => {
      state.mouse.onTable.x = value.x;
      state.mouse.onTable.y = value.y;
    },
    setIsMapRolling: (state: State, value: boolean) => {
      state.isRolling = value;
    },
    setIsMapOverEvent: (state: State, value: boolean) => {
      state.isOverEvent = value;
    },
    setMapRollObj: (state: State, value: string) => {
      state.rollObj = value;
    },
    setIsMapMoving: (state: State, value: boolean) => {
      state.isMoving = value;
    },
    setMapMoveObj: (state: State, value: string) => {
      state.moveObj = value;
    },
    setMapGrid: (state: State, value: Matrix) => {
      state.grid = value;
    },
    setIsWheeling: (state: State, value: boolean) => {
      state.isWheeling = value;
    }
  },
  getters: {
    mapAngleVolatile: (state: State): any => state.angle,
    isMapMouseDownRight: (state: State): boolean => state.isMouseDownRight,
    isMapDraggingLeft: (state: State): boolean => state.isDraggingLeft,
    isMapDraggingRight: (state: State): boolean => state.isDraggingRight,
    isMapRolling: (state: State): boolean => state.isRolling,
    mapRollObj: (state: State): string => state.rollObj,
    isMapMoving: (state: State): boolean => state.isMoving,
    isMapOverEvent: (state: State): boolean => state.isOverEvent,
    mapMoveObj: (state: State): string => state.moveObj,
    mapMoveFromLocate: (state: State): Point => state.move.from,
    mapMoveTotalLocate: (state: State): Point => state.move.total,
    mapMoveDraggingLocate: (state: State): Point => state.move.dragging,
    mouseOnScreenLocate: (state: State): Point => state.mouse.onScreen,
    mouseOnCanvasLocate: (state: State): Point => state.mouse.onCanvas,
    mouseOnTableLocate: (state: State): Point => state.mouse.onTable,
    mapGrid: (state: State): Matrix => state.grid,
    isMapWheeling: (state: State): boolean => state.isWheeling
  }
};