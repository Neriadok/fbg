<?php
	include_once "users.inc.php";
	include_once 'partidas.inc.php';
	
	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera la estructura de la página ranking.
	 *
	 * Los contenidos de la web se cargan de forma dinámica en servidor
	 * en función de la base de datos
	 * y los datos recibidos en el método POST.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos. 
	 */
	function ranking($conexion){
		//Guardaremos cambios en el perfil en caso de que hubiesen sido realizados
		if(isset($_POST['changes'])){
			modificarPerfil($conexion);
		}
		
		echo "
			<div class='contenedor left column'>
		";
		
		ranking_usuario($conexion,$_SESSION['userId']);
		
		echo "
			</div>
			<div id='contenido' class='contenedor mid column'>
		";
		
		ranking_contenido($conexion);
		
		echo "
			</div>
			<div id='contenido' class='contenedor right column'>
		";
		amigos($conexion,false);
		echo "
			</div>
		";
	}

	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que muestra los datos de un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario en cuestion.
	 */
	function ranking_usuario($conexion,$uId){
		/**BARRA DE NAVEGACIÓN**/
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		$sentencia = $conexion -> prepare("CALL proceso_perfilUsuario(?)");
		$sentencia -> bind_param('i', $uId);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$uId
					,$avatar
					,$nickname
					,$tipoUser
					,$nombre
					,$mail
					,$edad
					,$nacionalidad
					,$fechaRegistro
					,$fechaBaja
					,$firma
					,$grito
			);
			
			if($sentencia -> fetch()){
				datosPerfil($conexion,$uId,$avatar,$tipoUser,$nickname,$fechaRegistro,$fechaBaja,$nombre,$nacionalidad,$edad,$mail);
			}
		}
	}
	
	
	/**
	 * FUNCIÓN DE ESTRUCTURA Y CONTENIDO
	 * Función que muestra el contenido del ranking.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos. 
	 */
	function ranking_contenido($conexion){
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		echo "
			<h2>Fantasy Battle Games </h2>
			<h1>RANKING</h1>
			<div id='usersList' class='scrollingBox'>
				<table id='usersListContent' class='scrollingBoxContent alignCenter'>
					<tr class='enfasis'>
						<td>Puesto</td>
						<td>Nickname</td>
						<td>Renombre</td>
						<td>Opciones</td>
					</tr>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_datosUsers()");
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($uId,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);//Añadir visitas y mensajes totales
		$i=0;
		
		while($sentencia -> fetch()){
			$i++;
			echo "<tr id='$uId' class='user ";
			
			if($_SESSION['userId'] == $uId)
				echo "tdCabecera";
			else if($i%2==0){
				echo "pairRow";
			}
			else{
				echo "inpairRow";
			}
		
			echo "
				'>
					<td class='userPosition'>$i º</td>
					<td class='userNickname'>$unickname</td>
					<td class='userRenombre'>$urenombre</td>
					<td class='userOptions' id='userOptions$uId'>
						<div id='detalles".$uId."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
						<div id='detalles".$uId."' class='ventana oculto'>
							<h2 id='detalles".$uId."Selector' class='ventanaSelector'>Detalles $unickname</h2>
							<div class='ventanaContent'>
			";
			datosUser($uId,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);
			echo"
							</div>
						</div>
						<form class='submit perfilUser' id='perfilU$uId'>
							<img src='src/botones/perfil.png' alt='Perfil'/>
							<input type='hidden' name='verPerfilUser' value='$uId'/>
						</form>
			";
			userOptions($uId,$unickname,$utipo);
			echo "
					</td>
				</tr>
			";
		}
		$sentencia -> close();
		
		echo "
				</table>
			</div>
			<div id='usersListMoving' class='scrollingBoxMoving'>
				<div id='usersListMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='usersListMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='usersListMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE ESTRUCTURA Y CONTENIDO
	 * Funcíon que actualiza las opciones de un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos. 
	 * @param $uId integer unsigned - Id del usuario al que pertenecen las opciones.
	 */
	function actualizarUserOptions($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_datosUser(?)");
		$sentencia -> bind_param('i', $uId);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($uId,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);
		if($sentencia -> fetch()){
			echo "
					<div id='detalles".$uId."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
					<div id='detalles".$uId."' class='ventana oculto'>
						<h2 id='detalles".$uId."Selector' class='ventanaSelector'>Detalles $unickname</h2>
								<div class='ventanaContent'>
								";
			datosUser($uId,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);
			echo"
			</div>
					</div>
				";
		
				userOptions($uId,$unickname,$utipo);
		}
		else{
			echo "Usuario no encontrado.<br/>Recomendamos actualizar la página.";
		}
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que lanza una peticion de amistad a un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario al que se realiza la petición.
	 */
	function peticionAmistad($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_peticionAmistad(?,?)");
		$sentencia -> bind_param('ii', $_SESSION['userId'], $uId);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Funcíon que elimina la relacion de amistad entre el usuario logueado y otro dado.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - usuario con el que se deja de ser amigo. 
	 */
	function eliminarAmigo($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_deleteAmistad(?,?)");
		$sentencia -> bind_param('ii', $uId, $_SESSION['userId']);
		//Si la sentencia se ejecuta correctamente, redireccionamos directamente al perfil del usuario.
		if($sentencia -> execute()){
			perfil_usuario($conexion,$uId);
		}
		
		//En caso contrario mostramos un mensaje de error.
		else{
			echo "
						<div class='contenedor mid top box error'>
							<h2>ERROR</h2>
							<p>
								Ha ocurrido un error inesperado en la base de datos,
								<br/>lamentamos las molestias.
								<br/><a href='buzon.php' class='enfasis'>Volver al buzon</a>
							</p>
						</div>
					";
		}
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función para enviar un mensaje a un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos. 
	 * @param $destinatario integer unsigned - Id del usuario al que se envia el mensaje.
	 * @param $topic String - Asunto del mensaje.
	 * @param $content String - Contenido del mensaje.
	 */
	function enviarMensaje($conexion,$destinatario,$topic,$content){
		$sentencia = $conexion -> prepare("CALL proceso_newMsg(?,?,?,?)");
		$sentencia -> bind_param('iiss', $_SESSION['userId'], $destinatario, $topic, $content);
		$sentencia -> execute();
		$sentencia -> close();
	}
?>