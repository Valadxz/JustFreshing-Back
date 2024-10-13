import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { v4 as uuidv4 } from 'uuid';


declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token;
  public config: any = {};

  public tituloCat = '';
  public iconoCat = '';

  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = '';

  public url;

  constructor(private _adminService: AdminService, 
    private _router: Router){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_admin(this.token).subscribe(
      response => {
        this.config = response.data;
        this.imgSelect = this.url + "obtener_logo/" + this.config.logo;
        console.log(this.config);
      }, error => {
        console.log(error);
      }
    )
  }
  ngOnInit(): void {
  }

  agregar_cat(){
    if(this.tituloCat && this.iconoCat){
      console.log(uuidv4());
      
      this.config.categorias.push({
        titulo: this.tituloCat,
        icono: this.iconoCat,
        _id: uuidv4()
      });

      this.tituloCat = '';
      this.iconoCat = '';

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar título e icono de la categoria',
        icon: 'fa fa-warning',
      });
    }
  }

  actualizar(confForm: any){
    if(confForm.valid){
      let data = {
        titulo: confForm.value.titulo,
        serie: confForm.value.serie,
        correlativo: confForm.value.correlativo,
        categorias: this.config.categorias,
        logo: this.file
      }

      this._adminService.actualizar_config_admin('6423c7cb60bfa370d90b82c9', data, this.token).subscribe(
        response => { 
          iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizó correctamente la configuración.'
        });
        }
      )
      
        this.reloadCurrentRoute();
      
      } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingresa todos los datos del formulario',
        icon: 'fa fa-warning',
      });
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this._router.navigate([currentUrl]);
    });
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
        $('.cs-file-drop-icon').addClass('cs-file-drop-preview img-thumbnail rounded');
        $('.cs-file-drop-icon').removeClass('cs-file-drop-icon cxi-upload');

        reader.readAsDataURL(file);
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

  ngDoCheck(): void{
    $('.cs-file-drop-preview').html("<img src=" + this.imgSelect + ">");
  }

  eliminar_categoria(idx: any){
    this.config.categorias.splice(idx, 1);
  }
}
