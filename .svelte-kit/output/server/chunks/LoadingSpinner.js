import { d as escape_html, a as attr_class, b as stringify, i as derived } from "./vendor.js";
function LoadingSpinner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { $$slots, $$events, ...props } = $$props;
    const visible = derived(() => props.visible);
    const message = derived(() => props.message);
    const size = derived(() => props.size || "md");
    const variant = derived(() => props.variant || "overlay");
    const color = derived(() => props.color || "blue");
    const sizeClasses = derived(() => () => {
      switch (size()) {
        case "sm":
          return "w-4 h-4";
        case "lg":
          return "w-8 h-8";
        default:
          return "w-6 h-6";
      }
    });
    const colorClasses = derived(() => () => {
      switch (color()) {
        case "white":
          return "text-white";
        case "gray":
          return "text-neutral-400";
        default:
          return "text-brand-600";
      }
    });
    const textSizeClasses = derived(() => () => {
      switch (size()) {
        case "sm":
          return "text-xs";
        case "lg":
          return "text-base";
        default:
          return "text-sm";
      }
    });
    if (visible()) {
      $$renderer2.push("<!--[-->");
      if (variant() === "overlay") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm svelte-1bbvsau"><div class="flex flex-col items-center svelte-1bbvsau"><div class="relative svelte-1bbvsau"><div class="w-12 h-12 border-4 border-neutral-200 rounded-full svelte-1bbvsau"></div> <div class="absolute inset-0 w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin svelte-1bbvsau"></div></div> `);
        if (message()) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="mt-4 text-neutral-700 font-medium svelte-1bbvsau">${escape_html(message())}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="flex items-center justify-center svelte-1bbvsau"><div class="relative svelte-1bbvsau"><div${attr_class(`${stringify(sizeClasses()())} border-2 border-neutral-200 rounded-full`, "svelte-1bbvsau")}></div> <div${attr_class(`absolute inset-0 ${stringify(sizeClasses()())} border-2 ${stringify(colorClasses()())} rounded-full border-t-transparent animate-spin`, "svelte-1bbvsau")}></div></div> `);
        if (message()) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span${attr_class(`ml-2 ${stringify(textSizeClasses()())} ${stringify(colorClasses()())} font-medium`, "svelte-1bbvsau")}>${escape_html(message())}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  LoadingSpinner as L
};
