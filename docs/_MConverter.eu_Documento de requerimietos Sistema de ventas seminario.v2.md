**Sistema de Ventas para Seminario Mayor Nuestra Señora de Loreto**

**Documento de Requerimientos**

**Versión2**

**Autor: Leonardo Morabito\**

# **Requerimientos funcionales**

## **RF-01 --- Autenticación** {#rf-01-autenticación}

- **RF-01.01:** El sistema debe permitir el registro de usuarios mediante una cuenta de Google. El registro se produce automáticamente en el primer inicio de sesión.

- **RF-01.02:** El sistema debe permitir iniciar sesión mediante una cuenta de Google (Firebase). El usuario se identifica primero por su identificador de Google y, si no existe, por su email; en este último caso se asocia el identificador de Google a la cuenta existente.

- **RF-01.03:** Tras iniciar sesión, el sistema debe emitir un token de acceso (JWT, enviado como `Authorization: Bearer`) y un token de renovación almacenado en una cookie HttpOnly con vigencia de 7 días. El token de renovación se rota en cada uso y, si se reutiliza uno ya revocado, se revocan todos los tokens del usuario.

- **RF-01.04:** El sistema debe permitir cerrar sesión, revocando el token de renovación y eliminando la cookie.

- **RF-01.05:** El sistema debe restringir las funcionalidades disponibles según el rol del usuario, tanto en frontend (guards de ruta) como en backend (middleware de autenticación y de rol).

- **RF-01.06:** Un usuario deshabilitado (DISABLED) no debe poder iniciar sesión ni utilizar un token vigente.

- **RF-01.07:** Los nuevos usuarios deben crearse con rol VENDEDOR y permanecer en estado PENDIENTE (PENDING) hasta que un administrador habilite su acceso. Mientras estén pendientes, el sistema debe mostrarles una pantalla de espera de aprobación y rechazar el acceso a los recursos protegidos.

# **RF-02 --- Roles** {#rf-02-roles}

El sistema contempla dos roles (ADMIN y SELLER) y un actor externo sin cuenta (comprador).

### **Administrador / Developer** {#administrador-developer}

Puede, además de todo lo que puede hacer un vendedor:

- listar usuarios, activarlos, deshabilitarlos y cambiar su rol (no puede modificar su propio estado ni su propio rol);

- configurar los precios de los bonos;

- consultar todos los bonos y filtrarlos por vendedor;

- consultar el dashboard con estadísticas globales o por vendedor;

- configurar los cupos personales y los cupos de bonos libres, por vendedor o para todos los vendedores;

- configurar los cupos por defecto aplicables a nuevos vendedores;

- consultar el consumo de cupos y los vendedores con cupo personal agotado.

### **Vendedor**

Puede:

- emitir bonos (venta anticipada y venta en puerta);

- registrar compradores durante la venta;

- consultar sus propios bonos (el backend filtra siempre por el vendedor autenticado);

- validar entradas;

- validar entregas de comida;

- anular bonos en estado VENDIDO;

- consultar su cupo personal y su cupo de bonos libres (asignado, utilizado y disponible);

- emitir bonos libres cuando así lo seleccione.

> Los administradores también poseen cupos personales y de bonos libres, dado que los cupos se gestionan para todos los usuarios con rol ADMIN o SELLER.

### **Comprador**

- No posee cuenta en el sistema.

- No necesita autenticarse.

- Solamente accede al enlace público correspondiente a su bono.

# **RF-03 --- Gestión de vendedores** {#rf-03-gestión-de-vendedores}

Los vendedores no son creados manualmente por el administrador: se registran con su cuenta de Google (RF-01) y el administrador los gestiona desde la pantalla de **Gestión de usuarios**.

- **RF-03.01:** El administrador debe poder consultar el listado de usuarios (nombre, email, rol y estado).

- **RF-03.02:** El administrador debe poder activar (ACTIVE) y deshabilitar (DISABLED) usuarios.

- **RF-03.03:** El administrador debe poder cambiar el rol de un usuario entre ADMIN y SELLER.

- **RF-03.04:** El administrador no debe poder modificar su propio estado ni su propio rol.

- **RF-03.05:** El administrador debe poder consultar los bonos emitidos por cada vendedor (listado de bonos filtrado por vendedor y dashboard por vendedor).

- **RF-03.06:** El administrador debe poder asignar el cupo personal y el cupo de bonos libres de cada vendedor (ver RF-33 y RF-34).

- **RF-03.07:** El sistema debe mostrar para cada vendedor:

  - cupo personal asignado, utilizado y restante;

  - bonos libres asignados, utilizados y restantes.

# **RF-04 --- Tipos de bono** {#rf-04-tipos-de-bono}

El sistema admite dos tipos:

- SIMPLE

- CON_COMIDA

- **RF-04.01:** El vendedor debe seleccionar el tipo de bono durante la creación.

- **RF-04.02:** Un bono simple representa únicamente el ingreso al evento.

- **RF-04.03:** Un bono con comida representa el ingreso al evento y el derecho a retirar una única vez la comida incluida.

# **RF-05 --- Precio del bono simple** {#rf-05-precio-del-bono-simple}

- **RF-05.01:** El sistema debe mantener un único precio vigente para el bono simple (valor por defecto: 3000 si no se configuró).

- **RF-05.02:** El administrador debe poder modificar dicho precio desde el dashboard. El valor no puede ser negativo.

- **RF-05.03:** Al emitir un bono simple se guarda en el bono el precio vigente en ese momento.

