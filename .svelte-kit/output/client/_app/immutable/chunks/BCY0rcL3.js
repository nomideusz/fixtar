import{p as B,a as r,ak as D,i,P as E,d as t,e as F,m as o,g as G,l as u,c as l,Q as H,r as m,aj as I,x as J}from"./euVeJPvK.js";var K=o('<div class="absolute top-0 left-0 right-0 h-1 bg-brand-600"></div>'),L=o('<div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>'),M=o('<div class="absolute -inset-0.5 bg-brand-600/20 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10"></div>'),O=o('<div><!> <!> <!> <div class="relative z-10"><!></div></div>');function S(p,a){B(a,!0);let w=r(a,"padding",3,"md"),_=r(a,"shadow",3,"md"),n=r(a,"hover",3,!1),v=r(a,"glass",3,!1),g=r(a,"gradient",3,!1),x=r(a,"bordered",3,!1),y=r(a,"elevated",3,!1),C=r(a,"class",3,""),k=I(a,["$$slots","$$events","$$legacy","padding","shadow","hover","glass","gradient","bordered","elevated","class","children"]);const z={none:"",sm:"p-4",md:"p-6",lg:"p-8",xl:"p-12"},P={none:"",sm:"shadow-sm",md:"shadow-lg",lg:"shadow-xl",xl:"shadow-2xl"},j=J(()=>`
		relative overflow-hidden transition-all duration-300 rounded-3xl
		${v()?"bg-white/80 backdrop-blur-xl border border-white/20":"bg-white"}
		${g()?"bg-gradient-to-br from-white via-brand-50/20 to-neutral-50/20":""}
		${x()?"border border-neutral-200":""}
		${y()?"transform hover:-translate-y-2":""}
		${z[w()]}
		${P[_()]}
		${n()?"hover:shadow-2xl hover:scale-[1.02] cursor-pointer":""}
		${C()}
	`.replace(/\s+/g," ").trim());var d=O();D(d,()=>({class:G(j),...k}));var h=u(d);{var N=e=>{var s=K();t(e,s)};i(h,e=>{g()&&e(N)})}var b=l(h,2);{var Q=e=>{var s=L();t(e,s)};i(b,e=>{v()&&e(Q)})}var c=l(b,2);{var q=e=>{var s=M();t(e,s)};i(c,e=>{n()&&e(q)})}var f=l(c,2),A=u(f);E(A,()=>a.children??H),m(f),m(d),t(p,d),F()}export{S as C};
