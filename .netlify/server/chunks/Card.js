import { l as attributes, m as clsx, i as derived } from "./vendor.js";
function Card($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      padding = "md",
      shadow = "md",
      hover = false,
      glass = false,
      gradient = false,
      bordered = false,
      elevated = false,
      class: className = "",
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const paddingClasses = { none: "", sm: "p-4", md: "p-6", lg: "p-8", xl: "p-12" };
    const shadowClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-lg",
      lg: "shadow-xl",
      xl: "shadow-2xl"
    };
    const baseClasses = derived(() => `
		relative overflow-hidden transition-all duration-300 rounded-3xl
		${glass ? "bg-white/80 backdrop-blur-xl border border-white/20" : "bg-white"}
		${gradient ? "bg-gradient-to-br from-white via-brand-50/20 to-neutral-50/20" : ""}
		${bordered ? "border border-neutral-200" : ""}
		${elevated ? "transform hover:-translate-y-2" : ""}
		${paddingClasses[padding]}
		${shadowClasses[shadow]}
		${hover ? "hover:shadow-2xl hover:scale-[1.02] cursor-pointer" : ""}
		${className}
	`.replace(/\s+/g, " ").trim());
    $$renderer2.push(`<div${attributes({ class: clsx(baseClasses()), ...restProps })}>`);
    if (gradient) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute top-0 left-0 right-0 h-1 bg-brand-600"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (glass) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (hover) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="absolute -inset-0.5 bg-brand-600/20 rounded-3xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300 -z-10"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative z-10">`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  Card as C
};