- **RF-05.04:** Las modificaciones posteriores del precio no modifican bonos emitidos anteriormente. El sistema no conserva un historial de precios propio: al actualizar un precio se reemplaza el registro vigente y el histórico queda reflejado únicamente en el precio guardado en cada bono.

# **RF-06 --- Bono con comida** {#rf-06-bono-con-comida}

- **RF-06.01:** El sistema debe mantener un único precio vigente para el bono con comida (valor por defecto: 5000 si no se configuró).

- **RF-06.02:** El administrador debe poder modificar dicho precio desde el dashboard. El valor no puede ser negativo.

- **RF-06.03:** Al emitir un bono con comida se guarda el precio vigente en ese momento.

- **RF-06.04:** Las modificaciones posteriores del precio no modifican bonos emitidos anteriormente.

# **RF-07 --- Registro del comprador** {#rf-07-registro-del-comprador}

- **RF-07.01:** El vendedor debe registrar manualmente los datos del comprador durante la venta.

- **RF-07.02:** Son obligatorios:

  - nombre;

  - apellido;

  - teléfono (formato válido de 6 a 20 caracteres numéricos, `+`, `-`, espacios o paréntesis; el frontend permite elegir código de país, con 54 por defecto).

- **RF-07.03:** El email es opcional; se normaliza a minúsculas.

- **RF-07.04:** Registrar un comprador no crea una cuenta de usuario.

- **RF-07.05:** Los datos del comprador quedan asociados al bono emitido.

# **RF-08 --- Creación de bono simple** {#rf-08-creación-de-bono-simple}

El sistema permite el siguiente flujo (en escritorio mediante un asistente por pasos en el dashboard; en celulares mediante un panel lateral de venta rápida):

1.  Seleccionar Bono simple.

2.  Seleccionar el origen: venta anticipada con cupo personal, venta anticipada con bono libre o venta en puerta.

3.  Ingresar los datos del comprador.

4.  Mostrar el precio vigente.

5.  Confirmar la venta.

6.  Generar el bono.

- **RF-08.01:** El bono generado queda automáticamente en estado VENDIDO.

- **RF-08.02:** Si la venta es anticipada, el backend comprueba y descuenta el cupo dentro de la misma transacción que crea el bono.

- **RF-08.03:** Una venta anticipada consume exactamente una unidad del cupo correspondiente (personal o de bonos libres).

- **RF-08.04:** Una venta en puerta no consume cupo personal ni de bonos libres.

- **RF-08.05:** Un bono emitido con cupo de bonos libres se registra con precio 0.

# **RF-09 --- Creación de bono con comida** {#rf-09-creación-de-bono-con-comida}

El flujo es idéntico al de RF-08, seleccionando el tipo Bono con comida.

- **RF-09.01:** El bono generado queda automáticamente en estado VENDIDO.

- **RF-09.02:** Si la venta es anticipada, el backend comprueba y descuenta el cupo en la misma transacción.

- **RF-09.03:** Una venta anticipada consume exactamente una unidad del cupo correspondiente.

- **RF-09.04:** Una venta en puerta no consume cupo.

- **RF-09.05:** Un bono con comida emitido con cupo de bonos libres se registra con precio 0.

# **RF-10 --- Venta de entradas en puerta** {#rf-10-venta-de-entradas-en-puerta}

La venta en puerta no dispone de una pantalla separada: es una de las opciones de origen del flujo de emisión de bonos (RF-08 / RF-09).

- **RF-10.01:** El vendedor debe poder iniciar una venta en puerta desde el mismo flujo de emisión (asistente del dashboard o panel de venta rápida).

- **RF-10.02:** El vendedor debe poder seleccionar bono simple o bono con comida.

- **RF-10.03:** El vendedor debe poder ingresar los datos del cliente.

- **RF-10.04:** El sistema debe mostrar el precio antes de confirmar.

- **RF-10.05:** El vendedor debe confirmar la operación antes de generar el bono.

- **RF-10.06:** Una vez confirmada la venta, el sistema genera inmediatamente el bono.

- **RF-10.07:** El bono generado en puerta queda en estado VENDIDO.

- **RF-10.08:** El bono generado registra su origen de venta como PUERTA.

- **RF-10.09:** Las ventas en puerta no consumen el cupo personal del vendedor.

- **RF-10.10:** Las ventas en puerta no consumen el cupo de bonos libres.

- **RF-10.11:** La falta de cupo de venta anticipada no impide realizar ventas en puerta.

# **RF-11 --- Entrega digital del bono** {#rf-11-entrega-digital-del-bono}

Tras emitir cualquier bono (anticipado o en puerta), el sistema muestra una pantalla de resultado.

- **RF-11.01:** Después de la venta, el sistema muestra al vendedor un QR que contiene la URL pública del bono.

- **RF-11.02:** El comprador puede escanear ese QR desde su teléfono.

- **RF-11.03:** El QR dirige directamente al enlace público del bono (`/tickets/public/{token}`).

- **RF-11.04:** El comprador no necesita iniciar sesión para acceder al bono.

- **RF-11.05:** El vendedor puede copiar el enlace público al portapapeles como alternativa al QR.

- **RF-11.06:** El vendedor puede enviar el bono por WhatsApp mediante un enlace precargado con el mensaje, el código de cuatro cifras y el enlace público.

- **RF-11.07:** La pantalla posterior a la venta muestra el código de cuatro cifras para que el comprador pueda anotarlo.

