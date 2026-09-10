import {
  require_jsQR
} from "./chunk-OSOWVIT3.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  PatternValidator,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-J7Q6KLAF.js";
import {
  ApiService
} from "./chunk-BUOOEH3R.js";
import {
  CommonModule,
  Component,
  NgClass,
  NgForOf,
  NgIf,
  ViewChild,
  __toESM,
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
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-SFLJKOAY.js";

// src/app/features/tickets/validate-food/validate-food.component.ts
var import_jsqr = __toESM(require_jsQR());
var _c0 = ["videoElement"];
function ValidateFoodComponent_div_30_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 31);
  }
}
function ValidateFoodComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "h3");
    \u0275\u0275text(2, "Ingrese C\xF3digo de 4 D\xEDgitos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "form", 25);
    \u0275\u0275listener("ngSubmit", function ValidateFoodComponent_div_30_Template_form_ngSubmit_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchByCode());
    });
    \u0275\u0275elementStart(4, "div", 26)(5, "label", 27);
    \u0275\u0275text(6, "C\xF3digo de 4 D\xEDgitos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 28);
    \u0275\u0275twoWayListener("ngModelChange", function ValidateFoodComponent_div_30_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.fourDigitInput, $event) || (ctx_r1.fourDigitInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 29);
    \u0275\u0275template(9, ValidateFoodComponent_div_30_span_9_Template, 1, 0, "span", 30);
    \u0275\u0275elementStart(10, "span");
    \u0275\u0275text(11, "Buscar Bono");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.fourDigitInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.loading());
  }
}
function ValidateFoodComponent_div_31_div_8_p_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.cameraError());
  }
}
function ValidateFoodComponent_div_31_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41)(1, "span", 42);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 3);
    \u0275\u0275element(3, "path", 15)(4, "circle", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, ValidateFoodComponent_div_31_div_8_p_5_Template, 2, 1, "p", 43);
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "button", 44);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_31_div_8_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.startCamera());
    });
    \u0275\u0275text(7, " Activar C\xE1mara ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.cameraError());
  }
}
function ValidateFoodComponent_div_31_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46)(1, "button", 47);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_31_div_9_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.stopCamera());
    });
    \u0275\u0275text(2, " Detener C\xE1mara ");
    \u0275\u0275elementEnd()();
  }
}
function ValidateFoodComponent_div_31_span_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 31);
  }
}
function ValidateFoodComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "h3");
    \u0275\u0275text(2, "Escanear C\xF3digo QR con C\xE1mara");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 32);
    \u0275\u0275text(4, "Permite el acceso a la c\xE1mara para escanear el QR del bono o ingresa el token p\xFAblico manualmente.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 33);
    \u0275\u0275element(6, "video", 34, 0);
    \u0275\u0275template(8, ValidateFoodComponent_div_31_div_8_Template, 8, 1, "div", 35)(9, ValidateFoodComponent_div_31_div_9_Template, 3, 0, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 37)(11, "label", 38);
    \u0275\u0275text(12, "O ingresar Token P\xFAblico de QR:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 26)(14, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function ValidateFoodComponent_div_31_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.qrTokenInput, $event) || (ctx_r1.qrTokenInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 40);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_31_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.searchByToken());
    });
    \u0275\u0275template(16, ValidateFoodComponent_div_31_span_16_Template, 1, 0, "span", 30);
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18, "Buscar por Token");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275classProp("hidden", !ctx_r1.cameraActive());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !ctx_r1.cameraActive());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.cameraActive());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.qrTokenInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.loading());
  }
}
function ValidateFoodComponent_div_32_div_12_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 58);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_32_div_12_button_3_Template_button_click_0_listener() {
      const t_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selectTicket(t_r8));
    });
    \u0275\u0275elementStart(1, "div", 59)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 60);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3("Bono #", t_r8.ticketNumber, " (C\xF3d: ", t_r8.fourDigitCode, ") - ", t_r8.ticketType, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Comprador: ", t_r8.buyerName || "N/A", "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Vendedor: ", t_r8.sellerName || "N/A", "");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getStatusBadgeClass(t_r8.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r8.status);
  }
}
function ValidateFoodComponent_div_32_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "h4");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275template(3, ValidateFoodComponent_div_32_div_12_button_3_Template, 10, 7, "button", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Bonos Encontrados (", ctx_r1.filteredTickets().length, ")");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.filteredTickets());
  }
}
function ValidateFoodComponent_div_32_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61);
    \u0275\u0275text(1, " No se encontraron bonos que coincidan con la b\xFAsqueda. ");
    \u0275\u0275elementEnd();
  }
}
function ValidateFoodComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "h3");
    \u0275\u0275text(2, "Buscar por Vendedor y Comprador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 48)(4, "div", 49)(5, "label", 50);
    \u0275\u0275text(6, "Nombre del Vendedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 51);
    \u0275\u0275twoWayListener("ngModelChange", function ValidateFoodComponent_div_32_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.sellerNameSearch, $event) || (ctx_r1.sellerNameSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function ValidateFoodComponent_div_32_Template_input_input_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearchFilterChange());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 49)(9, "label", 52);
    \u0275\u0275text(10, "Nombre del Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 53);
    \u0275\u0275twoWayListener("ngModelChange", function ValidateFoodComponent_div_32_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.buyerNameSearch, $event) || (ctx_r1.buyerNameSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function ValidateFoodComponent_div_32_Template_input_input_11_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearchFilterChange());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(12, ValidateFoodComponent_div_32_div_12_Template, 4, 2, "div", 54)(13, ValidateFoodComponent_div_32_div_13_Template, 2, 0, "div", 55);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sellerNameSearch);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.buyerNameSearch);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredTickets().length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isSearching() && ctx_r1.filteredTickets().length === 0);
  }
}
function ValidateFoodComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 62);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "path", 63)(3, "line", 64)(4, "line", 65);
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
function ValidateFoodComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "polyline", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r1.successMessage(), " ");
  }
}
function ValidateFoodComponent_div_35_div_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 84);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "circle", 85)(3, "line", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5, "TIPO DE BONO INV\xC1LIDO:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Este bono es de tipo ");
    \u0275\u0275elementStart(7, "code");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275text(9, " y NO incluye beneficio de comida. ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ticket_r10 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ticket_r10.ticketType);
  }
}
function ValidateFoodComponent_div_35_div_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 87);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "path", 63)(3, "line", 64)(4, "line", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "ENTRADA NO VALIDADA:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " El bono incluye comida, pero primero se debe validar la entrada en puerta (estado actual: ");
    \u0275\u0275elementStart(8, "code");
    \u0275\u0275text(9, "VENDIDO");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, "). ");
    \u0275\u0275elementEnd();
  }
}
function ValidateFoodComponent_div_35_div_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 87);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "path", 63)(3, "line", 64)(4, "line", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "COMIDA YA ENTREGADA:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7, " La raci\xF3n de comida de este bono ya fue retirada previamente. ");
    \u0275\u0275elementEnd();
  }
}
function ValidateFoodComponent_div_35_div_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 84);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "circle", 85)(3, "line", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5, "BONO ANULADO:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(6, " Este bono est\xE1 anulado. ");
    \u0275\u0275elementEnd();
  }
}
function ValidateFoodComponent_div_35_div_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 88);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "polygon", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4, "ELEGIBLE PARA COMIDA:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(5, " El asistente ingres\xF3 previamente y su bono es de tipo ");
    \u0275\u0275elementStart(6, "code");
    \u0275\u0275text(7, "CON_COMIDA");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, ". Listo para validar entrega. ");
    \u0275\u0275elementEnd();
  }
}
function ValidateFoodComponent_div_35_span_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 31);
  }
}
function ValidateFoodComponent_div_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 68)(1, "div", 69)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 70)(5, "span", 71);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 60);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 72)(10, "div", 73)(11, "span", 74);
    \u0275\u0275text(12, "C\xF3digo 4 D\xEDgitos:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 75);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 73)(16, "span", 74);
    \u0275\u0275text(17, "Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 76);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 73)(21, "span", 74);
    \u0275\u0275text(22, "Vendedor:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span", 76);
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 73)(26, "span", 74);
    \u0275\u0275text(27, "Tipo de Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span", 76);
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 73)(31, "span", 74);
    \u0275\u0275text(32, "Estado Actual:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "span", 76);
    \u0275\u0275text(34);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 73)(36, "span", 74);
    \u0275\u0275text(37, "Monto Pagado:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "span", 76);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div", 77);
    \u0275\u0275template(41, ValidateFoodComponent_div_35_div_41_Template, 10, 1, "div", 78)(42, ValidateFoodComponent_div_35_div_42_Template, 11, 0, "div", 79)(43, ValidateFoodComponent_div_35_div_43_Template, 8, 0, "div", 79)(44, ValidateFoodComponent_div_35_div_44_Template, 7, 0, "div", 78)(45, ValidateFoodComponent_div_35_div_45_Template, 9, 0, "div", 80);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 81)(47, "button", 82);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_35_Template_button_click_47_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.validateFood());
    });
    \u0275\u0275template(48, ValidateFoodComponent_div_35_span_48_Template, 1, 0, "span", 30);
    \u0275\u0275elementStart(49, "span");
    \u0275\u0275text(50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(51, "button", 83);
    \u0275\u0275listener("click", function ValidateFoodComponent_div_35_Template_button_click_51_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearSelection());
    });
    \u0275\u0275text(52, " Limpiar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ticket_r10 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Bono #", ticket_r10.ticketNumber, "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ticket_r10.ticketType);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", ctx_r1.getStatusBadgeClass(ticket_r10.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ticket_r10.status, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ticket_r10.fourDigitCode);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ticket_r10.buyerName || "No especificado");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ticket_r10.sellerName || "No especificado");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ticket_r10.ticketType);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ticket_r10.status);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("$", ticket_r10.pricePaid, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ticket_r10.ticketType !== "CON_COMIDA");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ticket_r10.ticketType === "CON_COMIDA" && ticket_r10.status === "VENDIDO");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ticket_r10.status === "USADO_COMIDA");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ticket_r10.status === "ANULADO");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ticket_r10.ticketType === "CON_COMIDA" && ticket_r10.status === "USADO_ENTRADA");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ticket_r10.ticketType !== "CON_COMIDA" || ticket_r10.status !== "USADO_ENTRADA" || ctx_r1.validating());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.validating());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.validating() ? "Procesando..." : "Confirmar y Entregar Comida (USADO_COMIDA)");
  }
}
var ValidateFoodComponent = class _ValidateFoodComponent {
  apiService = inject(ApiService);
  videoElement;
  activeMode = signal("code");
  fourDigitInput = "";
  qrTokenInput = "";
  sellerNameSearch = "";
  buyerNameSearch = "";
  allTickets = signal([]);
  filteredTickets = signal([]);
  isSearching = signal(false);
  selectedTicket = signal(null);
  loading = signal(false);
  validating = signal(false);
  errorMessage = signal(null);
  successMessage = signal(null);
  cameraActive = signal(false);
  cameraError = signal(null);
  mediaStream = null;
  scanAnimFrameId = null;
  scanCanvas = document.createElement("canvas");
  scanContext = this.scanCanvas.getContext("2d", { willReadFrequently: true });
  switchMode(mode) {
    this.activeMode.set(mode);
    this.clearMessages();
    if (mode !== "qr" && this.cameraActive()) {
      this.stopCamera();
    }
    if (mode === "search" && this.allTickets().length === 0) {
      this.loadAllTickets();
    }
  }
  clearMessages() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
  clearSelection() {
    this.selectedTicket.set(null);
    this.clearMessages();
  }
  searchByCode() {
    this.clearMessages();
    this.selectedTicket.set(null);
    const code = this.fourDigitInput.trim();
    if (code?.length !== 4) {
      this.errorMessage.set("Ingrese un c\xF3digo de 4 d\xEDgitos v\xE1lido.");
      return;
    }
    this.loading.set(true);
    this.apiService.listTickets().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          const match = res.data.find((t) => t.fourDigitCode === code);
          if (match) {
            this.selectedTicket.set(match);
          } else {
            this.errorMessage.set(`No se encontr\xF3 ning\xFAn bono con el c\xF3digo ${code}.`);
          }
        } else {
          this.errorMessage.set(res.message || "Error al buscar bono.");
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || "Error de servidor al buscar el bono.");
      }
    });
  }
  searchByToken() {
    this.clearMessages();
    this.selectedTicket.set(null);
    const token = this.qrTokenInput.trim();
    if (!token) {
      this.errorMessage.set("Ingrese un token p\xFAblico v\xE1lido.");
      return;
    }
    this.loading.set(true);
    this.apiService.getPublicTicket(token).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.selectedTicket.set(res.data);
        } else {
          this.errorMessage.set(res.message || "Bono no encontrado con ese token.");
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || "Error al obtener el bono por token.");
      }
    });
  }
  loadAllTickets() {
    this.apiService.listTickets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allTickets.set(res.data);
          this.onSearchFilterChange();
        }
      }
    });
  }
  onSearchFilterChange() {
    this.isSearching.set(true);
    const seller = this.sellerNameSearch.trim().toLowerCase();
    const buyer = this.buyerNameSearch.trim().toLowerCase();
    if (!seller && !buyer) {
      this.filteredTickets.set([]);
      this.isSearching.set(false);
      return;
    }
    const filtered = this.allTickets().filter((t) => {
      const matchSeller = !seller || t.sellerName?.toLowerCase().includes(seller);
      const matchBuyer = !buyer || t.buyerName?.toLowerCase().includes(buyer);
      return matchSeller && matchBuyer;
    });
    this.filteredTickets.set(filtered);
  }
  selectTicket(t) {
    this.selectedTicket.set(t);
    this.clearMessages();
  }
  validateFood() {
    const ticket = this.selectedTicket();
    if (!ticket)
      return;
    if (ticket.ticketType !== "CON_COMIDA") {
      this.errorMessage.set("No se puede entregar comida. El bono no es de tipo CON_COMIDA.");
      return;
    }
    if (ticket.status !== "USADO_ENTRADA") {
      this.errorMessage.set(`No se puede entregar comida. El bono debe haber sido validado previamente en entrada (estado actual: ${ticket.status}).`);
      return;
    }
    this.clearMessages();
    this.validating.set(true);
    this.apiService.validateTicket({
      four_digit_code: ticket.fourDigitCode,
      public_token: ticket.publicToken,
      validation_type: "COMIDA"
    }).subscribe({
      next: (res) => {
        this.validating.set(false);
        if (res.success && res.data) {
          const updatedTicket = res.data;
          this.selectedTicket.set(updatedTicket);
          this.successMessage.set("\xA1Comida entregada correctamente! El estado ha cambiado a USADO_COMIDA.");
          this.allTickets.update((list) => list.map((t) => t.id === updatedTicket.id ? updatedTicket : t));
        } else {
          this.errorMessage.set(res.message || "Error al validar la entrega de comida.");
        }
      },
      error: (err) => {
        this.validating.set(false);
        this.errorMessage.set(err.error?.message || "Error al procesar la validaci\xF3n de comida.");
      }
    });
  }
  startCamera() {
    this.cameraError.set(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      this.cameraError.set("Tu navegador no soporta el acceso a la c\xE1mara.");
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } }).then((stream) => {
      this.mediaStream = stream;
      this.cameraActive.set(true);
      if (this.videoElement) {
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.play().then(() => {
          this.startQrScanningLoop();
        }).catch((e) => console.warn("Video play error:", e));
      }
    }).catch((err) => {
      this.cameraActive.set(false);
      this.cameraError.set("No se pudo acceder a la c\xE1mara. Revisa los permisos de tu dispositivo.");
      console.error("Camera access error:", err);
    });
  }
  startQrScanningLoop() {
    const scanTick = () => {
      if (!this.cameraActive() || !this.videoElement?.nativeElement) {
        return;
      }
      const video = this.videoElement.nativeElement;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        this.scanCanvas.width = video.videoWidth;
        this.scanCanvas.height = video.videoHeight;
        if (this.scanContext) {
          this.scanContext.drawImage(video, 0, 0, this.scanCanvas.width, this.scanCanvas.height);
          const imageData = this.scanContext.getImageData(0, 0, this.scanCanvas.width, this.scanCanvas.height);
          const code = (0, import_jsqr.default)(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert"
          });
          if (code?.data) {
            const rawText = code.data.trim();
            this.handleScannedCode(rawText);
            return;
          }
        }
      }
      this.scanAnimFrameId = requestAnimationFrame(scanTick);
    };
    this.scanAnimFrameId = requestAnimationFrame(scanTick);
  }
  handleScannedCode(rawText) {
    this.stopCamera();
    let fourDigitCode = rawText;
    if (rawText.includes("/")) {
      const parts = rawText.split("/");
      fourDigitCode = parts.at(-1) || rawText;
    }
    if (fourDigitCode.length === 4 && /^\d{4}$/.test(fourDigitCode)) {
      this.fourDigitInput = fourDigitCode;
      this.searchByCode();
    } else {
      this.qrTokenInput = rawText;
      this.searchByToken();
    }
  }
  stopCamera() {
    if (this.scanAnimFrameId !== null) {
      cancelAnimationFrame(this.scanAnimFrameId);
      this.scanAnimFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }
  getStatusBadgeClass(status) {
    switch (status) {
      case "VENDIDO":
        return "badge-vendido";
      case "USADO_ENTRADA":
      case "USADO_COMIDA":
        return "badge-usado";
      case "ANULADO":
        return "badge-anulado";
      default:
        return "";
    }
  }
  ngOnDestroy() {
    this.stopCamera();
  }
  static \u0275fac = function ValidateFoodComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ValidateFoodComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ValidateFoodComponent, selectors: [["app-validate-food"]], viewQuery: function ValidateFoodComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.videoElement = _t.first);
    }
  }, decls: 36, vars: 12, consts: [["videoElement", ""], [1, "validate-container"], [1, "page-header"], ["viewBox", "0 0 24 24", 1, "icon"], ["d", "M3 11h18"], ["d", "M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"], ["d", "M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"], ["d", "M6 11v4"], ["d", "M18 11v4"], [1, "subtitle"], [1, "mode-tabs", "neu-card"], [3, "click"], ["x", "3", "y", "3", "width", "18", "height", "18", "rx", "2"], ["d", "M8 12h8"], ["d", "M12 8v8"], ["d", "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"], ["cx", "12", "cy", "13", "r", "4"], ["cx", "11", "cy", "11", "r", "8"], ["d", "m21 21-4.35-4.35"], [1, "neu-card", "content-card"], ["class", "mode-section", 4, "ngIf"], ["class", "alert alert-error", 4, "ngIf"], ["class", "alert alert-success", 4, "ngIf"], ["class", "ticket-detail-card neu-card", 4, "ngIf"], [1, "mode-section"], [1, "search-form", 3, "ngSubmit"], [1, "input-group"], ["for", "four-digit-input-food", 1, "sr-only"], ["id", "four-digit-input-food", "type", "text", "maxlength", "4", "pattern", "[0-9]{4}", "placeholder", "Ej: 4821", "name", "fourDigitInput", "required", "", 1, "neu-input", "code-input", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "neu-btn", "neu-btn-bordo", 3, "disabled"], ["class", "neu-spinner", 4, "ngIf"], [1, "neu-spinner"], [1, "section-desc"], [1, "camera-wrapper", "neu-card"], ["autoplay", "", "playsinline", "", "muted", "", 1, "video-preview"], ["class", "camera-placeholder", 4, "ngIf"], ["class", "camera-actions", 4, "ngIf"], [1, "manual-qr-fallback"], ["for", "qr-token-input-food"], ["id", "qr-token-input-food", "type", "text", "placeholder", "Token p\xFAblico...", "name", "qrTokenInput", 1, "neu-input", 3, "ngModelChange", "ngModel"], [1, "neu-btn", "neu-btn-bordo", 3, "click", "disabled"], [1, "camera-placeholder"], [1, "camera-icon"], ["class", "error-text", 4, "ngIf"], [1, "neu-btn", "neu-btn-bordo", 3, "click"], [1, "error-text"], [1, "camera-actions"], [1, "neu-btn", "btn-danger-sm", 3, "click"], [1, "search-form-grid"], [1, "field"], ["for", "seller-name-search-food"], ["id", "seller-name-search-food", "type", "text", "placeholder", "Ej: Juan P\xE9rez", "name", "sellerNameSearch", 1, "neu-input", 3, "ngModelChange", "input", "ngModel"], ["for", "buyer-name-search-food"], ["id", "buyer-name-search-food", "type", "text", "placeholder", "Ej: Mar\xEDa G\xF3mez", "name", "buyerNameSearch", 1, "neu-input", 3, "ngModelChange", "input", "ngModel"], ["class", "tickets-found-list", 4, "ngIf"], ["class", "no-results", 4, "ngIf"], [1, "tickets-found-list"], ["type", "button", "class", "ticket-mini-card neu-card", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "ticket-mini-card", "neu-card", 3, "click"], [1, "mini-info"], [1, "neu-badge", 3, "ngClass"], [1, "no-results"], [1, "alert", "alert-error"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], [1, "alert", "alert-success"], ["points", "20 6 9 17 4 12"], [1, "ticket-detail-card", "neu-card"], [1, "card-header"], [1, "badge-group"], [1, "neu-badge", "badge-type"], [1, "details-grid"], [1, "detail-item"], [1, "label"], [1, "value", "code-val"], [1, "value"], [1, "validation-rules-notice"], ["class", "rule-banner alert-error", 4, "ngIf"], ["class", "rule-banner alert-warning", 4, "ngIf"], ["class", "rule-banner alert-info", 4, "ngIf"], [1, "card-actions"], [1, "neu-btn", "neu-btn-bordo", "btn-validate", 3, "click", "disabled"], [1, "neu-btn", 3, "click"], [1, "rule-banner", "alert-error"], ["cx", "12", "cy", "12", "r", "10"], ["x1", "4.93", "y1", "4.93", "x2", "19.07", "y2", "19.07"], [1, "rule-banner", "alert-warning"], [1, "rule-banner", "alert-info"], ["points", "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"]], template: function ValidateFoodComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "header", 2)(2, "h1");
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 3);
      \u0275\u0275element(4, "path", 4)(5, "path", 5)(6, "path", 6)(7, "path", 7)(8, "path", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275text(9, " Validar Entrega de Comida");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(10, "p", 9);
      \u0275\u0275text(11, "Verifica y entrega la raci\xF3n de comida a bonos 'CON_COMIDA' previamente ingresados");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 10)(13, "button", 11);
      \u0275\u0275listener("click", function ValidateFoodComponent_Template_button_click_13_listener() {
        return ctx.switchMode("code");
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 3);
      \u0275\u0275element(15, "rect", 12)(16, "path", 13)(17, "path", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275text(18, " C\xF3digo de 4 D\xEDgitos ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(19, "button", 11);
      \u0275\u0275listener("click", function ValidateFoodComponent_Template_button_click_19_listener() {
        return ctx.switchMode("qr");
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(20, "svg", 3);
      \u0275\u0275element(21, "path", 15)(22, "circle", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275text(23, " Escanear QR (C\xE1mara) ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(24, "button", 11);
      \u0275\u0275listener("click", function ValidateFoodComponent_Template_button_click_24_listener() {
        return ctx.switchMode("search");
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(25, "svg", 3);
      \u0275\u0275element(26, "circle", 17)(27, "path", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275text(28, " Buscar por Vendedor y Comprador ");
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(29, "div", 19);
      \u0275\u0275template(30, ValidateFoodComponent_div_30_Template, 12, 3, "div", 20)(31, ValidateFoodComponent_div_31_Template, 19, 7, "div", 20)(32, ValidateFoodComponent_div_32_Template, 14, 4, "div", 20)(33, ValidateFoodComponent_div_33_Template, 6, 1, "div", 21)(34, ValidateFoodComponent_div_34_Template, 4, 1, "div", 22)(35, ValidateFoodComponent_div_35_Template, 53, 18, "div", 23);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(13);
      \u0275\u0275classProp("active", ctx.activeMode() === "code");
      \u0275\u0275advance(6);
      \u0275\u0275classProp("active", ctx.activeMode() === "qr");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("active", ctx.activeMode() === "search");
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.activeMode() === "code");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeMode() === "qr");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.activeMode() === "search");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.successMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedTicket());
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, PatternValidator, NgModel, NgForm], styles: ["\n\n.validate-container[_ngcontent-%COMP%] {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.page-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  margin-bottom: 0.5rem;\n}\n.subtitle[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n}\n.mode-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 1.5rem;\n  padding: 0.5rem;\n}\n.mode-tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 0.8rem 1rem;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n  border-radius: var(--radius-sm, 8px);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.mode-tabs[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  background: var(--color-gold, #D4AF37);\n  color: #FFFFFF;\n  box-shadow: var(--neu-shadow-bordo);\n}\n.mode-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  margin-bottom: 1rem;\n  color: var(--color-bordo, #7A001E);\n}\n.search-form[_ngcontent-%COMP%] {\n  max-width: 450px;\n}\n.input-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.75rem;\n}\n.code-input[_ngcontent-%COMP%] {\n  font-size: 1.5rem !important;\n  letter-spacing: 0.3em;\n  text-align: center;\n}\n.camera-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  max-width: 400px;\n  height: 250px;\n  margin: 1rem 0;\n  background: #000;\n  border-radius: var(--radius-md, 14px);\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.video-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.video-preview.hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n.camera-placeholder[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.camera-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  display: block;\n  margin-bottom: 0.5rem;\n}\n.camera-actions[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 10px;\n}\n.btn-danger-sm[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.8);\n  color: white;\n  padding: 0.4rem 0.8rem;\n  font-size: 0.85rem;\n}\n.search-form-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.field[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n  margin-bottom: 0.4rem;\n}\n.tickets-found-list[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.ticket-mini-card[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.ticket-mini-card[_ngcontent-%COMP%]:hover {\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n}\n.mini-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  font-size: 0.9rem;\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 1rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-top: 1rem;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.alert-warning[_ngcontent-%COMP%] {\n  background: rgba(217, 119, 6, 0.12);\n  color: #92400e;\n  border: 1px solid rgba(217, 119, 6, 0.3);\n}\n.alert-info[_ngcontent-%COMP%] {\n  background: rgba(37, 99, 235, 0.12);\n  color: #1d4ed8;\n  border: 1px solid rgba(37, 99, 235, 0.3);\n}\n.ticket-detail-card[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n.card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.badge-group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n}\n.badge-type[_ngcontent-%COMP%] {\n  background: rgba(212, 175, 55, 0.2);\n  color: #856404;\n  border: 1px solid rgba(212, 175, 55, 0.4);\n}\n.details-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 1rem;\n  border-radius: var(--radius-sm, 8px);\n  box-shadow: var(--neu-shadow-inset);\n}\n.detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.detail-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.detail-item[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.code-val[_ngcontent-%COMP%] {\n  color: var(--color-bordo) !important;\n  font-family: monospace;\n  font-size: 1.2rem !important;\n}\n.validation-rules-notice[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.rule-banner[_ngcontent-%COMP%] {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  font-size: 0.95rem;\n}\n.card-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.btn-validate[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 1rem;\n  font-size: 1.1rem;\n}\n@media (max-width: 768px) {\n  .mode-tabs[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n  .search-form-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .card-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=validate-food.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ValidateFoodComponent, [{
    type: Component,
    args: [{ selector: "app-validate-food", standalone: true, imports: [CommonModule, FormsModule], template: `<div class="validate-container">
  <header class="page-header">
    <h1><svg class="icon" viewBox="0 0 24 24"><path d="M3 11h18"/><path d="M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"/><path d="M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"/><path d="M6 11v4"/><path d="M18 11v4"/></svg> Validar Entrega de Comida</h1>
    <p class="subtitle">Verifica y entrega la raci\xF3n de comida a bonos 'CON_COMIDA' previamente ingresados</p>
  </header>

  <!-- Selection Modes Tabs -->
  <div class="mode-tabs neu-card">
    <button
      [class.active]="activeMode() === 'code'"
      (click)="switchMode('code')">
      <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg> C\xF3digo de 4 D\xEDgitos
    </button>
    <button
      [class.active]="activeMode() === 'qr'"
      (click)="switchMode('qr')">
      <svg class="icon" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Escanear QR (C\xE1mara)
    </button>
    <button
      [class.active]="activeMode() === 'search'"
      (click)="switchMode('search')">
      <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> Buscar por Vendedor y Comprador
    </button>
  </div>

  <div class="neu-card content-card">
    <!-- MODE 1: 4-Digit Code -->
    <div *ngIf="activeMode() === 'code'" class="mode-section">
      <h3>Ingrese C\xF3digo de 4 D\xEDgitos</h3>
      <form (ngSubmit)="searchByCode()" class="search-form">
        <div class="input-group">
          <label for="four-digit-input-food" class="sr-only">C\xF3digo de 4 D\xEDgitos</label>
          <input
            id="four-digit-input-food"
            type="text"
            maxlength="4"
            pattern="[0-9]{4}"
            placeholder="Ej: 4821"
            [(ngModel)]="fourDigitInput"
            name="fourDigitInput"
            class="neu-input code-input"
            required
          />
          <button type="submit" [disabled]="loading()" class="neu-btn neu-btn-bordo">
            <span *ngIf="loading()" class="neu-spinner"></span>
            <span>Buscar Bono</span>
          </button>
        </div>
      </form>
    </div>

    <!-- MODE 2: Camera Stream / QR -->
    <div *ngIf="activeMode() === 'qr'" class="mode-section">
      <h3>Escanear C\xF3digo QR con C\xE1mara</h3>
      <p class="section-desc">Permite el acceso a la c\xE1mara para escanear el QR del bono o ingresa el token p\xFAblico manualmente.</p>
      
      <div class="camera-wrapper neu-card">
        <video #videoElement class="video-preview" [class.hidden]="!cameraActive()" autoplay playsinline muted></video>
        
        <div *ngIf="!cameraActive()" class="camera-placeholder">
          <span class="camera-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span>
          <p *ngIf="cameraError()" class="error-text">{{ cameraError() }}</p>
          <button (click)="startCamera()" class="neu-btn neu-btn-bordo">
            Activar C\xE1mara
          </button>
        </div>
        
        <div *ngIf="cameraActive()" class="camera-actions">
          <button (click)="stopCamera()" class="neu-btn btn-danger-sm">
            Detener C\xE1mara
          </button>
        </div>
      </div>

      <div class="manual-qr-fallback">
        <label for="qr-token-input-food">O ingresar Token P\xFAblico de QR:</label>
        <div class="input-group">
          <input
            id="qr-token-input-food"
            type="text"
            placeholder="Token p\xFAblico..."
            [(ngModel)]="qrTokenInput"
            name="qrTokenInput"
            class="neu-input"
          />
          <button (click)="searchByToken()" [disabled]="loading()" class="neu-btn neu-btn-bordo">
            <span *ngIf="loading()" class="neu-spinner"></span>
            <span>Buscar por Token</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODE 3: Search by Seller & Buyer -->
    <div *ngIf="activeMode() === 'search'" class="mode-section">
      <h3>Buscar por Vendedor y Comprador</h3>
      <div class="search-form-grid">
        <div class="field">
          <label for="seller-name-search-food">Nombre del Vendedor:</label>
          <input
            id="seller-name-search-food"
            type="text"
            placeholder="Ej: Juan P\xE9rez"
            [(ngModel)]="sellerNameSearch"
            name="sellerNameSearch"
            (input)="onSearchFilterChange()"
            class="neu-input"
          />
        </div>
        <div class="field">
          <label for="buyer-name-search-food">Nombre del Comprador:</label>
          <input
            id="buyer-name-search-food"
            type="text"
            placeholder="Ej: Mar\xEDa G\xF3mez"
            [(ngModel)]="buyerNameSearch"
            name="buyerNameSearch"
            (input)="onSearchFilterChange()"
            class="neu-input"
          />
        </div>
      </div>

      <div class="tickets-found-list" *ngIf="filteredTickets().length > 0">
        <h4>Bonos Encontrados ({{ filteredTickets().length }})</h4>
        <button type="button" class="ticket-mini-card neu-card" *ngFor="let t of filteredTickets()" (click)="selectTicket(t)">
          <div class="mini-info">
            <strong>Bono #{{ t.ticketNumber }} (C\xF3d: {{ t.fourDigitCode }}) - {{ t.ticketType }}</strong>
            <span>Comprador: {{ t.buyerName || 'N/A' }}</span>
            <span>Vendedor: {{ t.sellerName || 'N/A' }}</span>
          </div>
          <span class="neu-badge" [ngClass]="getStatusBadgeClass(t.status)">{{ t.status }}</span>
        </button>
      </div>
      <div *ngIf="isSearching() && filteredTickets().length === 0" class="no-results">
        No se encontraron bonos que coincidan con la b\xFAsqueda.
      </div>
    </div>

    <!-- Feedback Alert Messages -->
    <div *ngIf="errorMessage()" class="alert alert-error">
      <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {{ errorMessage() }}
    </div>
    <div *ngIf="successMessage()" class="alert alert-success">
      <svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> {{ successMessage() }}
    </div>

    <!-- TICKET DETAIL CARD FOR FOOD VALIDATION -->
    <div *ngIf="selectedTicket() as ticket" class="ticket-detail-card neu-card">
      <div class="card-header">
        <h2>Bono #{{ ticket.ticketNumber }}</h2>
        <div class="badge-group">
          <span class="neu-badge badge-type">{{ ticket.ticketType }}</span>
          <span class="neu-badge" [ngClass]="getStatusBadgeClass(ticket.status)">
            {{ ticket.status }}
          </span>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-item">
          <span class="label">C\xF3digo 4 D\xEDgitos:</span>
          <span class="value code-val">{{ ticket.fourDigitCode }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Comprador:</span>
          <span class="value">{{ ticket.buyerName || 'No especificado' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Vendedor:</span>
          <span class="value">{{ ticket.sellerName || 'No especificado' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Tipo de Bono:</span>
          <span class="value">{{ ticket.ticketType }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Estado Actual:</span>
          <span class="value">{{ ticket.status }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Monto Pagado:</span>
          <span class="value">\${{ ticket.pricePaid }}</span>
        </div>
      </div>

      <!-- VALIDATION RULES FOR FOOD: CON_COMIDA AND PREVIOUSLY USADO_ENTRADA ONLY -->
      <div class="validation-rules-notice">
        <div *ngIf="ticket.ticketType !== 'CON_COMIDA'" class="rule-banner alert-error">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> <strong>TIPO DE BONO INV\xC1LIDO:</strong> Este bono es de tipo <code>{{ ticket.ticketType }}</code> y NO incluye beneficio de comida.
        </div>

        <div *ngIf="ticket.ticketType === 'CON_COMIDA' && ticket.status === 'VENDIDO'" class="rule-banner alert-warning">
          <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <strong>ENTRADA NO VALIDADA:</strong> El bono incluye comida, pero primero se debe validar la entrada en puerta (estado actual: <code>VENDIDO</code>).
        </div>

        <div *ngIf="ticket.status === 'USADO_COMIDA'" class="rule-banner alert-warning">
          <svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> <strong>COMIDA YA ENTREGADA:</strong> La raci\xF3n de comida de este bono ya fue retirada previamente.
        </div>

        <div *ngIf="ticket.status === 'ANULADO'" class="rule-banner alert-error">
          <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> <strong>BONO ANULADO:</strong> Este bono est\xE1 anulado.
        </div>

        <div *ngIf="ticket.ticketType === 'CON_COMIDA' && ticket.status === 'USADO_ENTRADA'" class="rule-banner alert-info">
          <svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> <strong>ELEGIBLE PARA COMIDA:</strong> El asistente ingres\xF3 previamente y su bono es de tipo <code>CON_COMIDA</code>. Listo para validar entrega.
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="card-actions">
        <button
          (click)="validateFood()"
          [disabled]="ticket.ticketType !== 'CON_COMIDA' || ticket.status !== 'USADO_ENTRADA' || validating()"
          class="neu-btn neu-btn-bordo btn-validate">
          <span *ngIf="validating()" class="neu-spinner"></span>
          <span>{{ validating() ? 'Procesando...' : 'Confirmar y Entregar Comida (USADO_COMIDA)' }}</span>
        </button>
        
        <button (click)="clearSelection()" class="neu-btn">
          Limpiar
        </button>
      </div>
    </div>

  </div>
</div>
`, styles: ["/* src/app/features/tickets/validate-food/validate-food.component.css */\n.validate-container {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 2rem 1.5rem;\n}\n.page-header {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.page-header h1 {\n  font-size: 2rem;\n  margin-bottom: 0.5rem;\n}\n.subtitle {\n  color: var(--text-secondary, #665A5D);\n}\n.mode-tabs {\n  display: flex;\n  gap: 0.5rem;\n  margin-bottom: 1.5rem;\n  padding: 0.5rem;\n}\n.mode-tabs button {\n  flex: 1;\n  padding: 0.8rem 1rem;\n  border: none;\n  background: transparent;\n  color: var(--text-secondary, #665A5D);\n  font-weight: 600;\n  border-radius: var(--radius-sm, 8px);\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.mode-tabs button.active {\n  background: var(--color-gold, #D4AF37);\n  color: #FFFFFF;\n  box-shadow: var(--neu-shadow-bordo);\n}\n.mode-section h3 {\n  font-size: 1.25rem;\n  margin-bottom: 1rem;\n  color: var(--color-bordo, #7A001E);\n}\n.search-form {\n  max-width: 450px;\n}\n.input-group {\n  display: flex;\n  gap: 0.75rem;\n}\n.code-input {\n  font-size: 1.5rem !important;\n  letter-spacing: 0.3em;\n  text-align: center;\n}\n.camera-wrapper {\n  position: relative;\n  width: 100%;\n  max-width: 400px;\n  height: 250px;\n  margin: 1rem 0;\n  background: #000;\n  border-radius: var(--radius-md, 14px);\n  overflow: hidden;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.video-preview {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.video-preview.hidden {\n  display: none;\n}\n.camera-placeholder {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.camera-icon {\n  font-size: 3rem;\n  display: block;\n  margin-bottom: 0.5rem;\n}\n.camera-actions {\n  position: absolute;\n  bottom: 10px;\n}\n.btn-danger-sm {\n  background: rgba(239, 68, 68, 0.8);\n  color: white;\n  padding: 0.4rem 0.8rem;\n  font-size: 0.85rem;\n}\n.search-form-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n}\n.field label {\n  display: block;\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n  margin-bottom: 0.4rem;\n}\n.tickets-found-list {\n  margin-top: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n.ticket-mini-card {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0.75rem 1rem;\n  cursor: pointer;\n  transition: all 0.2s;\n}\n.ticket-mini-card:hover {\n  background: var(--bg-cream-base, #F7F3EB);\n  box-shadow: var(--neu-shadow-inset);\n}\n.mini-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n  font-size: 0.9rem;\n}\n.alert {\n  padding: 1rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-top: 1rem;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.alert-error {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.alert-success {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.alert-warning {\n  background: rgba(217, 119, 6, 0.12);\n  color: #92400e;\n  border: 1px solid rgba(217, 119, 6, 0.3);\n}\n.alert-info {\n  background: rgba(37, 99, 235, 0.12);\n  color: #1d4ed8;\n  border: 1px solid rgba(37, 99, 235, 0.3);\n}\n.ticket-detail-card {\n  margin-top: 2rem;\n}\n.card-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.badge-group {\n  display: flex;\n  gap: 0.5rem;\n}\n.badge-type {\n  background: rgba(212, 175, 55, 0.2);\n  color: #856404;\n  border: 1px solid rgba(212, 175, 55, 0.4);\n}\n.details-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n  margin-bottom: 1.5rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  padding: 1rem;\n  border-radius: var(--radius-sm, 8px);\n  box-shadow: var(--neu-shadow-inset);\n}\n.detail-item {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.detail-item .label {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.detail-item .value {\n  font-size: 1rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n.code-val {\n  color: var(--color-bordo) !important;\n  font-family: monospace;\n  font-size: 1.2rem !important;\n}\n.validation-rules-notice {\n  margin-bottom: 1.5rem;\n}\n.rule-banner {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  font-size: 0.95rem;\n}\n.card-actions {\n  display: flex;\n  gap: 1rem;\n}\n.btn-validate {\n  flex: 1;\n  padding: 1rem;\n  font-size: 1.1rem;\n}\n@media (max-width: 768px) {\n  .mode-tabs {\n    flex-direction: column;\n  }\n  .search-form-grid {\n    grid-template-columns: 1fr;\n  }\n  .card-actions {\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=validate-food.component.css.map */\n"] }]
  }], null, { videoElement: [{
    type: ViewChild,
    args: ["videoElement"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ValidateFoodComponent, { className: "ValidateFoodComponent", filePath: "src/app/features/tickets/validate-food/validate-food.component.ts", lineNumber: 16 });
})();
export {
  ValidateFoodComponent
};
//# sourceMappingURL=chunk-VMMTAHNE.js.map
