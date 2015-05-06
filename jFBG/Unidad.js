/**
 * Clase que nos genera unidades en el juego.
 *
 * Una unidad es un individuo, un soldado, animal, maquina o monstruo
 * que forma parte de la batalla.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Unidad(tropaId, classNameFichas, selected, indice, subirRango){
	/*VARIABLES*/
	//Car�cter�sticas
	var fichasComponentes = document.getElementsByClassName(classNameFichas);
	var componente = [];
	
	iniciarComponentes();
	
	/*GETTERS*/
	/**
	 * 
	 */
	this.getPeana = function(){
		var peana = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRepresentada()){
				peana += componente[i].getPeana();
			}
		}
		return parseInt(peana);
	};
	
	/**
	 * 
	 */
	this.getRango = function(){
		var rango = 0;
		for(var i=0; i<componente.length; i++){
			if(componente[i].getRango() > rango){
				rango = componente[i].getRango();
			}
		}
		return parseInt(rango)+subirRango;
	};
	
	/**
	 * 
	 */
	this.getMovimiento = function(){
		/**
		 * En caso de haber montura o bestia de tiro, siempre se toma el movimiento de esta.
		 * En caso contrario se toma el menor de todos.
		 */
		var hayMontura = false;
		var movimiento = Number.MAX_VALUE;
		
		for(var i=0; i<componente.length && !hayMontura; i++){
			if(componente[i].getMovimiento().tipo == "Montura"){
				hayMontura = true;
				movimiento = componente[i].getMovimiento().movimiento;
			}
			else{
				if(componente[i].getMovimiento().movimiento < movimiento){
					movimiento = componente[i].getMovimiento().movimiento;
				}
			}
		}
		
		return movimiento;
	};
	
	/*M�TODOS INTERNOS*/
	function iniciarComponentes(){
		for(var i=0 ; i<fichasComponentes.length ; i++){
			componente[i] = new Componente("componente"+fichasComponentes[i].innerHTML+tropaId, fichasComponentes[i].innerHTML);
			console.log(componente[i].getPeana()+" - "+componente[i].getRepresentada());
		}
	}
		
	
	/*METODOS DE INTERACTUACION*/
	/**
	 * 
	 */
	this.posicionar = function(x,y,tipo,situacion,zoom,user){
		situacion.linewidth=4;
		
		if(user){
			situacion.fillStyle = "blue";
		}
		else{
			situacion.fillStyle = "red";
		}
			
		situacion.fillRect(x, y, this.getPeana()*zoom, this.getPeana()*zoom);
		situacion.strokeRect(x, y, this.getPeana()*zoom, this.getPeana()*zoom);
	}
};