import{a as xe}from"./chunk-AUQ3WAHM.js";import{a as lt,b as rt}from"./chunk-CNUKDHWL.js";import"./chunk-BYNX6VSG.js";import{a as et,b as tt}from"./chunk-SQPWYWAP.js";import{a as it}from"./chunk-TOQUJNDH.js";import{a as at,b as nt}from"./chunk-QZOXHZZK.js";import{a as me}from"./chunk-D6YNXGTA.js";import{a as ae}from"./chunk-ED7TFTUL.js";import{a as ne}from"./chunk-MZ7FZGG3.js";import{a as ue}from"./chunk-N4Q6Z3MW.js";import{a as $e}from"./chunk-GFZUU5ZD.js";import{c as Fe}from"./chunk-BODZH67C.js";import{f as be,g as Ie}from"./chunk-XKXBFP6V.js";import{a as Je}from"./chunk-ULM4QL4Q.js";import{Aa as ie,Da as Z,S as ve,b as ke,c as Ue,d as ge,e as We,ia as _e,qa as Xe,ra as Ye,s as $,sa as te,t as W,ta as D,u as Ze,v as fe}from"./chunk-3YZBLOIS.js";import"./chunk-Y2QT2WK5.js";import{c as Ke,d as Te,f as Se,h as Ve}from"./chunk-S35HUXPS.js";import{A as S,d as qe,l as U,m as ce,n as L,q as j,r as E,y as P}from"./chunk-GZWLZB4Q.js";import{Cc as F,Gb as m,Gc as he,Hb as p,Ib as v,Ic as He,Jb as H,Kb as q,Kc as b,Lb as A,Lc as M,Mb as w,Qa as pe,Rb as I,Sb as c,Tb as Me,U as N,Ua as Be,Ub as we,V as X,Va as s,Wb as Le,Xb as _,Yb as B,Za as Re,Zb as g,_ as Q,_a as C,_b as f,bc as je,cc as K,dc as Qe,ea as oe,ec as ze,fa as d,ga as h,gb as k,hb as Y,ja as z,kb as G,lc as R,mb as u,mc as J,nc as T,oc as de,pa as V,pc as ee,qa as Ae,qc as Ge,ta as se,ub as y,vb as r,za as Ce,zb as O}from"./chunk-MKA3N2SS.js";import"./chunk-GAL4ENT6.js";var ft=["item"],vt=["header"],_t=["footer"],bt=["previousicon"],It=["nexticon"],xt=["itemsContainer"],yt=["indicatorContent"],Ct=[[["p-header"]],[["p-footer"]]],wt=["p-header","p-footer"],Tt=(t,l)=>({"p-carousel p-component":!0,"p-carousel-vertical":t,"p-carousel-horizontal":l}),St=t=>({height:t}),Vt=t=>({"p-carousel-prev-button":!0,"p-disabled":t}),st=(t,l,e)=>({"p-carousel-item p-carousel-item-clone":!0,"p-carousel-item-active":t,"p-carousel-item-start":l,"p-carousel-item-end":e}),Oe=t=>({$implicit:t}),kt=(t,l,e)=>({"p-carousel-item":!0,"p-carousel-item-active":t,"p-carousel-item-start":l,"p-carousel-item-end":e}),$t=t=>({"p-carousel-next-button":!0,"p-disabled":t}),Ft=t=>({"p-carousel-indicator":!0,"p-carousel-indicator-active":t});function Dt(t,l){t&1&&A(0)}function Ot(t,l){if(t&1&&(m(0,"div",14),we(1),u(2,Dt,1,0,"ng-container",15),p()),t&2){let e=c();s(2),r("ngTemplateOutlet",e.headerTemplate)}}function Et(t,l){t&1&&v(0,"ChevronLeftIcon",20),t&2&&r("styleClass","carousel-prev-icon")}function Pt(t,l){t&1&&v(0,"ChevronUpIcon",20),t&2&&r("styleClass","carousel-prev-icon")}function Nt(t,l){if(t&1&&(H(0),u(1,Et,1,1,"ChevronLeftIcon",19)(2,Pt,1,1,"ChevronUpIcon",19),q()),t&2){let e=c(3);s(),r("ngIf",!e.isVertical()),s(),r("ngIf",e.isVertical())}}function At(t,l){}function Bt(t,l){t&1&&u(0,At,0,0,"ng-template")}function Rt(t,l){if(t&1&&(m(0,"span",21),u(1,Bt,1,0,null,15),p()),t&2){let e=c(3);s(),r("ngTemplateOutlet",e.previousIconTemplate||e._previousIconTemplate)}}function Mt(t,l){if(t&1&&u(0,Nt,3,2,"ng-container",17)(1,Rt,2,1,"span",18),t&2){let e=c(2);r("ngIf",!e.previousIconTemplate&&!e._previousIconTemplate&&!(e.prevButtonProps!=null&&e.prevButtonProps.icon)),s(),r("ngIf",(e.previousIconTemplate||e._previousIconTemplate)&&!(e.prevButtonProps!=null&&e.prevButtonProps.icon))}}function Lt(t,l){if(t&1){let e=w();m(0,"p-button",16),I("click",function(a){d(e);let n=c();return h(n.navBackward(a))}),u(1,Mt,2,2,"ng-template",null,1,F),p()}if(t&2){let e=c();r("ngClass",T(5,Vt,e.isBackwardNavDisabled()))("disabled",e.isBackwardNavDisabled())("text",!0)("buttonProps",e.prevButtonProps),y("aria-label",e.ariaPrevButtonLabel())}}function jt(t,l){t&1&&A(0)}function Qt(t,l){if(t&1&&(m(0,"div",5),u(1,jt,1,0,"ng-container",22),p()),t&2){let e=l.$implicit,i=l.index,a=c();r("ngClass",ee(6,st,a.totalShiftedItems*-1===a.value.length,i===0,a.clonedItemsForStarting.length-1===i)),y("aria-hidden",a.totalShiftedItems*-1!==a.value.length)("aria-label",a.ariaSlideNumber(i))("aria-roledescription",a.ariaSlideLabel()),s(),r("ngTemplateOutlet",a.itemTemplate||a._itemTemplate)("ngTemplateOutletContext",T(10,Oe,e))}}function zt(t,l){t&1&&A(0)}function Gt(t,l){if(t&1&&(m(0,"div",5),u(1,zt,1,0,"ng-container",22),p()),t&2){let e=l.$implicit,i=l.index,a=c();r("ngClass",ee(6,kt,a.firstIndex()<=i&&a.lastIndex()>=i,a.firstIndex()===i,a.lastIndex()===i)),y("aria-hidden",a.totalShiftedItems*-1!==a.value.length)("aria-label",a.ariaSlideNumber(i))("aria-roledescription",a.ariaSlideLabel()),s(),r("ngTemplateOutlet",a.itemTemplate||a._itemTemplate)("ngTemplateOutletContext",T(10,Oe,e))}}function Ht(t,l){t&1&&A(0)}function qt(t,l){if(t&1&&(m(0,"div",5),u(1,Ht,1,0,"ng-container",22),p()),t&2){let e=l.$implicit,i=l.index,a=c();r("ngClass",ee(3,st,a.totalShiftedItems*-1===a.numVisible,i===0,a.clonedItemsForFinishing.length-1===i)),s(),r("ngTemplateOutlet",a.itemTemplate||a._itemTemplate)("ngTemplateOutletContext",T(7,Oe,e))}}function Kt(t,l){t&1&&v(0,"ChevronRightIcon",20),t&2&&r("styleClass","carousel-next-icon")}function Ut(t,l){t&1&&v(0,"ChevronDownIcon",20),t&2&&r("styleClass","carousel-next-icon")}function Wt(t,l){if(t&1&&(H(0),u(1,Kt,1,1,"ChevronRightIcon",19)(2,Ut,1,1,"ChevronDownIcon",19),q()),t&2){let e=c(3);s(),r("ngIf",!e.isVertical()),s(),r("ngIf",e.isVertical())}}function Zt(t,l){}function Xt(t,l){t&1&&u(0,Zt,0,0,"ng-template")}function Yt(t,l){if(t&1&&(m(0,"span",25),u(1,Xt,1,0,null,15),p()),t&2){let e=c(3);s(),r("ngTemplateOutlet",e.nextIconTemplate||e._nextIconTemplate)}}function Jt(t,l){if(t&1&&u(0,Wt,3,2,"ng-container",17)(1,Yt,2,1,"span",24),t&2){let e=c(2);r("ngIf",!e.nextIconTemplate&&!e._nextIconTemplate&&!(e.nextButtonProps!=null&&e.nextButtonProps.icon)),s(),r("ngIf",e.nextIconTemplate||e._nextIconTemplate&&!(e.nextButtonProps!=null&&e.nextButtonProps.icon))}}function ei(t,l){if(t&1){let e=w();m(0,"p-button",23),I("click",function(a){d(e);let n=c();return h(n.navForward(a))}),u(1,Jt,2,2,"ng-template",null,1,F),p()}if(t&2){let e=c();r("ngClass",T(5,$t,e.isForwardNavDisabled()))("disabled",e.isForwardNavDisabled())("buttonProps",e.nextButtonProps)("text",!0),y("aria-label",e.ariaNextButtonLabel())}}function ti(t,l){if(t&1){let e=w();m(0,"li",5)(1,"button",27),I("click",function(a){let n=d(e).index,o=c(2);return h(o.onDotClick(a,n))}),p()()}if(t&2){let e=l.index,i=c(2);r("ngClass",T(9,Ft,i._page===e)),y("data-pc-section","indicator"),s(),O(i.indicatorStyleClass),r("ngClass","p-carousel-indicator-button")("ngStyle",i.indicatorStyle)("tabindex",i._page===e?0:-1),y("aria-label",i.ariaPageLabel(e+1))("aria-current",i._page===e?"page":void 0)}}function ii(t,l){if(t&1){let e=w();m(0,"ul",26,2),I("keydown",function(a){d(e);let n=c();return h(n.onIndicatorKeydown(a))}),u(2,ti,2,11,"li",10),p()}if(t&2){let e=c();O(e.indicatorsContentClass),r("ngClass","p-carousel-indicator-list")("ngStyle",e.indicatorsContentStyle),s(2),r("ngForOf",e.totalDotsArray())}}function ai(t,l){t&1&&A(0)}function ni(t,l){if(t&1&&(m(0,"div",28),we(1,1),u(2,ai,1,0,"ng-container",15),p()),t&2){let e=c();s(2),r("ngTemplateOutlet",e.footerTemplate||e._footerTemplate)}}var li=({dt:t})=>`
.p-carousel {
    display: flex;
    flex-direction: column;
}

.p-carousel-content-container {
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.p-carousel-content {
    display: flex;
    flex-direction: row;
    gap: ${t("carousel.content.gap")};
}

.p-carousel-content:dir(rtl) {
    flex-direction: row-reverse;
}

.p-carousel-viewport {
    overflow: hidden;
    width: 100%;
}

.p-carousel-item-list {
    display: flex;
    flex-direction: row;
}

.p-carousel-item-list:dir(rtl) {
    flex-direction: row-reverse;
}

.p-carousel-prev-button,
.p-carousel-next-button {
    align-self: center;
    flex-shrink: 0;
}

.p-carousel-indicator-list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    padding: ${t("carousel.indicator.list.padding")};
    gap: ${t("carousel.indicator.list.gap")};
    margin: 0;
    list-style: none;
}

.p-carousel-indicator-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${t("carousel.indicator.background")};
    width: ${t("carousel.indicator.width")};
    height: ${t("carousel.indicator.height")};
    border: 0 none;
    transition: background ${t("carousel.transition.duration")}, color ${t("carousel.transition.duration")}, outline-color ${t("carousel.transition.duration")}, box-shadow ${t("carousel.transition.duration")};
    outline-color: transparent;
    border-radius: ${t("carousel.indicator.border.radius")};
    padding: 0;
    margin: 0;
    user-select: none;
    cursor: pointer;
}

.p-carousel-indicator-button:focus-visible {
    box-shadow: ${t("carousel.indicator.focus.ring.shadow")};
    outline: ${t("carousel.indicator.focus.ring.width")} ${t("carousel.indicator.focus.ring.style")} ${t("carousel.indicator.focus.ring.color")};
    outline-offset: ${t("carousel.indicator.focus.ring.offset")};
}

.p-carousel-indicator-button:hover {
    background: ${t("carousel.indicator.hover.background")};
}

.p-carousel-indicator-active .p-carousel-indicator-button {
    background: ${t("carousel.indicator.active.background")};
}

.p-carousel-vertical .p-carousel-content {
    flex-direction: column;
}

.p-carousel-vertical .p-carousel-item-list {
    flex-direction: column;
    height: 100%;
}

.p-items-hidden .p-carousel-item {
    visibility: hidden;
}

.p-items-hidden .p-carousel-item.p-carousel-item-active {
    visibility: visible;
}
`,ri={root:({instance:t})=>["p-carousel p-component",{"p-carousel-vertical":t.isVertical(),"p-carousel-horizontal":!t.isVertical()}],header:"p-carousel-header",contentContainer:"p-carousel-content-container",content:"p-carousel-content",pcPrevButton:({instance:t})=>["p-carousel-prev-button",{"p-disabled":t.backwardIsDisabled}],viewport:"p-carousel-viewport",itemList:"p-carousel-item-list",itemClone:({index:t,value:l,totalShiftedItems:e,d_numVisible:i})=>["p-carousel-item p-carousel-item-clone",{"p-carousel-item-active":e*-1===l.length+i,"p-carousel-item-start":t===0,"p-carousel-item-end":l.slice(-1*i).length-1===t}],item:({instance:t,index:l})=>["p-carousel-item",{"p-carousel-item-active":t.firstIndex()<=l&&t.lastIndex()>=l,"p-carousel-item-start":t.firstIndex()===l,"p-carousel-item-end":t.lastIndex()===l}],pcNextButton:({instance:t})=>["p-carousel-next-button",{"p-disabled":t.forwardIsDisabled}],indicatorList:"p-carousel-indicator-list",indicator:({instance:t,index:l})=>["p-carousel-indicator",{"p-carousel-indicator-active":t.d_page===l}],indicatorButton:"p-carousel-indicator-button",footer:"p-carousel-footer"},ot=(()=>{class t extends ie{name="carousel";theme=li;classes=ri;static \u0275fac=(()=>{let e;return function(a){return(e||(e=z(t)))(a||t)}})();static \u0275prov=N({token:t,factory:t.\u0275fac})}return t})();var Ee=(()=>{class t extends Z{el;zone;get page(){return this._page}set page(e){this.isCreated&&e!==this._page&&(this.autoplayInterval&&this.stopAutoplay(),e>this._page&&e<=this.totalDots()-1?this.step(-1,e):e<this._page&&this.step(1,e)),this._page=e}get numVisible(){return this._numVisible}set numVisible(e){this._numVisible=e}get numScroll(){return this._numVisible}set numScroll(e){this._numScroll=e}responsiveOptions;orientation="horizontal";verticalViewPortHeight="300px";contentClass="";indicatorsContentClass="";indicatorsContentStyle;indicatorStyleClass="";indicatorStyle;get value(){return this._value}set value(e){this._value=e}circular=!1;showIndicators=!0;showNavigators=!0;autoplayInterval=0;style;styleClass;prevButtonProps={severity:"secondary",text:!0,rounded:!0};nextButtonProps={severity:"secondary",text:!0,rounded:!0};onPage=new V;itemsContainer;indicatorContent;headerFacet;footerFacet;_numVisible=1;_numScroll=1;_oldNumScroll=0;prevState={numScroll:0,numVisible:0,value:[]};defaultNumScroll=1;defaultNumVisible=1;_page=0;_value;carouselStyle;id;totalShiftedItems;isRemainingItemsAdded=!1;animationTimeout;translateTimeout;remainingItems=0;_items;startPos;documentResizeListener;clonedItemsForStarting;clonedItemsForFinishing;allowAutoplay;interval;isCreated;swipeThreshold=20;itemTemplate;headerTemplate;footerTemplate;previousIconTemplate;nextIconTemplate;_itemTemplate;_headerTemplate;_footerTemplate;_previousIconTemplate;_nextIconTemplate;window;_componentStyle=Q(ot);constructor(e,i){super(),this.el=e,this.zone=i,this.totalShiftedItems=this.page*this.numScroll*-1,this.window=this.document.defaultView}ngOnChanges(e){S(this.platformId)&&(e.value&&this.circular&&this._value&&this.setCloneItems(),this.isCreated&&(e.numVisible&&(this.responsiveOptions&&(this.defaultNumVisible=this.numVisible),this.isCircular()&&this.setCloneItems(),this.createStyle(),this.calculatePosition()),e.numScroll&&this.responsiveOptions&&(this.defaultNumScroll=this.numScroll))),this.cd.markForCheck()}templates;ngAfterContentInit(){this.id=_e("pn_id_"),S(this.platformId)&&(this.allowAutoplay=!!this.autoplayInterval,this.circular&&this.setCloneItems(),this.responsiveOptions&&(this.defaultNumScroll=this._numScroll,this.defaultNumVisible=this._numVisible),this.createStyle(),this.calculatePosition(),this.responsiveOptions&&this.bindDocumentListeners()),this.templates?.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"previousicon":this._previousIconTemplate=e.template;break;case"nexticon":this._nextIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}}),this.cd.detectChanges()}ngAfterContentChecked(){if(S(this.platformId)){let e=this.isCircular(),i=this.totalShiftedItems;if(this.value&&this.itemsContainer&&(this.prevState.numScroll!==this._numScroll||this.prevState.numVisible!==this._numVisible||this.prevState.value.length!==this.value.length)){this.autoplayInterval&&this.stopAutoplay(!1),this.remainingItems=(this.value.length-this._numVisible)%this._numScroll;let a=this._page;this.totalDots()!==0&&a>=this.totalDots()&&(a=this.totalDots()-1,this._page=a,this.onPage.emit({page:this.page})),i=a*this._numScroll*-1,e&&(i-=this._numVisible),a===this.totalDots()-1&&this.remainingItems>0?(i+=-1*this.remainingItems+this._numScroll,this.isRemainingItemsAdded=!0):this.isRemainingItemsAdded=!1,i!==this.totalShiftedItems&&(this.totalShiftedItems=i),this._oldNumScroll=this._numScroll,this.prevState.numScroll=this._numScroll,this.prevState.numVisible=this._numVisible,this.prevState.value=[...this._value],this.totalDots()>0&&this.itemsContainer.nativeElement&&(this.itemsContainer.nativeElement.style.transform=this.isVertical()?`translate3d(0, ${i*(100/this._numVisible)}%, 0)`:`translate3d(${i*(100/this._numVisible)}%, 0, 0)`),this.isCreated=!0,this.autoplayInterval&&this.isAutoplay()&&this.startAutoplay()}e&&(this.page===0?i=-1*this._numVisible:i===0&&(i=-1*this.value.length,this.remainingItems>0&&(this.isRemainingItemsAdded=!0)),i!==this.totalShiftedItems&&(this.totalShiftedItems=i))}}createStyle(){this.carouselStyle||(this.carouselStyle=this.renderer.createElement("style"),this.carouselStyle.type="text/css",ve(this.carouselStyle,"nonce",this.config?.csp()?.nonce),this.renderer.appendChild(this.document.head,this.carouselStyle));let e=`
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100/this.numVisible}%
			}
        `;if(this.responsiveOptions){this.responsiveOptions.sort((i,a)=>{let n=i.breakpoint,o=a.breakpoint,x=null;return n==null&&o!=null?x=-1:n!=null&&o==null?x=1:n==null&&o==null?x=0:typeof n=="string"&&typeof o=="string"?x=n.localeCompare(o,void 0,{numeric:!0}):x=n<o?-1:n>o?1:0,-1*x});for(let i=0;i<this.responsiveOptions.length;i++){let a=this.responsiveOptions[i];e+=`
                    @media screen and (max-width: ${a.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100/a.numVisible}%
                        }
                    }
                `}}this.carouselStyle.innerHTML=e}calculatePosition(){if(this.responsiveOptions){let e={numVisible:this.defaultNumVisible,numScroll:this.defaultNumScroll};if(typeof window<"u"){let i=window.innerWidth;for(let a=0;a<this.responsiveOptions.length;a++){let n=this.responsiveOptions[a];parseInt(n.breakpoint,10)>=i&&(e=n)}}if(this._numScroll!==e.numScroll){let i=this._page;i=Math.floor(i*this._numScroll/e.numScroll);let a=e.numScroll*this.page*-1;this.isCircular()&&(a-=e.numVisible),this.totalShiftedItems=a,this._numScroll=e.numScroll,this._page=i,this.onPage.emit({page:this.page})}this._numVisible!==e.numVisible&&(this._numVisible=e.numVisible,this.setCloneItems()),this.cd.markForCheck()}}setCloneItems(){this.clonedItemsForStarting=[],this.clonedItemsForFinishing=[],this.isCircular()&&(this.clonedItemsForStarting.push(...this.value.slice(-1*this._numVisible)),this.clonedItemsForFinishing.push(...this.value.slice(0,this._numVisible)))}firstIndex(){return this.isCircular()?-1*(this.totalShiftedItems+this.numVisible):this.totalShiftedItems*-1}lastIndex(){return this.firstIndex()+this.numVisible-1}totalDots(){return this.value?.length?Math.ceil((this.value.length-this._numVisible)/this._numScroll)+1:0}totalDotsArray(){let e=this.totalDots();return e<=0?[]:Array(e).fill(0)}isVertical(){return this.orientation==="vertical"}isCircular(){return this.circular&&this.value&&this.value.length>=this.numVisible}isAutoplay(){return this.autoplayInterval&&this.allowAutoplay}isForwardNavDisabled(){return this.isEmpty()||this._page>=this.totalDots()-1&&!this.isCircular()}isBackwardNavDisabled(){return this.isEmpty()||this._page<=0&&!this.isCircular()}isEmpty(){return!this.value||this.value.length===0}navForward(e,i){(this.isCircular()||this._page<this.totalDots()-1)&&this.step(-1,i),this.autoplayInterval&&this.stopAutoplay(),e&&e.cancelable&&e.preventDefault()}navBackward(e,i){(this.isCircular()||this._page!==0)&&this.step(1,i),this.autoplayInterval&&this.stopAutoplay(),e&&e.cancelable&&e.preventDefault()}onDotClick(e,i){let a=this._page;this.autoplayInterval&&this.stopAutoplay(),i>a?this.navForward(e,i):i<a&&this.navBackward(e,i)}onIndicatorKeydown(e){switch(e.code){case"ArrowRight":this.onRightKey();break;case"ArrowLeft":this.onLeftKey();break}}onRightKey(){let e=[...$(this.indicatorContent.nativeElement,'[data-pc-section="indicator"]')],i=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(i,i+1===e.length?e.length-1:i+1)}onLeftKey(){let e=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(e,e-1<=0?0:e-1)}onHomeKey(){let e=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(e,0)}onEndKey(){let e=[...$(this.indicatorContent.nativeElement,'[data-pc-section="indicator"]r')],i=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(i,e.length-1)}onTabKey(){let e=[...$(this.indicatorContent.nativeElement,'[data-pc-section="indicator"]')],i=e.findIndex(o=>fe(o,"data-p-highlight")===!0),a=W(this.indicatorContent.nativeElement,'[data-pc-section="indicator"] > button[tabindex="0"]'),n=e.findIndex(o=>o===a.parentElement);e[n].children[0].tabIndex="-1",e[i].children[0].tabIndex="0"}findFocusedIndicatorIndex(){let e=[...$(this.indicatorContent.nativeElement,'[data-pc-section="indicator"]')],i=W(this.indicatorContent.nativeElement,'[data-pc-section="indicator"] > button[tabindex="0"]');return e.findIndex(a=>a===i.parentElement)}changedFocusedIndicator(e,i){let a=[...$(this.indicatorContent.nativeElement,'[data-pc-section="indicator"]')];a[e].children[0].tabIndex="-1",a[i].children[0].tabIndex="0",a[i].children[0].focus()}step(e,i){let a=this.totalShiftedItems,n=this.isCircular();if(i!=null)a=this._numScroll*i*-1,n&&(a-=this._numVisible),this.isRemainingItemsAdded=!1;else{a+=this._numScroll*e,this.isRemainingItemsAdded&&(a+=this.remainingItems-this._numScroll*e,this.isRemainingItemsAdded=!1);let o=n?a+this._numVisible:a;i=Math.abs(Math.floor(o/this._numScroll))}n&&this.page===this.totalDots()-1&&e===-1?(a=-1*(this.value.length+this._numVisible),i=0):n&&this.page===0&&e===1?(a=0,i=this.totalDots()-1):i===this.totalDots()-1&&this.remainingItems>0&&(a+=this.remainingItems*-1-this._numScroll*e,this.isRemainingItemsAdded=!0),this.itemsContainer&&(this.itemsContainer.nativeElement.style.transform=this.isVertical()?`translate3d(0, ${a*(100/this._numVisible)}%, 0)`:`translate3d(${a*(100/this._numVisible)}%, 0, 0)`,this.itemsContainer.nativeElement.style.transition="transform 500ms ease 0s"),this.totalShiftedItems=a,this._page=i,this.onPage.emit({page:this.page}),this.cd.markForCheck()}startAutoplay(){this.interval=setInterval(()=>{this.totalDots()>0&&(this.page===this.totalDots()-1?this.step(-1,0):this.step(-1,this.page+1))},this.autoplayInterval),this.allowAutoplay=!0,this.cd.markForCheck()}stopAutoplay(e=!0){this.interval&&(clearInterval(this.interval),this.interval=void 0,e&&(this.allowAutoplay=!1)),this.cd.markForCheck()}isPlaying(){return!!this.interval}onTransitionEnd(){this.itemsContainer&&(this.itemsContainer.nativeElement.style.transition="",(this.page===0||this.page===this.totalDots()-1)&&this.isCircular()&&(this.itemsContainer.nativeElement.style.transform=this.isVertical()?`translate3d(0, ${this.totalShiftedItems*(100/this._numVisible)}%, 0)`:`translate3d(${this.totalShiftedItems*(100/this._numVisible)}%, 0, 0)`))}onTouchStart(e){let i=e.changedTouches[0];this.startPos={x:i.pageX,y:i.pageY}}onTouchMove(e){e.cancelable&&e.preventDefault()}onTouchEnd(e){let i=e.changedTouches[0];this.isVertical()?this.changePageOnTouch(e,i.pageY-this.startPos.y):this.changePageOnTouch(e,i.pageX-this.startPos.x)}changePageOnTouch(e,i){Math.abs(i)>this.swipeThreshold&&(i<0?this.navForward(e):this.navBackward(e))}ariaPrevButtonLabel(){return this.config.translation.aria?this.config.translation.aria.prevPageLabel:void 0}ariaSlideLabel(){return this.config.translation.aria?this.config.translation.aria.slide:void 0}ariaNextButtonLabel(){return this.config.translation.aria?this.config.translation.aria.nextPageLabel:void 0}ariaSlideNumber(e){return this.config.translation.aria?this.config.translation.aria.slideNumber.replace(/{slideNumber}/g,e):void 0}ariaPageLabel(e){return this.config.translation.aria?this.config.translation.aria.pageLabel.replace(/{page}/g,e):void 0}bindDocumentListeners(){S(this.platformId)&&(this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.window,"resize",e=>{this.calculatePosition()})))}unbindDocumentListeners(){S(this.platformId)&&this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}ngOnDestroy(){this.responsiveOptions&&this.unbindDocumentListeners(),this.autoplayInterval&&this.stopAutoplay()}static \u0275fac=function(i){return new(i||t)(C(se),C(Ae))};static \u0275cmp=k({type:t,selectors:[["p-carousel"]],contentQueries:function(i,a,n){if(i&1&&(_(n,Xe,5),_(n,Ye,5),_(n,ft,4),_(n,vt,4),_(n,_t,4),_(n,bt,4),_(n,It,4),_(n,te,4)),i&2){let o;g(o=f())&&(a.headerFacet=o.first),g(o=f())&&(a.footerFacet=o.first),g(o=f())&&(a.itemTemplate=o.first),g(o=f())&&(a.headerTemplate=o.first),g(o=f())&&(a.footerTemplate=o.first),g(o=f())&&(a.previousIconTemplate=o.first),g(o=f())&&(a.nextIconTemplate=o.first),g(o=f())&&(a.templates=o)}},viewQuery:function(i,a){if(i&1&&(B(xt,5),B(yt,5)),i&2){let n;g(n=f())&&(a.itemsContainer=n.first),g(n=f())&&(a.indicatorContent=n.first)}},inputs:{page:"page",numVisible:"numVisible",numScroll:"numScroll",responsiveOptions:"responsiveOptions",orientation:"orientation",verticalViewPortHeight:"verticalViewPortHeight",contentClass:"contentClass",indicatorsContentClass:"indicatorsContentClass",indicatorsContentStyle:"indicatorsContentStyle",indicatorStyleClass:"indicatorStyleClass",indicatorStyle:"indicatorStyle",value:"value",circular:[2,"circular","circular",b],showIndicators:[2,"showIndicators","showIndicators",b],showNavigators:[2,"showNavigators","showNavigators",b],autoplayInterval:[2,"autoplayInterval","autoplayInterval",M],style:"style",styleClass:"styleClass",prevButtonProps:"prevButtonProps",nextButtonProps:"nextButtonProps"},outputs:{onPage:"onPage"},features:[R([ot]),G,oe],ngContentSelectors:wt,decls:14,vars:23,consts:[["itemsContainer",""],["icon",""],["indicatorContent",""],["role","region",3,"ngClass","ngStyle"],["class","p-carousel-header",4,"ngIf"],[3,"ngClass"],[1,"p-carousel-content"],[3,"ngClass","disabled","text","buttonProps","click",4,"ngIf"],[1,"p-carousel-viewport",3,"touchend","touchstart","touchmove","ngStyle"],[1,"p-carousel-item-list",3,"transitionend"],[3,"ngClass",4,"ngFor","ngForOf"],["type","button",3,"ngClass","disabled","buttonProps","text","click",4,"ngIf"],[3,"ngClass","class","ngStyle","keydown",4,"ngIf"],["class","p-carousel-footer",4,"ngIf"],[1,"p-carousel-header"],[4,"ngTemplateOutlet"],[3,"click","ngClass","disabled","text","buttonProps"],[4,"ngIf"],["class","p-carousel-prev-icon",4,"ngIf"],[3,"styleClass",4,"ngIf"],[3,"styleClass"],[1,"p-carousel-prev-icon"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["type","button",3,"click","ngClass","disabled","buttonProps","text"],["class","next",4,"ngIf"],[1,"next"],[3,"keydown","ngClass","ngStyle"],["type","button",3,"click","ngClass","ngStyle","tabindex"],[1,"p-carousel-footer"]],template:function(i,a){if(i&1){let n=w();Me(Ct),m(0,"div",3),u(1,Ot,3,1,"div",4),m(2,"div",5)(3,"div",6),u(4,Lt,3,7,"p-button",7),m(5,"div",8),I("touchend",function(x){return d(n),h(a.onTouchEnd(x))})("touchstart",function(x){return d(n),h(a.onTouchStart(x))})("touchmove",function(x){return d(n),h(a.onTouchMove(x))}),m(6,"div",9,0),I("transitionend",function(){return d(n),h(a.onTransitionEnd())}),u(8,Qt,2,12,"div",10)(9,Gt,2,12,"div",10)(10,qt,2,9,"div",10),p()(),u(11,ei,3,7,"p-button",11),p(),u(12,ii,3,5,"ul",12),p(),u(13,ni,3,1,"div",13),p()}i&2&&(O(a.styleClass),r("ngClass",de(18,Tt,a.isVertical(),!a.isVertical()))("ngStyle",a.style),y("id",a.id),s(),r("ngIf",a.headerFacet||a.headerTemplate),s(),O(a.contentClass),r("ngClass","p-carousel-content-container"),s(),y("aria-live",a.allowAutoplay?"polite":"off"),s(),r("ngIf",a.showNavigators),s(),r("ngStyle",T(21,St,a.isVertical()?a.verticalViewPortHeight:"auto")),s(3),r("ngForOf",a.clonedItemsForStarting),s(),r("ngForOf",a.value),s(),r("ngForOf",a.clonedItemsForFinishing),s(),r("ngIf",a.showNavigators),s(),r("ngIf",a.showIndicators),s(),r("ngIf",a.footerFacet||a.footerTemplate||a._footerTemplate))},dependencies:[P,U,ce,L,E,j,ne,Ie,be,ae,ue,me,D],encapsulation:2,changeDetection:0})}return t})(),ct=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Y({type:t});static \u0275inj=X({imports:[Ee,D,D]})}return t})();var si=["header"],ci=["footer"],ui=["indicator"],mi=["caption"],pi=["closeicon"],di=["previousthumbnailicon"],hi=["nextthumbnailicon"],gi=["itempreviousicon"],fi=["itemnexticon"],vi=["item"],_i=["thumbnail"],bi=["mask"],Ii=["container"],xi=()=>({"p-galleria-mask p-overlay-mask p-overlay-mask-enter":!0}),yi=(t,l)=>({showTransitionParams:t,hideTransitionParams:l}),Ci=t=>({value:"visible",params:t});function wi(t,l){if(t&1){let e=w();m(0,"p-galleriaContent",7),I("@animation.start",function(a){d(e);let n=c(3);return h(n.onAnimationStart(a))})("@animation.done",function(a){d(e);let n=c(3);return h(n.onAnimationEnd(a))})("maskHide",function(){d(e);let a=c(3);return h(a.onMaskHide())})("activeItemChange",function(a){d(e);let n=c(3);return h(n.onActiveItemChange(a))}),p()}if(t&2){let e=c(3);r("@animation",T(9,Ci,de(6,yi,e.showTransitionOptions,e.hideTransitionOptions)))("value",e.value)("activeIndex",e.activeIndex)("numVisible",e.numVisibleLimit||e.numVisible)("ngStyle",e.containerStyle)("fullScreen",e.fullScreen)}}function Ti(t,l){if(t&1&&(m(0,"div",5,2),u(2,wi,1,11,"p-galleriaContent",6),p()),t&2){let e=c(2);O(e.maskClass),r("ngClass",J(6,xi)),y("role",e.fullScreen?"dialog":"region")("aria-modal",e.fullScreen?"true":void 0),s(2),r("ngIf",e.visible)}}function Si(t,l){if(t&1&&(m(0,"div",null,1),u(2,Ti,3,7,"div",4),p()),t&2){let e=c();s(2),r("ngIf",e.maskVisible)}}function Vi(t,l){if(t&1){let e=w();m(0,"p-galleriaContent",8),I("activeItemChange",function(a){d(e);let n=c();return h(n.onActiveItemChange(a))}),p()}if(t&2){let e=c();r("value",e.value)("activeIndex",e.activeIndex)("numVisible",e.numVisibleLimit||e.numVisible)}}var ki=["closeButton"],$i=(t,l,e)=>({"p-galleria p-component":!0,"p-galleria-fullscreen":t,"p-galleria-inset-indicators":l,"p-galleria-hover-navigators":e}),Fi=()=>({});function Di(t,l){t&1&&v(0,"TimesIcon",11),t&2&&r("styleClass","p-galleria-close-icon")}function Oi(t,l){}function Ei(t,l){t&1&&u(0,Oi,0,0,"ng-template")}function Pi(t,l){if(t&1){let e=w();m(0,"button",8),I("click",function(){d(e);let a=c(2);return h(a.maskHide.emit())}),u(1,Di,1,1,"TimesIcon",9)(2,Ei,1,0,null,10),p()}if(t&2){let e=c(2);y("aria-label",e.closeAriaLabel())("data-pc-section","closebutton"),s(),r("ngIf",!e.galleria.closeIconTemplate&&!e.galleria._closeIconTemplate),s(),r("ngTemplateOutlet",e.galleria.closeIconTemplate||e.galleria._closeIconTemplate)}}function Ni(t,l){if(t&1&&(m(0,"div",12),v(1,"p-galleriaItemSlot",13),p()),t&2){let e=c(2);s(),r("templates",e.galleria.templates)}}function Ai(t,l){if(t&1){let e=w();m(0,"p-galleriaThumbnails",14),I("onActiveIndexChange",function(a){d(e);let n=c(2);return h(n.onActiveIndexChange(a))})("stopSlideShow",function(){d(e);let a=c(2);return h(a.stopSlideShow())}),p()}if(t&2){let e=c(2);r("containerId",e.id)("value",e.value)("activeIndex",e.activeIndex)("templates",e.galleria.templates)("numVisible",e.numVisible)("responsiveOptions",e.galleria.responsiveOptions)("circular",e.galleria.circular)("isVertical",e.isVertical())("contentHeight",e.galleria.verticalThumbnailViewPortHeight)("showThumbnailNavigators",e.galleria.showThumbnailNavigators)("slideShowActive",e.slideShowActive)}}function Bi(t,l){if(t&1&&(m(0,"div",15),v(1,"p-galleriaItemSlot",16),p()),t&2){let e=c(2);s(),r("templates",e.galleria.templates)}}function Ri(t,l){if(t&1){let e=w();m(0,"div",1),u(1,Pi,3,4,"button",2)(2,Ni,2,1,"div",3),m(3,"div",4)(4,"p-galleriaItem",5),I("onActiveIndexChange",function(a){d(e);let n=c();return h(n.onActiveIndexChange(a))})("startSlideShow",function(){d(e);let a=c();return h(a.startSlideShow())})("stopSlideShow",function(){d(e);let a=c();return h(a.stopSlideShow())}),p(),u(5,Ai,1,11,"p-galleriaThumbnails",6),p(),u(6,Bi,2,1,"div",7),p()}if(t&2){let e=c();O(e.galleriaClass()),r("ngClass",ee(24,$i,e.galleria.fullScreen,e.galleria.showIndicatorsOnItem,e.galleria.showItemNavigatorsOnHover&&!e.galleria.fullScreen))("ngStyle",e.galleria.fullScreen?J(28,Fi):e.galleria.containerStyle)("pFocusTrapDisabled",!e.fullScreen),y("id",e.id)("role","region"),s(),r("ngIf",e.galleria.fullScreen),s(),r("ngIf",e.galleria.templates&&(e.galleria.headerFacet||e.galleria.headerTemplate)),s(),y("aria-live",e.galleria.autoPlay?"polite":"off"),s(),r("id",e.id)("value",e.value)("activeIndex",e.activeIndex)("circular",e.galleria.circular)("templates",e.galleria.templates)("showIndicators",e.galleria.showIndicators)("changeItemOnIndicatorHover",e.galleria.changeItemOnIndicatorHover)("indicatorFacet",e.galleria.indicatorFacet)("captionFacet",e.galleria.captionFacet)("showItemNavigators",e.galleria.showItemNavigators)("autoPlay",e.galleria.autoPlay)("slideShowActive",e.slideShowActive),s(),r("ngIf",e.galleria.showThumbnails),s(),r("ngIf",e.shouldRenderFooter())}}function Mi(t,l){t&1&&A(0)}function Li(t,l){if(t&1&&(H(0),u(1,Mi,1,0,"ng-container",1),q()),t&2){let e=c();s(),r("ngTemplateOutlet",e.contentTemplate)("ngTemplateOutletContext",e.context)}}var ji=t=>({"p-galleria-prev-button p-galleria-nav-button":!0,"p-disabled":t}),Qi=t=>({"p-galleria-next-button p-galleria-nav-button":!0,"p-disabled":t}),zi=t=>({"p-galleria-indicator":!0,"p-galleria-indicator-active":t});function Gi(t,l){t&1&&v(0,"ChevronLeftIcon",9),t&2&&r("styleClass","p-galleria-prev-icon")}function Hi(t,l){}function qi(t,l){t&1&&u(0,Hi,0,0,"ng-template")}function Ki(t,l){if(t&1){let e=w();m(0,"button",6),I("click",function(a){d(e);let n=c();return h(n.navBackward(a))})("focus",function(){d(e);let a=c();return h(a.onButtonFocus("left"))})("blur",function(){d(e);let a=c();return h(a.onButtonBlur("left"))}),u(1,Gi,1,1,"ChevronLeftIcon",7)(2,qi,1,0,null,8),p()}if(t&2){let e=c();r("ngClass",T(4,ji,e.isNavBackwardDisabled()))("disabled",e.isNavBackwardDisabled()),s(),r("ngIf",!e.galleria.itemPreviousIconTemplate&&!e.galleria._itemPreviousIconTemplate),s(),r("ngTemplateOutlet",e.galleria.itemPreviousIconTemplate||e.galleria._itemPreviousIconTemplate)}}function Ui(t,l){t&1&&v(0,"ChevronRightIcon",9),t&2&&r("styleClass","p-galleria-next-icon")}function Wi(t,l){}function Zi(t,l){t&1&&u(0,Wi,0,0,"ng-template")}function Xi(t,l){if(t&1){let e=w();m(0,"button",6),I("click",function(a){d(e);let n=c();return h(n.navForward(a))})("focus",function(){d(e);let a=c();return h(a.onButtonFocus("right"))})("blur",function(){d(e);let a=c();return h(a.onButtonBlur("right"))}),u(1,Ui,1,1,"ChevronRightIcon",7)(2,Zi,1,0,null,8),p()}if(t&2){let e=c();r("ngClass",T(4,Qi,e.isNavForwardDisabled()))("disabled",e.isNavForwardDisabled()),s(),r("ngIf",!e.galleria.itemNextIconTemplate&&!e.galleria._itemNextIconTemplate),s(),r("ngTemplateOutlet",e.galleria.itemNextIconTemplate||e.galleria._itemNextIconTemplate)}}function Yi(t,l){if(t&1&&(m(0,"div",10),v(1,"p-galleriaItemSlot",11),p()),t&2){let e=c();s(),r("item",e.activeItem)("templates",e.templates)}}function Ji(t,l){t&1&&v(0,"button",17)}function ea(t,l){if(t&1){let e=w();m(0,"li",14),I("click",function(){let a=d(e).index,n=c(2);return h(n.onIndicatorClick(a))})("mouseenter",function(){let a=d(e).index,n=c(2);return h(n.onIndicatorMouseEnter(a))})("keydown",function(a){let n=d(e).index,o=c(2);return h(o.onIndicatorKeyDown(a,n))}),u(1,Ji,1,0,"button",15),v(2,"p-galleriaItemSlot",16),p()}if(t&2){let e=l.index,i=c(2);r("ngClass",T(7,zi,i.isIndicatorItemActive(e))),y("aria-label",i.ariaPageLabel(e+1))("aria-selected",i.activeIndex===e)("aria-controls",i.id+"_item_"+e),s(),r("ngIf",!i.indicatorFacet&&!i.galleria.indicatorTemplate),s(),r("index",e)("templates",i.templates)}}function ta(t,l){if(t&1&&(m(0,"ul",12),u(1,ea,3,9,"li",13),p()),t&2){let e=c();s(),r("ngForOf",e.value)}}var ia=["itemsContainer"],aa=t=>({height:t}),na=t=>({"p-galleria-thumbnail-prev-button p-galleria-thumbnail-nav-button":!0,"p-disabled":t}),la=(t,l,e,i)=>({"p-galleria-thumbnail-item":!0,"p-galleria-thumbnail-item-current":t,"p-galleria-thumbnail-item-active":l,"p-galleria-thumbnail-item-start":e,"p-galleria-thumbnail-item-end":i}),ra=t=>({"p-galleria-thumbnail-next-button p-galleria-thumbnail-nav-button":!0,"p-disabled":t});function oa(t,l){t&1&&v(0,"ChevronLeftIcon",11),t&2&&r("styleClass","p-galleria-thumbnail-prev-icon")}function sa(t,l){t&1&&v(0,"ChevronUpIcon",11),t&2&&r("styleClass","p-galleria-thumbnail-prev-icon")}function ca(t,l){if(t&1&&(H(0),u(1,oa,1,1,"ChevronLeftIcon",10)(2,sa,1,1,"ChevronUpIcon",10),q()),t&2){let e=c(2);s(),r("ngIf",!e.isVertical),s(),r("ngIf",e.isVertical)}}function ua(t,l){}function ma(t,l){t&1&&u(0,ua,0,0,"ng-template")}function pa(t,l){if(t&1){let e=w();m(0,"button",7),I("click",function(a){d(e);let n=c();return h(n.navBackward(a))}),u(1,ca,3,2,"ng-container",8)(2,ma,1,0,null,9),p()}if(t&2){let e=c();r("ngClass",T(5,na,e.isNavBackwardDisabled()))("disabled",e.isNavBackwardDisabled()),y("aria-label",e.ariaPrevButtonLabel()),s(),r("ngIf",!e.galleria.previousThumbnailIconTemplate&&!e.galleria._previousThumbnailIconTemplate),s(),r("ngTemplateOutlet",e.galleria.previousThumbnailIconTemplate||e.galleria._previousThumbnailIconTemplate)}}function da(t,l){if(t&1){let e=w();m(0,"div",12),I("keydown",function(a){let n=d(e).index,o=c();return h(o.onThumbnailKeydown(a,n))}),m(1,"div",13),I("click",function(){let a=d(e).index,n=c();return h(n.onItemClick(a))})("touchend",function(){let a=d(e).index,n=c();return h(n.onItemClick(a))})("keydown.enter",function(){let a=d(e).index,n=c();return h(n.onItemClick(a))}),v(2,"p-galleriaItemSlot",14),p()()}if(t&2){let e=l.$implicit,i=l.index,a=c();r("ngClass",Ge(10,la,a.activeIndex===i,a.isItemActive(i),a.firstItemAciveIndex()===i,a.lastItemActiveIndex()===i)),y("aria-selected",a.activeIndex===i)("aria-controls",a.containerId+"_item_"+i)("data-pc-section","thumbnailitem")("data-p-active",a.activeIndex===i),s(),y("tabindex",a.activeIndex===i?0:-1)("aria-current",a.activeIndex===i?"page":void 0)("aria-label",a.ariaPageLabel(i+1)),s(),r("item",e)("templates",a.templates)}}function ha(t,l){t&1&&v(0,"ChevronRightIcon",16),t&2&&r("ngClass","p-galleria-thumbnail-next-icon")}function ga(t,l){t&1&&v(0,"ChevronDownIcon",16),t&2&&r("ngClass","p-galleria-thumbnail-next-icon")}function fa(t,l){if(t&1&&(H(0),u(1,ha,1,1,"ChevronRightIcon",15)(2,ga,1,1,"ChevronDownIcon",15),q()),t&2){let e=c(2);s(),r("ngIf",!e.isVertical),s(),r("ngIf",e.isVertical)}}function va(t,l){}function _a(t,l){t&1&&u(0,va,0,0,"ng-template")}function ba(t,l){if(t&1){let e=w();m(0,"button",7),I("click",function(a){d(e);let n=c();return h(n.navForward(a))}),u(1,fa,3,2,"ng-container",8)(2,_a,1,0,null,9),p()}if(t&2){let e=c();r("ngClass",T(5,ra,e.isNavForwardDisabled()))("disabled",e.isNavForwardDisabled()),y("aria-label",e.ariaNextButtonLabel()),s(),r("ngIf",!e.galleria.nextThumbnailIconTemplate&&!e.galleria._nextThumbnailIconTemplate),s(),r("ngTemplateOutlet",e.galleria.nextThumbnailIconTemplate||e.galleria._nextThumbnailIconTemplate)}}var Ia=({dt:t})=>`
.p-galleria {
    overflow: hidden;
    border-style: solid;
    border-width: ${t("galleria.border.width")};
    border-color: ${t("galleria.border.color")};
    border-radius: ${t("galleria.border.radius")};
}

.p-galleria-content {
    display: flex;
    flex-direction: column;
}

.p-galleria-items-container {
    display: flex;
    flex-direction: column;
    position: relative;
}

.p-galleria-items {
    position: relative;
    display: flex;
    height: 100%;
}

.p-galleria-nav-button {
    position: absolute;
    top: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: ${t("galleria.nav.button.background")};
    color: ${t("galleria.nav.button.color")};
    width: ${t("galleria.nav.button.size")};
    height: ${t("galleria.nav.button.size")};
    transition: background ${t("galleria.transition.duration")}, color ${t("galleria.transition.duration")}, outline-color ${t("galleria.transition.duration")}, box-shadow ${t("galleria.transition.duration")};
    margin: calc(-1 * calc(${t("galleria.nav.button.size")}) / 2) ${t("galleria.nav.button.gutter")} 0 ${t("galleria.nav.button.gutter")};
    padding: 0;
    user-select: none;
    border: 0 none;
    cursor: pointer;
    outline-color: transparent;
}

.p-galleria-nav-button:not(.p-disabled):hover {
    background: ${t("galleria.nav.button.hover.background")};
    color: ${t("galleria.nav.button.hover.color")};
}

.p-galleria-nav-button:not(.p-disabled):focus-visible {
    box-shadow: ${t("galleria.nav.button.focus.ring.shadow")};
    outline: ${t("galleria.nav.button.focus.ring.width")} ${t("galleria.nav.button.focus.ring.style")} ${t("galleria.nav.button.focus.ring.color")};
    outline-offset: ${t("galleria.nav.button.focus.ring.offset")};
}

.p-galleria-next-icon,
.p-galleria-prev-icon {
    font-size: ${t("galleria.nav.icon.size")};
    width: ${t("galleria.nav.icon.size")};
    height: ${t("galleria.nav.icon.size")};
}

.p-galleria-prev-button {
    border-radius: ${t("galleria.nav.button.prev.border.radius")};
    left: 0;
}

.p-galleria-next-button {
    border-radius: ${t("galleria.nav.button.next.border.radius")};
    right: 0;
}

.p-galleria-prev-button:dir(rtl) {
    left: auto;
    right: 0;
    transform: rotate(180deg);
}

.p-galleria-next-button:dir(rtl) {
    right: auto;
    left: 0;
    transform: rotate(180deg);
}

.p-galleria-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.p-galleria-hover-navigators .p-galleria-nav-button {
    pointer-events: none;
    opacity: 0;
    transition: opacity ${t("galleria.transition.duration")} ease-in-out;
}

.p-galleria-hover-navigators .p-galleria-items-container:hover .p-galleria-nav-button {
    pointer-events: all;
    opacity: 1;
}

.p-galleria-hover-navigators .p-galleria-items-container:hover .p-galleria-nav-button.p-disabled {
    pointer-events: none;
}

.p-galleria-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: ${t("galleria.caption.background")};
    color: ${t("galleria.caption.color")};
    padding: ${t("galleria.caption.padding")};
}

.p-galleria-thumbnails {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex-shrink: 0;
}

.p-galleria-thumbnail-nav-button {
    align-self: center;
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    margin: 0 ${t("galleria.thumbnail.nav.button.gutter")};
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
    background: transparent;
    color: ${t("galleria.thumbnail.nav.button.color")};
    width: ${t("galleria.thumbnail.nav.button.size")};
    height: ${t("galleria.thumbnail.nav.button.size")};
    transition: background ${t("galleria.transition.duration")}, color ${t("galleria.transition.duration")}, outline-color ${t("galleria.transition.duration")};
    outline-color: transparent;
    border-radius: ${t("galleria.thumbnail.nav.button.border.radius")};
}

.p-galleria-thumbnail-nav-button:hover {
    background: ${t("galleria.thumbnail.nav.button.hover.background")};
    color: ${t("galleria.thumbnail.nav.button.hover.color")};
}

.p-galleria-thumbnail-nav-button:focus-visible {
    box-shadow: ${t("galleria.thumbnail.nav.button.focus.ring.shadow")};
    outline: ${t("galleria.thumbnail.nav.button.focus.ring.width")} ${t("galleria.thumbnail.nav.button.focus.ring.style")} ${t("galleria.thumbnail.nav.button.focus.ring.color")};
    outline-offset: ${t("galleria.thumbnail.nav.button.focus.ring.offset")};
}

.p-galleria-thumbnail-nav-button .p-galleria-thumbnail-next-icon,
.p-galleria-thumbnail-nav-button .p-galleria-thumbnail-prev-icon {
    font-size: ${t("galleria.thumbnail.nav.button.icon.size")};
    width: ${t("galleria.thumbnail.nav.button.icon.size")};
    height: ${t("galleria.thumbnail.nav.button.icon.size")};
}

.p-galleria-thumbnails-content {
    display: flex;
    flex-direction: row;
    background: ${t("galleria.thumbnails.content.background")};
    padding: ${t("galleria.thumbnails.content.padding")};
}

.p-galleria-thumbnails-viewport {
    overflow: hidden;
    width: 100%;
}

.p-galleria:not(.p-galleria-thumbnails-right):not(.p-galleria-thumbnails-left) .p-galleria-thumbnail-prev-button:dir(rtl),
.p-galleria:not(.p-galleria-thumbnails-right):not(.p-galleria-thumbnails-left) .p-galleria-thumbnail-next-button:dir(rtl) {
    transform: rotate(180deg);
}

.p-galleria-thumbnail-items {
    display: flex;
}

.p-galleria-thumbnail-item {
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.5;
}

.p-galleria-thumbnail {
    outline-color: transparent;
}

.p-galleria-thumbnail-item:hover {
    opacity: 1;
    transition: opacity 0.3s;
}

.p-galleria-thumbnail-item-current {
    opacity: 1;
}

.p-galleria-thumbnails-left .p-galleria-content,
.p-galleria-thumbnails-right .p-galleria-content {
    flex-direction: row;
}

.p-galleria-thumbnails-left .p-galleria-items-container,
.p-galleria-thumbnails-right .p-galleria-items-container {
    flex-direction: row;
}

.p-galleria-thumbnails-left .p-galleria-items-container,
.p-galleria-thumbnails-top .p-galleria-items-container {
    order: 2;
}

.p-galleria-thumbnails-left .p-galleria-thumbnails,
.p-galleria-thumbnails-top .p-galleria-thumbnails {
    order: 1;
}

.p-galleria-thumbnails-left .p-galleria-thumbnails-content,
.p-galleria-thumbnails-right .p-galleria-thumbnails-content {
    flex-direction: column;
    flex-grow: 1;
}

.p-galleria-thumbnails-left .p-galleria-thumbnail-items,
.p-galleria-thumbnails-right .p-galleria-thumbnail-items {
    flex-direction: column;
    height: 100%;
}

.p-galleria-indicator-list {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${t("galleria.indicator.list.padding")};
    gap: ${t("galleria.indicator.list.gap")};
    margin: 0;
    list-style: none;
}

.p-galleria-indicator-button {
    display: inline-flex;
    align-items: center;
    background: ${t("galleria.indicator.button.background")};
    width: ${t("galleria.indicator.button.width")};
    height: ${t("galleria.indicator.button.height")};
    transition: background ${t("galleria.transition.duration")}, color ${t("galleria.transition.duration")}, outline-color ${t("galleria.transition.duration")}, box-shadow ${t("galleria.transition.duration")};
    outline-color: transparent;
    border-radius: ${t("galleria.indicator.button.border.radius")};
    margin: 0;
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
}

.p-galleria-indicator-button:hover {
    background: ${t("galleria.indicator.button.hover.background")};
}

.p-galleria-indicator-button:focus-visible {
    box-shadow: ${t("galleria.indicator.button.focus.ring.shadow")};
    outline: ${t("galleria.indicator.button.focus.ring.width")} ${t("galleria.indicator.button.focus.ring.style")} ${t("galleria.indicator.button.focus.ring.color")};
    outline-offset: ${t("galleria.indicator.button.focus.ring.offset")};
}

.p-galleria-indicator-active .p-galleria-indicator-button {
    background: ${t("galleria.indicator.button.active.background")};
}

.p-galleria-indicators-left .p-galleria-items-container,
.p-galleria-indicators-right .p-galleria-items-container {
    flex-direction: row;
    align-items: center;
}

.p-galleria-indicators-left .p-galleria-items,
.p-galleria-indicators-top .p-galleria-items {
    order: 2;
}

.p-galleria-indicators-left .p-galleria-indicator-list,
.p-galleria-indicators-top .p-galleria-indicator-list {
    order: 1;
}

.p-galleria-indicators-left .p-galleria-indicator-list,
.p-galleria-indicators-right .p-galleria-indicator-list {
    flex-direction: column;
}

.p-galleria-inset-indicators .p-galleria-indicator-list {
    position: absolute;
    display: flex;
    z-index: 1;
    background: ${t("galleria.inset.indicator.list.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-button {
    background: ${t("galleria.inset.indicator.button.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-button:hover {
    background: ${t("galleria.inset.indicator.button.hover.background")};
}

.p-galleria-inset-indicators .p-galleria-indicator-active .p-galleria-indicator-button {
    background: ${t("galleria.inset.indicator.button.active.background")};
}

.p-galleria-inset-indicators.p-galleria-indicators-top .p-galleria-indicator-list {
    top: 0;
    left: 0;
    width: 100%;
    align-items: flex-start;
}

.p-galleria-inset-indicators.p-galleria-indicators-right .p-galleria-indicator-list {
    right: 0;
    top: 0;
    height: 100%;
    align-items: flex-end;
}

.p-galleria-inset-indicators.p-galleria-indicators-bottom .p-galleria-indicator-list {
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: flex-end;
}

.p-galleria-inset-indicators.p-galleria-indicators-left .p-galleria-indicator-list {
    left: 0;
    top: 0;
    height: 100%;
    align-items: flex-start;
}

.p-galleria-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-galleria-close-button {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: ${t("galleria.close.button.gutter")};
    background: ${t("galleria.close.button.background")};
    color: ${t("galleria.close.button.color")};
    width: ${t("galleria.close.button.size")};
    height: ${t("galleria.close.button.size")};
    padding: 0;
    border: none;
    user-select: none;
    cursor: pointer;
    border-radius: ${t("galleria.close.button.border.radius")};
    outline-color: transparent;
    transition: background ${t("galleria.transition.duration")}, color ${t("galleria.transition.duration")}, outline-color ${t("galleria.transition.duration")};
}

.p-galleria-close-icon {
    font-size: ${t("galleria.close.button.icon.size")};
    width: ${t("galleria.close.button.icon.size")};
    height: ${t("galleria.close.button.icon.size")};
}

.p-galleria-close-button:hover {
    background: ${t("galleria.close.button.hover.background")};
    color: ${t("galleria.close.button.hover.color")};
}

.p-galleria-close-button:focus-visible {
    box-shadow: ${t("galleria.close.button.focus.ring.shadow")};
    outline: ${t("galleria.close.button.focus.ring.width")} ${t("galleria.close.button.focus.ring.style")} ${t("galleria.close.button.focus.ring.color")};
    outline-offset: ${t("galleria.close.button.focus.ring.offset")};
}

.p-galleria-mask .p-galleria-nav-button {
    position: fixed;
    top: 50%;
}

.p-galleria-enter-active {
    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.p-galleria-leave-active {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-galleria-enter-from,
.p-galleria-leave-to {
    opacity: 0;
    transform: scale(0.7);
}

.p-galleria-enter-active .p-galleria-nav-button {
    opacity: 0;
}

.p-items-hidden .p-galleria-thumbnail-item {
    visibility: hidden;
}

.p-items-hidden .p-galleria-thumbnail-item.p-galleria-thumbnail-item-active {
    visibility: visible;
}
`,xa={mask:"p-galleria-mask p-overlay-mask p-overlay-mask-enter",root:({instance:t})=>{let l=t.$attrs.showThumbnails&&t.getPositionClass("p-galleria-thumbnails",t.$attrs.thumbnailsPosition),e=t.$attrs.showIndicators&&t.getPositionClass("p-galleria-indicators",t.$attrs.indicatorsPosition);return["p-galleria p-component",{"p-galleria-fullscreen":t.$attrs.fullScreen,"p-galleria-inset-indicators":t.$attrs.showIndicatorsOnItem,"p-galleria-hover-navigators":t.$attrs.showItemNavigatorsOnHover&&!t.$attrs.fullScreen},l,e]},closeButton:"p-galleria-close-button",closeIcon:"p-galleria-close-icon",header:"p-galleria-header",content:"p-galleria-content",footer:"p-galleria-footer",itemsContainer:"p-galleria-items-container",items:"p-galleria-items",prevButton:({instance:t})=>["p-galleria-prev-button p-galleria-nav-button",{"p-disabled":t.isNavBackwardDisabled()}],prevIcon:"p-galleria-prev-icon",item:"p-galleria-item",nextButton:({instance:t})=>["p-galleria-next-button p-galleria-nav-button",{"p-disabled":t.isNavForwardDisabled()}],nextIcon:"p-galleria-next-icon",caption:"p-galleria-caption",indicatorList:"p-galleria-indicator-list",indicator:({instance:t,index:l})=>["p-galleria-indicator",{"p-galleria-indicator-active":t.isIndicatorItemActive(l)}],indicatorButton:"p-galleria-indicator-button",thumbnails:"p-galleria-thumbnails",thumbnailContent:"p-galleria-thumbnails-content",thumbnailPrevButton:({instance:t})=>["p-galleria-thumbnail-prev-button p-galleria-thumbnail-nav-button",{"p-disabled":t.isNavBackwardDisabled()}],thumbnailPrevIcon:"p-galleria-thumbnail-prev-icon",thumbnailsViewport:"p-galleria-thumbnails-viewport",thumbnailItems:"p-galleria-thumbnail-items",thumbnailItem:({instance:t,index:l,activeIndex:e})=>["p-galleria-thumbnail-item",{"p-galleria-thumbnail-item-current":e===l,"p-galleria-thumbnail-item-active":t.isItemActive(l),"p-galleria-thumbnail-item-start":t.firstItemAciveIndex()===l,"p-galleria-thumbnail-item-end":t.lastItemActiveIndex()===l}],thumbnail:"p-galleria-thumbnail",thumbnailNextButton:({instance:t})=>["p-galleria-thumbnail-next-button  p-galleria-thumbnail-nav-button",{"p-disabled":t.isNavForwardDisabled()}],thumbnailNextIcon:"p-galleria-thumbnail-next-icon"},ut=(()=>{class t extends ie{name="galleria";theme=Ia;classes=xa;static \u0275fac=(()=>{let e;return function(a){return(e||(e=z(t)))(a||t)}})();static \u0275prov=N({token:t,factory:t.\u0275fac})}return t})();var le=(()=>{class t extends Z{platformId;element;cd;get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e}fullScreen=!1;id;value;numVisible=3;responsiveOptions;showItemNavigators=!1;showThumbnailNavigators=!0;showItemNavigatorsOnHover=!1;changeItemOnIndicatorHover=!1;circular=!1;autoPlay=!1;shouldStopAutoplayByClick=!0;transitionInterval=4e3;showThumbnails=!0;thumbnailsPosition="bottom";verticalThumbnailViewPortHeight="300px";showIndicators=!1;showIndicatorsOnItem=!1;indicatorsPosition="bottom";baseZIndex=0;maskClass;containerClass;containerStyle;showTransitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.maskVisible&&(this.maskVisible=!0)}activeIndexChange=new V;visibleChange=new V;mask;container;_visible=!1;_activeIndex=0;headerTemplate;headerFacet;footerTemplate;footerFacet;indicatorTemplate;indicatorFacet;captionTemplate;captionFacet;_closeIconTemplate;closeIconTemplate;_previousThumbnailIconTemplate;previousThumbnailIconTemplate;_nextThumbnailIconTemplate;nextThumbnailIconTemplate;_itemPreviousIconTemplate;itemPreviousIconTemplate;_itemNextIconTemplate;itemNextIconTemplate;_itemTemplate;itemTemplate;_thumbnailTemplate;thumbnailTemplate;maskVisible=!1;numVisibleLimit=0;_componentStyle=Q(ut);constructor(e,i,a){super(),this.platformId=e,this.element=i,this.cd=a}templates;ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"header":this.headerFacet=e.template;break;case"footer":this.footerFacet=e.template;break;case"indicator":this.indicatorFacet=e.template;break;case"closeicon":this.closeIconTemplate=e.template;break;case"itemnexticon":this.itemNextIconTemplate=e.template;break;case"itempreviousicon":this.itemPreviousIconTemplate=e.template;break;case"previousthumbnailicon":this.previousThumbnailIconTemplate=e.template;break;case"nextthumbnailicon":this.nextThumbnailIconTemplate=e.template;break;case"caption":this.captionFacet=e.template;break;case"item":this.itemTemplate=e.template;break;case"thumbnail":this.thumbnailTemplate=e.template;break}})}ngOnChanges(e){super.ngOnChanges(e),e.value&&e.value.currentValue?.length<this.numVisible?this.numVisibleLimit=e.value.currentValue.length:this.numVisibleLimit=0}onMaskHide(){this.visible=!1,this.visibleChange.emit(!1)}onActiveItemChange(e){this.activeIndex!==e&&(this.activeIndex=e,this.activeIndexChange.emit(e))}onAnimationStart(e){switch(e.toState){case"visible":this.enableModality(),setTimeout(()=>{Ze(W(this.container.nativeElement,'[data-pc-section="closebutton"]'))},25);break;case"void":ke(this.mask?.nativeElement,"p-overlay-mask-leave");break}}onAnimationEnd(e){switch(e.toState){case"void":this.disableModality();break}}enableModality(){Ue(),this.cd.markForCheck(),this.mask&&Fe.set("modal",this.mask.nativeElement,this.baseZIndex||this.config.zIndex.modal)}disableModality(){We(),this.maskVisible=!1,this.cd.markForCheck(),this.mask&&Fe.clear(this.mask.nativeElement)}ngOnDestroy(){this.fullScreen&&ge(this.document.body,"p-overflow-hidden"),this.mask&&this.disableModality()}static \u0275fac=function(i){return new(i||t)(C(Ce),C(se),C(he))};static \u0275cmp=k({type:t,selectors:[["p-galleria"]],contentQueries:function(i,a,n){if(i&1&&(_(n,si,4),_(n,ci,4),_(n,ui,4),_(n,mi,4),_(n,pi,4),_(n,di,4),_(n,hi,4),_(n,gi,4),_(n,fi,4),_(n,vi,4),_(n,_i,4),_(n,te,4)),i&2){let o;g(o=f())&&(a.headerTemplate=o.first),g(o=f())&&(a.footerTemplate=o.first),g(o=f())&&(a.indicatorTemplate=o.first),g(o=f())&&(a.captionTemplate=o.first),g(o=f())&&(a._closeIconTemplate=o.first),g(o=f())&&(a._previousThumbnailIconTemplate=o.first),g(o=f())&&(a._nextThumbnailIconTemplate=o.first),g(o=f())&&(a._itemPreviousIconTemplate=o.first),g(o=f())&&(a._itemNextIconTemplate=o.first),g(o=f())&&(a._itemTemplate=o.first),g(o=f())&&(a._thumbnailTemplate=o.first),g(o=f())&&(a.templates=o)}},viewQuery:function(i,a){if(i&1&&(B(bi,5),B(Ii,5)),i&2){let n;g(n=f())&&(a.mask=n.first),g(n=f())&&(a.container=n.first)}},inputs:{activeIndex:"activeIndex",fullScreen:[2,"fullScreen","fullScreen",b],id:"id",value:"value",numVisible:[2,"numVisible","numVisible",M],responsiveOptions:"responsiveOptions",showItemNavigators:[2,"showItemNavigators","showItemNavigators",b],showThumbnailNavigators:[2,"showThumbnailNavigators","showThumbnailNavigators",b],showItemNavigatorsOnHover:[2,"showItemNavigatorsOnHover","showItemNavigatorsOnHover",b],changeItemOnIndicatorHover:[2,"changeItemOnIndicatorHover","changeItemOnIndicatorHover",b],circular:[2,"circular","circular",b],autoPlay:[2,"autoPlay","autoPlay",b],shouldStopAutoplayByClick:[2,"shouldStopAutoplayByClick","shouldStopAutoplayByClick",b],transitionInterval:[2,"transitionInterval","transitionInterval",M],showThumbnails:[2,"showThumbnails","showThumbnails",b],thumbnailsPosition:"thumbnailsPosition",verticalThumbnailViewPortHeight:"verticalThumbnailViewPortHeight",showIndicators:[2,"showIndicators","showIndicators",b],showIndicatorsOnItem:[2,"showIndicatorsOnItem","showIndicatorsOnItem",b],indicatorsPosition:"indicatorsPosition",baseZIndex:[2,"baseZIndex","baseZIndex",M],maskClass:"maskClass",containerClass:"containerClass",containerStyle:"containerStyle",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",visible:"visible"},outputs:{activeIndexChange:"activeIndexChange",visibleChange:"visibleChange"},standalone:!1,features:[R([ut]),G,oe],decls:3,vars:2,consts:[["windowed",""],["container",""],["mask",""],[4,"ngIf","ngIfElse"],[3,"ngClass","class",4,"ngIf"],[3,"ngClass"],[3,"value","activeIndex","numVisible","ngStyle","fullScreen","maskHide","activeItemChange",4,"ngIf"],[3,"maskHide","activeItemChange","value","activeIndex","numVisible","ngStyle","fullScreen"],[3,"activeItemChange","value","activeIndex","numVisible"]],template:function(i,a){if(i&1&&u(0,Si,3,1,"div",3)(1,Vi,1,3,"ng-template",null,0,F),i&2){let n=je(2);r("ngIf",a.fullScreen)("ngIfElse",n)}},dependencies:()=>[U,L,j,ya],encapsulation:2,data:{animation:[Ke("animation",[Ve("void => visible",[Se({transform:"scale(0.7)",opacity:0}),Te("{{showTransitionParams}}")]),Ve("visible => void",[Te("{{hideTransitionParams}}",Se({transform:"scale(0.7)",opacity:0}))])])]},changeDetection:0})}return t})(),ya=(()=>{class t extends Z{galleria;cd;differs;elementRef;get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e}value=[];numVisible;fullScreen;maskHide=new V;activeItemChange=new V;closeButton;id;_activeIndex=0;slideShowActive=!0;interval;styleClass;differ;constructor(e,i,a,n){super(),this.galleria=e,this.cd=i,this.differs=a,this.elementRef=n,this.id=this.galleria.id||_e("pn_id_"),this.differ=this.differs.find(this.galleria).create()}handleFullscreenChange(e){document?.fullscreenElement===this.elementRef.nativeElement?.children[0]?this.fullScreen=!0:this.fullScreen=!1}ngDoCheck(){if(S(this.galleria.platformId)){let e=this.differ.diff(this.galleria);e&&e.forEachItem.length>0&&this.cd.markForCheck()}}shouldRenderFooter(){return this.galleria.footerFacet&&this.galleria.templates.toArray().length>0||this.galleria.footerTemplate}galleriaClass(){let e=this.galleria.showThumbnails&&this.getPositionClass("p-galleria-thumbnails",this.galleria.thumbnailsPosition),i=this.galleria.showIndicators&&this.getPositionClass("p-galleria-indicators",this.galleria.indicatorsPosition);return(this.galleria.containerClass?this.galleria.containerClass+" ":"")+(e?e+" ":"")+(i?i+" ":"")}startSlideShow(){S(this.galleria.platformId)&&(this.interval=setInterval(()=>{let e=this.galleria.circular&&this.value.length-1===this.activeIndex?0:this.activeIndex+1;this.onActiveIndexChange(e),this.activeIndex=e},this.galleria.transitionInterval),this.slideShowActive=!0)}stopSlideShow(){this.galleria.autoPlay&&!this.galleria.shouldStopAutoplayByClick||(this.interval&&clearInterval(this.interval),this.slideShowActive=!1)}getPositionClass(e,i){let n=["top","left","bottom","right"].find(o=>o===i);return n?`${e}-${n}`:""}isVertical(){return this.galleria.thumbnailsPosition==="left"||this.galleria.thumbnailsPosition==="right"}onActiveIndexChange(e){this.activeIndex!==e&&(this.activeIndex=e,this.activeItemChange.emit(this.activeIndex))}closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}static \u0275fac=function(i){return new(i||t)(C(le),C(he),C(He),C(se))};static \u0275cmp=k({type:t,selectors:[["p-galleriaContent"]],viewQuery:function(i,a){if(i&1&&B(ki,5),i&2){let n;g(n=f())&&(a.closeButton=n.first)}},hostBindings:function(i,a){i&1&&I("fullscreenchange",function(o){return a.handleFullscreenChange(o)},!1,Be)},inputs:{activeIndex:"activeIndex",value:"value",numVisible:[2,"numVisible","numVisible",M],fullScreen:[2,"fullScreen","fullScreen",b]},outputs:{maskHide:"maskHide",activeItemChange:"activeItemChange"},standalone:!1,features:[G],decls:1,vars:1,consts:[["pFocusTrap","",3,"ngClass","ngStyle","class","pFocusTrapDisabled",4,"ngIf"],["pFocusTrap","",3,"ngClass","ngStyle","pFocusTrapDisabled"],["type","button","class","p-galleria-close-button",3,"click",4,"ngIf"],["class","p-galleria-header",4,"ngIf"],[1,"p-galleria-content"],[3,"onActiveIndexChange","startSlideShow","stopSlideShow","id","value","activeIndex","circular","templates","showIndicators","changeItemOnIndicatorHover","indicatorFacet","captionFacet","showItemNavigators","autoPlay","slideShowActive"],[3,"containerId","value","activeIndex","templates","numVisible","responsiveOptions","circular","isVertical","contentHeight","showThumbnailNavigators","slideShowActive","onActiveIndexChange","stopSlideShow",4,"ngIf"],["class","p-galleria-footer",4,"ngIf"],["type","button",1,"p-galleria-close-button",3,"click"],[3,"styleClass",4,"ngIf"],[4,"ngTemplateOutlet"],[3,"styleClass"],[1,"p-galleria-header"],["type","header",3,"templates"],[3,"onActiveIndexChange","stopSlideShow","containerId","value","activeIndex","templates","numVisible","responsiveOptions","circular","isVertical","contentHeight","showThumbnailNavigators","slideShowActive"],[1,"p-galleria-footer"],["type","footer",3,"templates"]],template:function(i,a){i&1&&u(0,Ri,7,29,"div",0),i&2&&r("ngIf",a.value&&a.value.length>0)},dependencies:()=>[U,L,E,j,$e,it,Pe,Ca,wa],encapsulation:2,changeDetection:0})}return t})(),Pe=(()=>{class t{templates;index;get item(){return this._item}shouldRender(){return this.contentTemplate||this.galleria._itemTemplate||this.galleria.itemTemplate||this.galleria.captionTemplate||this.galleria.captionTemplate||this.galleria.captionFacet||this.galleria.thumbnailTemplate||this.galleria._thumbnailTemplate||this.galleria.footerTemplate}galleria=Q(le);set item(e){this._item=e,this.templates&&this.templates?.toArray().length>0?this.templates.forEach(i=>{if(i.getType()===this.type)switch(this.type){case"item":case"caption":case"thumbnail":this.context={$implicit:this.item},this.contentTemplate=i.template;break;case"footer":this.context={$implicit:this.item},this.contentTemplate=i.template;break}}):this.getContentTemplate()}getContentTemplate(){switch(this.type){case"item":this.context={$implicit:this.item},this.contentTemplate=this.galleria._itemTemplate||this.galleria.itemTemplate;break;case"caption":this.context={$implicit:this.item},this.contentTemplate=this.galleria.captionTemplate||this.galleria.captionFacet;break;case"thumbnail":this.context={$implicit:this.item},this.contentTemplate=this.galleria.thumbnailTemplate||this.galleria._thumbnailTemplate;break;case"indicator":this.context={$implicit:this.index},this.contentTemplate=this.galleria.indicatorTemplate||this.galleria.indicatorFacet;break;case"footer":this.context={$implicit:this.item},this.contentTemplate=this.galleria.footerTemplate||this.galleria.footerFacet;break;default:this.context={$implicit:this.item},this.contentTemplate=this.galleria._itemTemplate||this.galleria.itemTemplate}}type;contentTemplate;context;_item;ngAfterContentInit(){this.templates&&this.templates.toArray().length>0?this.templates?.forEach(e=>{if(e.getType()===this.type)switch(this.type){case"item":case"caption":case"thumbnail":this.context={$implicit:this.item},this.contentTemplate=e.template;break;case"indicator":this.context={$implicit:this.index},this.contentTemplate=e.template;break;case"footer":this.context={$implicit:this.item},this.contentTemplate=e.template;break;default:this.context={$implicit:this.item},this.contentTemplate=e.template;break}}):this.getContentTemplate()}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=k({type:t,selectors:[["p-galleriaItemSlot"]],inputs:{templates:"templates",index:[2,"index","index",M],item:"item",type:"type"},standalone:!1,decls:1,vars:1,consts:[[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,a){i&1&&u(0,Li,2,2,"ng-container",0),i&2&&r("ngIf",a.shouldRender())},dependencies:[L,E],encapsulation:2,changeDetection:0})}return t})(),Ca=(()=>{class t{galleria;id;circular=!1;value;showItemNavigators=!1;showIndicators=!0;slideShowActive=!0;changeItemOnIndicatorHover=!0;autoPlay=!1;templates;indicatorFacet;captionFacet;startSlideShow=new V;stopSlideShow=new V;onActiveIndexChange=new V;get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e}get activeItem(){return this.value&&this.value[this._activeIndex]}_activeIndex=0;leftButtonFocused=!1;rightButtonFocused=!1;constructor(e){this.galleria=e}ngOnChanges({autoPlay:e}){e?.currentValue&&this.startSlideShow.emit(),e&&e.currentValue===!1&&this.stopTheSlideShow()}next(){let e=this.activeIndex+1,i=this.circular&&this.value.length-1===this.activeIndex?0:e;this.onActiveIndexChange.emit(i)}prev(){let e=this.activeIndex!==0?this.activeIndex-1:0,i=this.circular&&this.activeIndex===0?this.value.length-1:e;this.onActiveIndexChange.emit(i)}onButtonFocus(e){e==="left"?this.leftButtonFocused=!0:this.rightButtonFocused=!0}onButtonBlur(e){e==="left"?this.leftButtonFocused=!1:this.rightButtonFocused=!1}stopTheSlideShow(){this.slideShowActive&&this.stopSlideShow&&this.stopSlideShow.emit()}navForward(e){this.stopTheSlideShow(),this.next(),e&&e.cancelable&&e.preventDefault()}navBackward(e){this.stopTheSlideShow(),this.prev(),e&&e.cancelable&&e.preventDefault()}onIndicatorClick(e){this.stopTheSlideShow(),this.onActiveIndexChange.emit(e)}onIndicatorMouseEnter(e){this.changeItemOnIndicatorHover&&(this.stopTheSlideShow(),this.onActiveIndexChange.emit(e))}onIndicatorKeyDown(e,i){switch(e.code){case"Enter":case"Space":this.stopTheSlideShow(),this.onActiveIndexChange.emit(i),e.preventDefault();break;case"ArrowDown":case"ArrowUp":e.preventDefault();break;default:break}}isNavForwardDisabled(){return!this.circular&&this.activeIndex===this.value.length-1}isNavBackwardDisabled(){return!this.circular&&this.activeIndex===0}isIndicatorItemActive(e){return this.activeIndex===e}ariaSlideLabel(){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.slide:void 0}ariaSlideNumber(e){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.slideNumber.replace(/{slideNumber}/g,e):void 0}ariaPageLabel(e){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.pageLabel.replace(/{page}/g,e):void 0}static \u0275fac=function(i){return new(i||t)(C(le))};static \u0275cmp=k({type:t,selectors:[["p-galleriaItem"]],hostAttrs:[1,"p-galleria-items-container"],inputs:{id:"id",circular:[2,"circular","circular",b],value:"value",showItemNavigators:[2,"showItemNavigators","showItemNavigators",b],showIndicators:[2,"showIndicators","showIndicators",b],slideShowActive:[2,"slideShowActive","slideShowActive",b],changeItemOnIndicatorHover:[2,"changeItemOnIndicatorHover","changeItemOnIndicatorHover",b],autoPlay:[2,"autoPlay","autoPlay",b],templates:"templates",indicatorFacet:"indicatorFacet",captionFacet:"captionFacet",activeIndex:"activeIndex"},outputs:{startSlideShow:"startSlideShow",stopSlideShow:"stopSlideShow",onActiveIndexChange:"onActiveIndexChange"},standalone:!1,features:[oe],decls:7,vars:9,consts:[[1,"p-galleria-items"],["type","button","role","navigation",3,"ngClass","disabled","click","focus","blur",4,"ngIf"],["role","group",1,"p-galleria-item",3,"id"],["type","item",1,"p-galleria-item",3,"item","templates"],["class","p-galleria-caption",4,"ngIf"],["class","p-galleria-indicator-list",4,"ngIf"],["type","button","role","navigation",3,"click","focus","blur","ngClass","disabled"],[3,"styleClass",4,"ngIf"],[4,"ngTemplateOutlet"],[3,"styleClass"],[1,"p-galleria-caption"],["type","caption",3,"item","templates"],[1,"p-galleria-indicator-list"],["tabindex","0",3,"ngClass","click","mouseenter","keydown",4,"ngFor","ngForOf"],["tabindex","0",3,"click","mouseenter","keydown","ngClass"],["type","button","tabIndex","-1","class","p-galleria-indicator-button",4,"ngIf"],["type","indicator",3,"index","templates"],["type","button","tabIndex","-1",1,"p-galleria-indicator-button"]],template:function(i,a){i&1&&(m(0,"div",0),u(1,Ki,3,6,"button",1),m(2,"div",2),v(3,"p-galleriaItemSlot",3),p(),u(4,Xi,3,6,"button",1)(5,Yi,2,2,"div",4),p(),u(6,ta,2,1,"ul",5)),i&2&&(s(),r("ngIf",a.showItemNavigators),s(),r("id",a.id+"_item_"+a.activeIndex),y("aria-label",a.ariaSlideNumber(a.activeIndex+1))("aria-roledescription",a.ariaSlideLabel()),s(),r("item",a.activeItem)("templates",a.templates),s(),r("ngIf",a.showItemNavigators),s(),r("ngIf",a.captionFacet||a.galleria.captionTemplate),s(),r("ngIf",a.showIndicators))},dependencies:()=>[U,ce,L,E,ne,ae,Pe],encapsulation:2,changeDetection:0})}return t})(),wa=(()=>{class t{galleria;document;platformId;renderer;cd;containerId;value;isVertical=!1;slideShowActive=!1;circular=!1;responsiveOptions;contentHeight="300px";showThumbnailNavigators=!0;templates;onActiveIndexChange=new V;stopSlideShow=new V;itemsContainer;get numVisible(){return this._numVisible}set numVisible(e){this._numVisible=e,this._oldNumVisible=this.d_numVisible,this.d_numVisible=e}get activeIndex(){return this._activeIndex}set activeIndex(e){this._oldactiveIndex=this._activeIndex,this._activeIndex=e}index;startPos=null;thumbnailsStyle=null;sortedResponsiveOptions=null;totalShiftedItems=0;page=0;documentResizeListener;_numVisible=0;d_numVisible=0;_oldNumVisible=0;_activeIndex=0;_oldactiveIndex=0;constructor(e,i,a,n,o){this.galleria=e,this.document=i,this.platformId=a,this.renderer=n,this.cd=o}ngOnInit(){S(this.platformId)&&(this.createStyle(),this.responsiveOptions&&this.bindDocumentListeners())}ngAfterContentChecked(){let e=this.totalShiftedItems;(this._oldNumVisible!==this.d_numVisible||this._oldactiveIndex!==this._activeIndex)&&this.itemsContainer&&(this._activeIndex<=this.getMedianItemIndex()?e=0:this.value.length-this.d_numVisible+this.getMedianItemIndex()<this._activeIndex?e=this.d_numVisible-this.value.length:this.value.length-this.d_numVisible<this._activeIndex&&this.d_numVisible%2===0?e=this._activeIndex*-1+this.getMedianItemIndex()+1:e=this._activeIndex*-1+this.getMedianItemIndex(),e!==this.totalShiftedItems&&(this.totalShiftedItems=e),this.itemsContainer&&this.itemsContainer.nativeElement&&(this.itemsContainer.nativeElement.style.transform=this.isVertical?`translate3d(0, ${e*(100/this.d_numVisible)}%, 0)`:`translate3d(${e*(100/this.d_numVisible)}%, 0, 0)`),this._oldactiveIndex!==this._activeIndex&&(ge(this.itemsContainer.nativeElement,"p-items-hidden"),this.itemsContainer.nativeElement.style.transition="transform 500ms ease 0s"),this._oldactiveIndex=this._activeIndex,this._oldNumVisible=this.d_numVisible)}ngAfterViewInit(){S(this.platformId)&&this.calculatePosition()}createStyle(){this.thumbnailsStyle||(this.thumbnailsStyle=this.document.createElement("style"),this.document.body.appendChild(this.thumbnailsStyle));let e=`
            #${this.containerId} .p-galleria-thumbnail-item {
                flex: 1 0 ${100/this.d_numVisible}%
            }
        `;if(this.responsiveOptions){this.sortedResponsiveOptions=[...this.responsiveOptions],this.sortedResponsiveOptions.sort((i,a)=>{let n=i.breakpoint,o=a.breakpoint,x=null;return n==null&&o!=null?x=-1:n!=null&&o==null?x=1:n==null&&o==null?x=0:typeof n=="string"&&typeof o=="string"?x=n.localeCompare(o,void 0,{numeric:!0}):x=n<o?-1:n>o?1:0,-1*x});for(let i=0;i<this.sortedResponsiveOptions.length;i++){let a=this.sortedResponsiveOptions[i];e+=`
                    @media screen and (max-width: ${a.breakpoint}) {
                        #${this.containerId} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100/a.numVisible}%
                        }
                    }
                `}}this.thumbnailsStyle.innerHTML=e,ve(this.thumbnailsStyle,"nonce",this.galleria.config?.csp()?.nonce)}calculatePosition(){if(S(this.platformId)&&this.itemsContainer&&this.sortedResponsiveOptions){let e=window.innerWidth,i={numVisible:this._numVisible};for(let a=0;a<this.sortedResponsiveOptions.length;a++){let n=this.sortedResponsiveOptions[a];parseInt(n.breakpoint,10)>=e&&(i=n)}this.d_numVisible!==i.numVisible&&(this.d_numVisible=i.numVisible,this.cd.markForCheck())}}getTabIndex(e){return this.isItemActive(e)?0:null}navForward(e){this.stopTheSlideShow();let i=this._activeIndex+1;i+this.totalShiftedItems>this.getMedianItemIndex()&&(-1*this.totalShiftedItems<this.getTotalPageNumber()-1||this.circular)&&this.step(-1);let a=this.circular&&this.value.length-1===this._activeIndex?0:i;this.onActiveIndexChange.emit(a),e.cancelable&&e.preventDefault()}navBackward(e){this.stopTheSlideShow();let i=this._activeIndex!==0?this._activeIndex-1:0,a=i+this.totalShiftedItems;this.d_numVisible-a-1>this.getMedianItemIndex()&&(-1*this.totalShiftedItems!==0||this.circular)&&this.step(1);let n=this.circular&&this._activeIndex===0?this.value.length-1:i;this.onActiveIndexChange.emit(n),e.cancelable&&e.preventDefault()}onItemClick(e){this.stopTheSlideShow();let i=e;if(i!==this._activeIndex){let a=i+this.totalShiftedItems,n=0;i<this._activeIndex?(n=this.d_numVisible-a-1-this.getMedianItemIndex(),n>0&&-1*this.totalShiftedItems!==0&&this.step(n)):(n=this.getMedianItemIndex()-a,n<0&&-1*this.totalShiftedItems<this.getTotalPageNumber()-1&&this.step(n)),this.activeIndex=i,this.onActiveIndexChange.emit(this.activeIndex)}}onThumbnailKeydown(e,i){switch((e.code==="Enter"||e.code==="Space")&&(this.onItemClick(i),e.preventDefault()),e.code){case"ArrowRight":this.onRightKey();break;case"ArrowLeft":this.onLeftKey();break;case"Home":this.onHomeKey(),e.preventDefault();break;case"End":this.onEndKey(),e.preventDefault();break;case"ArrowUp":case"ArrowDown":e.preventDefault();break;case"Tab":this.onTabKey();break;default:break}}onRightKey(){let e=$(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"]'),i=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(i,i+1===e.length?e.length-1:i+1)}onLeftKey(){let e=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(e,e-1<=0?0:e-1)}onHomeKey(){let e=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(e,0)}onEndKey(){let e=$(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"]'),i=this.findFocusedIndicatorIndex();this.changedFocusedIndicator(i,e.length-1)}onTabKey(){let e=[...$(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"]')],i=e.findIndex(o=>fe(o,"data-p-active")===!0),a=W(this.itemsContainer.nativeElement,'[tabindex="0"]'),n=e.findIndex(o=>o===a.parentElement);e[n].children[0].tabIndex="-1",e[i].children[0].tabIndex="0"}findFocusedIndicatorIndex(){let e=[...$(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"]')],i=W(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"] > [tabindex="0"]');return e.findIndex(a=>a===i.parentElement)}changedFocusedIndicator(e,i){let a=$(this.itemsContainer.nativeElement,'[data-pc-section="thumbnailitem"]');a[e].children[0].tabIndex="-1",a[i].children[0].tabIndex="0",a[i].children[0].focus()}step(e){let i=this.totalShiftedItems+e;e<0&&-1*i+this.d_numVisible>this.value.length-1?i=this.d_numVisible-this.value.length:e>0&&i>0&&(i=0),this.circular&&(e<0&&this.value.length-1===this._activeIndex?i=0:e>0&&this._activeIndex===0&&(i=this.d_numVisible-this.value.length)),this.itemsContainer&&(ge(this.itemsContainer.nativeElement,"p-items-hidden"),this.itemsContainer.nativeElement.style.transform=this.isVertical?`translate3d(0, ${i*(100/this.d_numVisible)}%, 0)`:`translate3d(${i*(100/this.d_numVisible)}%, 0, 0)`,this.itemsContainer.nativeElement.style.transition="transform 500ms ease 0s"),this.totalShiftedItems=i}stopTheSlideShow(){this.slideShowActive&&this.stopSlideShow&&this.stopSlideShow.emit()}changePageOnTouch(e,i){i<0?this.navForward(e):this.navBackward(e)}getTotalPageNumber(){return this.value.length>this.d_numVisible?this.value.length-this.d_numVisible+1:0}getMedianItemIndex(){let e=Math.floor(this.d_numVisible/2);return this.d_numVisible%2?e:e-1}onTransitionEnd(){this.itemsContainer&&this.itemsContainer.nativeElement&&(ke(this.itemsContainer.nativeElement,"p-items-hidden"),this.itemsContainer.nativeElement.style.transition="")}onTouchEnd(e){let i=e.changedTouches[0];this.isVertical?this.changePageOnTouch(e,i.pageY-this.startPos.y):this.changePageOnTouch(e,i.pageX-this.startPos.x)}onTouchMove(e){e.cancelable&&e.preventDefault()}onTouchStart(e){let i=e.changedTouches[0];this.startPos={x:i.pageX,y:i.pageY}}isNavBackwardDisabled(){return!this.circular&&this._activeIndex===0||this.value.length<=this.d_numVisible}isNavForwardDisabled(){return!this.circular&&this._activeIndex===this.value.length-1||this.value.length<=this.d_numVisible}firstItemAciveIndex(){return this.totalShiftedItems*-1}lastItemActiveIndex(){return this.firstItemAciveIndex()+this.d_numVisible-1}isItemActive(e){return this.firstItemAciveIndex()<=e&&this.lastItemActiveIndex()>=e}bindDocumentListeners(){if(S(this.platformId)){let e=this.document.defaultView||"window";this.documentResizeListener=this.renderer.listen(e,"resize",()=>{this.calculatePosition()})}}unbindDocumentListeners(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}ngOnDestroy(){this.responsiveOptions&&this.unbindDocumentListeners(),this.thumbnailsStyle&&this.thumbnailsStyle.parentNode?.removeChild(this.thumbnailsStyle)}ariaPrevButtonLabel(){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.prevPageLabel:void 0}ariaNextButtonLabel(){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.nextPageLabel:void 0}ariaPageLabel(e){return this.galleria.config.translation.aria?this.galleria.config.translation.aria.pageLabel.replace(/{page}/g,e):void 0}static \u0275fac=function(i){return new(i||t)(C(le),C(qe),C(Ce),C(Re),C(he))};static \u0275cmp=k({type:t,selectors:[["p-galleriaThumbnails"]],viewQuery:function(i,a){if(i&1&&B(ia,5),i&2){let n;g(n=f())&&(a.itemsContainer=n.first)}},inputs:{containerId:"containerId",value:"value",isVertical:[2,"isVertical","isVertical",b],slideShowActive:[2,"slideShowActive","slideShowActive",b],circular:[2,"circular","circular",b],responsiveOptions:"responsiveOptions",contentHeight:"contentHeight",showThumbnailNavigators:"showThumbnailNavigators",templates:"templates",numVisible:"numVisible",activeIndex:"activeIndex"},outputs:{onActiveIndexChange:"onActiveIndexChange",stopSlideShow:"stopSlideShow"},standalone:!1,decls:8,vars:6,consts:[["itemsContainer",""],[1,"p-galleria-thumbnails"],[1,"p-galleria-thumbnails-content"],["type","button","pRipple","",3,"ngClass","disabled","click",4,"ngIf"],[1,"p-galleria-thumbnails-viewport",3,"ngStyle"],["role","tablist",1,"p-galleria-thumbnail-items",3,"transitionend","touchstart","touchmove"],[3,"ngClass","keydown",4,"ngFor","ngForOf"],["type","button","pRipple","",3,"click","ngClass","disabled"],[4,"ngIf"],[4,"ngTemplateOutlet"],[3,"styleClass",4,"ngIf"],[3,"styleClass"],[3,"keydown","ngClass"],[1,"p-galleria-thumbnail",3,"click","touchend","keydown.enter"],["type","thumbnail",3,"item","templates"],[3,"ngClass",4,"ngIf"],[3,"ngClass"]],template:function(i,a){if(i&1){let n=w();m(0,"div",1)(1,"div",2),u(2,pa,3,7,"button",3),m(3,"div",4)(4,"div",5,0),I("transitionend",function(){return d(n),h(a.onTransitionEnd())})("touchstart",function(x){return d(n),h(a.onTouchStart(x))})("touchmove",function(x){return d(n),h(a.onTouchMove(x))}),u(6,da,3,15,"div",6),p()(),u(7,ba,3,7,"button",3),p()()}i&2&&(s(2),r("ngIf",a.showThumbnailNavigators),s(),r("ngStyle",T(4,aa,a.isVertical?a.contentHeight:"")),s(3),r("ngForOf",a.value),s(),r("ngIf",a.showThumbnailNavigators))},dependencies:()=>[U,ce,L,E,j,Je,ne,me,ue,ae,Pe],encapsulation:2,changeDetection:0})}return t})(),mt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Y({type:t});static \u0275inj=X({imports:[P,D,$e,ne,me,ue,ae,et,tt,P,D]})}return t})();var re=class t{getData(){return[{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg",alt:"Description for Image 1",title:"Title 1"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg",alt:"Description for Image 2",title:"Title 2"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg",alt:"Description for Image 3",title:"Title 3"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg",alt:"Description for Image 4",title:"Title 4"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg",alt:"Description for Image 5",title:"Title 5"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria6s.jpg",alt:"Description for Image 6",title:"Title 6"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria7.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria7s.jpg",alt:"Description for Image 7",title:"Title 7"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria8.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria8s.jpg",alt:"Description for Image 8",title:"Title 8"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria9.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria9s.jpg",alt:"Description for Image 9",title:"Title 9"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria10s.jpg",alt:"Description for Image 10",title:"Title 10"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria11s.jpg",alt:"Description for Image 11",title:"Title 11"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria12.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria12s.jpg",alt:"Description for Image 12",title:"Title 12"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria13.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria13s.jpg",alt:"Description for Image 13",title:"Title 13"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria14.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria14s.jpg",alt:"Description for Image 14",title:"Title 14"},{itemImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria15.jpg",thumbnailImageSrc:"https://primefaces.org/cdn/primeng/images/galleria/galleria15s.jpg",alt:"Description for Image 15",title:"Title 15"}]}getImages(){return Promise.resolve(this.getData())}static \u0275fac=function(e){return new(e||t)};static \u0275prov=N({token:t,factory:t.\u0275fac})};var Va=["left"],ka=["right"];function $a(t,l){}function Fa(t,l){t&1&&u(0,$a,0,0,"ng-template")}function Da(t,l){}function Oa(t,l){t&1&&u(0,Da,0,0,"ng-template")}var Ea=({dt:t})=>`
.p-imagecompare {
    position: relative;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 16 / 9;
}

.p-imagecompare img {
    width: 100%;
    height: 100%;
    position: absolute;
}

.p-imagecompare img + img {
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
}

.p-imagecompare:dir(rtl) img + img {
    clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
}

.p-imagecompare-slider {
    position: relative;
    -webkit-appearance: none;
    width: calc(100% + ${t("imagecompare.handle.size")});
    height: 100%;
    margin-inline-start: calc(-1 * calc(${t("imagecompare.handle.size")} / 2));
    background-color: transparent;
    outline: none;
    transition: all ${t("imagecompare.handle.transition.duration")};
}

.p-imagecompare-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: ${t("imagecompare.handle.size")};
    width: ${t("imagecompare.handle.size")};
    background: ${t("imagecompare.handle.background")};
    border: ${t("imagecompare.handle.border.width")} solid ${t("imagecompare.handle.border.color")};
    border-radius: ${t("imagecompare.handle.border.radius")};
    background-size: contain;
    cursor: ew-resize;
    transition: all ${t("imagecompare.handle.transition.duration")};
}

