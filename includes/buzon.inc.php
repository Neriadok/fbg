<?php

	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera la estructura del buzón.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function buzon($conexion){
		//Comprobamos la ultima visita que hizo el usuario a su buzón.
		$uv = ultimaVisita($conexion);
		
		echo "
			<div id='bandejaEntrada' class='contenedor left top column'>
				
				<p class='enfasis'>CORREO</p>
				<div id='inBox' class='scrollingBox'>
		";
		buzon_inBox($conexion,$uv);
		echo "
				</div>
				<div id='inBoxMoving' class='scrollingBoxMoving'>
					<div id='inBoxMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='inBoxMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='inBoxMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
			</div>
			
			<div id='contenido' class='contenedor big column'>";
		buzon_defaultContent($conexion);
		echo "
			</div>
		";
		
		visitarBuzon($conexion);
	}


	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera el contenido por defecto del buzón.
	 * Este contenido se muestra cuando no hay ningun mensaje seleccionado.
	 * Los cambios se gestionan en cliente.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function buzon_defaultContent($conexion){
		echo "
			<table class='leerCorreo'>
				<tr class='cabecera'>
					<td colspan='4'><h2 id='correoTitle'>Bienvenido a tu Buzón<br/>".$_SESSION['nickname']."</h2></td>
				</tr>
				<tr class='cabecera'>
					<td class='alignRight'>Remitente:</td>
					<td id='correoEmisor' class='alignLeft'></td>
					<td colspan='2' id='correoFecha' class='alignLeft'></td>
				</tr>
			</table>
			<div id='correo' class='scrollingBox'>
				<div id='correoContent' class='scrollingBoxContent'></div>
			</div>
			<div id='correoMoving' class='scrollingBoxMoving'>
				<div id='correoMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='correoMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='correoMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}


	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que obtiene los datos de los correos que ha recibido el usuario.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $uv Datetime - Fecha y hora de la ultima visita realizada al buzón.
	 * @see masNuevo Función en el archivo functions.php
	 */
	function buzon_inBox($conexion,$uv){
		$sentencia = $conexion -> prepare("CALL proceso_correoUsuario(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			echo "<table id='inBoxContent' class='scrollingBoxContent'>";
			
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$cid
					,$ctipo
					,$cfechaEmision
					,$cremitente
					,$cremitenteId
					,$ctipoCorreo
					,$ccontenidoDefecto
					,$cpts
					,$ctopic
					,$ccontenido
				);

			$i=0;
			while($sentencia -> fetch()){
				$i++;
				echo "
					<tr class='
				";
				
				//Diferenciamos las filas para mayor visibilidad
				if($i%2==0){
					echo " pairRow";
				}
				else{
					echo " inpairRow";
				}
				
				//Comprobamos los correos recibidos desde nuestra ultima visita.
				if(masNuevo($conexion,$cfechaEmision,$uv)){
					echo " new";
				}
				
				echo "
					'>
						<td id='$cid' class='correo' colspan='2'>
				";
				
				//En caso de tener asunto, lo mostramos.
				if($ctopic != null){
					echo "$ctipoCorreo: $ctopic";
				}
				else{
					echo "$ctipoCorreo";
				}
				
				echo "</td>
					</tr>
					<tr class='subtitle
				";
				
				//Detalles del correo:
				if($i%2==0){
					echo " pairRow";
				}
				else{
					echo " inpairRow";
				}
				
				echo "
					'>
						<td id='emisor$cid' class='emisorCorreo'>$cremitente</td>
						<td id='fecha$cid' class='fechaCorreo'>
							Recibido en: " . date("d/m/Y", strtotime(str_replace('-','/', $cfechaEmision))) . "<br/>
							A las: " . date("H:i:s", strtotime(str_replace('-','/', $cfechaEmision))) . "
						</td>
						<td id='emisorId$cid' class='Correo oculto'>$cremitenteId</td>
						<td id='tipo$cid' class='Correo oculto'>$ctipo</td>
						<td id='contenido$cid' class='Correo oculto'>$ccontenido</td>
						<td id='contenidoDefecto$cid' class='Correo oculto'>$ccontenidoDefecto</td>
						<td id='puntos$cid' class='Correo oculto'>$cpts</td>
					</tr>
				";
			}
			
			$sentencia -> close();
			echo "
				</table>
			";
		}
		//Si no se ejecutara la sentencia (algo improbable) mostrariamos un error.
		//Esto es principalmente por razones de depuración.
		else{
			echo "<p id='inBoxContent' class='scrollingBoxContent'>Error</p>";
		}
	}


	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que muestra una version reducida del buzón en la que no se dan opciones.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $uv Datetime - Fecha y hora de la ultima visita realizada al buzón.
	 * @see masNuevo Función en el archivo functions.php
	 */
	function buzon_portalInbox($conexion,$uv){
		$sentencia = $conexion -> prepare("CALL proceso_correoUsuario(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			echo "
				<div id='inBox' class='scrollingBox'>
					<table id='inBoxContent' class='scrollingBoxContent'>
			";
			
			$sentencia -> store_result();
			$sentencia -> bind_result(
					$cid
					,$ctipo
					,$cfechaEmision
					,$cremitente
					,$cremitenteId
					,$ctipoCorreo
					,$ccontenidoDefecto
					,$cpts
					,$ctopic
					,$ccontenido
				);

			$i=0;
			while($sentencia -> fetch()){
				$i++;
				if(masNuevo($conexion,$cfechaEmision,$uv)){
					echo "
						<tr class='
					";
					
					//Diferenciamos las filas para mayor visibilidad
					if($i%2==0){
						echo " pairRow";
					}
					else{
						echo " inpairRow";
					}
					
					//Comprobamos los correos recibidos desde nuestra ultima visita.
					
					
					echo "
						'>
						<td id='$cid' class='correo'>
					";
					
					//En caso de tener asunto, lo mostramos.
					if($ctopic != null){
						echo "$ctipoCorreo: $ctopic";
					}
					else{
						echo "$ctipoCorreo";
					}
					
					echo "
						</td>
						<td>
							<div id='contenidoCorreo".$cid."Boton' class='botonVentana'><img src='src/botones/msg.png'/></div>
							<div id='contenidoCorreo".$cid."' class='ventana oculto'>
								<h2 id='contenidoCorreo".$cid."Selector' class='ventanaSelector'>$ctipoCorreo: $ctopic</h2>
									<div class='ventanaContent'>
										<table>
					";
					if($cremitente != null){
						echo "<tr><td class='enfasis'>Mensaje de $cremitente</td></tr>";
					}
					echo "
					
											<tr>
												<td id='fecha$cid' class='fecha cursiva'>
													Recibido en: " . date("d/m/Y", strtotime(str_replace('-','/', $cfechaEmision))) . "<br/>
													A las: " . date("H:i:s", strtotime(str_replace('-','/', $cfechaEmision))) . "
												</td>
											</tr>
											<tr><td id='contenidoDefecto$cid'>$ccontenidoDefecto</td></tr>
											<tr><td id='contenido$cid' class='enfasis'>$ccontenido</td></tr>
										</table>
									</div>
								</div>
							</td>
						</tr>
					";
				}
			}
			
			$sentencia -> close();
			echo "
					</table>
				</div>
				<div id='inBoxMoving' class='scrollingBoxMoving'>
					<div id='inBoxMovingUp' class='scrollingBoxMovingUp'></div>
					<div id='inBoxMovingBar' class='scrollingBoxMovingBar'></div>
					<div id='inBoxMovingDown' class='scrollingBoxMovingDown'></div>
				</div>
				
			";
		}
		//Si no se ejecutara la sentencia (algo improbable) mostrariamos un error.
		//Esto es principalmente por razones de depuración.
		else{
			echo "<p id='inBoxContent' class='scrollingBoxContent'>Error</p>";
		}
	}


	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que establece una visita al buzón.
	 * Esto se usará para destacar los mensajes recibidos desde este momento en siguientes visitas.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 */
	function visitarBuzon($conexion){
		$sentencia = $conexion -> prepare("CALL proceso_visitarBuzon(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		$sentencia -> execute();
		$sentencia -> close();
	}


	/**
	 * FUNCIÓN DE EJECUCIÓN GETTER
	 * Función que retorna la ultima visita que se realizó al buzón
	 * a fin de identificar nuevos correos.
	 *
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @return Datetime fecha y hora de la ultima visita al buzón registrada.
	 */
	function ultimaVisita($conexion){
		$visita = date(time());
		$sentencia = $conexion -> prepare("CALL proceso_ultimaVisitaBuzonUsuario(?)");
		$sentencia -> bind_param('i', $_SESSION['userId']);
		if($sentencia -> execute()){
			$sentencia -> store_result();
			$sentencia -> bind_result($ultimaVisita);
			if($sentencia -> fetch()){
				$visita = $ultimaVisita;
			}
		}
		
		return $visita;
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Funcion que elimina un correo.
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $correo integer unsigned - Id del correo que se quiere eliminar.
	 */
	function deleteCorreo($conexion,$correo){
		//Eliminar un corrreo del buzón
		$sentencia = $conexion -> prepare("CALL proceso_deleteCorreo(?)");
		$sentencia -> bind_param('i', $correo);
		
		//Si diera un error mostramos un mensaje.
		if(!($sentencia -> execute())){
			echo "<div class='contenedor mid top box error'>Error al borrar el correo.</div>";
		}
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que acepta una peticion de amistad
	 * 
	 * @param $conexion Mysqli - Conexion a Base de Datos
	 * @param $uId integer unsigned - Id del usuario con que el usuario logueado va a establecer amistad. 
	 */
	function aceptarAmistad($conexion,$uId){
		$sentencia = $conexion -> prepare("CALL proceso_newAmistad(?,?)");
		$sentencia -> bind_param('ii', $uId, $_SESSION['userId']);
		//Si la sentencia se ejecuta correctamente, redireccionamos directamente al buzon.
		if($sentencia -> execute()){
			$sentencia -> close();
				
			//Una vez aceptada la amistad eliminamos las peticiones de amistad del primer usuario al segundo del buzón.
			$sentencia = $conexion -> prepare("CALL proceso_deletePeticionesAmistad(?,?)");
			$sentencia -> bind_param('ii', $uId, $_SESSION['userId']);
				
			if($sentencia -> execute()){
				buzon($conexion);
			}
			//En caso de no poder realizarse la operación mostramos un mensaje de error.
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
	 * Funcion que deniega una peticion de amistad.
	 * 
	 * @param $uId integer unsigned - Id del usuario al que el usuario logueado deniega amistad. 
	 */
	function denegarAmistad($conexion,$uId){
		//Al denegar la amistad simplemente eliminamos las peticiones de amistad del primer usuario al segundo del buzón.
		$sentencia = $conexion -> prepare("CALL proceso_deletePeticionesAmistad(?,?)");
		$sentencia -> bind_param('ii', $uId, $_SESSION['userId']);
		if($sentencia -> execute()){
			buzon($conexion);
		}
		else{
			echo "<div class='contenedor mid top box error'>Error al borrar la petición.</div>";
		}
		$sentencia -> close();
	}
?>