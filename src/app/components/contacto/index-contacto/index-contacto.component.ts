import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  public mensajes: Array<any> = [];

  public loadData = true;
  public filtro = '';
  public page = 1;
  public pageSize = 10;

  public token;

  public loadBtn = false;

  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
   this.initData();
  }

  initData() {
     this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response => {
        this.mensajes = response.data;
        this.loadData = false;
      }
    )
  }

  cerrar(id: any){
    this.loadBtn = true;
      this._adminService.cerrar_mensaje(id,{data: undefined}, this.token).subscribe(
        (response) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se cerró correctamente el mensaje.',
          });
          
          $('#estadoModal-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          
          this.initData();
          this.loadBtn = false;
          
        },
        (error) => {
          console.log(error);
        }
      );
    
  }
}
