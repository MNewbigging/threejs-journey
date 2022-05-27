import { action, makeObservable, observable } from 'mobx';
import { DialogState } from '../dialog/DialogState';

export enum DrawerStage {
  OPEN = 'open',
  CLOSED = 'closed',
}

export class DrawerState {
  public stage = DrawerStage.OPEN;
  public showInfo = false;
  public dialogState = new DialogState();

  constructor() {
    makeObservable(this, {
      stage: observable,
      toggleDrawer: action,
      showInfo: observable,
      toggleSceneInfo: action,
    });
  }

  public getToggleText() {
    return this.stage === DrawerStage.OPEN ? '<' : '>';
  }

  public toggleDrawer = () => {
    this.stage = this.stage === DrawerStage.OPEN ? DrawerStage.CLOSED : DrawerStage.OPEN;
  };

  public toggleSceneInfo = () => {
    this.showInfo = !this.showInfo;
  };
}