- **RF-11.08:** Desde esa pantalla, el vendedor puede autorizar el ingreso inmediatamente (ver RF-23).

# **RF-12 --- Identificación del bono** {#rf-12-identificación-del-bono}

Cada bono dispone de:

- identificador interno (UUID);

- número de bono (secuencial autoincremental);

- token público (32 bytes aleatorios en hexadecimal);

- código numérico de cuatro cifras;

- código QR (generado en el cliente);

- tipo de bono;

- origen de venta;

- origen del cupo utilizado.

- **RF-12.01:** El número de bono es único.

- **RF-12.02:** El código de cuatro cifras se genera aleatoriamente verificando que no exista otro igual; además existe un índice único parcial en base de datos para bonos en estado VENDIDO o USADO_ENTRADA.

- **RF-12.03:** El QR y el código identifican el mismo bono: tanto el token público como el código de cuatro cifras son aceptados para validar.

- **RF-12.04:** El token y el código permanecen iguales durante todo el ciclo de vida del bono.

> **Nota:** el QR mostrado al vendedor tras la venta codifica la URL pública, mientras que el QR dibujado en la página pública del ticket codifica el código de cuatro cifras. Los lectores de validación aceptan ambos formatos (URL completa, token o código de cuatro cifras).

# **RF-13 --- Enlace público** {#rf-13-enlace-público}

- **RF-13.01:** Cada bono tiene un enlace público único.

- **RF-13.02:** El enlace utiliza un token aleatorio de 256 bits no predecible.

- **RF-13.03:** El enlace no requiere autenticación; está protegido por un limitador de tasa (10 solicitudes por minuto por cliente) y la interfaz muestra una cuenta regresiva cuando se supera.

- **RF-13.04:** El enlace sigue funcionando después de registrar la entrada.

- **RF-13.05:** El enlace sigue funcionando después de registrar la entrega de comida.

- **RF-13.06:** Un bono anulado continúa siendo consultable, indicando su estado ANULADO.

- **RF-13.07:** La respuesta pública se mantiene en caché durante 15 segundos y se invalida al validar o anular el bono.

# **RF-14 --- Ticket virtual** {#rf-14-ticket-virtual}

El enlace público funciona como ticket virtual del comprador. Muestra:

- número de bono;

- nombre y apellido del comprador;

- nombre del vendedor;

- tipo de bono;

- origen de venta;

- precio;

- estado;

- código de cuatro cifras;

- QR;

- fecha de emisión;

- indicación de si incluye comida;

- fecha y hora de ingreso y de entrega de comida, cuando existen.

La página pública no expone el teléfono ni el email del comprador, ni el nombre de quien validó.

Incluye una opción de impresión y de copia del enlace.

# **RF-15 --- Visualización del bono simple** {#rf-15-visualización-del-bono-simple}

El ticket virtual de un bono simple muestra información del comprador, información del bono, número, QR, código y estado. Cuando la entrada fue utilizada, el estado pasa a USADO_ENTRADA y se muestra la fecha de ingreso.

# **RF-16 --- Visualización del bono con comida** {#rf-16-visualización-del-bono-con-comida}

El ticket virtual de un bono con comida muestra, además, la indicación de que incluye comida y la fecha de entrega cuando corresponde.

# **RF-17 --- Funcionamiento sin conexión del comprador** {#rf-17-funcionamiento-sin-conexión-del-comprador}

- **RF-17.01:** El comprador puede utilizar una captura de pantalla del bono.

- **RF-17.02:** El comprador puede utilizar una imagen del QR.

- **RF-17.03:** El comprador puede ingresar presentando únicamente el código de cuatro cifras.

- **RF-17.04:** Para bonos con comida, el mismo código o QR sirve para retirar el pedido.

- **RF-17.05:** No es necesario actualizar el ticket virtual después del ingreso para retirar comida, ya que la validación se realiza siempre contra el estado en el servidor.

- **RF-17.06:** El comprador no necesita conexión a internet durante el evento si dispone previamente del QR o código. La aplicación no incorpora modo sin conexión para vendedores.

# **RF-18 --- Estados del bono** {#rf-18-estados-del-bono}

El sistema maneja los estados:

- VENDIDO

- USADO_ENTRADA

- USADO_COMIDA

- ANULADO

# **RF-19 --- Estados del bono simple** {#rf-19-estados-del-bono-simple}

El flujo válido es:

VENDIDO → USADO_ENTRADA

- **RF-19.01:** Un bono simple no puede pasar a USADO_COMIDA (el backend rechaza la validación de comida).

# **RF-20 --- Estados del bono con comida** {#rf-20-estados-del-bono-con-comida}

El flujo válido es:

VENDIDO → USADO_ENTRADA → USADO_COMIDA

- **RF-20.01:** La comida no puede marcarse como utilizada antes de registrar la entrada.

# **RF-21 --- Validación de entrada** {#rf-21-validación-de-entrada}

El sistema cuenta con la pantalla **Validar entrada** con tres modos: ingreso de código, escáner de QR y búsqueda manual.

- **RF-21.01:** El vendedor puede escanear el QR con la cámara del dispositivo (API nativa BarcodeDetector cuando está disponible y librería jsQR como alternativa).

- **RF-21.02:** El vendedor puede ingresar el código de cuatro cifras mediante un teclado numérico.

- **RF-21.03:** Ambos mecanismos identifican el mismo bono. El escáner acepta la URL pública completa, el token o el código de cuatro cifras.

- **RF-21.04:** El vendedor puede buscar el bono por nombre del vendedor o del comprador y validarlo directamente desde el resultado.

