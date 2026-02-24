
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/account" | "/account/addresses" | "/account/addresses/new" | "/account/addresses/[id]" | "/account/addresses/[id]/edit" | "/account/favorites" | "/account/orders" | "/account/settings" | "/admin" | "/admin/baselinker" | "/admin/customers" | "/admin/orders" | "/admin/products" | "/api" | "/api/admin" | "/api/admin/clean-fake-data" | "/api/admin/products" | "/api/admin/products/status" | "/api/auth" | "/api/auth/debug" | "/api/auth/validate" | "/api/baselinker" | "/api/baselinker/orders" | "/api/baselinker/sync" | "/api/cart" | "/api/cart/merge" | "/api/cart/sync" | "/api/cron" | "/api/webhooks" | "/api/webhooks/payment" | "/auth" | "/auth/login" | "/auth/logout" | "/auth/register" | "/auth/validate" | "/cart" | "/categories" | "/checkout" | "/checkout/success" | "/contact" | "/deals" | "/docs" | "/orders" | "/orders/[id]" | "/products" | "/products/[slug]" | "/robots.txt" | "/search" | "/sitemap.xml" | "/wishlist" | "/xml-products" | "/xml-products/[id]";
		RouteParams(): {
			"/account/addresses/[id]": { id: string };
			"/account/addresses/[id]/edit": { id: string };
			"/orders/[id]": { id: string };
			"/products/[slug]": { slug: string };
			"/xml-products/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string; slug?: string };
			"/about": Record<string, never>;
			"/account": { id?: string };
			"/account/addresses": { id?: string };
			"/account/addresses/new": Record<string, never>;
			"/account/addresses/[id]": { id: string };
			"/account/addresses/[id]/edit": { id: string };
			"/account/favorites": Record<string, never>;
			"/account/orders": Record<string, never>;
			"/account/settings": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/baselinker": Record<string, never>;
			"/admin/customers": Record<string, never>;
			"/admin/orders": Record<string, never>;
			"/admin/products": Record<string, never>;
			"/api": Record<string, never>;
			"/api/admin": Record<string, never>;
			"/api/admin/clean-fake-data": Record<string, never>;
			"/api/admin/products": Record<string, never>;
			"/api/admin/products/status": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/debug": Record<string, never>;
			"/api/auth/validate": Record<string, never>;
			"/api/baselinker": Record<string, never>;
			"/api/baselinker/orders": Record<string, never>;
			"/api/baselinker/sync": Record<string, never>;
			"/api/cart": Record<string, never>;
			"/api/cart/merge": Record<string, never>;
			"/api/cart/sync": Record<string, never>;
			"/api/cron": Record<string, never>;
			"/api/webhooks": Record<string, never>;
			"/api/webhooks/payment": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/logout": Record<string, never>;
			"/auth/register": Record<string, never>;
			"/auth/validate": Record<string, never>;
			"/cart": Record<string, never>;
			"/categories": Record<string, never>;
			"/checkout": Record<string, never>;
			"/checkout/success": Record<string, never>;
			"/contact": Record<string, never>;
			"/deals": Record<string, never>;
			"/docs": Record<string, never>;
			"/orders": { id?: string };
			"/orders/[id]": { id: string };
			"/products": { slug?: string };
			"/products/[slug]": { slug: string };
			"/robots.txt": Record<string, never>;
			"/search": Record<string, never>;
			"/sitemap.xml": Record<string, never>;
			"/wishlist": Record<string, never>;
			"/xml-products": { id?: string };
			"/xml-products/[id]": { id: string }
		};
		Pathname(): "/" | "/about" | "/account" | "/account/addresses" | "/account/addresses/new" | `/account/addresses/${string}/edit` & {} | "/account/favorites" | "/account/orders" | "/account/settings" | "/admin" | "/admin/baselinker" | "/admin/customers" | "/admin/orders" | "/admin/products" | "/api/admin/clean-fake-data" | "/api/admin/products/status" | "/api/auth/debug" | "/api/auth/validate" | "/api/baselinker/orders" | "/api/baselinker/sync" | "/api/cart/merge" | "/api/cart/sync" | "/api/webhooks/payment" | "/auth/login" | "/auth/logout" | "/auth/register" | "/auth/validate" | "/cart" | "/categories" | "/checkout" | "/checkout/success" | "/contact" | "/deals" | "/docs" | `/orders/${string}` & {} | "/products" | `/products/${string}` & {} | "/robots.txt" | "/search" | "/sitemap.xml" | "/wishlist" | `/xml-products/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/favicon.png" | "/placeholder.jpg" | "/placeholder.svg" | "/robots.txt" | "/service-worker.js" | string & {};
	}
}