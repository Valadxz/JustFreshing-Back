import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public token: any;
  public totalGanancia = 0;
  public total_mes = 0;
  public total_mes_anterior = 0;
  public count_ventas = 0;

  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this._adminService
      .kpi_ganancias_mensuales_admin(this.token)
      .subscribe((response) => {

        this.totalGanancia = response.totalGanancia;
        this.total_mes = response.total_mes;
        this.count_ventas = response.count_ventas;
        this.total_mes_anterior = response.total_mes_anterior;
        
        var canvas = <HTMLCanvasElement>document.getElementById('myChart');
        var ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre',
            ],
            datasets: [
              {
                label: 'Total de ventas por mes',
                data: [
                  response.enero,
                  response.febrero,
                  response.marzo,
                  response.abril,
                  response.mayo,
                  response.junio,
                  response.julio,
                  response.agosto,
                  response.septiembre,
                  response.octubre,
                  response.noviembre,
                  response.diciembre,
                ],

                backgroundColor: [
                  'rgba(128,0,0)',
                  'rgba(139,0,0, 0.9)',
                  'rgba(165,42,42)',
                  'rgba(178,34,34)',
                  'rgba(220,20,60)',
                  'rgba(255,0,0)',
                  'rgba(255,99,71)',
                  'rgba(255,127,80)',
                  'rgba(205,92,92)',
                  'rgba(240,128,128)',
                  'rgba(233,150,122)',
                  'rgba(250,128,114)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
}
