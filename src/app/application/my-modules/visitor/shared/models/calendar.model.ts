export interface CalendarState {
  date: Date;   // 单选日期的时候设置
  pickTime: boolean;
  show: boolean;
  showShortcut: boolean;
  infinite: boolean;
  enterDirection: string;
  rowSize: string;
  type: string; // 单选日期的时候设置
  defaultValue?: [Date, Date];  // 不能在初始化的时候赋值，要在show之后赋值进去
  minDate: Date;
  maxDate: Date;
  startdate?: string;
  enddate?: string;
}

