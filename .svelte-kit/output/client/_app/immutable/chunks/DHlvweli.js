import{p as L,a as f,i as b,ak as O,U as Q,d as i,e as W,c as n,g as s,m as d,aj as X,x as h,l as o,R as Y,r as l,v as x,I as g,w as _,H as Z,ae as $}from"./euVeJPvK.js";var ee=d('<span class="text-red-500 ml-1">*</span>'),re=d('<label class="block text-sm font-medium text-neutral-700 mb-2"> <!></label>'),te=d('<div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg></div>'),ae=d('<span class="text-red-500 ml-1">*</span>'),se=d("<label> <!></label>"),oe=d('<div class="flex items-center mt-2"><svg class="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p class="text-sm text-red-600"> </p></div>'),le=d('<p class="mt-2 text-sm text-neutral-500 flex items-center"><svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> </p>'),ie=d('<div class="relative w-full group"><!> <div class="relative"><!> <input/> <!> <div class="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-blue-500/20 group-focus-within:ring-offset-1"></div></div> <!></div>');function de(I,e){L(e,!0);let T=f(e,"variant",3,"default"),B=f(e,"size",3,"md"),q=f(e,"floating",3,!1),F=f(e,"class",3,""),w=f(e,"value",15,""),H=X(e,["$$slots","$$events","$$legacy","label","error","helperText","variant","size","icon","floating","class","id","value"]);const c=h(()=>e.id||`input-${Math.random().toString(36).substr(2,9)}`),N=h(()=>w()&&w().length>0),m=h(()=>q()&&e.label),P={sm:"px-3 py-2 text-sm",md:"px-4 py-3 text-base",lg:"px-6 py-4 text-lg"},R={default:`
			bg-white border border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,glass:`
			bg-white/80 backdrop-blur-md border border-white/30 
			focus:border-white/60 focus:ring-2 focus:ring-white/30
			hover:border-white/50
		`,outline:`
			bg-transparent border-2 border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,filled:`
			bg-neutral-50 border border-transparent 
			focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:bg-neutral-100
		`},S=h(()=>`
		w-full rounded-2xl transition-all duration-300 focus:outline-none
		${s(m)?"pt-6 pb-2":""}
		${P[B()]}
		${R[T()]}
		${e.error?"border-red-500 focus:border-red-500 focus:ring-red-500/20":""}
		${e.icon?"pl-12":""}
		${F()}
	`.replace(/\s+/g," ").trim()),U=h(()=>`
		absolute left-4 transition-all duration-300 cursor-text pointer-events-none
		${s(m)&&(s(N)||e.placeholder)?"top-2 text-xs text-neutral-500 font-medium":"top-1/2 -translate-y-1/2 text-neutral-400"}
		${e.error?"text-red-500":""}
	`);var k=ie(),M=o(k);{var V=t=>{var r=re(),a=o(r),u=n(a);{var C=v=>{var z=ee();i(v,z)};b(u,v=>{e.required&&v(C)})}l(r),x(()=>{g(r,"for",s(c)),_(a,`${e.label??""} `)}),i(t,r)};b(M,t=>{e.label&&!s(m)&&t(V)})}var p=n(M,2),j=o(p);{var A=t=>{var r=te(),a=o(r),u=o(a);l(a),l(r),x(()=>g(u,"d",e.icon)),i(t,r)};b(j,t=>{e.icon&&t(A)})}var y=n(j,2);O(y,()=>({id:e.id,class:s(S),"aria-invalid":!!e.error,"aria-describedby":e.error?`${s(c)}-error`:e.helperText?`${s(c)}-helper`:void 0,...H}),void 0,void 0,void 0,void 0,!0);var D=n(y,2);{var E=t=>{var r=se(),a=o(r),u=n(a);{var C=v=>{var z=ae();i(v,z)};b(u,v=>{e.required&&v(C)})}l(r),x(()=>{g(r,"for",s(c)),Z(r,1,$(s(U))),_(a,`${e.label??""} `)}),i(t,r)};b(D,t=>{s(m)&&t(E)})}Y(2),l(p);var G=n(p,2);{var J=t=>{var r=oe(),a=n(o(r),2),u=o(a,!0);l(a),l(r),x(()=>{g(a,"id",`${s(c)??""}-error`),_(u,e.error)}),i(t,r)},K=t=>{var r=le(),a=n(o(r));l(r),x(()=>{g(r,"id",`${s(c)??""}-helper`),_(a,` ${e.helperText??""}`)}),i(t,r)};b(G,t=>{e.error?t(J):e.helperText&&t(K,1)})}l(k),Q(y,w),i(I,k),W()}export{de as I};
