import { a as attr_class, c as attr, b as stringify } from "./vendor.js";
function PageContainer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { $$slots, $$events, ...props } = $$props;
    const children = props.children;
    const fullWidth = props.fullWidth || false;
    const paddingX = props.paddingX || "px-2 xs:px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10";
    const paddingY = props.paddingY || "py-4 sm:py-5 md:py-6";
    const maxWidth = props.maxWidth || "max-w-7xl xl:max-w-screen-xl 2xl:max-w-screen-2xl";
    const bgColor = props.bgColor || "t-bg-transparent";
    const className = props.className || "";
    const id = props.id;
    const role = props.role;
    const ariaLabel = props.ariaLabel;
    const dataTestid = props.dataTestid;
    const containerWidthClass = fullWidth ? "w-full" : `${maxWidth} mx-auto`;
    $$renderer2.push(`<div${attr_class(`${stringify(bgColor)} ${stringify(paddingY)} ${stringify(className)} theme-transition`)}${attr("id", id)}${attr("role", role)}${attr("aria-label", ariaLabel)}${attr("data-testid", dataTestid)}><div${attr_class(`${stringify(containerWidthClass)} ${stringify(paddingX)}`)}>`);
    if (children) {
      $$renderer2.push("<!--[-->");
      children($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  PageContainer as P
};
