import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CuponService } from 'src/app/services/cupon.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones: Array<any> = [];

  public loadData = true;
  public filtro = '';
  public page = 1;
  public pageSize = 10;

  public token;

  constructor(
    private _adminService: AdminService,
    private _cuponService: CuponService
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.loadData = false;
      }
    )
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response => {
        this.cupones = response.data;
        this.loadData = false;
      }
    )
  }

  eliminar(id: any){
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el cupón.',
        });
        
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
          response => {
            this.cupones = response.data;
            this.loadData = false;
          }
        )

      },
      (error) => {
        console.log(error);
      }
    );
  }
}
