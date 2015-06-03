<?php
	include_once 'db_connect.php';
	include_once 'functions.php';
	include_once 'default.inc.php';
	
	$datos = json_decode(file_get_contents('php://input'),true);
	
	$msgR = "";
	if (isset($datos['nickname'], $datos['p'], $datos['mail'])) {

		$nickname = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $datos['nickname']);
		$password = $datos['p'];
		$mail = preg_replace("/[^a-z0-9.@_\-]+/", "", $datos['mail']);
		 
		/** Validamos la password */
		if (strlen($password) != 128) {
			// La contrase�a con hash deber� ser de 128 caracteres.
			// De lo contrario, algo muy raro habr� sucedido.
			$msgR .= "Contraseña inválida.<br/>";
		}
	
		/** Validamos y verificamos el nickname */
		$sentencia = $conexion -> prepare("CALL proceso_checkNick(?)");
		if ($sentencia) {
			$sentencia -> bind_param('s', $nickname);
			$sentencia -> execute();
			$sentencia -> store_result();
	
			if ($sentencia -> num_rows == 1) {
				// Ya existe otro usuario con este nombre de usuario.
				$msgR .= "Ya hay un usuario con ese nick.<br/>";
			}
			$sentencia -> close();
		}
		else {
			$msgR .= "Error en la base de datos al comprobar el nick.<br/>";
			$sentencia -> close();
		}
	
		
		/** Validamos y verificamos el email */	
		if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
			// No es un correo electrónico válido.
			$msgR .= "Correo inválido.<br/>";
		}
		 
		$sentencia = $conexion -> prepare("CALL proceso_checkMail(?)");
		$sentencia -> bind_param('s', $mail);
		
		if ($sentencia -> execute()) {
			$sentencia -> store_result();
				
			if ($sentencia -> num_rows == 1) {
				$msgR .= "Este Email ya está asociado a un usuario.<br/>";
			}
			$sentencia -> close();
			
		}
		else {
			$msgR .= "Error en la base de datos al comprobar el email.<br/>";
			$sentencia -> close();
		}
	
		if (empty($msgR)) {
			$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
	
			$password = hash('sha512', $password . $random_salt);
			 
			$sentencia = $conexion -> prepare("CALL proceso_newUser(?, ?, ?, ?)");
			$sentencia -> bind_param('ssss', $nickname, $mail, $password, $random_salt);
			 
			if ($sentencia -> execute()) {
				echo "
					<div class='contenedor mid top box'>
						EXITO.<br/>
						Ponte en contacto con alguno de nuestros moderadores para que activen tu cuenta.<br/>
						Recuerda que Fantasy Battle Games es una página muy exclusiva y de uso particular.<br/>
						<a href='portal.php'>Volver al portal</a>
					</div>
				";
			}
			else{
				echo "
					<div class='contenedor mid top box'>
						ERROR FATAL DE REGISTRO.<br/>
						<a href='portal.php'>Volver al portal</a>
					</div>
				";
			}
		}
		else{
			echo "
				<div class='contenedor mid column'>
					$msgR
					<a href='portal.php'>Volver al portal</a>
				</div>
			";
		}
	}
?>