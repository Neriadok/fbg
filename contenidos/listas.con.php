<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/listas.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		//Si se recibe un nombre de lista procedemos a crearla.
		if(isset($datos['nombreLista'])){
			nuevaLista($conexion,$datos);
			listas($conexion,$datos);
		}
		
		//Procedemos a eliminar una lista.
		else if(isset($datos['listaAEliminar'])){
			eliminarLista($conexion,$datos);
			listas($conexion,$datos);
		}
		
		//Procedemos a editar una lista.
		else if(isset($datos['listaAModificar'])){
			modificarLista($conexion,$datos);
			listas($conexion,$datos);
		}
		
		//Mostramos el contenido por defecto de la página.
		else{
			listas_contenido($conexion,$datos);
		}
		
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>