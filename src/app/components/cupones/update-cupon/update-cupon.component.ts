import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;
@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {
 
  public cupon: any = {
    tipo: ''
  };
  public token;

  public loadBtn = false;
  public _id: any;

  public loadData = false;

  constructor(private _cuponService: CuponService, private _router: Router, private _route: ActivatedRoute) {
    this.token = localStorage.getItem('token');
  }
  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this._id = params['id'];
        console.log(this._id);
        
        this._cuponService.obtener_cupon_admin(this._id, this.token).subscribe(
          response => {
            if(response.data == undefined){
              this.cupon = undefined;
              this.loadData = false;
            } else {
              this.cupon = response.data;
            }
            console.log(this.cupon);
            
          }, error => {
            console.log(error);
          }
        );

      } 
    )
  }

  actualizar(actualizarForm: any){
    if(actualizarForm.valid){
      
      this.loadBtn = true;
      this._cuponService.actualizar_cupon_admin(this._id, this.cupon, this.token).subscribe(
        response => {iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizó correctamente el cupón.'
        });
          this.loadBtn = false;
          this._router.navigate(['/panel/cupones']);
        }, error => {
          console.log(error);
        }
          
      )
      
    } else {
      
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
