import { h as head, d as escape_html, e as ensure_array_like, a as attr_class, i as derived } from "../../../../chunks/vendor.js";
import { C as Card } from "../../../../chunks/Card.js";
import { I as Input } from "../../../../chunks/Input.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let orders = [
      {
        id: "ORD001",
        customer: "John Doe",
        email: "john@example.com",
        date: "2024-01-15",
        total: 125.99,
        status: "completed",
        items: [
          { name: "Wireless Mouse", quantity: 1, price: 29.99 },
          { name: "USB-C Hub", quantity: 2, price: 48 }
        ]
      },
      {
        id: "ORD002",
        customer: "Jane Smith",
        email: "jane@example.com",
        date: "2024-01-14",
        total: 89.5,
        status: "processing",
        items: [{ name: "Laptop Stand", quantity: 1, price: 89.5 }]
      },
      {
        id: "ORD003",
        customer: "Bob Johnson",
        email: "bob@example.com",
        date: "2024-01-13",
        total: 234,
        status: "shipped",
        items: [
          { name: "Mechanical Keyboard", quantity: 1, price: 159 },
          { name: "Mouse Pad", quantity: 1, price: 25 },
          { name: "Wrist Rest", quantity: 1, price: 50 }
        ]
      }
    ];
    let searchQuery = "";
    let filteredOrders = derived(() => orders.filter((order) => order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || order.email.toLowerCase().includes(searchQuery.toLowerCase())));
    function getStatusColor(status) {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "processing":
          return "bg-yellow-100 text-yellow-800";
        case "shipped":
          return "bg-blue-100 text-blue-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
    head("1ltwpmi", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manage Orders - Admin - FixTar</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Manage customer orders"/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900">Manage Orders</h1> <p class="mt-2 text-gray-600">${escape_html(orders.length)} total orders</p></div> <div class="mb-6">`);
    Input($$renderer2, {
      type: "search",
      placeholder: "Search by order ID, customer name, or email...",
      value: searchQuery,
      oninput: (e) => searchQuery = e.currentTarget.value,
      class: "max-w-md"
    });
    $$renderer2.push(`<!----></div> `);
    Card($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b"><th class="text-left py-3 px-4">Order ID</th><th class="text-left py-3 px-4">Customer</th><th class="text-left py-3 px-4">Date</th><th class="text-left py-3 px-4">Total</th><th class="text-left py-3 px-4">Status</th><th class="text-right py-3 px-4">Actions</th></tr></thead><tbody><!--[-->`);
        const each_array = ensure_array_like(filteredOrders());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let order = each_array[$$index];
          $$renderer3.push(`<tr class="border-b hover:bg-gray-50"><td class="py-3 px-4 font-medium">#${escape_html(order.id)}</td><td class="py-3 px-4"><div><p class="font-medium">${escape_html(order.customer)}</p> <p class="text-sm text-gray-600">${escape_html(order.email)}</p></div></td><td class="py-3 px-4 text-gray-600">${escape_html(order.date)}</td><td class="py-3 px-4">$${escape_html(order.total.toFixed(2))}</td><td class="py-3 px-4"><span${attr_class(`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`)}>${escape_html(order.status)}</span></td><td class="py-3 px-4 text-right"><button class="text-blue-600 hover:text-blue-800">View Details</button></td></tr>`);
        }
        $$renderer3.push(`<!--]--></tbody></table> `);
        if (filteredOrders().length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="text-center py-8 text-gray-500">No orders found matching your search.</div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
