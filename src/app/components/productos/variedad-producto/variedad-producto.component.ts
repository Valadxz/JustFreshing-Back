import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;
@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})

export class VariedadProductoComponent implements OnInit {
  public producto: any = {};
  public id: any;
  public token: any;
  public loadBtn = false;
  public nueva_variedad = '';
  public url: any;

  constructor(private _route: ActivatedRoute, private _productoService: ProductoService, private _router: Router){
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');

    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            } else{
              this.producto = response.data;
              
            }
            
          }, error => {
          }
        )
      }
    )  

  }

  ngOnInit(): void {
  }

  agregar_variedad(){
    if(this.nueva_variedad){
      console.log(this.nueva_variedad);
      this.producto.variedades.push({ titulo: this.nueva_variedad });
      this.nueva_variedad = '';

    } else {
      
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingresa el campo de variedad.',
      });
    }
  }

  eliminar_variedad(idx: any){
    this.producto.variedades.splice(idx, 1);
  }

  actualizar(){
    if(this.producto.titulo_variedad) {
      if(this.producto.variedades.length >= 1) {
        // Actualizar
        this.loadBtn = true;
        this._productoService.actualizar_producto_variedades_admin(this.id, {
          titulo_variedad: this.producto.titulo_variedad,
          variedades: this.producto.variedades
        }, this.token).subscribe(response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#008000',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizaron correctamente las variedades'
          });

          this.loadBtn = false; 
          this.reloadCurrentRoute();

        })
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe agregar al menos una variedad.',
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe ingresar el titulo de la variedad.',
      });
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this._router.navigate([currentUrl]);
    });
}

}