- **RF-21.05:** La validación se confirma de forma inmediata al completar los cuatro dígitos o al leer el QR; no existe un paso intermedio de confirmación explícita.

- **RF-21.06:** Al validar, el sistema cambia el estado de VENDIDO a USADO_ENTRADA mediante una actualización condicional atómica.

- **RF-21.07:** El sistema registra en `ticket_validations` el tipo de validación, el usuario que validó, el estado previo, el estado nuevo y la fecha y hora.

- **RF-21.08:** La pantalla muestra un resultado visual claro (válida, ya utilizada, anulada o no encontrada) con los datos del bono y vibración háptica cuando el dispositivo la soporta.

# **RF-22 --- Entrada ya utilizada** {#rf-22-entrada-ya-utilizada}

- **RF-22.01:** Una entrada solamente puede utilizarse una vez.

- **RF-22.02:** Si se intenta reutilizar, el backend rechaza la operación con un conflicto.

- **RF-22.03:** La interfaz indica que la entrada ya fue utilizada y muestra, cuando están disponibles, fecha, hora y usuario de la validación anterior.

# **RF-23 --- Venta en puerta e ingreso inmediato** {#rf-23-venta-en-puerta-e-ingreso-inmediato}

- **RF-23.01:** Un bono vendido puede validarse inmediatamente después de su creación.

- **RF-23.02:** El comprador no necesita realizar ninguna operación adicional después de recibir su ticket.

- **RF-23.03:** Tras la emisión, el vendedor puede pulsar «Autorizar ingreso» para registrar la entrada sobre el mismo bono.

- **RF-23.04:** La generación del bono no marca automáticamente la entrada como utilizada.

# **RF-24 --- Validación de comida** {#rf-24-validación-de-comida}

El sistema cuenta con la pantalla independiente **Validar comida**, con los mismos modos que la validación de entrada.

- **RF-24.01:** El vendedor puede escanear el mismo QR utilizado en la entrada.

- **RF-24.02:** El vendedor puede ingresar el mismo código de cuatro cifras.

- **RF-24.03:** El backend comprueba que el bono sea CON_COMIDA.

- **RF-24.04:** El backend comprueba que la entrada haya sido utilizada (estado USADO_ENTRADA).

- **RF-24.05:** El backend comprueba que la comida todavía no haya sido entregada.

- **RF-24.06:** Como en la entrada, la entrega se confirma de forma inmediata al ingresar el código o leer el QR.

- **RF-24.07:** Al validar, el estado cambia a USADO_COMIDA.

- **RF-24.08:** El sistema registra fecha, hora y usuario que confirmó la entrega.

# **RF-25 --- Restricciones de comida** {#rf-25-restricciones-de-comida}

- **RF-25.01:** Un bono simple no permite validar comida.

- **RF-25.02:** Un bono con comida no permite retirar comida antes de registrar la entrada.

- **RF-25.03:** El pedido puede retirarse únicamente una vez.

- **RF-25.04:** El pedido se entrega completo en una única operación.

- **RF-25.05:** No existen canjes parciales.

- **RF-25.06:** Una vez confirmada la entrega, el beneficio de comida se considera utilizado.

# **RF-26 --- Comida ya entregada** {#rf-26-comida-ya-entregada}

Si se intenta utilizar nuevamente el bono en el sector de comida:

- **RF-26.01:** El backend rechaza la operación.

- **RF-26.02:** La interfaz muestra que la comida ya fue entregada.

- **RF-26.03:** Se muestran, cuando están disponibles, fecha, hora y usuario que confirmó la entrega.

# **RF-27 --- Anulación** {#rf-27-anulación}

- **RF-27.01:** Un bono puede ser anulado por cualquier usuario autenticado y activo (administrador o vendedor), indicando opcionalmente un motivo. La anulación solo está permitida para bonos en estado VENDIDO.

- **RF-27.02:** Un bono anulado no se elimina.

- **RF-27.03:** Un bono anulado se conserva en el historial; la anulación queda registrada en `ticket_validations` con tipo ANULACION, usuario, estados previo y nuevo, motivo y fecha.

- **RF-27.04:** Un bono anulado no permite validar entrada.

- **RF-27.05:** Un bono anulado no permite validar comida.

- **RF-27.06:** La página pública indica el estado ANULADO.

- **RF-27.07:** Si un bono de venta anticipada se anula, el cupo consumido se restituye en la misma transacción.

- **RF-27.08:** El cupo restituido regresa al mismo origen del que fue consumido (cupo personal o cupo de bonos libres del mismo vendedor).

- **RF-27.09:** Un bono que ya fue utilizado para ingresar no puede anularse y, por lo tanto, no restituye cupo.

# **RF-28 --- Consulta de bonos** {#rf-28-consulta-de-bonos}

- **RF-28.01:** El sistema muestra un listado de bonos (pantalla **Tickets**).

- **RF-28.02:** El administrador puede consultar todos los bonos.

- **RF-28.03:** Los vendedores consultan únicamente sus propios bonos; el backend impone este filtro.

- **RF-28.04:** El sistema permite buscar por texto libre sobre: código de cuatro cifras, número de bono, token público, nombre del comprador y nombre del vendedor.

- **RF-28.05:** Permite filtrar por:

  - estado;

  - tipo;

  - origen de venta;

  - vendedor (solo administrador).

- **RF-28.06:** Se puede acceder al detalle de un bono, con su QR, enlace público, opción de copiar el enlace, anulación y autorización de ingreso.

