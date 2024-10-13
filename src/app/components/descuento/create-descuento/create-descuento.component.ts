import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrls: ['./create-descuento.component.css']
})
export class CreateDescuentoComponent implements OnInit {

  public descuento: any = {};
  public file:any=undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';
  public token;
  public load_btn = false;
  public configGlobal: any = {};

  constructor(private _descuentoService: DescuentoService, private _adminService: AdminService, private _router: Router){
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response => {
        this.configGlobal = response.data;
      }
    )
  }
  ngOnInit(): void {
  }

  registro(registroForm: any ){
    if(registroForm.valid){
      if(this.file == undefined){
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debes subir una portada para registrar el descuento.',
          icon: 'fa fa-warning',
        });
      } else {
        if(this.descuento.descuento >= 1 && this.descuento.descuento <= 100){
          this.load_btn = true;
          this._descuentoService.registro_descuento_admin(this.descuento, this.file, this.token).subscribe(
            response => { 
              iziToast.show({
              title: 'SUCCESS',
              titleColor: '#008000',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo producto.'
            });
            
            this.load_btn = false;
            this._router.navigate(['/panel/descuentos']);
            }, error => {
              console.log(error);
              this.load_btn = true;
            }
          )
        } else{
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'El descuento debe ser entre 1% a 100%',
            icon: 'fa fa-warning',
          }); 
        }
        
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingresa todos los campos',
        icon: 'fa fa-warning',
      });
      
      this.load_btn = false;

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
  }

  fileChangeEvent(event: any): void{
    let file :any = undefined;
    if (event.target.files && event.target.files.length > 0) {
      file = <File>event.target.files[0];
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen de envío.',
        icon: 'fa fa-warning',
      });
    }
    if(file.size <= 4000000){
      if(file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/webp' || file.type == 'image/gif'){
        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        // console.log(this.imgSelect);
        reader.readAsDataURL(file);
        $('#input-portada').text(file.name)

        this.file = file;
      } else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen.',
          icon: 'fa fa-warning',
        });
        $('#input-portada').text('Seleccionar imagen');
          this.imgSelect = 'assets/img/01.jpg';
          this.file = undefined;
      }
    } else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede exceder los 4MB.',
        icon: 'fa fa-warning',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    console.log(this.file);
    
  }
}
