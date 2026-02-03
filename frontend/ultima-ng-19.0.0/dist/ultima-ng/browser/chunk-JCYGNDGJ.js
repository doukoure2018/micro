import {
  HttpClient
} from "./chunk-BMYIFZHZ.js";
import {
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZKKMBKIA.js";

// src/app/pages/service/member.service.ts
var MemberService = class _MemberService {
  http;
  constructor(http) {
    this.http = http;
  }
  getMembers() {
    return this.http.get("/demo/data/members.json").toPromise().then((res) => res.data).then((data) => data);
  }
  static \u0275fac = function MemberService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MemberService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MemberService, factory: _MemberService.\u0275fac, providedIn: "root" });
};

export {
  MemberService
};
//# sourceMappingURL=chunk-JCYGNDGJ.js.map