.p-imagecompare-slider::-moz-range-thumb {
    height: ${t("imagecompare.handle.size")};
    width: ${t("imagecompare.handle.size")};
    background: ${t("imagecompare.handle.background")};
    border: ${t("imagecompare.handle.border.width")} ${t("imagecompare.handle.border.style")} ${t("imagecompare.handle.border.color")};
    border-radius: ${t("imagecompare.handle.border.radius")};
    background-size: contain;
    cursor: ew-resize;
}

.p-imagecompare-slider:focus-visible::-webkit-slider-thumb {
    box-shadow: ${t("imagecompare.handle.focus.ring.shadow")};
    outline: ${t("imagecompare.handle.focus.ring.width")} ${t("imagecompare.handle.focus.ring.style")} ${t("imagecompare.handle.focus.ring.color")};
    outline-offset: ${t("imagecompare.handle.focus.ring.offset")};
}

.p-imagecompare-slider:focus-visible::-moz-range-thumb {
    box-shadow: ${t("imagecompare.handle.focus.ring.shadow")};
    outline: ${t("imagecompare.handle.focus.ring.width")} ${t("imagecompare.handle.focus.ring.style")} ${t("imagecompare.handle.focus.ring.color")};
    outline-offset: ${t("imagecompare.handle.focus.ring.offset")};
}

