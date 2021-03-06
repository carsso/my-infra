import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {DedicatedWidgetService} from './dedicated-widget.service';
import {WidgetsService} from '../widgets.service';
import {DedicatedWidgetContentComponent} from './content/dedicated-widget-content';

@Component({
  selector: 'dedicated-widget',
  templateUrl: 'build/components/widgets/dedicated-widget/dedicated-widget.html',
  directives: [IONIC_DIRECTIVES, DedicatedWidgetContentComponent],
  providers: [DedicatedWidgetService, WidgetsService]
})
export class DedicatedWidgetComponent implements OnChanges, OnInit {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<string> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;
  collapsed: boolean = false;
  tasksLoaded: boolean = false;
  emptyTasks: boolean;
  server: any;
  error: any;
  tasks: Array<any> = [];
  constructor(private dedicatedWidgetService: DedicatedWidgetService, private widgetsService: WidgetsService, private nav: NavController) {

  }

  ngOnInit(): void {
    this.getInfos();
  }

  getInfos(): void {
    this.loading = true;
    this.dedicatedWidgetService.getInfos(this.serviceName)
      .then(resp => {
        this.server = resp;
        this.loading = false;
      })
      .catch(err => {
        this.error = err;
        this.loading = false;
      });
  }

  getTasks(): void {
    if (!this.tasksLoaded) {
      this.loading = true;
      this.dedicatedWidgetService.getTasks(this.serviceName)
        .then(tasks => {
          this.emptyTasks = tasks.length === 0;
          this.tasks = tasks;
        })
        .then(() => {
          this.tasksLoaded = true;
          this.loading = false;
        }, err => {
          this.error = err;
          this.loading = false;
        });
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes['reload'] && changes['reload'].currentValue !== changes['reload'].previousValue) {
      this.getInfos();
      this.tasksLoaded = false;
      if (this.viewMode === 'tasks') {
        this.getTasks();
      }
    }
  }

  openNetworkStateModal() {
    let profileModal = Modal.create(NetworkStateModal, { category: '5', categoryName: 'serveur dédié' });
    this.nav.present(profileModal);
  }

  removeMe(): void {
    let handler = () => this.remove.emit(this.serviceName);
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    this.nav.present(alert);
  }

  reboot(): void {
    let alert = Alert.create({
      title: 'Redémarrage',
      message: 'Voulez-vous redémarrer le serveur ' + this.serviceName,
      buttons: [
        {
          text: 'Non'
        },
        {
          text: 'Oui',
          handler: () => {
            this.loading = true;
            this.dedicatedWidgetService.reboot(this.serviceName)
              .then(
                () => this.loading = false,
                err => {
                  this.error = err;
                  this.loading = false;
                }
              );
          }
        }
      ]
    });

    this.nav.present(alert);
  }
}
