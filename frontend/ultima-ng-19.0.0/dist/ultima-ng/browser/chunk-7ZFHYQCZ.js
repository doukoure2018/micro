import{Aa as C,Da as M,ta as a}from"./chunk-3YZBLOIS.js";import{l as b,q as v,y as S}from"./chunk-GZWLZB4Q.js";import{Ib as g,U as l,V as c,_ as d,gb as m,hb as p,ja as r,kb as u,lc as k,ub as h,vb as f,zb as y}from"./chunk-MKA3N2SS.js";import{a as o,b as s}from"./chunk-GAL4ENT6.js";var D=({dt:e})=>`
.p-skeleton {
    overflow: hidden;
    background: ${e("skeleton.background")};
    border-radius: ${e("skeleton.border.radius")};
}

.p-skeleton::after {
    content: "";
    animation: p-skeleton-animation 1.2s infinite;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), ${e("skeleton.animation.background")}, rgba(255, 255, 255, 0));
}

[dir='rtl'] .p-skeleton::after {
    animation-name: p-skeleton-animation-rtl;
}

.p-skeleton-circle {
    border-radius: 50%;
}

.p-skeleton-animation-none::after {
    animation: none;
}

@keyframes p-skeleton-animation {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}

@keyframes p-skeleton-animation-rtl {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(-100%);
    }
}
`,F={root:{position:"relative"}},z={root:({props:e})=>["p-skeleton p-component",{"p-skeleton-circle":e.shape==="circle","p-skeleton-animation-none":e.animation==="none"}]},w=(()=>{class e extends C{name="skeleton";theme=D;classes=z;inlineStyles=F;static \u0275fac=(()=>{let t;return function(i){return(t||(t=r(e)))(i||e)}})();static \u0275prov=l({token:e,factory:e.\u0275fac})}return e})();var I=(()=>{class e extends M{styleClass;style;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=d(w);containerClass(){return{"p-skeleton p-component":!0,"p-skeleton-circle":this.shape==="circle","p-skeleton-animation-none":this.animation==="none"}}get containerStyle(){let t=this._componentStyle?.inlineStyles.root,n;return this.size?n=s(o(o({},this.style),t),{width:this.size,height:this.size,borderRadius:this.borderRadius}):n=o(s(o({},t),{width:this.width,height:this.height,borderRadius:this.borderRadius}),this.style),n}static \u0275fac=(()=>{let t;return function(i){return(t||(t=r(e)))(i||e)}})();static \u0275cmp=m({type:e,selectors:[["p-skeleton"]],inputs:{styleClass:"styleClass",style:"style",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[k([w]),u],decls:1,vars:7,consts:[[3,"ngClass","ngStyle"]],template:function(n,i){n&1&&g(0,"div",0),n&2&&(y(i.styleClass),f("ngClass",i.containerClass())("ngStyle",i.containerStyle),h("data-pc-name","skeleton")("aria-hidden",!0)("data-pc-section","root"))},dependencies:[S,b,v,a],encapsulation:2,changeDetection:0})}return e})(),G=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=p({type:e});static \u0275inj=c({imports:[I,a,a]})}return e})();export{I as a,G as b};
