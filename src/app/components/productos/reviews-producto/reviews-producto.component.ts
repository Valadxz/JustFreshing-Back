import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css']
})
export class ReviewsProductoComponent implements OnInit {
  
  public id: any; 
  public token;
  public producto: any = {};
  public reviews: Array<any> = [];
  public _idUser;
  public load_btn = false;
  public url: any;

  public page = 1;
  public pageSize = 5;

  constructor(private _route: ActivatedRoute, private _productoService: ProductoService){
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._idUser = localStorage.getItem('_id');
    console.log(this._idUser);
    
  }
 
  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.producto = undefined;
            } else{
              this.producto = response.data;
              
              this._productoService.obtener_reviews_producto_publico(this.id).subscribe(
                response => {
                  this.reviews = response.data;
                }
              )
            }
            
          }, error => {
          }
        )
      }
    )  
  }


}