- **RF-28.07:** El listado no está paginado; el backend lo mantiene en caché durante 3 segundos.

# **RF-29 --- Detalle interno del bono** {#rf-29-detalle-interno-del-bono}

El sistema muestra:

- número;

- estado;

- tipo;

- comprador (nombre, apellido, teléfono y email);

- vendedor;

- precio;

- código;

- QR y enlace público;

- fecha de venta;

- origen de venta;

- origen del cupo utilizado;

- fecha de ingreso y usuario que validó el ingreso;

- fecha de entrega de comida y usuario que validó la comida.

# **RF-30 --- Estadísticas** {#rf-30-estadísticas}

El dashboard calcula en el cliente, a partir del listado de bonos, las siguientes métricas (global para el administrador, con filtro por vendedor; personal para el vendedor):

- cantidad total de bonos emitidos (sin anulados);

- recaudación total y precio promedio;

- cantidad y recaudación de bonos simples;

- cantidad y recaudación de bonos con comida;

- cantidad y recaudación de bonos anulados;

- cantidad de entradas utilizadas;

- cantidad de comidas entregadas y pendientes;

- cantidad, recaudación y porcentaje de ventas anticipadas;

- cantidad, recaudación y porcentaje de ventas en puerta;

- ranking de vendedores (bonos emitidos, recaudación, promedio, anticipadas y puerta);

- los diez bonos más recientes.

# **RF-31 --- Estadísticas de venta en puerta** {#rf-31-estadísticas-de-venta-en-puerta}

El sistema distingue las ventas en puerta de las anticipadas. El dashboard muestra cantidad, recaudación y porcentaje de las ventas en puerta, y el ranking de vendedores discrimina las ventas en puerta de cada uno. Las métricas de puerta se presentan agregadas; no existen estadísticas separadas por tipo de bono dentro de la puerta.

# **RF-32 --- Origen de la venta** {#rf-32-origen-de-la-venta}

Cada bono almacena su origen (obligatorio):

- ANTICIPADA

- PUERTA

- **RF-32.01:** El origen PUERTA se asigna cuando el vendedor elige la opción de venta en puerta.

- **RF-32.02:** El origen ANTICIPADA se asigna cuando el vendedor elige venta con cupo personal o con bono libre.

- **RF-32.03:** El origen puede utilizarse como filtro en el listado de bonos y se refleja en las estadísticas.

# **RF-33 --- Cupo personal por vendedor** {#rf-33-cupo-de-bonos-por-vendedor}

Los cupos se aplican exclusivamente a las ventas de origen ANTICIPADA.

- **RF-33.01:** Cada vendedor cuenta con una cantidad limitada de bonos de cupo personal para ventas anticipadas.

- **RF-33.02:** El administrador puede establecer el cupo personal de un vendedor concreto, o de todos los vendedores a la vez.

- **RF-33.03:** El administrador puede definir un cupo personal por defecto (inicialmente 0) que se aplica a los vendedores que aún no tienen cupo propio.

- **RF-33.04:** El valor asignado debe ser mayor o igual a cero. El backend no valida que el nuevo valor sea mayor o igual a la cantidad ya consumida.

- **RF-33.05:** Cada venta anticipada consume exactamente una unidad.

- **RF-33.06:** Si el vendedor no indica el origen del cupo, el backend consume primero el cupo personal y, de estar agotado, el cupo de bonos libres.

- **RF-33.07:** El sistema muestra al vendedor su cupo asignado, utilizado y restante, tanto en el flujo de emisión como en la consulta de cupo.

- **RF-33.08:** Cuando el cupo personal está agotado, el backend rechaza la venta anticipada con cupo personal (conflicto).

- **RF-33.09:** La interfaz informa el cupo personal disponible en la venta.

- **RF-33.10:** Las ventas en puerta quedan excluidas de estas restricciones.

- **RF-33.11:** Toda modificación de cupo personal se registra en un log de auditoría (administrador, vendedor, tipo, valor anterior y valor nuevo, fecha).

# **RF-34 --- Bonos libres** {#rf-34-bonos-libres}

Los **bonos libres** son bonos normales (de tipo SIMPLE o CON_COMIDA) que se emiten **sin precio** y que se descuentan de un **cupo propio de cada vendedor (seminarista)**, independiente de su cupo personal. No existe un fondo común compartido entre vendedores.

- **RF-34.01:** Cada vendedor dispone de su propio cupo de bonos libres (`assigned_free_quota`) con su propio contador de utilizados (`used_free_quota`).

- **RF-34.02:** El administrador puede establecer el cupo de bonos libres de un vendedor concreto o de todos los vendedores a la vez.

- **RF-34.03:** El administrador puede definir un cupo de bonos libres por defecto (inicialmente 5) que se aplica a los vendedores que aún no tienen cupo propio.

- **RF-34.04:** El valor asignado debe ser mayor o igual a cero. El backend no valida que el nuevo valor sea mayor o igual a la cantidad ya utilizada.

- **RF-34.05:** El vendedor elige explícitamente emitir un bono libre seleccionando el origen «bono libre» al emitir; la elección es independiente de que su cupo personal esté o no agotado.

- **RF-34.06:** Si no se indica el origen del cupo, el backend utiliza el cupo personal y, solo cuando este se agota, un bono libre del mismo vendedor (RF-33.06).

- **RF-34.07:** Un bono libre se registra con origen de cupo LIBRE y precio 0; conserva el tipo (SIMPLE o CON_COMIDA) elegido.

