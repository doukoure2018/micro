import{a as ae}from"./chunk-3WTE2CKQ.js";import{a as le}from"./chunk-ZNTL7BEM.js";import{g as re}from"./chunk-XKXBFP6V.js";import{Aa as ie,Da as oe,ia as te,sa as ne,ta as x}from"./chunk-3YZBLOIS.js";import{c as ee,d as D,f as O,g as Q,h as B}from"./chunk-S35HUXPS.js";import{l as U,n as W,q as X,r as Y,y as Z}from"./chunk-GZWLZB4Q.js";import{Cc as J,Gb as g,Hb as f,Ib as w,Jb as v,Kb as I,Kc as M,Lb as u,Mb as F,Rb as k,Sb as p,Tb as L,U as P,Ub as E,V as j,Va as i,Xb as _,Zb as m,_ as V,_b as b,bc as S,cc as K,dc as z,fa as y,ga as T,gb as A,hb as N,ja as $,kb as R,lc as G,mb as d,nc as h,oc as H,pa as C,ub as c,vb as o,zb as q}from"./chunk-MKA3N2SS.js";var ce=["header"],de=["expandicon"],pe=["collapseicon"],ge=["content"],fe=["*",[["p-header"]]],ue=["*","p-header"],_e=(e,l)=>({"p-fieldset p-component":!0,"p-fieldset-toggleable":e,"p-fieldset-expanded":l}),me=e=>({transitionParams:e,height:"0"}),be=e=>({value:"hidden",params:e}),he=e=>({transitionParams:e,height:"*"}),ye=e=>({value:"visible",params:e});function Te(e,l){e&1&&w(0,"PlusIcon",11),e&2&&(o("styleClass","p-fieldset-toggler"),c("data-pc-section","togglericon"))}function Ce(e,l){e&1&&u(0)}function ve(e,l){if(e&1&&(g(0,"span",12),d(1,Ce,1,0,"ng-container",6),f()),e&2){let t=p(3);c("data-pc-section","togglericon"),i(),o("ngTemplateOutlet",t.expandIconTemplate||t._expandIconTemplate)}}function Ie(e,l){if(e&1&&(v(0),d(1,Te,1,2,"PlusIcon",9)(2,ve,2,2,"span",10),I()),e&2){let t=p(2);i(),o("ngIf",!t.expandIconTemplate&&!t._expandIconTemplate),i(),o("ngIf",t.expandIconTemplate||t._expandIconTemplate)}}function xe(e,l){e&1&&w(0,"MinusIcon",11),e&2&&(o("styleClass","p-fieldset-toggler"),c("aria-hidden",!0)("data-pc-section","togglericon"))}function $e(e,l){e&1&&u(0)}function we(e,l){if(e&1&&(g(0,"span",12),d(1,$e,1,0,"ng-container",6),f()),e&2){let t=p(3);c("data-pc-section","togglericon"),i(),o("ngTemplateOutlet",t.collapseIconTemplate||t._collapseIconTemplate)}}function Fe(e,l){if(e&1&&(v(0),d(1,xe,1,3,"MinusIcon",9)(2,we,2,2,"span",10),I()),e&2){let t=p(2);i(),o("ngIf",!t.collapseIconTemplate&&!t._collapseIconTemplate),i(),o("ngIf",t.collapseIconTemplate||t._collapseIconTemplate)}}function ke(e,l){e&1&&u(0)}function Ee(e,l){if(e&1){let t=F();v(0),g(1,"button",7),k("click",function(n){y(t);let r=p();return T(r.toggle(n))})("keydown",function(n){y(t);let r=p();return T(r.onKeyDown(n))}),d(2,Ie,3,2,"ng-container",8)(3,Fe,3,2,"ng-container",8)(4,ke,1,0,"ng-container",6),f(),I()}if(e&2){let t=p(),a=S(4);i(),c("id",t.id+"_header")("aria-controls",t.id+"_content")("aria-expanded",!t.collapsed)("aria-label",t.buttonAriaLabel),i(),o("ngIf",t.collapsed),i(),o("ngIf",!t.collapsed),i(),o("ngTemplateOutlet",a)}}function Se(e,l){e&1&&u(0)}function Me(e,l){if(e&1&&(g(0,"span",13),K(1),f(),E(2,1),d(3,Se,1,0,"ng-container",6)),e&2){let t=p();c("data-pc-section","legendtitle"),i(),z(t.legend),i(2),o("ngTemplateOutlet",t.headerTemplate||t._headerTemplate)}}function De(e,l){e&1&&u(0)}var Oe=({dt:e})=>`
.p-fieldset {
    background: ${e("fieldset.background")};
    border: 1px solid ${e("fieldset.border.color")};
    border-radius: ${e("fieldset.border.radius")};
    color: ${e("fieldset.color")};
    padding:  ${e("fieldset.padding")};
    margin: 0;
}

.p-fieldset-legend {
    background: ${e("fieldset.legend.background")};
    border-radius: ${e("fieldset.legend.border.radius")};
    border-width: ${e("fieldset.legend.border.width")};
    border-style: solid;
    border-color: ${e("fieldset.legend.border.color")};
    padding: ${e("fieldset.legend.padding")};
    transition: background ${e("fieldset.transition.duration")}, color ${e("fieldset.transition.duration")}, outline-color ${e("fieldset.transition.duration")}, box-shadow ${e("fieldset.transition.duration")};
}

.p-fieldset-toggleable > .p-fieldset-legend {
    padding: 0;
}

.p-fieldset-toggle-button {
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    display: flex;
    gap: ${e("fieldset.legend.gap")};
    align-items: center;
    justify-content: center;
    padding: ${e("fieldset.legend.padding")};
    background: transparent;
    border: 0 none;
    border-radius: ${e("fieldset.legend.border.radius")};
    transition: background ${e("fieldset.transition.duration")}, color ${e("fieldset.transition.duration")}, outline-color ${e("fieldset.transition.duration")}, box-shadow ${e("fieldset.transition.duration")};
    outline-color: transparent;
}

.p-fieldset-legend-label {
    font-weight: ${e("fieldset.legend.font.weight")};
}

.p-fieldset-toggle-button:focus-visible {
    box-shadow: ${e("fieldset.legend.focus.ring.shadow")};
    outline: ${e("fieldset.legend.focus.ring.width")} ${e("fieldset.legend.focus.ring.style")} ${e("fieldset.legend.focus.ring.color")};
    outline-offset: ${e("fieldset.legend.focus.ring.offset")};
}

.p-fieldset-toggleable > .p-fieldset-legend:hover {
    color: ${e("fieldset.legend.hover.color")};
    background: ${e("fieldset.legend.hover.background")};
}

.p-fieldset-toggle-icon {
    color: ${e("fieldset.toggle.icon.color")};
    transition: color ${e("fieldset.transition.duration")};
}

.p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
    color: ${e("fieldset.toggle.icon.hover.color")};
}

.p-fieldset .p-fieldset-content {
    padding: ${e("fieldset.content.padding")};
}

/* For PrimeNG */
.p-fieldset-toggleable.p-fieldset-expanded > .p-fieldset-content-container:not(.ng-animating) {
    overflow: visible
}

.p-fieldset-toggleable .p-fieldset-content-container {
    overflow: hidden;
}
`,Qe={root:({props:e})=>["p-fieldset p-component",{"p-fieldset-toggleable":e.toggleable}],legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",content:"p-fieldset-content"},se=(()=>{class e extends ie{name="fieldset";theme=Oe;classes=Qe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=$(e)))(n||e)}})();static \u0275prov=P({token:e,factory:e.\u0275fac})}return e})();var Be=(()=>{class e extends oe{legend;toggleable;collapsed=!1;style;styleClass;transitionOptions="400ms cubic-bezier(0.86, 0, 0.07, 1)";collapsedChange=new C;onBeforeToggle=new C;onAfterToggle=new C;get id(){return te("pn_id_")}get buttonAriaLabel(){return this.legend}animating;_componentStyle=V(se);headerTemplate;expandIconTemplate;collapseIconTemplate;contentTemplate;toggle(t){if(this.animating)return!1;this.animating=!0,this.onBeforeToggle.emit({originalEvent:t,collapsed:this.collapsed}),this.collapsed?this.expand():this.collapse(),this.onAfterToggle.emit({originalEvent:t,collapsed:this.collapsed}),t.preventDefault()}onKeyDown(t){(t.code==="Enter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}expand(){this.collapsed=!1,this.collapsedChange.emit(this.collapsed)}collapse(){this.collapsed=!0,this.collapsedChange.emit(this.collapsed)}getBlockableElement(){return this.el.nativeElement.children[0]}onToggleDone(){this.animating=!1}_headerTemplate;_expandIconTemplate;_collapseIconTemplate;_contentTemplate;templates;ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"header":this._headerTemplate=t.template;break;case"expandicon":this._expandIconTemplate=t.template;break;case"collapseicon":this._collapseIconTemplate=t.template;break;case"content":this._contentTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=$(e)))(n||e)}})();static \u0275cmp=A({type:e,selectors:[["p-fieldset"]],contentQueries:function(a,n,r){if(a&1&&(_(r,ce,4),_(r,de,4),_(r,pe,4),_(r,ge,4),_(r,ne,4)),a&2){let s;m(s=b())&&(n.headerTemplate=s.first),m(s=b())&&(n.expandIconTemplate=s.first),m(s=b())&&(n.collapseIconTemplate=s.first),m(s=b())&&(n.contentTemplate=s.first),m(s=b())&&(n.templates=s)}},inputs:{legend:"legend",toggleable:[2,"toggleable","toggleable",M],collapsed:[2,"collapsed","collapsed",M],style:"style",styleClass:"styleClass",transitionOptions:"transitionOptions"},outputs:{collapsedChange:"collapsedChange",onBeforeToggle:"onBeforeToggle",onAfterToggle:"onAfterToggle"},features:[G([se]),R],ngContentSelectors:ue,decls:9,vars:28,consts:[["legendContent",""],[3,"ngClass","ngStyle"],[1,"p-fieldset-legend"],[4,"ngIf","ngIfElse"],["role","region",1,"p-fieldset-content-container"],[1,"p-fieldset-content"],[4,"ngTemplateOutlet"],["tabindex","0","role","button",1,"p-fieldset-toggle-button",3,"click","keydown"],[4,"ngIf"],[3,"styleClass",4,"ngIf"],["class","p-fieldset-toggler",4,"ngIf"],[3,"styleClass"],[1,"p-fieldset-toggler"],[1,"p-fieldset-legend-label"]],template:function(a,n){if(a&1){let r=F();L(fe),g(0,"fieldset",1)(1,"legend",2),d(2,Ee,5,7,"ng-container",3)(3,Me,4,3,"ng-template",null,0,J),f(),g(5,"div",4),k("@fieldsetContent.done",function(){return y(r),T(n.onToggleDone())}),g(6,"div",5),E(7),d(8,De,1,0,"ng-container",6),f()()()}if(a&2){let r=S(4);q(n.styleClass),o("ngClass",H(17,_e,n.toggleable,!n.collapsed&&n.toggleable))("ngStyle",n.style),c("id",n.id)("data-pc-name","fieldset")("data-pc-section","root"),i(),c("data-pc-section","legend"),i(),o("ngIf",n.toggleable)("ngIfElse",r),i(3),o("@fieldsetContent",n.collapsed?h(22,be,h(20,me,n.transitionOptions)):h(26,ye,h(24,he,n.animating?n.transitionOptions:"0ms"))),c("id",n.id+"_content")("aria-labelledby",n.id+"_header")("aria-hidden",n.collapsed)("data-pc-section","toggleablecontent"),i(),c("data-pc-section","content"),i(2),o("ngTemplateOutlet",n.contentTemplate||n._contentTemplate)}},dependencies:[Z,U,W,Y,X,re,le,ae,x],encapsulation:2,data:{animation:[ee("fieldsetContent",[Q("hidden",O({height:"0"})),Q("visible",O({height:"*"})),B("visible <=> hidden",[D("{{transitionParams}}")]),B("void => *",D(0))])]},changeDetection:0})}return e})(),nt=(()=>{class e{static \u0275fac=function(a){return new(a||e)};static \u0275mod=N({type:e});static \u0275inj=j({imports:[Be,x,x]})}return e})();export{Be as a,nt as b};
