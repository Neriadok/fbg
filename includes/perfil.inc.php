<?php
	include_once "users.inc.php";
	
	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera la estructura del perfil de un usuario en funcion de los datos recibidos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function perfil($conexion){
		$datos = json_decode(file_get_contents('php://input'),true);
		
		if(isset($datos['destino'])){
			if($datos['destino'] == "editPerfil"){
				perfil_editar($conexion, $_SESSION['userId']);
			}
			else{
				perfil_usuario($conexion,$_SESSION['userId']);
			}
		}
		else if(isset($_POST['changes'])){
			modificarPerfil($conexion);
			perfil_usuario($conexion,$_SESSION['userId']);
		}
		else{
			perfil_usuario($conexion,$_SESSION['userId']);
		}
	}
?>