- **RF-34.08:** Cada venta con bono libre incrementa en una unidad el contador de utilizados del vendedor que la realiza.

- **RF-34.09:** El backend rechaza la venta con bono libre cuando el cupo libre del vendedor está agotado (conflicto).

- **RF-34.10:** El agotamiento de bonos libres no impide realizar ventas en puerta ni ventas con cupo personal.

- **RF-34.11:** El vendedor consulta su cupo libre asignado, utilizado y disponible.

- **RF-34.12:** El administrador consulta, por vendedor, los bonos libres asignados, utilizados y restantes, así como el total agregado (suma de los cupos de todos los vendedores) y el uso por vendedor.

- **RF-34.13:** Toda modificación de cupo de bonos libres se registra en el log de auditoría de cupos (tipo FREE).

- **RF-34.14:** Al anular un bono libre en estado VENDIDO, la unidad se restituye al cupo libre del mismo vendedor.

# **RF-35 --- Origen del cupo del bono** {#rf-35-origen-del-cupo-del-bono}

Cada bono registra cómo fue obtenido. Valores:

- PERSONAL

- LIBRE

- NO_APLICA

- **RF-35.01:** Si una venta anticipada utiliza el cupo personal del vendedor, el bono registra PERSONAL.

- **RF-35.02:** Si una venta anticipada utiliza un bono libre del vendedor, el bono registra LIBRE.

- **RF-35.03:** Las ventas en puerta registran NO_APLICA.

- **RF-35.04:** El origen del cupo no cambia posteriormente.

- **RF-35.05:** El origen del cupo se conserva para trazabilidad, restitución de cupo y estadísticas. Se muestra en el listado y en el detalle del bono, pero no existe un filtro por este campo.

# **RF-36 --- Consulta de cupos** {#rf-36-consulta-de-stock-de-bonos}

### **Para el administrador**

En la pantalla de Gestión de usuarios, el administrador visualiza por vendedor:

- cupo personal asignado, utilizado y restante;

- bonos libres asignados, utilizados y restantes;

- indicación de cupo personal agotado.

También dispone del total agregado de bonos libres (asignados, utilizados y disponibles) y de la lista de vendedores con cupo personal agotado.

### **Para el vendedor**

El vendedor visualiza en el flujo de emisión:

- cupo personal asignado y restante;

- bonos libres asignados y restantes.

- **RF-36.01:** Los valores se recalculan al abrir el flujo de emisión y después de cada venta.

- **RF-36.02:** El sistema indica la unidad de cupo que se utilizará mediante la opción de origen seleccionada (personal o bono libre).

# **RF-37 --- Reglas de consumo de cupos** {#rf-37-reglas-de-consumo-de-cupos}

Para una venta anticipada, el consumo se resuelve en el backend según el origen indicado:

1.  Origen PERSONAL: se descuenta una unidad del cupo personal si hay disponibilidad; de lo contrario se rechaza.

2.  Origen LIBRE: se descuenta una unidad del cupo libre del mismo vendedor si hay disponibilidad; de lo contrario se rechaza.

3.  Sin origen indicado: se intenta el cupo personal y, si está agotado, el cupo libre.

- **RF-37.01:** Una venta nunca consume simultáneamente un bono personal y un bono libre.

- **RF-37.02:** Cada venta anticipada consume exactamente una unidad.

- **RF-37.03:** El alta del comprador, el consumo de cupo y la creación del bono se ejecutan en una única transacción de base de datos.

- **RF-37.04:** Si la venta no llega a generarse correctamente, la transacción se revierte y no se descuenta ningún cupo.

- **RF-37.05:** Si el descuento de cupo falla, no se genera el bono.

# **RF-38 --- Estadísticas de cupos** {#rf-38-estadísticas-de-cupos}

El administrador puede consultar:

- cupo personal asignado, utilizado y disponible por vendedor;

- cupo de bonos libres asignado, utilizado y disponible por vendedor;

- vendedores con cupo personal agotado;

- totales agregados de bonos libres (asignados, utilizados y disponibles);

- uso de bonos libres por vendedor.

# **RF-39 --- Auditoría** {#rf-39-auditoría}

El sistema registra:

- modificaciones de cupo (personal y bonos libres, individuales o masivas): administrador, vendedor afectado, tipo de cupo, valor anterior, valor nuevo y fecha;

- validaciones de entrada y de comida: bono, usuario, estado previo, estado nuevo y fecha;

- anulaciones: bono, usuario, estado previo, estado nuevo, motivo y fecha.

La creación de bonos queda trazada por el vendedor y la fecha de creación almacenados en el propio bono, junto con su origen de venta y de cupo.

No existe una bitácora de auditoría para cambios de precio ni para cambios de estado o rol de usuarios.

# **Requerimientos no funcionales**

## **RNF-01 --- Usabilidad** {#rnf-01-usabilidad}

- **RNF-01.01:** La interfaz es sencilla para usuarios sin conocimientos técnicos.

- **RNF-01.02:** La emisión de un bono se resuelve con pocos pasos: panel de venta rápida en celulares y asistente por pasos en escritorio.

- **RNF-01.03:** La validación de entrada y comida está optimizada para rapidez: teclado numérico propio, validación automática al completar cuatro dígitos y lectura continua de QR.

- **RNF-01.04:** Las pantallas de entrada y comida muestran únicamente la información relevante para la operación.

- **RNF-01.05:** Toda validación muestra un resultado visual claro.

