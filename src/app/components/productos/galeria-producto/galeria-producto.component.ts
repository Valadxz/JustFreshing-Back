import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css'],
})
export class GaleriaProductoComponent implements OnInit {
  public producto: any = {};
  public id: any;
  public token: any;
  public loadBtn = false;
  public loadBtnEliminar = false;
  public nueva_variedad = '';
  public url: any;

  public file: any = undefined;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _router: Router
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');

    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this.initData();
    });
  }
  initData() {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
      (response) => {
        if (response.data == undefined) {
          this.producto = undefined;
        } else {
          this.producto = response.data;
        }
      },
      (error) => {}
    );
  }

  ngOnInit(): void {}

  subir_imagen() {
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        _id: uuidv4(),
      };
      console.log(data);
      this._productoService
        .agregar_imagen_galeria_admin(this.id, data, this.token)
        .subscribe((response) => {
          this.initData();
          $('#input-img').val('');
          this.reloadCurrentRoute();
        });
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen.',
        icon: 'fa fa-warning',
      });
    }
  }

  fileChangeEvent(event: any): void {
    let file: any = undefined;
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
    if (file.size <= 4000000) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/jpg' ||
        file.type == 'image/jpeg' ||
        file.type == 'image/webp' ||
        file.type == 'image/gif'
      ) {
        const reader = new FileReader();
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen.',
          icon: 'fa fa-warning',
        });
        $('#input-img').val('');
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede exceder los 4MB.',
        icon: 'fa fa-warning',
      });
      $('#input-img').val('');
      this.file = undefined;
    }
    console.log(this.file);
  }

  eliminar(id: any) {
    this.loadBtnEliminar = true;
    this._productoService
      .eliminar_imagen_galeria_admin(this.id, { _id: id }, this.token)
      .subscribe(
        (response) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente la imagen de la galeria.',
          });
          $('#delete-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          this.loadBtnEliminar = false;
          this.initData();
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
          this.loadBtnEliminar = false;
        }
      );
  }

  reloadCurrentRoute() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }
}
