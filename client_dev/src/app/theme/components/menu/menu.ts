
import { Menu } from './menu.model';

function setMenu(): Menu[] {
    let Menus = [
        // new Menu(11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0),
    ];
    Menus.push(new Menu(10, 'Registro de Información', null, null, 'fa', 'users', null, true, 0));
    Menus.push(new Menu(11, 'Gestión de Empleados', '/empleados', null, 'fa', 'id-badge', null, false, 10));
    Menus.push(new Menu(12, 'Gestión de Usuarios', '/usuarios', null, 'fa', 'users', null, false, 10));
    Menus.push(new Menu(13, 'Gestión de Vehículos', '/vehiculo', null, 'fa', 'car', null, false, 10));
    Menus.push(new Menu(14, 'Gestión de Talleres', '/taller', null, 'fas', 'warehouse', null, false, 10));
    Menus.push(new Menu(15, 'Gestión de Trabajos', '/trabajo', null, 'fas', 'tools', null, false, 10));
    Menus.push(new Menu(16, 'Gestión de Impuestos', '/iva', null, 'fas', 'tachometer-alt', null, false, 10));
    Menus.push(new Menu(20, 'Gestión de Documentos', null , null, 'fa', 'id-badge', null, true, 0));
    Menus.push(new Menu(22, 'Gestión de Salvoconducto', '/salvo-conducto', null, 'fas', 'route', null, false, 20));
    Menus.push(new Menu(23, 'Informe General', '/informe-general', null, 'far', 'folder', null, false, 20));
    Menus.push(new Menu(24, 'Orden de Trabajo', '/orden-trabajo', null, 'fas', 'file-invoice', null, false, 20));
    // Menus.push(new Menu(25, 'Ficha Técnica', '/ficha-tecnica', null, 'fas', 'file-alt', null, false, 20));
    Menus.push(new Menu(26, 'Combustible', '/combustible', null, 'fas', 'gas-pump', null, false, 20));
    // Menus.push(new Menu(40, 'Recorrido', '/recorrido', null, 'fa', 'road', null, false, 0));
    // Menus.push(new Menu(100, 'Estado de Recepcion', '/estado-recepcion', null, 'far', 'calendar-check', null, false, 0));
    return Menus;
}


export const verticalMenuItems = setMenu();



export const horizontalMenuItems = setMenu();

// import { Menu } from './menu.model';

// export const verticalMenuItems = [ 
//     // new Menu (10, 'Perfil', null, null, 'user', null, true, 0),
//     new Menu (11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0),
//     new Menu (20, 'Personas', '/personas', null, 'users', null, false, 0),
//     new Menu (30, 'Locaciones', '/locaciones', null, 'map-signs', null, false, 0),
//     new Menu (40, 'Productos', '/productos', null, 'shopping-cart', null, false, 0),
//     new Menu (50, 'Categorias', '/categorias', null, 'tags', null, false, 0),
//     new Menu (60, 'Usuarios', '/usuarios', null, 'id-badge', null, false, 0),
//     new Menu (70, 'Empresas', '/empresas', null, 'building', null, false, 0),
//     new Menu (80, 'Bodegas', '/bodegas', null, 'industry', null, false, 0),
//     new Menu (90, 'Ingresos', null, null, 'briefcase', null, true, 0),
//     new Menu (91, 'Solicitud de Ingreso', '/crear-ingresos', null, 'plus', null, false, 90),
//     new Menu (92, 'Lista de Ingresos', '/lista-ingresos', null, 'list', null, false, 90),
//     new Menu (100, 'Traslados', null, null, 'briefcase', null, true, 0),
//     new Menu (101, 'Solicitud de Traslado', '/crear-transacciones', null, 'plus', null, false, 100),
//     new Menu (102, 'Lista de Traslados', '/lista-transacciones', null, 'list', null, false, 100),
//     new Menu (120, 'Pedidos', null, null, 'briefcase', null, true, 0),
//     new Menu (121, 'Solicitud de Pedidos', '/crear-pedidos', null, 'plus', null, false, 120),
//     new Menu (122, 'Lista de Pedidos', '/lista-pedidos', null, 'list', null, false, 120),
//     new Menu (110, 'Inventario', '/stocks', null, 'archive', null, false, 0),
// ]

// export const horizontalMenuItems = [ 
//     // new Menu (10, 'Perfil', null, null, 'user', null, true, 0),
//     new Menu (11, 'Mi Información', '/profile/user-info', null, 'address-card-o', null, false, 0),
//     new Menu (20, 'Personas', '/personas', null, 'users', null, false, 0),
//     new Menu (30, 'Locaciones', '/locaciones', null, 'map-signs', null, false, 0),
//     new Menu (40, 'Productos', '/productos', null, 'shopping-cart', null, false, 0),
//     new Menu (50, 'Categorias', '/categorias', null, 'tags', null, false, 0),
//     new Menu (60, 'Usuarios', '/usuarios', null, 'id-badge', null, false, 0),
//     new Menu (70, 'Empresas', '/empresas', null, 'building', null, false, 0),
//     new Menu (80, 'Bodegas', '/bodegas', null, 'industry', null, false, 0),
//     new Menu (90, 'Ingresos', null, null, 'briefcase', null, true, 0),
//     new Menu (91, 'Solicitud de Ingreso', '/crear-ingresos', null, 'plus', null, false, 90),
//     new Menu (92, 'Lista Ingresos', '/lista-ingresos', null, 'list', null, false, 90),
//     new Menu (100, 'Traslados', null, null, 'briefcase', null, true, 0),
//     new Menu (101, 'Solicitud de Traslado', '/crear-transacciones', null, 'plus', null, false, 100),
//     new Menu (102, 'Lista Traslados', '/lista-transacciones', null, 'list', null, false, 100),
//     new Menu (120, 'Pedidos', null, null, 'briefcase', null, true, 0),
//     new Menu (121, 'Solicitud de Pedidos', '/crear-pedidos', null, 'plus', null, false, 120),
//     new Menu (122, 'Lista de Pedidos', '/lista-pedidos', null, 'list', null, false, 120),
//     new Menu (110, 'Inventario', '/stocks', null, 'archive', null, false, 0),
// ]