- **RNF-01.06:** La anulación solicita confirmación mediante un cuadro de diálogo con motivo opcional.

- **RNF-01.07:** Los mensajes de error explican el motivo del rechazo.

- **RNF-01.08:** La disponibilidad de cupo del vendedor es visible durante la emisión.

- **RNF-01.09:** El origen del bono (personal, libre o puerta) se selecciona y es visible antes de confirmar la venta.

## **RNF-02 --- Diseño responsive** {#rnf-02-diseño-responsive}

- **RNF-02.01:** El sistema puede utilizarse desde computadoras, tablets y teléfonos.

- **RNF-02.02:** La navegación incluye una barra inferior para dispositivos móviles y las pantallas de validación están orientadas a celulares.

- **RNF-02.03:** La pantalla pública del ticket es utilizable desde un teléfono.

- **RNF-02.04:** El QR mostrado después de una venta tiene tamaño suficiente para ser escaneado desde otro teléfono.

## **RNF-03 --- Rendimiento** {#rnf-03-rendimiento}

- **RNF-03.01:** La búsqueda de un bono mediante QR o código se resuelve con una consulta indexada (token y código únicos).

- **RNF-03.02:** La confirmación de entrada o comida se ejecuta con una única solicitud de red.

- **RNF-03.03:** Los listados no están paginados; se mitigan con caché de memoria de corta duración (listado de bonos 3 s, ticket público 15 s, precios 5 min).

- **RNF-03.04:** El bono se genera inmediatamente después de confirmar la venta.

- **RNF-03.05:** La consulta de cupo es una lectura simple por vendedor.

## **RNF-04 --- Concurrencia** {#rnf-04-concurrencia}

- **RNF-04.01:** El sistema impide que dos dispositivos validen simultáneamente la misma entrada.

- **RNF-04.02:** El sistema impide que dos dispositivos validen simultáneamente la entrega de comida del mismo bono.

- **RNF-04.03:** Las validaciones se realizan en una transacción que bloquea el bono (`FOR UPDATE`) y aplica una actualización condicional del estado.

- **RNF-04.04:** Ante dos solicitudes concurrentes, solo una completa la operación y la otra recibe un conflicto.

- **RNF-04.05:** El consumo del cupo personal se realiza de forma atómica con bloqueo de fila del cupo del vendedor.

- **RNF-04.06:** El consumo de bonos libres se realiza de forma atómica con bloqueo de fila del cupo del vendedor.

- **RNF-04.07:** El backend vuelve a comprobar la disponibilidad al confirmar la venta, no solo al mostrar el formulario.

## **RNF-05 --- Seguridad** {#rnf-05-seguridad}

- **RNF-05.01:** Las rutas protegidas requieren autenticación; las rutas administrativas requieren además rol ADMIN.

- **RNF-05.02:** Las autorizaciones se comprueban también en backend.

- **RNF-05.03:** Las sesiones utilizan JWT de corta vida y tokens de renovación almacenados como hash, rotados y con detección de reutilización. No existen contraseñas locales: la autenticación se delega en Google.

- **RNF-05.04:** Los tokens públicos de los bonos son aleatorios de 256 bits y no enumerables.

- **RNF-05.05:** El frontend no puede modificar el estado de un bono sin validación del servidor.

- **RNF-05.06:** Los datos enviados se validan en backend (tipos, formatos, rangos) y, parcialmente, en frontend.

- **RNF-05.07:** El backend aplica cabeceras de seguridad, CORS con lista de orígenes permitidos, protección anti-CSRF, límite de tamaño de cuerpo (1 MB), recuperación ante pánicos y registro de solicitudes.

- **RNF-05.08:** La página pública expone únicamente los datos necesarios del bono y del comprador (nombre completo, sin teléfono ni email).

- **RNF-05.09:** Solo los administradores pueden modificar cupos y precios (rutas protegidas con rol ADMIN).

- **RNF-05.10:** El endpoint público de ticket está protegido por limitador de tasa.

## **RNF-06 --- Integridad de datos** {#rnf-06-integridad-de-datos}

- **RNF-06.01:** Los números de bono son únicos.

- **RNF-06.02:** Los códigos de cuatro cifras no generan ambigüedad entre bonos en estado VENDIDO o USADO_ENTRADA (índice único parcial); el generador verifica además la inexistencia previa del código.

- **RNF-06.03:** El precio pagado se conserva en cada bono.

- **RNF-06.04:** Los bonos anulados no se eliminan físicamente.

- **RNF-06.05:** Cada validación confirmada queda registrada en un log independiente del estado actual.

- **RNF-06.06:** Los cupos asignados y utilizados nunca son negativos (restricciones de base de datos).

- **RNF-06.07:** Estados, tipos, orígenes de venta y orígenes de cupo están restringidos mediante restricciones CHECK en base de datos.

- **RNF-06.08:** Cada venta anticipada queda asociada exactamente a un origen de cupo.

- **RNF-06.09:** Las ventas en puerta no afectan los contadores de cupos.

- **RNF-06.10:** El alta del comprador, el descuento de cupo y la creación del bono se completan de manera consistente en una única transacción.

## **RNF-07 --- Disponibilidad** {#rnf-07-disponibilidad}

- **RNF-07.01:** El sistema prioriza la disponibilidad durante el evento: el backend responde con indicador de salud (`/health`) y el frontend utiliza caché de corta duración.

- **RNF-07.02:** La creación del bono reintenta internamente (hasta 3 veces) ante colisiones del código de cuatro cifras.

