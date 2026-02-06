import{a as B,b as j}from"./chunk-XKXBFP6V.js";import{Aa as M,Da as C,ta as o}from"./chunk-3YZBLOIS.js";import{y as S}from"./chunk-GZWLZB4Q.js";import{Gb as v,Hb as b,Ib as m,Kc as h,Tb as f,U as s,Ub as z,V as n,Va as d,_ as r,gb as c,hb as g,ja as l,kb as p,lc as D,vb as y,yb as u}from"./chunk-MKA3N2SS.js";var w=["*"],I=({dt:e})=>`
.p-overlaybadge {
    position: relative;
}

.p-overlaybadge .p-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
    outline-width: ${e("overlaybadge.outline.width")};
    outline-style: solid;
    outline-color: ${e("overlaybadge.outline.color")};
}
`,O={root:"p-overlaybadge"},F=(()=>{class e extends M{name="overlaybadge";theme=I;classes=O;static \u0275fac=(()=>{let a;return function(t){return(a||(a=l(e)))(t||e)}})();static \u0275prov=s({token:e,factory:e.\u0275fac})}return e})(),E=(()=>{class e extends C{styleClass;style;badgeSize;severity;value;badgeDisabled=!1;set size(a){this._size=a,!this.badgeSize&&this.size&&console.log("size property is deprecated and will removed in v18, use badgeSize instead.")}get size(){return this._size}_size;_componentStyle=r(F);constructor(){super()}static \u0275fac=function(i){return new(i||e)};static \u0275cmp=c({type:e,selectors:[["p-overlayBadge"],["p-overlay-badge"],["p-overlaybadge"]],inputs:{styleClass:"styleClass",style:"style",badgeSize:"badgeSize",severity:"severity",value:"value",badgeDisabled:[2,"badgeDisabled","badgeDisabled",h],size:"size"},features:[D([F]),p],ngContentSelectors:w,decls:3,vars:7,consts:[[1,"p-overlaybadge"],[3,"styleClass","badgeSize","severity","value","badgeDisabled"]],template:function(i,t){i&1&&(f(),v(0,"div",0),z(1),m(2,"p-badge",1),b()),i&2&&(d(2),u(t.style),y("styleClass",t.styleClass)("badgeSize",t.badgeSize)("severity",t.severity)("value",t.value)("badgeDisabled",t.badgeDisabled))},dependencies:[S,j,B,o],encapsulation:2,changeDetection:0})}return e})(),Q=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=g({type:e});static \u0275inj=n({imports:[E,o,o]})}return e})();export{E as a,Q as b};
