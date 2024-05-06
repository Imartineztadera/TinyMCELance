import { Component } from '@angular/core';
import tinymce from 'tinymce';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tinymce'; 
  lanceError : any;
  private lance : any;  
 
  configExternalPlugins(): any {
    return {
      lance: '../assets/tinymce/plugins/lance/plugin.min.js'
    };
  }

  configLance() : any {
    return {
      annotations: {
        idGenerator: (annotation : any) => {
          return ["id", Date.now() % 10000, String.fromCharCode(Math.round(Math.random() * 10 + 65))].join('-');
        },
        permissions: {
          "delete": "owner",
          edit: {
            last: "owner",
            default: "user",
          },
          resolve: {
            default: "owner"
          }
        },
        statusCallback: function (obj : any) { 
          obj.status.canEdit = true;
          obj.status.canResolve = true;
          obj.status.canDelete = true;
        },
        users: []
      },
      debug: {
        trace: false,
        debug: false,
        log: false,
        error: true,
        warn: false
      }
    };
  }

  getEditorConfiguration() : any {
    return {
      base_url: '/tinymce', 
      license_key: 'gpl',
      height: "100%", 
      external_plugins: this.configExternalPlugins(),     
      lance: this.configLance(),      
      extend_valid_elements: "annotation",
      setup: (editor : any) => {  
         editor.on('lance::init', (event : any) => {
          console.log("TinyMCE event: lance::init (editorconfigurator) ", event);
          this.lance = event.lance;
          const uiOptions = {
            owner :    this.lance.getAnnotations(),
            generateUI: true , 
            container: ".annotations-container"        
          };
          const ui =    this.lance.App.createAnnotationsUI({ type: "aligned"});
          ui.init(uiOptions); 
        });       
      },
    };
  }

  addComment(): void {
    const editor = tinymce.get('myEditor');
    if (editor) {
      const selection = editor.selection.getContent({ format: 'text' });
      const commentText = 'This is comment';
      if (selection) {
        try {
          this.lance.getAnnotations().addComment(1, 1, commentText);
        }
        catch (e) {
         this.lanceError = e;
        }
      } else {
        console.error('You have to select part of the editor text');
      }
    } else {
      console.error('TinyMCE was not found.');
    }
  }
}
