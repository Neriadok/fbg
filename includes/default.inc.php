<?php
	include_once 'users.inc.php';
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera la cabecera de la página.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function copa($conexion){
		echo "
			<div id='cristalLog'>
		";
		cristal_log($conexion);
		echo "
			</div>
			<a href='portal.php' id='desplegable1I' class='desplegable'>
				<img src='src/icono1.png'/>PORTAL
			</a>
			<a href='foros.php' id='desplegable2I' class='desplegable'>
				<img src='src/icono1.png'/>FOROS
			</a>
			<a href='buzon.php' id='desplegable3I' class='desplegable'>
				<img src='src/icono1.png'/>BUZÓN
			</a>
			<a href='listas.php' id='desplegable1D' class='desplegable'>
				LISTAS E.<img src='src/icono1.png'/>
			</a>
			<a href='partidas.php' id='desplegable2D' class='desplegable'>
				PARTIDAS<img src='src/icono1.png'/>
			</a>
			<a href='ranking.php' id='desplegable3D' class='desplegable'>
				RANKING<img src='src/icono1.png'/>
			</a>
		";
	}

	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra el avatar del usuario logueado o en su defecto una imagen predefinida.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function cristal_log($conexion){
		if (login_check($conexion)) {
			$sentencia = $conexion -> prepare("CALL proceso_getAvatar(?)");
			$sentencia -> bind_param('i', $_SESSION['userId']);
			if($sentencia -> execute()){
				$sentencia -> store_result();
				$sentencia -> bind_result($avatar);
				$sentencia -> fetch();
				if($avatar != null){
					echo "<a href='perfil.php'><img id='avatar' src='$avatar'/></a>";
				}
				else{
					echo "<a href='perfil.php'><img id='avatar' src='src/avatares/default.jpg'/></a>";
				}
			}
			else{
				echo "<a href='perfil.php'><img id='avatar' src='src/avatares/default.jpg'/></a>";
			}
			$sentencia -> close();
			
			
		}
		else {
			echo "<img id='avatar' src='src/rayo.gif'/>";
		}
	}
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera el contenido de cualquier página en caso de que no estemos logueados.
	 *
	 * Los contenidos de la web se cargan de forma dinámica en servidor
	 * en función de la base de datos
	 * así como los datos recibidos en el método POST.
	 */
	function defaultContent(){
		$urle=esc_url($_SERVER['PHP_SELF']);
		$msgL = "";
		 
		if (isset($_GET['error'])) {
			switch($_GET['error']){
				case 0: $msgL = 'ALERTA'; break;
				case 1: $msgL = 'ERROR: El nickname o la password se malinterpretaron.'; break;
				case 2: $msgL = 'ERROR: Login fallido.'; break;
				case 3: $msgL = 'ERROR: Configuración erronea de las cookies.'; break;
				case 4: $msgL = 'ADVERTENCIA: Cuenta bloqueada.'; break;
				default: $msgL = 'ERROR NO IDENTIFICADO.';
			}
		}
	
		echo "
			<div id='registro' class='contenedor hleft column'>
				<form action='$urle' method='post' id='regForm'>
					<fieldset>
						<legend>Registrarse:</legend>
						<p id='msgR'></p>
						<p class='subtitle'>
							Rellena todos los campos por favor.
							<br/>
							Las contraseñas han de tener al menos 6 carácteres e incluir mayúsculas, minúsculas y números.
						</p>
						<table>
							<tr>
								<td><label for='regnickname'>Nickname: </label></td>
								<td><input type='text' name='nickname' id='regnickname'/></td>
							</tr>
							<tr>
								<td><label for='mail'>Email:</label></td>
								<td><input type='mail' name='mail' id='mail'/></td>
							</tr>
							<tr>
								<td><label for='regpassword'>Contraseña: </label></td>
								<td><input type='password' name='password' id='regpassword'/></td>
							</tr>
							<tr>
								<td><label for='confirmpwd'>Confirmar contraseña:</label></td>
								<td><input type='password' name='confirmpwd' id='confirmpwd'/></td>
							</tr>
							<tr>
								<td></td>
								<td>
									<div class='submit' id='registrar'>Registrar</div>
								</td>
							</tr>
						</table>
					</fieldset>
				</form>
			</div>
			<div id='logueo' class='contenedor hright column'>
				<form action='login.php' method='post' name='login_form' id='logForm'>
					<fieldset>
						<legend>Loguearse:</legend>
						<p>$msgL</p>
						<table>
							<tr>
								<td><label for='lognickname'>Nickname: </label></td>
								<td><input type='text' name='nickname' id='lognickname'/></td>
							</tr>
							<tr>
								<td><label for='logpassword'>Contraseña: </label></td>
								<td><input type='password' name='password' id='logpassword'/></td>
							</tr>
							<tr>
								<td></td>
								<td>
									<div class='submit' id='loguear'>Login</div>
								</td>
							</tr>
						</table>
					</fieldset>
				</form>
			</div>
		";
	}


	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra el contenido de la raiz de la página
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function footContent($conexion){
		if (login_check($conexion)) {
			echo "<td><a href='includes/logout.php'>Desconectarse</a></td>";

			if($_SESSION['tipoUser']>2){
				echo "<td><a href='admin.php'>Panel de Administración</a></td>";
			}
		}
		
		echo "<td><a href='faq.php'>Preguntas Frecuentes</a></td>";
	}


	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que, al intentar acceder a una sección en la que el usuario no tiene permisos,
	 * le añade dos faltas, teniendo en cuenta que a la tercera el usuario es baneado.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function acceso_prohibido($conexion,$usuario){
		echo "
			<div class='contenedor mid column error'>
				<h1>ACCESO NO PERMITIDO</h1>
				<p>
					Le informamos que al haber intentado acceder a esta sección sin disponer de los permisos necesarios se procederá a avisar al administrador.
					<br/>
					<br/>
					Puede intentar comunicarse con el para evitar o aligerar la sentencia.
					<br/>
					<br/>
					Esta puede ir desde una penalización por faltas hasta al baneo del usuario.
					<br/>
					<br/>
					<br/>
					<br/>
					<div>
						<a href='portal.php'>Volver al Portal</a>
					</div>
				</p>
		";
		//Añadimos dos faltas al usuario.
		addFaltaUser($conexion,$uId);
		addFaltaUser($conexion,$uId);
	}
?>