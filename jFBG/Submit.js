/**
 * Clase que gestiona el envio de formularios, pudiendo enviarlos de forma asíncrona.
 * 
 * @param ca - Es un objeto de la clase AsinCronos que realiza una petición asíncrona.
 * @param elementoId - Se trata del elemento de la web que efectuará el submit al hacerle click
 * @param form - Formulario que se enviará.
 * @param tipo - Define el tratamiento que se dará al formulario y que filtros y validaciones se aplicarán.
 * @param sitioCarga - En caso de realizarse una petición asíncrona.
 */
function Submit(tipo,elementoId,form,ca,sitioCarga){

	/***VARIABLES DEL OBJETO***/
	var pulsado = false;
	var seleccionado = false;
	
	
	/***ASIGNACIÓN DE EVENTOS***/
	document.getElementById(elementoId).onclick = enviar;
	document.getElementById(elementoId).onmouseover = cEncima;
	document.getElementById(elementoId).onmouseout = cFuera;
	document.getElementById(elementoId).onmousedown = cPulsado;
	asignarEnter(form);
	if(tipo == 8 || tipo == 11){
		form.onchange = cambios;
	}
	
	
	/***MÉTODOS Y FUNCIONES***/
	
	/**
	 * Función que decide el tratamiento que se dará al formulario en funcion de su tipo.
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function enviar(e){

		cSoltar(e);
		
		/**Validamos el formulario suponiendolo correcto**/
		var valido=true;
		
		switch(tipo){
			case 1: logformhash(); break;	//Este tipo de formulario no necesita verificaciones, o la contraseña es correcta o no.
			case 2: regformhash(); break;
			case 3: adminusers(); break;
			case 4: adminforos(); break;
			case 5: deleteUser(); break;
			case 6: deleteCat(); break;
			case 7: deleteForo(); break;
			case 8: addLista(); break;
			case 9: deleteLista(); break;
			case 10: editLista(); break;
			case 11: saveEditLista(); break;
			case 12: saveEditPerfil(); break;
			case 13: sendMsg(); break;
			case 14: accederPartida(); break;
			
			default: enviarTodoDato();
		}
	};

		
	
	/**
	 * Función que se ejecuta al pasar el cursor sobre el submit
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function cEncima(e){
		
			document.getElementById(elementoId).style.borderColor="#F9FF45";
	};

		
	/**
	 * Función que se ejecuta al sacar el cursor del submit
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function cFuera(e){

		cSoltar(e);	
		
		document.getElementById(elementoId).style.borderColor="#CBD126";
	};

		
	/**
	 * Función que se ejecuta al mantener pulsado el raton sobre el submit.
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function cPulsado(e){
		
		pulsado=true;

		document.getElementById(elementoId).style.boxShadow="3px 3px 3px grey";
	};

		
	/**
	 * Función que se dispara al pulsar el ratón o para simular que se deja de pulsar.
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function cSoltar(e){
		if(pulsado){
			pulsado = false;

			document.getElementById(elementoId).style.boxShadow="none";
		}
	};
	
	/**
	 * Función asignada a los elementos del formulario que compará si se pulso la tecla enter
	 * mientras el foco se encontraba en uno de ellos.
	 * 
	 * @param e - Evento que lanzo la función.
	 */
	function comprobarEnter(e){
		//Comprobamos si se ha pulsado la tecla Enter.
		if(e.keyCode == 13){
			e.preventDefault();
			enviar(e);
		}
	};
	
	/**
	 * Función que asigna a un elemento y a todos sus hijos cuyo Tag Name sea Input, Option o Select.
	 * 
	 * @param elemento - elemento a que se asigna el enter.
	 */
	function asignarEnter(elemento){
		//Comprobamos que el elemento tenga hijos
		if(elemento.hasChildNodes()){
			var hijos = elemento.children;
			
			for(var i=0;i < hijos.length; i++){
				asignarEnter(hijos[i]);
			}
		}
		
		//En cualquier caso, si el elemento es una select, un input u un option
		//Le asignamos la funcion comprobarEnter que comprobará si la tecla que se pulso es un enter o no.
		if(elemento.tagName == "INPUT" || elemento.tagName == "SELECT" || elemento.tagName == "OPTION"){
			elemento.onkeydown = comprobarEnter;
		}
	};
	
	
	
	/**FUNCIONES DE VALIDACIÓN**/
		
	/**
	 * Validación por defecto:
	 * Envia todos los datos del formulario contenidos en un objeto JSON
	 */
	function enviarTodoDato() {
		//Creamos el objeto con los datos
		var datos = new Object();
		
		//Creamos un array con todos los datos que se enviarian mediante post (inputs, selects y textareas)
		var arrayE = [];
		
		arrayE = buscarDatos(arrayE,form);
		
		//Recogemos el id de todos esos elementos y los asignamos al objeto Datos
		for(var i=0;i<arrayE.length;i++){
			if(arrayE[i].type == 'checkbox'){
				datos[arrayE[i].name] = arrayE[i].checked;
			}
			else{
				datos[arrayE[i].name] = arrayE[i].value;
			}
		}
				
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};
	
	
	/**
	 * Función que asigna a un array de elementos todos los elementos hijos de un elemento dado
	 * cuyo Tag Name sea Input, Select o TextArea.
	 * 
	 * @param arrayElementos - array de elementos HTML a que asignaremos los nuevos elementos.
	 * @param elemento - elemento del que se verificará el tag name de sus hijos y el suyo propio.
	 * @return devuelve el array recibido, pero con los nuevos elementos que se hayan incluido.
	 */
	function buscarDatos(arrayElementos,elemento){//Comprobamos que el elemento tenga hijos
		if(elemento.hasChildNodes()){
			var hijos = elemento.children;
			
			for(var i=0;i < hijos.length; i++){
				arrayElementos = buscarDatos(arrayElementos,hijos[i]);
			}
		}
		
		//En cualquier caso, si el elemento es una select, un input u un option
		//Le asignamos la funcion comprobarEnter que comprobará si la tecla que se pulso es un enter o no.
		if(elemento.tagName == "INPUT" || elemento.tagName == "SELECT" || elemento.tagName == "TEXTAREA"){
			arrayElementos[arrayElementos.length] = elemento;
		}
		
		return arrayElementos;
	};
	
		 
		
	/**
	 * Validación de Login:
	 * Función que valida el login de un usuario.
	 * Envia los datos a través de un objeto AsinCronos especial.
	 * @see ../js/sha_512.js - Este fichero se encarga de la encriptación de los datos e incluye la funcion hex_sha512.
	 */
	function logformhash() {
		//Recogemos los datos
		var password = document.getElementById("logpassword");
		var nickname = document.getElementById("lognickname");
		
		//Creamos el objeto con los datos
		var datos = new Object();
		datos['p'] = hex_sha512(password.value);
		datos['nickname'] = nickname.value;
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Creamos una comunicación asíncrona con el tratamiento en servidor del login.
		var logCA = new AsinCronos("includes/login.inc.php");
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		logCA.actualizar(datos,null);
	};

		
	/**
	 * Validacion de Registro:
	 * Función que valida los datos de registro de un usuario.
	 * Envia los datos a través de un objeto AsinCronos especial.
	 * @see ../js/sha_512.js - Este fichero se encarga de la encriptación de los datos e incluye la funcion hex_sha512.
	 */
	function regformhash() {
		var mensaje = "msgR";
		
		var nickname = document.getElementById("regnickname");
		var mail = document.getElementById("mail");
		var password = document.getElementById("regpassword");
		var conf = document.getElementById("confirmpwd");
		
		//Suponemos que el formulario es correcto y en caso contrario lo indicamos.
		var correcto=true;

		document.getElementById(mensaje).innerHTML="";

    	// Verifica que cada campo tenga un valor.
    	if (nickname.value == '' ||
    		mail.value == ''  ||
    		password.value == ''  ||
    		conf.value == '') {
    	
        	document.getElementById(mensaje).innerHTML += "Debes rellenar todos los campos.<br/>";
        	form.nickname.focus();
        	correcto=false;
    	}
 
    	// Verifica el nombre de usuario
    	var nre = /^\w+$/; 
    	if(!nre.test(form.nickname.value)) { 
    		document.getElementById(mensaje).innerHTML += "El nombre de usuario debe contener solo letras, números y guiones bajos.<br/>"; 
        	form.username.focus();
        	correcto=false; 
    	}
    
    	// Verifica que la contrase�a tenga la extensi�n correcta (m�n. 6 caracteres)
    	// La verificaci�n se duplica a continuaci�n, pero se incluye para que el
    	// usuario tenga una gu�a m�s espec�fica.  
    	if (password.value.length < 6) {
    		document.getElementById(mensaje).innerHTML += "La contraseña debe tener al menos 6 carácteres.<br/>";
        	form.password.focus();
        	correcto=false;
    	}
 
    	// Por lo menos un n�mero, una letra min�scula y una may�scula
    	// Al menos 6 caracteres 
    	var pre = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    	if (!pre.test(password.value)) {
    		document.getElementById(mensaje).innerHTML += "La contraseña debe contener al menos un número, una letra minúscula y una mayúscula.<br/>";
    		form.password.focus();
    		correcto=false;
    	}
 
    	// Verifica que la contraseña y la confirmación sean iguales.
    	if (password.value != conf.value) {
    		document.getElementById(mensaje).innerHTML += "La contraseña y la confirmación de la misma no coinciden.<br/>";
        	form.password.focus();
        	correcto=false;
    	}
    	
    	var mre = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
    	if (!mre.test(mail.value)) {
    		document.getElementById(mensaje).innerHTML += "Correo inválido.<br/>";
    		form.mail.focus();
    		correcto=false;
    	}
    	
    	// Finalmente, si es correcto env�amos los datos del formulario de forma asincrona.
	    if(correcto){
	    	//Creamos el objeto con los datos
			var datos = new Object();
	    	datos.p = hex_sha512(password.value);
	    	datos.nickname =  nickname.value;
	    	datos.mail = mail.value;
			
			//Lo convertimos a texto
			datos = JSON.stringify(datos);
			console.log(datos);
	    	
			//Creamos una comunicación asíncrona con el tratamiento en servidor del login.
			var regCA = new AsinCronos("includes/registro.inc.php");
			
			//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
			regCA.actualizar(datos,null);
    	}
    	
	};

		
	/**
	 * Función que envia el macroformulario de foros en la página de administración.
	 * @see Documentacion Externa - Guía para el Programador Vol.3 (Macroformularios de datos)
	 */
	function adminforos(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		//Especificamos que ha habido cambios
		datos.cambios = "foros";
		
		//Definimos los diferentes conjuntos de datos
		datos.cnombre = new Object();
		datos.permisos = new Object();
		datos.nombreforo = new Object();
		datos.descforo = new Object();
		datos.nuevaCat = new Object();
		datos.permisosNuevaCat = new Object();
		datos.nuevoForo = new Object();
		datos.categoriaNuevoForo = new Object();
		
		//Lo inicializamos uno a uno
		//Nombres de las Categorias
		var nc = document.getElementsByClassName('cnombre');
		for(var i=0 ; i<nc.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = nc[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = nc[i].name.length - nc[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = nc[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.cnombre[index] = nc[i].value;
		}

		//Permisos de las categorias
		var pc = document.getElementsByClassName('permisos');
		for(var i=0 ; i<pc.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = pc[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = pc[i].name.length - pc[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = pc[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.permisos[index] = pc[i].value;
		}
		
		//Nombres de los foros
		var nf = document.getElementsByClassName('nombreforo');
		for(var i=0 ; i<nf.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = nf[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = nf[i].name.length - nf[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = nf[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.nombreforo[index] = nf[i].value;
		}
				
		//Descripciones de los foros
		var newc = document.getElementsByClassName('nuevaCat');
		for(var i=0 ; i<newc.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = newc[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = newc[i].name.length - newc[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = newc[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.nuevaCat[index] = newc[i].value;
		}
		
		//Descripciones de los foros
		var pnewc = document.getElementsByClassName('permisosNuevaCat');
		for(var i=0 ; i<pnewc.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = pnewc[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = pnewc[i].name.length - pnewc[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = pnewc[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.permisosNuevaCat[index] = pnewc[i].value;
		}
		
		//Descripciones de los foros
		var newf = document.getElementsByClassName('nuevoForo');
		for(var i=0 ; i<newf.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = newf[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = newf[i].name.length - newf[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = newf[i].name.substr(indexBegin,longitudIndex);

			//Damos valor a dicho indice
			datos.nuevoForo[index] = newf[i].value;
		}
		
		//Descripciones de los foros
		var catnewf = document.getElementsByClassName('categoriaNuevoForo');
		for(var i=0 ; i<catnewf.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = catnewf[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = catnewf[i].name.length - catnewf[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = catnewf[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.categoriaNuevoForo[index] = catnewf[i].value;
		}

		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);

		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

		
	/**
	 * Función que envia el macroformulario de usuarios en la página de administración.
	 * @see Documentacion Externa - Guía para el Programador Vol.3 (Macroformularios de datos)
	 */
	function adminusers(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.cambios = "users";
				
		//Definimos los diferentes conjuntos de datos
		datos.tipo = new Object();
		datos.faltas = new Object();
		
		//Lo inicializamos uno a uno
		//Nombres de las Categorias
		var t = document.getElementsByClassName('tipo');
		for(var i=0 ; i<t.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = t[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = t[i].name.length - t[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = t[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.tipo[index] = t[i].value;
		}
		
		//Permisos de las categorias
		var f = document.getElementsByClassName('faltas');
		for(var i=0 ; i<f.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = f[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = f[i].name.length - f[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = f[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			datos.faltas[index] = f[i].value;
		}
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

	
	/**
	 * Función que envia el Id de un usuario a eliminar.
	 * Para hayar el Id se corta a partir del 9 carácter del Id del elemento.
	 */
	function deleteUser(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.userAEliminar = elementoId.substring(9);
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

	
	/**
	 * Función que envia el Id de una categoría a eliminar.
	 * Para hayar el Id se corta a partir del 9 carácter del Id del elemento.
	 */
	function deleteCat(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.catAEliminar = elementoId.substring(9);
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

		
	/**
	 * Función que envia el Id de un foro a eliminar.
	 * Para hayar el Id se corta a partir del 9 carácter del Id del elemento.
	 */
	function deleteForo(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.foroAEliminar = elementoId.substring(9);
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};

		
	/**
	 * Función que envia el macroformulario de una nueva lista de ejército en la página de listas.
	 * @see Documentacion Externa - Guía para el Programador Vol.3 (Macroformularios de datos)
	 */
	function addLista(){
		//Suponemos los datos correctos
		var correcto = true;
		
		//Agregamos los ultimos cambios realizados
		cambios();
		
		//Comprobamos que exista un nombre
		if(document.getElementById("nombreLista").value == ""){
			document.getElementById("nombreLista").focus();

			var alerta = document.createElement("div");
			form.appendChild(alerta);
			alerta.id = "noListName";
			alerta.className = "alerta";
			alerta.innerHTML = "Rellena el nombre de la lista";
			var nuevaAlerta = new Alerta(alerta.id);
			correcto = false;
		}
		
		
		//Comprobamos que la puntuacion sea un número.				
		var puntos = parseInt(document.getElementById("puntosLista").innerHTML);
		
		if(isNaN(puntos)){
			var alerta = document.createElement("div");
			form.appendChild(alerta);
			alerta.id = "wrongPoints";
			alerta.className = "alerta";
			alerta.innerHTML = "Los puntos son incorrectos.";
			var nuevaAlerta = new Alerta(alerta.id);
			correcto = false;
		}
		
		if(correcto){
			//Creamos el objeto con los datos
			var datos = new Object();
		
			datosComponentes(datos);
			
			datos.ptsLista = puntos;
			
			datos.nombreLista = document.getElementById("nombreLista").value;

			//Lo convertimos a texto
			datos = JSON.stringify(datos);
			console.log(datos);
			
			//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
			ca.actualizar(datos,sitioCarga);
		}
	};
	

	/**
	 * Función que envia el macroformulario de edicion de una lista de ejército en la página de listas.
	 * @see Documentacion Externa - Guía para el Programador Vol.3 (Macroformularios de datos)
	 */
	function saveEditLista(){
		//Suponemos los datos correctos
		var correcto = true;

		//Agregamos los ultimos cambios realizados
		cambios();
		
		//Comprobamos que la puntuacion sea un número.				
		var puntos = parseInt(document.getElementById("puntosLista").innerHTML);
		
		if(isNaN(puntos)){
			var alerta = document.createElement("div");
			form.appendChild(alerta);
			alerta.id = "wrongPoints";
			alerta.className = "alerta";
			alerta.innerHTML = "Los puntos son incorrectos.";
			var nuevaAlerta = new Alerta(alerta.id);
			correcto = false;
		}
		
		if(correcto){
			//Creamos el objeto con los datos
			var datos = new Object();
			
			datosComponentes(datos);
			
			datos.ptsLista = puntos;
			
			datos.listaAModificar = document.getElementById("listaActual").innerHTML;
			
			//Lo convertimos a texto
			datos = JSON.stringify(datos);
			console.log(datos);
			
			//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
			ca.actualizar(datos,sitioCarga);
		}
	};
	
		 
		
	/**
	 * Función que envia el Id de una lista de ejército a eliminar.
	 */
	function deleteLista(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.listaAEliminar = form.innerHTML;
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};
	

	/**
	 * Función que envía el Id de una lista de ejército que se quiere modificar.
	 */
	function editLista(){
    	//Creamos el objeto con los datos
		var datos = new Object();
		
		datos.modificarLista = form.innerHTML;
		
		//Lo convertimos a texto
		datos = JSON.stringify(datos);
		console.log(datos);
		
		//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
		ca.actualizar(datos,sitioCarga);
	};
	
	
	/**
	 * Método que se ejecuta cuando se produce un cambio en la lista.
	 * Tiene como objetivo establecer la puntuacion de la lista.
	 * 
	 * @param e Event - Evento que disparó la función.
	 */
	function cambios(){
		console.log("Evaluando Cambios Lista.");
		var elementos = document.getElementsByClassName("puntosTP");
		var nombreTropa = document.getElementsByClassName("nombreTP");
		
		var sumaPts = 0;
		
		//Verificamos todos los elementos de la lista.
		for(var i=0;i<elementos.length;i++){
			//Solo evaluamos aquellos de los que se ha indicado nombre, los demas se ignoran.
			if(nombreTropa[i].value != ""){
				//Si la puntuacion no es un número o esta vacía, sustituimos el valor por el texto "Error"
				if(isNaN(elementos[i].value) || elementos[i].value == ""){
					elementos[i].value = "Error";
				}
				//Si todo es correcto, aumentamos la puntuacion.
				else{
					sumaPts += parseInt(elementos[i].value);
				}
			}
		}
		document.getElementById("puntosLista").innerHTML = sumaPts;
	};
	
	
	/**
	 * Función que genera un array de datos relacionados.
	 * Estos datos a menudo se encuentran en un macro formulario.
	 * 
	 * @param datos - Objeto al que asignaremos el nuevo conjunto.
	 * @param nombreDato - Atributo name que se asocia al dato. 
	 */
	function conjuntoDatos(datos,nombreDato){
		var elementoDato = document.getElementsByClassName(nombreDato);
		for(var i=0 ; i<elementoDato.length ; i++){
			//La posicion siguiente a la apertura del corchete
			var indexBegin = elementoDato[i].name.indexOf("[")+1;
			
			//La longitud total, menos lo que ocupa hasta el primer corchete, contandolo, y menos el corchete final.
			var longitudIndex = elementoDato[i].name.length - elementoDato[i].name.indexOf("[") - 2;
			
			//Asignamos el indice de la variable dentro del objeto
			var index = elementoDato[i].name.substr(indexBegin,longitudIndex);
			
			//Damos valor a dicho indice
			
			if(elementoDato[i].type == 'checkbox'){
				datos[nombreDato][index] = elementoDato[i].checked;
			}
			else{
				datos[nombreDato][index] = elementoDato[i].value;
			}
			
		}
		return datos;
	}
	
	/**
	 * Función que envia todos los datos que componen una lista de ejército.
	 * 
	 * Primero declaramos los conjuntos de datos que existen.
	 * Usamos una tabulación para indicar que algunos datos están relacionados gerárquicamente.
	 * Tras declarar los objetos, los inicializamos mediante la función conjuntoDatos().
	 * 
	 * @see conjuntoDatos()
	 * @see Documentacion Externa - Guía para el Programador Vol.3 (Macroformularios de datos)
	 */
	function datosComponentes(datos){
		//Definimos los diferentes conjuntos de datos
		//datos. = new Object();
		//PERSONAJES
		datos.rangoPersonaje = new Object();
		datos.nombrePersonaje = new Object();
		datos.tipoPersonaje = new Object();
		datos.puntosPersonaje = new Object();
			//Perfil Personaje
			datos.movimientoPersonaje = new Object();
			datos.haPersonaje = new Object();
			datos.hpPersonaje = new Object();
			datos.fPersonaje = new Object();
			datos.rPersonaje = new Object();
			datos.psPersonaje = new Object();
			datos.iPersonaje = new Object();
			datos.aPersonaje = new Object();
			datos.lPersonaje = new Object();
			
			//Perfil Montura Personaje
			datos.monturaPersonaje = new Object();
			datos.movimientoMonturaPersonaje = new Object();
			datos.haMonturaPersonaje = new Object();
			datos.hpMonturaPersonaje = new Object();
			datos.fMonturaPersonaje = new Object();
			datos.rMonturaPersonaje = new Object();
			datos.psMonturaPersonaje = new Object();
			datos.iMonturaPersonaje = new Object();
			datos.aMonturaPersonaje = new Object();
			datos.lMonturaPersonaje = new Object();
		
			//Perfil Maquina Personaje
			datos.maquinaPersonaje = new Object();
			datos.movimientoMaquinariaPersonaje = new Object();
			datos.haMaquinariaPersonaje = new Object();
			datos.hpMaquinariaPersonaje = new Object();
			datos.fMaquinariaPersonaje = new Object();
			datos.rMaquinariaPersonaje = new Object();
			datos.psMaquinariaPersonaje = new Object();
			datos.iMaquinariaPersonaje = new Object();
			datos.aMaquinariaPersonaje = new Object();
			datos.lMaquinariaPersonaje = new Object();
		
			//Perfil Dotacion Personaje
			datos.dotacionPersonaje = new Object();
			datos.movimientoDotacionPersonaje = new Object();
			datos.haDotacionPersonaje = new Object();
			datos.hpDotacionPersonaje = new Object();
			datos.fDotacionPersonaje = new Object();
			datos.rDotacionPersonaje = new Object();
			datos.psDotacionPersonaje = new Object();
			datos.iDotacionPersonaje = new Object();
			datos.aDotacionPersonaje = new Object();
			datos.lDotacionPersonaje = new Object();
		

		//TROPAS
		datos.unidadesTropa = new Object();
		datos.nombreTropa = new Object();
		datos.puntosTropa = new Object();
		datos.tipoTropa = new Object();
		datos.musicoTropa = new Object();
		datos.portaestTropa = new Object();
		datos.champTropa = new Object();
		
			//Perfil Tropa
			datos.movimientoTropa = new Object();
			datos.haTropa = new Object();
			datos.hpTropa = new Object();
			datos.fTropa = new Object();
			datos.rTropa = new Object();
			datos.psTropa = new Object();
			datos.iTropa = new Object();
			datos.aTropa = new Object();
			datos.lTropa = new Object();
		
			//Perfil Montura Tropa
			datos.monturaTropa = new Object();
			datos.movimientoMonturaTropa = new Object();
			datos.haMonturaTropa = new Object();
			datos.hpMonturaTropa = new Object();
			datos.fMonturaTropa = new Object();
			datos.rMonturaTropa = new Object();
			datos.psMonturaTropa = new Object();
			datos.iMonturaTropa = new Object();
			datos.aMonturaTropa = new Object();
			datos.lMonturaTropa = new Object();

			//Perfil Maquina Tropa
			datos.maquinaTropa = new Object();
			datos.movimientoMaquinariaTropa = new Object();
			datos.haMaquinariaTropa = new Object();
			datos.hpMaquinariaTropa = new Object();
			datos.fMaquinariaTropa = new Object();
			datos.rMaquinariaTropa = new Object();
			datos.psMaquinariaTropa = new Object();
			datos.iMaquinariaTropa = new Object();
			datos.aMaquinariaTropa = new Object();
			datos.lMaquinariaTropa = new Object();
			
		/***************************************************************************************************
		 * IMPORTANTE, 
		 * EL CODIGO POSTERIOR SOLO ES UNA REPETICION
		 * ASOCIADA A LOS CONJUNTOS DE DATOS DEFINIDOS PREVIAMENTE
		 */
		//Tratamos los conjuntos anteriores
		//PERSONAJES
		datos = conjuntoDatos(datos,'rangoPersonaje');
		datos = conjuntoDatos(datos,'nombrePersonaje');
		datos = conjuntoDatos(datos,'tipoPersonaje');
		datos = conjuntoDatos(datos,'puntosPersonaje');
		
			//Perfil Personaje
			datos = conjuntoDatos(datos,'movimientoPersonaje');
			datos = conjuntoDatos(datos,'haPersonaje');
			datos = conjuntoDatos(datos,'hpPersonaje');
			datos = conjuntoDatos(datos,'fPersonaje');
			datos = conjuntoDatos(datos,'rPersonaje');
			datos = conjuntoDatos(datos,'psPersonaje');
			datos = conjuntoDatos(datos,'iPersonaje');
			datos = conjuntoDatos(datos,'aPersonaje');
			datos = conjuntoDatos(datos,'lPersonaje');
			
			//Perfil Montura Personaje
			datos = conjuntoDatos(datos,'monturaPersonaje');
			datos = conjuntoDatos(datos,'movimientoMonturaPersonaje');
			datos = conjuntoDatos(datos,'haMonturaPersonaje');
			datos = conjuntoDatos(datos,'hpMonturaPersonaje');
			datos = conjuntoDatos(datos,'fMonturaPersonaje');
			datos = conjuntoDatos(datos,'rMonturaPersonaje');
			datos = conjuntoDatos(datos,'psMonturaPersonaje');
			datos = conjuntoDatos(datos,'iMonturaPersonaje');
			datos = conjuntoDatos(datos,'aMonturaPersonaje');
			datos = conjuntoDatos(datos,'lMonturaPersonaje');
		
			//Perfil Maquina Personaje
			datos = conjuntoDatos(datos,'maquinaPersonaje');
			datos = conjuntoDatos(datos,'movimientoMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'haMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'hpMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'fMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'rMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'psMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'iMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'aMaquinariaPersonaje');
			datos = conjuntoDatos(datos,'lMaquinariaPersonaje');
		
			//Perfil Dotacion Personaje
			datos = conjuntoDatos(datos,'dotacionPersonaje');
			datos = conjuntoDatos(datos,'movimientoDotacionPersonaje');
			datos = conjuntoDatos(datos,'haDotacionPersonaje');
			datos = conjuntoDatos(datos,'hpDotacionPersonaje');
			datos = conjuntoDatos(datos,'fDotacionPersonaje');
			datos = conjuntoDatos(datos,'rDotacionPersonaje');
			datos = conjuntoDatos(datos,'psDotacionPersonaje');
			datos = conjuntoDatos(datos,'iDotacionPersonaje');
			datos = conjuntoDatos(datos,'aDotacionPersonaje');
			datos = conjuntoDatos(datos,'lDotacionPersonaje');
		

		//TROPAS
		datos = conjuntoDatos(datos,'unidadesTropa');
		datos = conjuntoDatos(datos,'nombreTropa');
		datos = conjuntoDatos(datos,'puntosTropa');
		datos = conjuntoDatos(datos,'tipoTropa');
		datos = conjuntoDatos(datos,'musicoTropa');
		datos = conjuntoDatos(datos,'portaestTropa');
		datos = conjuntoDatos(datos,'champTropa');
		
			//Perfil Tropa
			datos = conjuntoDatos(datos,'movimientoTropa');
			datos = conjuntoDatos(datos,'haTropa');
			datos = conjuntoDatos(datos,'hpTropa');
			datos = conjuntoDatos(datos,'fTropa');
			datos = conjuntoDatos(datos,'rTropa');
			datos = conjuntoDatos(datos,'psTropa');
			datos = conjuntoDatos(datos,'iTropa');
			datos = conjuntoDatos(datos,'aTropa');
			datos = conjuntoDatos(datos,'lTropa');
		
			//Perfil Montura Tropa
			datos = conjuntoDatos(datos,'monturaTropa');
			datos = conjuntoDatos(datos,'movimientoMonturaTropa');
			datos = conjuntoDatos(datos,'haMonturaTropa');
			datos = conjuntoDatos(datos,'hpMonturaTropa');
			datos = conjuntoDatos(datos,'fMonturaTropa');
			datos = conjuntoDatos(datos,'rMonturaTropa');
			datos = conjuntoDatos(datos,'psMonturaTropa');
			datos = conjuntoDatos(datos,'iMonturaTropa');
			datos = conjuntoDatos(datos,'aMonturaTropa');
			datos = conjuntoDatos(datos,'lMonturaTropa');

			//Perfil Maquina Tropa
			datos = conjuntoDatos(datos,'maquinaTropa');
			datos = conjuntoDatos(datos,'movimientoMaquinariaTropa');
			datos = conjuntoDatos(datos,'haMaquinariaTropa');
			datos = conjuntoDatos(datos,'hpMaquinariaTropa');
			datos = conjuntoDatos(datos,'fMaquinariaTropa');
			datos = conjuntoDatos(datos,'rMaquinariaTropa');
			datos = conjuntoDatos(datos,'psMaquinariaTropa');
			datos = conjuntoDatos(datos,'iMaquinariaTropa');
			datos = conjuntoDatos(datos,'aMaquinariaTropa');
			datos = conjuntoDatos(datos,'lMaquinariaTropa');
			
		/***********************************************************************************************************/
		
		return datos;
	};
	
		
	
	/**
	 * Función que envia los datos que se cambian en un perfil.
	 * ATENCIÓN, COMUNICACIÓN SÍNCRONA.
	 */
	function saveEditPerfil(){
		//Establecemos una variable de tipo interruptor suponiendo los contenidos correctos.
		var correcto = true;
		
		//Establecemos una variable msg. Este div mostrara mensajes de error en caso de que el formulario de problemas.
		var msg = document.getElementById("mensaje");
		msg.innerHTML = "";
		
		
		//Procedemos a validar los diferentes campos:

		
		//Email
		var erMail = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
		var mail = document.getElementById("newMail").value;
		
		//Si no se cumple que el email cumpla con su expresión regular o esté vacío,
		//añadimos un mensaje de error y establecemos correcto = false.
		if(!(erMail.test(mail) || mail.length == 0)){
			  correcto = false;
			  msg.innerHTML += "Has introducido un email incorrecto:<br/>";
			  msg.innerHTML += "Procura introducirlo en minúsculas.<br/><br/>";
		}
		
		
		//Password
		var erPass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
		var pass = document.getElementById("newPass");
		var passConf = document.getElementById("newPassConf");		
		
		//Si no se cumplen que la contraseña cumpla con su expresión regular o esté vacío,
		//añadimos un mensaje de error y establecemos correcto = false.
		if(!(erPass.test(pass.value) || pass.value.length == 0)){
			  correcto = false;
			  msg.innerHTML += "Has Introducido una contraseña incorrecta. Recuerda:<br/>";
			  msg.innerHTML += "Las contraseñas han de tener al menos 6 carácteres e incluir mayúsculas, minúsculas y números.<br/><br/>";
		}
		//La contraseña y su confirmación han de coincidir
		else if(pass.value != passConf.value){
			correcto = false;
			msg.innerHTML += "La contraseña y su confirmación no coinciden.<br/><br/>";
		}
		//Si todo es correcto procedemos a enviar la password
		else if(pass.value.length != 0){
			// Crea una entrada de elemento nuevo, esta ser� nuestro campo de contrase�a con hash.
			var np = document.createElement("input");

			// Agrega el elemento nuevo a nuestro formulario.
			form.appendChild(np);
			np.name = "np";
			np.type = "hidden";
			np.value = hex_sha512(pass.value);
			
			//nos aseguramos de que no se envien las contraseñas sin encriptar
			pass.value = "";
			passConf.value = "";
		}
		

		//Avatar desde url
		var erAvatarUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/;
		var avatarUrl = document.getElementById("avatarUrl").value;
		
		//Si no se cumple que el email cumpla con su expresión regular o esté vacío,
		//añadimos un mensaje de error y establecemos correcto = false.
		if(!(erAvatarUrl.test(avatarUrl) || avatarUrl.length == 0)){
			  correcto = false;
			  msg.innerHTML += "La url introducida para el avatar es invalida.<br/><br/>";
		}

		//Chequeamos el contenido del nombre, la firma y el grito y lo editamos si es necesario.
		document.getElementById("newName").value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]+/,"");
		document.getElementById("firma").value.replace(/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ¡!¿?\"' \-]+/,"");
		//"El IDE eclipse no identifica correctamente las contrabarras dentro de las expresiones regulares.
		document.getElementById("grito").value.replace(/[^a-zA-Z0-9_.,:áéíóúüñÁÉÍÓÚÜÑ¡!¿?\"' \-]+/,"");
		//"Este comillado no tiene utilidad más que para ver el codigo posterior de forma legible.
		
		if(correcto){
			//Si los datos eran correctos, se procede a emitir el formulario.
			var c = document.createElement("input");
	
			// Agrega el elemento nuevo a nuestro formulario.
			form.appendChild(c);
			c.name = "changes";
			c.type = "hidden";
			c.value = correcto;
			
			form.submit();
		}
	};
			
			 
			
	/**
	 * Función para el envio de mensajes internos del sitio web.
	 * Valida los diferentes campos.
	 */
	 
	function sendMsg() {
		//Identificamos al usuario
		var destinatario = parseInt(elementoId.substr(4));
		if(!isNaN(destinatario)){
			//Verificamos el titulo.
			var topic = document.getElementById(elementoId+"topic").value;
			//Si no tuviese asunto, lo indicamos.
			if(topic == ""){
				topic = "Sin Asunto";
			}
			
			var content = document.getElementById(elementoId+"content").value;
			if(content != ""){
				//Creamos el objeto con los datos
				var datos = new Object();
				
				datos.enviarMsg = destinatario;
				datos.topic = topic;
				datos.content = content;
				
				//Lo convertimos a texto
				datos = JSON.stringify(datos);
				console.log(datos);
				
				//Actualizamos los contenidos mediante la conexion asíncrona en función de los datos obtenidos.
				ca.actualizar(datos,sitioCarga);
			}
			else{
				var alerta = document.createElement("div");
				form.appendChild(alerta);
				alerta.id = "mensajeVacio"+destinatario;
				alerta.className = "alerta";
				alerta.innerHTML = "No se pueden enviar mensajes vacios.";
				var nuevaAlerta = new Alerta(alerta.id);
				correcto = false;
			}
		}
	};
	

	/**
	 * Función que nos abre en una nueva ventana una partida.
	 * 
	 * Para poder definir la partida añadimos un pseudo-parámetro a la url.
	 * Este parámetro se testea y valida numerosas veces y luego se usa para generar el archivo de la función.
	 * En caso de intentar acceder a una partida para la que no se tienen permisos,
	 * se asignará una falta al usuario.
	 */
	function accederPartida(){
		document.cookie = "FBGpartida="+document.getElementById("accesoPartida").value;
		
		window.open("partida.php");
	};
};