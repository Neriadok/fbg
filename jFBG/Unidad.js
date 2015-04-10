/**
 * Clase que nos genera unidades en el juego.
 *
 * Una unidad es un individuo, un soldado, animal, maquina o monstruo
 * que forma parte de la batalla.
 * 
 * @author Daniel Mart�n D�az
 * @version 1.1 (23/07/2014)
 */
function Unidad(unidadId){
	/*VARIABLES*/
	//Car�cter�sticas
	var peana = document.getElementById(unidadId+"peana").innerHTML;
	var representada = document.getElementById(unidadId+"representada").innerHTML;
	var rango = document.getElementById(unidadId+"rango").innerHTML;
		
	
	
	//Atributos
	var m = parseInt(document.getElementById(unidadId+"movimiento").innerHTML);
	
	
	/*GETTERS*/
	/**
	 * 
	 */
	this.getPeana = function(){
		return parseInt(peana);
	};
	
	/**
	 * 
	 */
	this.getRango = function(){
		return parseInt(rango);
	};
	
	/**
	 * 
	 */
	this.getMovimiento = function(){
		if(representada=="si") return m*20;
		else return Number.MAX_VALUE;
	};
	
	
	/*M�TODOS INTERNOS*/
	
		
	
	/*METODOS DE INTERACTUACION*/
	/**
	 * 
	 */
	this.posicionar = function(x,y,tipo,situacion,zoom,user){
		if(representada=="si"){
			situacion.linewidth=4;
			
			if(user){
				situacion.fillStyle = "blue";
			}
			else{
				situacion.fillStyle = "red";
			}
			
			if(tipo=="caballeria"||tipo=="carro"){
				situacion.fillRect(x,y,peana*zoom,peana*2*zoom);
				situacion.strokeRect(x,y,peana*zoom,peana*2*zoom);
			}
			else{
				situacion.fillRect(x,y,peana*zoom,peana*zoom);
				situacion.strokeRect(x,y,peana*zoom,peana*zoom);
			}
		}
	}
};