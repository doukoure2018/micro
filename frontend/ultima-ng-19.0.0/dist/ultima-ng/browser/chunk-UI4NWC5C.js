import {
  HttpClient
} from "./chunk-BMYIFZHZ.js";
import {
  BehaviorSubject,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/apps/mail/service/mail.service.ts
var MailService = class _MailService {
  http;
  _mails = [];
  mails = new BehaviorSubject(this._mails);
  mails$ = this.mails.asObservable();
  constructor(http) {
    this.http = http;
    this.http.get("/demo/data/mail.json").toPromise().then((res) => res.data).then((data) => {
      this.updateMails(data);
    });
  }
  updateMails(data) {
    this._mails = data;
    this.mails.next(data);
  }
  onStar(id) {
    this._mails = this._mails.map((m) => m.id === id ? __spreadProps(__spreadValues({}, m), { starred: !m.starred }) : m);
    this.mails.next(this._mails);
  }
  onArchive(id) {
    this._mails = this._mails.map((m) => m.id === id ? __spreadProps(__spreadValues({}, m), { archived: !m.archived }) : m);
    this.mails.next(this._mails);
  }
  onBookmark(id) {
    this._mails = this._mails.map((m) => m.id === id ? __spreadProps(__spreadValues({}, m), { important: !m.important }) : m);
    this.mails.next(this._mails);
  }
  onDelete(id) {
    this._mails = this._mails.filter((m) => m.id !== id);
    this.mails.next(this._mails);
  }
  onDeleteMultiple(mails) {
    let idArray = mails.map((m) => Number(m.id));
    this._mails = this._mails.filter((m) => idArray.indexOf(m.id) == -1);
    this.mails.next(this._mails);
  }
  onArchiveMultiple(mails) {
    let idArray = mails.map((m) => m.id);
    for (let i = 0; i < this._mails.length; i++) {
      let mail = this._mails[i];
      if (idArray.indexOf(mail.id) !== -1) {
        mail.archived = true;
        this._mails[i] = mail;
      }
    }
    this.mails.next(this._mails);
  }
  onSpamMultiple(mails) {
    let idArray = mails.map((m) => m.id);
    for (let i = 0; i < this._mails.length; i++) {
      let mail = this._mails[i];
      if (idArray.indexOf(mail.id) !== -1) {
        mail = __spreadProps(__spreadValues({}, mail), {
          spam: true,
          important: false,
          starred: false,
          archived: false
        });
        this._mails[i] = mail;
      }
    }
    this.mails.next(this._mails);
  }
  onTrash(id) {
    this._mails = this._mails.map((m) => m.id === id ? __spreadProps(__spreadValues({}, m), { trash: true }) : m);
    this.mails.next(this._mails);
  }
  onSend(mail) {
    if (!mail.id) {
      mail.id = this.generateId();
    }
    if (!mail.title) {
      mail.title = "Untitled";
    }
    mail.date = this.generateDate();
    this._mails.push(mail);
    this.mails.next(this._mails);
  }
  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  generateDate() {
    return (/* @__PURE__ */ new Date()).toDateString().split(" ").slice(1, 4).join(" ");
  }
  static \u0275fac = function MailService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MailService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MailService, factory: _MailService.\u0275fac });
};

export {
  MailService
};
//# sourceMappingURL=chunk-UI4NWC5C.js.map
