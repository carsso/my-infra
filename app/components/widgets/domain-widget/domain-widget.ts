import {Component, Input, EventEmitter, Output, OnChanges, OnInit, SimpleChange} from 'angular2/core';
import {IONIC_DIRECTIVES, Modal, NavController, Alert} from 'ionic-angular';
import {NetworkStateModal} from '../../../modals/network-state/network-state';
import {WidgetsService} from '../widgets.service';
import {DomainWidgetContentComponent} from './content/domain-widget-content';

@Component({
  selector: 'domain-widget',
  templateUrl: 'build/components/widgets/domain-widget/domain-widget.html',
  directives: [IONIC_DIRECTIVES, DomainWidgetContentComponent],
  providers: [WidgetsService]
})
export class DomainWidgetComponent {
  @Input() serviceName: string;
  @Input() reload: boolean;
  @Output() remove: EventEmitter<string> = new EventEmitter();
  viewMode: string = 'general';
  loading: boolean;

  constructor(private widgetsService: WidgetsService, private nav: NavController) {

  }

  openNetworkStateModal(): void {
    let profileModal = Modal.create(NetworkStateModal, { category: '1', categoryName: 'domaine' });
    this.nav.present(profileModal);
  }

  removeMe(): void {
    let handler = () => this.remove.emit(this.serviceName);
    let alert = this.widgetsService.getDeleteAlert(this.serviceName, handler);

    this.nav.present(alert);
  }
}
