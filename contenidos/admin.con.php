<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/admin.inc.php';
	
	sesion_segura();
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Registramos que el usuario esta activo
		actividad($conexion);
		//Solamente los usuarios con rango 3 pueden acceder a esta sección.
		if($_SESSION['tipoUser'] == 3){
			admin_actualizarContenido($conexion);
		}
		//En caso contrario redireccionamos a la página que mostrará el contenido por defecto.
		else{
			header("Location: $urle");
		}
	}

	//Si no se esta logueado redireccionamos a la página que mostrará el contenido por defecto.
	else {
		header("Location: $urle");
	}
?>