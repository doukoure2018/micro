import {
  ɵɵdefinePipe
} from "./chunk-ZKKMBKIA.js";

// src/app/pipes/java-date.pipe.ts
var JavaDatePipe = class _JavaDatePipe {
  transform(value, format = "dd/MM/yyyy HH:mm") {
    if (!value)
      return "-";
    let date;
    try {
      if (Array.isArray(value)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = value;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else if (typeof value === "string" && value.includes(",")) {
        const parts = value.split(",").map(Number);
        const [year, month, day, hour = 0, minute = 0, second = 0] = parts;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else {
        date = new Date(value);
      }
      if (isNaN(date.getTime())) {
        return "-";
      }
      return this.formatDate(date, format);
    } catch (error) {
      console.error("JavaDatePipe error:", error);
      return "-";
    }
  }
  formatDate(date, format) {
    const pad = (n) => n < 10 ? "0" + n : n.toString();
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return format.replace("dd", day).replace("MM", month).replace("yyyy", year.toString()).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);
  }
  static \u0275fac = function JavaDatePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _JavaDatePipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "javaDate", type: _JavaDatePipe, pure: true });
};

export {
  JavaDatePipe
};
//# sourceMappingURL=chunk-O2RK2BKY.js.map
