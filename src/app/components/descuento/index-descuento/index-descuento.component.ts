import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {

  public loadData = true;
  public filtro = '';
  public token: any;
  public descuentos: Array<any> = []; //
  public arr_descuentos: Array<any> = []; //
  public url: any;

  public page = 1;
  public pageSize = 10;
  public load_btn = false;

  constructor(private _descuentoService: DescuentoService){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._descuentoService.listar_descuentos_admin(this.filtro, this.token).
    subscribe(response => {
      this.descuentos = response.data;
      
      this.descuentos.forEach(element => {
        var tt_inicio = Date.parse(element.fecha_inicio + "T00:00:00")/1000;
        var tt_fin = Date.parse(element.fecha_fin + "T00:00:00")/1000;

        var today = Date.parse(new Date().toString())/1000;
  
        if(today > tt_inicio){
          element.estado = 'Expirado';
        }
        if(today < tt_inicio){
          element.estado = 'Proximamente';
        }
        if(today >= tt_inicio && today <= tt_fin){
          element.estado = 'En progreso';
        }
        
      })

      this.loadData = false;
    }, error => {
      console.log(error);
    })
  }  

  filtrar() {
    if(this.filtro){
      this._descuentoService.listar_descuentos_admin(this.filtro, this.token).
    subscribe(response => {
      console.log(response);
      this.descuentos = response.data;
      this.loadData = false;
    }, error => {
      console.log(error);
    })
    } else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay un título que buscar.',
        icon: 'fa fa-warning',
      });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any){
    this.load_btn = true;
    this._descuentoService.eliminar_descuento_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el descuento.',
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn = false;
        this.init_data();
      },
      (error) => {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#fff',
          class: 'text-success',
          position: 'topRight',
          message: 'Ocurrió un error en el servidor.',
        });
        console.log(error);
        this.load_btn = false;
      }
    );
  }

}
