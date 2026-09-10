import {
  AuthService
} from "./chunk-4HMK5Z4R.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-J7Q6KLAF.js";
import "./chunk-ADJ2KLCM.js";
import {
  ApiService
} from "./chunk-BUOOEH3R.js";
import {
  CommonModule,
  Component,
  DecimalPipe,
  NgClass,
  NgForOf,
  NgIf,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction3,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFLJKOAY.js";

// src/app/features/tickets/ticket-list/ticket-list.component.ts
var _c0 = (a0, a1, a2) => ({ "neu-badge-vendido": a0, "neu-badge-usado": a1, "neu-badge-anulado": a2 });
function TicketListComponent_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 41);
  }
}
function TicketListComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "polyline", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.successMessage(), " ");
  }
}
function TicketListComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "path", 45)(3, "line", 46)(4, "line", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage(), " ");
  }
}
function TicketListComponent_div_60_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 51);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r3 = ctx.$implicit;
    \u0275\u0275property("value", u_r3.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", u_r3.name, " (", u_r3.email, ") ");
  }
}
function TicketListComponent_div_60_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "label", 48);
    \u0275\u0275text(2, "Vendedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 49);
    \u0275\u0275listener("ngModelChange", function TicketListComponent_div_60_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.sellerFilter.set($event));
    });
    \u0275\u0275elementStart(4, "option", 21);
    \u0275\u0275text(5, "Todos los Vendedores");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, TicketListComponent_div_60_option_6_Template, 2, 3, "option", 50);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r0.sellerFilter());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r0.users());
  }
}
function TicketListComponent_div_75_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275element(1, "div", 53);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando lista completa de tickets...");
    \u0275\u0275elementEnd()();
  }
}
function TicketListComponent_div_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 54)(1, "p");
    \u0275\u0275text(2, "No se encontraron tickets que coincidan con la combinaci\xF3n de filtros seleccionada.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 16);
    \u0275\u0275listener("click", function TicketListComponent_div_76_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.clearFilters());
    });
    \u0275\u0275text(4, "Restablecer Filtros");
    \u0275\u0275elementEnd()();
  }
}
function TicketListComponent_div_77_tr_23_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("personal", t_r6.quotaSource === "PERSONAL")("libre", t_r6.quotaSource === "LIBRE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r6.quotaSource, " ");
  }
}
function TicketListComponent_div_77_tr_23_button_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function TicketListComponent_div_77_tr_23_button_36_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const t_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openAnnulModal(t_r6));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "circle", 73)(3, "line", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Anular ");
    \u0275\u0275elementEnd();
  }
}
function TicketListComponent_div_77_tr_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "span", 58);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td")(8, "div", 59)(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "td")(12, "span", 60);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "span", 61);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "div", 62)(19, "span", 63);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275template(21, TicketListComponent_div_77_tr_23_span_21_Template, 2, 5, "span", 64);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "td")(23, "strong");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td")(27, "span", 65);
    \u0275\u0275text(28);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "td")(30, "div", 66)(31, "button", 67);
    \u0275\u0275listener("click", function TicketListComponent_div_77_tr_23_Template_button_click_31_listener() {
      const t_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openDetail(t_r6));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(32, "svg", 12);
    \u0275\u0275element(33, "path", 68)(34, "circle", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275text(35, " Ver ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(36, TicketListComponent_div_77_tr_23_button_36_Template, 5, 0, "button", 70);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("#", t_r6.ticketNumber || t_r6.id.slice(0, 6), "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r6.fourDigitCode || (t_r6.publicToken ? t_r6.publicToken.slice(0, 4) : "N/A"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(t_r6.buyerName || "Cliente General");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r6.sellerName || "Sistema / Vendedor");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-simple", t_r6.ticketType === "SIMPLE")("badge-comida", t_r6.ticketType === "CON_COMIDA");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r6.ticketType === "CON_COMIDA" ? "CON COMIDA" : "SIMPLE", " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", t_r6.saleSource === "ANTICIPADA" ? "ANTICIPADA" : "PUERTA", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", t_r6.quotaSource);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(25, 15, t_r6.pricePaid, "1.2-2"), "");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(18, _c0, t_r6.status === "VENDIDO", t_r6.status === "USADO_ENTRADA" || t_r6.status === "USADO_COMIDA", t_r6.status === "ANULADO"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r6.status, " ");
    \u0275\u0275advance(8);
    \u0275\u0275property("ngIf", t_r6.status !== "ANULADO");
  }
}
function TicketListComponent_div_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "table", 56)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "# Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "C\xF3digo 4 Digs");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Comprador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Vendedor");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Origen / Cuota");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "tbody");
    \u0275\u0275template(23, TicketListComponent_div_77_tr_23_Template, 37, 22, "tr", 57);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(23);
    \u0275\u0275property("ngForOf", ctx_r0.filteredTickets());
  }
}
function TicketListComponent_div_78_div_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 85)(1, "span", 86);
    \u0275\u0275text(2, "Origen de Cuota:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 71);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("personal", ((tmp_2_0 = ctx_r0.selectedTicket()) == null ? null : tmp_2_0.quotaSource) === "PERSONAL")("libre", ((tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.quotaSource) === "LIBRE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Cuota ", ((tmp_4_0 = ctx_r0.selectedTicket()) == null ? null : tmp_4_0.quotaSource) === "PERSONAL" ? "Personal de Vendedor" : "Compartida / Libre (Global)", " ");
  }
}
function TicketListComponent_div_78_button_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 97);
    \u0275\u0275listener("click", function TicketListComponent_div_78_button_58_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openAnnulModal(ctx_r0.selectedTicket()));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "circle", 73)(3, "line", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Anular Ticket ");
    \u0275\u0275elementEnd();
  }
}
function TicketListComponent_div_78_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275listener("click", function TicketListComponent_div_78_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDetail());
    })("keydown.escape", function TicketListComponent_div_78_Template_div_keydown_escape_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDetail());
    });
    \u0275\u0275elementStart(1, "div", 76);
    \u0275\u0275listener("click", function TicketListComponent_div_78_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    })("keydown", function TicketListComponent_div_78_Template_div_keydown_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 77)(3, "h2");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 78);
    \u0275\u0275listener("click", function TicketListComponent_div_78_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDetail());
    });
    \u0275\u0275text(6, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 79)(8, "div", 80)(9, "div", 81)(10, "span", 82);
    \u0275\u0275text(11, "C\xF3digo de 4 D\xEDgitos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span", 83);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 81)(15, "span", 82);
    \u0275\u0275text(16, "Estado Actual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 65);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 84)(20, "div", 85)(21, "span", 86);
    \u0275\u0275text(22, "Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "strong");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 85)(26, "span", 86);
    \u0275\u0275text(27, "Vendedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "strong");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 85)(31, "span", 86);
    \u0275\u0275text(32, "Tipo de Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 85)(36, "span", 86);
    \u0275\u0275text(37, "Canal de Venta:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span");
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(40, TicketListComponent_div_78_div_40_Template, 5, 5, "div", 87);
    \u0275\u0275elementStart(41, "div", 85)(42, "span", 86);
    \u0275\u0275text(43, "Monto Pagado:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "strong", 36);
    \u0275\u0275text(45);
    \u0275\u0275pipe(46, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 88)(48, "label", 89);
    \u0275\u0275text(49, "Enlace P\xFAblico para Validaci\xF3n:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 90);
    \u0275\u0275element(51, "input", 91);
    \u0275\u0275elementStart(52, "button", 92);
    \u0275\u0275listener("click", function TicketListComponent_div_78_Template_button_click_52_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.copyPublicUrl(ctx_r0.selectedTicket()));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(53, "svg", 12);
    \u0275\u0275element(54, "rect", 93)(55, "path", 94);
    \u0275\u0275elementEnd();
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(57, "div", 95);
    \u0275\u0275template(58, TicketListComponent_div_78_button_58_Template, 5, 0, "button", 96);
    \u0275\u0275elementStart(59, "button", 16);
    \u0275\u0275listener("click", function TicketListComponent_div_78_Template_button_click_59_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeDetail());
    });
    \u0275\u0275text(60, "Cerrar");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_13_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Detalle del Bono #", ((tmp_1_0 = ctx_r0.selectedTicket()) == null ? null : tmp_1_0.ticketNumber) || ((tmp_1_0 = ctx_r0.selectedTicket()) == null ? null : tmp_1_0.id == null ? null : tmp_1_0.id.slice(0, 6)), " ");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_2_0 = ctx_r0.selectedTicket()) == null ? null : tmp_2_0.fourDigitCode);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(16, _c0, ((tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.status) === "VENDIDO", ((tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.status) === "USADO_ENTRADA" || ((tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.status) === "USADO_COMIDA", ((tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.status) === "ANULADO"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", (tmp_4_0 = ctx_r0.selectedTicket()) == null ? null : tmp_4_0.status, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(((tmp_5_0 = ctx_r0.selectedTicket()) == null ? null : tmp_5_0.buyerName) || "Cliente General");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_6_0 = ctx_r0.selectedTicket()) == null ? null : tmp_6_0.sellerName) || "Sistema / Vendedor");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_7_0 = ctx_r0.selectedTicket()) == null ? null : tmp_7_0.ticketType) === "CON_COMIDA" ? "CON COMIDA" : "SIMPLE");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(((tmp_8_0 = ctx_r0.selectedTicket()) == null ? null : tmp_8_0.saleSource) === "ANTICIPADA" ? "ANTICIPADA" : "PUERTA");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_9_0 = ctx_r0.selectedTicket()) == null ? null : tmp_9_0.quotaSource);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(46, 13, (tmp_10_0 = ctx_r0.selectedTicket()) == null ? null : tmp_10_0.pricePaid, "1.2-2"), "");
    \u0275\u0275advance(6);
    \u0275\u0275property("value", "/api/tickets/public/" + ((tmp_11_0 = ctx_r0.selectedTicket()) == null ? null : tmp_11_0.publicToken));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r0.copiedPublicUrl() ? "\xA1Copiado! \u2713" : "Copiar Link", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_13_0 = ctx_r0.selectedTicket()) == null ? null : tmp_13_0.status) !== "ANULADO");
  }
}
function TicketListComponent_div_79_span_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 12);
    \u0275\u0275element(2, "circle", 73)(3, "line", 107)(4, "line", 108);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "Devoluci\xF3n de Cuota:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Se reintegrar\xE1 autom\xE1ticamente ");
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9, "1 cupo");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " a la cuota ");
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(((tmp_2_0 = ctx_r0.selectedTicket()) == null ? null : tmp_2_0.quotaSource) === "PERSONAL" ? "PERSONAL" : "COMPARTIDA / LIBRE");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" del vendedor (", (tmp_3_0 = ctx_r0.selectedTicket()) == null ? null : tmp_3_0.sellerName, "). ");
  }
}
function TicketListComponent_div_79_span_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 41);
  }
}
function TicketListComponent_div_79_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275listener("click", function TicketListComponent_div_79_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeAnnulModal());
    })("keydown.escape", function TicketListComponent_div_79_Template_div_keydown_escape_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeAnnulModal());
    });
    \u0275\u0275elementStart(1, "div", 98);
    \u0275\u0275listener("click", function TicketListComponent_div_79_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    })("keydown", function TicketListComponent_div_79_Template_div_keydown_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 99)(3, "h2");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 12);
    \u0275\u0275element(5, "path", 45)(6, "line", 46)(7, "line", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Anulaci\xF3n de Ticket / Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(9, "button", 78);
    \u0275\u0275listener("click", function TicketListComponent_div_79_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeAnnulModal());
    });
    \u0275\u0275text(10, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 79)(12, "div", 100)(13, "strong");
    \u0275\u0275text(14, "Importante:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " Al anular el bono ");
    \u0275\u0275elementStart(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275text(18, ", se cambiar\xE1 su estado a ");
    \u0275\u0275elementStart(19, "strong");
    \u0275\u0275text(20, "ANULADO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21, ". ");
    \u0275\u0275element(22, "br");
    \u0275\u0275template(23, TicketListComponent_div_79_span_23_Template, 14, 2, "span", 101);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 102)(25, "label", 103);
    \u0275\u0275text(26, "Motivo de Anulaci\xF3n (requerido):");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 104);
    \u0275\u0275listener("ngModelChange", function TicketListComponent_div_79_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.annulReason.set($event));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(28, "div", 95)(29, "button", 105);
    \u0275\u0275listener("click", function TicketListComponent_div_79_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeAnnulModal());
    });
    \u0275\u0275text(30, " Cancelar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "button", 106);
    \u0275\u0275listener("click", function TicketListComponent_div_79_Template_button_click_31_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.confirmAnnulTicket());
    });
    \u0275\u0275template(32, TicketListComponent_div_79_span_32_Template, 1, 0, "span", 5);
    \u0275\u0275elementStart(33, "span");
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(17);
    \u0275\u0275textInterpolate1("#", ((tmp_1_0 = ctx_r0.selectedTicket()) == null ? null : tmp_1_0.ticketNumber) || ((tmp_1_0 = ctx_r0.selectedTicket()) == null ? null : tmp_1_0.fourDigitCode), "");
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ((tmp_2_0 = ctx_r0.selectedTicket()) == null ? null : tmp_2_0.saleSource) === "ANTICIPADA" && ((tmp_2_0 = ctx_r0.selectedTicket()) == null ? null : tmp_2_0.quotaSource));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r0.annulReason());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.annulling());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.annulling());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.annulling());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.annulling() ? "Procesando Anulaci\xF3n..." : "Confirmar Anulaci\xF3n y Devolver Cupo");
  }
}
var TicketListComponent = class _TicketListComponent {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  loading = signal(true);
  errorMessage = signal("");
  successMessage = signal("");
  // Data lists
  tickets = signal([]);
  users = signal([]);
  // Filter signals (supports any combination of filters)
  searchQuery = signal("");
  statusFilter = signal("ALL");
  ticketTypeFilter = signal("ALL");
  saleSourceFilter = signal("ALL");
  sellerFilter = signal("ALL");
  // Modal states
  selectedTicket = signal(null);
  showDetailModal = signal(false);
  showAnnulModal = signal(false);
  annulReason = signal("");
  annulling = signal(false);
  copiedPublicUrl = signal(false);
  // Computed filtered list
  filteredTickets = computed(() => {
    const list = this.tickets();
    const query = this.searchQuery().trim().toLowerCase();
    const status = this.statusFilter();
    const type = this.ticketTypeFilter();
    const source = this.saleSourceFilter();
    const seller = this.sellerFilter();
    return list.filter((t) => {
      if (status !== "ALL" && t.status !== status) {
        return false;
      }
      if (type !== "ALL" && t.ticketType !== type) {
        return false;
      }
      if (source !== "ALL" && t.saleSource !== source) {
        return false;
      }
      if (seller !== "ALL" && t.sellerId !== seller) {
        return false;
      }
      if (query) {
        const fourCode = (t.fourDigitCode || "").toLowerCase();
        const ticketNum = (t.ticketNumber?.toString() || t.id || "").toLowerCase();
        const buyer = (t.buyerName || "").toLowerCase();
        const sellerName = (t.sellerName || "").toLowerCase();
        const token = (t.publicToken || "").toLowerCase();
        const matchesQuery = fourCode.includes(query) || ticketNum.includes(query) || buyer.includes(query) || sellerName.includes(query) || token.includes(query);
        if (!matchesQuery)
          return false;
      }
      return true;
    });
  });
  // Summary statistics for active filtered view
  totalFilteredCount = computed(() => this.filteredTickets().length);
  totalFilteredRevenue = computed(() => {
    return this.filteredTickets().filter((t) => t.status !== "ANULADO").reduce((sum, t) => sum + (t.pricePaid || 0), 0);
  });
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading.set(true);
    this.errorMessage.set("");
    if (this.authService.isAdmin()) {
      this.apiService.listUsers().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.users.set(res.data);
          }
        }
      });
    }
    this.apiService.listTickets().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.tickets.set(res.data);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error || "Error al obtener el listado de tickets");
      }
    });
  }
  clearFilters() {
    this.searchQuery.set("");
    this.statusFilter.set("ALL");
    this.ticketTypeFilter.set("ALL");
    this.saleSourceFilter.set("ALL");
    this.sellerFilter.set("ALL");
  }
  // Detail Modal methods
  openDetail(t) {
    this.selectedTicket.set(t);
    this.copiedPublicUrl.set(false);
    this.showDetailModal.set(true);
  }
  closeDetail() {
    this.showDetailModal.set(false);
    this.selectedTicket.set(null);
  }
  // Annulment Modal methods
  openAnnulModal(t) {
    this.selectedTicket.set(t);
    this.annulReason.set("");
    this.showAnnulModal.set(true);
  }
  closeAnnulModal() {
    this.showAnnulModal.set(false);
    this.annulReason.set("");
  }
  confirmAnnulTicket() {
    const t = this.selectedTicket();
    if (!t)
      return;
    this.annulling.set(true);
    this.errorMessage.set("");
    this.successMessage.set("");
    const reason = this.annulReason().trim() || "Anulaci\xF3n desde panel de administraci\xF3n de tickets";
    this.apiService.annulTicket(t.id, reason).subscribe({
      next: (res) => {
        this.annulling.set(false);
        if (res.success) {
          let quotaTypeNotice = "";
          if (t.saleSource === "ANTICIPADA" && t.quotaSource) {
            const quotaName = t.quotaSource === "PERSONAL" ? "PERSONAL" : "COMPARTIDA/LIBRE";
            quotaTypeNotice = ` Se ha devuelto 1 cupo a la cuota (${quotaName}) del vendedor.`;
          }
          this.successMessage.set(`Ticket #${t.ticketNumber || t.fourDigitCode} anulado con \xE9xito.${quotaTypeNotice}`);
          this.closeAnnulModal();
          this.closeDetail();
          this.loadData();
        } else {
          this.errorMessage.set(res.error || "No se pudo anular el ticket");
        }
      },
      error: (err) => {
        this.annulling.set(false);
        this.errorMessage.set(err.error?.error || "Error al procesar la anulaci\xF3n del ticket");
      }
    });
  }
  copyPublicUrl(t) {
    if (!t?.publicToken)
      return;
    const fullUrl = `${window.location.origin}/api/tickets/public/${encodeURIComponent(t.publicToken)}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }
  static \u0275fac = function TicketListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TicketListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TicketListComponent, selectors: [["app-ticket-list"]], decls: 80, vars: 20, consts: [[1, "tickets-container"], [1, "tickets-header"], [1, "subtitle"], [1, "header-actions"], [1, "neu-btn", "neu-btn-bordo", 3, "click", "disabled"], ["class", "neu-spinner", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], [1, "neu-card", "filter-panel"], [1, "filter-row-top"], [1, "search-box"], ["for", "ticketSearch"], ["viewBox", "0 0 24 24", 1, "icon"], ["cx", "11", "cy", "11", "r", "8"], ["d", "m21 21-4.35-4.35"], ["id", "ticketSearch", "type", "text", "placeholder", "Buscar por 4 d\xEDgitos, # bono, comprador o vendedor...", 1, "neu-input", 3, "ngModelChange", "ngModel"], [1, "neu-btn", 3, "click"], [1, "filter-grid"], [1, "filter-group"], ["for", "statusFilter"], ["id", "statusFilter", 1, "neu-input", "select-control", 3, "ngModelChange", "ngModel"], ["value", "ALL"], ["value", "VENDIDO"], ["value", "USADO_ENTRADA"], ["value", "USADO_COMIDA"], ["value", "ANULADO"], ["for", "typeFilter"], ["id", "typeFilter", 1, "neu-input", "select-control", 3, "ngModelChange", "ngModel"], ["value", "SIMPLE"], ["value", "CON_COMIDA"], ["for", "sourceFilter"], ["id", "sourceFilter", 1, "neu-input", "select-control", 3, "ngModelChange", "ngModel"], ["value", "ANTICIPADA"], ["value", "PUERTA"], ["class", "filter-group", 4, "ngIf"], [1, "filter-stats-bar"], [1, "text-success"], ["class", "loading-state", 4, "ngIf"], ["class", "neu-card empty-card", 4, "ngIf"], ["class", "neu-card table-responsive", 4, "ngIf"], ["class", "modal-backdrop", "tabindex", "-1", 3, "click", "keydown.escape", 4, "ngIf"], [1, "neu-spinner"], [1, "alert", "alert-success"], ["points", "20 6 9 17 4 12"], [1, "alert", "alert-danger"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], ["for", "sellerFilter"], ["id", "sellerFilter", 1, "neu-input", "select-control", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "loading-state"], [1, "spinner"], [1, "neu-card", "empty-card"], [1, "neu-card", "table-responsive"], [1, "tickets-table"], [4, "ngFor", "ngForOf"], [1, "code-chip"], [1, "buyer-info"], [1, "seller-label"], [1, "badge"], [1, "source-info"], [1, "badge", "badge-source"], ["class", "quota-tag", 3, "personal", "libre", 4, "ngIf"], [1, "neu-badge", 3, "ngClass"], [1, "action-buttons"], ["title", "Ver Detalle del Bono", 1, "neu-btn", 3, "click"], ["d", "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"], ["cx", "12", "cy", "12", "r", "3"], ["class", "neu-btn btn-annul", "title", "Anular bono y devolver cupo de cuota", 3, "click", 4, "ngIf"], [1, "quota-tag"], ["title", "Anular bono y devolver cupo de cuota", 1, "neu-btn", "btn-annul", 3, "click"], ["cx", "12", "cy", "12", "r", "10"], ["x1", "4.93", "y1", "4.93", "x2", "19.07", "y2", "19.07"], ["tabindex", "-1", 1, "modal-backdrop", 3, "click", "keydown.escape"], [1, "neu-card", "modal-card", 3, "click", "keydown"], [1, "modal-header"], [1, "btn-close", 3, "click"], [1, "modal-body"], [1, "code-highlight-box", "neu-card"], [1, "highlight-item"], [1, "hl-label"], [1, "hl-code"], [1, "detail-grid"], [1, "detail-group"], [1, "detail-label"], ["class", "detail-group", 4, "ngIf"], [1, "public-url-box"], ["for", "public-validation-url"], [1, "url-input-group"], ["id", "public-validation-url", "type", "text", "readonly", "", 1, "neu-input", 3, "value"], [1, "neu-btn", "neu-btn-bordo", 3, "click"], ["x", "9", "y", "9", "width", "13", "height", "13", "rx", "2", "ry", "2"], ["d", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"], [1, "modal-footer"], ["class", "neu-btn btn-annul", 3, "click", 4, "ngIf"], [1, "neu-btn", "btn-annul", 3, "click"], [1, "neu-card", "modal-card", "annul-modal", 3, "click", "keydown"], [1, "modal-header", "header-danger"], [1, "alert", "alert-warning"], [4, "ngIf"], [1, "form-group"], ["for", "reasonInput"], ["id", "reasonInput", "type", "text", "placeholder", "Ej: Error en los datos del comprador, devoluci\xF3n solicitada...", 1, "neu-input", 3, "ngModelChange", "ngModel"], [1, "neu-btn", 3, "click", "disabled"], [1, "neu-btn", "btn-annul", 3, "click", "disabled"], ["x1", "12", "y1", "16", "x2", "12", "y2", "12"], ["x1", "12", "y1", "8", "x2", "12.01", "y2", "8"]], template: function TicketListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div")(3, "h1");
      \u0275\u0275text(4, "Gesti\xF3n e Historial de Bonos / Tickets");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 2);
      \u0275\u0275text(6, "Consulta general, filtrado multinivel y anulaci\xF3n de entradas emitidas");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3)(8, "button", 4);
      \u0275\u0275listener("click", function TicketListComponent_Template_button_click_8_listener() {
        return ctx.loadData();
      });
      \u0275\u0275template(9, TicketListComponent_span_9_Template, 1, 0, "span", 5);
      \u0275\u0275elementStart(10, "span");
      \u0275\u0275text(11, "Refrescar Lista");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(12, TicketListComponent_div_12_Template, 4, 1, "div", 6)(13, TicketListComponent_div_13_Template, 6, 1, "div", 7);
      \u0275\u0275elementStart(14, "div", 8)(15, "div", 9)(16, "div", 10)(17, "label", 11);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(18, "svg", 12);
      \u0275\u0275element(19, "circle", 13)(20, "path", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275text(21, " B\xFAsqueda R\xE1pida:");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(22, "input", 15);
      \u0275\u0275listener("ngModelChange", function TicketListComponent_Template_input_ngModelChange_22_listener($event) {
        return ctx.searchQuery.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "button", 16);
      \u0275\u0275listener("click", function TicketListComponent_Template_button_click_23_listener() {
        return ctx.clearFilters();
      });
      \u0275\u0275text(24, " Limpiar Filtros ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 17)(26, "div", 18)(27, "label", 19);
      \u0275\u0275text(28, "Estado del Ticket:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "select", 20);
      \u0275\u0275listener("ngModelChange", function TicketListComponent_Template_select_ngModelChange_29_listener($event) {
        return ctx.statusFilter.set($event);
      });
      \u0275\u0275elementStart(30, "option", 21);
      \u0275\u0275text(31, "Todos los Estados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "option", 22);
      \u0275\u0275text(33, "VENDIDO");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "option", 23);
      \u0275\u0275text(35, "USADO ENTRADA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "option", 24);
      \u0275\u0275text(37, "USADO COMIDA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "option", 25);
      \u0275\u0275text(39, "ANULADO");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(40, "div", 18)(41, "label", 26);
      \u0275\u0275text(42, "Tipo de Entrada:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "select", 27);
      \u0275\u0275listener("ngModelChange", function TicketListComponent_Template_select_ngModelChange_43_listener($event) {
        return ctx.ticketTypeFilter.set($event);
      });
      \u0275\u0275elementStart(44, "option", 21);
      \u0275\u0275text(45, "Todos los Tipos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "option", 28);
      \u0275\u0275text(47, "SIMPLE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "option", 29);
      \u0275\u0275text(49, "CON COMIDA");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(50, "div", 18)(51, "label", 30);
      \u0275\u0275text(52, "Origen de Venta:");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "select", 31);
      \u0275\u0275listener("ngModelChange", function TicketListComponent_Template_select_ngModelChange_53_listener($event) {
        return ctx.saleSourceFilter.set($event);
      });
      \u0275\u0275elementStart(54, "option", 21);
      \u0275\u0275text(55, "Todos los Canales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "option", 32);
      \u0275\u0275text(57, "ANTICIPADA");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "option", 33);
      \u0275\u0275text(59, "PUERTA");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(60, TicketListComponent_div_60_Template, 7, 2, "div", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "div", 35)(62, "span");
      \u0275\u0275text(63, " Mostrando ");
      \u0275\u0275elementStart(64, "strong");
      \u0275\u0275text(65);
      \u0275\u0275elementEnd();
      \u0275\u0275text(66, " de ");
      \u0275\u0275elementStart(67, "strong");
      \u0275\u0275text(68);
      \u0275\u0275elementEnd();
      \u0275\u0275text(69, " bonos registrados ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "span");
      \u0275\u0275text(71, " Recaudaci\xF3n Filtrada: ");
      \u0275\u0275elementStart(72, "strong", 36);
      \u0275\u0275text(73);
      \u0275\u0275pipe(74, "number");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(75, TicketListComponent_div_75_Template, 4, 0, "div", 37)(76, TicketListComponent_div_76_Template, 5, 0, "div", 38)(77, TicketListComponent_div_77_Template, 24, 1, "div", 39);
      \u0275\u0275elementEnd();
      \u0275\u0275template(78, TicketListComponent_div_78_Template, 61, 20, "div", 40)(79, TicketListComponent_div_79_Template, 35, 7, "div", 40);
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275property("disabled", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading());
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.successMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage());
      \u0275\u0275advance(9);
      \u0275\u0275property("ngModel", ctx.searchQuery());
      \u0275\u0275advance(7);
      \u0275\u0275property("ngModel", ctx.statusFilter());
      \u0275\u0275advance(14);
      \u0275\u0275property("ngModel", ctx.ticketTypeFilter());
      \u0275\u0275advance(10);
      \u0275\u0275property("ngModel", ctx.saleSourceFilter());
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.authService.isAdmin());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.totalFilteredCount());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.tickets().length);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(74, 17, ctx.totalFilteredRevenue(), "1.2-2"), "");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading() && ctx.filteredTickets().length === 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading() && ctx.filteredTickets().length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showDetailModal() && ctx.selectedTicket());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showAnnulModal() && ctx.selectedTicket());
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, DecimalPipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ['\n\n.tickets-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.tickets-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 1.5rem;\n}\n.tickets-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.95rem;\n}\n.filter-panel[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.filter-row-top[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: flex-end;\n  margin-bottom: 1.25rem;\n}\n.search-box[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.search-box[_ngcontent-%COMP%]   label[_ngcontent-%COMP%], \n.filter-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n  color: var(--text-secondary, #665A5D);\n}\n.filter-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n.filter-stats-bar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 1.25rem;\n  padding-top: 1rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.06);\n  font-size: 0.9rem;\n  color: var(--text-secondary, #665A5D);\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.tickets-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.tickets-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 0.9rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.tickets-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.85rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.code-chip[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 0.2rem 0.5rem;\n  border-radius: 6px;\n  box-shadow: var(--neu-shadow-inset);\n}\n.action-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.4rem;\n}\n.btn-annul[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.btn-annul[_ngcontent-%COMP%]:hover {\n  background: #b91c1c;\n  color: #ffffff;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\n.alert-danger[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.alert-warning[_ngcontent-%COMP%] {\n  background: rgba(217, 119, 6, 0.12);\n  color: #92400e;\n  border: 1px solid rgba(217, 119, 6, 0.3);\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(43, 35, 37, 0.6);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n  padding: 1rem;\n}\n.modal-card[_ngcontent-%COMP%] {\n  max-width: 550px;\n  width: 100%;\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.btn-close[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  font-size: 1.4rem;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n.code-highlight-box[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-around;\n  margin-bottom: 1.5rem;\n}\n.highlight-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.hl-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.hl-code[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-family: monospace;\n  font-weight: 800;\n  color: var(--color-bordo);\n}\n.detail-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.detail-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  font-size: 0.9rem;\n}\n.detail-label[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-size: 0.8rem;\n}\n.public-url-box[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n.url-input-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  margin-top: 0.4rem;\n}\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  margin-top: 1.5rem;\n}\n@media (max-width: 768px) {\n  .tickets-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .filter-row-top[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .detail-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=ticket-list.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TicketListComponent, [{
    type: Component,
    args: [{ selector: "app-ticket-list", standalone: true, imports: [CommonModule, FormsModule], template: `<section class="tickets-container">
  <!-- Header -->
  <div class="tickets-header">
    <div>
      <h1>Gesti\xF3n e Historial de Bonos / Tickets</h1>
      <p class="subtitle">Consulta general, filtrado multinivel y anulaci\xF3n de entradas emitidas</p>
    </div>
    <div class="header-actions">
      <button class="neu-btn neu-btn-bordo" (click)="loadData()" [disabled]="loading()">
        <span *ngIf="loading()" class="neu-spinner"></span>
        <span>Refrescar Lista</span>
      </button>
    </div>
  </div>

  <!-- Banners de Notificaci\xF3n -->
  <div *ngIf="successMessage()" class="alert alert-success">
    <svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> {{ successMessage() }}
  </div>
  <div *ngIf="errorMessage()" class="alert alert-danger">
    <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {{ errorMessage() }}
  </div>

  <!-- Panel de Filtros Combinados -->
  <div class="neu-card filter-panel">
    <div class="filter-row-top">
      <div class="search-box">
        <label for="ticketSearch"><svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> B\xFAsqueda R\xE1pida:</label>
        <input
          id="ticketSearch"
          type="text"
          [ngModel]="searchQuery()"
          (ngModelChange)="searchQuery.set($event)"
          placeholder="Buscar por 4 d\xEDgitos, # bono, comprador o vendedor..."
          class="neu-input"
        />
      </div>

      <button class="neu-btn" (click)="clearFilters()">
        Limpiar Filtros
      </button>
    </div>

    <div class="filter-grid">
      <!-- Filtro por Estado -->
      <div class="filter-group">
        <label for="statusFilter">Estado del Ticket:</label>
        <select
          id="statusFilter"
          [ngModel]="statusFilter()"
          (ngModelChange)="statusFilter.set($event)"
          class="neu-input select-control"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="VENDIDO">VENDIDO</option>
          <option value="USADO_ENTRADA">USADO ENTRADA</option>
          <option value="USADO_COMIDA">USADO COMIDA</option>
          <option value="ANULADO">ANULADO</option>
        </select>
      </div>

      <!-- Filtro por Tipo de Entrada -->
      <div class="filter-group">
        <label for="typeFilter">Tipo de Entrada:</label>
        <select
          id="typeFilter"
          [ngModel]="ticketTypeFilter()"
          (ngModelChange)="ticketTypeFilter.set($event)"
          class="neu-input select-control"
        >
          <option value="ALL">Todos los Tipos</option>
          <option value="SIMPLE">SIMPLE</option>
          <option value="CON_COMIDA">CON COMIDA</option>
        </select>
      </div>

      <!-- Filtro por Origen / Canal de Venta -->
      <div class="filter-group">
        <label for="sourceFilter">Origen de Venta:</label>
        <select
          id="sourceFilter"
          [ngModel]="saleSourceFilter()"
          (ngModelChange)="saleSourceFilter.set($event)"
          class="neu-input select-control"
        >
          <option value="ALL">Todos los Canales</option>
          <option value="ANTICIPADA">ANTICIPADA</option>
          <option value="PUERTA">PUERTA</option>
        </select>
      </div>

      <!-- Filtro por Vendedor (Admin o Selector) -->
      <div class="filter-group" *ngIf="authService.isAdmin()">
        <label for="sellerFilter">Vendedor:</label>
        <select
          id="sellerFilter"
          [ngModel]="sellerFilter()"
          (ngModelChange)="sellerFilter.set($event)"
          class="neu-input select-control"
        >
          <option value="ALL">Todos los Vendedores</option>
          <option *ngFor="let u of users()" [value]="u.id">
            {{ u.name }} ({{ u.email }})
          </option>
        </select>
      </div>
    </div>

    <!-- Barra de Estado de Filtros y Totales -->
    <div class="filter-stats-bar">
      <span>
        Mostrando <strong>{{ totalFilteredCount() }}</strong> de <strong>{{ tickets().length }}</strong> bonos registrados
      </span>
      <span>
        Recaudaci\xF3n Filtrada: <strong class="text-success">\${{ totalFilteredRevenue() | number:'1.2-2' }}</strong>
      </span>
    </div>
  </div>

  <!-- Loader -->
  <div *ngIf="loading()" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando lista completa de tickets...</p>
  </div>

  <!-- Tabla de Tickets -->
  <div *ngIf="!loading() && filteredTickets().length === 0" class="neu-card empty-card">
    <p>No se encontraron tickets que coincidan con la combinaci\xF3n de filtros seleccionada.</p>
    <button class="neu-btn" (click)="clearFilters()">Restablecer Filtros</button>
  </div>

  <div *ngIf="!loading() && filteredTickets().length > 0" class="neu-card table-responsive">
    <table class="tickets-table">
      <thead>
        <tr>
          <th># Bono</th>
          <th>C\xF3digo 4 Digs</th>
          <th>Comprador</th>
          <th>Vendedor</th>
          <th>Tipo</th>
          <th>Origen / Cuota</th>
          <th>Monto</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let t of filteredTickets()">
          <td>
            <strong>#{{ t.ticketNumber || t.id.slice(0, 6) }}</strong>
          </td>
          <td>
            <span class="code-chip">{{ t.fourDigitCode || (t.publicToken ? t.publicToken.slice(0, 4) : 'N/A') }}</span>
          </td>
          <td>
            <div class="buyer-info">
              <strong>{{ t.buyerName || 'Cliente General' }}</strong>
            </div>
          </td>
          <td>
            <span class="seller-label">{{ t.sellerName || 'Sistema / Vendedor' }}</span>
          </td>
          <td>
            <span
              class="badge"
              [class.badge-simple]="t.ticketType === 'SIMPLE'"
              [class.badge-comida]="t.ticketType === 'CON_COMIDA'"
            >
              {{ t.ticketType === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE' }}
            </span>
          </td>
          <td>
            <div class="source-info">
              <span class="badge badge-source">
                {{ t.saleSource === 'ANTICIPADA' ? 'ANTICIPADA' : 'PUERTA' }}
              </span>
              <span *ngIf="t.quotaSource" class="quota-tag" [class.personal]="t.quotaSource === 'PERSONAL'" [class.libre]="t.quotaSource === 'LIBRE'">
                {{ t.quotaSource }}
              </span>
            </div>
          </td>
          <td>
            <strong>\${{ t.pricePaid | number:'1.2-2' }}</strong>
          </td>
          <td>
            <span
              class="neu-badge"
              [ngClass]="{
                'neu-badge-vendido': t.status === 'VENDIDO',
                'neu-badge-usado': t.status === 'USADO_ENTRADA' || t.status === 'USADO_COMIDA',
                'neu-badge-anulado': t.status === 'ANULADO'
              }"
            >
              {{ t.status }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="neu-btn" (click)="openDetail(t)" title="Ver Detalle del Bono">
                <svg class="icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Ver
              </button>
              <button
                *ngIf="t.status !== 'ANULADO'"
                class="neu-btn btn-annul"
                (click)="openAnnulModal(t)"
                title="Anular bono y devolver cupo de cuota"
              >
                <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Anular
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- MODAL 1: DETALLE DEL BONO -->
<div *ngIf="showDetailModal() && selectedTicket()" class="modal-backdrop" (click)="closeDetail()" (keydown.escape)="closeDetail()" tabindex="-1">
  <div class="neu-card modal-card" (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()">
    <div class="modal-header">
      <h2>
        Detalle del Bono #{{ selectedTicket()?.ticketNumber || selectedTicket()?.id?.slice(0, 6) }}
      </h2>
      <button class="btn-close" (click)="closeDetail()">\u2715</button>
    </div>

    <div class="modal-body">
      <!-- Highlight Box -->
      <div class="code-highlight-box neu-card">
        <div class="highlight-item">
          <span class="hl-label">C\xF3digo de 4 D\xEDgitos</span>
          <span class="hl-code">{{ selectedTicket()?.fourDigitCode }}</span>
        </div>
        <div class="highlight-item">
          <span class="hl-label">Estado Actual</span>
          <span
            class="neu-badge"
            [ngClass]="{
              'neu-badge-vendido': selectedTicket()?.status === 'VENDIDO',
              'neu-badge-usado': selectedTicket()?.status === 'USADO_ENTRADA' || selectedTicket()?.status === 'USADO_COMIDA',
              'neu-badge-anulado': selectedTicket()?.status === 'ANULADO'
            }"
          >
            {{ selectedTicket()?.status }}
          </span>
        </div>
      </div>

      <!-- Grid Datos -->
      <div class="detail-grid">
        <div class="detail-group">
          <span class="detail-label">Comprador:</span>
          <strong>{{ selectedTicket()?.buyerName || 'Cliente General' }}</strong>
        </div>
        <div class="detail-group">
          <span class="detail-label">Vendedor:</span>
          <strong>{{ selectedTicket()?.sellerName || 'Sistema / Vendedor' }}</strong>
        </div>
        <div class="detail-group">
          <span class="detail-label">Tipo de Bono:</span>
          <span>{{ selectedTicket()?.ticketType === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE' }}</span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Canal de Venta:</span>
          <span>{{ selectedTicket()?.saleSource === 'ANTICIPADA' ? 'ANTICIPADA' : 'PUERTA' }}</span>
        </div>
        <div class="detail-group" *ngIf="selectedTicket()?.quotaSource">
          <span class="detail-label">Origen de Cuota:</span>
          <span class="quota-tag" [class.personal]="selectedTicket()?.quotaSource === 'PERSONAL'" [class.libre]="selectedTicket()?.quotaSource === 'LIBRE'">
            Cuota {{ selectedTicket()?.quotaSource === 'PERSONAL' ? 'Personal de Vendedor' : 'Compartida / Libre (Global)' }}
          </span>
        </div>
        <div class="detail-group">
          <span class="detail-label">Monto Pagado:</span>
          <strong class="text-success">\${{ selectedTicket()?.pricePaid | number:'1.2-2' }}</strong>
        </div>
      </div>

      <!-- Public Link -->
      <div class="public-url-box">
        <label for="public-validation-url">Enlace P\xFAblico para Validaci\xF3n:</label>
        <div class="url-input-group">
          <input id="public-validation-url" type="text" readonly [value]="'/api/tickets/public/' + selectedTicket()?.publicToken" class="neu-input" />
          <button class="neu-btn neu-btn-bordo" (click)="copyPublicUrl(selectedTicket()!)">
            <svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {{ copiedPublicUrl() ? '\xA1Copiado! \u2713' : 'Copiar Link' }}
          </button>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button
        *ngIf="selectedTicket()?.status !== 'ANULADO'"
        class="neu-btn btn-annul"
        (click)="openAnnulModal(selectedTicket()!)"
      >
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Anular Ticket
      </button>
      <button class="neu-btn" (click)="closeDetail()">Cerrar</button>
    </div>
  </div>
</div>

<!-- MODAL 2: CONFIRMACI\xD3N DE ANULACI\xD3N -->
<div *ngIf="showAnnulModal() && selectedTicket()" class="modal-backdrop" (click)="closeAnnulModal()" (keydown.escape)="closeAnnulModal()" tabindex="-1">
  <div class="neu-card modal-card annul-modal" (click)="$event.stopPropagation()" (keydown)="$event.stopPropagation()">
    <div class="modal-header header-danger">
      <h2><svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Anulaci\xF3n de Ticket / Bono</h2>
      <button class="btn-close" (click)="closeAnnulModal()">\u2715</button>
    </div>

    <div class="modal-body">
      <div class="alert alert-warning">
        <strong>Importante:</strong> Al anular el bono 
        <strong>#{{ selectedTicket()?.ticketNumber || selectedTicket()?.fourDigitCode }}</strong>,
        se cambiar\xE1 su estado a <strong>ANULADO</strong>.
        <br />
        <span *ngIf="selectedTicket()?.saleSource === 'ANTICIPADA' && selectedTicket()?.quotaSource">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> <strong>Devoluci\xF3n de Cuota:</strong> Se reintegrar\xE1 autom\xE1ticamente 
          <strong>1 cupo</strong> a la cuota 
          <strong>{{ selectedTicket()?.quotaSource === 'PERSONAL' ? 'PERSONAL' : 'COMPARTIDA / LIBRE' }}</strong>
          del vendedor ({{ selectedTicket()?.sellerName }}).
        </span>
      </div>

      <div class="form-group">
        <label for="reasonInput">Motivo de Anulaci\xF3n (requerido):</label>
        <input
          id="reasonInput"
          type="text"
          [ngModel]="annulReason()"
          (ngModelChange)="annulReason.set($event)"
          placeholder="Ej: Error en los datos del comprador, devoluci\xF3n solicitada..."
          class="neu-input"
        />
      </div>
    </div>

    <div class="modal-footer">
      <button class="neu-btn" (click)="closeAnnulModal()" [disabled]="annulling()">
        Cancelar
      </button>
      <button class="neu-btn btn-annul" (click)="confirmAnnulTicket()" [disabled]="annulling()">
        <span *ngIf="annulling()" class="neu-spinner"></span>
        <span>{{ annulling() ? 'Procesando Anulaci\xF3n...' : 'Confirmar Anulaci\xF3n y Devolver Cupo' }}</span>
      </button>
    </div>
  </div>
</div>
`, styles: ['/* src/app/features/tickets/ticket-list/ticket-list.component.css */\n.tickets-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.tickets-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 1.5rem;\n}\n.tickets-header h1 {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle {\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.95rem;\n}\n.filter-panel {\n  margin-bottom: 2rem;\n}\n.filter-row-top {\n  display: flex;\n  gap: 1rem;\n  align-items: flex-end;\n  margin-bottom: 1.25rem;\n}\n.search-box {\n  flex: 1;\n}\n.search-box label,\n.filter-group label {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n  color: var(--text-secondary, #665A5D);\n}\n.filter-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n.filter-stats-bar {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 1.25rem;\n  padding-top: 1rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.06);\n  font-size: 0.9rem;\n  color: var(--text-secondary, #665A5D);\n}\n.text-success {\n  color: #15803d;\n}\n.table-responsive {\n  overflow-x: auto;\n}\n.tickets-table {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.tickets-table th {\n  padding: 0.9rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.tickets-table td {\n  padding: 0.85rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.code-chip {\n  font-family: monospace;\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 0.2rem 0.5rem;\n  border-radius: 6px;\n  box-shadow: var(--neu-shadow-inset);\n}\n.action-buttons {\n  display: flex;\n  gap: 0.4rem;\n}\n.btn-annul {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.btn-annul:hover {\n  background: #b91c1c;\n  color: #ffffff;\n}\n.alert {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\n.alert-danger {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.alert-success {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.alert-warning {\n  background: rgba(217, 119, 6, 0.12);\n  color: #92400e;\n  border: 1px solid rgba(217, 119, 6, 0.3);\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(43, 35, 37, 0.6);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n  padding: 1rem;\n}\n.modal-card {\n  max-width: 550px;\n  width: 100%;\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.btn-close {\n  background: transparent;\n  border: none;\n  font-size: 1.4rem;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n.code-highlight-box {\n  display: flex;\n  justify-content: space-around;\n  margin-bottom: 1.5rem;\n}\n.highlight-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.hl-label {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.hl-code {\n  font-size: 1.5rem;\n  font-family: monospace;\n  font-weight: 800;\n  color: var(--color-bordo);\n}\n.detail-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.detail-group {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  font-size: 0.9rem;\n}\n.detail-label {\n  color: var(--text-secondary);\n  font-size: 0.8rem;\n}\n.public-url-box {\n  margin-top: 1rem;\n}\n.url-input-group {\n  display: flex;\n  gap: 0.5rem;\n  margin-top: 0.4rem;\n}\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n  margin-top: 1.5rem;\n}\n@media (max-width: 768px) {\n  .tickets-header {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .filter-row-top {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .detail-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=ticket-list.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TicketListComponent, { className: "TicketListComponent", filePath: "src/app/features/tickets/ticket-list/ticket-list.component.ts", lineNumber: 15 });
})();
export {
  TicketListComponent
};
//# sourceMappingURL=chunk-SWPGKU4M.js.map