.p-imagecompare-slider:hover {
    width: calc(100% + ${t("imagecompare.handle.hover.size")});
    margin-inline-start: calc(-1 * calc(${t("imagecompare.handle.hover.size")} / 2));
}

.p-imagecompare-slider:hover::-webkit-slider-thumb {
    background: ${t("imagecompare.handle.hover.background")};
    border-color: ${t("imagecompare.handle.hover.border.color")};
    height: ${t("imagecompare.handle.hover.size")};
    width: ${t("imagecompare.handle.hover.size")};
}

.p-imagecompare-slider:hover::-moz-range-thumb {
    background: ${t("imagecompare.handle.hover.background")};
    border-color: ${t("imagecompare.handle.hover.border.color")};
    height: ${t("imagecompare.handle.hover.size")};
    width: ${t("imagecompare.handle.hover.size")};
}
`,Pa={root:"p-imagecompare",slider:"p-imagecompare-slider"},pt=(()=>{class t extends ie{name="imagecompare";theme=Ea;classes=Pa;static \u0275fac=(()=>{let e;return function(a){return(e||(e=z(t)))(a||t)}})();static \u0275prov=N({token:t,factory:t.\u0275fac})}return t})();var Ne=(()=>{class t extends Z{isRTL=!1;tabindex;ariaLabelledby;ariaLabel;leftTemplate;rightTemplate;_leftTemplate;_rightTemplate;templates;_componentStyle=Q(pt);mutationObserver;ngOnInit(){super.ngOnInit(),this.updateDirection(),this.observeDirectionChanges()}ngAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"left":this._leftTemplate=e.template;break;case"right":this._rightTemplate=e.template;break}})}onSlide(e){let i=e.target.value,a=e.target.previousElementSibling;this.isRTL?a.style.clipPath=`polygon(${100-i}% 0, 100% 0, 100% 100%, ${100-i}% 100%)`:a.style.clipPath=`polygon(0 0, ${i}% 0, ${i}% 100%, 0 100%)`}updateDirection(){this.isRTL=!!this.el.nativeElement.closest('[dir="rtl"]')}observeDirectionChanges(){if(S(this.platformId)){let e=document?.documentElement,i={attributes:!0,attributeFilter:["dir"]};this.mutationObserver=new MutationObserver(()=>{this.updateDirection()}),this.mutationObserver.observe(e,i)}}ngOnDestroy(){this.mutationObserver&&this.mutationObserver.disconnect(),super.ngOnDestroy()}static \u0275fac=(()=>{let e;return function(a){return(e||(e=z(t)))(a||t)}})();static \u0275cmp=k({type:t,selectors:[["p-imageCompare"],["p-imagecompare"],["p-image-compare"]],contentQueries:function(i,a,n){if(i&1&&(_(n,Va,4),_(n,ka,4),_(n,te,4)),i&2){let o;g(o=f())&&(a.leftTemplate=o.first),g(o=f())&&(a.rightTemplate=o.first),g(o=f())&&(a.templates=o)}},hostAttrs:[1,"p-imagecompare"],hostVars:3,hostBindings:function(i,a){i&2&&y("tabindex",a.tabindex)("aria-labelledby",a.ariaLabelledby)("aria-label",a.ariaLabel)},inputs:{tabindex:"tabindex",ariaLabelledby:"ariaLabelledby",ariaLabel:"ariaLabel"},features:[R([pt]),G],decls:3,vars:4,consts:[[4,"ngTemplateOutlet"],["type","range","min","0","max","100","value","50",3,"input"]],template:function(i,a){i&1&&(u(0,Fa,1,0,null,0)(1,Oa,1,0,null,0),m(2,"input",1),I("input",function(o){return a.onSlide(o)}),p()),i&2&&(r("ngTemplateOutlet",a.leftTemplate||a._leftTemplate),s(),r("ngTemplateOutlet",a.rightTemplate||a._rightTemplate),s(),O(a.cx("slider")))},dependencies:[P,E,D],encapsulation:2,changeDetection:0})}return t})(),dt=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=Y({type:t});static \u0275inj=X({imports:[Ne,D,D]})}return t})();var Aa=()=>({"max-width":"640px"}),Ba=()=>({"left.px":5,"top.px":5});function Ra(t,l){if(t&1&&(m(0,"div",11)(1,"div",12)(2,"div",13),v(3,"img",14),m(4,"div",15),v(5,"p-tag",16),p()()(),m(6,"div",17),K(7),p(),m(8,"div",18)(9,"div",19),K(10),p(),m(11,"span"),v(12,"p-button",20)(13,"p-button",21),p()()()),t&2){let e=l.$implicit,i=c();s(3),Le("src","/images/product/",e.image,"",pe),r("alt",e.name),s(),r("ngStyle",J(9,Ba)),s(),r("value",e.inventoryStatus)("severity",i.getSeverity(e.inventoryStatus)),s(2),Qe(e.name),s(3),ze(" ","$"+e.price," "),s(2),r("outlined",!0)}}function Ma(t,l){t&1&&v(0,"img",22)}function La(t,l){t&1&&v(0,"img",23)}function ja(t,l){if(t&1&&v(0,"img",24),t&2){let e=l.$implicit;r("src",e.itemImageSrc,pe)}}function Qa(t,l){if(t&1&&v(0,"img",25),t&2){let e=l.$implicit;r("src",e.thumbnailImageSrc,pe)}}var ht=class t{constructor(l,e){this.productService=l;this.photoService=e}products;images;galleriaResponsiveOptions=[{breakpoint:"1024px",numVisible:5},{breakpoint:"960px",numVisible:4},{breakpoint:"768px",numVisible:3},{breakpoint:"560px",numVisible:1}];carouselResponsiveOptions=[{breakpoint:"1024px",numVisible:3,numScroll:3},{breakpoint:"768px",numVisible:2,numScroll:2},{breakpoint:"560px",numVisible:1,numScroll:1}];ngOnInit(){this.productService.getProductsSmall().then(l=>{this.products=l}),this.photoService.getImages().then(l=>{this.images=l})}getSeverity(l){switch(l){case"INSTOCK":return"success";case"LOWSTOCK":return"warn";case"OUTOFSTOCK":return"danger";default:return"success"}}static \u0275fac=function(e){return new(e||t)(C(xe),C(re))};static \u0275cmp=k({type:t,selectors:[["app-media-demo"]],features:[R([xe,re])],decls:26,vars:10,consts:[["item",""],["left",""],["right",""],["thumbnail",""],[1,"card"],[1,"font-semibold","text-xl","mb-6"],[3,"value","numVisible","numScroll","circular","responsiveOptions"],["src","https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg","alt","Image","width","250","preview",""],[1,"card","flex","flex-col"],[1,"sm:!w-96","shadow-lg","rounded-2xl"],[3,"value","responsiveOptions","containerStyle","numVisible"],[1,"border","border-surface","rounded-border","m-2","p-6"],[1,"mb-6"],[1,"relative","mx-auto"],[1,"w-full","rounded-border",3,"src","alt"],[1,"absolute","bg-black/70","rounded-border",3,"ngStyle"],[3,"value","severity"],[1,"mb-6","font-medium"],[1,"flex","justify-between","items-center"],[1,"mt-0","font-semibold","text-xl"],["icon","pi pi-heart","severity","secondary",3,"outlined"],["icon","pi pi-shopping-cart","styleClass","ml-2"],["src","https://primefaces.org/cdn/primevue/images/compare/island1.jpg"],["src","https://primefaces.org/cdn/primevue/images/compare/island2.jpg"],[2,"width","100%",3,"src"],[3,"src"]],template:function(e,i){e&1&&(m(0,"div",4)(1,"div",5),K(2,"Carousel"),p(),m(3,"p-carousel",6),u(4,Ra,14,10,"ng-template",null,0,F),p()(),m(6,"div",4)(7,"div",5),K(8,"Image"),p(),v(9,"p-image",7),p(),m(10,"div",8)(11,"div",5),K(12,"Image Compare"),p(),m(13,"p-imagecompare",9),u(14,Ma,1,0,"ng-template",null,1,F)(16,La,1,0,"ng-template",null,2,F),p()(),m(18,"div",4)(19,"div",5),K(20,"Galleria"),p(),m(21,"p-galleria",10),u(22,ja,1,1,"ng-template",null,0,F)(24,Qa,1,1,"ng-template",null,3,F),p()()),e&2&&(s(3),r("value",i.products)("numVisible",3)("numScroll",3)("circular",!1)("responsiveOptions",i.carouselResponsiveOptions),s(18),r("value",i.images)("responsiveOptions",i.galleriaResponsiveOptions)("containerStyle",J(9,Aa))("numVisible",5))},dependencies:[P,j,ct,Ee,Ie,be,mt,le,rt,lt,nt,at,dt,Ne],encapsulation:2})};export{ht as MediaDemo};
