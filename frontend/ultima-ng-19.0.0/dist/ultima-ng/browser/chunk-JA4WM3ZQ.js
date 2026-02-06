import{b as Z,d as ee,e as te,j as ie}from"./chunk-UCSGE5ZL.js";import{a as oe,b as ae}from"./chunk-NRZ4QNP7.js";import{Aa as se,Da as re,s as E,t as ne,ta as I}from"./chunk-3YZBLOIS.js";import{l as X,n as G,q as J,y as Y}from"./chunk-GZWLZB4Q.js";import{Cc as k,Eb as N,Fb as H,Gb as c,Hb as m,Ib as T,Kc as S,Lc as W,Mb as F,Pa as w,Qa as V,Rb as L,Sb as o,U as M,V as A,Va as p,Yb as q,Zb as z,_ as y,_b as j,bc as v,cc as g,dc as h,fa as f,ga as x,gb as O,hb as P,ja as C,kb as R,lc as B,mb as b,mc as U,nc as Q,oc as K,pa as D,ub as _,vb as l,zb as $}from"./chunk-MKA3N2SS.js";var pe=["list"],ce=t=>({"p-steps p-component":!0,"p-readonly":t}),me=(t,a)=>({"p-steps-item-active":t,"p-disabled":a}),de=()=>({exact:!1}),ue=(t,a)=>a.label;function _e(t,a){if(t&1&&(c(0,"span",14),g(1),m()),t&2){let e=o(3).$implicit;p(),h(e.label)}}function fe(t,a){if(t&1&&T(0,"span",15),t&2){let e=o(3).$implicit;l("innerHTML",e.label,w)}}function xe(t,a){if(t&1){let e=F();c(0,"a",11),L("click",function(i){f(e);let s=o(2),r=s.$implicit,d=s.$index,u=o();return x(u.onItemClick(i,r,d))})("keydown",function(i){f(e);let s=o(2),r=s.$implicit,d=s.$index,u=o();return x(u.onItemKeydown(i,r,d))}),c(1,"span",12),g(2),m(),b(3,_e,2,1,"span",13)(4,fe,1,1,"ng-template",null,3,k),m()}if(t&2){let e=v(5),n=o(2),i=n.$implicit,s=n.$index,r=o();l("routerLink",i.routerLink)("queryParams",i.queryParams)("routerLinkActiveOptions",i.routerLinkActiveOptions||U(17,de))("target",i.target)("fragment",i.fragment)("queryParamsHandling",i.queryParamsHandling)("preserveFragment",i.preserveFragment)("skipLocationChange",i.skipLocationChange)("replaceUrl",i.replaceUrl)("state",i.state),_("tabindex",r.getItemTabIndex(i,s))("aria-expanded",s===r.activeIndex)("aria-disabled",i.disabled||r.readonly&&s!==r.activeIndex)("ariaCurrentWhenActive",r.exact?"step":void 0),p(2),h(s+1),p(),l("ngIf",i.escape!==!1)("ngIfElse",e)}}function be(t,a){if(t&1&&(c(0,"span",14),g(1),m()),t&2){let e=o(3).$implicit;p(),h(e.label)}}function ge(t,a){if(t&1&&T(0,"span",15),t&2){let e=o(3).$implicit;l("innerHTML",e.label,w)}}function he(t,a){if(t&1){let e=F();c(0,"a",16),L("click",function(i){f(e);let s=o(2),r=s.$implicit,d=s.$index,u=o();return x(u.onItemClick(i,r,d))})("keydown",function(i){f(e);let s=o(2),r=s.$implicit,d=s.$index,u=o();return x(u.onItemKeydown(i,r,d))}),c(1,"span",12),g(2),m(),b(3,be,2,1,"span",13)(4,ge,1,1,"ng-template",null,4,k),m()}if(t&2){let e=v(5),n=o(2),i=n.$implicit,s=n.$index,r=o();l("target",i.target),_("href",i.url,V)("tabindex",r.getItemTabIndex(i,s))("aria-expanded",s===r.activeIndex)("aria-disabled",i.disabled||r.readonly&&s!==r.activeIndex)("ariaCurrentWhenActive",r.exact&&(!i.disabled||r.readonly)?"step":void 0),p(2),h(s+1),p(),l("ngIf",i.escape!==!1)("ngIfElse",e)}}function ye(t,a){if(t&1&&(c(0,"li",9,1),b(2,xe,6,18,"a",10)(3,he,6,9,"ng-template",null,2,k),m()),t&2){let e=v(4),n=o(),i=n.$implicit,s=n.$index,r=o();$(i.styleClass),l("ngStyle",i.style)("tooltipOptions",i.tooltipOptions)("ngClass",K(10,me,r.isActive(i,s),i.disabled||r.readonly&&!r.isActive(i,s))),_("aria-current",r.isActive(i,s)?"step":void 0)("id",i.id)("data-pc-section","menuitem"),p(2),l("ngIf",r.isClickableRouterLink(i))("ngIfElse",e)}}function ve(t,a){if(t&1&&b(0,ye,5,13,"li",8),t&2){let e=a.$implicit;l("ngIf",e.visible!==!1)}}var ke=({dt:t})=>`
.p-steps {
    position: relative;
}

.p-steps-list {
    padding: 0;
    margin: 0;
    list-style-type: none;
    display: flex;
}

.p-steps-item {
    position: relative;
    display: flex;
    justify-content: center;
    flex: 1 1 auto;
}

.p-steps-item.p-disabled,
.p-steps-item.p-disabled * {
    opacity: 1;
    pointer-events: auto;
    user-select: auto;
    cursor: auto;
}

.p-steps-item:before {
    content: " ";
    border-top: 2px solid ${t("steps.separator.background")};
    width: 100%;
    top: 50%;
    left: 0;
    display: block;
    position: absolute;
    margin-top: -1rem;
    margin-top: calc(-1rem + 1px);
}

.p-steps-item:first-child::before {
    width: calc(50% + 1rem);
    transform: translateX(100%);
}

.p-steps-item:last-child::before {
    width: 50%;
}

.p-steps-item-link {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    text-decoration: none;
    transition: outline-color ${t("steps.transition.duration")}, box-shadow ${t("steps.transition.duration")};
    border-radius: ${t("steps.item.link.border.radius")};
    outline-color: transparent;
    gap: ${t("steps.item.link.gap")};
}

.p-steps-item-link:not(.p-disabled):focus-visible {
    box-shadow: ${t("steps.item.link.focus.ring.shadow")};
    outline: ${t("steps.item.link.focus.ring.width")} ${t("steps.item.link.focus.ring.style")} ${t("steps.item.link.focus.ring.color")};
    outline-offset: ${t("steps.item.link.focus.ring.offset")};
}

.p-steps-item-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    color: ${t("steps.item.label.color")};
    display: block;
    font-weight: ${t("steps.item.label.font.weight")};
}

.p-steps-item-number {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${t("steps.item.number.color")};
    border: 2px solid ${t("steps.item.number.border.color")};
    background: ${t("steps.item.number.background")};
    min-width: ${t("steps.item.number.size")};
    height: ${t("steps.item.number.size")};
    line-height: ${t("steps.item.number.size")};
    font-size: ${t("steps.item.number.font.size")};
    z-index: 1;
    border-radius: ${t("steps.item.number.border.radius")};
    position: relative;
    font-weight: ${t("steps.item.number.font.weight")};
}

.p-steps-item-number::after {
    content: " ";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: ${t("steps.item.number.border.radius")};
    box-shadow: ${t("steps.item.number.shadow")};
}

.p-steps:not(.p-readonly) .p-steps-item {
    cursor: pointer;
}

.p-steps-item-active .p-steps-item-number {
    background: ${t("steps.item.number.active.background")};
    border-color: ${t("steps.item.number.active.border.color")};
    color: ${t("steps.item.number.active.color")};
}

.p-steps-item-active .p-steps-item-label {
    color: ${t("steps.item.label.active.color")};
}
`,Ie={root:({props:t})=>["p-steps p-component",{"p-readonly":t.readonly}],list:"p-steps-list",item:({instance:t,item:a,index:e})=>["p-steps-item",{"p-steps-item-active":t.isActive(e),"p-disabled":t.isItemDisabled(a,e)}],itemLink:"p-steps-item-link",itemNumber:"p-steps-item-number",itemLabel:"p-steps-item-label"},le=(()=>{class t extends se{name="steps";theme=ke;classes=Ie;static \u0275fac=(()=>{let e;return function(i){return(e||(e=C(t)))(i||t)}})();static \u0275prov=M({token:t,factory:t.\u0275fac})}return t})();var Ce=(()=>{class t extends re{activeIndex=0;model;readonly=!0;style;styleClass;exact=!0;activeIndexChange=new D;listViewChild;router=y(ee);route=y(Z);_componentStyle=y(le);subscription;ngOnInit(){super.ngOnInit(),this.subscription=this.router.events.subscribe(()=>this.cd.markForCheck())}onItemClick(e,n,i){if(this.readonly||n.disabled){e.preventDefault();return}this.activeIndexChange.emit(i),!n.url&&!n.routerLink&&e.preventDefault(),n.command&&n.command({originalEvent:e,item:n,index:i})}onItemKeydown(e,n,i){switch(e.code){case"ArrowRight":{this.navigateToNextItem(e.target),e.preventDefault();break}case"ArrowLeft":{this.navigateToPrevItem(e.target),e.preventDefault();break}case"Home":{this.navigateToFirstItem(e.target),e.preventDefault();break}case"End":{this.navigateToLastItem(e.target),e.preventDefault();break}case"Tab":if(i!==this.activeIndex){let s=E(this.listViewChild.nativeElement,'[data-pc-section="menuitem"]');s[i].children[0].tabIndex="-1",s[this.activeIndex].children[0].tabIndex="0"}break;case"Enter":case"Space":{this.onItemClick(e,n,i),e.preventDefault();break}default:break}}navigateToNextItem(e){let n=this.findNextItem(e);n&&this.setFocusToMenuitem(e,n)}navigateToPrevItem(e){let n=this.findPrevItem(e);n&&this.setFocusToMenuitem(e,n)}navigateToFirstItem(e){let n=this.findFirstItem();n&&this.setFocusToMenuitem(e,n)}navigateToLastItem(e){let n=this.findLastItem();n&&this.setFocusToMenuitem(e,n)}findNextItem(e){let n=e.parentElement.nextElementSibling;return n?n.children[0]:null}findPrevItem(e){let n=e.parentElement.previousElementSibling;return n?n.children[0]:null}findFirstItem(){let e=ne(this.listViewChild.nativeElement,'[data-pc-section="menuitem"]');return e?e.children[0]:null}findLastItem(){let e=E(this.listViewChild.nativeElement,'[data-pc-section="menuitem"]');return e?e[e.length-1].children[0]:null}setFocusToMenuitem(e,n){e.tabIndex="-1",n.tabIndex="0",n.focus()}isClickableRouterLink(e){return e.routerLink&&!this.readonly&&!e.disabled}isActive(e,n){if(e.routerLink){let i=Array.isArray(e.routerLink)?e.routerLink:[e.routerLink];return this.router.isActive(this.router.createUrlTree(i,{relativeTo:this.route}).toString(),!1)}return n===this.activeIndex}getItemTabIndex(e,n){return e.disabled?"-1":!e.disabled&&this.activeIndex===n?e.tabindex||"0":e.tabindex??"-1"}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=C(t)))(i||t)}})();static \u0275cmp=O({type:t,selectors:[["p-steps"]],viewQuery:function(n,i){if(n&1&&q(pe,5),n&2){let s;z(s=j())&&(i.listViewChild=s.first)}},inputs:{activeIndex:[2,"activeIndex","activeIndex",W],model:"model",readonly:[2,"readonly","readonly",S],style:"style",styleClass:"styleClass",exact:[2,"exact","exact",S]},outputs:{activeIndexChange:"activeIndexChange"},features:[B([le]),R],decls:5,vars:8,consts:[["list",""],["menuitem",""],["elseBlock",""],["htmlLabel",""],["htmlRouteLabel",""],[3,"ngClass","ngStyle"],[1,"p-steps-list"],["pTooltip","",1,"p-steps-item",3,"ngStyle","class","tooltipOptions","ngClass"],["class","p-steps-item","pTooltip","",3,"ngStyle","class","tooltipOptions","ngClass",4,"ngIf"],["pTooltip","",1,"p-steps-item",3,"ngStyle","tooltipOptions","ngClass"],["role","link","class","p-steps-item-link",3,"routerLink","queryParams","routerLinkActiveOptions","target","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state","click","keydown",4,"ngIf","ngIfElse"],["role","link",1,"p-steps-item-link",3,"click","keydown","routerLink","queryParams","routerLinkActiveOptions","target","fragment","queryParamsHandling","preserveFragment","skipLocationChange","replaceUrl","state"],[1,"p-steps-item-number"],["class","p-steps-item-label",4,"ngIf","ngIfElse"],[1,"p-steps-item-label"],[1,"p-steps-item-label",3,"innerHTML"],["role","link",1,"p-steps-item-link",3,"click","keydown","target"]],template:function(n,i){n&1&&(c(0,"nav",5)(1,"ul",6,0),N(3,ve,1,1,"li",7,ue),m()()),n&2&&($(i.styleClass),l("ngClass",Q(6,ce,i.readonly))("ngStyle",i.style),_("data-pc-name","steps"),p(),_("data-pc-section","menu"),p(2),H(i.model))},dependencies:[Y,X,G,J,ie,te,ae,oe,I],encapsulation:2,changeDetection:0})}return t})(),Ue=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=P({type:t});static \u0275inj=A({imports:[Ce,I,I]})}return t})();export{Ce as a,Ue as b};
