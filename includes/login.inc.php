<?php
	include_once 'db_connect.php';
	include_once 'functions.php';
	include_once 'default.inc.php';
	
	sesion_segura(); // Nuestra manera personalizada segura de iniciar sesi�n PHP.

	$datos = json_decode(file_get_contents('php://input'),true);
	
	$_SESSION = array();
	if (isset($datos['nickname'], $datos['p'])) {
		//Tratamos los datos recibidos por AJAX-POST
		
		$nickname = $datos['nickname'];
		$password = $datos['p']; // La contrase�a con hash
		
		if (login($nickname, $password, $conexion)) {
			// Inicio de sesión exitosa
			echo "<div class='contenedor mid top box'> LOGIN EXITOSO<br/><a href='portal.php'>Volver al portal</a></div>";
		}
		else {
			echo "<div class='contenedor mid top box'> Login fallido. <br/><a href='portal.php'>Volver al portal</a></div>";
		}
	}
	else {
		// Las variables POST correctas no se enviaron a esta p�gina.
		echo "<div class='contenedor mid top box'>Error en el envio.<br/><a href='portal.php'>Volver al portal</a></div>";
	}
?>