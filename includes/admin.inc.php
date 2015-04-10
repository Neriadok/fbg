<?php
	include_once "users.inc.php";

	
	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Esta función solo genera una estructura de dos columnas.
	 * El contenido de dichas columnas se genera con otras funciones contenidas entre los divs.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function admin($conexion){
		echo "<div id='forosBox' class='contenedor hleft column'>";
		admin_foros($conexion);
		echo "</div>";
		echo "<div id='usersBox' class='contenedor hright column'>";
		admin_users($conexion);
		echo "</div>";
	}

	
	/**
	 * FUNCIÓN DE EJECCUCIÓN SETTER Y ESTRUCTURA
	 * Función que genera el contenido de la página de administración
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function admin_actualizarContenido($conexion){

		$datos = json_decode(file_get_contents('php://input'),true);

		if(isset($datos['cambios'])){
			if($datos['cambios'] == 'users'){
				cambios_users($conexion,$datos);
				admin_users($conexion);
			}
			
			if($datos['cambios'] == 'foros'){
				cambios_foros($conexion,$datos);
				admin_foros($conexion);
			}
		}
		
		else if(isset($datos['userAEliminar'])){
			$uid = preg_replace("/[^0-9]+/", "", $datos['userAEliminar']);
			delUser($conexion, $uid);
			admin_users($conexion);
		}
		
		else if(isset($datos['catAEliminar'])){
			$cid =  preg_replace("/[^0-9]+/", "", $datos['catAEliminar']);
			$sentencia = $conexion -> prepare("CALL proceso_deleteCat(?)");
			$sentencia -> bind_param('i', $cid);
			$sentencia -> execute();
			$sentencia -> close();
			admin_foros($conexion);
		}
		
		else if(isset($datos['foroAEliminar'])){
			$fid =  preg_replace("/[^0-9]+/", "", $datos['foroAEliminar']);
			$sentencia = $conexion -> prepare("CALL proceso_deleteForo(?)");
			$sentencia -> bind_param('i', $fid);
			$sentencia -> execute();
			$sentencia -> close();
			admin_foros($conexion);
		}
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera el panel de administración de los foros y categorias.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function admin_foros($conexion){
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		echo "
			<h2>Administrar Categorias y Foros</h2>
			
			<div class='botonsBar'>
				<div class='boton' id='adminForosBegin'><img src='src/botones/arriba.png'/></div>
				<div class='boton' id='adminForosEnd'><img src='src/botones/abajo.png'/></div>
				<div class='boton' id='addCat'><img src='src/botones/add.png'/></div>
				<div class='submit' id='saveForos'><img src='src/botones/guardar.png'/></div>
			</div>
			
			<form id='adminForos' class='scrollingBox' method='POST' action='$urle'>
				<div id='adminForosContent' class='scrollingBoxContent'>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_admincategorias()");
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($categoria,$categoriaId,$permisos);
		$i=0;
		
		while($sentencia -> fetch()){
			$cat[$categoriaId] = $categoria;
			$cperm[$categoriaId] = $permisos;
		}
		
		$sentencia -> close();

		if(isset($cat)){
			foreach($cat as $cid => $category){
				echo "
					<table id='cat$cid' class='categoria'>
						<thead>
							<tr class='adminCategory'>
								<td  class='adminCol1' colspan='2'>$category</td>
								<td>Permisos:</td>
								<td  class='adminCol2'>
									<select class='permisos' name='permisos[$cid]'>
										<option value='$cperm[$cid]' selected='selected'>$cperm[$cid]</option>
										<option value='1'>1</option>
										<option value='2'>2</option>
										<option value='3'>3</option>
									</select>
								</td>
							</tr>
							<tr class='adminCategory' >
								<td  class='adminCol1' colspan='2'>
									<input class='cnombre' name='cnombre[$cid]' type='text' value='$category'/>
								</td>
								<td  class='adminCol3'>
									<div class='boton' id='addnuevosforos$cid'><img src='src/botones/add.png'/></div>
								</td>
								<td  class='adminCol4'>
									<div class='submit eliminarCat' id='eliminarC$cid'><img src='src/botones/eliminar.png'/></div>
								</td>
							</tr>
						</thead>
						<tfoot id='nuevosforos$cid' class='nuevosforos'>
						</tfoot>
						<tbody>
							<tr class='adminCategory'>
								<td  class='adminCol1' colsPan='4'>
									Foros
								</td>
							</tr>
				";
			
				$sentencia = $conexion -> prepare("CALL proceso_foros(?)");
				$sentencia -> bind_param('s', $cid);
				$sentencia -> execute();
				$sentencia -> store_result();
				$sentencia -> bind_result($fid, $foro, $fdesc);
				while($sentencia -> fetch()){
					echo "
							<tr class='adminForo'>
								<td  class='adminCol1' id='$foro' colspan='2'>
									<input class='nombreforo' name='nombreforo[$fid]' type='text' value='$foro'/>
								</td>
								<td  class='adminCol2'>
									<div id='desc".$fid."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
									<div id='desc".$fid."' class='ventana oculto'>
										<h2 id='desc".$fid."Selector' class='ventanaSelector'>Descripcion $foro</h2>
										<div class='ventanaContent'>
											<textarea name='descforo[$fid]' class='bigColumnTArea descforo' maxlength='100' cols='25' rows='5'>$fdesc</textarea>
										</div>
									</div>
								</td>
								<td  class='adminCol4'>
									<div class='submit eliminarForo' id='eliminarF$fid'><img src='src/botones/eliminar.png'/></div>
								</td>
							</tr>
						</tbody>
					";
				}
				$sentencia -> close();
				$i++;
				echo "
						</table>
				";
			}
		}
		echo "
				</div>
			</form>
			<div id='adminForosMoving' class='scrollingBoxMoving'>
				<div id='adminForosMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='adminForosMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='adminForosMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra los cambios hechos en los foros y categorias.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $datos Array - Array obtenido de un objeto JSON
	 */
	function cambios_foros($conexion,$datos){
		if(isset($datos['nuevaCat'])){
			$categorias = $datos['nuevaCat'];
			$permisos = $datos['permisosNuevaCat'];
			
			foreach($categorias as $key => $cat){
				
				$nombre = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $cat);
				$perm =  preg_replace("/[^0-9]+/", "", $permisos[$key]);

				if($nombre!=""){
					$sentencia = $conexion -> prepare("CALL proceso_newCat(?,?)");
					$sentencia -> bind_param('si', $nombre, $perm);
					$sentencia -> execute();
					$sentencia -> close();
				}
			}
		}
		
		if(isset($datos['nuevoForo'])){
			
			$foros = $datos['nuevoForo'];
			$categorias = $datos['categoriaNuevoForo'];
			foreach($foros as $key => $foro){
				$nombre = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $foro);
				$cat =  preg_replace("/[^0-9]+/", "", $categorias[$key]);

				if($nombre!=""){
					$sentencia = $conexion -> prepare("CALL proceso_newforo(?,?)");
					$sentencia -> bind_param('si', $nombre, $cat);
					$sentencia -> execute();
					$sentencia -> close();
				}
			}
		}
		
		if(isset($datos["cnombre"] , $datos["permisos"])){
			$categoria = $datos["cnombre"];
			$permisos = $datos["permisos"];
			
			foreach($categoria as $cid => $nombre){
				$sentencia = $conexion -> prepare("CALL proceso_actualizarCat(?,?,?)");
				$sentencia -> bind_param('isi', $cid, $nombre, $permisos[$cid]);
				$sentencia -> execute();
				$sentencia -> close();
			}
		}
		

		if(isset($datos['nombreforo'] , $datos['descforo'])){
			$foro = $datos['nombreforo'];
			$desc = $datos['descforo'];

			foreach($foro as $fid => $nombre){
				$sentencia = $conexion -> prepare("CALL proceso_actualizarForo(?,?,?)");
				$sentencia -> bind_param('iss', $fid, $nombre, $desc[$fid]);
				$sentencia -> execute();
				$sentencia -> close();
			}
		}
		
	}
	
	
	/**
	 * FUNCIÓN DE CONTENIDO
	 * función que genera el panel de administración de los usuarios.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function admin_users($conexion){
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		echo"
			<h2>Administrar Usuarios</h2>
			<div class='botonsBar'>
				<div class='boton' id='adminUsersBegin'><img src='src/botones/arriba.png'/></div>
				<div class='boton' id='adminUsersEnd'><img src='src/botones/abajo.png'/></div>
				<div class='submit' id='saveUsers'><img src='src/botones/guardar.png'/></div>
			</div>
			
			<table class='scrollingBoxHead'>
				<tr class='scrollingBoxHeadRow'>
					<td class='userNickname'>Nickname</td>
					<td class='userTipo'>Tipo</td>
					<td class='userFaltas'>Faltas</td>
					<td class='userDetails'>Opciones</td>
				</tr>
			</table>
			<form id='adminUsers' class='scrollingBox' method='POST' action='$urle'>
				<table id='adminUsersContent' class='scrollingBoxContent'>
		";
		
		$sentencia = $conexion -> prepare("CALL proceso_datosUsersAdmin()");
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($uid,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);//Añadir visitas y mensajes totales
		$i=0;
		
		while($sentencia -> fetch()){
			echo "<tr id='$uid' class='user ";
			
			switch($utipo){
				case 0: echo "rowbanned"; break;
				case 1: echo "rowuser"; break;
				case 2: echo "rowmod"; break;
				case 3: echo "rowadmin"; break;
				default: echo "rowuser";
			}
		
			echo "
				'>
					<td class='userNickname'>$unickname</td>
			";
			if($utipo<3)
				echo "
					<td class='userTipo'>
						<select class='tipo' name='tipo[$uid]'>
							<option value='$utipo' selected='selected'>$utipo</option>
							<option value='0'>0</option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
						</select>
					</td>
					<td class='userFaltas'>
						<select class='faltas' name='faltas[$uid]'>
							<option value='$ufaltas' selected='selected'>$ufaltas</option>
							<option value='0'>0</option>
							<option value='1'>1</option>
							<option value='2'>2</option>
							<option value='3'>3</option>
							<option value='4'>4</option>
							<option value='5'>5</option>
						</select>
					</td>
				";
			else{
				echo "
					<td class='userTipo'>
						$utipo
						<input class='tipo' name='tipo[$uid]' type='hidden' value='$utipo'/>
					</td>
					<td class='userFaltas'>
						--
						<input class='faltas' name='faltas[$uid]' type='hidden' value='0'/>
					</td>
				";
			}
			
			echo "
					<td class='userOptions'>
						<div id='detalles".$uid."Boton' class='botonVentana'><img src='src/botones/info.png'/></div>
						<div id='detalles".$uid."' class='ventana oculto'>
							<h2 id='detalles".$uid."Selector' class='ventanaSelector'>Detalles $unickname</h2>
							<div class='ventanaContent'>
			";
			datosUser($uid,$unickname,$avatar,$mail,$utipo,$urenombre,$uregdate,$ubandate,$ufaltas,$ufirma,$umensajes,$utemas,$ugrito,$upartidas,$uvictorias);
			echo"
							</div>
						</div>
						<div id='opciones".$uid."Boton' class='botonVentana'><img src='src/botones/eliminar.png'/></div>
						<div id='opciones".$uid."' class='ventana oculto'>
							<h2 id='opciones".$uid."Selector' class='ventanaSelector'>Eliminar $unickname</h2>
							<div class='ventanaContent error'>
								<p>¿Estas seguro de querer Eliminar a $unickname ?</p>
								<div class='submit eliminarUser' id='eliminarU$uid'><img src='src/botones/eliminar.png'/></div>
							</div>
						</div>
					</td>
				</tr>
			";
		}
		$sentencia -> close();
		
		echo "
				</table>
			</form>
			<div id='adminUsersMoving' class='scrollingBoxMoving'>
				<div id='adminUsersMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='adminUsersMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='adminUsersMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que registra los cambios hechos en los usuarios.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $datos Array - Array obtenido de un objeto JSON
	 */
	function cambios_users($conexion,$datos){
		
		$tipo = $datos['tipo'];
		$faltas = $datos['faltas'];

		if(isset($tipo)){
			foreach($tipo as $uid => $tipousuario){
				$sentencia = $conexion -> prepare("CALL proceso_actualizarUser(?,?,?)");
				$sentencia -> bind_param('iii', $uid, $tipousuario, $faltas[$uid]);
				$sentencia -> execute();
				$sentencia -> close();
			}
		}
	}
?>