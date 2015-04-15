<?php
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra en una tabla datos y estadisticas de un usuario.
	 * 
	 * @param $uid integer unsigned - Id del usuario.
	 * @param $unickname String - Nick por el que se reconoce al usuario. 
	 * @param $avatar String - url de la imagen usada como avatar por el usuario. 
	 * @param $mail String - email del usuario. 
	 * @param $utipo integer - Rango de usuario (Admin 3, Mod 2, User 1, Banned 0)  
	 * @param $urenombre integer - Puntuacion en el ranking del usuario.
	 * @param $uregdate Date - Fecha de registro del usuario.
	 * @param $ubandate Date - Fecha de banneo del usuario.
	 * @param $ufaltas  integer - Faltas acumuladar por el usuario.
	 * @param $ufirma String - Texto empleado por el usuario en los foros. 
	 * @param $umensajes integer - Número de mensajes posteados por el usuario. 
	 * @param $utemas integer - Número de temas publicados por el usuario.
	 * @param $ugrito String - Texto empleado por el usuario en las partidas. 
	 * @param $upartidas integer - Número de partidas jugadas por el usuario.
	 * @param $uvictorias integer - Numero de victorias obtenidas por el usuario.
	 */
	function datosUser(
			$uid
			,$unickname
			,$avatar
			,$mail
			,$utipo
			,$urenombre
			,$uregdate
			,$ubandate
			,$ufaltas
			,$ufirma
			,$umensajes
			,$utemas
			,$ugrito
			,$upartidas
			,$uvictorias
		){
		echo "
			<table class='tablaDatos'>
				<tr>
					<td colspan='8' class='alignCenter'>
		";
		
		//Si no hay avatar mostramos el avatar por defecto.
		if($avatar != null){
			echo "<img class='avatarUser' src='$avatar'/>";
		}
		else{
			echo "<img class='avatarUser' src='src/avatares/default.jpg'/>";
		}
		
		echo "
					</td>
				</tr>
				<tr>
					<td colspan='8' class='perfilCell alignCenter
		";
		
		//Los colores cambian en función del tipo de usuario.
		switch($utipo){
			case 0: echo " uBanned"; break;
			case 1: echo " uSimple"; break;
			case 2: echo " uModerador"; break;
			case 3: echo " uAdmin"; break;
		}
		
		//Mostramos el nick del usuario.
		echo "
			'>$unickname
		";
		
		//Mostramos el tipo de usuario.
		switch($utipo){
			case 0: echo " Baneado"; break;
			case 1: echo " Usuario"; break;
			case 2: echo " Moderador"; break;
			case 3: echo " Administrador"; break;
		}
		
		//A continuacion mostramos datos y estadisticas.
		echo "
					</td>
				</tr>
				<tr>
					<td colspan='2' class='alignRight tdCabecera'>Renombre:</td>
					<td colspan='6' class='alignLeft tdSimple'>$urenombre</td>
				</tr>
				<tr>
					<td colspan='2' class='alignRight tdCabecera'>Fecha Alta:</td>
					<td colspan='2' class='alignLeft tdSimple'>$uregdate</td>
					<td colspan='2' class='alignRight tdCabecera'>Fecha Baja:</td>
					<td colspan='2' class='alignLeft tdSimple'>$ubandate</td>
				</tr>
				<tr>
					<td colspan='4' class='alignCenter tdCabecera'>Foros</td>
					<td colspan='4' class='alignCenter tdCabecera'>Partidas</td>
				</tr>
				<tr>
					<td colspan='4' class='alignCenter tdSimple'>$ufirma</td>
					<td colspan='4' class='alignCenter tdSimple'>$ugrito</td>
				</tr>
				<tr>
					<td colspan='2' class='alignRight tdCabecera'>Mensajes:</td>
					<td colspan='2' class='alignLeft tdSimple'>$umensajes</td>
					<td class='alignRight tdCabecera'>Partidas:</td>
					<td colspan='3' class='alignLeft tdSimple'>$upartidas</td>
				</tr>
				<tr>
					<td colspan='2' class='alignRight tdCabecera'>Temas:</td>
					<td colspan='2' class='alignLeft tdSimple'>$utemas</td>
					<td class='alignRight tdCabecera'>Victorias:</td>
					<td class='alignLeft tdSimple'>$uvictorias</td>
					<td class='alignRight tdCabecera'>Derrotas:</td>
					<td class='alignLeft tdSimple'>".($upartidas-$uvictorias)."</td>
				</tr>
			</table>	
		";
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra en una tabla datos básicos del usuario.
	 *
	 * @param $uId integer unsigned - Id del usuario.
	 * @param $avatar String - url de la imagen usada como avatar por el usuario. 
	 * @param $tipoUser integer - Rango de usuario (Admin 3, Mod 2, User 1, Banned 0) 
	 * @param $nickname String - Nick por el que se reconoce al usuario.
	 * @param $fechaRegistro Date - Fecha de registro del usuario.
	 * @param $ufechaBaja Date - Fecha de banneo del usuario.
	 * @param $nacionalidad String - Pais de procedencia del usuario.
	 * @param $edad integer unsigned - Edad del usuario.
	 * @param $mail String - email del usuario. 
	 */
	function datosPerfil(
			$conexion
			,$uId
			,$avatar
			,$tipoUser
			,$nickname
			,$fechaRegistro
			,$fechaBaja
			,$nombre
			,$nacionalidad
			,$edad
			,$mail
		){
		echo "
			<table>
				<tr>
					<td colspan='2' class='alignCenter'>
		";
		
		//Si no hay avatar mostramos el avatar por defecto.
		if($avatar != null){
			echo "<img class='avatarUser' src='$avatar'/>";
		}
		else{
			echo "<img class='avatarUser' src='src/avatares/default.jpg'/>";
		}
	
		echo "
				</td>
			</tr>
			<tr>
				<td class='perfilCell alignRight
		";
		
		//Los colores cambian en función del tipo de usuario.
		switch($tipoUser){
			case 0: echo " uBanned"; break;
			case 1: echo " uSimple"; break;
			case 2: echo " uModerador"; break;
			case 3: echo " uAdmin"; break;
		}
		
		//Mostramos el nick del usuario
		echo "
			'>$nickname</td>
			<td class='perfilCell alignLeft
		";
		
		//Mostramos el tipo de usuario.
		switch($tipoUser){
			case 0: echo " uBanned'>Baneado"; break;
			case 1: echo " uSimple'>Usuario"; break;
			case 2: echo " uModerador'>Moderador"; break;
			case 3: echo " uAdmin'>Administrador"; break;
		}

		//A continuación mostramos todos los datos del usuario.
		echo "
				</td>
			</tr>
			<tr class='alignLeft'>
				<td class='perfilCell' colspan='2'>Usuario desde el " . date("d/m/Y",$fechaRegistro) . "
		";

		//Si hubiese fecha de baja, la mostramos.
		if($fechaBaja != null){
			echo "hasta el " . date("d/m/Y",$fechaBaja);
		}

		echo "
				</td>
			</tr>
		";
		
		//Algunos datos solo pueden ser vistos si el usuario logueado es amigo, moderador, administrador o el propio usuario.
		if($_SESSION['tipoUser']>1 || $_SESSION['userId'] == $uId || sonAmigos($conexion,  $_SESSION['userId'], $uId)){
			if($nombre != null){
				echo"
					<tr class='alignLeft'>
						<td class='perfilCell '>Nombre:</td>
						<td class='perfilCell'>$nombre</td>
					</tr>
				";
			}
			if($edad != null){
				echo "
					<tr class='alignLeft'>
						<td class='perfilCell'>Edad:</td>
						<td class='perfilCell'>$edad años</td>
					</tr>
				";
			}
			if($nacionalidad != null){
				echo "
					<tr class='alignLeft'>
						<td class='perfilCell'>Nacionalidad:</td>
						<td class='perfilCell'>$nacionalidad</td>
					</tr>
				";
			}
			echo "
				<tr class='alignLeft'>
					<td colspan='2' class='perfilCell'>$mail</td>
				</tr>
			";
		}
	
		echo"
			</table>
		";
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra las opciones que podemos seleccionar para un usuario.
	 * 
	 * @param $uid integer unsigned - Id del usuario.
	 * @param $unickname String - Nick por el que se reconoce al usuario.
	 * @param $utipo integer - Rango de usuario (Admin 3, Mod 2, User 1, Banned 0) 
	 */
	function userOptions($uid,$unickname,$utipo){
		if(!($_SESSION['userId'] == $uid)){
			//Si no son sus opciones, el usuario vera las opciones de desafiar y de enviar un mensaje
			echo "
				<div id='opDes".$uid."Boton' class='botonVentana'><img src='src/botones/desafiar.png'/></div>
				<div id='opDes".$uid."' class='ventana oculto'>
					<h2 id='opDes".$uid."Selector' class='ventanaSelector'>Desafiar a $unickname</h2>
					<div class='ventanaContent'>
						<form id='desafiarU".$uid."Form'>
							<table>
								<tr>
									<td class='alignLeft'>Puntos máximos:</td>
									<td>
										<select name='puntos'>
											<option value='500'>500</option>
											<option value='1000'>1000</option>
											<option value='1500'>1500</option>
											<option value='2000'>2000</option>
											<option value='2500'>2500</option>
											<option value='3000'>3000</option>
										</select>
									</td>
								</tr>
								<tr>
									<td class='' colspan='2'>
										<div class='desafiarUser submit' id='desafiarU".$uid."'>
											<img src='src/botones/desafiar.png'/>
											<input name='desafiarUser' value='$uid'/>
										</div>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
				
				<div id='opMsg".$uid."Boton' class='botonVentana'><img src='src/botones/msg.png'/></div>
				<div id='opMsg".$uid."' class='ventana oculto'>
					<h2 id='opMsg".$uid."Selector' class='ventanaSelector'>Mensaje para $unickname</h2>
					<div class='ventanaContent'>
						<form class='msgUserForm' id='msgU".$uid."Form'>
							<table>
								<tr>
									<td class='alignLeft'>Tema:</td>
									<td><input id='msgU".$uid."topic' type='text' value='Sin Asunto'/></td>
								</tr>
								<tr>
									<td class='alignLeft' colspan='2'>Contenido:</td>
								</tr>
								<tr>
									<td colspan='2'>
										<textarea id='msgU".$uid."content'></textarea>
									</td>
								</tr>
								<tr>
									<td class='' colspan='2'>
										<div class='msgUser submit' id='msgU$uid'>
											<img src='src/botones/msg.png'/>
										</div>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			";
		
			//Los moderadores podrán añadir faltas al usuario.
			//Para realizar este tipo de acciones se ha de tener mas rango que el usuario en cuestion.
			//No se pueden realizar estas acciones a usuarios baneados.
			if($_SESSION['tipoUser'] > 1 && $_SESSION['tipoUser'] > $utipo && $utipo > 0){
				//Faltas
				echo "
					<form class='submit faltaUser' id='faltaU$uid'>
						<img src='src/botones/falta.png'/>
						<input type='hidden' name='addFaltaUser' value='$uid'/>
					</form>
				";
				
			}
			
			//Los administradores podrán banear a los usuarios.
			//Para realizar este tipo de acciones se ha de tener mas rango que el usuario en cuestion.
			//No se pueden realizar estas acciones a usuarios baneados.
			if($_SESSION['tipoUser'] > 2 && $_SESSION['tipoUser'] > $utipo && $utipo > 0){
				//Baneos
				echo "
					<form class='submit banUser' id='banU$uid'>
						<img src='src/botones/ban.png'/>
						<input type='hidden' name='banUser' value='$uid'/>
					</form>
				";
			}
		}
		
		//Los administradores y el propio usuario podrán eliminar la cuenta.
		//Para realizar este tipo de acciones se ha de tener mas rango que el usuario en cuestion.
		if(($_SESSION['tipoUser'] > 2 && $_SESSION['tipoUser'] > $utipo) || $_SESSION['userId'] == $uid){
			echo "
				<div id='opEliminar".$uid."Boton' class='botonVentana'><img src='src/botones/eliminar.png'/></div>
				<div id='opEliminar".$uid."' class='ventana oculto'>
					<h2 id='opEliminar".$uid."Selector' class='ventanaSelector'>Eliminar $unickname</h2>
					<div class='ventanaContent error'>
						<p>¿Estas seguro de querer Eliminar a $unickname ?</p>
						<form class='submit eliminarUser' id='eliminarU$uid'>
							<img src='src/botones/eliminar.png'/>
							<input type='hidden' name='delUser' value='$uid'/>
						</form>
					</div>
				</div>
			";
		}
	}
	
	
	
	/**
	 * FUNCIÓN DE ESTRUCTURA Y CONTENIDO
	 * Función que muestra el perfil de un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function perfil_usuario($conexion,$uId){
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
				$sentencia -> close();
				echo "
					<div class='contenedor left column'>
				";
				
				datosPerfil($conexion,$uId,$avatar,$tipoUser,$nickname,$fechaRegistro,$fechaBaja,$nombre,$nacionalidad,$edad,$mail);
				echo "
					</div>
				";
				

				$sentencia = $conexion -> prepare("CALL proceso_datosUser(?)");
				$sentencia -> bind_param('i', $uId);
				if($sentencia -> execute()){
					$sentencia -> store_result();
					$sentencia -> bind_result(
							$uId
							,$unickname
							,$avatar
							,$mail
							,$utipo
							,$urenombre
							,$uregdate
							,$ubandate
							,$ufaltas
							,$ufirma
							,$umensajes
							,$utemas
							,$ugrito
							,$upartidas
							,$uvictorias
					);
					$sentencia -> fetch();
				
					echo "
						<div class='contenedor mid top box'>
							<table>
								<tr>
									<td class='enfasis'>Estadísticas Foros</td>
					";
					if($firma != null){
						echo "
							<td class='alignRight firma' colspan='3'>$ufirma</td>
						";
					}
					else{
						echo "
							<td></td>
						";
					}
					echo "
								</tr>
								<tr>
									<td class='alignRight esTDistica'>Temas:</td>
									<td class='alignLeft esTDistica enfasis'>$utemas</td>
									<td class='alignRight esTDistica'>Mensajes:</td>
									<td class='alignLeft esTDistica enfasis'>$umensajes</td>
								</tr>
							</table>
						</div>
						<div class='contenedor mid bot box'>
							<table>
								<tr>
									<td class='enfasis'>Estadísticas partidas</td>
					";
					if($grito != null){
						echo "
									<td class='alignRight grito' colspan='3'>$grito</td>
						";
					}
					else{
						echo "
									<td colspan='3'></td>
						";
					}
					echo "
								</tr>
								<tr>
									<td class='alignRight esTDistica'>Renombre:</td>
									<td class='alignLeft esTDistica enfasis'>$urenombre</td>
									<td class='alignRight esTDistica'>Partidas:</td>
									<td class='alignLeft esTDistica enfasis'>$upartidas</td>
								</tr>
								<tr>
									<td class='alignRight esTDistica'>Victorias:</td>
									<td class='alignLeft esTDistica enfasis'>$uvictorias</td>
									<td class='alignRight esTDistica'>Derrotas:</td>
									<td class='alignLeft esTDistica enfasis'>".($upartidas-$uvictorias)."</td>
								</tr>
							</table>
						</div>
					";
				}
				$sentencia -> close();
				
				
				echo "
					<div class='contenedor right column'>
						<div class='userOptions botonsBar' id='userOptions$uId'>
				";
				if($uId == $_SESSION['userId']){
					echo "
						<form id='editPerfil' class='boton'>
							<img src='src/botones/editar.png'/>
						</form>
					";
				}
				userOptions($uId,$nickname,$utipo);
				userAmistadOptions($conexion,$uId);
				echo "
						</div>
					</div>
				";
			}
			else{
				echo "<div class='contenedor mid top box error'>USUARIO NO ENCONTRADO</div>";
			}
		}
		else{
			echo "<div class='contenedor mid top box error'>LA BASE DE DATOS NO PUDO BUSCAR AL USUARIO</div>";
		}
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función que comprueba si dos usuarios son amigos.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $u1 integer unsigned - Id del primer usuario.
	 * @param $u1 integer unsigned - Id del segundo usuario.
	 * @return boolean - Devolverá true solo si son amigos. En caso de error devolverá false. Esto ultimo es sobretodo por temas de depuración.
	 */
	function sonAmigos($conexion, $u1, $u2){
		$sentencia = $conexion -> prepare("CALL proceso_amistad(?,?)");
		$sentencia -> bind_param('ii', $u1, $u2);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			if($sentencia -> num_rows > 0){
				$sentencia -> close();
				return true;
			}
			else{
				$sentencia -> close();
				return false;
			}
		}
		else{
			$sentencia -> close();
			return false;			
		}
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra la opción de pedir o finalizar amistad con un usuario distinto del logueado.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function userAmistadOptions($conexion,$uId){
		if($uId != $_SESSION['userId']){
			if(sonAmigos($conexion,$uId,$_SESSION['userId'])){
				echo "
					<form id='delmigo' class='submit'>
						<img src='src/botones/delmigo.png'/>
						<input type='hidden' name='delmigoUser' value='$uId'/>
					</form>
				";
			}
			else{
				echo "
					<form id='addmigo' class='submit'>
						<img src='src/botones/addmigo.png'/>
						<input type='hidden' name='addmigoUser' value='$uId'/>
					</form>
				";
			}
		}
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra el formulario para editar nuestro propio perfil.
	 * IMPORTANTE: Este formulario no usa JSON, se envía mediante método POST y FILE.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function perfil_editar($conexion,$uId){
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
				echo "
					<div class='contenedor left column'>
				";

				$sentencia -> close();
				
				datosPerfil($conexion,$uId,$avatar,$tipoUser,$nickname,$fechaRegistro,$fechaBaja,$nombre,$nacionalidad,$edad,$mail);
					
				echo "
					</div>
					<div class='contenedor mid column'>
					<h1>Datos Perfil</h1>
						<div class='botonsBar'>
							<div class='boton' id='datosPerfilBegin'><img src='src/botones/arriba.png'/></div>
							<div class='boton' id='datosPerfilEnd'><img src='src/botones/abajo.png'/></div>
							<div id='guardarBoton' class='botonVentana'><img src='src/botones/guardar.png'/></div>
							<div id='guardar' class='ventana oculto'>
								<h2 id='guardarSelector' class='ventanaSelector'>Guardar Cambios en el perfil</h2>
								<div class='ventanaContent'>
									<p>¿Estas seguro de querer guardar los cambios?</p>
									<div class='submit' id='saveChanges'><img src='src/botones/guardar.png'/></div>
								</div>
							</div>
							<form class='boton' id='volver' action='$urle' method='POST'><img src='src/botones/volver.png'/></form>
						</div>
						<form method='POST' action='perfil.php' id='datosPerfil' class='scrollingBox' enctype='multipart/form-data'>
							<div id='datosPerfilContent' class='scrollingBoxContent'>
								<fieldset>
									<legend>Datos Básicos:</legend>
									<table>
										<tr>
											<td><label for='newMail'>Email:</label></td>
											<td>
												<input id='newMail' type='text' name='newMail' value='$mail'/>
											</td>
										</tr>
										<tr>
											<td><label for='newPass'>Contraseña:</label></td>
											<td>
												<input id='newPass' type='password' name='newPass' value=''/>
											</td>
										</tr>
										<tr>
											<td><label for='newPassConf'>Confirmar contraseña:</label></td>
											<td>
												<input id='newPassConf' type='password' name='newPassConf' value=''/>
											</td>
										</tr>
									</table>
								</fieldset>
								<fieldset>
									<legend>Datos Públicos:</legend>
									Son de dominio público, todos los usuarios de la web pueden verlos.
									<table>
										<tr>
											<td>Avatar</td>
											<td class='subtitle'>Se recomienda 150x150 JPG y máximo 10kb</td>
										</tr>
										<tr>
											<td><label for='avatarUrl'>Desde url:</label></td>
											<td><label for='avatarFile'>Desde archivo:</label></td>
										</tr>
										<tr>
											<td>
												<input id='avatarUrl' type='text' name='avatarUrl'/>
											</td>
											<td>
												<input id='avatarFile' type='file' name='avatarFile' accept='image/jpg,image/jpeg'/>
											</td>
										</tr>
										<tr>
											<td><label for='firma'>Firma:</label></td>
											<td>
												<input id='firma' type='text' name='firma'/>
											</td>
										</tr>
										<tr>
											<td><label for='grito'>Grito:</label></td>
											<td>
												<input id='grito' type='text' name='grito'/>
											</td>
										</tr>
									</table>
								</fieldset>
								<fieldset>
									<legend>Datos Privados:</legend>
									Solo pueden ser vistos por administradores, moderadores y aquellos usuarios que estén en tu lista de amigos.
									<table>
										<tr>
											<td><label for='newName'>Nombre:</label></td>
											<td>
												<input id='newName' type='text' name='newName'/>
											</td>
										</tr>
										<tr>
											<td><label for='age'>Edad:</label></td>
											<td>
												<select id='age' name='age'>
													<option value=''>Sin especificar</option>
				";
				for($i=14;$i<=60;$i++){
					echo "<option value='".$i."'>".$i." años</option>";
				}
				echo "
													<option value='61'>Más de 60 años</option>
												</select>
											</td>
										</tr>
										<tr>
											<td><label for='nacion'>Nacionalidad:</label></td>
											<td>
												<select id='nacion' name='nacion'>
													<option value=''>Sin especificar</option>
													<option value='españa'>Españ@l</option>
												</select>
											</td>
										</tr>
									</table>
								</fieldset>
							</div>
						</form>
						<div id='datosPerfilMoving' class='scrollingBoxMoving'>
							<div id='datosPerfilMovingUp' class='scrollingBoxMovingUp'></div>
							<div id='datosPerfilMovingBar' class='scrollingBoxMovingBar'></div>
							<div id='datosPerfilMovingDown' class='scrollingBoxMovingDown'></div>
						</div>
					</div>
					<div class='contenedor right column'>
						Puedes dejar los campos en blanco si no quieres modificarlos.<br/><br/>
						Errores:
						<div id='errores' class='scrollingBox'>
							<div id='erroresContent' class='scrollingBoxContent enfasis'>
								<div id='mensaje'></div>
							</div>
						</div>
						<div id='erroresMoving' class='scrollingBoxMoving'>
							<div id='erroresMovingUp' class='scrollingBoxMovingUp'></div>
							<div id='erroresMovingBar' class='scrollingBoxMovingBar'></div>
							<div id='erroresMovingDown' class='scrollingBoxMovingDown'></div>
						</div>
					</div>
				";
			}
			else{
				$sentencia -> close();
			}
		}
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función para eliminar un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function delUser($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_deleteUser(?)");
		$sentencia -> bind_param('i', $uId);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función para añadir faltas a un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function addFaltaUser($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_addFalta(?)");
		$sentencia -> bind_param('i', $uId);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DEEJECUCIÓN SETTER
	 * Función para banear un usuario.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $uId integer unsigned - Id del usuario.
	 */
	function banUser($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_banUser(?)");
		$sentencia -> bind_param('i', $uId);
		$sentencia -> execute();
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra los cambios efectuados en un perfil de usuario.
	 * No necesitamos pasarle como parámetro el Id del usuario puesto que empleamos el Id guardado en SESSION.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function modificarPerfil($conexion){
		//DATOS ACTUALIZADOS DE FORMA INDEPENDIENTE
		
		//mail
		if(preg_match("/[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/",$_POST['newMail'])){
			$mail = $_POST['newMail'];
			//Actualizamos el mail
			$sentencia = $conexion -> prepare("CALL proceso_updateMail(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$mail);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		
		//password
		if(isset($_POST['np'])){
			/** Validamos la password */
			$newPassword = filter_input(INPUT_POST, 'np', FILTER_SANITIZE_STRING);
			if (strlen($newPassword) == 128) {
				//Actualizamos la password
				$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
				$password = hash('sha512', $newPassword . $random_salt);
				
				$sentencia = $conexion -> prepare("CALL proceso_updatePassword(?,?,?)");
				$sentencia -> bind_param('iss',$_SESSION['userId'],$password,$random_salt);
				
				//Si la contraseña se cambia correctamente, modificamos el session login script
				if($sentencia -> execute()){
					$user_browser = $_SERVER['HTTP_USER_AGENT'];
					$esl = hash('sha512', $password . $user_browser);
					$_SESSION['login_string'] = $esl;
				}
				$sentencia -> close();
			}
		}
		
		
		//avatar
		$avatar = null;
		$ruta = 'src/avatares/';
		if(preg_match("/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/",$_POST['avatarUrl'])){
			$avatar = $_POST['avatarUrl'];
		}
		else if(isset($_FILES['avatarFile']['name'])){
			if($_FILES['avatarFile']['size'] < 15000){
				// RutaRelativa/UsuarioId_fecha_avatar.extension
				$fileSRC = $ruta . $_SESSION['userId'] . "_" . date("Y.m.d.H.i.s.u") . "_avatar." . fileExtension($_FILES['avatarFile']['name']);
				
				if (move_uploaded_file($_FILES['avatarFile']['tmp_name'], $fileSRC)) {
					//Subimos el archivo
					$avatar = $fileSRC;
				}
			}
		}
		
		//Si hay un avatar, se establece la nueva ruta.
		if($avatar != null){
			//Actualizamos el avatar
			$sentencia = $conexion -> prepare("CALL proceso_updateAvatar(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$avatar);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		//Nombre
		$nom = $_POST['newName'];
		if(preg_match("/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+/",$nom) && strlen($nom) != 0){
			//Actualizamos el nombre
			$sentencia = $conexion -> prepare("CALL proceso_updateNombre(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$nom);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		//Edad
		$age = $_POST['age'];
		if(preg_match("/[0-9]+/",$age) && strlen($age) != 0){
			//Actualizamos 
			$sentencia = $conexion -> prepare("CALL proceso_updateAge(?,?)");
			$sentencia -> bind_param('ii',$_SESSION['userId'],$age);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		//Nacionalidad
		$nacion = $_POST['nacion'];
		if(preg_match("/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+/",$nacion) && strlen($nacion) != 0){
			//Actualizamos 
			$sentencia = $conexion -> prepare("CALL proceso_updateNacion(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$nacion);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		//Firma
		$firma = $_POST['firma'];
		if(preg_match("/[a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ¡!¿?\"' \-]+/",$firma) && strlen($firma) != 0){
			//Actualizamos 
			$sentencia = $conexion -> prepare("CALL proceso_updateFirma(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$firma);
			$sentencia -> execute();
			$sentencia -> close();
		}
		
		//Grito
		$grito = $_POST['grito'];
		if(preg_match("/[a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ¡!¿?\"' \-]+/",$grito) && strlen($grito) != 0){
			//Actualizamos 
			$sentencia = $conexion -> prepare("CALL proceso_updateGrito(?,?)");
			$sentencia -> bind_param('is',$_SESSION['userId'],$grito);
			$sentencia -> execute();
			$sentencia -> close();
		}
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra los amigos del usuario logueado. De forma opcional se pueden mostrar solo aquellos que esten conectados.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $logged boolean - Si tiene valor true se buscaran solo aquellos que esten conectados.
	 */
	function amigos($conexion,$logged){
		echo "
			<p class='enfasis'>Amigos
		";
		
		if($logged){
			echo "Conectados";
		}
		
		echo "
			<div id='amigos' class='scrollingBox'>
				<table id='amigosContent' class='scrollingBoxContent'>
		";
		$sentencia = $conexion -> prepare("CALL proceso_amigos(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result(
				$usuarioId
				,$amigoId
				,$amigoNick
				,$amigoRenombre
				,$amigoAvatar
				,$online
			);
			while($sentencia -> fetch()){
				if(!$logged || ($logged && $online)){
					echo "
						<tr class='alignRight
					";
					echo "
						'>
							<td>
					";
					if($amigoAvatar != null){
						echo "
							<img class='microAvatar
						";
						if($online){
							echo " borde";
						}
						echo "
							' src='$amigoAvatar'/></a>
						";
					}
					else{
						echo "<img class='microAvatar
						";
						if($online){
							echo " borde";
						}
						echo "
							' src='src/avatares/default.jpg'/></a>";
					}
					echo "
							</td>
							<td class='alignLeft enfasis'>$amigoNick</td>
							<td>Renombre:</td>
							<td class='alignLeft'>$amigoRenombre</td>
						</tr>
					";
				}
			}
		}
		$sentencia -> close();
		echo "
				</table>
			</div>
			<div id='amigosMoving' class='scrollingBoxMoving'>
				<div id='amigosMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='amigosMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='amigosMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
			
		";
	}
?>