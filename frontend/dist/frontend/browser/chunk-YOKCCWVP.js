import {
  AuthService
} from "./chunk-4HMK5Z4R.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
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
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFLJKOAY.js";

// src/app/features/dashboard/dashboard.component.ts
var _c0 = (a0, a1, a2) => ({ "neu-badge-vendido": a0, "neu-badge-usado": a1, "neu-badge-anulado": a2 });
function DashboardComponent_div_15_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 20);
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
function DashboardComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "label", 16);
    \u0275\u0275text(2, "Filtrar por Vendedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "select", 17);
    \u0275\u0275listener("change", function DashboardComponent_div_15_Template_select_change_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSellerFilterChange($event));
    });
    \u0275\u0275elementStart(4, "option", 18);
    \u0275\u0275text(5, "Todos los vendedores (Global)");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, DashboardComponent_div_15_option_6_Template, 2, 3, "option", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.selectedSellerId());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.users());
  }
}
function DashboardComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "path", 22)(3, "line", 23)(4, "line", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.errorMessage(), " ");
  }
}
function DashboardComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "div", 26);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Cargando m\xE9tricas en tiempo real...");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_div_18_div_41_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "polyline", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.priceSuccessMessage(), " ");
  }
}
function DashboardComponent_div_18_div_41_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "path", 22)(3, "line", 23)(4, "line", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.priceErrorMessage(), " ");
  }
}
function DashboardComponent_div_18_div_41_span_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 76);
  }
}
function DashboardComponent_div_18_div_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 58)(1, "div", 59)(2, "div")(3, "h3");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 5);
    \u0275\u0275element(5, "circle", 60)(6, "path", 61);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " Configuraci\xF3n de Precios de Entradas (Solo Administrador)");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "p", 2);
    \u0275\u0275text(9, "Modifica y guarda en la base de datos los precios vigentes para tickets simples y con comida.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(10, DashboardComponent_div_18_div_41_div_10_Template, 4, 1, "div", 62)(11, DashboardComponent_div_18_div_41_div_11_Template, 6, 1, "div", 11);
    \u0275\u0275elementStart(12, "div", 63)(13, "div", 64)(14, "label", 65);
    \u0275\u0275text(15, "Precio Ticket SIMPLE ($):");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 66);
    \u0275\u0275listener("ngModelChange", function DashboardComponent_div_18_div_41_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.priceSimple.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 64)(18, "label", 67);
    \u0275\u0275text(19, "Precio Ticket CON COMIDA ($):");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 68);
    \u0275\u0275listener("ngModelChange", function DashboardComponent_div_18_div_41_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.priceConComida.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 69)(22, "button", 70);
    \u0275\u0275listener("click", function DashboardComponent_div_18_div_41_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSavePrices());
    });
    \u0275\u0275template(23, DashboardComponent_div_18_div_41_span_23_Template, 1, 0, "span", 71);
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(25, "svg", 5);
    \u0275\u0275element(26, "path", 72)(27, "polyline", 73)(28, "polyline", 74);
    \u0275\u0275elementEnd();
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(10);
    \u0275\u0275property("ngIf", ctx_r1.priceSuccessMessage());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.priceErrorMessage());
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r1.priceSimple());
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r1.priceConComida());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.savingPrices());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.savingPrices());
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.savingPrices() ? "Guardando Precios..." : "Guardar Nuevos Precios", "");
  }
}
function DashboardComponent_div_18_div_106_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77);
    \u0275\u0275text(1, " No hay bonos emitidos recientemente. ");
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_18_div_107_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td")(10, "span", 81);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "span", 82);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "td")(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td")(20, "span", 83);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("#", t_r5.ticketNumber || t_r5.id.slice(0, 6), "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r5.fourDigitCode || (t_r5.publicToken ? t_r5.publicToken.slice(0, 4) : ""));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.buyerName || "Cliente General");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("badge-simple", t_r5.ticketType === "SIMPLE")("badge-comida", t_r5.ticketType === "CON_COMIDA");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r5.ticketType, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r5.saleSource);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(18, 12, t_r5.pricePaid, "1.2-2"), "");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(15, _c0, t_r5.status === "VENDIDO", t_r5.status === "USADO_ENTRADA" || t_r5.status === "USADO_COMIDA", t_r5.status === "ANULADO"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", t_r5.status, " ");
  }
}
function DashboardComponent_div_18_div_107_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78)(1, "table", 79)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "# Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "C\xF3digo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Comprador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Tipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Origen");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Monto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Estado");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275template(19, DashboardComponent_div_18_div_107_tr_19_Template, 22, 19, "tr", 80);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx_r1.stats().recentTickets);
  }
}
function DashboardComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "div", 29);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 5);
    \u0275\u0275element(4, "line", 30)(5, "path", 31);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "div", 32)(7, "span", 33);
    \u0275\u0275text(8, "Recaudaci\xF3n Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "h2", 34);
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 35)(13, "div", 29);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(14, "svg", 5);
    \u0275\u0275element(15, "path", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(16, "div", 32)(17, "span", 33);
    \u0275\u0275text(18, "Bonos Emitidos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "h2", 34);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 35)(22, "div", 29);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(23, "svg", 5);
    \u0275\u0275element(24, "polyline", 36);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(25, "div", 32)(26, "span", 33);
    \u0275\u0275text(27, "Entradas Usadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "h2", 34);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 37)(31, "div", 29);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(32, "svg", 5);
    \u0275\u0275element(33, "path", 38)(34, "path", 39)(35, "path", 40);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(36, "div", 32)(37, "span", 33);
    \u0275\u0275text(38, "Comidas Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "h2", 34);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(41, DashboardComponent_div_18_div_41_Template, 30, 7, "div", 41);
    \u0275\u0275elementStart(42, "div", 42)(43, "h3");
    \u0275\u0275text(44, "Categor\xEDas y Modalidades de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "div", 43)(46, "div", 44)(47, "h4");
    \u0275\u0275text(48, "Tipos de Bono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "div", 45)(50, "span", 46);
    \u0275\u0275text(51, "SIMPLE");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "span", 47);
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div", 48);
    \u0275\u0275element(56, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "div", 45)(58, "span", 46);
    \u0275\u0275text(59, "CON COMIDA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "span", 47);
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "div", 48);
    \u0275\u0275element(64, "div", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(65, "div", 44)(66, "h4");
    \u0275\u0275text(67, "Origen de Venta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "div", 45)(69, "span", 46);
    \u0275\u0275text(70, "ANTICIPADA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "span", 47);
    \u0275\u0275text(72);
    \u0275\u0275pipe(73, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(74, "div", 48);
    \u0275\u0275element(75, "div", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "div", 45)(77, "span", 46);
    \u0275\u0275text(78, "PUERTA");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "span", 47);
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(82, "div", 48);
    \u0275\u0275element(83, "div", 52);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "div", 44)(85, "h4");
    \u0275\u0275text(86, "Estado de Entregas & Anulaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "div", 53)(88, "span");
    \u0275\u0275text(89, "Comidas Entregadas:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "strong");
    \u0275\u0275text(91);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(92, "div", 53)(93, "span");
    \u0275\u0275text(94, "Comidas Pendientes:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(95, "strong", 54);
    \u0275\u0275text(96);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(97, "div", 53)(98, "span");
    \u0275\u0275text(99, "Bonos Anulados:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "strong", 55);
    \u0275\u0275text(101);
    \u0275\u0275pipe(102, "number");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(103, "div", 42)(104, "h3");
    \u0275\u0275text(105, "\xDAltimos Bonos Emitidos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(106, DashboardComponent_div_18_div_106_Template, 2, 0, "div", 56)(107, DashboardComponent_div_18_div_107_Template, 20, 1, "div", 57);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(11, 27, ctx_r1.stats().totalRevenue, "1.2-2"), "");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.stats().totalIssued);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.stats().entriesUsedCount);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r1.stats().foodPendingCount);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.authService.isAdmin());
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate2("", ctx_r1.stats().ticketsSimpleCount, " emitidos ($", \u0275\u0275pipeBind2(54, 30, ctx_r1.stats().ticketsSimpleRevenue, "1.2-2"), ")");
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.stats().totalIssued ? ctx_r1.stats().ticketsSimpleCount / ctx_r1.stats().totalIssued * 100 : 0, "%");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.stats().ticketsConComidaCount, " emitidos ($", \u0275\u0275pipeBind2(62, 33, ctx_r1.stats().ticketsConComidaRevenue, "1.2-2"), ")");
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.stats().totalIssued ? ctx_r1.stats().ticketsConComidaCount / ctx_r1.stats().totalIssued * 100 : 0, "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate2("", ctx_r1.stats().anticipadaCount, " emitidos ($", \u0275\u0275pipeBind2(73, 36, ctx_r1.stats().anticipadaRevenue, "1.2-2"), ")");
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.stats().totalIssued ? ctx_r1.stats().anticipadaCount / ctx_r1.stats().totalIssued * 100 : 0, "%");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.stats().puertaCount, " emitidos ($", \u0275\u0275pipeBind2(81, 39, ctx_r1.stats().puertaRevenue, "1.2-2"), ")");
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx_r1.stats().totalIssued ? ctx_r1.stats().puertaCount / ctx_r1.stats().totalIssued * 100 : 0, "%");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.stats().foodDeliveredCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.stats().foodPendingCount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.stats().annulledCount, " ($", \u0275\u0275pipeBind2(102, 42, ctx_r1.stats().annulledRevenue, "1.2-2"), ")");
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.stats().recentTickets.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.stats().recentTickets.length > 0);
  }
}
function DashboardComponent_div_19_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90)(1, "div", 91)(2, "span", 92);
    \u0275\u0275text(3, "1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 93);
    \u0275\u0275text(5, "Tipo & Precio");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "div", 94);
    \u0275\u0275elementStart(7, "div", 91)(8, "span", 92);
    \u0275\u0275text(9, "2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 93);
    \u0275\u0275text(11, "Comprador");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(12, "div", 94);
    \u0275\u0275elementStart(13, "div", 91)(14, "span", 92);
    \u0275\u0275text(15, "3");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 93);
    \u0275\u0275text(17, "Resumen");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.issueStep() === 1)("completed", ctx_r1.issueStep() > 1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("completed", ctx_r1.issueStep() > 1);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.issueStep() === 2)("completed", ctx_r1.issueStep() > 2);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("completed", ctx_r1.issueStep() > 2);
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.issueStep() === 3);
  }
}
function DashboardComponent_div_19_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "path", 22)(3, "line", 23)(4, "line", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.issueErrorMessage(), " ");
  }
}
function DashboardComponent_div_19_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "h3");
    \u0275\u0275text(2, "1. Selecciona el Tipo de Entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 96);
    \u0275\u0275text(4, "Los precios corresponden a los configurados activamente en el sistema.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 97)(6, "button", 98);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.newTicketType.set("SIMPLE"));
    });
    \u0275\u0275elementStart(7, "div", 99);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(8, "svg", 5);
    \u0275\u0275element(9, "path", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(10, "div", 100);
    \u0275\u0275text(11, "Bono Simple");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 101);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p");
    \u0275\u0275text(16, "Acceso general al seminario.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "button", 98);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.newTicketType.set("CON_COMIDA"));
    });
    \u0275\u0275elementStart(18, "div", 99);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(19, "svg", 5);
    \u0275\u0275element(20, "path", 38)(21, "path", 39)(22, "path", 40);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(23, "div", 100);
    \u0275\u0275text(24, "Bono con Comida");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 101);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "p");
    \u0275\u0275text(29, "Acceso al seminario + men\xFA de comida incluido.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 102)(31, "label", 103);
    \u0275\u0275text(32, "Fuente / Origen de Emisi\xF3n:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 104)(34, "button", 105);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_34_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.quotaOption.set("PERSONAL"));
    });
    \u0275\u0275elementStart(35, "div", 106);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(36, "svg", 107);
    \u0275\u0275element(37, "path", 108)(38, "circle", 109);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(39, "span", 110);
    \u0275\u0275text(40, "Mi Cuota Personal");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "span", 111);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "button", 105);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.quotaOption.set("LIBRE"));
    });
    \u0275\u0275elementStart(44, "div", 106);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(45, "svg", 107);
    \u0275\u0275element(46, "path", 112)(47, "line", 113);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(48, "span", 110);
    \u0275\u0275text(49, "Bols\xF3n Libre Global");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "span", 111);
    \u0275\u0275text(51);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "button", 105);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_52_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.quotaOption.set("PUERTA"));
    });
    \u0275\u0275elementStart(53, "div", 106);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(54, "svg", 107);
    \u0275\u0275element(55, "path", 114)(56, "path", 115)(57, "circle", 116);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(58, "span", 110);
    \u0275\u0275text(59, "Venta en Puerta");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "span", 117);
    \u0275\u0275text(61, "Sin restricci\xF3n");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(62, "div", 118)(63, "button", 119);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeIssueModal());
    });
    \u0275\u0275text(64, "Cancelar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "button", 4);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_11_Template_button_click_65_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToStep(2));
    });
    \u0275\u0275text(66, "Siguiente: Datos Comprador \u2192");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(6);
    \u0275\u0275classProp("selected", ctx_r1.newTicketType() === "SIMPLE");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(14, 14, ctx_r1.priceSimple(), "1.2-2"), "");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("selected", ctx_r1.newTicketType() === "CON_COMIDA");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(27, 17, ctx_r1.priceConComida(), "1.2-2"), "");
    \u0275\u0275advance(8);
    \u0275\u0275classProp("selected", ctx_r1.quotaOption() === "PERSONAL");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r1.personalQuotaAvailable() !== null ? ctx_r1.personalQuotaAvailable() + " disponibles" : "Cargando...", " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("selected", ctx_r1.quotaOption() === "LIBRE");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r1.globalFreeQuotaAvailable() !== null ? ctx_r1.globalFreeQuotaAvailable() + " disponibles" : "Cargando...", " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("selected", ctx_r1.quotaOption() === "PUERTA");
  }
}
function DashboardComponent_div_19_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "h3");
    \u0275\u0275text(2, "2. Datos del Comprador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 96);
    \u0275\u0275text(4, "Completa la informaci\xF3n para personalizar el bono emitido.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 120)(6, "div", 121)(7, "label", 122);
    \u0275\u0275text(8, "Nombre *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 123);
    \u0275\u0275listener("input", function DashboardComponent_div_19_div_12_Template_input_input_9_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.buyerFirstName.set($event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 121)(11, "label", 124);
    \u0275\u0275text(12, "Apellido *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 125);
    \u0275\u0275listener("input", function DashboardComponent_div_19_div_12_Template_input_input_13_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.buyerLastName.set($event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 121)(15, "label", 126);
    \u0275\u0275text(16, "Tel\xE9fono *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 127);
    \u0275\u0275listener("input", function DashboardComponent_div_19_div_12_Template_input_input_17_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.buyerPhone.set($event.target.value));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 121)(19, "label", 128);
    \u0275\u0275text(20, "Email (Opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 129);
    \u0275\u0275listener("input", function DashboardComponent_div_19_div_12_Template_input_input_21_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.buyerEmail.set($event.target.value));
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 118)(23, "button", 119);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_12_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToStep(1));
    });
    \u0275\u0275text(24, "\u2190 Volver");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 4);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_12_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToStep(3));
    });
    \u0275\u0275text(26, "Siguiente: Resumen \u2192");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275property("value", ctx_r1.buyerFirstName());
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.buyerLastName());
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.buyerPhone());
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r1.buyerEmail());
  }
}
function DashboardComponent_div_19_div_13_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 131)(1, "span");
    \u0275\u0275text(2, "Email:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.buyerEmail());
  }
}
function DashboardComponent_div_19_div_13_span_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 76);
  }
}
function DashboardComponent_div_19_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "h3");
    \u0275\u0275text(2, "3. Resumen y Confirmaci\xF3n de Emisi\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 96);
    \u0275\u0275text(4, "Verifica los detalles del ticket antes de registrarlo en la base de datos.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 130)(6, "div", 131)(7, "span");
    \u0275\u0275text(8, "Tipo de Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 131)(12, "span");
    \u0275\u0275text(13, "Fuente de Emisi\xF3n:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 131)(17, "span");
    \u0275\u0275text(18, "Precio Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong", 132);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(22, "hr", 133);
    \u0275\u0275elementStart(23, "div", 131)(24, "span");
    \u0275\u0275text(25, "Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "strong");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 131)(29, "span");
    \u0275\u0275text(30, "Tel\xE9fono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "strong");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(33, DashboardComponent_div_19_div_13_div_33_Template, 5, 1, "div", 134);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 118)(35, "button", 119);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_13_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goToStep(2));
    });
    \u0275\u0275text(36, "\u2190 Editar Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 70);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_13_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.submitIssueTicket());
    });
    \u0275\u0275template(38, DashboardComponent_div_19_div_13_span_38_Template, 1, 0, "span", 71);
    \u0275\u0275elementStart(39, "span");
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.newTicketType() === "CON_COMIDA" ? "CON COMIDA" : "SIMPLE");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.quotaOption() === "PERSONAL" ? "Mi Cuota Personal" : ctx_r1.quotaOption() === "LIBRE" ? "Bols\xF3n Libre Global" : "Venta en Puerta");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(21, 10, ctx_r1.currentSelectedPrice(), "1.2-2"), "");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate2("", ctx_r1.buyerFirstName(), " ", ctx_r1.buyerLastName(), "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.buyerPhone());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.buyerEmail());
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r1.issuingTicket());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issuingTicket());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.issuingTicket() ? "Emitiendo Bono..." : "Confirmar y Emitir Bono");
  }
}
function DashboardComponent_div_19_div_14_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 138)(1, "div", 139)(2, "span");
    \u0275\u0275text(3, "N\xFAmero de Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 139)(7, "span");
    \u0275\u0275text(8, "C\xF3digo de 4 D\xEDgitos:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "code", 140);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 139)(12, "span");
    \u0275\u0275text(13, "Monto Pagado:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "strong");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "number");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 139)(18, "span");
    \u0275\u0275text(19, "Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "strong");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 141)(23, "label", 142);
    \u0275\u0275text(24, "URL P\xFAblica del Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 143);
    \u0275\u0275element(26, "input", 144);
    \u0275\u0275elementStart(27, "button", 4);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_14_div_9_Template_button_click_27_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.copyPublicUrl());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(28, "svg", 5);
    \u0275\u0275element(29, "rect", 145)(30, "path", 146);
    \u0275\u0275elementEnd();
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("#", ctx_r1.createdTicket().ticket_number, "");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.createdTicket().four_digit_code);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(16, 7, ctx_r1.createdTicket().price_paid, "1.2-2"), "");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", (tmp_6_0 = ctx_r1.createdTicket().buyer) == null ? null : tmp_6_0.first_name, " ", (tmp_6_0 = ctx_r1.createdTicket().buyer) == null ? null : tmp_6_0.last_name, "");
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.createdTicket().public_url);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.copiedPublicUrl() ? "\xA1Copiado! \u2713" : "Copiar URL", " ");
  }
}
function DashboardComponent_div_19_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 95)(1, "div", 135)(2, "div", 136);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 5);
    \u0275\u0275element(4, "polyline", 36);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "h3");
    \u0275\u0275text(6, "\xA1Bono Emitido Correctamente!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 96);
    \u0275\u0275text(8, "El ticket ha sido registrado en la base de datos.");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, DashboardComponent_div_19_div_14_div_9_Template, 32, 10, "div", 137);
    \u0275\u0275elementStart(10, "div", 118)(11, "button", 4);
    \u0275\u0275listener("click", function DashboardComponent_div_19_div_14_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closeIssueModal());
    });
    \u0275\u0275text(12, "Cerrar y Volver al Dashboard");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275property("ngIf", ctx_r1.createdTicket());
  }
}
function DashboardComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 84)(1, "div", 85)(2, "div", 86)(3, "h2");
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 5);
    \u0275\u0275element(5, "path", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Emitir Nuevo Bono / Ticket");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "button", 87);
    \u0275\u0275listener("click", function DashboardComponent_div_19_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeIssueModal());
    });
    \u0275\u0275text(8, "\u2715");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, DashboardComponent_div_19_div_9_Template, 18, 14, "div", 88)(10, DashboardComponent_div_19_div_10_Template, 6, 1, "div", 11)(11, DashboardComponent_div_19_div_11_Template, 67, 20, "div", 89)(12, DashboardComponent_div_19_div_12_Template, 27, 4, "div", 89)(13, DashboardComponent_div_19_div_13_Template, 41, 13, "div", 89)(14, DashboardComponent_div_19_div_14_Template, 13, 1, "div", 89);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngIf", ctx_r1.issueStep() < 4);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issueErrorMessage());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issueStep() === 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issueStep() === 2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issueStep() === 3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.issueStep() === 4);
  }
}
var DashboardComponent = class _DashboardComponent {
  authService = inject(AuthService);
  apiService = inject(ApiService);
  loading = signal(true);
  errorMessage = signal("");
  // Seller list for Admin filter
  users = signal([]);
  selectedSellerId = signal("ALL");
  // 'ALL' or specific seller UUID
  // All tickets fetched from backend
  tickets = signal([]);
  // Computed metrics based on selection (specific user or global aggregate)
  filteredTickets = computed(() => {
    const list = this.tickets();
    const sellerFilter = this.selectedSellerId();
    if (!this.authService.isAdmin() || sellerFilter === "ALL") {
      return list;
    }
    return list.filter((t) => t.sellerId === sellerFilter);
  });
  stats = computed(() => {
    const list = this.filteredTickets();
    let totalRevenue = 0;
    let totalIssued = 0;
    let ticketsSimpleCount = 0;
    let ticketsSimpleRevenue = 0;
    let ticketsConComidaCount = 0;
    let ticketsConComidaRevenue = 0;
    let anticipadaCount = 0;
    let anticipadaRevenue = 0;
    let puertaCount = 0;
    let puertaRevenue = 0;
    let entriesUsedCount = 0;
    let foodDeliveredCount = 0;
    let foodPendingCount = 0;
    let annulledCount = 0;
    let annulledRevenue = 0;
    for (const t of list) {
      if (t.status === "ANULADO") {
        annulledCount++;
        annulledRevenue += t.pricePaid || 0;
        continue;
      }
      totalIssued++;
      totalRevenue += t.pricePaid || 0;
      if (t.ticketType === "SIMPLE") {
        ticketsSimpleCount++;
        ticketsSimpleRevenue += t.pricePaid || 0;
      } else if (t.ticketType === "CON_COMIDA") {
        ticketsConComidaCount++;
        ticketsConComidaRevenue += t.pricePaid || 0;
      }
      if (t.saleSource === "ANTICIPADA") {
        anticipadaCount++;
        anticipadaRevenue += t.pricePaid || 0;
      } else if (t.saleSource === "PUERTA") {
        puertaCount++;
        puertaRevenue += t.pricePaid || 0;
      }
      if (t.status === "USADO_ENTRADA") {
        entriesUsedCount++;
        if (t.ticketType === "CON_COMIDA") {
          foodPendingCount++;
        }
      } else if (t.status === "USADO_COMIDA") {
        entriesUsedCount++;
        foodDeliveredCount++;
      } else if (t.status === "VENDIDO" && t.ticketType === "CON_COMIDA") {
        foodPendingCount++;
      }
    }
    return {
      totalRevenue,
      totalIssued,
      ticketsSimpleCount,
      ticketsSimpleRevenue,
      ticketsConComidaCount,
      ticketsConComidaRevenue,
      anticipadaCount,
      anticipadaRevenue,
      puertaCount,
      puertaRevenue,
      entriesUsedCount,
      foodDeliveredCount,
      foodPendingCount,
      annulledCount,
      annulledRevenue,
      recentTickets: list.slice(0, 10)
    };
  });
  // Active prices state for Admin management
  priceSimple = signal(3e3);
  priceConComida = signal(5e3);
  priceSuccessMessage = signal("");
  priceErrorMessage = signal("");
  ngOnInit() {
    this.loadData();
    this.loadPrices();
  }
  loadPrices() {
    this.apiService.getTicketPrices().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          for (const item of res.data) {
            if (item.ticket_type === "SIMPLE") {
              this.priceSimple.set(item.price);
            } else if (item.ticket_type === "CON_COMIDA") {
              this.priceConComida.set(item.price);
            }
          }
        }
      }
    });
  }
  loadData() {
    this.loading.set(true);
    this.errorMessage.set("");
    const currentUserId = this.authService.currentUser()?.id;
    if (this.authService.isAdmin()) {
      this.apiService.listUsers().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.users.set(res.data);
          }
        }
      });
      this.apiService.listTickets().subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            this.tickets.set(res.data);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.error || "Error al cargar estad\xEDsticas del dashboard");
        }
      });
    } else {
      this.apiService.listTickets(currentUserId).subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res.success && res.data) {
            this.tickets.set(res.data);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.error || "Error al cargar estad\xEDsticas del usuario");
        }
      });
    }
  }
  onSellerFilterChange(event) {
    const select = event.target;
    this.selectedSellerId.set(select.value);
  }
  savingPrices = signal(false);
  onSavePrices() {
    this.priceSuccessMessage.set("");
    this.priceErrorMessage.set("");
    this.savingPrices.set(true);
    const simpleReq = this.apiService.updateTicketPrice({ ticket_type: "SIMPLE", price: this.priceSimple() });
    const comidaReq = this.apiService.updateTicketPrice({ ticket_type: "CON_COMIDA", price: this.priceConComida() });
    simpleReq.subscribe({
      next: () => {
        comidaReq.subscribe({
          next: () => {
            this.savingPrices.set(false);
            this.priceSuccessMessage.set("Precios de entradas actualizados correctamente en la base de datos");
          },
          error: (err) => {
            this.savingPrices.set(false);
            this.priceErrorMessage.set(err.error?.error || "Error al actualizar precio de entrada con comida");
          }
        });
      },
      error: (err) => {
        this.savingPrices.set(false);
        this.priceErrorMessage.set(err.error?.error || "Error al actualizar precio de entrada simple");
      }
    });
  }
  // Ticket Issuance Modal State
  showIssueModal = signal(false);
  issueStep = signal(1);
  newTicketType = signal("SIMPLE");
  quotaOption = signal("PERSONAL");
  personalQuotaAvailable = signal(null);
  globalFreeQuotaAvailable = signal(null);
  buyerFirstName = signal("");
  buyerLastName = signal("");
  buyerPhone = signal("");
  buyerEmail = signal("");
  issuingTicket = signal(false);
  issueErrorMessage = signal("");
  createdTicket = signal(null);
  copiedPublicUrl = signal(false);
  currentSelectedPrice = computed(() => {
    return this.newTicketType() === "CON_COMIDA" ? this.priceConComida() : this.priceSimple();
  });
  openIssueModal() {
    this.issueStep.set(1);
    this.newTicketType.set("SIMPLE");
    this.quotaOption.set("PERSONAL");
    this.buyerFirstName.set("");
    this.buyerLastName.set("");
    this.buyerPhone.set("");
    this.buyerEmail.set("");
    this.issueErrorMessage.set("");
    this.createdTicket.set(null);
    this.copiedPublicUrl.set(false);
    this.showIssueModal.set(true);
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.apiService.getSellerQuota(userId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            const assigned = res.data.assigned_quota ?? 0;
            const used = res.data.used_quota ?? 0;
            const avail = assigned - used;
            this.personalQuotaAvailable.set(avail < 0 ? 0 : avail);
          }
        }
      });
    }
    this.apiService.getGlobalFreeQuota().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const total = res.data.total_free_quota ?? 0;
          const used = res.data.used_free_quota ?? 0;
          const avail = total - used;
          this.globalFreeQuotaAvailable.set(avail < 0 ? 0 : avail);
        }
      }
    });
  }
  closeIssueModal() {
    this.showIssueModal.set(false);
  }
  goToStep(step) {
    if (step === 3) {
      if (!this.buyerFirstName().trim() || !this.buyerLastName().trim() || !this.buyerPhone().trim()) {
        this.issueErrorMessage.set("Nombre, Apellido y Tel\xE9fono son requeridos");
        return;
      }
    }
    this.issueErrorMessage.set("");
    this.issueStep.set(step);
  }
  submitIssueTicket() {
    this.issuingTicket.set(true);
    this.issueErrorMessage.set("");
    const opt = this.quotaOption();
    let saleSource = "ANTICIPADA";
    let quotaSource = void 0;
    if (opt === "PERSONAL") {
      saleSource = "ANTICIPADA";
      quotaSource = "PERSONAL";
    } else if (opt === "LIBRE") {
      saleSource = "ANTICIPADA";
      quotaSource = "LIBRE";
    } else {
      saleSource = "PUERTA";
    }
    const payload = {
      ticket_type: this.newTicketType(),
      sale_source: saleSource,
      quota_source: quotaSource,
      first_name: this.buyerFirstName().trim(),
      last_name: this.buyerLastName().trim(),
      phone: this.buyerPhone().trim(),
      email: this.buyerEmail().trim() || void 0
    };
    this.apiService.createTicket(payload).subscribe({
      next: (res) => {
        this.issuingTicket.set(false);
        if (res.success && res.data) {
          this.createdTicket.set(res.data);
          this.issueStep.set(4);
          this.loadData();
        } else {
          this.issueErrorMessage.set(res.error || "No se pudo emitir el bono");
        }
      },
      error: (err) => {
        this.issuingTicket.set(false);
        this.issueErrorMessage.set(err.error?.error || "Error al emitir el bono");
      }
    });
  }
  copyPublicUrl() {
    const ticket = this.createdTicket();
    if (!ticket || !ticket.public_url)
      return;
    const fullUrl = `${window.location.origin}${ticket.public_url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedPublicUrl.set(true);
      setTimeout(() => this.copiedPublicUrl.set(false), 2500);
    });
  }
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], decls: 20, vars: 5, consts: [[1, "dashboard-container"], [1, "dashboard-header"], [1, "subtitle"], [1, "header-actions"], [1, "neu-btn", "neu-btn-bordo", 3, "click"], ["viewBox", "0 0 24 24", 1, "icon"], ["d", "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"], ["d", "M13 5v2"], ["d", "M13 11v2"], ["d", "M13 17v2"], ["class", "admin-filter", 4, "ngIf"], ["class", "alert alert-danger", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "dashboard-grid", 4, "ngIf"], ["class", "modal-backdrop", 4, "ngIf"], [1, "admin-filter"], ["for", "sellerSelect"], ["id", "sellerSelect", 1, "neu-input", "select-control", 3, "change", "value"], ["value", "ALL"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "alert", "alert-danger"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], [1, "loading-state"], [1, "spinner"], [1, "dashboard-grid"], [1, "neu-card", "stat-card", "primary"], [1, "stat-icon"], ["x1", "12", "y1", "1", "x2", "12", "y2", "23"], ["d", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"], [1, "stat-info"], [1, "stat-label"], [1, "stat-value"], [1, "neu-card", "stat-card"], ["points", "20 6 9 17 4 12"], [1, "neu-card", "stat-card", "warning"], ["d", "M3 11h18"], ["d", "M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"], ["d", "M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"], ["class", "neu-card full-width price-management-card", 4, "ngIf"], [1, "neu-card", "full-width"], [1, "breakdown-grid"], [1, "breakdown-card"], [1, "metric-row"], [1, "metric-title"], [1, "metric-val"], [1, "progress-bar"], [1, "progress-fill", "simple"], [1, "progress-fill", "comida"], [1, "progress-fill", "anticipada"], [1, "progress-fill", "puerta"], [1, "status-summary-item"], [1, "text-warning"], [1, "text-danger"], ["class", "empty-msg", 4, "ngIf"], ["class", "table-responsive", 4, "ngIf"], [1, "neu-card", "full-width", "price-management-card"], [1, "card-header-row"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"], ["class", "alert alert-success", 4, "ngIf"], [1, "price-inputs-grid"], [1, "price-input-group"], ["for", "priceSimple"], ["id", "priceSimple", "type", "number", "min", "0", 1, "neu-input", 3, "ngModelChange", "ngModel"], ["for", "priceConComida"], ["id", "priceConComida", "type", "number", "min", "0", 1, "neu-input", 3, "ngModelChange", "ngModel"], [1, "price-btn-group"], [1, "neu-btn", "neu-btn-bordo", 3, "click", "disabled"], ["class", "neu-spinner", 4, "ngIf"], ["d", "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"], ["points", "17 21 17 13 7 13 7 21"], ["points", "7 3 7 8 15 8"], [1, "alert", "alert-success"], [1, "neu-spinner"], [1, "empty-msg"], [1, "table-responsive"], [1, "tickets-table"], [4, "ngFor", "ngForOf"], [1, "badge"], [1, "badge", "badge-source"], [1, "neu-badge", 3, "ngClass"], [1, "modal-backdrop"], [1, "neu-card", "modal-card"], [1, "modal-header"], [1, "btn-close", 3, "click"], ["class", "step-indicator", 4, "ngIf"], ["class", "modal-body", 4, "ngIf"], [1, "step-indicator"], [1, "step-item"], [1, "step-number"], [1, "step-title"], [1, "step-line"], [1, "modal-body"], [1, "modal-subtitle"], [1, "ticket-type-selector"], ["type", "button", 1, "type-card", "neu-card", 3, "click"], [1, "type-icon"], [1, "type-title"], [1, "type-price"], [1, "sale-source-container"], [1, "label-title"], [1, "sale-source-cards"], ["type", "button", 1, "source-card", "neu-card", 3, "click"], [1, "source-header"], ["viewBox", "0 0 24 24", 1, "icon", "source-icon-svg"], ["d", "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"], ["cx", "12", "cy", "7", "r", "4"], [1, "source-title"], [1, "source-badge"], ["d", "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"], ["x1", "7", "y1", "7", "x2", "7.01", "y2", "7"], ["d", "M3 21h18"], ["d", "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"], ["cx", "14", "cy", "12", "r", "1"], [1, "source-badge", "badge-puerta"], [1, "modal-footer"], [1, "neu-btn", 3, "click"], [1, "inputs-grid"], [1, "form-group"], ["for", "bFirstName"], ["id", "bFirstName", "type", "text", "placeholder", "Ej. Juan", 1, "neu-input", 3, "input", "value"], ["for", "bLastName"], ["id", "bLastName", "type", "text", "placeholder", "Ej. P\xE9rez", 1, "neu-input", 3, "input", "value"], ["for", "bPhone"], ["id", "bPhone", "type", "text", "placeholder", "Ej. 1122334455", 1, "neu-input", 3, "input", "value"], ["for", "bEmail"], ["id", "bEmail", "type", "email", "placeholder", "Ej. comprador@email.com", 1, "neu-input", 3, "input", "value"], [1, "summary-box", "neu-card"], [1, "summary-item"], [1, "summary-price"], [1, "summary-divider"], ["class", "summary-item", 4, "ngIf"], [1, "success-banner"], [1, "success-icon"], ["class", "ticket-result-card neu-card", 4, "ngIf"], [1, "ticket-result-card", "neu-card"], [1, "result-row"], [1, "code-badge"], [1, "public-url-box"], ["for", "public-ticket-url"], [1, "url-input-group"], ["id", "public-ticket-url", "type", "text", "readonly", "", 1, "neu-input", 3, "value"], ["x", "9", "y", "9", "width", "13", "height", "13", "rx", "2", "ry", "2"], ["d", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div")(3, "h1");
      \u0275\u0275text(4, "Dashboard de Estad\xEDsticas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p", 2);
      \u0275\u0275text(6, "Resumen de ventas, recaudaci\xF3n y estado de bonos de la Pe\xF1a 2026");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3)(8, "button", 4);
      \u0275\u0275listener("click", function DashboardComponent_Template_button_click_8_listener() {
        return ctx.openIssueModal();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 5);
      \u0275\u0275element(10, "path", 6)(11, "path", 7)(12, "path", 8)(13, "path", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275text(14, " Emitir Nuevo Ticket / Bono ");
      \u0275\u0275elementEnd();
      \u0275\u0275template(15, DashboardComponent_div_15_Template, 7, 2, "div", 10);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(16, DashboardComponent_div_16_Template, 6, 1, "div", 11)(17, DashboardComponent_div_17_Template, 4, 0, "div", 12)(18, DashboardComponent_div_18_Template, 108, 45, "div", 13)(19, DashboardComponent_div_19_Template, 15, 6, "div", 14);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(15);
      \u0275\u0275property("ngIf", ctx.authService.isAdmin());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showIssueModal());
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, DecimalPipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel], styles: ['\n\n.dashboard-container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 2rem;\n  gap: 1rem;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.95rem;\n}\n.header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 0.75rem;\n}\n.admin-filter[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.9rem;\n  color: var(--text-secondary, #665A5D);\n}\n.select-control[_ngcontent-%COMP%] {\n  min-width: 250px;\n}\n.dashboard-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1.5rem;\n}\n.stat-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1.25rem;\n}\n.stat-icon[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-family: var(--font-heading, "Cinzel", serif);\n  color: var(--color-bordo, #7A001E);\n}\n.full-width[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n}\n.price-management-card[_ngcontent-%COMP%] {\n  border-top: 3px solid var(--color-gold, #D4AF37);\n}\n.price-inputs-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr auto;\n  gap: 1.25rem;\n  align-items: flex-end;\n  margin-top: 1rem;\n}\n.price-input-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n  color: var(--text-secondary, #665A5D);\n}\n.breakdown-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 1.25rem;\n  margin-top: 1rem;\n  width: 100%;\n}\n.breakdown-card[_ngcontent-%COMP%] {\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 1.1rem;\n  border-radius: var(--radius-sm, 8px);\n  box-shadow: var(--neu-shadow-inset);\n  min-width: 0;\n  width: 100%;\n}\n.breakdown-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 1rem;\n}\n.metric-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n  margin-bottom: 0.3rem;\n}\n.metric-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.metric-val[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n}\n.progress-bar[_ngcontent-%COMP%] {\n  height: 8px;\n  background: rgba(216, 208, 195, 0.6);\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 1rem;\n}\n.progress-fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: 4px;\n}\n.progress-fill.simple[_ngcontent-%COMP%] {\n  background: var(--color-bordo, #7A001E);\n}\n.progress-fill.comida[_ngcontent-%COMP%] {\n  background: var(--color-gold, #D4AF37);\n}\n.progress-fill.anticipada[_ngcontent-%COMP%] {\n  background: #2563eb;\n}\n.progress-fill.puerta[_ngcontent-%COMP%] {\n  background: #059669;\n}\n.status-summary-item[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 0.5rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n  font-size: 0.95rem;\n}\n.table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  margin-top: 1rem;\n}\n.tickets-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.tickets-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 0.8rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.tickets-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.8rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n.badge-simple[_ngcontent-%COMP%] {\n  background: rgba(122, 0, 30, 0.1);\n  color: var(--color-bordo, #7A001E);\n}\n.badge-comida[_ngcontent-%COMP%] {\n  background: rgba(212, 175, 55, 0.2);\n  color: #856404;\n}\n.badge-source[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.05);\n  color: var(--text-secondary);\n}\n.modal-backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(43, 35, 37, 0.6);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n  padding: 1rem;\n}\n.modal-card[_ngcontent-%COMP%] {\n  max-width: 600px;\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n}\n.modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.btn-close[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  font-size: 1.5rem;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n.ticket-type-selector[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.type-card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  text-align: center;\n  padding: 1.25rem;\n  border: 2px solid transparent;\n}\n.type-card.selected[_ngcontent-%COMP%] {\n  border-color: var(--color-bordo, #7A001E);\n  box-shadow: var(--neu-shadow-inset);\n  background: var(--bg-cream-base, #F7F3EB);\n}\n.type-icon[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  margin-bottom: 0.5rem;\n}\n.type-title[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: var(--color-bordo);\n}\n.type-price[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  font-family: var(--font-heading);\n  color: var(--color-gold);\n  font-weight: 700;\n}\n.inputs-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.step-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 1.75rem;\n  padding: 0.75rem 1rem;\n  background: rgba(247, 243, 235, 0.6);\n  border-radius: var(--radius-md, 12px);\n  border: 1px solid rgba(122, 0, 30, 0.08);\n}\n.step-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: var(--text-muted, #756865);\n}\n.step-number[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: var(--neu-bg, #f7f3eb);\n  box-shadow: 2px 2px 5px rgba(175, 160, 150, 0.4), -2px -2px 5px #ffffff;\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: var(--text-muted, #756865);\n}\n.step-item.active[_ngcontent-%COMP%]   .step-number[_ngcontent-%COMP%] {\n  background: var(--color-bordo, #7A001E);\n  color: #ffffff;\n  box-shadow: 0 2px 6px rgba(122, 0, 30, 0.35);\n}\n.step-item.active[_ngcontent-%COMP%]   .step-title[_ngcontent-%COMP%] {\n  color: var(--color-bordo, #7A001E);\n  font-weight: 700;\n}\n.step-item.completed[_ngcontent-%COMP%]   .step-number[_ngcontent-%COMP%] {\n  background: #2e7d32;\n  color: #ffffff;\n}\n.step-line[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 3px;\n  background: rgba(122, 0, 30, 0.12);\n  margin: 0 0.75rem;\n  border-radius: 2px;\n}\n.step-line.completed[_ngcontent-%COMP%] {\n  background: #2e7d32;\n}\n.sale-source-container[_ngcontent-%COMP%] {\n  margin-top: 1.75rem;\n}\n.sale-source-container[_ngcontent-%COMP%]   .label-title[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 700;\n  color: var(--text-main, #3b2d2f);\n  margin-bottom: 0.75rem;\n  font-size: 0.95rem;\n}\n.sale-source-cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}\n.source-card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  text-align: left;\n  padding: 1rem 1.25rem;\n  border: 2px solid transparent;\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  transition: all 0.2s ease;\n  background: var(--neu-bg, #f7f3eb);\n}\n.source-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n.source-card.selected[_ngcontent-%COMP%] {\n  border-color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: inset 2px 2px 5px rgba(175, 160, 150, 0.3), inset -2px -2px 5px #ffffff;\n}\n.source-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.source-icon-svg[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  stroke: var(--color-bordo, #7A001E);\n  stroke-width: 2;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.source-title[_ngcontent-%COMP%] {\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  font-size: 0.98rem;\n}\n.source-badge[_ngcontent-%COMP%] {\n  display: inline-block;\n  font-size: 0.78rem;\n  color: #1b5e20;\n  background: rgba(46, 125, 50, 0.1);\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-weight: 600;\n  width: fit-content;\n}\n.source-badge.badge-puerta[_ngcontent-%COMP%] {\n  color: #b71c1c;\n  background: rgba(183, 28, 28, 0.1);\n}\n.modal-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  margin-top: 2rem;\n}\n@media (max-width: 768px) {\n  .dashboard-container[_ngcontent-%COMP%] {\n    padding: 0.75rem;\n  }\n  .dashboard-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .header-actions[_ngcontent-%COMP%] {\n    align-items: stretch;\n    width: 100%;\n  }\n  .header-actions[_ngcontent-%COMP%]   .neu-btn[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .admin-filter[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n    width: 100%;\n    gap: 0.35rem;\n  }\n  .select-control[_ngcontent-%COMP%] {\n    min-width: unset;\n    width: 100%;\n  }\n  .breakdown-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n  }\n  .breakdown-card[_ngcontent-%COMP%] {\n    padding: 0.9rem;\n  }\n  .price-inputs-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .ticket-type-selector[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .inputs-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=dashboard.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: true, imports: [CommonModule, FormsModule], template: `<section class="dashboard-container">
  <div class="dashboard-header">
    <div>
      <h1>Dashboard de Estad\xEDsticas</h1>
      <p class="subtitle">Resumen de ventas, recaudaci\xF3n y estado de bonos de la Pe\xF1a 2026</p>
    </div>

    <div class="header-actions">
      <button class="neu-btn neu-btn-bordo" (click)="openIssueModal()">
        <svg class="icon" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/></svg> Emitir Nuevo Ticket / Bono
      </button>

      <!-- Admin View Switcher -->
      <div *ngIf="authService.isAdmin()" class="admin-filter">
        <label for="sellerSelect">Filtrar por Vendedor:</label>
        <select id="sellerSelect" [value]="selectedSellerId()" (change)="onSellerFilterChange($event)" class="neu-input select-control">
          <option value="ALL">Todos los vendedores (Global)</option>
          <option *ngFor="let u of users()" [value]="u.id">
            {{ u.name }} ({{ u.email }})
          </option>
        </select>
      </div>
    </div>
  </div>

  <div *ngIf="errorMessage()" class="alert alert-danger">
    <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {{ errorMessage() }}
  </div>

  <div *ngIf="loading()" class="loading-state">
    <div class="spinner"></div>
    <p>Cargando m\xE9tricas en tiempo real...</p>
  </div>

  <div *ngIf="!loading()" class="dashboard-grid">
    <!-- Main Stat Cards -->
    <div class="neu-card stat-card primary">
      <div class="stat-icon"><svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
      <div class="stat-info">
        <span class="stat-label">Recaudaci\xF3n Total</span>
        <h2 class="stat-value">\${{ stats().totalRevenue | number:'1.2-2' }}</h2>
      </div>
    </div>

    <div class="neu-card stat-card">
      <div class="stat-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg></div>
      <div class="stat-info">
        <span class="stat-label">Bonos Emitidos</span>
        <h2 class="stat-value">{{ stats().totalIssued }}</h2>
      </div>
    </div>

    <div class="neu-card stat-card">
      <div class="stat-icon"><svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="stat-info">
        <span class="stat-label">Entradas Usadas</span>
        <h2 class="stat-value">{{ stats().entriesUsedCount }}</h2>
      </div>
    </div>

    <div class="neu-card stat-card warning">
      <div class="stat-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M3 11h18"/><path d="M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"/><path d="M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"/></svg></div>
      <div class="stat-info">
        <span class="stat-label">Comidas Pendientes</span>
        <h2 class="stat-value">{{ stats().foodPendingCount }}</h2>
      </div>
    </div>

    <!-- Admin Price Management Card -->
    <div *ngIf="authService.isAdmin()" class="neu-card full-width price-management-card">
      <div class="card-header-row">
        <div>
          <h3><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Configuraci\xF3n de Precios de Entradas (Solo Administrador)</h3>
          <p class="subtitle">Modifica y guarda en la base de datos los precios vigentes para tickets simples y con comida.</p>
        </div>
      </div>

      <div *ngIf="priceSuccessMessage()" class="alert alert-success">
        <svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> {{ priceSuccessMessage() }}
      </div>
      <div *ngIf="priceErrorMessage()" class="alert alert-danger">
        <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {{ priceErrorMessage() }}
      </div>

      <div class="price-inputs-grid">
        <div class="price-input-group">
          <label for="priceSimple">Precio Ticket SIMPLE ($):</label>
          <input
            id="priceSimple"
            type="number"
            min="0"
            [ngModel]="priceSimple()"
            (ngModelChange)="priceSimple.set($event)"
            class="neu-input"
          />
        </div>

        <div class="price-input-group">
          <label for="priceConComida">Precio Ticket CON COMIDA ($):</label>
          <input
            id="priceConComida"
            type="number"
            min="0"
            [ngModel]="priceConComida()"
            (ngModelChange)="priceConComida.set($event)"
            class="neu-input"
          />
        </div>

        <div class="price-btn-group">
          <button (click)="onSavePrices()" [disabled]="savingPrices()" class="neu-btn neu-btn-bordo">
            <span *ngIf="savingPrices()" class="neu-spinner"></span>
            <span><svg class="icon" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> {{ savingPrices() ? 'Guardando Precios...' : 'Guardar Nuevos Precios' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Detailed Breakdowns Grid -->
    <div class="neu-card full-width">
      <h3>Categor\xEDas y Modalidades de Venta</h3>
      
      <div class="breakdown-grid">
        <!-- Breakdown by Ticket Type -->
        <div class="breakdown-card">
          <h4>Tipos de Bono</h4>
          
          <div class="metric-row">
            <span class="metric-title">SIMPLE</span>
            <span class="metric-val">{{ stats().ticketsSimpleCount }} emitidos (\${{ stats().ticketsSimpleRevenue | number:'1.2-2' }})</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill simple" [style.width.%]="stats().totalIssued ? (stats().ticketsSimpleCount / stats().totalIssued) * 100 : 0"></div>
          </div>

          <div class="metric-row">
            <span class="metric-title">CON COMIDA</span>
            <span class="metric-val">{{ stats().ticketsConComidaCount }} emitidos (\${{ stats().ticketsConComidaRevenue | number:'1.2-2' }})</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill comida" [style.width.%]="stats().totalIssued ? (stats().ticketsConComidaCount / stats().totalIssued) * 100 : 0"></div>
          </div>
        </div>

        <!-- Breakdown by Sale Source (Anticipada vs Puerta) -->
        <div class="breakdown-card">
          <h4>Origen de Venta</h4>

          <div class="metric-row">
            <span class="metric-title">ANTICIPADA</span>
            <span class="metric-val">{{ stats().anticipadaCount }} emitidos (\${{ stats().anticipadaRevenue | number:'1.2-2' }})</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill anticipada" [style.width.%]="stats().totalIssued ? (stats().anticipadaCount / stats().totalIssued) * 100 : 0"></div>
          </div>

          <div class="metric-row">
            <span class="metric-title">PUERTA</span>
            <span class="metric-val">{{ stats().puertaCount }} emitidos (\${{ stats().puertaRevenue | number:'1.2-2' }})</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill puerta" [style.width.%]="stats().totalIssued ? (stats().puertaCount / stats().totalIssued) * 100 : 0"></div>
          </div>
        </div>

        <!-- Status Summary -->
        <div class="breakdown-card">
          <h4>Estado de Entregas & Anulaciones</h4>

          <div class="status-summary-item">
            <span>Comidas Entregadas:</span>
            <strong>{{ stats().foodDeliveredCount }}</strong>
          </div>

          <div class="status-summary-item">
            <span>Comidas Pendientes:</span>
            <strong class="text-warning">{{ stats().foodPendingCount }}</strong>
          </div>

          <div class="status-summary-item">
            <span>Bonos Anulados:</span>
            <strong class="text-danger">{{ stats().annulledCount }} (\${{ stats().annulledRevenue | number:'1.2-2' }})</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Issued Tickets List -->
    <div class="neu-card full-width">
      <h3>\xDAltimos Bonos Emitidos</h3>
      
      <div *ngIf="stats().recentTickets.length === 0" class="empty-msg">
        No hay bonos emitidos recientemente.
      </div>

      <div *ngIf="stats().recentTickets.length > 0" class="table-responsive">
        <table class="tickets-table">
          <thead>
            <tr>
              <th># Bono</th>
              <th>C\xF3digo</th>
              <th>Comprador</th>
              <th>Tipo</th>
              <th>Origen</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of stats().recentTickets">
              <td><strong>#{{ t.ticketNumber || t.id.slice(0, 6) }}</strong></td>
              <td><code>{{ t.fourDigitCode || (t.publicToken ? t.publicToken.slice(0, 4) : '') }}</code></td>
              <td>{{ t.buyerName || 'Cliente General' }}</td>
              <td>
                <span class="badge" [class.badge-simple]="t.ticketType === 'SIMPLE'" [class.badge-comida]="t.ticketType === 'CON_COMIDA'">
                  {{ t.ticketType }}
                </span>
              </td>
              <td><span class="badge badge-source">{{ t.saleSource }}</span></td>
              <td><strong>\${{ t.pricePaid | number:'1.2-2' }}</strong></td>
              <td>
                <span class="neu-badge" [ngClass]="{
                  'neu-badge-vendido': t.status === 'VENDIDO',
                  'neu-badge-usado': t.status === 'USADO_ENTRADA' || t.status === 'USADO_COMIDA',
                  'neu-badge-anulado': t.status === 'ANULADO'
                }">
                  {{ t.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal Emitir Nuevo Ticket -->
  <div *ngIf="showIssueModal()" class="modal-backdrop">
    <div class="neu-card modal-card">
      <div class="modal-header">
        <h2><svg class="icon" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg> Emitir Nuevo Bono / Ticket</h2>
        <button class="btn-close" (click)="closeIssueModal()">\u2715</button>
      </div>

      <!-- Step Indicator -->
      <div *ngIf="issueStep() < 4" class="step-indicator">
        <div class="step-item" [class.active]="issueStep() === 1" [class.completed]="issueStep() > 1">
          <span class="step-number">1</span>
          <span class="step-title">Tipo & Precio</span>
        </div>
        <div class="step-line" [class.completed]="issueStep() > 1"></div>
        <div class="step-item" [class.active]="issueStep() === 2" [class.completed]="issueStep() > 2">
          <span class="step-number">2</span>
          <span class="step-title">Comprador</span>
        </div>
        <div class="step-line" [class.completed]="issueStep() > 2"></div>
        <div class="step-item" [class.active]="issueStep() === 3">
          <span class="step-number">3</span>
          <span class="step-title">Resumen</span>
        </div>
      </div>

      <div *ngIf="issueErrorMessage()" class="alert alert-danger">
        <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {{ issueErrorMessage() }}
      </div>

      <!-- STEP 1: Selection of Ticket Type & Sale Source -->
      <div *ngIf="issueStep() === 1" class="modal-body">
        <h3>1. Selecciona el Tipo de Entrada</h3>
        <p class="modal-subtitle">Los precios corresponden a los configurados activamente en el sistema.</p>
        
        <div class="ticket-type-selector">
          <button type="button" class="type-card neu-card" [class.selected]="newTicketType() === 'SIMPLE'" (click)="newTicketType.set('SIMPLE')">
            <div class="type-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg></div>
            <div class="type-title">Bono Simple</div>
            <div class="type-price">\${{ priceSimple() | number:'1.2-2' }}</div>
            <p>Acceso general al seminario.</p>
          </button>

          <button type="button" class="type-card neu-card" [class.selected]="newTicketType() === 'CON_COMIDA'" (click)="newTicketType.set('CON_COMIDA')">
            <div class="type-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M3 11h18"/><path d="M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"/><path d="M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"/></svg></div>
            <div class="type-title">Bono con Comida</div>
            <div class="type-price">\${{ priceConComida() | number:'1.2-2' }}</div>
            <p>Acceso al seminario + men\xFA de comida incluido.</p>
          </button>
        </div>

        <div class="sale-source-container">
          <label class="label-title">Fuente / Origen de Emisi\xF3n:</label>
          <div class="sale-source-cards">
            <button
              type="button"
              class="source-card neu-card"
              [class.selected]="quotaOption() === 'PERSONAL'"
              (click)="quotaOption.set('PERSONAL')"
            >
              <div class="source-header">
                <svg class="icon source-icon-svg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span class="source-title">Mi Cuota Personal</span>
              </div>
              <span class="source-badge">
                {{ personalQuotaAvailable() !== null ? personalQuotaAvailable() + ' disponibles' : 'Cargando...' }}
              </span>
            </button>

            <button
              type="button"
              class="source-card neu-card"
              [class.selected]="quotaOption() === 'LIBRE'"
              (click)="quotaOption.set('LIBRE')"
            >
              <div class="source-header">
                <svg class="icon source-icon-svg" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span class="source-title">Bols\xF3n Libre Global</span>
              </div>
              <span class="source-badge">
                {{ globalFreeQuotaAvailable() !== null ? globalFreeQuotaAvailable() + ' disponibles' : 'Cargando...' }}
              </span>
            </button>

            <button
              type="button"
              class="source-card neu-card"
              [class.selected]="quotaOption() === 'PUERTA'"
              (click)="quotaOption.set('PUERTA')"
            >
              <div class="source-header">
                <svg class="icon source-icon-svg" viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><circle cx="14" cy="12" r="1"/></svg>
                <span class="source-title">Venta en Puerta</span>
              </div>
              <span class="source-badge badge-puerta">Sin restricci\xF3n</span>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="neu-btn" (click)="closeIssueModal()">Cancelar</button>
          <button class="neu-btn neu-btn-bordo" (click)="goToStep(2)">Siguiente: Datos Comprador &rarr;</button>
        </div>
      </div>

      <!-- STEP 2: Buyer Information -->
      <div *ngIf="issueStep() === 2" class="modal-body">
        <h3>2. Datos del Comprador</h3>
        <p class="modal-subtitle">Completa la informaci\xF3n para personalizar el bono emitido.</p>

        <div class="inputs-grid">
          <div class="form-group">
            <label for="bFirstName">Nombre *</label>
            <input id="bFirstName" type="text" class="neu-input" [value]="buyerFirstName()" (input)="buyerFirstName.set($any($event.target).value)" placeholder="Ej. Juan">
          </div>

          <div class="form-group">
            <label for="bLastName">Apellido *</label>
            <input id="bLastName" type="text" class="neu-input" [value]="buyerLastName()" (input)="buyerLastName.set($any($event.target).value)" placeholder="Ej. P\xE9rez">
          </div>

          <div class="form-group">
            <label for="bPhone">Tel\xE9fono *</label>
            <input id="bPhone" type="text" class="neu-input" [value]="buyerPhone()" (input)="buyerPhone.set($any($event.target).value)" placeholder="Ej. 1122334455">
          </div>

          <div class="form-group">
            <label for="bEmail">Email (Opcional)</label>
            <input id="bEmail" type="email" class="neu-input" [value]="buyerEmail()" (input)="buyerEmail.set($any($event.target).value)" placeholder="Ej. comprador@email.com">
          </div>
        </div>

        <div class="modal-footer">
          <button class="neu-btn" (click)="goToStep(1)">&larr; Volver</button>
          <button class="neu-btn neu-btn-bordo" (click)="goToStep(3)">Siguiente: Resumen &rarr;</button>
        </div>
      </div>

      <!-- STEP 3: Summary & Confirmation -->
      <div *ngIf="issueStep() === 3" class="modal-body">
        <h3>3. Resumen y Confirmaci\xF3n de Emisi\xF3n</h3>
        <p class="modal-subtitle">Verifica los detalles del ticket antes de registrarlo en la base de datos.</p>

        <div class="summary-box neu-card">
          <div class="summary-item">
            <span>Tipo de Bono:</span>
            <strong>{{ newTicketType() === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE' }}</strong>
          </div>
          <div class="summary-item">
            <span>Fuente de Emisi\xF3n:</span>
            <strong>{{ quotaOption() === 'PERSONAL' ? 'Mi Cuota Personal' : (quotaOption() === 'LIBRE' ? 'Bols\xF3n Libre Global' : 'Venta en Puerta') }}</strong>
          </div>
          <div class="summary-item">
            <span>Precio Total:</span>
            <strong class="summary-price">\${{ currentSelectedPrice() | number:'1.2-2' }}</strong>
          </div>
          <hr class="summary-divider">
          <div class="summary-item">
            <span>Comprador:</span>
            <strong>{{ buyerFirstName() }} {{ buyerLastName() }}</strong>
          </div>
          <div class="summary-item">
            <span>Tel\xE9fono:</span>
            <strong>{{ buyerPhone() }}</strong>
          </div>
          <div class="summary-item" *ngIf="buyerEmail()">
            <span>Email:</span>
            <strong>{{ buyerEmail() }}</strong>
          </div>
        </div>

        <div class="modal-footer">
          <button class="neu-btn" (click)="goToStep(2)">&larr; Editar Datos</button>
          <button class="neu-btn neu-btn-bordo" [disabled]="issuingTicket()" (click)="submitIssueTicket()">
            <span *ngIf="issuingTicket()" class="neu-spinner"></span>
            <span>{{ issuingTicket() ? 'Emitiendo Bono...' : 'Confirmar y Emitir Bono' }}</span>
          </button>
        </div>
      </div>

      <!-- STEP 4: Success Result & Public URL Response -->
      <div *ngIf="issueStep() === 4" class="modal-body">
        <div class="success-banner">
          <div class="success-icon"><svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h3>\xA1Bono Emitido Correctamente!</h3>
          <p class="modal-subtitle">El ticket ha sido registrado en la base de datos.</p>
        </div>

        <div *ngIf="createdTicket()" class="ticket-result-card neu-card">
          <div class="result-row">
            <span>N\xFAmero de Bono:</span>
            <strong>#{{ createdTicket().ticket_number }}</strong>
          </div>
          <div class="result-row">
            <span>C\xF3digo de 4 D\xEDgitos:</span>
            <code class="code-badge">{{ createdTicket().four_digit_code }}</code>
          </div>
          <div class="result-row">
            <span>Monto Pagado:</span>
            <strong>\${{ createdTicket().price_paid | number:'1.2-2' }}</strong>
          </div>
          <div class="result-row">
            <span>Comprador:</span>
            <strong>{{ createdTicket().buyer?.first_name }} {{ createdTicket().buyer?.last_name }}</strong>
          </div>

          <div class="public-url-box">
            <label for="public-ticket-url">URL P\xFAblica del Bono:</label>
            <div class="url-input-group">
              <input id="public-ticket-url" type="text" readonly class="neu-input" [value]="createdTicket().public_url">
              <button class="neu-btn neu-btn-bordo" (click)="copyPublicUrl()">
                <svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {{ copiedPublicUrl() ? '\xA1Copiado! \u2713' : 'Copiar URL' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="neu-btn neu-btn-bordo" (click)="closeIssueModal()">Cerrar y Volver al Dashboard</button>
        </div>
      </div>
    </div>
  </div>
</section>

`, styles: ['/* src/app/features/dashboard/dashboard.component.css */\n.dashboard-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.dashboard-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 2rem;\n  gap: 1rem;\n}\n.dashboard-header h1 {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle {\n  color: var(--text-secondary, #665A5D);\n  font-size: 0.95rem;\n}\n.header-actions {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 0.75rem;\n}\n.admin-filter {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.9rem;\n  color: var(--text-secondary, #665A5D);\n}\n.select-control {\n  min-width: 250px;\n}\n.dashboard-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n  gap: 1.5rem;\n}\n.stat-card {\n  display: flex;\n  align-items: center;\n  gap: 1.25rem;\n}\n.stat-icon {\n  font-size: 2.2rem;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.stat-info {\n  display: flex;\n  flex-direction: column;\n}\n.stat-label {\n  font-size: 0.85rem;\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n}\n.stat-value {\n  font-size: 1.75rem;\n  font-family: var(--font-heading, "Cinzel", serif);\n  color: var(--color-bordo, #7A001E);\n}\n.full-width {\n  grid-column: 1 / -1;\n}\n.price-management-card {\n  border-top: 3px solid var(--color-gold, #D4AF37);\n}\n.price-inputs-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr auto;\n  gap: 1.25rem;\n  align-items: flex-end;\n  margin-top: 1rem;\n}\n.price-input-group label {\n  display: block;\n  font-size: 0.85rem;\n  font-weight: 600;\n  margin-bottom: 0.4rem;\n  color: var(--text-secondary, #665A5D);\n}\n.breakdown-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 1.25rem;\n  margin-top: 1rem;\n  width: 100%;\n}\n.breakdown-card {\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 1.1rem;\n  border-radius: var(--radius-sm, 8px);\n  box-shadow: var(--neu-shadow-inset);\n  min-width: 0;\n  width: 100%;\n}\n.breakdown-card h4 {\n  font-size: 1.1rem;\n  margin-bottom: 1rem;\n}\n.metric-row {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n  margin-bottom: 0.3rem;\n}\n.metric-title {\n  font-weight: 600;\n}\n.metric-val {\n  color: var(--text-secondary, #665A5D);\n}\n.progress-bar {\n  height: 8px;\n  background: rgba(216, 208, 195, 0.6);\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 1rem;\n}\n.progress-fill {\n  height: 100%;\n  border-radius: 4px;\n}\n.progress-fill.simple {\n  background: var(--color-bordo, #7A001E);\n}\n.progress-fill.comida {\n  background: var(--color-gold, #D4AF37);\n}\n.progress-fill.anticipada {\n  background: #2563eb;\n}\n.progress-fill.puerta {\n  background: #059669;\n}\n.status-summary-item {\n  display: flex;\n  justify-content: space-between;\n  padding: 0.5rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n  font-size: 0.95rem;\n}\n.table-responsive {\n  overflow-x: auto;\n  margin-top: 1rem;\n}\n.tickets-table {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.tickets-table th {\n  padding: 0.8rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.tickets-table td {\n  padding: 0.8rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.badge {\n  padding: 0.25rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 700;\n}\n.badge-simple {\n  background: rgba(122, 0, 30, 0.1);\n  color: var(--color-bordo, #7A001E);\n}\n.badge-comida {\n  background: rgba(212, 175, 55, 0.2);\n  color: #856404;\n}\n.badge-source {\n  background: rgba(0, 0, 0, 0.05);\n  color: var(--text-secondary);\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(43, 35, 37, 0.6);\n  backdrop-filter: blur(4px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 2000;\n  padding: 1rem;\n}\n.modal-card {\n  max-width: 600px;\n  width: 100%;\n  max-height: 90vh;\n  overflow-y: auto;\n}\n.modal-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.btn-close {\n  background: transparent;\n  border: none;\n  font-size: 1.5rem;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n.ticket-type-selector {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.type-card {\n  cursor: pointer;\n  text-align: center;\n  padding: 1.25rem;\n  border: 2px solid transparent;\n}\n.type-card.selected {\n  border-color: var(--color-bordo, #7A001E);\n  box-shadow: var(--neu-shadow-inset);\n  background: var(--bg-cream-base, #F7F3EB);\n}\n.type-icon {\n  font-size: 2.2rem;\n  margin-bottom: 0.5rem;\n}\n.type-title {\n  font-weight: 700;\n  color: var(--color-bordo);\n}\n.type-price {\n  font-size: 1.3rem;\n  font-family: var(--font-heading);\n  color: var(--color-gold);\n  font-weight: 700;\n}\n.inputs-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.step-indicator {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 1.75rem;\n  padding: 0.75rem 1rem;\n  background: rgba(247, 243, 235, 0.6);\n  border-radius: var(--radius-md, 12px);\n  border: 1px solid rgba(122, 0, 30, 0.08);\n}\n.step-item {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: var(--text-muted, #756865);\n}\n.step-number {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: var(--neu-bg, #f7f3eb);\n  box-shadow: 2px 2px 5px rgba(175, 160, 150, 0.4), -2px -2px 5px #ffffff;\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: var(--text-muted, #756865);\n}\n.step-item.active .step-number {\n  background: var(--color-bordo, #7A001E);\n  color: #ffffff;\n  box-shadow: 0 2px 6px rgba(122, 0, 30, 0.35);\n}\n.step-item.active .step-title {\n  color: var(--color-bordo, #7A001E);\n  font-weight: 700;\n}\n.step-item.completed .step-number {\n  background: #2e7d32;\n  color: #ffffff;\n}\n.step-line {\n  flex: 1;\n  height: 3px;\n  background: rgba(122, 0, 30, 0.12);\n  margin: 0 0.75rem;\n  border-radius: 2px;\n}\n.step-line.completed {\n  background: #2e7d32;\n}\n.sale-source-container {\n  margin-top: 1.75rem;\n}\n.sale-source-container .label-title {\n  display: block;\n  font-weight: 700;\n  color: var(--text-main, #3b2d2f);\n  margin-bottom: 0.75rem;\n  font-size: 0.95rem;\n}\n.sale-source-cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}\n.source-card {\n  cursor: pointer;\n  text-align: left;\n  padding: 1rem 1.25rem;\n  border: 2px solid transparent;\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n  transition: all 0.2s ease;\n  background: var(--neu-bg, #f7f3eb);\n}\n.source-card:hover {\n  transform: translateY(-2px);\n}\n.source-card.selected {\n  border-color: var(--color-bordo, #7A001E);\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: inset 2px 2px 5px rgba(175, 160, 150, 0.3), inset -2px -2px 5px #ffffff;\n}\n.source-header {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.source-icon-svg {\n  width: 20px;\n  height: 20px;\n  stroke: var(--color-bordo, #7A001E);\n  stroke-width: 2;\n  fill: none;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n.source-title {\n  font-weight: 700;\n  color: var(--color-bordo, #7A001E);\n  font-size: 0.98rem;\n}\n.source-badge {\n  display: inline-block;\n  font-size: 0.78rem;\n  color: #1b5e20;\n  background: rgba(46, 125, 50, 0.1);\n  padding: 0.2rem 0.5rem;\n  border-radius: 4px;\n  font-weight: 600;\n  width: fit-content;\n}\n.source-badge.badge-puerta {\n  color: #b71c1c;\n  background: rgba(183, 28, 28, 0.1);\n}\n.modal-footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  margin-top: 2rem;\n}\n@media (max-width: 768px) {\n  .dashboard-container {\n    padding: 0.75rem;\n  }\n  .dashboard-header {\n    flex-direction: column;\n    gap: 1rem;\n  }\n  .header-actions {\n    align-items: stretch;\n    width: 100%;\n  }\n  .header-actions .neu-btn {\n    width: 100%;\n  }\n  .admin-filter {\n    flex-direction: column;\n    align-items: stretch;\n    width: 100%;\n    gap: 0.35rem;\n  }\n  .select-control {\n    min-width: unset;\n    width: 100%;\n  }\n  .breakdown-grid {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n  }\n  .breakdown-card {\n    padding: 0.9rem;\n  }\n  .price-inputs-grid {\n    grid-template-columns: 1fr;\n  }\n  .ticket-type-selector {\n    grid-template-columns: 1fr;\n  }\n  .inputs-grid {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=dashboard.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 15 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-YOKCCWVP.js.map