- **RNF-07.03:** Las operaciones de creación de bono no son idempotentes frente a reintentos del cliente: un reintento tras una respuesta perdida generaría un segundo bono y consumiría un segundo cupo. Las validaciones sí son seguras ante reintentos, ya que el segundo intento es rechazado.

## **RNF-08 --- Independencia de conexión del comprador** {#rnf-08-independencia-de-conexión-del-comprador}

- **RNF-08.01:** El comprador no depende de una conexión a internet después de obtener su QR o código.

- **RNF-08.02:** Una captura de pantalla contiene la información necesaria para utilizar el bono.

- **RNF-08.03:** El código de cuatro cifras permite utilizar el bono aunque el comprador no pueda mostrar el QR.

- **RNF-08.04:** El dispositivo del vendedor sí debe disponer de conexión con el sistema para realizar validaciones.

## **RNF-09 --- Compatibilidad** {#rnf-09-compatibilidad}

- **RNF-09.01:** La aplicación es una SPA Angular compatible con navegadores modernos.

- **RNF-09.02:** La página pública funciona en navegadores móviles.

- **RNF-09.03:** La lectura de QR utiliza la API BarcodeDetector cuando está disponible y la librería jsQR como alternativa; el ingreso manual del código de cuatro cifras está siempre disponible.

## **RNF-10 --- Accesibilidad** {#rnf-10-accesibilidad}

- **RNF-10.01:** Los controles principales se distinguen claramente.

- **RNF-10.02:** Los estados se representan mediante etiquetas de texto además del color.

- **RNF-10.03:** Los formularios indican los campos obligatorios y los errores.

- **RNF-10.04:** Los botones de entrada y comida tienen dimensiones adecuadas para interacción táctil.

## **RNF-11 --- Trazabilidad** {#rnf-11-trazabilidad}

- **RNF-11.01:** Se determina quién creó cada bono (vendedor asociado al bono).

- **RNF-11.02:** Se determina quién validó cada entrada.

- **RNF-11.03:** Se determina quién validó cada entrega de comida.

- **RNF-11.04:** Se registra fecha y hora de cada validación y anulación.

- **RNF-11.05:** La información histórica de validaciones y anulaciones no depende únicamente del estado actual del bono.

- **RNF-11.06:** Se determina si una venta utilizó cupo personal o cupo de bonos libres.

- **RNF-11.07:** Se determina qué vendedor consumió cada bono libre (el bono libre pertenece al cupo del vendedor que lo emitió).

- **RNF-11.08:** Se determina quién modificó un cupo y cuáles eran sus valores anterior y posterior. La identificación del administrador se toma de la cabecera `X-User-ID` de la solicitud.

## **RNF-12 --- Mantenibilidad** {#rnf-12-mantenibilidad}

- **RNF-12.01:** El backend se organiza en capas separadas (controladores, servicios, repositorios, modelos, DTO, middlewares, rutas, seguridad y caché).

- **RNF-12.02:** Las reglas de negocio residen en los servicios y repositorios, no en la interfaz.

- **RNF-12.03:** Las validaciones críticas (cupos, transiciones de estado, permisos) se ejecutan en backend.

- **RNF-12.04:** Tipos, estados, roles, orígenes de venta y orígenes de cupo están definidos como constantes tipadas en backend y como uniones de literales en frontend.

- **RNF-12.05:** La lógica de consumo y restitución de cupos está centralizada en el repositorio de cupos, utilizado por todos los flujos de venta.

## **RNF-13 --- Privacidad** {#rnf-13-privacidad}

- **RNF-13.01:** Solo se recolectan los datos del comprador necesarios: nombre, apellido, teléfono y email opcional.

- **RNF-13.02:** La página pública y las pantallas de validación no exponen el teléfono ni el email del comprador.

- **RNF-13.03:** Los datos completos del comprador solo son accesibles a usuarios autenticados.

## **RNF-14 --- Recuperación ante errores** {#rnf-14-recuperación-ante-errores}

- **RNF-14.01:** Si falla la generación de un bono, la transacción se revierte y no queda una venta parcial.

- **RNF-14.02:** Si una validación falla, el sistema informa el motivo del rechazo.

- **RNF-14.03:** Recargar la página después de una venta no genera nuevamente el bono.

- **RNF-14.04:** Recargar la página después de una validación no vuelve a consumir el beneficio, ya que el backend rechaza la repetición.

- **RNF-14.05:** Si una venta falla antes de crear el bono, el cupo permanece disponible.

- **RNF-14.07:** Las restituciones de cupo por anulación se ejecutan en la misma transacción que el cambio de estado y solo son posibles sobre bonos en estado VENDIDO, por lo que no pueden repetirse sobre el mismo bono.

## **RNF-15 --- Consistencia de cupos** {#rnf-15-consistencia-de-cupos}

- **RNF-15.01:** El backend es la fuente de verdad de la disponibilidad de cupos.

- **RNF-15.02:** Los valores de cupo mostrados en frontend son informativos hasta que la operación sea confirmada por el servidor.

- **RNF-15.03:** La comprobación, el consumo del cupo y la creación del bono se ejecutan como una única operación transaccional.

- **RNF-15.04:** El bloqueo de fila impide condiciones de carrera que permitan superar el límite asignado a un vendedor.

- **RNF-15.05:** El mismo mecanismo protege el cupo de bonos libres de cada vendedor.

- **RNF-15.06:** Los contadores reflejan las operaciones confirmadas inmediatamente después de completarse una venta o anulación.

