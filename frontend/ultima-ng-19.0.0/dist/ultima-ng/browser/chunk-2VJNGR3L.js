import{a as M,b as k}from"./chunk-JK4JG2UW.js";import{a as I}from"./chunk-RHLJ6NE2.js";import{a as S}from"./chunk-GFZUU5ZD.js";import{a as T}from"./chunk-KR7F45VC.js";import{f as le,g as me}from"./chunk-XKXBFP6V.js";import{Aa as re,Da as ce,oa as ne,sa as ae,ta as w}from"./chunk-3YZBLOIS.js";import{c as oe,d as x,f as y,h as $}from"./chunk-S35HUXPS.js";import{l as X,m as Z,n as ee,q as se,r as te,y as ie}from"./chunk-GZWLZB4Q.js";import{Bb as u,Gb as m,Hb as g,Ib as l,Kc as h,Lb as Q,Mb as V,Pa as v,Rb as R,Sb as n,U as F,V as L,Va as r,Xb as q,Zb as G,_ as z,_a as H,_b as U,cc as _,dc as Y,ec as C,fa as D,ga as A,gb as N,hb as P,ja as B,kb as j,lc as J,mb as p,nc as K,oc as W,pa as b,ub as c,v as O,vb as a,zb as f}from"./chunk-MKA3N2SS.js";var pe=(e,o)=>({showTransitionParams:e,hideTransitionParams:o}),ue=e=>({value:"visible",params:e});function de(e,o){e&1&&Q(0)}function fe(e,o){if(e&1&&(m(0,"div",1),p(1,de,1,0,"ng-container",3),g()),e&2){let s=n();a("ngClass","p-message p-message-"+s.severity),r(),a("ngTemplateOutlet",s.contentTemplate)}}function _e(e,o){if(e&1&&l(0,"span",5),e&2){let s=n().$implicit,t=n(2);f("pi "+s.icon),a("ngClass",t.cx("icon")),c("data-pc-section","icon")}}function he(e,o){e&1&&l(0,"CheckIcon"),e&2&&c("data-pc-section","icon")}function be(e,o){e&1&&l(0,"TimesCircleIcon"),e&2&&c("data-pc-section","icon")}function ve(e,o){e&1&&l(0,"TimesCircleIcon"),e&2&&c("data-pc-section","icon")}function Ce(e,o){e&1&&l(0,"ExclamationTriangleIcon"),e&2&&c("data-pc-section","icon")}function xe(e,o){e&1&&l(0,"InfoCircleIcon"),e&2&&c("data-pc-section","icon")}function ye(e,o){if(e&1&&(m(0,"span",5),p(1,he,1,1,"CheckIcon")(2,be,1,1,"TimesCircleIcon")(3,ve,1,1,"TimesCircleIcon")(4,Ce,1,1,"ExclamationTriangleIcon")(5,xe,1,1,"InfoCircleIcon"),g()),e&2){let s,t=n().$implicit,i=n(2);a("ngClass",i.cx("icon")),r(),u((s=t.severity)==="success"?1:s==="error"?2:s==="danger"?3:s==="warn"?4:5)}}function $e(e,o){if(e&1&&(m(0,"span",5),_(1),g()),e&2){let s=n(2).$implicit,t=n(2);a("ngClass",t.cx("text")),r(),Y(s.text)}}function we(e,o){if(e&1&&(m(0,"span",5),_(1),g()),e&2){let s=n(2).$implicit,t=n(2);a("ngClass",t.cx("text","p-message-summary")),c("data-pc-section","summary"),r(),C(" ",s.summary," ")}}function Te(e,o){if(e&1&&(m(0,"span",5),_(1),g()),e&2){let s=n(2).$implicit,t=n(2);a("ngClass",t.cx("text","p-message-detail")),c("data-pc-section","detail"),r(),C(" ",s.detail," ")}}function Me(e,o){if(e&1&&p(0,$e,2,2,"span",5)(1,we,2,3,"span",5)(2,Te,2,3,"span",5),e&2){let s=n().$implicit;u(s.text?0:-1),r(),u(s.summary?1:-1),r(),u(s.detail?2:-1)}}function ke(e,o){if(e&1&&l(0,"span",10),e&2){let s=n(2).$implicit;a("innerHTML",s.summary,v),c("data-pc-section","summary")}}function Se(e,o){if(e&1&&l(0,"span",11),e&2){let s=n(2).$implicit;a("innerHTML",s.detail,v),c("data-pc-section","detail")}}function Ie(e,o){if(e&1&&p(0,ke,1,2,"span",8)(1,Se,1,2,"span",9),e&2){let s=n().$implicit;a("ngIf",s.summary),r(),a("ngIf",s.detail)}}function Ee(e,o){if(e&1){let s=V();m(0,"p-button",12),R("onClick",function(){D(s);let i=n().index,d=n(2);return A(d.removeMessage(i))}),l(1,"TimesIcon",5),g()}if(e&2){let s=n(3);a("styleClass",s.cx("closeButton"))("ariaLabel",s.closeAriaLabel),c("data-pc-section","closebutton"),r(),a("ngClass",s.cx("closeIcon")),c("data-pc-section","closeicon")}}function Oe(e,o){if(e&1&&(m(0,"div",1)(1,"div",5),p(2,_e,1,4,"span",6)(3,ye,6,2,"span",5)(4,Me,3,3)(5,Ie,2,2)(6,Ee,2,5,"p-button",7),g()()),e&2){let s,t=o.$implicit,i=n(2);f("p-message-"+t.severity),a("ngClass",i.cx("root"))("@messageAnimation",K(13,ue,W(10,pe,i.showTransitionOptions,i.hideTransitionOptions))),r(),a("ngClass",i.cx("content")),c("data-pc-section","wrapper")("id",t.id||null),r(),u(t.icon?2:3),r(2),u(i.escape?4:5),r(2),a("ngIf",i.closable&&((s=t.closable)!==null&&s!==void 0?s:!0))}}function Fe(e,o){if(e&1&&p(0,Oe,7,15,"div",4),e&2){let s=n();a("ngForOf",s.messages)}}var Le=({dt:e})=>`
.p-messages {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: ${e("message.content.gap")};
}

.p-message {
    border-radius: ${e("message.border.radius")};
    outline-width: ${e("message.border.width")};
    outline-style: solid;
}

.p-message-content {
    display: flex;
    align-items: center;
    padding: ${e("message.content.padding")};
    height: 100%;
}

.p-message .p-message-content:has(:nth-child(1)) {
    gap: ${e("message.content.gap")};
}

.p-message-icon {
    flex-shrink: 0;
}

.p-message-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: 0 0 0 auto;
    overflow: hidden;
    position: relative;
    width: ${e("message.close.button.width")};
    height: ${e("message.close.button.height")};
    border-radius: ${e("message.close.button.border.radius")};
    background: transparent;
    transition: background ${e("message.transition.duration")}, color ${e("message.transition.duration")}, outline-color ${e("message.transition.duration")}, box-shadow ${e("message.transition.duration")}, opacity 0.3s;
    outline-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    cursor: pointer;
    user-select: none;
}

.p-message-close-icon {
    font-size: ${e("message.close.icon.size")};
    width: ${e("message.close.icon.size")};
    height: ${e("message.close.icon.size")};
}

.p-message-close-button:focus-visible {
    outline-width: ${e("message.close.button.focus.ring.width")};
    outline-style: ${e("message.close.button.focus.ring.style")};
    outline-offset: ${e("message.close.button.focus.ring.offset")};
}

.p-message-info {
    background: ${e("message.info.background")};
    outline-color: ${e("message.info.border.color")};
    color: ${e("message.info.color")};
    box-shadow: ${e("message.info.shadow")};
}

.p-message-info .p-message-close-button:focus-visible {
    outline-color: ${e("message.info.close.button.focus.ring.color")};
    box-shadow: ${e("message.info.close.button.focus.ring.shadow")};
}

.p-message-info .p-message-close-button:hover {
    background: ${e("message.info.close.button.hover.background")};
}

.p-message-success {
    background: ${e("message.success.background")};
    outline-color: ${e("message.success.border.color")};
    color: ${e("message.success.color")};
    box-shadow: ${e("message.success.shadow")};
}

.p-message-success .p-message-close-button:focus-visible {
    outline-color: ${e("message.success.close.button.focus.ring.color")};
    box-shadow: ${e("message.success.close.button.focus.ring.shadow")};
}

.p-message-success .p-message-close-button:hover {
    background: ${e("message.success.close.button.hover.background")};
}

.p-message-warn {
    background: ${e("message.warn.background")};
    outline-color: ${e("message.warn.border.color")};
    color: ${e("message.warn.color")};
    box-shadow: ${e("message.warn.shadow")};
}

.p-message-warn .p-message-close-button:focus-visible {
    outline-color: ${e("message.warn.close.button.focus.ring.color")};
    box-shadow: ${e("message.warn.close.button.focus.ring.shadow")};
}

.p-message-warn .p-message-close-button:hover {
    background: ${e("message.warn.close.button.hover.background")};
}

.p-message-error {
    background: ${e("message.error.background")};
    outline-color: ${e("message.error.border.color")};
    color: ${e("message.error.color")};
    box-shadow: ${e("message.error.shadow")};
}

.p-message-error .p-message-close-button:focus-visible {
    outline-color: ${e("message.error.close.button.focus.ring.color")};
    box-shadow: ${e("message.error.close.button.focus.ring.shadow")};
}

.p-message-error .p-message-close-button:hover {
    background: ${e("message.error.close.button.hover.background")};
}

.p-message-secondary {
    background: ${e("message.secondary.background")};
    outline-color: ${e("message.secondary.border.color")};
    color: ${e("message.secondary.color")};
    box-shadow: ${e("message.secondary.shadow")};
}

.p-message-secondary .p-message-close-button:focus-visible {
    outline-color: ${e("message.secondary.close.button.focus.ring.color")};
    box-shadow: ${e("message.secondary.close.button.focus.ring.shadow")};
}

.p-message-secondary .p-message-close-button:hover {
    background: ${e("message.secondary.close.button.hover.background")};
}

.p-message-contrast {
    background: ${e("message.contrast.background")};
    outline-color: ${e("message.contrast.border.color")};
    color: ${e("message.contrast.color")};
    box-shadow: ${e("message.contrast.shadow")};
}

.p-message-contrast .p-message-close-button:focus-visible {
    outline-color: ${e("message.contrast.close.button.focus.ring.color")};
    box-shadow: ${e("message.contrast.close.button.focus.ring.shadow")};
}

.p-message-contrast .p-message-close-button:hover {
    background: ${e("message.contrast.close.button.hover.background")};
}

.p-message-text {
    font-size: ${e("message.text.font.size")};
    font-weight: ${e("message.text.font.weight")};
}

.p-message-icon {
    font-size: ${e("message.icon.size")};
    width: ${e("message.icon.size")};
    height: ${e("message.icon.size")};
}

.p-message-enter-from {
    opacity: 0;
}

.p-message-enter-active {
    transition: opacity 0.3s;
}

.p-message.p-message-leave-from {
    max-height: 1000px;
}

.p-message.p-message-leave-to {
    max-height: 0;
    opacity: 0;
    margin: 0;
}

.p-message-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin 0.3s;
}

.p-message-leave-active .p-message-close-button {
    opacity: 0;
}
/* For PrimeNG */
.p-messages .p-message.ng-animating {
    overflow: hidden;
}

.p-message-content > p-button[data-pc-section="closebutton"] {
    margin-left: auto;
}
`,ze={root:({instance:e})=>({"p-message":!0}),container:"p-messages p-component",content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},ge=(()=>{class e extends re{name="message";theme=Le;classes=ze;static \u0275fac=(()=>{let s;return function(i){return(s||(s=B(e)))(i||e)}})();static \u0275prov=F({token:e,factory:e.\u0275fac})}return e})(),is=(()=>{class e extends ce{messageService;set value(s){this.messages=s,this.startMessageLifes(this.messages)}closable=!0;style;styleClass;enableService=!0;key;escape=!0;severity;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";valueChange=new b;onClose=new b;messages;messageSubscription;clearSubscription;timerSubscriptions=[];contentTemplate;_componentStyle=z(ge);constructor(s){super(),this.messageService=s,console.log("Messages component is deprecated as of v18. Use Message component instead.")}templates;ngAfterContentInit(){this.templates?.forEach(s=>{switch(s.getType()){case"content":this.contentTemplate=s.template;break;default:this.contentTemplate=s.template;break}}),this.messageService&&this.enableService&&!this.contentTemplate&&(this.messageSubscription=this.messageService.messageObserver.subscribe(s=>{if(s){Array.isArray(s)||(s=[s]);let t=s.filter(i=>this.key===i.key);this.messages=this.messages?[...this.messages,...t]:[...t],this.startMessageLifes(t),this.cd.markForCheck()}}),this.clearSubscription=this.messageService.clearObserver.subscribe(s=>{s?this.key===s&&(this.messages=null):this.messages=null,this.cd.markForCheck()}))}hasMessages(){let s=this.el.nativeElement.parentElement;return s&&s.offsetParent?this.contentTemplate!=null||this.messages&&this.messages.length>0:!1}clear(){this.messages=[],this.valueChange.emit(this.messages)}removeMessage(s){let t=this.messages[s];this.messages=this.messages?.filter((i,d)=>d!==s),t&&this.onClose.emit(t),this.valueChange.emit(this.messages)}get icon(){let s=this.severity||(this.hasMessages()?this.messages[0].severity:null);if(this.hasMessages())switch(s){case"success":return"pi-check";case"info":return"pi-info-circle";case"error":case"danger":return"pi-times";case"warn":return"pi-exclamation-triangle";default:return"pi-info-circle"}return null}get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}ngOnDestroy(){this.messageSubscription&&this.messageSubscription.unsubscribe(),this.clearSubscription&&this.clearSubscription.unsubscribe(),this.timerSubscriptions?.forEach(s=>s.unsubscribe()),super.ngOnDestroy()}startMessageLifes(s){s?.forEach(t=>t.life&&this.startMessageLife(t))}startMessageLife(s){let t=O(s.life).subscribe(()=>{this.messages=this.messages?.filter(i=>i!==s),this.timerSubscriptions=this.timerSubscriptions?.filter(i=>i!==t),this.valueChange.emit(this.messages),this.cd.markForCheck()});this.timerSubscriptions.push(t)}static \u0275fac=function(t){return new(t||e)(H(ne,8))};static \u0275cmp=N({type:e,selectors:[["p-messages"]],contentQueries:function(t,i,d){if(t&1&&q(d,ae,4),t&2){let E;G(E=U())&&(i.templates=E)}},inputs:{value:"value",closable:[2,"closable","closable",h],style:"style",styleClass:"styleClass",enableService:[2,"enableService","enableService",h],key:"key",escape:[2,"escape","escape",h],severity:"severity",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions"},outputs:{valueChange:"valueChange",onClose:"onClose"},standalone:!1,features:[J([ge]),j],decls:3,vars:8,consts:[["role","alert",3,"ngClass","ngStyle"],["role","alert",3,"ngClass"],["role","alert",3,"ngClass","class"],[4,"ngTemplateOutlet"],["role","alert",3,"ngClass","class",4,"ngFor","ngForOf"],[3,"ngClass"],[3,"ngClass","class"],["rounded","","text","","severity","secondary",3,"styleClass","ariaLabel","onClick",4,"ngIf"],["class","p-message-summary",3,"innerHTML",4,"ngIf"],["class","p-message-detail",3,"innerHTML",4,"ngIf"],[1,"p-message-summary",3,"innerHTML"],[1,"p-message-detail",3,"innerHTML"],["rounded","","text","","severity","secondary",3,"onClick","styleClass","ariaLabel"]],template:function(t,i){t&1&&(m(0,"div",0),p(1,fe,2,2,"div",1)(2,Fe,1,1,"div",2),g()),t&2&&(f(i.styleClass),a("ngClass",i.cx("container"))("ngStyle",i.style),c("aria-atomic",!0)("aria-live","assertive")("data-pc-name","message"),r(),u(i.contentTemplate?1:2))},dependencies:()=>[X,Z,ee,te,se,T,k,I,M,S,le],encapsulation:2,data:{animation:[oe("messageAnimation",[$(":enter",[y({opacity:0,transform:"translateY(-25%)"}),x("{{showTransitionParams}}")]),$(":leave",[x("{{hideTransitionParams}}",y({height:0,marginTop:0,marginBottom:0,marginLeft:0,marginRight:0,opacity:0}))])])]},changeDetection:0})}return e})(),os=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=P({type:e});static \u0275inj=L({imports:[ie,T,k,I,M,S,me,w,w]})}return e})();export{is as a,os as b};
