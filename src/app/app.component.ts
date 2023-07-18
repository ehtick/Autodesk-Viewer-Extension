/// <reference types="forge-viewer" />
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TestExtension } from './test-extension';
import { DrawToolExtension } from './draw-tool-extension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('viewer') viewerContainer!: HTMLElement;

  title = 'viewer';
  
  private URN:string = '';
  private ACCESS_TOKEN:string = '';
  private viewer!: Autodesk.Viewing.GuiViewer3D;
  
  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    setInterval(() => {
      this.fetchToken().then(() => {
      });
    }, 30 * 60 * 1000);
  }

  ngAfterViewInit(): void {

    this.fetchToken().then(() => {
      const myViewerDiv = document.getElementById('MyViewerDiv')!;
      this.viewer = new Autodesk.Viewing.GuiViewer3D(myViewerDiv);
      var viewer = this.viewer;
      var options = {
        env: 'AutodeskProduction',
        api: 'streamingV2',
        getAccessToken: (onReadyToken:any) => {
          var token = this.ACCESS_TOKEN;
          var timeInSeconds = 60 * 30;
          onReadyToken(token, timeInSeconds);
        }
      }
    
      Autodesk.Viewing.Initializer(options, () => {
        var startedCode = this.viewer.start();
        if (startedCode > 0){
          console.error('Failed to create a Viewer: WebGL not supported.');
          return;
        } else {
          console.log('Viewer created');
          console.log(Autodesk.Viewing)

          //Loading the custom extensions
          Autodesk.Viewing.theExtensionManager.registerExtension('TestExtension', TestExtension);
          this.viewer.loadExtension('TestExtension');

          Autodesk.Viewing.theExtensionManager.registerExtension('DrawToolExtension', DrawToolExtension);
          this.viewer.loadExtension('DrawToolExtension');

          //Example of an event listener in the viewer
          this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => {
            console.log(event)
          })

          Autodesk.Viewing.Document.load(this.URN, (viewerDocument) => {
            const defaultModel = viewerDocument.getRoot().getDefaultGeometry();
            viewer.loadDocumentNode(viewerDocument, defaultModel);
        }, function(errorCode) {});
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }


  fetchToken():Promise<void> {

    const body = new HttpParams()
    .set('grant_type', 'client_credentials')
    .set('redirect_uri', 'http://localhost:4200')
    .set('scope', 'data:read');

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "Authorization": ""
    })
    
    return new Promise((resolve, reject) => {
    this.http.post("https://developer.api.autodesk.com/authentication/v2/token", body.toString(), { headers }).subscribe((data:any) => {
      this.ACCESS_TOKEN = data.access_token;
      resolve();
    }, (error:any) => {
      reject(error);
      })
    })
  }
  
}