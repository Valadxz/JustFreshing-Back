import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {
  
  public cupon: any = {
    tipo: ''
  };
  public token;

  public loadBtn = false;

  constructor(private _cuponService: CuponService, private _router: Router){
    this.token = localStorage.getItem('token');
  }
  ngOnInit(): void {
  }

  registro(registroForm: any){
    if(registroForm.valid){
      this.loadBtn = true;
      console.log(this.cupon);
      
      this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe(
        response => {
          iziToast.show({
          title: 'SUCCESS',
          titleColor: '#008000',
          class: 'text-success',
          position: 'topRight',
          message: 'Se registró correctamente el nuevo cupón.'
        });
        this.loadBtn = false;
        this._router.navigate(['/panel/cupones']);
        
        }, error => {      
          console.log(error);
          this.loadBtn = false;
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
