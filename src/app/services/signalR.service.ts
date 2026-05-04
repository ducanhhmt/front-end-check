import * as signalR from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { NewsRealTimeSearchService } from './news-real-time-search.service';

@Injectable({
  providedIn: 'root'
})
export class signalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected: boolean = false;
  private isListenerRegistered = false; // ← thêm biến này

  constructor(private newsRealtimesearching: NewsRealTimeSearchService) { }
  async startConnection() {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7051/newsHub')
      .withAutomaticReconnect()
      .build();

    await this.hubConnection.start();
    this.isConnected = true;
    console.log('SignalR connected', this.hubConnection.connectionId);

    // Đăng ký listener ngay sau khi connect (chỉ 1 lần)
    if (!this.isListenerRegistered) {
      this.registerReceive();
      this.isListenerRegistered = true;
    }
  }

  async joinGroup(requestId: string) {
    await this.startConnection(); // đảm bảo đã connect
    await this.hubConnection.invoke('JoinGroup', requestId);
  }

  private registerReceive() {
    this.hubConnection.on('ReceiveResult', (data) => {
      console.log('Received data in service:', data);
      this.newsRealtimesearching.setNews(data);
      this.newsRealtimesearching.setLoading(false);
    });
  }

  // (tùy chọn) thêm phương thức để debug
  getConnectionId() {
    return this.hubConnection?.connectionId;
  }
}
