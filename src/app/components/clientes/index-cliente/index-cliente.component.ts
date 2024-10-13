import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css'],
})
export class IndexClienteComponent implements OnInit {
  public clientes: Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';
  public loadData = true;

  public page = 1;
  public pageSize = 10;

  public token: any;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this._clienteService
      .listar_clientes_filtro_admin(null, null, this.token)
      .subscribe(
        (response) => {
          this.clientes = response.data;
          this.loadData = false;
          /* setTimeout(() => {

        }, 3000) */
        },
        (error) => {
          console.log(error);
        }
      );
  }

  filtro(tipo: string): void {
    if (tipo == 'apellidos') {
      this.loadData = true;
      if (this.filtro_apellidos) {
        this._clienteService
          .listar_clientes_filtro_admin(tipo, this.filtro_apellidos, this.token)
          .subscribe(
            (response) => {
              this.clientes = response.data;
              this.loadData = false;
            },
            (error) => {
              console.log(error);
            }
          );
      } else {
        this.initData();
      }
    } else if (tipo == 'correo') {
      this.loadData = true;
      if (this.filtro_correo) {
        this._clienteService
          .listar_clientes_filtro_admin(tipo, this.filtro_correo, this.token)
          .subscribe(
            (response) => {
              this.clientes = response.data;

              this.loadData = false;
            },
            (error) => {
              console.log(error);
            }
          );
      } else {
        this.initData();
      }
    }
  }

  eliminar(id: any) {
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe(
      (response) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el cliente.',
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this.initData();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
