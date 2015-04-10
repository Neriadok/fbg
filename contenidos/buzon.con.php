<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/buzon.inc.php';
	include_once '../includes/users.inc.php';
	
	sesion_segura();

	$datos = json_decode(file_get_contents('php://input'),true);
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Se elimina un correo.
		if(isset($datos['deleteCorreo'])){
			//Filtramos los datos
			$correo = preg_replace("/[^0-9]+/", "", $datos['deleteCorreo']);
			//Eliminamos el correo con ese ID
			deleteCorreo($conexion,$correo);
		}
		
		//Se acepta una petición de amistad.
		if(isset($datos['aceptarAmistad'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['aceptarAmistad']);
			
			//Si no son amigos todavía, procedemos a añadir una nueva amistad en la tabla amistades.
			if(!sonAmigos($conexion, $uId, $_SESSION['userId'])){
				aceptarAmistad($conexion,$uId);
			}
			//Si fueran amigos mostramos el buzon ignorando la peticion.
			else{
				buzon($conexion);
			}
		}
		
		//Se deniega una peticion de amistad.
		else if(isset($datos['denegarAmistad'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['denegarAmistad']);
			//Denegamos la peticion de amistad
			denegarAmistad($conexion,$uId);
		}
		
		//Por defecto siempre mostraremos el contenido del buzón para evitar posibles "extraños" en el funcionamiento.
		else{
			buzon($conexion);
		}
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>