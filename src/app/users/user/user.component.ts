import { StatService } from './../../services/stat.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements  AfterViewInit {

  @ViewChild('clicks') clicksRef: ElementRef;
  @ViewChild('views') viewsRef: ElementRef;

  constructor(private statService: StatService, private route: ActivatedRoute) { }

  ngAfterViewInit() {

    const clicksConfig: any = {};
    const viewsConfig: any = {};

    this.statService.getStatById(this.route.snapshot.params.id).subscribe( data => {

      clicksConfig.labels = data.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
      clicksConfig.data = data.map(item => item.clicks);
      const clicksCtx = this.clicksRef.nativeElement.getContext('2d');
      clicksCtx.canvas.height = '400px';

      viewsConfig.labels = data.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
      viewsConfig.data = data.map(item => item.page_views);
      const viewsCtx = this.viewsRef.nativeElement.getContext('2d');
      viewsCtx.canvas.height = '400px';

      const clicksChart = new Chart(clicksCtx, this.graphConfig(clicksConfig));
      const viewsChart = new Chart(viewsCtx, this.graphConfig(viewsConfig));

    });

  }

  graphConfig({labels, data}) {
    return {
      type: 'line',
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: '#F1F1F1'
            },
              ticks: {
                  fontColor: '#CCCCCC',
                  fontSize: 16,
                  fontFamily: 'Montserrat'
              }
          }],
          xAxes: [{
            gridLines: {
              color: '#FFFFFF'
            },
            ticks: {
                fontColor: '#CCCCCC',
                fontSize: 16,
                fontFamily: 'Montserrat'
            }
        }]
        }
      },
      data: {
        labels,
        datasets: [
          {
            label: 'Clicks',
            data,
            borderColor: '#3A80BA',
            steppedLine: false,
            fill: false,
            borderWidth: 4
          }
        ]
      }
    };
  }

}
