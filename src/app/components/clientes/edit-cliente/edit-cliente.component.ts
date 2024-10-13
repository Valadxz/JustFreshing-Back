import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;
@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente: any = {};
  public _id: any;
  public token: any;
  
  public loadBtn = false;
  public loadData = true;
  
  constructor(
    private _route: ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router
  ){
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this._id = params['id'];
        console.log(this._id);
        this._clienteService.obtener_cliente_admin(this._id, this.token).subscribe(
          response => {
            console.log(response);
            if(response.data == undefined){
              this.cliente = undefined;
              this.loadData = false;
            } else{
              this.cliente = response.data;
              this.loadData = false;
            }
          }, error => {
          }
        );
      } 
    )
  }

  actualizar(updateForm: any){
    if(updateForm.valid){
      this.loadBtn = true;
      this._clienteService.actualizar_cliente_admin(this._id, this.cliente, this.token).subscribe(
        response => {
          console.log(response);
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el cliente.'
          });
          this.loadBtn = false;
          this._router.navigate(['/panel/clientes']);

        }, error => {
          console.log(error);
          
        }
      );
    } else{
      
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingresa todos los campos',
        icon: 'fa fa-warning',
      });
    }
  }
}
