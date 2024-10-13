import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {
  
  public cliente: any = {
    genero: ''
  };

  public token;
  public loadBtn = false;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService, 
    private _router: Router){
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  registro(registroForm: any) {
    if(registroForm.valid){
      console.log(this.cliente);
      this.loadBtn = true;
      this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se registró correctamente el nuevo cliente.'
          });
        }, error => {
          console.log(error);
        }
      );
      this.cliente = {
        genero: '',
        nombres: '',
        apellidos: '',
        f_nacimiento: '',
        telefono: '',
        dni: '',
        email: ''
      } 
      this.loadBtn = false;
      this._router.navigate(['/panel/clientes']);
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
