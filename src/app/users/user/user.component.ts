import { Stat } from './../../interfaces/stat.model';
import { UserService } from './../../services/user.service';
import { StatService } from './../../services/stat.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements  OnInit, AfterViewInit {

  @ViewChild('clicks') clicksRef: ElementRef;
  @ViewChild('views') viewsRef: ElementRef;

  form: FormGroup;
  userName = '';

  data: Stat[];

  clicksConfig: any = {};
  viewsConfig: any = {};

  clicksChart: any;
  viewsChart: any;

  constructor(private statService: StatService, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      startDate: new FormControl(new Date('2019-10-01').toISOString().substring(0, 10), Validators.required),
      endDate: new FormControl(new Date('2019-10-31').toISOString().substring(0, 10), Validators.required)
    });

    this.userService.userName$.pipe(take(1)).subscribe( userName => {
      this.userName = userName;
    });
  }

  ngAfterViewInit() {

    this.statService.getStatById(this.route.snapshot.params.id).subscribe( data => {

      this.data = data;

      this.clicksConfig.labels = data.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
      this.clicksConfig.data = data.map(item => item.clicks);
      const clicksCtx = this.clicksRef.nativeElement.getContext('2d');
      clicksCtx.canvas.height = '400px';
      this.clicksChart = new Chart(clicksCtx, this.graphConfig(this.clicksConfig));

      this.viewsConfig.labels = data.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
      this.viewsConfig.data = data.map(item => item.page_views);
      const viewsCtx = this.viewsRef.nativeElement.getContext('2d');
      viewsCtx.canvas.height = '400px';
      this.viewsChart = new Chart(viewsCtx, this.graphConfig(this.viewsConfig));

    });

  }

  onSubmit() {
    if (new Date(this.form.value.startDate) > new Date(this.form.value.endDate)) {
      return;
    }
    const tmpData = this.data.filter(item => {
      return ((new Date(item.date) >= new Date(this.form.value.startDate) && (new Date(item.date) <= new Date(this.form.value.endDate))));
    });

    this.clicksChart.data.labels = tmpData.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
    this.clicksChart.data.datasets[0].data = tmpData.map(item => item.clicks);
    this.clicksChart.update();

    this.viewsChart.data.labels = tmpData.map(item =>  moment(new Date(item.date)).format('DD-MMM-YYYY'));
    this.viewsChart.data.datasets[0].data = tmpData.map(item => item.page_views);
    this.viewsChart.update();
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
