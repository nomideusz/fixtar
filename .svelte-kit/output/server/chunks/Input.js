import { c as attr, d as escape_html, l as attributes, m as clsx, a as attr_class, b as stringify, n as bind_props, i as derived } from "./vendor.js";
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      label,
      error,
      helperText,
      variant = "default",
      size = "md",
      icon,
      floating = false,
      class: className = "",
      id,
      value = "",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const inputId = derived(() => id || `input-${Math.random().toString(36).substr(2, 9)}`);
    const hasValue = derived(() => value && value.length > 0);
    const isFloating = derived(() => floating && label);
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg"
    };
    const variantClasses = {
      default: `
			bg-white border border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,
      glass: `
			bg-white/80 backdrop-blur-md border border-white/30 
			focus:border-white/60 focus:ring-2 focus:ring-white/30
			hover:border-white/50
		`,
      outline: `
			bg-transparent border-2 border-neutral-300 
			focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:border-neutral-400
		`,
      filled: `
			bg-neutral-50 border border-transparent 
			focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
			hover:bg-neutral-100
		`
    };
    const inputClasses = derived(() => `
		w-full rounded-2xl transition-all duration-300 focus:outline-none
		${isFloating() ? "pt-6 pb-2" : ""}
		${sizeClasses[size]}
		${variantClasses[variant]}
		${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
		${icon ? "pl-12" : ""}
		${className}
	`.replace(/\s+/g, " ").trim());
    const labelClasses = derived(() => `
		absolute left-4 transition-all duration-300 cursor-text pointer-events-none
		${isFloating() && (hasValue() || restProps.placeholder) ? "top-2 text-xs text-neutral-500 font-medium" : "top-1/2 -translate-y-1/2 text-neutral-400"}
		${error ? "text-red-500" : ""}
	`);
    $$renderer2.push(`<div class="relative w-full group">`);
    if (label && !isFloating()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", inputId())} class="block text-sm font-medium text-neutral-700 mb-2">${escape_html(label)} `);
      if (restProps.required) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-red-500 ml-1">*</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative">`);
    if (icon) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", icon)}></path></svg></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <input${attributes(
      {
        id,
        value,
        class: clsx(inputClasses()),
        "aria-invalid": !!error,
        "aria-describedby": error ? `${inputId()}-error` : helperText ? `${inputId()}-helper` : void 0,
        ...restProps
      },
      void 0,
      void 0,
      void 0,
      4
    )}/> `);
    if (isFloating()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", inputId())}${attr_class(clsx(labelClasses()))}>${escape_html(label)} `);
      if (restProps.required) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="text-red-500 ml-1">*</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-blue-500/20 group-focus-within:ring-offset-1"></div></div> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center mt-2"><svg class="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p${attr("id", `${stringify(inputId())}-error`)} class="text-sm text-red-600">${escape_html(error)}</p></div>`);
    } else if (helperText) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<p${attr("id", `${stringify(inputId())}-helper`)} class="mt-2 text-sm text-neutral-500 flex items-center"><svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(helperText)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
export {
  Input as I
};
