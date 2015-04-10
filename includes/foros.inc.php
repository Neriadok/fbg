<?php
	
	
	/**
	 * FUNCIÓN DE ESTRUCTURA
	 * Función que genera el contenido de la página foros.
	 *
	 * Los contenidos de la web se cargan de forma dinámica en servidor
	 * en función de la base de datos
	 * y los datos recibidos en el método POST.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function foros($conexion){
		foros_navegacion($conexion);
		echo "<div id='contenido' class='contenedor big column'>";
		foro_contenido($conexion);
		echo "</div>";
	}

	/**
	 * FUNCIÓN DE CONTENIDO
	 * Función que genera la barra de navegación de los foros.
	 * 
	 * Los elementos con clase navegador envián una variable POST
	 * gracias a una función javascript que los transofrma en objetos.
	 * dicha variable se envia a la propia página cargando un contenido u otro.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function foros_navegacion($conexion){
		/**BARRA DE NAVEGACIÓN**/
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		echo "
			<form id='navegador' class='contenedor left column navegador' >
				<h1>Navegación</h1>
		";
		$sentencia = $conexion -> prepare("CALL proceso_categorias(?)");
		$sentencia -> bind_param('i', $_SESSION['tipoUser']);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($categoria,$categoriaId);
		
		$cat=array();
		$id=array();
		$i=0;
		
		while($sentencia -> fetch()){
			$cat[$categoriaId] = $categoria;
		}
		
		$sentencia -> close();
			
		foreach($cat as $cid => $category){
			echo "<div class='conjunto conjuntoDesplegable' id='categoria$cid'>$category";
		
			$sentencia = $conexion -> prepare("CALL proceso_foros(?)");
			$sentencia -> bind_param('s', $cid);
			$sentencia -> execute();
			$sentencia -> store_result();
			$sentencia -> bind_result($fid, $foro, $fdesc);
			while($sentencia -> fetch()){
				echo "
					<div class='contenidoConjunto oculto forumsForum desplegablecategoria$cid' id='$foro'>
						$foro
				</div>";
			}
			$sentencia -> close();
			echo "
				</div>
			";
		}
		echo "
			</form>
		";
	}
	
	
	/**
	 * FUNCIÓN DE ESTRUCTURA Y CONTENIDO
	 * Función que muestra el contenido principal de la sección de foros.
	 * Esta sección cambia en funcion de los datos recibidos en formato JSON.
	 * 
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function foro_contenido($conexion){
		
		$datos = json_decode(file_get_contents('php://input'),true);
		
		$urle=esc_url($_SERVER['PHP_SELF']);
		
		/**
		 * Contenido si vamos a publicar una noticia.
		 */
		if(isset($datos['topicTitle'])){
			if($datos['topicAsNoticia'] == 'on'){
				newTopic($conexion,$datos['topicTitle'],$datos['forum'],$datos['topicContent'],true);
			}
			else{
				newTopic($conexion,$datos['topicTitle'],$datos['forum'],$datos['topicContent'],false);
			}
		}
		
		/**
		 * Contenido si nos dirigimos a un foro concreto
		 */
		else if(isset($datos['destino'])){
			
			$foroActual = preg_replace("/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ\r\n \-]+/", "", $datos['destino']);
		
			/** Si se ha enviado orden de eliminar un tema, procedemos con ello.**/
			if(isset($datos['temaAEliminar'])){
				$tema = preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ¡!¿?()\"'_.,:\/\-]+/", "", $datos['temaAEliminar']);
					
				$sentencia = $conexion -> prepare("CALL proceso_deleteTopic(?,?)");
				$sentencia -> bind_param('ss', $tema, $foroActual);
				$sentencia -> execute();
				$sentencia -> close();
			}
		
		
			/** Si se ha enviado orden de cerrar un tema, procedemos con ello.**/
			if(isset($datos['temaACerrar'])){
				$tema =  preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ¡!¿?()\"'_.,:\/\-]+/", "", $datos['temaACerrar']);
					
				$sentencia = $conexion -> prepare("CALL proceso_closeUncloseTopic(?,?,false)");
				$sentencia -> bind_param('ss', $tema, $foroActual);
				$sentencia -> execute();
				$sentencia -> close();
			}
				
				
			/** Si se ha enviado orden de abrir un tema, procedemos con ello.**/
			if(isset($datos['temaAAbrir'])){
				$tema =  preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ¡!¿?()\"'_.,:\/\-]+/", "", $datos['temaAAbrir']);
					
				$sentencia = $conexion -> prepare("CALL proceso_closeUncloseTopic(?,?,true)");
				$sentencia -> bind_param('ss', $tema, $foroActual);
				$sentencia -> execute();
				$sentencia -> close();
			}
				
			foro_foro($foroActual,$conexion);
		}
		
		/**
		 * Contenido si vamos a publicar un nuevo tema.
		 */
		else if(isset($datos['newTopic'])){
			$foro = $datos['newTopic'];
				
			foro_nuevoTema($foro,$urle);
		}
		
		/**
		 * Contenido si estamos en un tema concreto.
		 */
		else if(isset($datos['topic'])){
			$topic =  preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ¡!¿?()\"'_.,:\/\-]+/", "", $datos['topic']);
			/**Comprobamos si se ha enviado un nuevo post**/
			if(isset($datos['postContent'])){
				$userId = preg_replace("/[^0-9]+/", "", $_SESSION['userId']);
				$content = nl2br(preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@\s¡!¿?()\"'_.,:\/\-]+/", "", $datos['postContent']));
		
		
				$sentencia = $conexion -> prepare("CALL proceso_newPost(?,?,?)");
				$sentencia -> bind_param('iis', $topic,$userId,$content);
				$sentencia -> execute();
				$sentencia -> close();
			}
				
			/** Comprobamos si se ha eliminado un post**/
			if(isset($datos['postAEliminar'])){
				$post = preg_replace("/[^0-9]+/", "", $datos['postAEliminar']);
		
				$sentencia = $conexion -> prepare("CALL proceso_deletePost(?)");
				$sentencia -> bind_param('i',$post);
				$sentencia -> execute();
				$sentencia -> close();
			}
				
			/** Comprobamos si se ha modificado un post**/
			if(isset($datos['postAModificar'])){
				$post = preg_replace("/[^0-9]+/", "", $datos['postAModificar']);
				$newContent = nl2br(preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@\s¡!¿?()\"'_.,:\/\-]+/", "",$datos['postNewContent']));
		
				$sentencia = $conexion -> prepare("CALL proceso_editPost(?,?)");
				$sentencia -> bind_param('is',$post,$newContent);
				$sentencia -> execute();
				$sentencia -> close();
			}
		
		
			foro_tema($topic,$urle,$conexion);
		}
		
		/**
		 * Contenido por defecto de la sección de foros.
		 */
		else{
			echo "<h2>Bienvenido<br>a los Foros de</h2>";
			echo "<h1>FANTASY BATTLE GAMES</h1>";
			echo "<p>Selecciona uno de nuestros foros para navegar por esta sección</p>";
		}
	}
	

	/**
	 * FUNCIÓN DE CONTENIDO
	 * Funcion que nos genera el contenido de la big column asociado a un foro concreto.
	 * 
	 * @param $foroActual String - sForo del que se mostraran los temas.
	 * @param $conexion Objeto msqli a través del que realizaremos el lanzamiento de los procedures.
	 */
	function foro_foro($foroActual,$conexion){
		echo "
			<h2 id='foroActual'>$foroActual</h2>
			<div class='botonsBar'>
				<div class='boton' id='temasDestinoBegin'><img src='src/botones/arriba.png'/></div>
				<div class='boton' id='temasDestinoEnd'><img src='src/botones/abajo.png'/></div>
				<form class='boton' id='newTopic'><img src='src/botones/add.png'/></form>
			</div>
			<table class='scrollingBoxHead'>
				<tr class='scrollingBoxHeadRow'>
					<td class='tnombre'>Tema</td>
					<td class='tvisitas'>Visitas</td>
					<td class='tmensajes'>Mensajes</td>
					<td class='tautor'>Autor</td>
					<td class='tfecha'>Ultimo Mensaje</td>
				</tr>
			</table>
			<form id='temasDestino' class='scrollingBox'>
				<table id='temasDestinoContent' class='scrollingBoxContet'>
		";
	
		$sentencia = $conexion -> prepare("CALL proceso_temasForo(?)");
		$sentencia -> bind_param('s', $foroActual);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($temaId,$temaNombre,$temaNoticia,$temaAbierto,$lastPost,$temaCreador,$mensajes,$visitas);//Añadir visitas y mensajes totales
		$i=0;
		while($sentencia -> fetch()){
			echo "<tr id='$temaId' class='temaDestino";
			if($i%2==0){
				echo " pairRow";
			}
			else{
				echo " inpairRow";
			}
	
			if($temaNoticia){
				echo " noticiaRow";
			}
	
			if(!$temaAbierto){
				echo " closeTopicRow";
			}
	
			echo "
				'>
					<td class='tnombre'>$temaNombre</td>
					<td class='tvisitas'>$visitas</td>
					<td class='tmensajes'>$mensajes</td>
					<td class='tautor'>$temaCreador</td>
					<td class='tfecha'>" . date("d/m/Y", $lastPost) . "<br/>" . date("H:i:s", $lastPost) . "</td>
				</tr>
			";
			$i++;
		}
			
		echo "
				</table>
			</form>
			<div id='temasDestinoMoving' class='scrollingBoxMoving'>
				<div id='temasDestinoMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='temasDestinoMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='temasDestinoMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
	}

	/**
	 * FUNCIÓN DE CONTENIDO
	 * Formulario de envio de un nuevo tema a un foro pasado por parámetro.
	 *
	 * @param $foro String - foro en que se incluira el nuevo tema que creemos.
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function foro_nuevoTema($foro,$urle){
		echo "
			<h2>
				Nuevo Tema en <span id='foroActual'>$foro</span>
			</h2>
			<div class='botonsBar'>
				<div class='submit' id='sendTopic'><img src='src/botones/aceptar.png'/></div>
				<form class='boton' id='volverAForo' ><img src='src/botones/volver.png'/></form>
			</div>
			<form id='topicForm' class='sendingForm' >
				<input type='hidden' id='forum' name='forum' value='$foro'/>
				<div class='sendingFormCabecera'>
					<div class='subtitle'>By ".$_SESSION['nickname']."</div>
					Titulo del Tema:
					<input id='topicTitle' name='topicTitle' class='inputTitle' type='text' maxlength='100'/>
				</div>
				<div class='sendingFormContent'>
					<textarea id='topicContent' name='topicContent' class='bigColumnTArea' maxlength='1023'></textarea>
				</div>
				<div class='sendingFormOpciones'>
					<label for='topicAsNoticia'>Enviar tema como noticia:</label>
					<input id='topicAsNoticia' name='topicAsNoticia' type='checkbox'/>
				</div>
			</form>
		";
	}

	/**
	 * FUNCIÓN DE CONTENIDO
	 * Esta funcion nos genera el contendo de la big column de la seccion foros enfocado a un tema concreto del foro.
	 *
	 * @param $topic String - tema del que se ha de obtener la información y el contenido
	 * @param $conexion Mysqli - Conexion a base de datos.
	 */
	function foro_tema($topic,$urle,$conexion){
			
		$sentencia = $conexion -> prepare("CALL proceso_visitarTema(?,?)");
		$sentencia -> bind_param('ii', $topic, $_SESSION['userId']);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($temaNombre,$temaCreador,$temaForo,$temaNoticia,$temaAbierto);
		$sentencia -> fetch();
			
		echo "
			<h2>$temaNombre</h2>
			<p  id='foroActual' class='oculto'>$temaForo</p>
			<div class='botonsBar'>
				<div class='boton' id='postsBegin'><img src='src/botones/arriba.png'/></div>
				<div class='boton' id='postsEnd'><img src='src/botones/abajo.png'/></div>
		";
		
		if($temaAbierto){
			echo"
				<div id='newPostBoton' class='botonVentana'><img src='src/botones/add.png'/></div>
				<div id='newPost' class='ventana oculto'>
					<h2 id='newPostSelector' class='ventanaSelector'>Nuevo Post</h2>
					<div class='ventanaContent'>
						<form id='postForm' >
							<fieldset>
								<legend>By ".$_SESSION['nickname']."</legend>
								<input type='hidden' name='topic' id='topic' value='$topic'/>
								<table class='sendingPostForm'>
									<tfoot>
										<tr>
											<td colspan='2'>
												<div class='submit' id='sendPost'><img src='src/botones/aceptar.png'/></div>
											</td>
										</tr>
									</tfoot>
									<tbody>
										<tr>
											<td colspan='2'>
												<textarea id='postContent' name='postContent' class='bigColumnTArea' maxlength='1023' cols='64' rows='16'></textarea>
											</td>
										</tr>
									</tbody>
								</table>
							</fieldset>
						</form>
					</div>
				</div>
			";
		}
	
		if($_SESSION['tipoUser']>2){
			echo "
				<div id='eliminarBoton' class='botonVentana'><img src='src/botones/eliminar.png'/></div>
				<div id='eliminar' class='ventana oculto'>
					<h2 id='eliminarSelector' class='ventanaSelector'>Eliminar</h2>
					<div class='ventanaContent error'>
						<form id='eliminarTopic' method='POST' action='$urle'>
							<input type='hidden' id='destino' name='destino' value='$temaForo'/>
							<input type='hidden' id='temaAEliminar' name='temaAEliminar' value='$temaNombre'/>
							<table>
								<tr>
									<td colspan='2'>¿Está seguro de querer eliminar el Tema?</td>
								</tr>
								<tr>
									<td colspan='2'>
										<div class='submit' id='eliminarTopicConfirm'><img src='src/botones/eliminar.png'/></div>
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
			";
		
			if($temaAbierto){
				echo "
					<div id='cerrarBoton' class='botonVentana'><img src='src/botones/close.png'/></div>
					<div id='cerrar' class='ventana oculto'>
						<h2 id='cerrarSelector' class='ventanaSelector'>Cerrar Tema</h2>
						<div class='ventanaContent'>
							<form id='cerrarTopic' method='POST' action='$urle'>
								<input type='hidden' id='destino' name='destino' value='$temaForo'/>
								<input type='hidden' id='temaACerrar' name='temaACerrar' value='$temaNombre'/>
								<table>
									<tr>
										<td colspan='2'>¿Está seguro de querer cerrar el Tema?</td>
									</tr>
									<tr>
										<td colspan='2'>
											<div class='submit' id='cerrarTopicConfirm'><img src='src/botones/close.png'/></div>
										</td>
									</tr>
								</table>
							</form>
						</div>
					</div>
				";
			}
			
			else{
				echo "
					<div id='abrirBoton' class='botonVentana'><img src='src/botones/open.png'/></div>
					<div id='abrir' class='ventana oculto'>
						<h2 id='abrirSelector' class='ventanaSelector'>Abrir</h2>
						<div class='ventanaContent'>
							<form id='abrirTopic' method='POST' action='$urle'>
								<input type='hidden' id='destino' name='destino' value='$temaForo'/>
								<input type='hidden' id='temaAAbrir' name='temaAAbrir' value='$temaNombre'/>
								<table>
									<tr>
										<td colspan='2'>¿Está seguro de querer abrir el Tema?</td>
									</tr>
									<tr>
										<td colspan='2'>
											<div class='submit' id='abrirTopicConfirm'><img src='src/botones/open.png'/></div>
										</td>
									</tr>
								</table>
							</form>
						</div>
					</div>
				";
			}
		}
	
		echo "
				<form id='volverAForo' class='boton' ><img src='src/botones/volver.png'/></form>
			</div>
			<span class='subtitle'>Tema creado por $temaCreador</span>
			<div id='posts' class='scrollingBox'>
				<table id='postsContent' class='scrollingBoxContent'>
			";
		$sentencia -> close();
			
		$sentencia = $conexion -> prepare ("CALL proceso_temaPosts(?)");
		$sentencia -> bind_param('i', $topic);
		$sentencia -> execute();
		$sentencia -> store_result();
		$sentencia -> bind_result($emisor,$avatar,$firma,$fecha,$modificacion,$contenido,$postId);
	
		$i=0;
		while($sentencia -> fetch()){
			echo "
					<tr class='post
					";
	
			if($i%2==0){
				echo " pairRow";
			}
			else{
				echo " inpairRow";
			}
	
			echo"'>
				<td class='alignRight columnSmall' rowspan='2'>
			";
			
			if($avatar != null){
				echo "<img class='avatarUser' src='$avatar'/><br/>";
			}
			else{
				echo "<img class='avatarUser' src='src/avatares/default.jpg'/><br/>";
			}		

			echo "
					$emisor<br/>
					Enviado en<br/>
					<span class='date'>el ".date("d/m/Y",$fecha)."<br/>
					a las ".date("H:i:s",$fecha)."</span>
			";
		
			if($modificacion != null){
				echo "<br/>Modificado en<br/><span class='date'>el ".date("d/m/Y",$modificacion)."<br/> a las ".date("H:i:s",$modificacion)."</span>";
			}
	
			echo "</td>
				<td class='columnBig'>$contenido</td>
				<td class='alignCenter' rowspan='2'>
			";
			
			if($emisor==$_SESSION['nickname']){
				echo"
					<div id='modificar".$postId."Boton' class='botonVentana'><img src='src/botones/editar.png'/></div>
					<div id='modificar".$postId."' class='ventana oculto'>
						<h2 id='modificar".$postId."Selector' class='ventanaSelector'>Modificar</h2>
						<div class='ventanaContent'>
							<form id='modificarPost".$postId."' class='modificarPost' >
								<input type='hidden' id='topic' name='topic' value='$topic'/>
								<input type='hidden' id='postAModificar' name='postAModificar' value='$postId'/>
								<table class='sendingPostForm'>
									<tr>
										<td colspan='2'>
											<textarea id='post".$postId."FormContent' name='postNewContent' class='bigColumnTArea' maxlength='1023' cols='64' rows='16'>".br2nl($contenido)."</textarea>
										</td>
									</tr>
									<tr>
										<td colspan='2'>
											<div class='submit' id='modificarPost".$postId."confirm'><img src='src/botones/editar.png'/></div>
										</td>
									</tr>
								</table>
							</form>
						</div>
					</div>
				";
			}
		
			if($emisor==$_SESSION['nickname'] || $_SESSION['tipoUser']>1){
				echo"
					<div id='eliminarPost".$postId."Boton' class='botonVentana'><img src='src/botones/eliminar.png'/></div>
					<div id='eliminarPost".$postId."' class='ventana oculto'>
						<h2 id='eliminarPost".$postId."Selector' class='ventanaSelector'>Eliminar</h2>
						<div class='ventanaContent error'>
							<form id='eliminarPost".$postId."' class='eliminarPost' method='POST' action='$urle'>
								<input type='hidden' id='topic' name='topic' value='$topic'/>
								<input type='hidden' id='postAEliminar' name='postAEliminar' value='$postId'/>
								<table>
									<tr>
										<td colspan='2'>¿Está seguro de querer eliminar el Post?</td>
									</tr>
									<tr>
										<td colspan='2'>
											<div class='submit' id='eliminarPost".$postId."confirm'><img src='src/botones/eliminar.png'/></div>
										</td>
									</tr>
								</table>
							</form>
						</div>
					</div>
				";
			}
			echo "
						</td>
					</tr>
					<tr class='post
					";
	
			if($i%2==0){
				echo " pairRow";
			}
			else{
				echo " inpairRow";
			}
	
			echo"'><td class='firma alignCenter'>$firma</td></tr>";
			$i++;
		}
		
		echo "
				</table>
			</div>
			<div id='postsMoving' class='scrollingBoxMoving'>
				<div id='postsMovingUp' class='scrollingBoxMovingUp'></div>
				<div id='postsMovingBar' class='scrollingBoxMovingBar'></div>
				<div id='postsMovingDown' class='scrollingBoxMovingDown'></div>
			</div>
		";
		$sentencia -> close();
	}
	
	
	/**
	 * FUNCIÓN DE EJECUCIÓN SETTER
	 * Función que genera un nuevo tema.
	 * 
	 *
	 * @param $conexion Mysqli - Conexion a base de datos.
	 * @param $topic String - Titulo del tema.
	 * @param $forum String - Foro en que se publicará el tema.
	 * @param $content String - Contenido del primer mensaje de dicho tema.
	 * @param $noticia Boolean - Opción de publicar el tema como una noticia para que sea mas vistoso. 
	 */
	function newTopic($conexion,$topic,$forum,$content,$noticia){

		$urle=esc_url($_SERVER['PHP_SELF']);
		
		$userId = $_SESSION['userId'];
		$topic = preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ¡!¿?()\"'_.,:\/\-]+/", "", $topic);
		$forum = preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ ]+/", "", $forum);
		$content = nl2br(preg_replace("/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ@\s¡!¿?()\"'_.,:\/\-]+/", "", $content));
	
		$sentencia;
		if($noticia){
			$sentencia = $conexion -> prepare("CALL proceso_newTopic(?,?,?,true,?)");
		}
		else{
			$sentencia = $conexion -> prepare("CALL proceso_newTopic(?,?,?,false,?)");		
		}
		$sentencia -> bind_param('ssis',$topic,$forum,$userId,$content);
		if($sentencia -> execute()){
			$sentencia -> store_result();
		
			if ($sentencia -> num_rows == 1) {
				$sentencia -> bind_result($codigoError,$tipoError,$error);
				$sentencia -> fetch();
				echo "
					<h2 id='foroActual'>$forum</h2>
					<form class='boton' id='volverAForo' ><img src='src/botones/volver.png'/></form>
					
					<div class='error'>
						<h1>ERROR</h1>
						<h2>$error</h2>
						<p>
							$tipoError
							<br/>
							Codigo: $codigoError
						</p>
					</div>
				";
			}
			else{
				echo "
					<h1>Exito</h1>
					<p>Su tema se ha creado correctamente en <span id='foroActual'>$forum</span></p>
					<form class='boton' id='volverAForo'><img src='src/botones/volver.png'/></form>
				";
			}
		}
		else{
			echo "
				<h2 id='foro'>$forum</h2>
				<form class='boton' id='volverAForo' action='foros.php' method='POST'><img src='src/botones/volver.png'/></form>
				
				<div class='error'>
					<h1>ERROR</h1>
					<h2></h2>
					<p>
						Tema imposible de publicar
					</p>
				</div>
			";
		}
		$sentencia -> close();
	}
?>