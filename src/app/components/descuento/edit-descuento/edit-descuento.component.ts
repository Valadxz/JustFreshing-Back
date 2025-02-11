import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrls: ['./edit-descuento.component.css']
})
export class EditDescuentoComponent  implements OnInit {

  public descuento: any = {};
  public file:any=undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';
  public token;
  public load_btn = false;
  public configGlobal: any = {};

  public id: any;
  public url: any;
  constructor(private _descuentoService: DescuentoService, private _adminService: AdminService, private _router: Router, private _route: ActivatedRoute){
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
    
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        console.log(this.id);
        this._descuentoService.obtener_descuento_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.descuento = undefined;
            } else{
              this.descuento = response.data;
              this.imgSelect = this.url + 'obtener_banner_descuento/' + this.descuento.banner;
            }
            
          }, error => {
            console.log(error);
          }
        )
      }
    )
  }

  actualizar(actualizarForm: any){
   if(actualizarForm.valid){
      
      var data: any = {};

      if(this.descuento.descuento >= 1 && this.descuento.descuento <= 100){
        if(this.file != undefined){
          data.banner = this.file;
        }
        
        data.titulo = this.descuento.titulo;
        data.descuento = this.descuento.descuento;
        data.fecha_inicio = this.descuento.fecha_inicio;
        data.fecha_fin = this.descuento.fecha_fin;
        
        this.load_btn = true;
  
        this._descuentoService.actualizar_descuento_admin(data, this.id, this.token).subscribe(
          response => { 
            console.log(response);
            
            iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el descuento'
          });
  
          this.load_btn = false;
          
          this._router.navigate(['/panel/descuentos']);
          }, error => {
            console.log(error);
            this.load_btn = false;
          }
        );
  
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'El descuento debe ser entre 1% a 100%',
          icon: 'fa fa-warning',
        }); 
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
