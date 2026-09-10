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
  NgClass,
  NgForOf,
  NgIf,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-SFLJKOAY.js";

// src/app/features/admin/user-management/user-management.component.ts
var _c0 = (a0, a1, a2) => ({ "neu-badge-vendido": a0, "neu-badge-anulado": a1, "neu-badge-usado": a2 });
var _c1 = (a0, a1) => ({ "neu-badge-anulado": a0, "neu-badge-vendido": a1 });
function UserManagementComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap("alert alert-" + ctx_r1.messageType);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.message, " ");
  }
}
function UserManagementComponent_span_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_table_16_tr_14_span_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "(Tu cuenta)");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_table_16_tr_14_ng_container_19_button_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_table_16_tr_14_ng_container_19_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function UserManagementComponent_table_16_tr_14_ng_container_19_button_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const u_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateStatus(u_r4.id, "ACTIVE"));
    });
    \u0275\u0275template(1, UserManagementComponent_table_16_tr_14_ng_container_19_button_1_span_1_Template, 1, 0, "span", 9);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Activar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.loading || ctx_r1.updatingUserId() === u_r4.id);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.updatingUserId() === u_r4.id);
  }
}
function UserManagementComponent_table_16_tr_14_ng_container_19_button_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_table_16_tr_14_ng_container_19_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 31);
    \u0275\u0275listener("click", function UserManagementComponent_table_16_tr_14_ng_container_19_button_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const u_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateStatus(u_r4.id, "DISABLED"));
    });
    \u0275\u0275template(1, UserManagementComponent_table_16_tr_14_ng_container_19_button_2_span_1_Template, 1, 0, "span", 9);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Desactivar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.loading || ctx_r1.updatingUserId() === u_r4.id);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.updatingUserId() === u_r4.id);
  }
}
function UserManagementComponent_table_16_tr_14_ng_container_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, UserManagementComponent_table_16_tr_14_ng_container_19_button_1_Template, 4, 2, "button", 28)(2, UserManagementComponent_table_16_tr_14_ng_container_19_button_2_Template, 4, 2, "button", 29);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const u_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", u_r4.status !== "ACTIVE");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", u_r4.status !== "DISABLED");
  }
}
function UserManagementComponent_table_16_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "label", 19);
    \u0275\u0275text(8, "Rol del usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "select", 20);
    \u0275\u0275listener("change", function UserManagementComponent_table_16_tr_14_Template_select_change_9_listener($event) {
      const u_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.updateRole(u_r4.id, $event.target.value));
    });
    \u0275\u0275elementStart(10, "option", 21);
    \u0275\u0275text(11, "SELLER (Vendedor)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 22);
    \u0275\u0275text(13, "ADMIN (Administrador)");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "td")(15, "span", 23);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 24);
    \u0275\u0275template(18, UserManagementComponent_table_16_tr_14_span_18_Template, 2, 0, "span", 25)(19, UserManagementComponent_table_16_tr_14_ng_container_19_Template, 3, 2, "ng-container", 26);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_12_0;
    let tmp_13_0;
    const u_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(u_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r4.email);
    \u0275\u0275advance(2);
    \u0275\u0275property("for", "user-role-" + u_r4.id);
    \u0275\u0275advance(2);
    \u0275\u0275property("id", "user-role-" + u_r4.id)("value", u_r4.role)("disabled", ctx_r1.loading || ctx_r1.updatingUserId() === u_r4.id || u_r4.id === ((tmp_9_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_9_0.id));
    \u0275\u0275advance(6);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(10, _c0, u_r4.status === "ACTIVE", u_r4.status === "DISABLED", u_r4.status === "PENDING"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", u_r4.status, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", u_r4.id === ((tmp_12_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_12_0.id));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", u_r4.id !== ((tmp_13_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_13_0.id));
  }
}
function UserManagementComponent_table_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 17)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Rol");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Estado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Acciones");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "tbody");
    \u0275\u0275template(14, UserManagementComponent_table_16_tr_14_Template, 20, 14, "tr", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275property("ngForOf", ctx_r1.users);
  }
}
function UserManagementComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 32);
    \u0275\u0275text(1, "No se encontraron usuarios o a\xFAn no se han cargado.");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_div_27_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_div_27_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "h4");
    \u0275\u0275text(3, "Cuota Inicial por Defecto (Nuevos Vendedores)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 35);
    \u0275\u0275text(5, "Asigna autom\xE1ticamente esta cantidad de entradas a cada nuevo vendedor registrado.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 36)(7, "label", 37);
    \u0275\u0275text(8, "Cuota inicial por defecto");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_div_27_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.defaultQuotaInput, $event) || (ctx_r1.defaultQuotaInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 8);
    \u0275\u0275listener("click", function UserManagementComponent_div_27_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveDefaultQuota());
    });
    \u0275\u0275template(11, UserManagementComponent_div_27_span_11_Template, 1, 0, "span", 9);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Guardar Defecto");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(14, "div", 34)(15, "h4");
    \u0275\u0275text(16, "Bols\xF3n de Cuota Libre Global");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 35);
    \u0275\u0275text(18, "Total de entradas libres compartidas cuando a un vendedor se le agota su cuota personal.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 36)(20, "label", 39);
    \u0275\u0275text(21, "Cuota libre global");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_div_27_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.freeQuotaInput, $event) || (ctx_r1.freeQuotaInput = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 8);
    \u0275\u0275listener("click", function UserManagementComponent_div_27_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveFreeQuota());
    });
    \u0275\u0275template(24, UserManagementComponent_div_27_span_24_Template, 1, 0, "span", 9);
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "Actualizar Bols\xF3n");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 41)(28, "span");
    \u0275\u0275text(29, "Totales: ");
    \u0275\u0275elementStart(30, "strong");
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "span");
    \u0275\u0275text(33, "Usadas: ");
    \u0275\u0275elementStart(34, "strong");
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "span");
    \u0275\u0275text(37, "Restantes: ");
    \u0275\u0275elementStart(38, "strong", 42);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const overview_r8 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.defaultQuotaInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.savingDefaultQuota);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.savingDefaultQuota);
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.freeQuotaInput);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.savingFreeQuota);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.savingFreeQuota);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(overview_r8.global_free_quota.total_free_quota);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(overview_r8.global_free_quota.used_free_quota);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(overview_r8.global_free_quota.available_quota);
  }
}
function UserManagementComponent_div_28_tr_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "span", 49);
    \u0275\u0275text(12, "0 (Agotada)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r9 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r9.seller_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r9.seller_email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r9.assigned_quota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r9.used_quota);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(s_r9.used_free_quota);
  }
}
function UserManagementComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "div", 7)(2, "h3", 44);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 45);
    \u0275\u0275element(4, "path", 46)(5, "line", 47)(6, "line", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(8, "div", 10)(9, "table", 17)(10, "thead")(11, "tr")(12, "th");
    \u0275\u0275text(13, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Cuota Asignada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Usada Personal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Restante Personal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Usada Libre");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "tbody");
    \u0275\u0275template(25, UserManagementComponent_div_28_tr_25_Template, 15, 5, "tr", 18);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" Usuarios Sin Cuota Personal (", (tmp_2_0 = ctx_r1.quotaOverview()) == null ? null : tmp_2_0.exhausted_sellers == null ? null : tmp_2_0.exhausted_sellers.length, ")");
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", (tmp_3_0 = ctx_r1.quotaOverview()) == null ? null : tmp_3_0.exhausted_sellers);
  }
}
function UserManagementComponent_div_29_tr_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td")(7, "span", 50);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r10 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(u_r10.seller_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r10.seller_email);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", u_r10.used_free_quota, " entradas");
  }
}
function UserManagementComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 7)(2, "h3");
    \u0275\u0275text(3, "Uso de Cuota Libre por Usuario");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 10)(5, "table", 17)(6, "thead")(7, "tr")(8, "th");
    \u0275\u0275text(9, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Entradas de Cuota Libre Usadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275template(15, UserManagementComponent_div_29_tr_15_Template, 9, 3, "tr", 18);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(15);
    \u0275\u0275property("ngForOf", (tmp_2_0 = ctx_r1.quotaOverview()) == null ? null : tmp_2_0.free_quota_usage_by_seller);
  }
}
function UserManagementComponent_div_30_table_5_tr_20_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 16);
  }
}
function UserManagementComponent_div_30_table_5_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td")(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "span", 23);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td", 24)(19, "div", 51)(20, "label", 52);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 53);
    \u0275\u0275twoWayListener("ngModelChange", function UserManagementComponent_div_30_table_5_tr_20_Template_input_ngModelChange_22_listener($event) {
      const s_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r1.sellerQuotaInputs[s_r12.seller_id], $event) || (ctx_r1.sellerQuotaInputs[s_r12.seller_id] = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "button", 54);
    \u0275\u0275listener("click", function UserManagementComponent_div_30_table_5_tr_20_Template_button_click_23_listener() {
      const s_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.saveSellerQuota(s_r12.seller_id));
    });
    \u0275\u0275template(24, UserManagementComponent_div_30_table_5_tr_20_span_24_Template, 1, 0, "span", 9);
    \u0275\u0275elementStart(25, "span");
    \u0275\u0275text(26, "Guardar");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const s_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(s_r12.seller_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r12.seller_email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r12.assigned_quota);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r12.used_quota);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-danger", s_r12.remaining_personal === 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r12.remaining_personal, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r12.used_free_quota);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(17, _c1, s_r12.is_personal_exhausted, !s_r12.is_personal_exhausted));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", s_r12.is_personal_exhausted ? "Agotada" : "Disponible", " ");
    \u0275\u0275advance(3);
    \u0275\u0275attribute("for", "seller-quota-" + s_r12.seller_id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Cuota de usuario ", s_r12.seller_name, "");
    \u0275\u0275advance();
    \u0275\u0275property("id", "seller-quota-" + s_r12.seller_id);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.sellerQuotaInputs[s_r12.seller_id]);
    \u0275\u0275attribute("aria-label", "Cuota asignada para " + s_r12.seller_name);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.savingSellerQuotaId() === s_r12.seller_id);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.savingSellerQuotaId() === s_r12.seller_id);
  }
}
function UserManagementComponent_div_30_table_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 17)(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Usuario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "th");
    \u0275\u0275text(6, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Cuota Asignada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Usada Personal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Restante Personal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Usada Libre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Estado Cuota");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Modificar Cuota");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "tbody");
    \u0275\u0275template(20, UserManagementComponent_div_30_table_5_tr_20_Template, 27, 20, "tr", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const overview_r13 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance(20);
    \u0275\u0275property("ngForOf", overview_r13.sellers_quotas);
  }
}
function UserManagementComponent_div_30_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 32);
    \u0275\u0275text(1, "No hay vendedores registrados en el sistema.");
    \u0275\u0275elementEnd();
  }
}
function UserManagementComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 7)(2, "h3");
    \u0275\u0275text(3, "Cuotas Restantes y Gesti\xF3n por Usuario (Vendedores y Administradores)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 10);
    \u0275\u0275template(5, UserManagementComponent_div_30_table_5_Template, 21, 1, "table", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, UserManagementComponent_div_30_ng_template_6_Template, 2, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const overview_r13 = ctx.ngIf;
    const noSellers_r14 = \u0275\u0275reference(7);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", overview_r13.sellers_quotas.length > 0)("ngIfElse", noSellers_r14);
  }
}
var UserManagementComponent = class _UserManagementComponent {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  users = [];
  loading = false;
  updatingUserId = signal(null);
  quotaOverview = signal(null);
  loadingQuota = signal(false);
  defaultQuotaInput = 0;
  freeQuotaInput = 0;
  savingDefaultQuota = false;
  savingFreeQuota = false;
  sellerQuotaInputs = {};
  savingSellerQuotaId = signal(null);
  message = "";
  messageType = "success";
  ngOnInit() {
    this.loadUsers();
    this.loadQuotaOverview();
  }
  loadUsers() {
    this.loading = true;
    this.message = "";
    this.apiService.listUsers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.error?.error || "Error al obtener lista de usuarios", "danger");
      }
    });
  }
  loadQuotaOverview() {
    this.loadingQuota.set(true);
    this.apiService.getAdminQuotaOverview().subscribe({
      next: (res) => {
        this.loadingQuota.set(false);
        if (res.success && res.data) {
          this.quotaOverview.set(res.data);
          this.defaultQuotaInput = res.data.default_personal_quota;
          this.freeQuotaInput = res.data.global_free_quota.total_free_quota;
          res.data.sellers_quotas.forEach((s) => {
            this.sellerQuotaInputs[s.seller_id] = s.assigned_quota;
          });
        }
      },
      error: (err) => {
        this.loadingQuota.set(false);
        this.showMessage(err.error?.error || "Error al cargar resumen de cuotas", "danger");
      }
    });
  }
  saveDefaultQuota() {
    if (this.defaultQuotaInput < 0)
      return;
    this.savingDefaultQuota = true;
    this.apiService.updateDefaultQuotaConfig(this.defaultQuotaInput).subscribe({
      next: (res) => {
        this.savingDefaultQuota = false;
        if (res.success) {
          this.showMessage("Cuota inicial por defecto actualizada para todos los usuarios", "success");
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingDefaultQuota = false;
        this.showMessage(err.error?.error || "Error al actualizar cuota por defecto", "danger");
      }
    });
  }
  saveFreeQuota() {
    if (this.freeQuotaInput < 0)
      return;
    this.savingFreeQuota = true;
    this.apiService.updateQuota({ quota_type: "FREE", assigned_quota: this.freeQuotaInput }).subscribe({
      next: (res) => {
        this.savingFreeQuota = false;
        if (res.success) {
          this.showMessage("Bols\xF3n de cuota libre global actualizado", "success");
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingFreeQuota = false;
        this.showMessage(err.error?.error || "Error al actualizar cuota libre global", "danger");
      }
    });
  }
  saveSellerQuota(sellerId) {
    const val = this.sellerQuotaInputs[sellerId];
    if (val === void 0 || val < 0)
      return;
    this.savingSellerQuotaId.set(sellerId);
    this.apiService.updateQuota({ quota_type: "PERSONAL", seller_id: sellerId, assigned_quota: val }).subscribe({
      next: (res) => {
        this.savingSellerQuotaId.set(null);
        if (res.success) {
          this.showMessage("Cuota personal del vendedor actualizada correctamente", "success");
          this.loadQuotaOverview();
        }
      },
      error: (err) => {
        this.savingSellerQuotaId.set(null);
        this.showMessage(err.error?.error || "Error al actualizar cuota del vendedor", "danger");
      }
    });
  }
  updateStatus(userId, newStatus) {
    this.updatingUserId.set(userId);
    this.message = "";
    this.apiService.updateUserStatus(userId, { status: newStatus }).subscribe({
      next: (res) => {
        this.updatingUserId.set(null);
        if (res.success) {
          this.showMessage(`Estado de usuario actualizado a ${newStatus}`, "success");
          this.loadUsers();
        }
      },
      error: (err) => {
        this.updatingUserId.set(null);
        this.showMessage(err.error?.error || "Error al actualizar estado del usuario", "danger");
      }
    });
  }
  updateRole(userId, newRole) {
    this.updatingUserId.set(userId);
    this.message = "";
    this.apiService.updateUserRole(userId, { role: newRole }).subscribe({
      next: (res) => {
        this.updatingUserId.set(null);
        if (res.success) {
          this.showMessage(`Rol de usuario actualizado a ${newRole}`, "success");
          this.loadUsers();
        }
      },
      error: (err) => {
        this.updatingUserId.set(null);
        this.showMessage(err.error?.error || "Error al actualizar rol del usuario", "danger");
      }
    });
  }
  showMessage(msg, type) {
    this.message = msg;
    this.messageType = type;
  }
  static \u0275fac = function UserManagementComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserManagementComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserManagementComponent, selectors: [["app-user-management"]], decls: 31, vars: 11, consts: [["emptyState", ""], ["noSellers", ""], [1, "admin-container"], [1, "page-header"], [1, "subtitle"], [3, "class", 4, "ngIf"], [1, "neu-card", "section-card"], [1, "header-action"], [1, "neu-btn", "neu-btn-bordo", 3, "click", "disabled"], ["class", "neu-spinner", 4, "ngIf"], [1, "table-responsive"], ["class", "user-table", 4, "ngIf", "ngIfElse"], [1, "neu-card", "section-card", "margin-top"], ["class", "quota-config-grid", 4, "ngIf"], ["class", "neu-card section-card margin-top warning-card", 4, "ngIf"], ["class", "neu-card section-card margin-top", 4, "ngIf"], [1, "neu-spinner"], [1, "user-table"], [4, "ngFor", "ngForOf"], [1, "sr-only", 3, "for"], ["aria-label", "Rol del usuario", 1, "role-select", 3, "change", "id", "value", "disabled"], ["value", "SELLER"], ["value", "ADMIN"], [1, "neu-badge", 3, "ngClass"], [1, "actions-cell"], ["class", "self-tag", 4, "ngIf"], [4, "ngIf"], [1, "self-tag"], ["class", "neu-btn btn-sm btn-activate", 3, "disabled", "click", 4, "ngIf"], ["class", "neu-btn btn-sm btn-deactivate", 3, "disabled", "click", 4, "ngIf"], [1, "neu-btn", "btn-sm", "btn-activate", 3, "click", "disabled"], [1, "neu-btn", "btn-sm", "btn-deactivate", 3, "click", "disabled"], [1, "empty-msg"], [1, "quota-config-grid"], [1, "quota-box"], [1, "desc"], [1, "form-row"], ["for", "default-quota-input", 1, "sr-only"], ["id", "default-quota-input", "type", "number", "min", "0", "placeholder", "Cuota inicial", "aria-label", "Cuota inicial por defecto", 1, "neu-input", 3, "ngModelChange", "ngModel"], ["for", "free-quota-input", 1, "sr-only"], ["id", "free-quota-input", "type", "number", "min", "0", "placeholder", "Cuota libre global", "aria-label", "Cuota libre global", 1, "neu-input", 3, "ngModelChange", "ngModel"], [1, "quota-stats-mini"], [1, "text-success"], [1, "neu-card", "section-card", "margin-top", "warning-card"], [1, "text-warning"], ["viewBox", "0 0 24 24", 1, "icon"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], [1, "neu-badge", "neu-badge-anulado"], [1, "neu-badge", "neu-badge-usado"], [1, "inline-edit"], [1, "sr-only"], ["type", "number", "min", "0", 1, "neu-input", "input-sm", 3, "ngModelChange", "id", "ngModel"], [1, "neu-btn", "btn-sm", "neu-btn-bordo", 3, "click", "disabled"]], template: function UserManagementComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "section", 2)(1, "div", 3)(2, "h1");
      \u0275\u0275text(3, "Administraci\xF3n de Usuarios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 4);
      \u0275\u0275text(5, "Lista de usuarios registrados y control de estados de cuenta.");
      \u0275\u0275elementEnd()();
      \u0275\u0275template(6, UserManagementComponent_div_6_Template, 2, 3, "div", 5);
      \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "h3");
      \u0275\u0275text(10, "Usuarios Registrados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275listener("click", function UserManagementComponent_Template_button_click_11_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.loadUsers());
      });
      \u0275\u0275template(12, UserManagementComponent_span_12_Template, 1, 0, "span", 9);
      \u0275\u0275elementStart(13, "span");
      \u0275\u0275text(14, "Recargar Lista");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 10);
      \u0275\u0275template(16, UserManagementComponent_table_16_Template, 15, 1, "table", 11)(17, UserManagementComponent_ng_template_17_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "div", 12)(20, "div", 7)(21, "h3");
      \u0275\u0275text(22, "Configuraci\xF3n Global de Cuotas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "button", 8);
      \u0275\u0275listener("click", function UserManagementComponent_Template_button_click_23_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.loadQuotaOverview());
      });
      \u0275\u0275template(24, UserManagementComponent_span_24_Template, 1, 0, "span", 9);
      \u0275\u0275elementStart(25, "span");
      \u0275\u0275text(26, "Recargar Cuotas");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(27, UserManagementComponent_div_27_Template, 40, 9, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(28, UserManagementComponent_div_28_Template, 26, 2, "div", 14)(29, UserManagementComponent_div_29_Template, 16, 1, "div", 15)(30, UserManagementComponent_div_30_Template, 8, 2, "div", 15);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_9_0;
      let tmp_10_0;
      const emptyState_r15 = \u0275\u0275reference(18);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.message);
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngIf", ctx.users.length > 0)("ngIfElse", emptyState_r15);
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", ctx.loadingQuota());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingQuota());
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.quotaOverview());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (tmp_9_0 = ctx.quotaOverview()) == null ? null : tmp_9_0.exhausted_sellers == null ? null : tmp_9_0.exhausted_sellers.length);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", (tmp_10_0 = ctx.quotaOverview()) == null ? null : tmp_10_0.free_quota_usage_by_seller == null ? null : tmp_10_0.free_quota_usage_by_seller.length);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.quotaOverview());
    }
  }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, NgModel], styles: ['\n\n.admin-container[_ngcontent-%COMP%] {\n  max-width: 1000px;\n  margin: 2rem auto;\n  padding: 0 1.5rem;\n}\n.page-header[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #665A5D);\n}\n.header-action[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.table-responsive[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.user-table[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.user-table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {\n  padding: 0.9rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.user-table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 0.85rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.badge-role[_ngcontent-%COMP%] {\n  background: rgba(122, 0, 30, 0.1);\n  color: var(--color-bordo);\n}\n.btn-sm[_ngcontent-%COMP%] {\n  padding: 0.3rem 0.7rem;\n  font-size: 0.8rem;\n}\n.btn-activate[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border-color: rgba(34, 197, 94, 0.3);\n}\n.btn-deactivate[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.alert[_ngcontent-%COMP%] {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\n.alert-success[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.role-select[_ngcontent-%COMP%] {\n  padding: 0.35rem 0.6rem;\n  border-radius: var(--radius-sm, 8px);\n  border: 1px solid var(--color-gold, #D4AF37);\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-weight: 600;\n  font-size: 0.85rem;\n  box-shadow: var(--neu-shadow-inset);\n  outline: none;\n}\n.role-select[_ngcontent-%COMP%]:focus {\n  border-color: var(--color-bordo, #7A001E);\n}\n.self-tag[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: var(--text-secondary, #665A5D);\n  font-style: italic;\n}\n.margin-top[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n.warning-card[_ngcontent-%COMP%] {\n  border: 2px solid rgba(234, 179, 8, 0.4);\n  background: rgba(254, 252, 232, 0.5);\n}\n.text-warning[_ngcontent-%COMP%] {\n  color: #a16207;\n}\n.text-danger[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n.text-success[_ngcontent-%COMP%] {\n  color: #15803d;\n}\n.quota-config-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}\n.quota-box[_ngcontent-%COMP%] {\n  background: var(--bg-cream-base, #F7F3EB);\n  border: 1px solid var(--color-gold, #D4AF37);\n  border-radius: var(--radius-sm, 8px);\n  padding: 1.2rem;\n}\n.quota-box[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: var(--color-bordo, #7A001E);\n  margin-bottom: 0.4rem;\n}\n.quota-box[_ngcontent-%COMP%]   .desc[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  color: var(--text-secondary, #665A5D);\n  margin-bottom: 1rem;\n  line-height: 1.3;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n}\n.neu-input[_ngcontent-%COMP%] {\n  padding: 0.4rem 0.8rem;\n  border-radius: var(--radius-sm, 8px);\n  border: 1px solid var(--color-gold, #D4AF37);\n  background: #fff;\n  font-size: 0.9rem;\n  width: 100%;\n}\n.input-sm[_ngcontent-%COMP%] {\n  width: 70px;\n  padding: 0.25rem 0.5rem;\n}\n.quota-stats-mini[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 0.8rem;\n  font-size: 0.82rem;\n  padding-top: 0.6rem;\n  border-top: 1px dashed rgba(0, 0, 0, 0.1);\n}\n.inline-edit[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.4rem;\n  align-items: center;\n}\n/*# sourceMappingURL=user-management.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserManagementComponent, [{
    type: Component,
    args: [{ selector: "app-user-management", standalone: true, imports: [CommonModule, FormsModule], template: `<section class="admin-container">
  <div class="page-header">
    <h1>Administraci\xF3n de Usuarios</h1>
    <p class="subtitle">Lista de usuarios registrados y control de estados de cuenta.</p>
  </div>

  <div *ngIf="message" [class]="'alert alert-' + messageType">
    {{ message }}
  </div>

  <div class="neu-card section-card">
    <div class="header-action">
      <h3>Usuarios Registrados</h3>
      <button (click)="loadUsers()" [disabled]="loading" class="neu-btn neu-btn-bordo">
        <span *ngIf="loading" class="neu-spinner"></span>
        <span>Recargar Lista</span>
      </button>
    </div>

    <div class="table-responsive">
      <table class="user-table" *ngIf="users.length > 0; else emptyState">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td><strong>{{ u.name }}</strong></td>
            <td>{{ u.email }}</td>
            <td>
              <label [for]="'user-role-' + u.id" class="sr-only">Rol del usuario</label>
              <select
                [id]="'user-role-' + u.id"
                [value]="u.role"
                (change)="updateRole(u.id, $any($event.target).value)"
                [disabled]="loading || updatingUserId() === u.id || u.id === authService.currentUser()?.id"
                class="role-select"
                aria-label="Rol del usuario"
              >
                <option value="SELLER">SELLER (Vendedor)</option>
                <option value="ADMIN">ADMIN (Administrador)</option>
              </select>
            </td>
            <td>
              <span class="neu-badge" [ngClass]="{
                'neu-badge-vendido': u.status === 'ACTIVE',
                'neu-badge-anulado': u.status === 'DISABLED',
                'neu-badge-usado': u.status === 'PENDING'
              }">
                {{ u.status }}
              </span>
            </td>
            <td class="actions-cell">
              <span *ngIf="u.id === authService.currentUser()?.id" class="self-tag">(Tu cuenta)</span>
              <ng-container *ngIf="u.id !== authService.currentUser()?.id">
                <button
                  *ngIf="u.status !== 'ACTIVE'"
                  (click)="updateStatus(u.id, 'ACTIVE')"
                  [disabled]="loading || updatingUserId() === u.id"
                  class="neu-btn btn-sm btn-activate"
                >
                  <span *ngIf="updatingUserId() === u.id" class="neu-spinner"></span>
                  <span>Activar</span>
                </button>
                <button
                  *ngIf="u.status !== 'DISABLED'"
                  (click)="updateStatus(u.id, 'DISABLED')"
                  [disabled]="loading || updatingUserId() === u.id"
                  class="neu-btn btn-sm btn-deactivate"
                >
                  <span *ngIf="updatingUserId() === u.id" class="neu-spinner"></span>
                  <span>Desactivar</span>
                </button>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>
    <ng-template #emptyState>
      <p class="empty-msg">No se encontraron usuarios o a\xFAn no se han cargado.</p>
    </ng-template>
  </div>
</div>

  <div class="neu-card section-card margin-top">
    <div class="header-action">
      <h3>Configuraci\xF3n Global de Cuotas</h3>
      <button (click)="loadQuotaOverview()" [disabled]="loadingQuota()" class="neu-btn neu-btn-bordo">
        <span *ngIf="loadingQuota()" class="neu-spinner"></span>
        <span>Recargar Cuotas</span>
      </button>
    </div>

    <div class="quota-config-grid" *ngIf="quotaOverview() as overview">
      <!-- Default Initial Quota Card -->
      <div class="quota-box">
        <h4>Cuota Inicial por Defecto (Nuevos Vendedores)</h4>
        <p class="desc">Asigna autom\xE1ticamente esta cantidad de entradas a cada nuevo vendedor registrado.</p>
        <div class="form-row">
          <label for="default-quota-input" class="sr-only">Cuota inicial por defecto</label>
          <input
            id="default-quota-input"
            type="number"
            min="0"
            [(ngModel)]="defaultQuotaInput"
            class="neu-input"
            placeholder="Cuota inicial"
            aria-label="Cuota inicial por defecto"
          />
          <button (click)="saveDefaultQuota()" [disabled]="savingDefaultQuota" class="neu-btn neu-btn-bordo">
            <span *ngIf="savingDefaultQuota" class="neu-spinner"></span>
            <span>Guardar Defecto</span>
          </button>
        </div>
      </div>

      <!-- Global Free Quota Pool Card -->
      <div class="quota-box">
        <h4>Bols\xF3n de Cuota Libre Global</h4>
        <p class="desc">Total de entradas libres compartidas cuando a un vendedor se le agota su cuota personal.</p>
        <div class="form-row">
          <label for="free-quota-input" class="sr-only">Cuota libre global</label>
          <input
            id="free-quota-input"
            type="number"
            min="0"
            [(ngModel)]="freeQuotaInput"
            class="neu-input"
            placeholder="Cuota libre global"
            aria-label="Cuota libre global"
          />
          <button (click)="saveFreeQuota()" [disabled]="savingFreeQuota" class="neu-btn neu-btn-bordo">
            <span *ngIf="savingFreeQuota" class="neu-spinner"></span>
            <span>Actualizar Bols\xF3n</span>
          </button>
        </div>
        <div class="quota-stats-mini">
          <span>Totales: <strong>{{ overview.global_free_quota.total_free_quota }}</strong></span>
          <span>Usadas: <strong>{{ overview.global_free_quota.used_free_quota }}</strong></span>
          <span>Restantes: <strong class="text-success">{{ overview.global_free_quota.available_quota }}</strong></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Alert: Exhausted Sellers -->
  <div class="neu-card section-card margin-top warning-card" *ngIf="quotaOverview()?.exhausted_sellers?.length">
    <div class="header-action">
      <h3 class="text-warning"><svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Usuarios Sin Cuota Personal ({{ quotaOverview()?.exhausted_sellers?.length }})</h3>
    </div>
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Cuota Asignada</th>
            <th>Usada Personal</th>
            <th>Restante Personal</th>
            <th>Usada Libre</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of quotaOverview()?.exhausted_sellers">
            <td><strong>{{ s.seller_name }}</strong></td>
            <td>{{ s.seller_email }}</td>
            <td>{{ s.assigned_quota }}</td>
            <td>{{ s.used_quota }}</td>
            <td><span class="neu-badge neu-badge-anulado">0 (Agotada)</span></td>
            <td>{{ s.used_free_quota }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Free Quota Usage Breakdown -->
  <div class="neu-card section-card margin-top" *ngIf="quotaOverview()?.free_quota_usage_by_seller?.length">
    <div class="header-action">
      <h3>Uso de Cuota Libre por Usuario</h3>
    </div>
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Entradas de Cuota Libre Usadas</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of quotaOverview()?.free_quota_usage_by_seller">
            <td><strong>{{ u.seller_name }}</strong></td>
            <td>{{ u.seller_email }}</td>
            <td><span class="neu-badge neu-badge-usado">{{ u.used_free_quota }} entradas</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Sellers Quota Detail & Management Table -->
  <div class="neu-card section-card margin-top" *ngIf="quotaOverview() as overview">
    <div class="header-action">
      <h3>Cuotas Restantes y Gesti\xF3n por Usuario (Vendedores y Administradores)</h3>
    </div>
    <div class="table-responsive">
      <table class="user-table" *ngIf="overview.sellers_quotas.length > 0; else noSellers">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Cuota Asignada</th>
            <th>Usada Personal</th>
            <th>Restante Personal</th>
            <th>Usada Libre</th>
            <th>Estado Cuota</th>
            <th>Modificar Cuota</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of overview.sellers_quotas">
            <td><strong>{{ s.seller_name }}</strong></td>
            <td>{{ s.seller_email }}</td>
            <td>{{ s.assigned_quota }}</td>
            <td>{{ s.used_quota }}</td>
            <td>
              <strong [class.text-danger]="s.remaining_personal === 0">
                {{ s.remaining_personal }}
              </strong>
            </td>
            <td>{{ s.used_free_quota }}</td>
            <td>
              <span class="neu-badge" [ngClass]="{
                'neu-badge-anulado': s.is_personal_exhausted,
                'neu-badge-vendido': !s.is_personal_exhausted
              }">
                {{ s.is_personal_exhausted ? 'Agotada' : 'Disponible' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="inline-edit">
                <label [attr.for]="'seller-quota-' + s.seller_id" class="sr-only">Cuota de usuario {{ s.seller_name }}</label>
                <input
                  [id]="'seller-quota-' + s.seller_id"
                  type="number"
                  min="0"
                  [(ngModel)]="sellerQuotaInputs[s.seller_id]"
                  class="neu-input input-sm"
                  [attr.aria-label]="'Cuota asignada para ' + s.seller_name"
                />
                <button
                  (click)="saveSellerQuota(s.seller_id)"
                  [disabled]="savingSellerQuotaId() === s.seller_id"
                  class="neu-btn btn-sm neu-btn-bordo"
                >
                  <span *ngIf="savingSellerQuotaId() === s.seller_id" class="neu-spinner"></span>
                  <span>Guardar</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ng-template #noSellers>
      <p class="empty-msg">No hay vendedores registrados en el sistema.</p>
    </ng-template>
  </div>
</section>
`, styles: ['/* src/app/features/admin/user-management/user-management.component.css */\n.admin-container {\n  max-width: 1000px;\n  margin: 2rem auto;\n  padding: 0 1.5rem;\n}\n.page-header {\n  margin-bottom: 2rem;\n}\n.page-header h1 {\n  font-size: 2rem;\n  margin-bottom: 0.25rem;\n}\n.subtitle {\n  color: var(--text-secondary, #665A5D);\n}\n.header-action {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n}\n.table-responsive {\n  overflow-x: auto;\n}\n.user-table {\n  width: 100%;\n  border-collapse: collapse;\n  text-align: left;\n  font-size: 0.9rem;\n}\n.user-table th {\n  padding: 0.9rem 1rem;\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-family: var(--font-heading, "Cinzel", serif);\n  font-weight: 700;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.user-table td {\n  padding: 0.85rem 1rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.badge-role {\n  background: rgba(122, 0, 30, 0.1);\n  color: var(--color-bordo);\n}\n.btn-sm {\n  padding: 0.3rem 0.7rem;\n  font-size: 0.8rem;\n}\n.btn-activate {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border-color: rgba(34, 197, 94, 0.3);\n}\n.btn-deactivate {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border-color: rgba(239, 68, 68, 0.3);\n}\n.alert {\n  padding: 0.9rem 1.2rem;\n  border-radius: var(--radius-sm, 8px);\n  margin-bottom: 1rem;\n  font-size: 0.9rem;\n  font-weight: 600;\n}\n.alert-success {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.role-select {\n  padding: 0.35rem 0.6rem;\n  border-radius: var(--radius-sm, 8px);\n  border: 1px solid var(--color-gold, #D4AF37);\n  background: var(--bg-cream-base, #F7F3EB);\n  color: var(--color-bordo, #7A001E);\n  font-weight: 600;\n  font-size: 0.85rem;\n  box-shadow: var(--neu-shadow-inset);\n  outline: none;\n}\n.role-select:focus {\n  border-color: var(--color-bordo, #7A001E);\n}\n.self-tag {\n  font-size: 0.8rem;\n  font-weight: 600;\n  color: var(--text-secondary, #665A5D);\n  font-style: italic;\n}\n.margin-top {\n  margin-top: 2rem;\n}\n.warning-card {\n  border: 2px solid rgba(234, 179, 8, 0.4);\n  background: rgba(254, 252, 232, 0.5);\n}\n.text-warning {\n  color: #a16207;\n}\n.text-danger {\n  color: #b91c1c;\n}\n.text-success {\n  color: #15803d;\n}\n.quota-config-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}\n.quota-box {\n  background: var(--bg-cream-base, #F7F3EB);\n  border: 1px solid var(--color-gold, #D4AF37);\n  border-radius: var(--radius-sm, 8px);\n  padding: 1.2rem;\n}\n.quota-box h4 {\n  font-size: 1rem;\n  color: var(--color-bordo, #7A001E);\n  margin-bottom: 0.4rem;\n}\n.quota-box .desc {\n  font-size: 0.82rem;\n  color: var(--text-secondary, #665A5D);\n  margin-bottom: 1rem;\n  line-height: 1.3;\n}\n.form-row {\n  display: flex;\n  gap: 0.5rem;\n  align-items: center;\n}\n.neu-input {\n  padding: 0.4rem 0.8rem;\n  border-radius: var(--radius-sm, 8px);\n  border: 1px solid var(--color-gold, #D4AF37);\n  background: #fff;\n  font-size: 0.9rem;\n  width: 100%;\n}\n.input-sm {\n  width: 70px;\n  padding: 0.25rem 0.5rem;\n}\n.quota-stats-mini {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 0.8rem;\n  font-size: 0.82rem;\n  padding-top: 0.6rem;\n  border-top: 1px dashed rgba(0, 0, 0, 0.1);\n}\n.inline-edit {\n  display: flex;\n  gap: 0.4rem;\n  align-items: center;\n}\n/*# sourceMappingURL=user-management.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserManagementComponent, { className: "UserManagementComponent", filePath: "src/app/features/admin/user-management/user-management.component.ts", lineNumber: 15 });
})();
export {
  UserManagementComponent
};
//# sourceMappingURL=chunk-MXF6HWR3.js.map
