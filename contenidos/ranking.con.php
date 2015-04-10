<?php
	include_once '../includes/db_connect.php';
	include_once '../includes/functions.php';
	include_once '../includes/default.inc.php';
	include_once '../includes/ranking.inc.php';
	include_once '../includes/users.inc.php';
	
	sesion_segura();

	$datos = json_decode(file_get_contents('php://input'),true);
	
	$urle=esc_url($_SERVER['PHP_SELF']);
	
	if (login_check($conexion)){
		//Si se envia un mensaje
		if(isset($datos['enviarMsg'])){
			//Filtrar $datos
			$destinatario = preg_replace("/[^0-9]+/", "", $datos['enviarMsg']);
			$topic = nl2br(preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@\s¡!¿?()\"'_.,:\/\-]+/", "", $datos['topic']));
			$content = nl2br(preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@\s¡!¿?()\"'_.,:\/\-]+/", "", $datos['content']));
			
			//Enviamos el mensaje
			enviarMensaje($conexion,$destinatario,$topic,$content);
		}
		
		//Ver el perfil de un usuario
		if(isset($datos['verPerfilUser'])){
			//Filtrar $datos
			$uId = preg_replace("/[^0-9]+/","",$datos['verPerfilUser']);
			
			//Mostramos el perfil
			perfil_usuario($conexion,$uId);
		}
		
		//Añadir un amigo.
		else if(isset($datos['addmigoUser'])){
			//Filtrar $datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['addmigoUser']);
			
			//Lanzamos la peticion de amistad.
			peticionAmistad($conexion,$uId);
			
			//Mostramos el perfil
			perfil_usuario($conexion,$uId);
		}
		
		//Eliminar un amigo.
		else if(isset($datos['delmigoUser'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['delmigoUser']);
			
			//Si son amigos todavía, procedemos a eliminar la amistad.
			if(sonAmigos($conexion, $uId, $_SESSION['userId'])){
				eliminarAmigo($conexion,$uId);
			}
			//Si no fueran amigos mostramos el perfil ignorando la peticion.
			else{
				perfil_usuario($conexion,$uId);
			}
		}
		
		//Eliminar un usuario.
		else if(isset($datos['delUser'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['delUser']);
			
			//Procedemos a eliminarlo
			delUser($conexion,$uId);
			
			//Vamos al ranking
			ranking($conexion,$_SESSION['userId']);
		}
		
		//Poner faltas a un usuario.
		else if(isset($datos['addFaltaUser'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['addFaltaUser']);
			
			//Procedemos a eliminarlo
			addFaltaUser($conexion,$uId);
			
			//Vamos al ranking
			ranking($conexion,$_SESSION['userId']);
		}
		
		//Banear un usuario.
		else if(isset($datos['banUser'])){
			//Filtramos los datos
			$uId = preg_replace("/[^0-9]+/", "", $datos['banUser']);
			
			//Procedemos a eliminarlo
			banUser($conexion,$uId);
			
			//Vamos al ranking
			ranking($conexion,$_SESSION['userId']);
		}
		
		
		//Editar el perfil.
		else if(isset($datos['destino'])){
			if($datos['destino'] == "editPerfil"){
				perfil_editar($conexion, $_SESSION['userId']);
			}
			else{
				perfil_usuario($conexion,$_SESSION['userId']);
			}
		}
		
		//Por defecto
		else{
			ranking($conexion,$_SESSION['userId']);
		}
	}
	
	//Si no se esta logueado mostramos el contenido por defecto.
	else {
		defaultContent($msgR);
	}
?>